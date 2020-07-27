import {
  Router
} from 'express'
import apiRoute from './frontend'
// import vleagueRoute from './vleague'
import users from './users'
import auth from './auth'

const router = Router()

// Add USERS Routes
router.use(users)

export default function (app) {
  router.use(auth(app))

  router.use('/v1', apiRoute(app))

  // router.use('/vl', vleagueRoute(app))

  router.use((req, res) => {
    return res.send('NOT FOUND nhe')
  })

  return router
}
