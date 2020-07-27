import {
  Router
} from 'express'
import axios from 'axios'
import _ from 'lodash'
const getStream = require('../../../libs/get-stream')
var Constant = require('../../../constants')
const router = Router()

export default function (app) {
  // return router
  router.get('/', async (req, res) => {
    try {
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15
      let sportId = req.query.sport_id ? parseInt(req.query.sport_id) : ''
      let tournamentId = req.query.tournament_id ? parseInt(req.query.tournament_id) : ''
      let listTagId = []
      var sport, tournament
      if (sportId !== '') {
        try {
          sport = await app.models.Sport.findOne({
            where: {
              id: sportId
            },
            include: [{
              association: 'tags',
              attributes: ['id'],
              required: true
            }, {
              association: 'tournaments',
              required: true,
              include: [{
                association: 'tags',
                attributes: ['id'],
                required: true
              }]
            }]
          })
          sport.tags.forEach(item => {
            listTagId.push(item.id)
          })
          sport.tournaments.forEach(tour => {
            tour.tags.forEach(tag => {
              listTagId.push(tag.id)
            })
          })
        } catch (error) {
          console.log(error)
        }
      }
      if (tournamentId !== '') {
        try {
          tournament = await app.models.Tournament.findOne({
            where: {
              id: tournamentId
            },
            include: [{
              association: 'tags',
              attributes: ['id'],
              required: true
            }]
          })
          listTagId = []
          tournament.tags.forEach(item => {
            listTagId.push(item.id)
          })
        } catch (error) {
          console.log(error)
        }
      }
      // Init include data for select or count data
      let include = [{
        // Check type file
        association: 'type',
        where: {
          name: Constant.VIDEO_TYPE
        },
        required: true
      }]
      // Filter data by Tour and Sport
      if (listTagId.length > 0 || (sportId !== '' || tournamentId !== '')) {
        include.push({
          association: 'Tags',
          through: {
            where: {
              tag_id: {
                $in: listTagId
              }
            },
            attributes: []
          },
          where: { // if video has no tag, it will be ignore
            status: {
              $ne: 'DRAFT'
            }
          },
          required: true
        })
      } else {
        include.push({
          association: 'Tags',
          through: {
            attributes: []
          },
          include: [{
            association: 'sports',
            through: {
              attributes: []
            },
            attributes: ['id', 'name']
          }, {
            association: 'tournaments',
            through: {
              attributes: []
            },
            attributes: ['id', 'name']
          }],
          where: { // if video has no tag, it will be ignore
            status: {
              $ne: 'DRAFT'
            }
          },
          required: true
        })
      }
      //Get pagination data
      let p = await getTotalVideo(app, include)
      let pages = Math.ceil(p / pageSize)
      let offset = pageSize * (page - 1)
      let pagination = {
        page: page,
        pageSize: pageSize,
        rowCount: p,
        pageCount: pages,
        itemLeft: (p - page * pageSize) > 0 ? (p - page * pageSize) : 0,
        pageLeft: pages - page
      }

      // Get Data
      include.push({
        association: 'likes',
        attributes: ['id', 'user_id']
      })
      Array.prototype.push.apply(include, [{
        model: app.models.Pundit,
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        },
        as: 'pundit'
      },
      {
        model: app.models.Category,
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        },
        as: 'categories',
        where: { // if video has no cate, it will be abadond
          status: {
            $ne: 'DRAFT'
          }
        },
        required: true
      },
      {
        model: app.models.Author,
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        },
        as: 'author'
      }
      ])
      let videos = await getVideos(app, include, pageSize, offset)
      // Processing after select
      if (videos.length > 0) {
        videos = videos.map(function (video) {
          let isLike = false
          if (req.user) {
            if (_.some(video.likes, {
              user_id: req.user.id
            })) {
              isLike = true
            }
          }
          // 'id', 'title', 'description', 'created_at', 'thumbnail', 'type'
          if (!video.hasOwnProperty('id')) {
            video = video.toJSON()
          }
          video.isLike = isLike
          video.likes = video.likes.length
          video.type = Constant.FILE_TYPE
          video.title = video.name
          video.description = video.content
          if (!video.duration) {
            video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
          }
          if (!video.thumbnail) {
            video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
          }
          if (sport) {
            // sport = sport.toJSON()
            video.sport = _.pick(sport, ['id', 'name'])
          } else {
            video.sport = null
          }
          if (tournament) {
            // tournament = tournament.toJSON()
            video.tournament = _.pick(tournament, ['id', 'name'])
          } else {
            video.tournament = null
          }
          if (listTagId.length === 0) {
            _.map(video.Tags, tag => {
              if (tag.sports.length > 0) {
                video.sport = tag.sports[0]
              }
              if (tag.tournaments.length > 0) {
                video.tournament = tag.tournaments[0]
              }
            })
          }
          video.tags = video.Tags
          video = _.omit(video, ['content', 'Tags', 'metadata', 'url'])
          video.item_id = video.id
          video.item_type = Constant.FILE_TYPE
          return video
        })
        return res.send(helper.tj(videos, pagination, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // return router
  router.get('/getVideoByCategory/:categoryId', async (req, res) => {
    try {
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15
      req.checkParams('categoryId', 'Category Id không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      // Init include data for select or count data
      let include = [{
        association: 'type',
        where: {
          name: Constant.VIDEO_TYPE
        },
        required: true
      },
      {
        model: app.models.Category,
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        },
        as: 'categories',
        where: { // if video has no cate, it will be abadond
          id: req.params.categoryId,
          status: {
            $ne: 'DRAFT'
          },
          deleted_at: null
        },
        required: true
      },
      {
        association: 'Tags',
        through: {
          attributes: []
        },
        include: [{
          association: 'sports',
          through: {
            attributes: []
          },
          attributes: ['id', 'name']
        },
        {
          association: 'tournaments',
          through: {
            attributes: []
          },
          attributes: ['id', 'name']
        }
        ],
        where: { // if video has no tag, it will be ignore
          status: {
            $ne: 'DRAFT'
          },
          deleted_at: null
        },
        required: true
      }
      ]

      //Get pagination data
      let p = await app.models.File.count({
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [{
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          }
          ]
        },
        include: include,
        distinct: true,
        col: 'id'
      })

      let pages = Math.ceil(p / pageSize)
      let offset = pageSize * (page - 1)
      let pagination = {
        page: page,
        pageSize: pageSize,
        rowCount: p,
        pageCount: pages,
        itemLeft: (p - page * pageSize) > 0 ? (p - page * pageSize) : 0,
        pageLeft: pages - page
      }

      // console.log('page' + pageSize)

      // Get Data
      include.push({
        association: 'likes',
        attributes: ['id', 'user_id']
      })
      Array.prototype.push.apply(include, [{
        model: app.models.Pundit,
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        },
        as: 'pundit'
      },
      {
        model: app.models.Author,
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        },
        as: 'author'
      }
      ])
      let videos = await app.models.File.findAll({
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [{
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          }
          ]
        },
        include: include,
        // attributes: ['id', 'name', 'slug', 'content', 'created_at', 'metadata', 'status', 'thumbnail'],
        order: [
          ['id', 'DESC']
        ]
        // limit: pageSize,
        // offset: offset
      })
      // Processing after select
      let videosFactory
      if (videos.length > 0) {
        //cai nay chan deo chiu dc
        videosFactory = videos.slice(offset, offset + pageSize)

        videosFactory = videosFactory.map(function (video) {
          let isLike = false
          if (req.user) {
            if (_.some(video.likes, {
              user_id: req.user.id
            })) {
              isLike = true
            }
          }
          // 'id', 'title', 'description', 'created_at', 'thumbnail', 'type'
          video = video.toJSON()
          video.isLike = isLike
          video.likes = video.likes && video.likes.length ? video.likes.length : 0
          video.type = Constant.FILE_TYPE
          video.title = video.name
          video.description = video.content
          if (!video.thumbnail) {
            video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
          }
          if (!video.duration) {
            video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
          }
          video.sport = null
          video.tournament = null
          if (video.Tags.length > 0) {
            _.map(video.Tags, tag => {
              if (tag.sports.length > 0) {
                video.sport = tag.sports[0]
              }
              if (tag.tournaments.length > 0) {
                video.tournament = tag.tournaments[0]
              }
            })
          }
          video.tags = video.Tags
          video = _.omit(video, ['content', 'Tags', 'metadata', 'url'])
          video.item_id = video.id
          video.item_type = Constant.FILE_TYPE
          return video
        })
        return res.send(helper.tj(videosFactory, pagination, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // Search VOD
  router.get('/search', async (req, res) => {
    let keyword = req.query.keyword ? req.query.keyword : ''
    let page = req.query.page ? parseInt(req.query.page) : 1
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
    let offset = pageSize * (page - 1)
    try {
      let options = {
        type: app.models.sequelize.QueryTypes.SELECT,
        model: app.models.File
      }
      let total = await app.models.sequelize.query(`SELECT count(distinct files.id) as count FROM files JOIN file_types on file_types.id = files.file_type_id WHERE file_types.name='${Constant.VIDEO_TYPE}' and status = true and deleted_at IS NULL and MATCH(files.name,files.content) AGAINST('${keyword}')`, {
        type: app.models.sequelize.QueryTypes.SELECT
      })
      let listId = await app.models.sequelize.query(`SELECT files.id FROM files JOIN file_types on file_types.id = files.file_type_id WHERE file_types.name='${Constant.VIDEO_TYPE}' and status = true and deleted_at IS NULL and MATCH(files.name,files.content) AGAINST('${keyword}') ORDER BY files.id DESC LIMIT ${pageSize} OFFSET ${offset}`, options)
      // Include Tag
      listId = _.map(listId, 'id')
      let include = [{
        association: 'Tags',
        through: {
          attributes: []
        },
        include: [{
          association: 'sports',
          through: {
            attributes: []
          },
          attributes: ['id', 'name']
        }, {
          association: 'tournaments',
          through: {
            attributes: []
          },
          attributes: ['id', 'name']
        }],
        where: {
          status: {
            $ne: 'DRAFT'
          }
        },
        required: true
      },
      {
        association: 'likes',
        attributes: ['id', 'user_id']
      },
      {
        association: 'type',
        where: {
          name: Constant.VIDEO_TYPE
        },
        required: true
      }
      ]
      let videos = await app.models.File.findAll({
        where: {
          id: {
            $in: listId
          }
        },
        include: include,
        attributes: ['id', 'name', 'slug', 'content', 'created_at', 'metadata', 'status', 'thumbnail', 'duration'],
        order: [
          ['id', 'DESC']
        ]
      })
      if (videos.length > 0) {
        videos = videos.map(function (video) {
          let isLike = false
          if (req.user) {
            if (_.some(video.likes, {
              user_id: req.user.id
            })) {
              isLike = true
            }
          }
          video = video.toJSON()
          video.isLike = isLike
          video.likes = video.likes.length
          video.type = Constant.FILE_TYPE
          video.title = video.name
          video.description = video.content
          if (!video.thumbnail) {
            video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
          }
          if (!video.duration) {
            video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
          }
          video.sport = null
          video.tournament = null
          if (video.Tags.length > 0) {
            _.map(video.Tags, tag => {
              if (tag.sports.length > 0) {
                video.sport = tag.sports[0]
              }
              if (tag.tournaments.length > 0) {
                video.tournament = tag.tournaments[0]
              }
            })
          }
          video.tags = video.Tags.map(t => {
            return {
              id: t.id,
              name: t.name,
              slug: t.slug
            }
          })
          video = _.omit(video, ['name', 'content', 'Tags', 'metadata', 'url'])
          video.item_id = video.id
          video.item_type = Constant.FILE_TYPE
          return video
        })
      }
      // Pagination
      let p = total[0].count
      let pages = Math.ceil(p / pageSize)
      let pagination = {
        page: page,
        pageSize: pageSize,
        rowCount: p,
        pageCount: pages,
        itemLeft: (p - page * pageSize) > 0 ? (p - page * pageSize) : 0,
        pageLeft: (pages - page) > 0 ? (pages - page) : 0
      }
      return res.send(helper.sj({
        keyword: keyword,
        items: videos,
        pagination: pagination
      }, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // Chưa sửa.
  router.get('/:videoId', async (req, res) => {
    try {
      req.checkParams('videoId', 'Video Id không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }

      let client = await require('../../../config/client')
      let video = null
      let attributes = ['id', 'name', 'slug', 'content', 'created_at', 'metadata', 'status', 'url', 'is_free', 'thumbnail', 'duration']

      let include = [{
        // Check type file
        association: 'type',
        where: {
          name: Constant.VIDEO_TYPE
        },
        required: true
      },
      {
        association: 'Tags',
        through: {
          attributes: []
        },
        include: [{
          association: 'sports',
          through: {
            attributes: []
          },
          attributes: ['id', 'name']
        }, {
          association: 'tournaments',
          through: {
            attributes: []
          },
          attributes: ['id', 'name']
        }],
        where: { // if video has no cate, it will be abadond
          status: {
            $ne: 'DRAFT'
          }
        },
        required: true
        // required: false
      },
      {
        association: 'likes',
        attributes: ['id', 'user_id']
      },
      {
        association: 'categories',
        attributes: ['id', 'name', 'slug'],
        through: {
          attributes: []
        },
        where: { // if video has no cate, it will be abadond
          status: {
            $ne: 'DRAFT'
          }
        },
        required: true
      }
      ]

      if (client) {
        // get trong redis
        video = await client.getAsync(`video_${req.params.videoId}`)
        if (video) { // neu co thi parse ra
          video = JSON.parse(video)
        } else { // khong co thi ta tim no
          video = await app.models.File.findOne({
            attributes: attributes,
            where: {
              slug: req.params.videoId,
              status: 'PUBLISHED',
              deleted_at: null
            },
            include: include
          })
          if (video === null) {
            video = await app.models.File.findOne({
              attributes: attributes,
              where: {
                id: req.params.videoId,
                status: 'PUBLISHED',
                deleted_at: null
              },
              include: include
            })
          }
          if (video === null) {
            return res.send(helper.ej(null, 404, false, helper.MSG_404))
          } else {
            video = video.toJSON()
            client.set(`video_${req.params.videoId}`, JSON.stringify(video), 'EX', 60 * 60 * 24 * 30)
          }
        }
      } else {
        // tu tim trong db
        video = await app.models.File.findOne({
          attributes: attributes,
          where: {
            slug: req.params.videoId,
            status: 'PUBLISHED',
            deleted_at: null
          },
          include: include
        })

        if (video === null) {
          video = await app.models.File.findOne({
            attributes: attributes,
            where: {
              id: req.params.videoId,
              status: 'PUBLISHED',
              deleted_at: null
            },
            include: include
          })
        }
        if (video === null) {
          return res.send(helper.ej(null, 404, false, helper.MSG_404))
        } else {
          video = video.toJSON()
        }
      }

      if (video) {
        let isLike = false
        if (req.user) {
          if (_.some(video.likes, {
            user_id: req.user.id
          })) {
            isLike = true
          }
        }
        video.isLike = isLike
        video.likes = video.likes.length
        video.type = Constant.FILE_TYPE
        video.title = video.name
        // add video full url
        if (isHttpLink(video.url)) {
          video.fullUrl = video.url
        } else {
          //TuanHM
            let l = video.url
            l = l.replace('nas/', '')
            l = l.replace('.mp4', '')
           video.fullUrl = `${process.env.CDN_URL2}/${encodeURI(l)}/index.m3u8`
         
        }
        if (req.user === null || video.is_free === false) {
          delete video.url
          delete video.fullUrl
        }
        if (req.user) {
          video.video = video.url
        }
        video.description = video.content
        if (!video.thumbnail) {
          video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
        }
        if (!video.duration) {
          video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
        }
        video.sport = null
        video.tournament = null
        if (video.Tags.length > 0) {
          _.map(video.Tags, tag => {
            if (tag.sports.length > 0) {
              video.sport = tag.sports[0]
            }
            if (tag.tournaments.length > 0) {
              video.tournament = tag.tournaments[0]
            }
          })
        }
        video.tags = video.Tags.map(t => {
          return {
            id: t.id,
            name: t.name,
            slug: t.slug
          }
        })
        video.related = await getRelatedVideo(app, req, attributes)
        video = _.omit(video, ['name', 'content', 'Tags', 'metadata'])
        return res.send(helper.sj(video, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  return router
}

function isHttpLink (link) {
  const pattern = new RegExp('^(http|https)')
  return pattern.test(link)
}

async function getRelatedVideo (app, req, attributes) {
  try {
    let client = await require('../../../config/client')
    let related = []
    if (client) {
      // get trong redis 12 thang moi nhat
      related = await client.getAsync('video_related')
      if (related) {
        related = JSON.parse(related)
      } else {
        related = await app.models.File.findAll({
          attributes: attributes,
          order: [
            ['id', 'DESC']
          ],
          where: {
            status: 'PUBLISHED',
            deleted_at: null,
            $or: [{
              date: {
                $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
              }
            },
            {
              date: null
            }
            ]
          },
          include: [{
            // Check type file
            association: 'type',
            where: {
              name: Constant.VIDEO_TYPE
            },
            required: true
          },
          {
            association: 'Tags',
            through: {
              attributes: []
            },
            include: [{
              association: 'sports',
              through: {
                attributes: []
              },
              attributes: ['id', 'name']
            }, {
              association: 'tournaments',
              through: {
                attributes: []
              },
              attributes: ['id', 'name']
            }],
            where: { // if video has no cate, it will be abadond
              status: {
                $ne: 'DRAFT'
              }
            },
            required: true
          },
          {
            association: 'likes',
            attributes: ['id', 'user_id']
          },
          {
            association: 'categories',
            attributes: ['id', 'name', 'slug'],
            through: {
              attributes: []
            },
            where: { // if video has no cate, it will be abadond
              status: {
                $ne: 'DRAFT'
              }
            },
            required: true
          }
          ],
          limit: 12
        })
        client.set('video_related', JSON.stringify(related), 'EX', 60 * 60 * 24)
        related = related.map(video => video.toJSON())
      }
    } else {
      related = await app.models.File.findAll({
        attributes: attributes,
        order: [
          ['id', 'DESC']
        ],
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [{
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          }
          ]
        },
        include: [{
          // Check type file
          association: 'type',
          where: {
            name: Constant.VIDEO_TYPE
          },
          required: true
        },
        {
          association: 'Tags',
          through: {
            attributes: []
          },
          include: [{
            association: 'sports',
            through: {
              attributes: []
            },
            attributes: ['id', 'name']
          }, {
            association: 'tournaments',
            through: {
              attributes: []
            },
            attributes: ['id', 'name']
          }],
          where: { // if video has no cate, it will be abadond
            status: {
              $ne: 'DRAFT'
            }
          },
          required: true
        },
        {
          association: 'likes',
          attributes: ['id', 'user_id']
        },
        {
          association: 'categories',
          attributes: ['id', 'name', 'slug'],
          through: {
            attributes: []
          },
          where: { // if video has no cate, it will be abadond
            status: {
              $ne: 'DRAFT'
            }
          },
          required: true
        }
        ],
        limit: 12
      })
      related = related.map(video => video.toJSON())
    }
    related = _.map(related, video => {
      let isLike = false
      if (req.user) {
        if (_.some(video.likes, {
          user_id: req.user.id
        })) {
          isLike = true
        }
      }
      // video = video.toJSON()
      video.isLike = isLike
      video.likes = video.likes.length
      video.type = Constant.FILE_TYPE
      video.title = video.name
      video.description = video.content

      if (!video.thumbnail) {
        video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
      }
      if (!video.duration) {
        video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
      }

      video.sport = null
      video.tournament = null
      if (video.Tags.length > 0) {
        _.map(video.Tags, tag => {
          if (tag.sports.length > 0) {
            video.sport = tag.sports[0]
          }
          if (tag.tournaments.length > 0) {
            video.tournament = tag.tournaments[0]
          }
        })
      }
      video.item_id = video.id
      video.item_type = Constant.FILE_TYPE
      return _.omit(video, ['name', 'content', 'Tags', 'metadata'])
    })

    // related = _.filter(related, video => video.slug !== req.params.videoId)
    return related
  } catch (error) {
    console.log(error)
    return null
  }
}

async function getTotalVideo (app, include) {
  var totalVideo = 0
  try {
    let client = await require('../../../config/client')
    if (client) {
      totalVideo = await client.getAsync('total_videos')
      if (totalVideo) {
        totalVideo = JSON.parse(totalVideo)
      } else {
        totalVideo = await app.models.File.count({
          where: {
            status: 'PUBLISHED',
            deleted_at: null,
            $or: [{
              date: {
                $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
              }
            },
            {
              date: null
            }
            ]
          },
          include: include,
          distinct: true,
          col: 'id'
        })
        client.set('total_videos', JSON.stringify(totalVideo), 'EX', 60 * 60)
      }
    } else {
      totalVideo = await app.models.File.count({
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [{
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          }
          ]
        },
        include: include,
        distinct: true,
        col: 'id'
      })
    }
  } catch (error) {
    console.log(error)
  }
  return totalVideo
}

async function getVideos (app, include, pageSize, offset) {
  var videos = []
  try {
    let client = await require('../../../config/client')
    if (client) {
      videos = await client.getAsync(`videos_offset_${offset}_limit_${pageSize}`)
      if (videos) {
        videos = JSON.parse(videos)
      } else {
        videos = await app.models.File.findAll({
          where: {
            status: 'PUBLISHED',
            deleted_at: null,
            $or: [{
              date: {
                $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
              }
            },
            {
              date: null
            }
            ]
          },
          include: include,
          attributes: ['id', 'name', 'slug', 'content', 'created_at', 'metadata', 'status', 'thumbnail', 'duration'],
          order: [
            ['id', 'DESC']
          ],
          limit: pageSize,
          offset: offset
        })
        client.set(`videos_offset_${offset}_limit_${pageSize}`, JSON.stringify(videos), 'EX', 60 * 60)
      }
    } else {
      videos = await app.models.File.findAll({
        where: {
          status: 'PUBLISHED',
          deleted_at: null,
          $or: [{
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          }
          ]
        },
        include: include,
        attributes: ['id', 'name', 'slug', 'content', 'created_at', 'metadata', 'status', 'thumbnail', 'duration'],
        order: [
          ['id', 'DESC']
        ],
        limit: pageSize,
        offset: offset
      })
    }
  } catch (error) {
    console.log(error)
  }
  return videos
}
