import { Router } from 'express'
const router = Router()

export default function (app) {
  router.get('/', async (req, res) => {
    let fields = req.query.fields ? req.query.fields : null
    if (fields) {
      let settings
      try {
        let client = await require('../../../config/client')
        if (client) {
          settings = await client.getAsync('settings')
          if (settings) {
            settings = JSON.parse(settings)
            fields = fields.split(',')
            settings = settings.filter(s => {
              return fields.indexOf(s.key) !== -1
            })
            return res.send(helper.sj(settings, req.status_token))
          } else {
            settings = await getSettings(app)
            client.set('settings', JSON.stringify(settings), 'EX', 60 * 60 * 24 * 30)
            fields = fields.split(',')
            settings = settings.filter(s => {
              return fields.indexOf(s.key) !== -1
            })
            return res.send(helper.sj(settings, req.status_token))
          }
        } else {
          settings = await getSettings(app)
          return res.send(helper.sj(settings, req.status_token))
        }
      } catch (e) {
        return res.send(helper.ej(e, 500))
      }
    }
    return res.send(helper.ej(null, 400, false, 'Vui lòng truyền field cần lấy'))
  })

  return router
}

async function getSettings (app) {
  let settings = await app.models.Setting.findAll()
  settings = settings.map(s => {
    return s.toJSON()
  })
  return settings
}
