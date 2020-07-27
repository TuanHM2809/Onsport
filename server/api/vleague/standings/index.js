import { Router } from 'express'
// import moment from 'moment'
// var Promise = require('bluebird')
// import _ from 'lodash'
// var Constant = require('../../../constants')
const router = Router()

export default app => {
  router.get('/latest', async (req, res) => {
    try {
      let round = await app.models.Round.findOne({
        include: [{
          model: app.models.VLStanding,
          as: 'vlStandings',
          include: [
            {
              model: app.models.Team,
              as: 'team',
              attributes: ['id', 'name', 'abbreviation', 'thumbnail']
            }
          ]
        }],
        order: [
          ['id', 'desc']
          // [app.models.Sequelize.literal('vlStandings.rank'), 'asc'] // TO DO
          // [app.models.VLStanding, 'rank', 'ASC']
        ]
      })
      if (round) {
        round = round.get({ plain: true }) // k hieu lam
        return res.send(helper.sj(round, 'Lấy thông tin thành công'))
      }
      return res.send(helper.sj({}, 'Không tìm thấy bảng xếp hạng'))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })
  router.get('/:roundId', async (req, res) => {
    req.checkParams('roundId', 'Không đúng định dạng roundId').notEmpty().isInt()
    try {
      let round = await app.models.Round.findOne({
        where: {
          id: req.params.roundId
        },
        include: [{
          model: app.models.VLStanding,
          as: 'vlStandings',
          include: [
            {
              model: app.models.Team,
              as: 'team',
              attributes: ['id', 'name', 'abbreviation', 'thumbnail']
            }
          ]
        }],
        order: [
          ['id', 'desc'],
          [app.models.Sequelize.literal('vlStandings.rank'), 'asc']
          // [app.models.VLStanding, 'rank', 'ASC']
        ]

      })
      if (round) {
        round = round.get({ plain: true }) // k hieu lam
        return res.send(helper.sj(round, req.status_token, 'Lấy thông tin thành công'))
      }
      return res.send(helper.sj({}, req.status_token, 'Không tìm thấy bảng xếp hạng'))
    } catch (error) {
      return res.send(helper.ej(error, 500))
    }
  })

  return router
}
