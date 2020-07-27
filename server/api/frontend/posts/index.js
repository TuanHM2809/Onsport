import { Router } from 'express'
import _ from 'lodash'
const router = Router()
var Constant = require('../../../constants')
const postType = [Constant.NORMAL_TYPE, Constant.LONGFORM_TYPE]
export default (app) => {
  router.get('/', async(req, res) => {
    try {
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15
      let sportId = req.query.sport_id ? parseInt(req.query.sport_id) : ''
      let tournamentId = req.query.tournament_id ? parseInt(req.query.tournament_id) : ''
      let type = req.query.type ? req.query.type : ''
      let device = req.query.device ? req.query.device : ''
      let listTagId = []
        // Get pagination data
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
      let include = []
      if (listTagId.length > 0 || (sportId !== '' || tournamentId !== '')) {
        include.push({
          association: 'Tags',
          through: {
            attributes: [],
            where: {
              tag_id: {
                $in: listTagId
              }
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
          required: false
        })
      }

      let condition = {
        deleted_at: null,
        $or: [{
            date: {
              $lte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            date: null
          },
        ]
      }
      if (type !== '' && _.indexOf(postType, type) !== -1) {
        condition.post_type = type
      }
      if (device ==='mobile') {
        let arrStt = ['PUBLISHED', 'ONLYAPP']
        condition.status = arrStt
      } else if (device == '') {
        condition.status = 'PUBLISHED'
      }

      let count = await app.models.Post.count({
          where: condition,
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

      // include.push({
      //   association: 'likes',
      //   attributes: ['id', 'user_id']
      // })
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
        attributes: { exclude: ['updated_at', 'published', 'visible', 'content'] },
        where: condition,
        distinct: true,
        include: include,
        col: 'id',
        order: [
          ['id', 'desc']
        ],
        limit: pageSize,
        offset: offset
      })
      if (posts.length > 0) {
        posts = posts.map(post => {
          post = post.toJSON()
          let isLike = false
          if (req.user) {
            if (_.some(post.likes, { user_id: req.user.id })) {
              isLike = true
            }
          }
          // post.isLike = isLike
          // post.likes = post.likes.length
            // if (post.author.length === 0) {
            //   post.author = null
            // }
          if (sport) {
            // sport = sport.toJSON()
            post.sport = _.pick(sport, ['id', 'name'])
          } else {
            post.sport = null
          }
          if (tournament) {
            // tournament = tournament.toJSON()
            post.tournament = _.pick(tournament, ['id', 'name'])
          } else {
            post.tournament = null
          }
          if (listTagId.length === 0) {
            _.map(post.Tags, tag => {
              if (tag.sports.length > 0) {
                post.sport = tag.sports[0]
              }
              if (tag.tournaments.length > 0) {
                post.tournament = tag.tournaments[0]
              }
            })
          }
          post.tags = post.Tags.map(t => {
            return {
              id: t.id,
              name: t.name,
              slug: t.slug
            }
          })
          post.tags = post.Tags
          post = _.omit(post, ['name', 'Tags', 'metadata', 'url', 'status'])
          post.item_id = post.id
          post.item_type = Constant.POST_TYPE_RESPONSE
          return post
        })
        return res.send(helper.tj(posts, pagination, req.status_token))
      }
      return res.send(helper.sj(posts, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/preview/:postId', async(req, res) => {
    try {
      req.checkParams('postId', 'Post Id không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let post = await app.models.Post.findOne({
        attributes: { exclude: ['updated_at', 'published', 'visible'] },
        where: {
          id: req.params.postId
        }
      })
      if (post) {
        return res.send(helper.sj(post, req.status_token))
      }
      return res.send(helper.ej(null, 404, false, helper.MSG_404))
    } catch (e) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:postId', async(req, res) => {
    try {
      req.checkParams('postId', 'Post id không được bỏ trống').notEmpty()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let include = []
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
      include.push({
        association: 'likes',
        attributes: ['id', 'user_id']
      })
      include.push({
        model: app.models.Category,
        as: 'categories',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'slug']
      })

      include.push({
        association: 'author',
        through: {
          attributes: []
        },
        attributes: ['id', 'name', 'avatar', 'bio', 'slug', 'created_at'],
        required: false
      })

      let post = await app.models.Post.findOne({
        attributes: { exclude: ['updated_at', 'published', 'visible'] },
        where: {
          slug: req.params.postId,
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
        include: include
      })
      if (post === null) {
        post = await app.models.Post.findOne({
          attributes: { exclude: ['updated_at', 'published', 'visible'] },
          where: {
            id: req.params.postId,
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
          include: include
        })
        if (post === null) {
          return res.send(helper.ej(null, 404, false, helper.MSG_404))
        }
      }
      if (post) {
        post = post.toJSON()
        let categoryIds = _.map(post.categories, 'id')
        let isLike = false
        if (req.user) {
          if (_.some(post.likes, { user_id: req.user.id })) {
            isLike = true
          }
        }
        post.isLike = isLike
        post.likes = post.likes.length
        if (post.author.length === 0) {
          post.author = null
        }
        post.sport = null
        post.tournament = null
        if (post.Tags.length > 0) {
          _.map(post.Tags, tag => {
            if (tag.sports.length > 0) {
              post.sport = tag.sports[0]
            }
            if (tag.tournaments.length > 0) {
              post.tournament = tag.tournaments[0]
            }
          })
        }
        post.tags = post.Tags.map(t => {
          return {
            id: t.id,
            name: t.name,
            slug: t.slug
          }
        })
        post.related = await getRelatedPost(app, req, post.id, categoryIds)

        post = _.omit(post, ['name', 'Tags', 'metadata', 'url', 'status'])
        return res.send(helper.sj(post, req.status_token))
      }
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })
  return router
}

async function getRelatedPost(app, req, postId, categoryIds) {
  try {
    let related = await app.models.Post.findAll({
      attributes: { exclude: ['updated_at', 'published', 'visible', 'content'] },
      where: {
        id: {
          $ne: postId
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
        },
        {
          association: 'likes',
          attributes: ['id', 'user_id']
        },
        {
          model: app.models.Category,
          as: 'categories',
          through: {
            attributes: [],
            id: {
              $in: categoryIds
            }
          },
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [
        ['created_at', 'desc']
      ],
      limit: 12
    })
    related = _.map(related, post => {
      post = post.toJSON()
      let isLike = false
      if (req.user) {
        if (_.some(post.likes, { user_id: req.user.id })) {
          isLike = true
        }
      }
      post.isLike = isLike
      post.likes = post.likes.length
      post.sport = null
      post.tournament = null
      if (post.Tags.length > 0) {
        _.map(post.Tags, tag => {
          if (tag.sports.length > 0) {
            post.sport = tag.sports[0]
          }
          if (tag.tournaments.length > 0) {
            post.tournament = tag.tournaments[0]
          }
        })
      }
      post.tags = post.Tags.map(t => {
        return {
          id: t.id,
          name: t.name,
          slug: t.slug
        }
      })
      post.item_type = Constant.POST_TYPE_RESPONSE
      post.item_id = post.id
      return _.omit(post, ['name', 'Tags', 'metadata', 'url', 'status'])
    })
    return related
  } catch (error) {
    console.log(error)
    return null
  }
}
