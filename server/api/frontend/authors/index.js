import {
  Router
} from 'express'
import _ from 'lodash'
const router = Router()
var Constant = require('../../../constants')
var Promise = require('bluebird')
// let authorTypes = {
//   'videos': 'file', // association:item_type
//   'posts': 'article',
//   'galleries': 'gallery'
// }

export default (app) => {
  router.get('/', async (req, res) => {
    try {
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15
      let count = await app.models.Author.count()
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
      let authors = await app.models.Author.findAll({
        limit: pageSize,
        offset: offset
      })
      if (authors.length > 0) {
        return res.send(helper.tj(authors, pagination, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:authorId', async (req, res) => {
    try {
      req.checkParams('authorId', 'Mã tác giả không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let author = await app.models.Author.findOne({
        where: {
          slug: req.params.authorId
        }
      })
      if (author === null) {
        author = await app.models.Author.findOne({
          where: {
            id: req.params.authorId
          }
        })
        if (author === null) {
          return res.send(helper.ej('', 404, false, helper.MSG_404))
        }
      }
      if (author) {
        author = author.toJSON()
        author = await getItems(app, req, author)
        let pagination = author.pagination
        author = _.omit(author, ['pagination'])
        return res.send(helper.tj(author, pagination, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })
  return router
}

async function getItems (app, req, author) {
  let page = req.query.page ? parseInt(req.query.page) : 1
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
  let offset = pageSize * (page - 1)
  try {
    let items = await app.models.Authorable.findAndCountAll({
      where: {
        author_id: author.id,
        authorable_type: {
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
        if (!listIds.hasOwnProperty(item.authorable_type)) {
          listIds[item.authorable_type] = []
        }
        if (listIds[item.authorable_type].indexOf(item.authorable_id) === -1) {
          listIds[item.authorable_type].push(item.authorable_id)
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
      data = _.map(data, authorable => {
        authorable = authorable.toJSON()
        let item = {}
        switch (authorable.authorable_type) {
          case Constant.POST_TYPE:
            item = _.find(listIds[Constant.POST_TYPE], {
              'id': parseInt(authorable.authorable_id)
            })
            break
          case Constant.FILE_TYPE:
            item = _.find(listIds[Constant.FILE_TYPE], {
              'id': parseInt(authorable.authorable_id)
            })
            break
          default:
            break
        }
        if (item !== 'undefined' && !_.isEmpty(item)) {
          tempArray.push(item)
        }
      })
    }
    author.items = tempArray
    author.pagination = pagination
    return author
  } catch (error) {
    console.log(error)
    return null
  }
}

// Get News By Ids
async function getNewsByIds (app, req, ids) {
  try {
    let items = await app.models.Post.findAll({
      attributes: ['id', 'post_type', 'slug', 'title', 'status', 'breaking_news', 'featured', 'thumbnail', 'short_description', 'created_at', 'date'],
      where: {
        id: {
          $in: ids
        },
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
        id: {
          $in: ids
        },
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
