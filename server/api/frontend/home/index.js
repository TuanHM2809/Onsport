import {
  Router
} from 'express'
var Constant = require('../../../constants')
const router = Router()
var _ = require('lodash')
let platform = ['Web', 'Phone']
var Promise = require('bluebird')
export default (app) => {
  // router.get('/clear-cache', async (req, res) => {
  //   try {
  //     let client = await require('../../../config/client')
  //
  //     if (client && req.body.key === 'thewalkingdead') {
  //       let keys = await getKeySync(client, '*home*')
  //       await Promise.all(_.map(keys, k => {
  //         return client.del(k)
  //       }))
  //       return res.send(sj(null, 'Refresh Cache Successfully'))
  //     } else {
  //       return res.send('nothing')
  //     }
  //   } catch (e) {
  //     console.log(e)
  //     return res.send(helper.sj(null, 'Error flush cache'))
  //   }
  // })
  // List Gallery by Order
  router.get('/', async (req, res) => {
    try {
      let client = await require('../../../config/client')
      let platformName = req.query.platform && platform.indexOf(req.query.platform) !== -1 ? req.query.platform : 'Web'
      let responseData = null
      switch (platformName) {
        case 'Phone':
          if (client) {
            responseData = await client.getAsync('home_phone')
            if (responseData) {
              responseData = JSON.parse(responseData)
              return res.send(helper.sj(responseData, req.status_token))
            } else {
              responseData = await getItemPhone(req)
              client.set('home_phone', JSON.stringify(responseData), 'EX', 60 * 60)
              return res.send(helper.sj(responseData, req.status_token))
            }
          } else {
            responseData = await getItemPhone(req)
            return res.send(helper.sj(responseData, req.status_token))
          }
          break
        case 'Web':
        default:
          // let blockIds = req.query.blockIds ? req.query.blockIds : []
          if (client) {
            responseData = await client.getAsync('home_web')
            if (responseData) {
              responseData = JSON.parse(responseData)
              return res.send(helper.sj(responseData, req.status_token))
            } else {
              responseData = await getItemWeb(req, [])
              client.set('home_web', JSON.stringify(responseData), 'EX', 60 * 60)
              return res.send(helper.sj(responseData, req.status_token))
            }
          } else {
            responseData = await getItemWeb(req, [])
            return res.send(helper.sj(responseData, req.status_token))
          }
          break
      }
    } catch (e) {
      console.log(e)
      return res.send(helper.ej(e, 500))
    }
  })

  router.get('/video', async (req, res) => {
    try {
      // let platformName = req.query.platform && platform.indexOf(req.query.platform) !== -1 ? req.query.platform : 'Web'
      let client = await require('../../../config/client')
      let responseData = null

      if (client) {
        responseData = await client.getAsync('page_video')
        if (responseData) {
          responseData = JSON.parse(responseData)
          return res.send(helper.sj(responseData, req.status_token))
        } else {
          responseData = await getItemPage(req, 'video')
          client.set('page_video', JSON.stringify(responseData), 'EX', 60 * 60)
          return res.send(helper.sj(responseData, req.status_token))
        }
      } else {
        responseData = await getItemPage(req, 'video')
        return res.send(helper.sj(responseData, req.status_token))
      }

      // responseData = await getItemVideoPage(req)
      // return res.send(helper.sj(responseData, req.status_token))
    } catch (e) {
      console.log(e)
    }
  })

  router.get('/event', async (req, res) => {
    try {
      // let platformName = req.query.platform && platform.indexOf(req.query.platform) !== -1 ? req.query.platform : 'Web'
      let client = await require('../../../config/client')
      let responseData = null

      if (client) {
        responseData = await client.getAsync('page_event')
        if (responseData) {
          responseData = JSON.parse(responseData)
          return res.send(helper.sj(responseData, req.status_token))
        } else {
          responseData = await getItemPage(req, 'event')
          client.set('page_event', JSON.stringify(responseData), 'EX', 60 * 60)
          return res.send(helper.sj(responseData, req.status_token))
        }
      } else {
        responseData = await getItemPage(req, 'event')
        return res.send(helper.sj(responseData, req.status_token))
      }

      // responseData = await getItemVideoPage(req)
      // return res.send(helper.sj(responseData, req.status_token))
    } catch (e) {
      console.log(e)
    }
  })

  // Get Breaking News
  router.get('/breaking-news', async (req, res) => {
    try {
      let client = await require('../../../config/client')
      if (client) {
        let items = await client.getAsync(`home_breaking_news`)
        if (items) {
          items = JSON.parse(items)
          return res.send(helper.sj(items, req.status_token))
        } else {
          let items = await getBreakingNews(app)
          client.set('home_breaking_news', JSON.stringify(items), 'EX', 60 * 60 * 24)
          return res.send(helper.sj(items, req.status_token))
        }
      } else {
        let items = await getBreakingNews(app)
        return res.send(helper.sj(items, req.status_token))
      }
    } catch (error) {
      console.log(error)
      return res.send(helper.ej(error, 500))
    }
  })

  // Get Item In Web
  async function getItemWeb (req, blockIds) {
    try {
      let condition = {
        visible: true
      }
      if (blockIds.length > 0) {
        condition.id = {
          $in: blockIds
        }
      }
      let blocks = await app.models.ScreenBlock.findAll({
        where: condition,
        attributes: ['id', 'title', 'url', 'type'],
        include: [{
          association: 'screen_block_items',
          attributes: ['id', 'screen_block_id', 'item_id', 'item_type'],
          where: {
            visible: true
          },
          include: [{
            association: 'children',
            attributes: ['id', 'screen_block_id', 'item_id', 'item_type'],
            where: {
              visible: true
            },
            required: false
          }],
          required: false
        }],
        order: [
          ['lft', 'ASC'],
          ['screen_block_items', 'lft', 'ASC']
        ]
      })
      let listIds = {}
      blocks.map(block => {
        block.screen_block_items.map(blockItem => {
          if (!listIds.hasOwnProperty(blockItem.item_type)) {
            listIds[blockItem.item_type] = []
          }
          if (listIds[blockItem.item_type].indexOf(blockItem.item_id) === -1) {
            listIds[blockItem.item_type].push(blockItem.item_id)
          }
        })
      })
      let listItem = await getItemInList(req, listIds)
      blocks = blocks.map(block => {
        block = block.toJSON()
        let items = []
        block.screen_block_items = block.screen_block_items.map(blockItem => {
          let item = {}
          switch (blockItem.item_type) {
            case Constant.POST_TYPE:
              blockItem.item_type = Constant.POST_TYPE_RESPONSE
              item = _.find(listItem[Constant.POST_TYPE], {
                'id': blockItem.item_id
              })
              break
            case Constant.GALLERY_TYPE:
              item = _.find(listItem[Constant.GALLERY_TYPE], {
                'id': blockItem.item_id
              })
              break
            case Constant.FILE_TYPE:
              item = _.find(listItem[Constant.FILE_TYPE], {
                'id': blockItem.item_id
              })
              break
            case Constant.CATEGORY_TYPE:
              item = _.find(listItem[Constant.CATEGORY_TYPE], {
                'id': blockItem.item_id
              })
              break
            case Constant.EVENT_TYPE:
              item = _.find(listItem[Constant.EVENT_TYPE], {
                'id': blockItem.item_id
              })
              break
            default:
              break
          }
          if (item !== 'undefined' && !_.isEmpty(item)) {
            blockItem = Object.assign({}, blockItem, item)
            items.push(blockItem)
          }
        })
        block.screen_block_items = items
        block.name = block.title
        return block
      })
      return blocks
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // get items in page

  async function getItemPage (req, type = 'video') {
    // let pageType = type === 'video' ? Constant.VIDEO_TYPE_RESPONSE : Constant.EVENT_TYPE_RESPONSE

    try {
      let block = await app.models.PageBlock.findOne({
        where: {
          type: type
        },
        include: [{
          association: 'page_block_items',
          attributes: ['category_id'],
          where: {
            visible: true
          },
          include: [{
            association: 'category',
            attributes: ['id', 'name', 'slug']
          }]
        }],
        attributes: ['id', 'url', 'title', 'type'],
        order: [
          ['page_block_items', 'lft', 'ASC']
        ]
      })

      block = block.toJSON()

      block.page_block_items = await Promise.map(block.page_block_items, async blockItem => {
        blockItem = blockItem.category

        switch (type) {
          case 'video':
            blockItem.items = await getVideoByCategory(blockItem)
            break
          case 'event':
            blockItem.items = await getEventByCategory(blockItem)
            break
          default:
            blockItem.items = await getVideoByCategory(blockItem)
            break
        }

        return blockItem
      })

      return block
    } catch (e) {
      console.log(e)
      return null
    }
  }

  // Get Item In List
  async function getItemInList (req, listItem) {
    await Promise.map(Object.keys(listItem), async type => {
      switch (type) {
        case Constant.POST_TYPE:
          let posts = await getNewsByIds(req, listItem[type])
          listItem[type] = posts
          break
        case Constant.GALLERY_TYPE:
          let galleries = await getGalleryByIds(req, listItem[type])
          listItem[type] = galleries
          break
        case Constant.FILE_TYPE:
          let videos = await getVideoByIds(req, listItem[type])
          listItem[type] = videos
          break
        case Constant.CATEGORY_TYPE:
          let categories = await getCategoryByIds(req, listItem[type])
          listItem[type] = categories
          break
        case Constant.EVENT_TYPE:
          let event = await getEventByIds(req, listItem[type])
          listItem[type] = event
          break
        default:
          break
      }
    })
    return listItem
  }

  // Get News By Ids
  async function getNewsByIds (req, ids) {
    try {
      let items = await app.models.Post.findAll({
        attributes: ['id', 'post_type', 'slug', 'title', 'status', 'breaking_news', 'featured', 'thumbnail', 'short_description', 'short_title', 'created_at'],
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
          attributes: ['id', 'slug', 'name', 'avatar', 'bio'],
          required: false
        }],
        order: [
          ['id', 'DESC']
        ]
      })
      items = items.map(function (post) {
        post = post.toJSON()
        post.name = post.title
        post.type = Constant.POST_TYPE_RESPONSE
        post.pundit = (post.pundit.length > 0) ? post.pundit[0] : null
        return post
      })
      return items
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // Get Videos By Ids
  async function getVideoByIds (req, ids) {
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
          attributes: ['id', 'name', 'slug', 'avatar', 'bio'],
          required: false
        }
        ],
        order: [
          ['id', 'DESC']
        ]
      })
      videos = videos.map(function (video) {
        video = video.toJSON()
        video.type = video.type.name
        video.pundit = (video.pundit.length > 0) ? video.pundit[0] : null
        if (!video.thumbnail) {
          video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
        }
        if (!video.duration) {
          video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
        }
        return video
      })
      return videos
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // get event by ids

  async function getEventByIds (req, ids) {
    try {
      let events = await app.models.Event.findAll({
        attributes: ['id', 'name', 'slug', 'description', 'status', 'thumbnail', 'start_catchup', 'end_catchup', 'link_type', 'show_at', 'start_at'],
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
        order: [
          ['id', 'DESC']
        ]
      })
      events = events.map(function (event) {
        event = event.toJSON()
        event.type = Constant.EVENT_TYPE_RESPONSE
        return event
      })
      return events
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // Get Gallery By Ids
  async function getGalleryByIds (req, ids) {
    try {
      let galleries = await app.models.Gallery.findAll({
        attributes: ['id', 'title', 'slug', 'content', 'thumbnail', 'created_at'],
        where: {
          id: {
            $in: ids
          },
          status: 'PUBLISHED',
          deleted_at: null
        }
      })
      galleries = galleries.map(function (gallery) {
        gallery = gallery.toJSON()
        gallery.name = gallery.title
        gallery.short_description = gallery.content
        return gallery
      })
      return galleries
    } catch (error) {
      console.log(error)
      return null
    }
  }

  // Get Category By Ids
  async function getCategoryByIds (req, ids) {
    try {
      let categories = await app.models.Category.findAll({
        // attributes: ['id', 'name', 'slug', 'type', 'pinned_id'],
        where: {
          id: {
            $in: ids
          },
          deleted_at: null
        },
        order: [
          ['lft', 'DESC']
        ]
      })
      if (categories.length > 0) {
        categories = await Promise.map(categories, async category => {
          category = category.toJSON()
          category.children = await getPostByCategory(category)
          return category
        })
      }
      return categories
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async function getPostByCategory (category) {
    try {
      let pinTop = null
      let pinItems = []
      if (category.pinned_id !== null && category.pinned_id !== '') {
        pinTop = await app.models.Post.findOne({
          attributes: ['id', 'post_type', 'slug', 'title', 'status', 'breaking_news', 'featured', 'thumbnail', 'short_description', 'short_title'],
          where: {
            id: category.pinned_id,
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
          }
        })
        pinTop = pinTop.toJSON()
        pinTop.name = pinTop.title
        pinTop.type = Constant.POST_TYPE_RESPONSE
        pinItems.push(pinTop.id)
      }
      let items = await app.models.Post.findAll({
        attributes: ['id', 'post_type', 'slug', 'title', 'status', 'breaking_news', 'featured', 'thumbnail', 'short_description', 'short_title'],
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
          ],
          id: {
            $notIn: pinItems
          }
        },
        include: [{
          attributes: [],
          association: 'categories',
          through: {
            attributes: [],
            where: {
              category_id: category.id
            }
          },
          required: true
        }],
        distinct: true,
        col: 'id',
        order: [
          ['featured', 'DESC'],
          ['id', 'DESC']
        ],
        limit: 3,
        offset: 0
      })
      let posts = []
      if (pinTop !== null) {
        posts.push(pinTop)
      }
      items.forEach(function (post) {
        post = post.toJSON()
        post.name = post.title
        post.item_id = post.id
        post.item_type = Constant.POST_TYPE_RESPONSE
        // post = _.omit(post, ['categories'])
        posts.push(post)
      })
      return posts
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async function getVideoByCategory (category) {
    try {
      let videos = await app.models.File.findAll({
        attributes: ['id', 'name', 'slug', 'status', 'metadata', 'thumbnail', 'duration', 'content', 'created_at'],
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
          association: 'type',
          where: {
            name: Constant.VIDEO_TYPE
          },
          required: true
        },
        {
          attributes: ['id', 'name', 'slug'],
          association: 'categories',
          through: {
            attributes: [],
            where: {
              category_id: category.id
            }
          },
          required: true
        },
        {
          association: 'pundit',
          through: {
            attributes: []
          },
          attributes: ['id', 'name', 'slug', 'avatar', 'bio'],
          required: false
        }
        ],
        order: [
          ['id', 'DESC']
        ],
        limit: 8
      })
      videos = videos.map(function (video) {
        video = video.toJSON()
        video.type = video.type.name
        video.item_type = Constant.VIDEO_TYPE_RESPONSE
        video.item_id = video.id
        video.pundit = (video.pundit.length > 0) ? video.pundit[0] : null
        if (!video.thumbnail) {
          video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
        }
        if (!video.duration) {
          video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
        }
        video = _.omit(video, ['status'])
        return video
      })
      return videos
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async function getEventByCategory (category) {
    try {
      let exclude = ['updated_at', 'deleted_at', 'link']
      let events = await app.models.Event.findAll({
        attributes: {
          exclude: exclude
        },
        where: {
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
          attributes: ['id', 'name', 'slug'],
          association: 'categories',
          through: {
            attributes: [],
            where: {
              category_id: category.id
            }
          },
          required: true
        }],
        order: [
          ['start_at', 'desc'],
          ['id', 'desc']
        ],
        limit: 8
      })
      events = events.map(function (event) {
        event = event.toJSON()
        event.item_type = Constant.EVENT_TYPE_RESPONSE
        event.item_id = event.id
        event = _.omit(event, ['status'])
        return Object.assign({}, event, {
          item_id: event.id,
          item_type: Constant.EVENT_TYPE_RESPONSE
        })
      })
      return events
    } catch (e) {
      console.log(e)
      return null
    }
  }

  // Get Item Home Phone
  async function getItemPhone (req) {
    try {
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15
      let sportId = req.query.sport_id ? parseInt(req.query.sport_id) : ''
      let tournamentId = req.query.tournament_id ? parseInt(req.query.tournament_id) : ''
      let listTagId = []
      if (sportId !== '') {
        try {
          var sport = await app.models.Sport.findOne({
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
          var tournament = await app.models.Tournament.findOne({
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
      let include = []
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
          required: false
        })
      }
      let count = await app.models.Post.count({
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
        as: 'categories'
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
      let posts = await app.models.Post.findAll({
        attributes: {
          exclude: ['updated_at', 'published', 'visible']
        },
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
        limit: pageSize,
        offset: offset
      })
      if (posts.length > 0) {
        posts = posts.map(post => {
          post = post.toJSON()
          let isLike = false
          if (req.user) {
            if (_.some(post.likes, {
              user_id: req.user.id
            })) {
              isLike = true
            }
          }
          post.isLike = isLike
          post.likes = post.likes.length
          if (post.Tags.length > 0) {
            if (listTagId.length > 0) {
              post.tag = post.Tags[0]
            } else {
              post.Tags.forEach(function (tag) {
                if (tag.sports.length > 0 || tag.tournaments.length > 0) {
                  post.tag = {
                    id: tag.id,
                    name: tag.name
                  }
                  return false
                }
              })
            }
          }
          post.tags = post.Tags
          post = _.omit(post, ['name', 'content', 'Tags', 'metadata', 'url', 'status', 'date'])
          return post
        })
      }
      return {
        items: posts,
        pagination: pagination
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return router
}

async function getBreakingNews (app) {
  let items = await app.models.Post.findAll({
    where: {
      breaking_news: true,
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
    attributes: ['id', 'slug', 'title', 'short_title', 'short_description', 'post_type'],
    limit: 20,
    order: [
      ['id', 'DESC']
    ]
  })
  items = _.map(items, item => {
    item = item.toJSON()
    item.item_id = item.id
    item.item_type = Constant.POST_TYPE_RESPONSE
    return item
  })

  return items
}

function getKeySync (client, pattern) {
  return new Promise((resolve, reject) => {
    client.keys(pattern, (err, keys) => {
      if (err) {
        return reject(err)
      }
      return resolve(keys)
    })
  })
}
