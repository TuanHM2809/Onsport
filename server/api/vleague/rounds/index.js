import { Router } from 'express'
import moment from 'moment'
var Promise = require('bluebird')
const Sequelize = require('sequelize')
import _ from 'lodash'
var Constant = require('../../../constants')
const router = Router()

export default (app) => {
  router.get('/', async (req, res) => {
    try {
      // page and pageSize as param
      let page = req.query.page && parseInt(req.query.page) && parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1
      let pageSize = req.query.pageSize && parseInt(req.query.pageSize) && parseInt(req.query.pageSize) > 0 ? parseInt(req.query.pageSize) : 15

      let query = {
        attributes: ['id', 'name', 'vleague_id', 'start_at', 'end_at']
      }
      query.limit = pageSize

      let rounds = await app.models.Round.findAll(query)
      rounds = await Promise.map(rounds, async round => {
        round = round.toJSON()
        round = await getMatches(app, req, round)
        return round
      })
      if (rounds.length > 0) {
        return res.send(helper.tj(rounds, req.status_token))
      }
      return res.send(helper.sj([], req.status_token))
    } catch (error) {
      console.log(error)
    }
  })

  router.get('/latest', async (req, res) => {
    try {
      let round = await app.models.Round.findOne({
        attributes: { exclude: ['created_at', 'updated_at'] },
        order: [['start_at', 'DESC']],
        include: [
          {
            model: app.models.Match,
            as: 'matches',
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
              }
            ],
            group: 'start_at'
          }
        ]
      })
      if (round) {
        round = round.toJSON()
        return res.send(helper.tj(round))
      } else {
        return res.send(helper.sj(null, req.status_token))
      }
    } catch (error) {
      console.log(error)
    }
  })
  router.get('/getRoundByMatch/:matchId', async (req, res) => {
    try {
      req.checkParams('matchId', 'Mã vòng đấu không được bỏ trống').notEmpty().isInt()
      let round = await app.models.Round.findOne({
        attributes: { exclude: ['created_at', 'updated_at'] },
        include: [
          {
            model: app.models.Match,
            as: 'matches',
            where: {
              id: req.params.matchId
            }
          }
        ]
      })
      if (round) {
        round = round.toJSON()
        // round = Object.assign({}, round, { matches: [] })
        round = await getMatches(app, req, round)
        return res.send(helper.tj(round))
      }
      return res.send(helper.tj({}))
    } catch (error) {
      console.log(error)
    }
  })
  router.get('/:roundId', async (req, res) => {
    try {
      req.checkParams('roundId', 'Mã vòng đấu không được bỏ trống').notEmpty()
      let round = await app.models.Round.findOne({
        attributes: { exclude: ['created_at', 'updated_at'] },
        where: {
          id: req.params.roundId
        }
      })
      if (round) {
        round = round.toJSON()
        round = Object.assign({}, round, { matches: [] })
        round = await getMatches(app, req, round)
        return res.send(helper.tj(round))
      }
      return res.send(helper.tj({}))
    } catch (error) {
      console.log(error)
    }
  })

  // Get Items
  async function getMatches (app, req, round, type = null) {
    let page = req.query.page ? parseInt(req.query.page) : 1
    let pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 15
    let offset = pageSize * (page - 1)
    try {
      let items = await app.models.Match.findAndCountAll({
        // attributes: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('start_at'), '%H'), 'dates']],
        include: [
          {
            model: app.models.Team,
            as: 'home'
          },
          {
            model: app.models.Team,
            as: 'away'
          }
        ],
        where: {
          round_id: round.id
        },
        // group: [Sequelize.fn('DAY', Sequelize.col('start_at'))],
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

      round.matches = data
      round.pagination = pagination
      return round
    } catch (error) {
      console.log(error)
      return null
    }
  }

  return router
}
