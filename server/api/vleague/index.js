import { Router } from 'express'
import roundRoute from './rounds'
import matchRoute from './matches'
import standingRoute from './standings'
import teamRoute from './teams'
const router = Router()

export default function (app) {
  router.use('/rounds', roundRoute(app))
  router.use('/matches', matchRoute(app))
  router.use('/standings', standingRoute(app))
  router.use('/teams', teamRoute(app))
  return router
}
