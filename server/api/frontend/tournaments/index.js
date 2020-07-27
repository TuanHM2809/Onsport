import { Router } from 'express'
import _ from 'lodash'
const router = Router()

export default (app) => {
  router.get('/', async (req, res) => {
    try {
      let query = {
        attributes: ['id', 'name', 'abbreviation', 'league_type', 'display_name', 'status'],
        where: {
          status: true
        },
        include: [{
          model: app.models.Team,
          attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
          through: {
            attributes: []
          },
          as: 'teams',
          include: [{
            model: app.models.Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: []
            },
            as: 'tags'
          }]
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
          ['id', 'asc']
        ]
      }

      if (req.user) {
        query = {
          attributes: ['id', 'name', 'abbreviation', 'league_type'],
          where: {
            status: true
          },
          include: [{
            model: app.models.Team,
            attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
            through: {
              attributes: []
            },
            as: 'teams',
            include: [{
              model: app.models.Tag,
              attributes: ['id', 'name'],
              through: {
                attributes: []
              },
              as: 'tags',
              include: [{
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
              }]
            }]
          },
          {
            model: app.models.Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: []
            },
            as: 'tags',
            include: [{
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
            }]
          }
          ],
          order: [
            ['id', 'asc']
          ]
        }
      }

      let sport_id = req.query.sportId && parseInt(req.query.sportId) ? req.query.sportId : null
      if (sport_id) {
        query.where = {
          sport_id: sport_id
        }
      }
      if (typeof query.where === 'undefined') {
        query.where = {
          status: 1
        }
      } else {
        query.where.status = 1
      }
      let tournaments = await app.models.Tournament.findAll(query)
      if (tournaments.length > 0) {
        tournaments = tournaments.map(tournament => {
          tournament = tournament.toJSON()
          tournament.name = tournament.display_name ? tournament.display_name : tournament.name
          tournament.tags = tournament.tags.map(tag => {
            if (tag.users && tag.users.length > 0) {
              tag.is_followed = 1
            } else {
              tag.is_followed = 0
            }
            return _.pick(tag, ['id', 'name', 'is_followed'])
          })
          tournament.teams = tournament.teams.map(team => {
            team.tags = team.tags.map(tag => {
              if (tag.users && tag.users.length > 0) {
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

      if (tournaments.length > 0) {
        return res.send(helper.sj(tournaments, req.status_token, 'Lấy thông tin thành công'))
      }
      return res.send(helper.sj(null, req.status_token, 'Đã hết thông tin tournament'))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:tournamentId', async (req, res) => {
    try {
      req.checkParams('tournamentId', 'Không đúng định dạng tournamentId').notEmpty().isInt()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }

      let query = {
        where: {
          id: req.params.tournamentId,
          status: 1
        },
        include: [{
          model: app.models.Team,
          attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
          through: {
            attributes: []
          },
          as: 'teams',
          include: [{
            model: app.models.Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: []
            },
            as: 'tags'
          }]
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
          ['teams', 'name', 'asc']
        ]
      }

      if (req.user) {
        query = {
          where: {
            id: req.params.tournamentId
          },
          include: [{
            model: app.models.Team,
            attributes: ['id', 'name', 'thumbnail', 'abbreviation'],
            through: {
              attributes: []
            },
            as: 'teams',
            include: [{
              model: app.models.Tag,
              attributes: ['id', 'name'],
              through: {
                attributes: []
              },
              as: 'tags',
              include: [{
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
              }]
            }]
          },
          {
            model: app.models.Tag,
            attributes: ['id', 'name'],
            through: {
              attributes: []
            },
            as: 'tags',
            include: [{
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
            }]
          }
          ],
          order: [
            ['teams', 'name', 'asc']
          ]
        }
      }
      let tournament = await app.models.Tournament.findOne(query)

      let hideLogo = await app.models.Setting.findOne({
        where: {
          key: 'hide_logo'
        },
        raw: true
      })

      if (tournament) {
        tournament = tournament.toJSON()
        tournament.tags = tournament.tags.map(tag => {
          if (tag.users && tag.users.length > 0) {
            tag.is_followed = 1
          } else {
            tag.is_followed = 0
          }
          return _.pick(tag, ['id', 'name', 'is_followed'])
        })
        tournament.teams = tournament.teams.map(team => {
          if (hideLogo && hideLogo.value) { // ẩn logo
            team.thumbnail = null
          }

          team.tags = team.tags.map(tag => {
            if (tag.users && tag.users.length > 0) {
              tag.is_followed = 1
            } else {
              tag.is_followed = 0
            }
            return _.pick(tag, ['id', 'name', 'is_followed'])
          })
          return team
        })
      }

      if (tournament) {
        return res.send(helper.sj(tournament, req.status_token, 'Lấy thông tin thành công'))
      }

      return res.send(helper.sj({}, req.status_token, 'Không tìm thấy tournament'))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  router.get('/:tournamentId/standing', async (req, res) => {
    try {
      req.checkParams('tournamentId', 'Không đúng định dạng tournamentId').notEmpty().isInt()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let season = req.query.season && parseInt(req.query.season) ? season : 2017
      let tournament = await app.models.Tournament.findOne({
        attributes: ['id', 'name', 'abbreviation', 'league_type'],
        where: {
          id: req.params.tournamentId,
          status: 1
        },
        include: [{
          model: app.models.Standing,
          as: 'standings',
          attributes: ['id', 'rank'],
          required: true,
          include: [{
            model: app.models.Division,
            attributes: ['id', 'name'],
            as: 'division'
          },
          {
            model: app.models.Season,
            attributes: [],
            as: 'season',
            where: {
              season: season
            },
            required: true
          },
          {
            model: app.models.Team,
            as: 'team',
            attributes: ['id', 'name', 'abbreviation', 'thumbnail'],
            required: true
          },
          {
            model: app.models.DetailRecord,
            as: 'home_record',
            attributes: ['type', 'wins', 'ties', 'losses', 'goals_for', 'goals_against', 'points', 'games_played'],
            required: true
          },
          {
            model: app.models.DetailRecord,
            as: 'away_record',
            attributes: ['type', 'wins', 'ties', 'losses', 'goals_for', 'goals_against', 'points', 'games_played'],
            required: true
          },
          {
            model: app.models.DetailRecord,
            as: 'total_record',
            attributes: ['type', 'wins', 'ties', 'losses', 'goals_for', 'goals_against', 'points', 'games_played'],
            required: true
          }
          ]
        }],
        order: [
          [app.models.Sequelize.literal('standings.rank'), 'asc']
        ]
      })

      if (tournament) {
        tournament = tournament.get({ plain: true })
        tournament.temp_standings = []

        let hideLogo = await app.models.Setting.findOne({
          where: {
            key: 'hide_logo'
          },
          raw: true
        })

        //Group By Division
        tournament.standings.forEach(standing => {
          if (standing.division) {
            if (!_.find(tournament.temp_standings, s => { return s.division.id === standing.division.id })) {
              tournament.temp_standings.push({
                division: standing.division ? standing.division : null,
                teams: []
              })
            }
            if (hideLogo && hideLogo.value) { // ẩn logo
              standing.team.thumbnail = null
            }
            let found_division = _.find(tournament.temp_standings, s => { return s.division.id === standing.division.id })
            found_division.teams.push({
              rank: standing.rank,
              team: standing.team,
              home_record: standing.home_record,
              away_record: standing.away_record,
              total_record: standing.total_record
            })
          } else {
            if (!_.find(tournament.temp_standings, s => { return s.division == null })) {
              tournament.temp_standings.push({
                division: null,
                teams: []
              })
            }

            if (hideLogo && hideLogo.value) { // ẩn logo
              standing.team.thumbnail = null
            }
            let found_division = _.find(tournament.temp_standings, s => { return s.division == null })
            found_division.teams.push({
              rank: standing.rank,
              team: standing.team,
              home_record: standing.home_record,
              away_record: standing.away_record,
              total_record: standing.total_record
            })
          }
        })
        tournament.standings = tournament.temp_standings
        tournament = _.omit(tournament, ['temp_standings'])
        if (tournament.standings.length > 1) {
          tournament.standings = _.sortBy(tournament.standings, s => {
            return s.division.name
          })
        }
        return res.send(helper.sj(tournament, req.status_token, 'Lấy thông tin thành công'))
      }
      return res.send(helper.sj({}, req.status_token, 'Đã hết danh sách sport'))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  return router
}
