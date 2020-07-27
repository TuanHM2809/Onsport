// require('dotenv').config('../../.env')
import moment from 'moment'
const json_web_token = require("jsonwebtoken");
const _ = require('lodash')

let platform = ['Web', 'Phone']
export function jwt(app) {
  async function getPlatform(platformName, redis) {
    let platformItem = {}
    let cacheName = 'platform_' + platformName.toLowerCase()
    if (!_.isEmpty(redis)) {
      let plaformCache = await redis.getAsync(cacheName)
      if (plaformCache) {
        platformItem = JSON.parse(plaformCache)
      } else {
        platformItem = await app.models.Platform.findOne({
          attributes: ['id'],
          where: {
            name: platformName
          }
        })
        redis.set(cacheName, JSON.stringify(platformItem), 'EX', 1892160000) //60 * 60 * 60 * 24 * 365 = 1892160000
      }
    } else {
      platformItem = await app.models.Platform.findOne({
        attributes: ['id'],
        where: {
          name: platformName
        }
      })
    }
    return platformItem
  }

  async function getUserToken(accessToken, redis) {
    let token = {}
    let tokenDecode = json_web_token.decode(accessToken)
    if (tokenDecode != null && tokenDecode.hasOwnProperty('id') && tokenDecode.hasOwnProperty('exp')) {
      var cacheName = 'user_token_' + tokenDecode.id + '_' + tokenDecode.exp
    } else {
      return null
    }
    if (!_.isEmpty(redis)) {
      token = await redis.getAsync(cacheName)
      if (token) {
        token = JSON.parse(token)
      } else {
        token = await app.models.UserToken.findOne({
          where: {
            access_token_on_sport: accessToken
          }
        })
        redis.set(cacheName, JSON.stringify(token), 'EX', 432000) //60 * 60 * 60 * 2 = 432000
      }
    } else {
      token = await app.models.UserToken.findOne({
        where: {
          access_token_on_sport: accessToken
        }
      })
    }
    return token
  }

  async function getUserBan(userId, redis) {
    let userBan = {}
    var cacheName = 'user_ban_' + userId
    if (!_.isEmpty(redis)) {
      userBan = await redis.getAsync(cacheName)
      if (userBan) {
        userBan = JSON.parse(userBan)
      } else {
        userBan = await app.models.UserBan.findOne({
          where: {
            user_id: userId,
            status: true
          }
        })
        redis.set(cacheName, JSON.stringify(userBan), 'EX', 432000) //60 * 60 * 60 * 2 = 432000
      }
    } else {
      userBan = await app.models.UserBan.findOne({
        where: {
          user_id: userId,
          status: true
        }
      })
    }
    return userBan
  }

  async function getUserInfo(userId, redis) {
    let userInfo = {}
    var cacheName = 'user_info_' + userId
    if (!_.isEmpty(redis)) {
      userInfo = await redis.getAsync(cacheName)
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
      } else {
        userInfo = await app.models.User.findOne({
          where: {
            id: userId
          }
        })
        redis.set(cacheName, JSON.stringify(userInfo), 'EX', 432000) //60 * 60 * 60 * 2 = 432000
      }
    } else {
      userInfo = await app.models.User.findOne({
        where: {
          id: userId
        }
      })
    }
    return userInfo
  }

  return async (req, res, next) => {
    try {
      let redis = await require('../config/client')
      let platformName = req.query.platform && platform.indexOf(req.query.platform) !== -1 ? req.query.platform : 'Web'
      let platformItem = {}
      if (redis) {
        platformItem = await getPlatform(platformName, redis)
      } else {
        platformItem = await getPlatform(platformName, {})
      }
      req.platform_id = platformItem.id

      if (req.headers.authorization) {
        var authorizationCode = req.headers.authorization.split(' ')
        let accessToken
        if (authorizationCode[0] !== 'Bearer') {
          req.status_token = 400
          return next()
        }
        accessToken = authorizationCode[1]
        var userToken = null
        if (redis) {
          userToken = await getUserToken(accessToken, redis)
        } else {
          userToken = await getUserToken(accessToken, {})
        }
        if (!_.isEmpty(userToken)) {
          if (moment(userToken.expired_at).isAfter(moment.now())) {
            // Check Ban User.
            let userBan = null
            if (redis) {
              userBan = await getUserBan(userToken.user_id, redis)
            } else {
              userBan = await getUserBan(userToken.user_id, {})
            }
            if (_.isEmpty(userBan)) {
              req.status_token = 0
              if (redis) {
                req.user = await getUserInfo(userToken.user_id, redis)
              } else {
                req.user = await getUserInfo(userToken.user_id, {})
              }
            } else {
              req.status_token = 450
              // return res.send(helper.ej('User bị ban', 450, false, 'User ban!'))
            }
          } else {
            req.status_token = 498
            // return res.send(helper.ej('Token hết hạn', 498, false, 'Token expired!'))
          }
        } else {
          req.status_token = 404
          // return res.send(helper.ej('Token không tồn tại', 400, false, 'Token không tồn tại!'))
        }
      } else {
        req.status_token = 400
      }
    } catch (error) {
      req.status_token = 400
    }
    return next()
  }
}
