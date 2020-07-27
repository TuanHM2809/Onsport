import {
  Router
} from 'express'
import _ from 'lodash'
var Promise = require('bluebird')
const router = Router()
var Constant = require('../../../constants')
let platform = ['Web', 'Phone']

export default function (app) {
  router.get('/', async (req, res) => {
    let type = req.query.type && _.indexOf([Constant.POST_TYPE, Constant.FILE_TYPE], req.query.type) ? req.query.type : null
    let platformName = req.query.platform && platform.indexOf(req.query.platform) !== -1 ? req.query.platform : 'Web'

    // filter only video for platform app

    try {
      let condition = {
        deleted_at: null
      }

      if (platformName !== 'Web') {
        condition.status = 'PUBLISHED'
      }

      if (type !== null) {
        condition.type = type
      }
      let categories = await app.models.Category.findAll({
        attributes: {
          exclude: ['lft', 'rgt', 'parent_id']
        },
        where: condition,
        order: [
          ['lft', 'ASC']
        ]
      })

      if (platformName !== 'Web') {
        let listRemove = []
        if (categories) {
          await Promise.map(categories, async (category, index) => {
            let videos = await category.getVideos()
            if (videos.length < 1) {
              listRemove.push(category.id)
            }
          })
        }
        listRemove = new Set(listRemove)
        categories = categories.filter(category => !listRemove.has(category.id))
      }

      res.send(helper.sj(categories, req.status_token))
    } catch (error) {
      res.send(helper.ej(error, 500))
    }
  })

  router.get('/hasOrder', async (req, res) => {
    let type = req.query.type && _.indexOf([Constant.POST_TYPE, Constant.FILE_TYPE], req.query.type) ? req.query.type : null
    try {
      let condition = {
        deleted_at: null,
        status: 'PUBLISHED'
      }
      if (type !== null) {
        condition.type = type
      }
      let categories = await app.models.Category.findAll({
        attributes: {
          exclude: ['lft', 'rgt', 'parent_id', 'status', 'pinned_id', 'pinned_type']
        },
        where: condition,
        order: [
          ['lft', 'ASC']
        ]
      })

      let listRemove = []
      if (categories) {
        await Promise.map(categories, async (category, index) => {
          let videos = await category.getVideos()
          if (videos.length < 1) {
            listRemove.push(category.id)
          }
        })
      }

      listRemove = new Set(listRemove)
      categories = categories.filter(category => !listRemove.has(category.id))

      res.send(helper.sj(categories, req.status_token))
    } catch (error) {
      res.send(helper.ej(error, 500))
    }
  })

  router.get('/:categoryId', async (req, res) => {
    try {
      let type = req.query.type && _.indexOf([Constant.POST_TYPE, Constant.FILE_TYPE], req.query.type) ? req.query.type : null
      req.checkParams('categoryId', 'Mã danh mục không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let category = await app.models.Category.findOne({
        attributes: {
          exclude: ['lft', 'rgt', 'parent_id']
        },
        where: {
          slug: req.params.categoryId
        },
        include: [{
          association: 'children',
          attributes: {
            exclude: ['lft', 'rgt', 'parent_id']
          }
        }]
      })
      // if slug not found --> try it in Id
      if (category === null) {
        category = await app.models.Category.findOne({
          attributes: {
            exclude: ['lft', 'rgt', 'parent_id']
          },
          where: {
            id: req.params.categoryId
          },
          include: [{
            association: 'children',
            attributes: {
              exclude: ['lft', 'rgt', 'parent_id']
            }
          }]
        })
        if (category === null) {
          return res.send(helper.ej(null, 404, false, helper.MSG_404))
        }
      }
      if (category) {
        category = category.toJSON()
        if (category.children.length > 0) {
          category.children = await Promise.map(category.children, async categoryChild => {
            categoryChild = await getItems(app, req, categoryChild)
            categoryChild.item_type = Constant.CATEGORY_TYPE
            return categoryChild
          })
        } else {
          if (type !== null) {
            category = await getItems(app, req, category, type)
          } else {
            category = await getItems(app, req, category)
          }
        }
        let pagination = (category.hasOwnProperty('pagination')) ? category.pagination : null
        category = _.omit(category, ['pagination'])
        return res.send(helper.tj(category, pagination, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:categoryId/withEvent', async (req, res) => {
    try {
      let type = req.query.type && _.indexOf([Constant.POST_TYPE, Constant.FILE_TYPE, Constant.EVENT_TYPE], req.query.type) > -1 ? req.query.type : null // thang nao code truoc thieu > -1 nhe
      req.checkParams('categoryId', 'Mã danh mục không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let category = await app.models.Category.findOne({
        attributes: {
          exclude: ['lft', 'rgt', 'parent_id']
        },
        where: {
          slug: req.params.categoryId
        },
        include: [{
          association: 'children',
          attributes: {
            exclude: ['lft', 'rgt', 'parent_id']
          }
        }]
      })

      // if slug not found --> try it in Id
      if (category === null) {
        category = await app.models.Category.findOne({
          attributes: {
            exclude: ['lft', 'rgt', 'parent_id']
          },
          where: {
            id: req.params.categoryId
          },
          include: [{
            association: 'children',
            attributes: {
              exclude: ['lft', 'rgt', 'parent_id']
            }
          }]
        })
        if (category === null) {
          return res.send(helper.ej(null, 404, false, helper.MSG_404))
        }
      }
      if (category) {
        category = category.toJSON()
        if (category.children.length > 0) {
          category.children = await Promise.map(category.children, async categoryChild => {
            categoryChild = await getItemsWithEvent(app, req, categoryChild)
            categoryChild.item_type = Constant.CATEGORY_TYPE
            return categoryChild
          })
        } else {
          if (type !== null) {
            category = await getItemsWithEvent(app, req, category, type)
          } else {
            category = await getItemsWithEvent(app, req, category)
          }
        }
        let pagination = (category.hasOwnProperty('pagination')) ? category.pagination : null
        category = _.omit(category, ['pagination'])
        return res.send(helper.tj(category, pagination, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  return router
}

// Get Items
async function getItems (app, req, category, type = null) {
  let page = req.query.page ? parseInt(req.query.page) : 1
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
  let offset = pageSize * (page - 1)
  type = type !== null ? [type] : [Constant.POST_TYPE, Constant.FILE_TYPE]
  try {
    let items = await app.models.CategoryItem.findAndCountAll({
      where: {
        category_id: category.id,
        categoriable_type: {
          $in: type
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
        if (!listIds.hasOwnProperty(item.categoriable_type)) {
          listIds[item.categoriable_type] = []
        }
        if (listIds[item.categoriable_type].indexOf(item.categoriable_id) === -1) {
          listIds[item.categoriable_type].push(item.categoriable_id)
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
      data = _.map(data, categoriable => {
        categoriable = categoriable.toJSON()
        let item = {}
        switch (categoriable.categoriable_type) {
          case Constant.POST_TYPE:
            item = _.find(listIds[Constant.POST_TYPE], {
              'id': parseInt(categoriable.categoriable_id)
            })
            break
          case Constant.FILE_TYPE:
            item = _.find(listIds[Constant.FILE_TYPE], {
              'id': parseInt(categoriable.categoriable_id)
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
    category.items = tempArray
    category.pagination = pagination
    return category
  } catch (error) {
    console.log(error)
    return null
  }
}
// duplicate from get item and add event
async function getItemsWithEvent (app, req, category, type = null) {
  let page = req.query.page ? parseInt(req.query.page) : 1
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
  let offset = pageSize * (page - 1)
  let hasType = type !== null
  type = type !== null ? [type] : [Constant.POST_TYPE, Constant.FILE_TYPE, Constant.EVENT_TYPE]
  try {
    let items = await app.models.CategoryItem.findAndCountAll({
      where: {
        category_id: category.id,
        categoriable_type: {
          $in: type
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
      let listIds = []
      //  Filter Id And Type
      _.map(data, item => {
        if (!listIds.hasOwnProperty(item.categoriable_type)) {
          listIds[item.categoriable_type] = []
        }
        if (listIds[item.categoriable_type].indexOf(item.categoriable_id) === -1) {
          listIds[item.categoriable_type].push(item.categoriable_id)
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
          case Constant.EVENT_TYPE:
            let events = await getEventByIds(app, req, listIds[type])
            listIds[type] = events
            break
          default:
            break
        }
      })

      if (hasType) {
        tempArray = _.concat(listIds[Constant.POST_TYPE], listIds[Constant.FILE_TYPE], listIds[Constant.EVENT_TYPE])
      } else {
        // Map data - k comment gi cả.không hiểu gì chỗ này
        data = _.map(data, categoriable => {
          let item = {}
          switch (categoriable.categoriable_type) {
            case Constant.POST_TYPE:
              item = _.find(listIds[Constant.POST_TYPE], {
                'id': parseInt(categoriable.categoriable_id)
              })
              break
            case Constant.FILE_TYPE:
              item = _.find(listIds[Constant.FILE_TYPE], {
                'id': parseInt(categoriable.categoriable_id)
              })
              break
            case Constant.EVENT_TYPE:
              item = _.find(listIds[Constant.EVENT_TYPE], {
                'id': parseInt(categoriable.categoriable_id)
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
    }
    category.items = _.compact(tempArray)
    category.pagination = pagination
    return category
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
        where: { // if video has no cate, it will be abadond
          status: {
            $ne: 'DRAFT'
          }
        },
        required: true
        // required: false
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

// Get Events By Ids
async function getEventByIds (app, req, ids) {
  try {
    let exclude = ['updated_at', 'deleted_at', 'link']
    let events = await app.models.Event.findAll({
      attributes: {
        exclude: exclude
      },
      where: {
        id: {
          $in: ids
        },
        status: 'PUBLISHED',
        deleted_at: null,
        $or: [{
          show_at: {
            $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
          }
        },
        {
          show_at: null
        }
        ]
      },
      include: [{
        association: 'categories',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug'],
        where: { // if video has no cate, it will be abadond
          status: {
            $ne: 'DRAFT'
          }
        },
        // required: true
        required: false // cause livestream do not need to hide
      }],
      order: [
        ['start_at', 'desc'],
        ['id', 'desc']
      ]
    })
    events = events.map(function (event) {
      event = event.toJSON()
      return Object.assign({}, event, {
        item_id: event.id,
        item_type: Constant.EVENT_TYPE_RESPONSE
      })
    })
    return events
  } catch (error) {
    console.log(error)
    return null
  }
}
