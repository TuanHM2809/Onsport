import { Router } from 'express'
const router = Router()
import _ from 'lodash'

let elasticsearch = require('elasticsearch')
const ES = {
  host: 'localhost',
  port: '9200'
}
let client = new elasticsearch.Client({
  host: `${ES.host}:${ES.port}`
  // log: 'trace'
})

const MODEL = {
  'file': 'File',
  'article': 'Post',
  'gallery': 'Gallery',
  'event': 'Event' // add for event
}

const TYPES = ['file', 'article', 'gallery', 'event']

export default function (app) {
  router.get('/', async (req, res) => {
    try {
      let query = req.query.query || null
      let pageSize = (req.query && req.query.pageSize) ? req.query.pageSize : 15
      let page = (req.query && req.query.page) ? req.query.page : 1
      let from = (pageSize * (page - 1) >= 0) ? pageSize * (page - 1) : 0
      if (!query) {
        return res.send(helper.ej('Vui lòng điền query', 404, false, helper.MSG_404))
      }

      let search_query

      if (Array.isArray(query)) {
        search_query = {
          index: 'onsports',
          // type : ['movies','videos','series'],
          from: from,
          size: pageSize,
          _source: ['id', 'type'],
          body: {
            query: {
              bool: {
                should: [],
                'minimum_number_should_match': 1
              }
            }
          }
        }

        query.forEach(q => {
          search_query.body.query.bool.should.push({
            'multi_match': {
              query: q,
              fields: ['title^1', 'slug^0.5', 'content^0.25', 'categories^0.1', 'tags^0.1', 'short_title^0.2', 'short_description^0.05'],
              type: 'phrase_prefix'
            }
          })
        })
      } else {
        search_query = {
          index: 'onsports',
          // type : ['movies','videos','series'],
          from: from,
          size: pageSize,
          _source: ['id', 'type'],
          body: {
            'query': {
              'bool': {
                'must': {
                  'multi_match': {
                    query: query,
                    fields: ['title^1', 'slug^0.5', 'content^0.25', 'categories^0.1', 'tags^0.1', 'short_title^0.2', 'short_description^0.05'],
                    type: 'phrase_prefix'
                  }
                }
              }
            }
          }
        }
      }

      let search_type = req.query.type && TYPES.indexOf(req.query.type) !== -1 ? req.query.type : null
      if (search_type) {
        search_query.type = [req.query.type]
      }

      let results = await client.search(search_query)
      // Chỉ get 15 cái nên getDetail từng cái 1 ok
      let pagination = {
        page: page,
        pageSize: pageSize,
        rowCount: results.hits.total,
        pageCount: Math.round(results.hits.total / pageSize),
        itemLeft: function () {
          return this.rowCount - this.pageSize * this.page > 0 ? this.rowCount - this.pageSize * this.page : 0
        },
        pageLeft: function () {
          return this.pageCount - this.page > 0 ? this.pageCount - this.page : 0
        }
      }
      pagination.itemLeft = (pagination.itemLeft.bind(pagination))()
      pagination.pageLeft = (pagination.pageLeft.bind(pagination))()
      if (results.hits.hits.length > 0) {
        let items = results.hits.hits.map((val) => {
          return {
            type: val._type,
            id: val._source.id
          }
        })

        items = await Promise.all(_.map(items, async item => {
          let type = _.find(Object.keys(MODEL), m => { return m === item.type })
          if (type) {
            let model = MODEL[type]
            item = await app.models[model].findOne({
              where: {
                id: item.id
              },
              include: [{
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
                model: app.models.Tag,
                attributes: ['id', 'name', 'slug'],
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
                required: false,
                as: 'Tags'
              },
              {
                model: app.models.Author,
                attributes: ['id', 'name', 'slug'],
                through: {
                  attributes: []
                },
                as: 'author'
              },
              {
                association: 'likes',
                attributes: ['id', 'user_id']
              }
              ]
            })
            if (item) {
              let isLike = false
              if (req.user) {
                if (_.some(item.likes, { user_id: req.user.id })) {
                  isLike = true
                }
              }
              item = item.toJSON()
              item.item_id = item.id
              item.item_type = type
              item.isLike = isLike
              item.likes = item.likes.length
              if (item.item_type === 'file') {
                item.description = item.content
              }
              if (item.item_type === 'file' && !item.thumbnail) {
                item.thumbnail = ((item.metadata !== null && typeof item.metadata === 'object') && item.metadata.hasOwnProperty('thumbnail')) ? item.metadata.thumbnail : null
              }

              if (item.item_type === 'file' && !item.duration) {
                item.duration = ((item.metadata !== null && typeof item.metadata === 'object') && item.metadata.hasOwnProperty('duration')) ? item.metadata.duration : null
              }

              item.sport = null
              item.tournament = null
              if (item.Tags.length > 0) {
                _.map(item.Tags, tag => {
                  // if (item.sports && item.sports.length > 0) {
                  //   item.sport = tag.sports[0]
                  // }
                  // if (tag.tournaments.length > 0) {
                  //   item.tournament = tag.tournaments[0]
                  // }
                  if (tag.sports && tag.sports.length > 0) {
                    item.sport = tag.sports[0]
                  }
                  if (tag.tournaments && tag.tournaments.length > 0) {
                    item.tournament = tag.tournaments[0]
                  }
                })
              }
              item.tags = item.Tags.map(t => {
                return {
                  id: t.id,
                  name: t.name,
                  slug: t.slug
                }
              })
              item.tags = item.Tags
              if (item.name) {
                item.title = item.name
              }
            }
            return _.pick(item, ['id', 'type', 'item_type', 'item_id', 'name', 'slug', 'short_title', 'short_description', 'thumbnail', 'duration', 'title', 'description', 'pundit', 'author', 'tags', 'categories', 'sport', 'tournament', 'likes', 'isLike', 'created_at'])
          }
          return null
        }))
        items = _.filter(items, i => i)
        // console.log(items)
        return res.send(helper.tj(items, pagination, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (e) {
      console.log(e)
      return res.send(helper.ej(e, 500))
    }
  })

  return router
}
