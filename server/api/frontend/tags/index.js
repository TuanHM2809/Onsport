import {
  Router
} from 'express'
import _ from 'lodash'
const router = Router()
var Promise = require('bluebird')
var Constant = require('../../../constants')

export default (app) => {
  router.get('/', async (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
    let offset = pageSize * (page - 1)
    try {
      let tags = await app.models.Tag.findAndCountAll({
        attributes: ['id', 'name', 'slug', 'created_at'],
        limit: pageSize,
        offset: offset,
        order: [
          ['id', 'DESC']
        ]
      })
      let p = tags.count
      let pages = Math.ceil(p / pageSize)
      let pagination = {
        page: page,
        pageSize: pageSize,
        rowCount: p,
        pageCount: pages,
        itemLeft: (p - page * pageSize) > 0 ? (p - page * pageSize) : 0,
        pageLeft: (pages - page) > 0 ? (pages - page) : 0
      }
      return res.send(helper.tj({
        'tags': (tags.count > 0 ? tags.rows : null)
      }, pagination, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/multi', async (req, res) => {
    try {
      if (typeof req.query.id === 'undefined') {
        return res.send(helper.ej('Tag ID không được bỏ trống', 400, false, 'Tag ID không được bỏ trống'))
      }

      // return res.send(req.query.id.length)

      let ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id]

      let tags = await app.models.Tag.findAll({
        attributes: ['id', 'name', 'slug'],
        where: {
          id: {
            $in: ids
          }
        }
      })

      // return res.send(tags)

      if (tags !== []) {
        // tags = tags.toJSON()
        let tagIds = _.map(tags, tag => tag.id)
        // return res.send(tagIds)
        tags = await getItemsByTagIds(app, req, tagIds)
        let pagination = tags.pagination
        let items = tags.items
        return res.send(helper.tj(items, pagination, req.status_token))
      } else {
        return res.send(helper.ej(null, 404, false, helper.MSG_404))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:tagId', async (req, res) => {
    try {
      req.checkParams('tagId', 'Tag id không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let tag = await app.models.Tag.findOne({
        attributes: ['id', 'name', 'slug'],
        where: {
          slug: req.params.tagId
        }
      })
      if (tag === null) {
        tag = await app.models.Tag.findOne({
          attributes: ['id', 'name', 'slug'],
          where: {
            id: req.params.tagId
          }
        })
        if (tag === null) {
          return res.send(helper.ej(null, 404, false, helper.MSG_404))
        }
      }
      if (tag !== null) {
        tag = tag.toJSON()
        tag = await getItems(app, req, tag)
        let pagination = tag.pagination
        tag = _.omit(tag, ['pagination'])
        return res.send(helper.tj(tag, pagination, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.post('/follow', async (req, res) => {
    if (!req.user) {
      return res.send(helper.ej(helper.MSG_403, 403, false, helper.MSG_403))
    }
    try {
      let tag_ids_follow = req.body.tag_ids_follow && Array.isArray(req.body.tag_ids_follow) && req.body.tag_ids_follow.every(t => Number.isInteger(t)) ? req.body.tag_ids_follow : null
      let tag_ids_unfollow = req.body.tag_ids_unfollow && Array.isArray(req.body.tag_ids_unfollow) && req.body.tag_ids_unfollow.every(t => Number.isInteger(t)) ? req.body.tag_ids_unfollow : null
      // if (!tag_ids) {
      //   return res.send(helper.ej('Dữ liệu không hợp lệ', 400, false, 'Dữ liệu không hợp lệ'))
      // }
      let user = req.user
      if (tag_ids_follow) {
        await Promise.all(_.map(tag_ids_follow, async t => {
          let user_tag = await app.models.UserTag.findOrCreate({
            where: {
              tag_id: t,
              user_id: user.id
            },
            defaults: {
              tag_id: t,
              user_id: user.id
            }
          })
        }))
      }
      if (tag_ids_unfollow) {
        await Promise.all(_.map(tag_ids_unfollow, async t => {
          let user_tag = await app.models.UserTag.findOne({
            where: {
              tag_id: t,
              user_id: user.id
            }
          })
          if (user_tag) {
            await user_tag.destroy()
          }
        }))
      }
      return res.send(helper.sj(null, req.status_token, 'Cập nhật thành công '))
    } catch (error) {
      console.log(error)
      return res.send(helper.ej(error, 500))
    }
  })
  return router
}

async function createOrDelete (app, tag_id, user) {
  let tag = await app.models.UserTag.findOne({
    where: {
      tag_id: tag_id,
      user_id: user.id
    }
  })
  if (tag) {
    await tag.destroy()
  } else {
    await app.models.UserTag.create({
      tag_id: tag_id,
      user_id: user.id
    })
  }
}

async function getItems (app, req, tag) {
  let page = req.query.page ? parseInt(req.query.page) : 1
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
  let offset = pageSize * (page - 1)
  try {
    let items = await app.models.ItemTag.findAndCountAll({
      where: {
        tag_id: tag.id,
        taggable_type: {
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
        if (!listIds.hasOwnProperty(item.taggable_type)) {
          listIds[item.taggable_type] = []
        }
        if (listIds[item.taggable_type].indexOf(item.taggable_id) === -1) {
          listIds[item.taggable_type].push(item.taggable_id)
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
      data = _.map(data, tagItem => {
        tagItem = tagItem.toJSON()
        let item = {}
        switch (tagItem.taggable_type) {
          case Constant.POST_TYPE:
            item = _.find(listIds[Constant.POST_TYPE], {
              'id': parseInt(tagItem.taggable_id)
            })
            break
          case Constant.FILE_TYPE:
            item = _.find(listIds[Constant.FILE_TYPE], {
              'id': parseInt(tagItem.taggable_id)
            })
            break
          default:
            break
        }
        if (item !== 'undefined' && !_.isEmpty(item)) {
          tempArray.push(item)
        }
        return tagItem
      })
    }
    tag.items = tempArray
    tag.pagination = pagination
    return tag
  } catch (error) {
    console.log(error)
    return null
  }
}

async function getItemsByTagIds (app, req, tagIds) {
  let page = req.query.page ? parseInt(req.query.page) : 1
  let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
  let offset = pageSize * (page - 1)
  try {
    let items = await app.models.ItemTag.findAndCountAll({
      where: {
        tag_id: {
          $in: tagIds
        },
        taggable_type: {
          $in: [Constant.POST_TYPE, Constant.FILE_TYPE]
        }
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
        if (!listIds.hasOwnProperty(item.taggable_type)) {
          listIds[item.taggable_type] = []
        }
        if (listIds[item.taggable_type].indexOf(item.taggable_id) === -1) {
          listIds[item.taggable_type].push(item.taggable_id)
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
      data = _.map(data, tagItem => {
        tagItem = tagItem.toJSON()
        let item = {}
        switch (tagItem.taggable_type) {
          case Constant.POST_TYPE:
            item = _.find(listIds[Constant.POST_TYPE], {
              'id': parseInt(tagItem.taggable_id)
            })
            break
          case Constant.FILE_TYPE:
            item = _.find(listIds[Constant.FILE_TYPE], {
              'id': parseInt(tagItem.taggable_id)
            })
            break
          default:
            break
        }
        if (item !== 'undefined' && !_.isEmpty(item)) {
          tempArray.push(item)
        }
        return tagItem
      })
    }
    let tags = {}
    tags.items = tempArray
    tags.pagination = pagination
    return tags
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
      },
      {
        association: 'Tags',
        through: {
          attributes: []
        },
        attributes: [],
        where: {
          status: {
            $ne: 'DRAFT'
          }
        },
        // required: true
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
        where: { // if video has no cate, it will be abadond
          status: {
            $ne: 'DRAFT'
          }
        },
        // required: true,
        required: false
      },
      {
        association: 'Tags',
        through: {
          attributes: []
        },
        attributes: [],
        where: {
          status: {
            $ne: 'DRAFT'
          }
        },
        // required: true
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
