import { Router } from 'express'
import moment from 'moment'
import _ from 'lodash'
const router = Router()

export default (app) => {
  router.get('/', async (req, res) => {
    let results
    try {
      let client = await require('../../../config/client')
      if (client) {
        results = await client.getAsync('match_results')
        if (results) {
          results = JSON.parse(results)
          if (results.length > 0) {
            return res.send(helper.sj(results, req.status_token))
          }
          return res.send(helper.sj([], req.status_token))
        } else {
          results = await getMatchResult(app)
          client.set('match_results', JSON.stringify(results), 'EX', 60 * 60)
          if (results.length > 0) {
            return res.send(helper.sj(results, req.status_token))
          }
          return res.send(helper.sj([], req.status_token))
        }
      } else {
        results = await getMatchResult(app)
        if (results.length > 0) {
          return res.send(helper.sj(results, req.status_token))
        }
        return res.send(helper.sj([], req.status_token))
      }
      // let results = await app.models.MatchResult.findAll({
      //   where: {
      //     $or: [
      //       {
      //         end_at: {
      //           $gte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
      //         }
      //       },
      //       {
      //         end_at: null
      //       }
      //     ]
      //   },
      //   order: [
      //     ['start_at', 'ASC']
      //   ]
      // })
      // if (results.length > 0) {
      //   return res.send(helper.sj(results, req.status_token))
      // }
      // return res.send(helper.sj([], req.status_token))
    } catch (e) {
      console.log(e)
      return res.send(helper.ej(e, 500))
    }
    // if (client) {
    //   responseData = await client.getAsync('home_phone')
    //   if (responseData) {
    //     responseData = JSON.parse(responseData)
    //     return res.send(helper.sj(responseData, req.status_token))
    //   } else {
    //     responseData = await getItemPhone(req)
    //     client.set('home_phone', JSON.stringify(responseData), 'EX', 60 * 60)
    //     return res.send(helper.sj(responseData, req.status_token))
    //   }
    // } else {
    //   responseData = await getItemPhone(req)
    //   return res.send(helper.sj(responseData, req.status_token))
    // }
  })
  return router
}

async function getMatchResult (app) {
  try {
    let results = await app.models.MatchResult.findAll({
      where: {
        $or: [
          {
            end_at: {
              $gte: app.models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 7 HOUR)')
            }
          },
          {
            end_at: null
          }
        ]
      },
      order: [
        ['start_at', 'ASC']
      ]
    })
    if (results.length > 0) {
      results = results.map(r => {
        r = r.toJSON()
        return r
      })
      return results
    }
    return []
  } catch (e) {
    console.log(e)
    return e
  }
}
