import {
  Router
} from 'express'
import _ from 'lodash'
const router = Router()
var Constant = require('../../../constants')
var Promise = require('bluebird')
// let punditTypes = {
//   'videos': 'file', // association:item_type
//   'posts': 'post',
//   'galleries': 'gallery'
// }

export default (app) => {
  router.get('/', async (req, res) => {
    try {
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15
      let count = await app.models.Pundit.count()
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
      let pundits = await app.models.Pundit.findAll({
        limit: pageSize,
        offset: offset,
        order: [
          ['id', 'DESC']
        ]
      })
      if (pundits.length > 0) {
        return res.send(helper.tj(pundits, pagination, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:punditId', async (req, res) => {
    try {
      req.checkParams('punditId', 'Pundit id không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }

      let pundit = await app.models.Pundit.findOne({
        where: {
          slug: req.params.punditId
        }
      })
      if (pundit === null) {
        pundit = await app.models.Pundit.findOne({
          where: {
            id: req.params.punditId
          }
        })
        if (pundit === null) {
          return res.send(helper.ej(null, 404, false, helper.MSG_404))
        }
      }
      if (pundit) {
        pundit = pundit.toJSON()
        pundit = await getItems(app, req, pundit)
        let pagination = pundit.pagination
        pundit = _.omit(pundit, ['pagination'])
        return res.send(helper.tj(pundit, pagination, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })
  return router
}

async function getItems (app, req, pundit) {
  let page = req.query.page ? parseInt(req.query.page) : 1
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
  let offset = pageSize * (page - 1)
  try {
    let items = await app.models.Punditable.findAndCountAll({
      where: {
        pundit_id: pundit.id,
        punditable_type: {
          $in: [Constant.POST_TYPE, Constant.FILE_TYPE]
        },
        status: true
      },
      limit: pageSize,
      offset: offset,
      order: [
        ['id', 'DESC']
      ]
    })
    let data = items.rows
    let p = items.count
    let pages = Math.ceil(p / pageSize)
    let pagination = {
      page: page,
      pageSize: pageSize,
      rowCount: p,
      pageCount: pages,
      itemLeft: (p - page * pageSize) > 0 ? (p - page * pageSize) : 0,
      pageLeft: (pages - page) > 0 ? (pages - page) : 0
    }
    // Check and get data
    let tempArray = []
    if (items.count > 0) {
      let listIds = {}
      //  Filter Id And Type
      _.map(data, item => {
        if (!listIds.hasOwnProperty(item.punditable_type)) {
          listIds[item.punditable_type] = []
        }
        if (listIds[item.punditable_type].indexOf(item.punditable_id) === -1) {
          listIds[item.punditable_type].push(item.punditable_id)
        }
      })
      // Get Item by Ids
      await Promise.map(Object.keys(listIds), async type => {
        switch (type) {
          case Constant.POST_TYPE:
            let posts = await getNewsByIds(app, req, listIds[type])
            listIds[type] = posts
            break
          case Constant.FILE_TYPE:
            let videos = await getVideoByIds(app, req, listIds[type])
            listIds[type] = videos
            break
          default:
            break
        }
      })
      // Map data
      data = _.map(data, punditable => {
        punditable = punditable.toJSON()
        let item = {}
        switch (punditable.punditable_type) {
          case Constant.POST_TYPE:
            item = _.find(listIds[Constant.POST_TYPE], {
              'id': parseInt(punditable.punditable_id)
            })
            break
          case Constant.FILE_TYPE:
            item = _.find(listIds[Constant.FILE_TYPE], {
              'id': parseInt(punditable.punditable_id)
            })
            break
          default:
            break
        }
        if (item !== 'undefined' && !_.isEmpty(item)) {
          tempArray.push(item)
        }
        return punditable
      })
    }
    pundit.items = tempArray
    pundit.pagination = pagination
    return pundit
  } catch (error) {
    console.log(error)
    return null
  }
}

// Get News By Ids
async function getNewsByIds (app, req, ids) {
  try {
    let items = await app.models.Post.findAll({
      attributes: ['id', 'post_type', 'slug', 'title', 'status', 'breaking_news', 'featured', 'thumbnail', 'short_description', 'created_at'],
      where: {
        status: 'PUBLISHED',
        deleted_at: null,
        id: {
          $in: ids
        },
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
        association: 'pundit',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug'],
        required: false
      },
      {
        association: 'author',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug'],
        required: false
      },
      {
        association: 'categories',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug'],
        required: false
      }
      ],
      order: [
        ['id', 'DESC']
      ]
    })
    items = items.map(function (post) {
      post = post.toJSON()
      post.name = post.title
      post.pundit = (post.pundit.length > 0) ? post.pundit[0] : null
      post.author = (post.author.length > 0) ? post.author[0] : null
      post.category = (post.categories.length > 0) ? post.categories[0] : null
      post.item_id = post.id
      post.item_type = Constant.POST_TYPE_RESPONSE
      post = _.omit(post, ['categories'])
      return post
    })
    return items
  } catch (error) {
    console.log(error)
    return null
  }
}

// Get Videos By Ids
async function getVideoByIds (app, req, ids) {
  try {
    let videos = await app.models.File.findAll({
      attributes: ['id', 'name', 'slug', 'status', 'metadata', 'thumbnail', 'duration', 'created_at'],
      where: {
        status: 'PUBLISHED',
        deleted_at: null,
        id: {
          $in: ids
        },
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
        association: 'type',
        where: {
          name: Constant.VIDEO_TYPE
        },
        required: true
      },
      {
        association: 'pundit',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug'],
        required: false
      }, {
        association: 'author',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug'],
        required: false
      },
      {
        association: 'categories',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug'],
        required: false
      }
      ],
      order: [
        ['id', 'DESC']
      ]
    })
    videos = videos.map(function (video) {
      video = video.toJSON()
      video.type = Constant.FILE_TYPE
      video.item_id = video.id
      video.item_type = Constant.VIDEO_TYPE
      if (!video.thumbnail) {
        video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
      }
      if (!video.duration) {
        video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
      }
      video.pundit = (video.pundit.length > 0) ? video.pundit[0] : null
      video.author = (video.author.length > 0) ? video.author[0] : null
      video.category = (video.categories.length > 0) ? video.categories[0] : null
      return video
    })
    return videos
  } catch (error) {
    console.log(error)
    return null
  }
}
