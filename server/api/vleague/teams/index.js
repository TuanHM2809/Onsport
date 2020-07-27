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
      let query = {
        // attributes: [{ exclude: ['created_at', 'updated_at'] }],
        attributes: {
          exclude: ['created_at', 'updated_at']
        },
        where: {
          vl_teamid: {
            $ne: null
          }
        }
      }
      let teams = await app.models.Team.findAll(query)
      if (teams.length > 0) {
        return res.send(helper.tj(teams))
      } else {
        return res.send(helper.sj([]))
      }
      // return res.send(helper.sj([], req.status_token))
    } catch (error) {
      return res.send(helper.ej(error))
      // console.log(error)
    }
  })
  router.get('/:teamId', async (req, res) => {
    try {
      req.checkParams('teamId', 'Mã vòng đấu không được bỏ trống').notEmpty()
      let team = await app.models.Team.findOne({
        attributes: { exclude: ['created_at', 'updated_at'] },
        where: {
          id: req.params.teamId
        }
      })

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
