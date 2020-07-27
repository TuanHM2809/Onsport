import { Router } from 'express'
import _ from 'lodash'
const router = Router()

export default app => {
  router.get('/', async (req, res) => {
    try {
      let query = {
        include: [
          {
            model: app.models.Tournament,
            attributes: ['id', 'name', 'abbreviation'],
            as: 'tournaments',
            where: {
              status: 1
            },
            include: [
              {
                model: app.models.Team,
                attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
                through: {
                  attributes: []
                },
                as: 'teams',
                include: [
                  {
                    model: app.models.Tag,
                    attributes: ['id', 'name'],
                    through: {
                      attributes: []
                    },
                    as: 'tags'
                  }
                ]
              },
              {
                model: app.models.Tag,
                attributes: ['id', 'name'],
                through: {
                  attributes: []
                },
                as: 'tags'
              }
            ]
          },
          {
            model: app.models.Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: []
            },
            as: 'tags'
          }
        ],
        order: [
          ['tournaments', 'name', 'asc'],
          ['tournaments', 'teams', 'name', 'asc']
        ]
      }

      if (req.user) {
        query = {
          include: [
            {
              model: app.models.Tournament,
              attributes: ['id', 'name', 'abbreviation'],
              as: 'tournaments',
              where: {
                status: 1
              },
              include: [
                {
                  model: app.models.Team,
                  attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
                  through: {
                    attributes: []
                  },
                  as: 'teams',
                  include: [
                    {
                      model: app.models.Tag,
                      attributes: ['id', 'name'],
                      through: {
                        attributes: []
                      },
                      as: 'tags',
                      include: [
                        {
                          model: app.models.User,
                          attributes: ['id'],
                          through: {
                            attributes: []
                          },
                          where: {
                            id: req.user.id
                          },
                          as: 'users',
                          required: false
                        }
                      ]
                    }
                  ]
                },
                {
                  model: app.models.Tag,
                  attributes: ['id', 'name'],
                  through: {
                    attributes: []
                  },
                  as: 'tags',
                  include: [
                    {
                      model: app.models.User,
                      attributes: ['id'],
                      through: {
                        attributes: []
                      },
                      where: {
                        id: req.user.id
                      },
                      as: 'users',
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: app.models.Tag,
              attributes: ['id', 'name'],
              through: {
                attributes: []
              },
              as: 'tags',
              include: [
                {
                  model: app.models.User,
                  attributes: ['id'],
                  through: {
                    attributes: []
                  },
                  where: {
                    id: req.user.id
                  },
                  as: 'users',
                  required: false
                }
              ]
            }
          ],
          order: [
            ['tournaments', 'name', 'asc'],
            ['tournaments', 'teams', 'name', 'asc']
          ]
        }
      }
      let sports = await app.models.Sport.findAll(query)
      if (sports.length > 0 && req.user) {
        sports = sports.map(sport => {
          sport = sport.toJSON()
          sport.tags = sport.tags.map(tag => {
            if (tag.users.length > 0) {
              tag.is_followed = 1
            } else {
              tag.is_followed = 0
            }
            return _.pick(tag, ['id', 'name', 'is_followed'])
          })
          sport.tournaments = sport.tournaments.map(tournament => {
            tournament.tags = tournament.tags.map(tag => {
              if (tag.users.length > 0) {
                tag.is_followed = 1
              } else {
                tag.is_followed = 0
              }
              return _.pick(tag, ['id', 'name', 'is_followed'])
            })
            tournament.teams = tournament.teams.map(team => {
              team.tags = team.tags.map(tag => {
                if (tag.users.length > 0) {
                  tag.is_followed = 1
                } else {
                  tag.is_followed = 0
                }
                return _.pick(tag, ['id', 'name', 'is_followed'])
              })
              return team
            })
            return tournament
          })
          return sport
        })
      }
      if (sports.length > 0) {
        return res.send(
          helper.sj(sports, req.status_token, 'Lấy thông tin thành công')
        )
      }
      return res.send(
        helper.sj([], req.status_token, 'Đã hết danh sách sport')
      )
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:sportId', async (req, res) => {
    try {
      req
        .checkParams('sportId', 'Không đúng định dạng sportId')
        .notEmpty()
        .isInt()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(
          helper.ej(result.array()[0].msg, 400, false, result.array()[0].msg)
        )
      }

      let query = {
        where: {
          id: req.params.sportId
        },
        include: [
          {
            model: app.models.Tournament,
            attributes: ['id', 'name', 'abbreviation'],
            as: 'tournaments',
            where: {
              status: 1
            },
            include: [
              {
                model: app.models.Team,
                attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
                through: {
                  attributes: []
                },
                as: 'teams',
                include: [
                  {
                    model: app.models.Tag,
                    attributes: ['id', 'name'],
                    through: {
                      attributes: []
                    },
                    as: 'tags'
                  }
                ]
              },
              {
                model: app.models.Tag,
                attributes: ['id', 'name'],
                through: {
                  attributes: []
                },
                as: 'tags'
              }
            ]
          },
          {
            model: app.models.Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: []
            },
            as: 'tags'
          }
        ]
      }

      if (req.user) {
        query = {
          where: {
            id: req.params.sportId
          },
          include: [
            {
              model: app.models.Tournament,
              attributes: ['id', 'name', 'abbreviation'],
              as: 'tournaments',
              where: {
                status: 1
              },
              include: [
                {
                  model: app.models.Team,
                  attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
                  through: {
                    attributes: []
                  },
                  as: 'teams',
                  include: [
                    {
                      model: app.models.Tag,
                      attributes: ['id', 'name'],
                      through: {
                        attributes: []
                      },
                      as: 'tags',
                      include: [
                        {
                          model: app.models.User,
                          attributes: ['id'],
                          through: {
                            attributes: []
                          },
                          where: {
                            id: req.user.id
                          },
                          as: 'users',
                          required: false
                        }
                      ]
                    }
                  ]
                },
                {
                  model: app.models.Tag,
                  attributes: ['id', 'name'],
                  through: {
                    attributes: []
                  },
                  as: 'tags',
                  include: [
                    {
                      model: app.models.User,
                      attributes: ['id'],
                      through: {
                        attributes: []
                      },
                      where: {
                        id: req.user.id
                      },
                      as: 'users',
                      required: false
                    }
                  ]
                }
              ]
            },
            {
              model: app.models.Tag,
              attributes: ['id', 'name'],
              through: {
                attributes: []
              },
              as: 'tags',
              include: [
                {
                  model: app.models.User,
                  attributes: ['id'],
                  through: {
                    attributes: []
                  },
                  where: {
                    id: req.user.id
                  },
                  as: 'users',
                  required: false
                }
              ]
            }
          ],
          order: [
            ['tournaments', 'name', 'asc'],
            ['tournaments', 'teams', 'name', 'asc']
          ]
        }
      }
      let sport = await app.models.Sport.findOne(query)

      if (sport && req.user) {
        sport = sport.toJSON()
        sport.tags = sport.tags.map(tag => {
          if (tag.users.length > 0) {
            tag.is_followed = 1
          } else {
            tag.is_followed = 0
          }
          return _.pick(tag, ['id', 'name', 'is_follow'])
        })
        sport.tournaments = sport.tournaments.map(tournament => {
          tournament.tags = tournament.tags.map(tag => {
            if (tag.users.length > 0) {
              tag.is_followed = 1
            } else {
              tag.is_followed = 0
            }
            return _.pick(tag, ['id', 'name', 'is_followed'])
          })
          tournament.teams = tournament.teams.map(team => {
            team.tags = team.tags.map(tag => {
              if (tag.users.length > 0) {
                tag.is_followed = 1
              } else {
                tag.is_followed = 0
              }
              return _.pick(tag, ['id', 'name', 'is_followed'])
            })
            return team
          })
          return tournament
        })
      }

      if (sport) {
        return res.send(
          helper.sj(sport, req.status_token, 'Lấy thông tin thành công')
        )
      }
      return res.send(
        helper.sj({}, req.status_token, 'Đã hết danh sách sport')
      )
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  return router
}
