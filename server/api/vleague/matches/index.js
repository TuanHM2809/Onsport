import { Router } from 'express'
import moment from 'moment'
import _ from 'lodash'
const router = Router()
var Constant = require('../../../constants')

export default app => {
  router.get('/', async (req, res) => {
    try {
      let page =
        req.query.page &&
          parseInt(req.query.page) &&
          parseInt(req.query.page) > 0
          ? parseInt(req.query.page)
          : 1
      let pageSize =
        req.query.pageSize &&
          parseInt(req.query.pageSize) &&
          parseInt(req.query.pageSize) > 0
          ? parseInt(req.query.pageSize)
          : 15
      let season =
        req.query.season &&
          parseInt(req.query.season) &&
          parseInt(req.query.season) > 0
          ? req.query.season
          : 2017
      let start_date =
        req.query.start_date &&
          moment(req.query.start_date).isValid('YYYY-MM-DD')
          ? req.query.start_date
          : null
      let end_date =
        req.query.end_date && moment(req.query.end_date).isValid('YYYY-MM-DD')
          ? req.query.end_date
          : null
      let tournament_id =
        req.query.tournament_id &&
          parseInt(req.query.tournament_id) &&
          parseInt(req.query.tournament_id) > 0
          ? parseInt(req.query.tournament_id)
          : null
      let sport_id =
        req.query.sport_id &&
          parseInt(req.query.sport_id) &&
          parseInt(req.query.sport_id) > 0
          ? parseInt(req.query.sport_id)
          : null
      let query = {
        attributes: [
          'id',
          'home_team_score',
          'away_team_score',
          'status',
          'venue',
          'start_at'
        ],
        include: [
          {
            model: app.models.Season,
            as: 'season',
            where: {
              season: season
            },
            attributes: [],
            required: true
          },
          {
            model: app.models.Team,
            as: 'home'
          },
          {
            model: app.models.Team,
            as: 'away'
          },
          {
            model: app.models.Team,
            as: 'winner'
          }
        ]
      }
      let count_query = {}
      count_query.include = [
        {
          model: app.models.Season,
          as: 'season',
          where: {
            season: season
          },
          attributes: [],
          required: true
        }
      ]
      // Nếu có sport_id
      if (sport_id && tournament_id) {
        count_query.include.push({
          model: app.models.Tournament,
          as: 'tournament',
          where: {
            id: tournament_id
          },
          include: [
            {
              model: app.models.Sport,
              where: {
                id: sport_id
              },
              as: 'sport',
              attributes: ['id', 'name'],
              require: true
            }
          ],
          attributes: ['id', 'name'],
          required: true
        })
        query.include.push({
          model: app.models.Tournament,
          as: 'tournament',
          where: {
            id: tournament_id
          },
          include: [
            {
              model: app.models.Sport,
              where: {
                id: sport_id
              },
              as: 'sport',
              require: true,
              attributes: ['id', 'name']
            }
          ],
          attributes: ['id', 'name'],
          required: true
        })
      } else if (sport_id && !tournament_id) {
        count_query.include.push({
          model: app.models.Tournament,
          as: 'tournament',
          include: [
            {
              model: app.models.Sport,
              where: {
                id: sport_id
              },
              as: 'sport',
              require: true,
              attributes: ['id', 'name']
            }
          ],
          attributes: ['id', 'name'],
          required: true
        })
        query.include.push({
          model: app.models.Tournament,
          as: 'tournament',
          include: [
            {
              model: app.models.Sport,
              where: {
                id: sport_id
              },
              as: 'sport',
              attributes: ['id', 'name'],
              require: true
            }
          ],
          attributes: ['id', 'name'],
          required: true
        })
      } else if (!sport_id && tournament_id) {
        count_query.include.push({
          model: app.models.Tournament,
          as: 'tournament',
          where: {
            id: tournament_id
          },
          include: [
            {
              model: app.models.Sport,
              attributes: ['id', 'name'],
              as: 'sport',
              require: true
            }
          ],
          attributes: ['id', 'name'],
          required: true
        })
        query.include.push({
          model: app.models.Tournament,
          as: 'tournament',
          where: {
            id: tournament_id
          },
          include: [
            {
              model: app.models.Sport,
              attributes: ['id', 'name'],
              as: 'sport',
              require: true
            }
          ],
          attributes: ['id', 'name'],
          required: true
        })
      } else {
        query.include.push({
          model: app.models.Tournament,
          as: 'tournament',
          include: [
            {
              model: app.models.Sport,
              attributes: ['id', 'name'],
              as: 'sport',
              require: true
            }
          ],
          attributes: ['id', 'name'],
          required: true
        })
      }

      start_date = moment
        .utc(`${start_date} 00:00:00`)
        .format('YYYY-MM-DD HH:mm:ss')
      end_date = moment
        .utc(`${end_date} 23:59:59`)
        .format('YYYY-MM-DD HH:mm:ss')
      query.where = {
        start_at: {
          $gte: start_date,
          $lte: end_date
        }
      }

      count_query.where = {
        start_at: {
          $gte: start_date,
          $lte: end_date
        }
      }

      if (start_date === 'Invalid date') {
        delete query.where.start_at['$gte']
        delete count_query.where.start_at['$gte']
      }

      if (end_date === 'Invalid date') {
        delete query.where.start_at['$lte']
        delete count_query.where.start_at['$lte']
      }

      if (_.isEmpty(query.where.start_at)) {
        delete query.where.start_at
        delete count_query.where.start_at
      }

      // if (start_date) {
      //   count_query.where = {
      //     start_at: {
      //       $gte: start_date
      //     }
      //   }
      //   query.where = {
      //     start_at: {
      //       $gte: start_date
      //     }
      //   }
      // }
      // if (end_date) {
      //   end_date = moment.utc(`${end_date} 23:59:59`).format('YYYY-MM-DD HH:mm:ss')
      //   if (typeof count_query.where === 'undefined' || typeof count_query.where.start_at === 'undefined') {
      //     count_query.where = {
      //       start_at: {
      //         $lte: end_date
      //       }
      //     }
      //   } else {
      //     // count_query.where = {
      //     //   start_at: {}
      //     // }
      //     // count_query.where.start_at.$lte = end_date
      //   }
      //   if (typeof query.where === 'undefined' || typeof query.where.start_at === 'undefined') {
      //     query.where = {
      //       start_at: {
      //         $lte: end_date
      //       }
      //     }
      //   } else {
      //     // query.where = {
      //     //   start_at: {}
      //     // }
      //     // query.where.start_at.$lte = end_date
      //   }
      // }

      // Chỗ này lười nhé
      if (typeof query.where === 'undefined') {
        query.where = {}
      }
      query.where.home_team = {
        $ne: null
      }
      query.where.away_team = {
        $ne: null
      }

      if (typeof count_query.where === 'undefined') {
        count_query.where = {}
      }
      count_query.where.home_team = {
        $ne: null
      }
      count_query.where.away_team = {
        $ne: null
      }

      let count = await app.models.Match.count(count_query)

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
      query.limit = pageSize
      query.offset = offset

      // start chỗ này nghia viết
      // neu co start_date va start_date >= hom nay
      if (
        start_date &&
        moment.utc(start_date).isSameOrAfter(moment.utc().startOf('day'))
      ) {
        query.order = [['start_at', 'asc']]
      } else {
        query.order = [['start_at', 'desc']]
      }

      // end chỗ này nghia viết

      // return false
      let matches = await app.models.Match.findAll(query)
      if (matches.length > 0) {
        matches = matches.map(m => {
          m = m.get({ plain: true })
          // if (!m.home || !m.away) {
          //   return null
          // }
          m.home.score = m.home_team_score
          m.away.score = m.away_team_score
          return _.omit(m, [
            'home_team_score',
            'away_team_score',
            'home_team',
            'away_team',
            'winner_id'
          ])
        })
        // matches = matches.filter(m => m)
        return res.send(helper.tj(matches, pagination, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // get match by team

  router.get('/getMatchByTeam', async (req, res) => {
    let teamId =
      req.query.teamId &&
        parseInt(req.query.teamId) &&
        parseInt(req.query.teamId) > 0
        ? req.query.teamId
        : null
    let matchweekId =
      req.query.matchweekId &&
        parseInt(req.query.matchweekId) &&
        parseInt(req.query.matchweekId) > 0
        ? req.query.matchweekId
        : null

    // console.log(req.query)

    // chua check gi ca ngoai teamId or matchweekid

    try {
      let query = {
        attributes: [
          'id',
          'home_team',
          'away_team',
          'winner_id',
          'home_team_score',
          'away_team_score',
          'status',
          'venue',
          'start_at'
        ],
        include: [
          {
            model: app.models.Team,
            as: 'home'
          },
          {
            model: app.models.Team,
            as: 'away'
          },
          {
            model: app.models.Team,
            as: 'winner'
          },
          {
            model: app.models.Round,
            as: 'round'
          }
        ]
      }

      query.where = {
        is_vleague: true // must a vleague match
      }

      if (teamId) {
        let subQuery = [
          {
            home_team: {
              $eq: teamId
            }
          },
          {
            away_team: {
              $eq: teamId
            }
          }
        ]
        query.where['$or'] = subQuery // check away team or home team
      }

      if (matchweekId) {
        query.where['round_id'] = matchweekId // valid matchweek
      }
      // console.log(query)
      // return false
      let matches = await app.models.Match.findAll(query)
      if (matches.length > 0) {
        matches = matches.map(m => {
          m = m.get({ plain: true })
          if (!m.home || !m.away) {
            return null
          }
          m.home.score = m.home_team_score
          m.away.score = m.away_team_score
          return _.omit(m, [
            'home_team_score',
            'away_team_score',
            'home_team',
            'away_team',
            'winner_id'
          ])
        })
        // matches = matches.filter(m => m)
        return res.send(helper.tj(matches))
      }
      return res.send(helper.sj([]))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // get match detail
  router.get('/:matchId', async (req, res) => {
    try {
      req
        .checkParams('matchId', 'Không đúng định dạng matchId')
        .notEmpty()
        .isInt()
      // let query = {
      //     // {
      //     //   model: app.models.File,
      //     //   attributes: ['id', 'url', 'name'],
      //     //   through: {
      //     //     attributes: []
      //     //   },
      //     //   as: 'photos'
      //     // },
      //     // {
      //     //   model: app.models.File,
      //     //   through: {
      //     //     attributes: []
      //     //   },
      //     //   as: 'videos'
      //     // },
      //     // {
      //     //   model: app.models.Post,
      //     //   attributes: ['id', 'title', 'slug', 'short_description', 'post_type', 'thumbnail', 'poster'],
      //     //   through: {
      //     //     attributes: []
      //     //   },
      //     //   as: 'posts'
      //     // }
      //   ]
      // }
      let match = await app.models.Match.findOne({
        attributes: { exclude: ['created_at', 'updated_at'] },
        where: {
          id: req.params.matchId
        },
        include: [
          {
            model: app.models.Team,
            as: 'home',
            include: [
              {
                model: app.models.Player,
                as: 'players',
                include: [
                  {
                    model: app.models.Position,
                    as: 'positions'
                  }
                ]
              }
            ]
          },
          {
            model: app.models.Team,
            as: 'away',
            include: [
              {
                model: app.models.Player,
                as: 'players',
                include: [
                  {
                    model: app.models.Position,
                    as: 'positions'
                  }
                ]
              }
            ]
          },
          {
            model: app.models.Team,
            as: 'winner'
          },
          {
            model: app.models.Round,
            as: 'round'
          }
        ]
      })
      if (match) {
        let [posts, photos, videos] = await Promise.all([
          app.models.Post.findAll({
            attributes: [
              'id',
              'title',
              'slug',
              'short_description',
              'post_type',
              'thumbnail',
              'poster'
            ],
            where: {
              status: 'PUBLISHED',
              deleted_at: null,
              $or: [
                {
                  date: {
                    $lte: app.models.sequelize.literal(
                      'DATE_ADD(NOW(), INTERVAL 7 HOUR)'
                    )
                  }
                },
                {
                  date: null
                }
              ]
            },
            include: [
              {
                association: 'matches',
                attributes: [],
                through: {
                  attributes: [],
                  where: {
                    match_id: match.id,
                    status: true
                  }
                },
                required: true
              }
            ],
            order: [['id', 'DESC']]
          }),
          app.models.File.findAll({
            attributes: ['id', 'url', 'name'],
            where: {
              status: 'PUBLISHED',
              deleted_at: null
            },
            include: [
              {
                association: 'matches_photos',
                attributes: [],
                through: {
                  attributes: [],
                  where: {
                    match_id: match.id,
                    status: true
                  }
                },
                required: true
              },
              {
                association: 'type',
                attributes: [],
                where: {
                  name: Constant.IMAGE_TYPE
                },
                required: true
              }
            ],
            order: [['id', 'DESC']]
          }),
          app.models.File.findAll({
            where: {
              status: 'PUBLISHED',
              deleted_at: null
            },
            include: [
              {
                association: 'matches_videos',
                attributes: [],
                through: {
                  attributes: [],
                  where: {
                    match_id: match.id,
                    status: true
                  }
                },
                required: true
              },
              {
                association: 'type',
                attributes: [],
                where: {
                  name: Constant.VIDEO_TYPE
                },
                required: true
              }
            ],
            order: [['id', 'DESC']]
          })
        ])

        match = match.get({ plain: true })
        match.home.score = match.home_team_score
        match.away.score = match.away_team_score
        match.posts = posts
        match.videos = videos
        match.photos = photos
        match = _.omit(match, [
          'home_team_score',
          'away_team_score',
          'home_team',
          'away_team',
          'winner_id'
        ])
        return res.send(helper.sj(match, req.status_token))
      }
      return res.send(helper.sj(null, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // get match event
  router.get('/:matchId/events', async (req, res) => {
    try {
      req
        .checkParams('matchId', 'Không đúng định dạng matchId')
        .notEmpty()
        .isInt()
      let query = {
        attributes: [
          'id',
          'home_team',
          'away_team',
          'winner_id',
          'home_team_score',
          'away_team_score',
          'status',
          'venue',
          'start_at',
          'referee'
        ],
        where: {
          id: req.params.matchId
        },
        include: [
          {
            model: app.models.Team,
            as: 'home'
          },
          {
            model: app.models.Team,
            as: 'away'
          },
          {
            model: app.models.Team,
            as: 'winner'
          },
          {
            model: app.models.MatchEvent,
            as: 'match_events',
            attributes: [
              'action_owner',
              'time',
              'detail',
              'target',
              'additional_time',
              'is_own_goal',
              'is_second_yellow'
            ],
            include: [
              {
                model: app.models.MatchEventType,
                as: 'type',
                attributes: ['name']
              },
              {
                model: app.models.Team,
                as: 'action_owner_team',
                attributes: ['id', 'name']
              },
              {
                model: app.models.Team,
                as: 'target_team',
                attributes: ['id', 'name']
              }
            ]
          }
        ],
        order: [['match_events', 'time', 'asc']]
      }

      let match = await app.models.Match.findOne(query)
      if (match) {
        match = match.get({ plain: true })
        match.home.score = match.home_team_score
        match.away.score = match.away_team_score
        match.match_events = _.sortBy(match.match_events, e => {
          return [e.time.split(':')[0] + e.additional_time, e.additional_time]
        })
        match = _.omit(match, [
          'home_team_score',
          'away_team_score',
          'home_team',
          'away_team',
          'winner_id'
        ])
        return res.send(helper.sj(match, req.status_token))
      }
      return res.send(helper.sj(null, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  // get match lineup

  router.get('/:matchId/lineup', async (req, res) => {
    try {
      req
        .checkParams('matchId', 'Không đúng định dạng match id')
        .notEmpty()
        .isInt()
      let query = {
        attributes: [
          'id',
          'home_team',
          'away_team',
          'home_team_score',
          'away_team_score',
          'status',
          'venue',
          'start_at'
        ],
        where: {
          id: req.params.matchId
        },
        include: [
          {
            model: app.models.Team,
            as: 'home'
          },
          {
            model: app.models.Team,
            as: 'away'
          },
          {
            model: app.models.Lineup,
            as: 'lineups',
            include: [
              {
                model: app.models.LineupItem,
                as: 'items',
                include: [
                  {
                    model: app.models.Player,
                    as: 'player',
                    include: [
                      {
                        model: app.models.Position,
                        as: 'positions'
                      }
                    ]
                  }
                ]
              },
              {
                model: app.models.Team,
                as: 'teams'
              }
            ]
          }
        ]
      }

      let match = await app.models.Match.findOne(query)

      if (match) {
        match = match.get({ plain: true })
        return res.send(helper.sj(match, 200))
      }
      return res.send(helper.sj(null, 200))
    } catch (e) {
      return res.send(helper.ej(e, 500))
      console.log(e)
    }
  })
  // get match start
  router.get('/:matchId/stats', async (req, res) => {
    try {
      req
        .checkParams('matchId', 'Không đúng định dạng matchId')
        .notEmpty()
        .isInt()
      let query = {
        attributes: [
          'id',
          'home_team',
          'away_team',
          'winner_id',
          'home_team_score',
          'away_team_score',
          'status',
          'venue',
          'start_at'
        ],
        where: {
          id: req.params.matchId
        },
        include: [
          {
            model: app.models.Team,
            as: 'home'
          },
          {
            model: app.models.Team,
            as: 'away'
          },
          {
            model: app.models.Team,
            as: 'winner'
          },
          {
            model: app.models.MatchStat,
            as: 'match_stats',
            attributes: ['value'],
            include: [
              {
                model: app.models.MatchStatType,
                as: 'type',
                attributes: ['name']
              },
              {
                model: app.models.Team,
                as: 'team',
                attributes: ['id', 'name']
              }
            ]
          }
        ]
      }

      let match = await app.models.Match.findOne(query)
      if (match) {
        match = match.get({ plain: true })
        match.stats = {
          home: _.filter(match.match_stats, s => {
            return s.team.id === match.home.id
          }).map(s => {
            return _.omit(s, ['team'])
          }),
          away: _.filter(match.match_stats, s => {
            return s.team.id === match.away.id
          }).map(s => {
            return _.omit(s, ['team'])
          })
        }
        match.stats.home = _.orderBy(match.stats.home, s => s.type.name, [
          'asc'
        ])
        match.stats.away = _.orderBy(match.stats.away, s => s.type.name, [
          'asc'
        ])
        match.home.score = match.home_team_score
        match.away.score = match.away_team_score
        match = _.omit(match, [
          'home_team_score',
          'away_team_score',
          'home_team',
          'away_team',
          'winner_id'
        ])
        match = _.omit(match, ['match_stats'])
        return res.send(helper.sj(match, req.status_token))
      }
      return res.send(helper.sj(null, req.status_token))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  return router
}
