import { Router } from 'express'
import cateRoute from './categories'
import userRoute from './users'
import videoRoute from './videos'
import postRoute from './posts'
import top11NotificationRoute from './top11_notifications'
import matchRoute from './matches'
import t11MatchRoute from './t11Matches'
import eventRoute from './events'

import sportRoute from './sports'
import tournamentRoute from './tournaments'
import tagRoute from './tags'
import itemCommentRoute from './itemComments'
import itemLikeRoute from './itemLikes'
import galleryRoute from './gallery'
import homeRoute from './home'
import menuRoute from './navMenu'
import fileRoute from './files'
import punditRoute from './pundits'
import authorRoute from './authors'
import liveChannelRoute from './liveChannels'
import settingRoute from './settings'
import searchRoute from './search'
import matchResultRoute from './matchResult'
import topView from './topView'
let { jwt } = require('../../middleware/jwt')

const router = Router()

export default function (app) {
  router.use(jwt(app))
  router.use('/users', userRoute(app))
  router.use('/sports', sportRoute(app))
  router.use('/tournaments', tournamentRoute(app))
  router.use('/comments', itemCommentRoute(app))
  router.use('/categories', cateRoute(app))
  router.use('/videos', videoRoute(app))
  router.use('/posts', postRoute(app))
  router.use('/tags', tagRoute(app))
  router.use('/gallery', galleryRoute(app))
  router.use('/home', homeRoute(app))
  router.use('/likes', itemLikeRoute(app))
  router.use('/top11', top11NotificationRoute(app))
  router.use('/t11Matches', t11MatchRoute(app))
  router.use('/matches', matchRoute(app))
  router.use('/events', eventRoute(app))
  router.use('/menu', menuRoute(app))
  router.use('/file', fileRoute(app))
  router.use('/pundits', punditRoute(app))
  router.use('/authors', authorRoute(app))
  router.use('/live-channels', liveChannelRoute(app))
  router.use('/settings', settingRoute(app))
  router.use('/search', searchRoute(app))
  router.use('/match-results', matchResultRoute(app))
  router.use('/top-view', topView(app))
  return router
}
// Add USERS Routes
