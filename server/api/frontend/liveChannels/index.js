import {
  Router
} from 'express'
import _ from 'lodash'
import moment from 'moment'
const router = Router()
const Constant = require('../../../constants')
const getStream = require('../../../libs/get-stream')
const Promise = require('bluebird')

export default app => {
  router.get('/', async (req, res) => {
    try {
      let page =
        req.query.page &&
        parseInt(req.query.page) &&
        parseInt(req.query.page) > 0
        ? parseInt(req.query.page)
        : 1
      let pageSize =
        req.query.pageSize &&
        parseInt(req.query.pageSize) &&
        parseInt(req.query.pageSize) > 0
        ? parseInt(req.query.pageSize)
        : 15
      // Cộng sẵn  7 tiếng, lượng vào sửa
      let startAt =
        req.query.start_date &&
        moment(req.query.start_date).isValid('YYYY-MM-DD')
        ? moment(req.query.start_date).format('YYYY-MM-DD 00:00:00')
        : moment
            .utc()
            .add(7, 'hours')
            .format('YYYY-MM-DD 00:00:00')
      let endAt =
        req.query.end_date && moment(req.query.end_date).isValid('YYYY-MM-DD')
        ? moment(req.query.end_date).format('YYYY-MM-DD 23:59:59')
        : moment
            .utc()
            .add(7, 'hours')
            .format('YYYY-MM-DD 23:59:59')
      let count = await getTotalLiveChannel()
      // Get data
      let pages = Math.ceil(count / pageSize)
      let offset = pageSize * (page - 1)
      let pagination = {
        page: page,
        pageSize: pageSize,
        rowCount: count,
        pageCount: pages,
        itemLeft: count - page * pageSize >= 0 ? count - page * pageSize : 0,
        pageLeft: pages - page >= 0 ? pages - page : 0
      }
      var liveChannels = []
      if (count > 0) {
        let filterOptions = {
          offset: offset,
          pageSize: pageSize,
          page: page
        }
        liveChannels = await getListChannel(filterOptions)
        await Promise.map(liveChannels, async channel => {
          var fetchData = await Promise.all([
            getScheduleByTime(channel, startAt, endAt),
            // getCurrentProgram(channel),
            null,
            getLike(channel, req.user ? req.user : null)
          ])
          channel.schedules = fetchData[0]
          channel.live_program = fetchData[1]
          channel.likes = fetchData[2].count
          channel.isLike = fetchData[2].isLike
          channel.sport = null
          channel.tournament = null
          if (req.user) {
            if (channel && channel.link !== null && channel.link !== '') {
              // Lay user id
              if (channel.link.indexOf('?startTime') > -1) {
                channel.link =
                  channel.link +
                  '&signKey=' +
                  getStream(channel.link, req.user.id)
              } else {
                channel.link =
                  channel.link +
                  '?signKey=' +
                  getStream(channel.link, req.user.id)
              }
            }
          } else {
            channel.link = null
          }
          channel.type = Constant.LIVECHANNEL_TYPE
          channel = _.omit(channel, ['Tags', 'status'])
          return channel
        }, {
          concurrency: 5
        })
      }
      return res.send({
        code: 0,
        data: liveChannels,
        pagination: pagination,
        message: helper.MSG_SUCCESS,
        now: new Date().toString(),
        status_token: req.status_token
        // timezone: (new Date()).getTimezoneOffset()
      })
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:liveChannelId', async (req, res) => {
    try {
      req
        .checkParams('liveChannelId', 'Không đúng định dạng liveChannelId')
        .notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(
          helper.ej(result.array()[0].msg, 400, false, result.array()[0].msg)
        )
      }
      // Cộng sẵn  7 tiếng, lượng vào sửa
      let startAt =
        req.query.start_date &&
        moment(req.query.start_date).isValid('YYYY-MM-DD')
        ? moment(req.query.start_date).format('YYYY-MM-DD 00:00:00')
        : moment
            .utc()
            .add(7, 'hours')
            .format('YYYY-MM-DD 00:00:00')
      let endAt =
        req.query.end_date && moment(req.query.end_date).isValid('YYYY-MM-DD')
        ? moment(req.query.end_date).format('YYYY-MM-DD 23:59:59')
        : moment
            .utc()
            .add(7, 'hours')
            .format('YYYY-MM-DD 23:59:59')
      let filterOptions = {
        key: req.params.liveChannelId,
        start_at: startAt,
        end_at: endAt
      }
      let liveChannel = await getLiveChannelByKey(filterOptions)
      if (liveChannel) {
        var fetchData = await Promise.all([
          getScheduleByTime(liveChannel, startAt, endAt),
          // getCurrentProgram(channel),
          null,
          getLike(liveChannel, req.user ? req.user : null)
        ])
        liveChannel.schedules = fetchData[0]
        liveChannel.live_program = fetchData[1]
        liveChannel.likes = fetchData[2].count
        liveChannel.isLike = fetchData[2].isLike
        liveChannel.sport = null
        liveChannel.tournament = null
        if (req.user) {
          if (liveChannel && liveChannel.link !== null && liveChannel.link !== '') {
            // Lay user id
            if (liveChannel.link.indexOf('?startTime') > -1) {
              liveChannel.link =
                liveChannel.link +
                '&signKey=' +
                getStream(liveChannel.link, req.user.id)
            } else {
              liveChannel.link =
                liveChannel.link +
                '?signKey=' +
                getStream(liveChannel.link, req.user.id)
            }
          }
        } else {
          liveChannel.link = null
        }
        liveChannel.type = Constant.LIVECHANNEL_TYPE
        liveChannel = _.omit(liveChannel, ['Tags', 'status'])
      }
      return res.send(helper.sj(liveChannel, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  async function getTotalLiveChannel () {
    let client = await require('../../../config/client')
    let count = 0
    let cacheKey = 'total_live_channel'
    if (client) {
      count = await getTotalLiveChannelFromCache(client, cacheKey)
    } else {
      count = await getTotalLiveChannelFromDb()
    }
    return count
  }

  async function getTotalLiveChannelFromCache (redis, cacheKey) {
    let count = await redis.getAsync(cacheKey)
    if (!count) {
      count = await getTotalLiveChannelFromDb()
      redis.set(cacheKey, count, 'EX', 60 * 60)
    }
    return count
  }

  async function getTotalLiveChannelFromDb () {
    let count = await app.models.LiveChannel.count({
      where: {
        status: 'PUBLISHED',
        deleted_at: null
      }
    })
    return count
  }

  async function getLiveChannelByKey (filterOptions) {
    let client = await require('../../../config/client')
    let liveChannel = null
    let cacheKey = `live_channel_${filterOptions.key}`
    if (client) {
      liveChannel = await getLiveChannelByKeyFromCache(client, cacheKey, filterOptions)
    } else {
      liveChannel = await getLiveChannelByKeyFromDB(filterOptions)
    }
    return liveChannel
  }

  async function getLiveChannelByKeyFromCache (redis, cacheKey, filterOptions) {
    let liveChannel = await redis.getAsync(cacheKey)
    if (liveChannel) {
      liveChannel = JSON.parse(liveChannel)
    } else {
      liveChannel = await getLiveChannelByKeyFromDB(filterOptions)
      redis.set(cacheKey, JSON.stringify(liveChannel), 'EX', 60 * 60)
    }
    return liveChannel
  }

  async function getLiveChannelByKeyFromDB (filterOptions) {
    var liveChannel = await app.models.LiveChannel.findOne({
      attributes: {
        exclude: ['updated_at', 'published', 'visible', 'deleted_at']
      },
      where: {
        slug: filterOptions.key,
        status: 'PUBLISHED',
        deleted_at: null
      }
    })
    if (liveChannel === null) {
      liveChannel = await app.models.LiveChannel.findOne({
        attributes: {
          exclude: ['updated_at', 'published', 'visible', 'deleted_at']
        },
        where: {
          id: filterOptions.key,
          status: 'PUBLISHED',
          deleted_at: null
        }
      })
    }
    liveChannel = liveChannel.toJSON()
    return liveChannel
  }

  async function getListChannel (filterOptions) {
    let client = await require('../../../config/client')
    let liveChannels = null
    let cacheKey = `live_channels_page_${filterOptions.page}_pageSize_${filterOptions.pageSize}`
    if (client) {
      liveChannels = await getLiveChannelFromCache(client, cacheKey, filterOptions)
    } else {
      liveChannels = await getListChannelFromDb(filterOptions)
    }
    return liveChannels
  }

  async function getLiveChannelFromCache (redis, cacheKey, filterOptions) {
    let liveChannels = await redis.getAsync(cacheKey)
    if (liveChannels) {
      liveChannels = JSON.parse(liveChannels)
    } else {
      liveChannels = await getListChannelFromDb(filterOptions)
      redis.set(cacheKey, JSON.stringify(liveChannels), 'EX', 60 * 60)
    }
    return liveChannels
  }

  async function getListChannelFromDb (filterOptions) {
    let exclude = ['updated_at', 'published', 'visible', 'deleted_at']
    let include = []
    let liveChannels = await app.models.LiveChannel.findAll({
      attributes: {
        exclude: exclude
      },
      where: {
        status: 'PUBLISHED',
        deleted_at: null
      },
      include: include,
      order: [
        ['id', 'asc']
      ],
      limit: filterOptions.pageSize,
      offset: filterOptions.offset
    })

    if (liveChannels && liveChannels.length > 0) {
      liveChannels = _.map(liveChannels, liveChannel => {
        return liveChannel.toJSON()
      })
    }
    return liveChannels
  }

  async function getScheduleByTime (channel, startAt, endAt) {
    let schedules = []
    let client = await require('../../../config/client')
    let cacheKey = `schedule_live_channel_${channel.id}_start_${moment(startAt).unix()}_end_${moment(endAt).unix()}`
    if (client) {
      schedules = await getScheduleByTimeFromCache(channel, startAt, endAt, client, cacheKey)
    } else {
      schedules = await getScheduleByTimeFromDb(channel, startAt, endAt)
    }
    return schedules
  }

  async function getScheduleByTimeFromCache (channel, startAt, endAt, redis, cacheKey) {
    let schedules = await redis.getAsync(cacheKey)
    if (schedules) {
      schedules = JSON.parse(schedules)
    } else {
      schedules = await getScheduleByTimeFromDb(channel, startAt, endAt)
      redis.set(cacheKey, JSON.stringify(schedules), 'EX', 60 * 60)
    }
    return schedules
  }

  async function getScheduleByTimeFromDb (channel, startAt, endAt) {
    let schedules = await app.models.LiveChannelSchedule.findAll({
      where: {
        live_channel_id: channel.id,
        start_at: {
          $gte: startAt,
          $lte: endAt
        }
      },
      attributes: ['id', 'title', 'start_at', 'end_at', 'thumbnail'],
      order: [
        ['start_at', 'asc']
      ]
    })

    if (schedules && schedules.length > 0) {
      schedules = _.map(schedules, schedule => {
        schedule = schedule.toJSON()
        schedule.sport = null
        schedule.tournament = null
        return schedule
      })
    }
    return schedules
  }

  async function getCurrentProgram (channel) {
    let live_program = null
    let client = await require('../../../config/client')
    let cacheKey = `current_program_channel_${channel.id}_startAt_`
    if (client) {
      live_program = await getCurrentProgramFromCache(channel, client, cacheKey)
    } else {
      live_program = await getCurrentProgramFromDb(channel)
    }
    return live_program
  }

  async function getCurrentProgramFromCache (channel, redis, cacheKey) {
    let live_program = await redis.getAsync(cacheKey)
    if (live_program) {
      live_program = JSON.parse(live_program)
    } else {
      live_program = await getCurrentProgramFromDb(channel)
      redis.set(cacheKey, JSON.stringify(live_program), 'EX', 60 * 60)
    }
    return live_program
  }

  async function getCurrentProgramFromDb (channel) {
    let live_program = await app.models.LiveChannelSchedule.findOne({
      where: {
        live_channel_id: channel.id,
        start_at: {
          $lte: app.models.sequelize.literal(
            'DATE_ADD(NOW(), INTERVAL 7 HOUR)'
          )
        },
        end_at: {
          $gte: app.models.sequelize.literal(
            'DATE_ADD(NOW(), INTERVAL 7 HOUR)'
          )
        }
      },
      attributes: ['id', 'title', 'start_at', 'end_at', 'thumbnail'],
      order: [
        ['start_at', 'desc']
      ]
    })

    if (live_program) {
      live_program = live_program.toJSON()
      live_program.sport = null
      live_program.tournament = null
    }
    return live_program
  }

  async function getLike (channel, user = null) {
    let client = await require('../../../config/client')
    let cacheKey = `count_like_channel_${channel.id}`
    let likes = []
    let isLike = false
    if (client) {
      likes = await getLikeFromCache(channel, client, cacheKey)
    } else {
      likes = await getLikeFromDb(channel)
    }
    if (user) {
      if (_.some(likes, {
        user_id: user.id
      })) {
        isLike = true
      }
    }

    return {
      count: likes.length,
      isLike: isLike
    }
  }

  async function getLikeFromCache (channel, redis, cacheKey) {
    let likes = await redis.getAsync(cacheKey)
    if (likes) {
      likes = JSON.parse(likes)
    } else {
      likes = await getLikeFromDb(channel)
      redis.set(cacheKey, JSON.stringify(likes), 'EX', 60 * 60)
    }
    return likes
  }

  async function getLikeFromDb (channel, user) {
    let likes = await app.models.ItemLike.findAll({
      where: {
        item_type: Constant.LIVECHANNEL_TYPE,
        item_id: channel.id
      }
    })
    if (likes && likes.length > 0) {
      likes = _.map(likes, like => {
        return like.toJSON()
      })
    }
    return likes
  }

  return router
}
