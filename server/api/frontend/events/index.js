import { Router } from 'express'
import moment from 'moment'
import axios from 'axios'
import _ from 'lodash'
var Constant = require('../../../constants')
const getStream = require('../../../libs/get-stream')
const router = Router()

export default (app) => {
  router.get('/', async (req, res) => {
    let results
    try {
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15

      let count = await app.models.Event.count({
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [
            {
              show_at: {
                $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
              }
            },
            {
              show_at: null
            }
          ]
        }
      })
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

      let exclude = ['updated_at', 'deleted_at']
      if (!req.user) { // require loggin to view link
        exclude = exclude.concat(['link'])
      }

      results = await app.models.Event.findAll({
        attributes: { exclude: exclude },
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [
            {
              show_at: {
                $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
              }
            },
            {
              show_at: null
            }
          ]
        },
        order: [
          ['id', 'desc'],
          ['start_at', 'desc']
        ],
        limit: pageSize,
        offset: offset,
        raw: true
      })

      if (results && results.length > 0) {
        // results = results.toJSON()
        results = results.map(event => {
          return Object.assign({}, event, {
            item_id: event.id,
            item_type: Constant.EVENT_TYPE_RESPONSE
          })
        })
        return res.send(helper.tj(results, pagination, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (e) {
      console.log(e)
      return res.send(helper.ej(e, 500))
    }
  })

  router.get('/:eventId', async (req, res) => {
    try {
      req.checkParams('eventId', 'Mã sự kiện không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let client = await require('../../../config/client')
      let event = null
      let exclude = ['updated_at', 'deleted_at']

      if (client) {
        event = await client.getAsync(`event_${req.params.eventId}`)
        if (event) {
          event = JSON.parse(event)
        } else {
          // let exclude = ['updated_at', 'deleted_at']
          event = await app.models.Event.findOne({ // kiem tra slug
            where: {
              slug: req.params.eventId,
              status: 'PUBLISHED',
              deleted_at: null,
              $or: [
                {
                  show_at: {
                    $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
                  }
                },
                {
                  show_at: null
                }
              ]
            },
            attributes: { exclude: exclude }
          })
          if (event === null) { // neu k thi kiem tra id
            event = await app.models.Event.findOne({
              where: {
                id: req.params.eventId,
                status: 'PUBLISHED',
                deleted_at: null
              },
              attributes: { exclude: exclude }
            })
          }
          if (event !== null) { // neu event co thi parse json
            event = event.toJSON()
            client.set(`event_${req.params.eventId}`, JSON.stringify(event), 'EX', 60 * 60 * 24 * 10)
          }
        }
      } else {
        event = await app.models.Event.findOne({
          where: {
            slug: req.params.eventId,
            status: 'PUBLISHED',
            deleted_at: null,
            $or: [
              {
                show_at: {
                  $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
                }
              },
              {
                show_at: null
              }
            ]
          },
          attributes: { exclude: exclude }
        })
        if (event === null) {
          event = await app.models.Event.findOne({
            where: {
              id: req.params.eventId,
              status: 'PUBLISHED',
              deleted_at: null
            },
            attributes: { exclude: exclude }
          })
          if (event === null) {
            return res.send(helper.ej('', 404, false, helper.MSG_404))
          }
        } else {
          event = event.toJSON()
        }
      }

      if (event) {
        // event = event.toJSON()
        if (!req.user) { // chua co user va yeu cau dang nhap
          event.link = null
        } else {
          // Đang bỏ qua check user.
          if (event.link_type === 'STREAM') {
            if (
              event &&
              event.link !== null &&
              event.link !== ''
            ) {
              if (event.start_catchup) {
                // b1: neu thoi gian hien tai >  thoi gian end_catchup
                const startCatchup = process.env.NODE_ENV === 'production' ? moment.utc(event.start_catchup).subtract(7, 'hours') : moment.utc(event.start_catchup)
                const endCatchup = process.env.NODE_ENV === 'production' ? moment.utc(event.end_catchup).subtract(7, 'hours') : moment.utc(event.end_catchup)
                const now = moment.utc()
                const pureLink = event.link.split('?')[0]
                if (now.isAfter(endCatchup)) {
                  event.link = `${pureLink}?startTime=${startCatchup.unix()}&stopTime=${endCatchup.unix()}`
                }
                // khong co buoc 2
              }
              // Lay user id

              if (event.link.indexOf('?startTime') > -1) {
                event.link = event.link + '&signKey=' + getStream(event.link, req.user.id)
              } else {
                event.link = event.link + '?signKey=' + getStream(event.link, req.user.id)
              }
              event.fullUrl = event.link
            }
          } else if (event.link_type === 'VIDEO') {
            // neu video thi them fullUrl
            if (isHttpLink(event.link)) {
              // neu link la http --> link ben ngoai --> de nguyen
              if (isControlLink(event.link)) {
                event.fullUrl = event.link.replace(/(http|https):\/\/control.onsports.vn/, process.env.CDN_URL) + '/playlist.m3u8?signKey=' + getStream(event.link, req.user.id)
              } else {
                event.fullUrl = event.link
              }
            } else {
            
              let l = event.link
              l = l.replace('nas/', '')
              l = l.replace('.mp4', '')
              event.fullUrl = `${process.env.CDN_URL2}/${encodeURI(l)}/index.m3u8`
              
              //   event.fullUrl = `${process.env.CDN_URL}/${encodeURI(event.link)}/playlist.m3u8?signKey=` + getStream(event.link, req.user.id)

              //hot fix when cdn is dead
              // event.fullUrl = `http://static.onsports.vn/${encodeURI(event.link)}/playlist.m3u8?signKey=` + getStream(event.link, req.user.id)
            }

            // xoa link video

            event.link = event.fullUrl
          }
        }

        event.item_id = event.id
        event.item_type = Constant.EVENT_TYPE_RESPONSE
        event.type = Constant.EVENT_TYPE_RESPONSE
        event.related = await getRelatedEvent(app, req, exclude)
        return res.send(helper.sj(event, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  return router
}

function isHttpLink(link) {
  const pattern = new RegExp('^(http|https)')
  return pattern.test(link)
}
function isControlLink(link) {
  return link.includes('://control.onsports.vn')
}

async function getRelatedEvent(app, req, exclude) {
  try {
    let client = await require('../../../config/client')

    let related = []
    if (client) {
      // kiem tra trong dedit 12 thang moi nhat

      related = await client.getAsync('event_related')

      if (related) {
        related = JSON.parse(related)
      } else {
        related = await app.models.Event.findAll({
          attributes: { exclude: exclude },
          order: [
            ['id', 'DESC']
          ],
          where: {
            status: 'PUBLISHED',
            deleted_at: null,
            $or: [
              {
                show_at: {
                  $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
                }
              },
              {
                show_at: null
              }
            ]
          },
          limit: 12
        })
        client.set('event_related', JSON.stringify(related), 'EX', 60 * 60 * 24)
        related = related.map(event => event.toJSON())
      }
    } else {
      related = await app.models.Event.findAll({
        attributes: { exclude: exclude },
        order: [
          ['id', 'DESC']
        ],
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [
            {
              show_at: {
                $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
              }
            },
            {
              show_at: null
            }
          ]
        },
        limit: 12
      })
      related = related.map(event => event.toJSON())
    }

    related = _.map(related, event => {
      // event = event.toJSON()
      event = Object.assign({}, event, {
        item_type: Constant.EVENT_TYPE_RESPONSE,
        item_id: event.id
      })
      return event
    })
    return related
  } catch (error) {
    console.log(error)
    return null
  }
}
