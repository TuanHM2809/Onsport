import { Router } from 'express'
import moment from 'moment'
import _ from 'lodash'
const router = Router()

export default (app) => {
  router.get('/:matchId', async (req, res) => {
    try {
      req.checkParams('matchId', 'Không đúng định dạng matchId').notEmpty().isInt()
      var result = await req.getValidationResult()
      if (!result.isEmpty()) {
        return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
      }
      let season = req.query.season && parseInt(req.query.season) ? req.query.season : 2017

      // cung cache luon vi dang tap cachec

      let client = await require('../../../config/client')
      let match = null

      let query = {
        attributes: ['id', 'home_team', 'away_team', 'winner_id', 'home_team_score', 'away_team_score', 'status', 'venue', 'start_at', 'referee'],
        where: {
          top11_matchId: parseInt(req.params.matchId)
        },
        include: [{
          model: app.models.Season,
          as: 'season',
          where: {
            season: season
          },
          // attributes: [],
          required: true
        },
        {
          model: app.models.Tournament,
          as: 'tournament',
          include: [{
            model: app.models.Sport,
            // attributes: ['id', 'name'],
            as: 'sport',
            require: true
          }],
          // attributes: ['id', 'name'],
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
        },
        {
          model: app.models.MatchEvent,
          as: 'match_events',
          // attributes: ['action_owner', 'time', 'detail', 'target', 'additional_time', 'is_own_goal', 'is_second_yellow'],
          include: [{
            model: app.models.MatchEventType,
            as: 'type'
            // attributes: ['name']
          },
          {
            model: app.models.Team,
            as: 'action_owner_team'
            // attributes: ['id', 'name']
          },
          {
            model: app.models.Team,
            as: 'target_team'
            // attributes: ['id' , 'name']
          }
          ]
        },
        {
          model: app.models.MatchStat,
          as: 'match_stats',
          attributes: ['value'],
          include: [{
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
        ],
        order: [
          ['match_events', 'time', 'asc']
        ]
      }

      let hideLogo = await app.models.Setting.findOne({
        where: {
          key: 'hide_logo'
        },
        raw: true
      })

      if (client) { // viet lai cho nho --> kiem tra client
        match = await client.getAsync(`t11Match_${req.params.matchId}`) // lay ra xem sao
        if (match) {
          match = JSON.parse(match) // neu co thi parse ra
        } else {
          match = await app.models.Match.findOne(query) // k co thi tim binh thuong
          if (match) { // co
            match = match.toJSON() // bien thanh json
            client.set(`t11Match_${req.params.matchId}`, JSON.stringify(match), 'EX', 60 * 60) //set vao redis
          } else {
            return res.send(helper.ej(null, 404, false, helper.MSG_404))
          }
        }
      } else {
        match = await app.models.Match.findOne(query)
        if (match) {
          match = match.toJSON()
        } else {
          return res.send(helper.ej(null, 404, false, helper.MSG_404))
        }
      }

      if (match) {
        // match = match.get({ plain: true })
        match.home.score = match.home_team_score
        match.away.score = match.away_team_score
        match.match_events = _.sortBy(match.match_events, e => {
          return [e.time.split(':')[0] + e.additional_time, e.additional_time]
        })

        match.stats = {
          home: _.filter(match.match_stats, s => {
            return s.team.id === match.home.id
          }).map(s => { return _.omit(s, ['team']) }),
          away: _.filter(match.match_stats, s => {
            return s.team.id === match.away.id
          }).map(s => { return _.omit(s, ['team']) })
        }
        match.stats.home = _.orderBy(match.stats.home, s => s.type.name, ['asc'])
        match.stats.away = _.orderBy(match.stats.away, s => s.type.name, ['asc'])

        if (hideLogo && hideLogo.value) { // ẩn logo
          match.home.thumbnail = null
          match.away.thumbnail = null
        }

        match = _.omit(match, ['home_team_score', 'away_team_score', 'home_team', 'away_team'])
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
