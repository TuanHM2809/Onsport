import { Router } from 'express'
import _ from 'lodash'
var Constant = require('../../../constants')
const router = Router()

export default (app) => {
  router.get('/', async (req, res) => {
    let results
    try {
      let client = await require('../../../config/client')
      if (client) {
        results = await client.getAsync('top_view')
        // results = false // ignore redis
        if (results) {
          results = JSON.parse(results)
          if (results.length > 0) {
            return res.send(helper.sj(results, req.status_token))
          }
          return res.send(helper.sj([], req.status_token))
        } else {
          results = await getTopView(app)
          client.set('top_view', JSON.stringify(results), 'EX', 60 * 60 * 24)
          if (results.length > 0) {
            return res.send(helper.sj(results, req.status_token))
          }
          return res.send(helper.sj([], req.status_token))
        }
      } else {
        results = await getTopView(app)
        if (results.length > 0) {
          return res.send(helper.sj(results, req.status_token))
        }
        return res.send(helper.sj([], req.status_token))
      }
    } catch (e) {
      console.log(e)
      return res.send(helper.ej(e, 500))
    }
  })
  return router
}

async function getTopView(app) {
  try {
    let results = await app.models.GaStats.findAll({
      attributes: ['item_type', 'slug'],
      order: [
        ['view', 'DESC']
      ],
      limit: 4
    })
    // console.log(results)
    // return results
    if (results.length > 0) {
      results = await Promise.all(results.map(async r => {
        r = r.toJSON()
        // console.log(r)
        // return false
        if (r.item_type === 'video') {
          r = await getVideoBySlug(app, r.slug)
        } else if (r.item_type === 'event') {
          r = await getEventBySlug(app, r.slug)
        } else {
          r = await getPostBySlug(app, r.slug)
        }
        // console.log(r)

        return r
      }))
      return results
    }
    return []
  } catch (e) {
    console.log(e)
    return e
  }
}

// Get Post By Slug
async function getPostBySlug(app, slug) {
  try {
    let post = await app.models.Post.findOne({
      attributes: ['id', 'post_type', 'slug', 'title', 'status', 'breaking_news', 'featured', 'thumbnail', 'short_description', 'short_title'],
      where: {
        slug: slug,
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
      }]
    })
    if (post) {
      post = post.toJSON()
      post.name = post.title
      post.item_type = Constant.POST_TYPE_RESPONSE
      post.pundit = (post.pundit.length > 0) ? post.pundit[0] : null
      return post
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}

// Get Videos By Ids
async function getVideoBySlug(app, slug) {
  // console.log(app)
  try {
    let video = await app.models.File.findOne({
      attributes: ['id', 'name', 'slug', 'status', 'metadata', 'thumbnail', 'duration'],
      where: {
        slug: slug,
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
      }
      ],
      order: [
        ['id', 'DESC']
      ]
    })
    if (video) {
      video = video.toJSON()
      video.item_type = video.type.name
      if (!video.thumbnail) {
        video.thumbnail = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('thumbnail')) ? video.metadata.thumbnail : null
      }
      if (!video.duration) {
        video.duration = ((video.metadata !== null && typeof video.metadata === 'object') && video.metadata.hasOwnProperty('duration')) ? video.metadata.duration : null
      }
      return video
    }
    return ''
  } catch (error) {
    console.log(error)
    return null
  }
}

// Get Event By Ids
async function getEventBySlug(app, slug) {
  // console.log(app)
  try {
    let exclude = ['updated_at', 'deleted_at', 'link']
    let event = await app.models.Event.findOne({
      attributes: { exclude: exclude },
      where: {
        slug: slug,
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
      }
    })

    // return event
    if (event) {
      event = event.toJSON()
      event.item_id = event.id
      event.item_type = Constant.EVENT_TYPE_RESPONSE
      return event
    }
    return null
  } catch (error) {
    console.log(error)
    return null
  }
}
