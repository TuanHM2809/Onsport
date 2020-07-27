import {
  Router
} from 'express'
import axios from 'axios'
import _ from 'lodash'
const router = Router()
const moment = require('moment-timezone')
export default function (app) {
  var phoneLib = require('phone')
  // Done
  router.get('/callback', async (req, res) => {
    try {
      let code = req.query.code ? req.query.code : ''
      if (code !== '') {
        let responseGetAccessToken = await axios.post(process.env.SSO_OAUTH_URL + '/GetAccessToken', {
          Client_Id: process.env.SSO_CLIENT_WEB,
          Client_Secret: process.env.SSO_KEY_WEB,
          Code: code
        })
        if (responseGetAccessToken && responseGetAccessToken.data.Status.Code === 1) {
          var accessTokenCab = responseGetAccessToken.data.Data
          try {
            let responseGetUserProfile = await axios.post(process.env.SSO_OAUTH_URL + '/GetProfile', {
              Client_Id: process.env.SSO_CLIENT_WEB,
              Client_Secret: process.env.SSO_KEY_WEB,
              Token: accessTokenCab
            })
            if (responseGetUserProfile && responseGetUserProfile.data.Status.Code === 1) {
              let userCabProfile = responseGetUserProfile.data.Data
              var verifyFlag = false
              // Filter phone of response cab and check verifyFlag
              let userPhone = userCabProfile.ListPhone.map(function (phone) {
                if (phone.STATUS === 1) {
                  verifyFlag = true
                }
                return {
                  'phone': phone.PHONENUMBER,
                  'verify': phone.STATUS,
                  'is_default': phone.ISDEFAULT
                }
              })
              // Filter email of response cab
              let userEmail = userCabProfile.ListEmail.map(function (email) {
                return {
                  'phone': email.EMAIL,
                  'verify': email.STATUS,
                  'is_default': email.ISDEFAULT
                }
              })
              // temp profile
              let userOnSportProfile = {
                cab_id: userCabProfile.IDENTITYID,
                username: userCabProfile.USERNAME !== '' ? userCabProfile.USERNAME : null,
                name: userCabProfile.FULLNAME,
                dob: moment(userCabProfile.YEAROFBIRTH + '-' + userCabProfile.MONTHOFBIRTH + '-' + userCabProfile.DAYOFBIRTH, 'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                avatar: userCabProfile.AVATAR,
                address: '',
                verify: verifyFlag
              }
              // Find User By Cab Id
              var user = await app.models.User.findOne({
                where: {
                  'cab_id': userOnSportProfile.cab_id
                }
              })
              // Save Profile
              let token = {}
              if (user === null) {
                // Create new user
                user = await app.models.User.create(userOnSportProfile)
              } else {
                // Remove User Phone of User
                await app.models.UserPhone.destroy({
                  where: {
                    user_id: user.id
                  }
                })
                // Remove User Phone of User
                await app.models.UserEmail.destroy({
                  where: {
                    user_id: user.id
                  }
                })
                // Clear cache user profile
                await clearCacheUserProfile(user.id)
              }
              // create token
              token = helper.tokenFromUser(user)
              let expireAt = moment().add(6, 'M').format('YYYY-MM-DD HH:mm:ss')
              await app.models.UserToken.create({
                'user_id': user.id,
                'access_token_cab': accessTokenCab,
                'access_token_on_sport': token.accessToken,
                'refresh_token_on_sport': token.refreshToken,
                'expired_at': expireAt
              })
              // Create New User Phone
              userPhone = userPhone.map(function (item) {
                return {
                  'user_id': user.id,
                  'phone': item.phone,
                  'verify': item.verify,
                  'is_default': item.is_default
                }
              })
              let newUserPhone = await app.models.UserPhone.bulkCreate(userPhone, {
                fields: ['user_id', 'phone', 'verify', 'is_default'],
                returning: true
              })
              // Create New User Email
              userEmail = userEmail.map(function (item) {
                return {
                  'user_id': user.id,
                  'phone': item.phone,
                  'verify': item.verify,
                  'is_default': item.is_default
                }
              })
              let newUserEmail = await app.models.UserEmail.bulkCreate(userEmail, {
                fields: ['user_id', 'email', 'verify', 'is_default'],
                returning: true
              })
              // Get User Profile

              let userDevices = await user.getUserDevice()
              user = user.toJSON()
              user.access_token = token.accessToken
              user.phones = newUserPhone
              user.emails = newUserEmail
              user.devices = userDevices
              // Set session

              req.session.user = user
              return res.redirect('/login/test?code=' + user.access_token)
            } else {
              return res.send(helper.ej('Không lấy được profile', 400, false, 'Không lấy được profile'))
            }
          } catch (error) {
            console.log(error)
            return res.send(helper.ej(error.message, 500, false))
          }
        } else {
          return res.send(helper.ej('Không lấy được token', -1, false, 'Không lấy được token'))
        }
      } else {
        return res.send(helper.ej('Code is required', 400, false, 'Code is required'))
      }
    } catch (e) {
      console.log(e)
      return res.send(helper.ej(e.message, 500, false))
    }
  })

  // Done
  router.post('/check-code', async (req, res) => {
    req.checkBody('code', 'Code is required').notEmpty()
    req.checkBody('deviceId', 'DeviceId is required').notEmpty()
    req.checkBody('deviceToken', 'DeviceToken required').notEmpty()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej((result.array())[0].msg, 400, false, (result.array())[0].msg))
    }
    try {
      let code = req.body.code
      let deviceId = req.body.deviceId
      let deviceToken = req.body.deviceToken
      let responseGetAccessToken = await axios.post(process.env.SSO_OAUTH_URL + '/GetAccessToken', {
        Client_Id: process.env.SSO_CLIENT_WEB,
        Client_Secret: process.env.SSO_KEY_WEB,
        Code: code,
        DeviceId: deviceId
      })
      if (responseGetAccessToken && responseGetAccessToken.data.Status.Code === 1) {
        var accessTokenCab = responseGetAccessToken.data.Data
        try {
          let responseGetUserProfile = await axios.post(process.env.SSO_OAUTH_URL + '/GetProfile', {
            Client_Id: process.env.SSO_CLIENT_WEB,
            Client_Secret: process.env.SSO_KEY_WEB,
            Token: accessTokenCab
          })
          if (responseGetUserProfile && responseGetUserProfile.data.Status.Code === 1) {
            let userCabProfile = responseGetUserProfile.data.Data
            var verifyFlag = false
            // Filter phone of response cab and check verifyFlag
            let userPhone = userCabProfile.ListPhone.map(function (phone) {
              if (phone.STATUS === 1) {
                verifyFlag = true
              }
              return {
                'phone': phone.PHONENUMBER,
                'verify': phone.STATUS,
                'is_default': phone.ISDEFAULT
              }
            })
            // Filter email of response cab
            let userEmail = userCabProfile.ListEmail.map(function (email) {
              return {
                'phone': email.EMAIL,
                'verify': email.STATUS,
                'is_default': email.ISDEFAULT
              }
            })
            // temp profile
            let userOnSportProfile = {
              cab_id: userCabProfile.IDENTITYID,
              username: userCabProfile.USERNAME !== '' ? userCabProfile.USERNAME : null,
              name: userCabProfile.FULLNAME,
              dob: moment(userCabProfile.YEAROFBIRTH + '-' + userCabProfile.MONTHOFBIRTH + '-' + userCabProfile.DAYOFBIRTH, 'YYYY-MM-DD').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
              avatar: userCabProfile.AVATAR,
              address: '',
              verify: verifyFlag
            }
            // Find user by cab id
            var user = await app.models.User.findOne({
              where: {
                'cab_id': userOnSportProfile.cab_id
              }
            })
            // let jwtToken = ''
            if (user === null) {
              // Create new user
              user = await app.models.User.create(userOnSportProfile)
              // Create user device
              await app.models.UserDevice.create({
                'user_id': user.id,
                'device_id': deviceId,
                'device_token': deviceToken,
                'is_login': true
              })
            } else {
              // Remove User Phone of User
              await app.models.UserPhone.destroy({
                where: {
                  user_id: user.id
                }
              })
              // Remove User Phone of User
              await app.models.UserEmail.destroy({
                where: {
                  user_id: user.id
                }
              })
              // Check user device
              let device = await app.models.UserDevice.findOne({
                where: {
                  'device_id': deviceId,
                  'user_id': user.id
                }
              })
              if (device === null) {
                await app.models.UserDevice.create({
                  'user_id': user.id,
                  'device_id': deviceId,
                  'device_token': deviceToken,
                  'is_login': true
                })
              } else {
                if (device.is_login === false) {
                  await app.models.UserDevice.update({
                    'is_login': true
                  }, {
                    where: {
                      'device_id': deviceId,
                      'user_id': user.id
                    }
                  })
                }
              }
              // Clear cache user profile
              await clearCacheUserProfile(user.id)
            }
            // Create New Token
            let token = helper.tokenFromUser(user)
            let expireAt = moment().add(6, 'M').format('YYYY-MM-DD HH:mm:ss')
            await app.models.UserToken.create({
              'user_id': user.id,
              'access_token_cab': accessTokenCab,
              'access_token_on_sport': token.accessToken,
              'refresh_token_on_sport': token.refreshToken,
              'expired_at': expireAt
            })
            // Create New User Phone
            userPhone = userPhone.map(function (item) {
              return {
                'user_id': user.id,
                'phone': item.phone,
                'verify': item.verify,
                'is_default': item.is_default
              }
            })
            let newUserPhone = await app.models.UserPhone.bulkCreate(userPhone, {
              fields: ['user_id', 'phone', 'verify', 'is_default'],
              returning: true
            })
            // Create New User Email
            userEmail = userEmail.map(function (item) {
              return {
                'user_id': user.id,
                'phone': item.phone,
                'verify': item.verify,
                'is_default': item.is_default
              }
            })
            let newUserEmail = await app.models.UserEmail.bulkCreate(userEmail, {
              fields: ['user_id', 'email', 'verify', 'is_default'],
              returning: true
            })
            // Get User Profile
            let userDevices = await user.getUserDevice()
            user = user.toJSON()
            user.token = token
            user.phones = newUserPhone
            user.emails = newUserEmail
            user.devices = userDevices
            return res.send(helper.sj(user))
          } else {
            return res.send(helper.ej('Không lấy được profile', 404, false, 'Không lấy được profile'))
          }
        } catch (error) {
          console.log(error)
          return res.send(helper.ej(error.message, 500, false))
        }
      } else {
        return res.send(helper.ej('Không lấy được token', 404, false, 'Không lấy được token'))
      }
    } catch (error) {
      console.log(error)
      return res.send(helper.ej(error.message, 500, false))
    }
  })

  // Done
  router.post('/social-login', async (req, res) => {
    let type = req.body.type ? req.body.type : ''
    let openUserId = req.body.openUserId ? req.body.openUserId : ''
    let deviceId = req.body.deviceId ? req.body.deviceId : ''
    let deviceToken = req.body.deviceToken ? req.body.deviceToken : ''
    let clientId = ''
    let clientSecret = ''
    if (deviceId !== '') {
      clientId = process.env.SSO_CLIENT_MOBILE
      clientSecret = process.env.SSO_KEY_MOBILE
    } else {
      clientId = process.env.SSO_CLIENT_WEB
      clientSecret = process.env.SSO_KEY_WEB
    }
    // let types = ['facebook', 'google']
    if (type !== '' && openUserId !== '') {
      if (type === 'facebook') {
        // GET ACCESS CODE CAB
        try {
          let responseGetCode = await axios.post(process.env.SSO_AUTHEN_URL + '/AuthenOpenId', {
            Client_Id: clientId,
            Client_Secret: clientSecret,
            OpenUserId: openUserId,
            FullName: req.body.fullName ? req.body.fullName : null,
            UserEmail: req.body.userEmail ? req.body.userEmail : null,
            PhoneNumber: req.body.phoneNumber ? req.body.phoneNumber : null,
            Gender: req.body.gender ? req.body.gender : null,
            ProfileLink: req.body.profileLink ? req.body.profileLink : null,
            ResourceType: 1,
            UserApp: req.body.userApp ? req.body.userApp : null
          })
          if (responseGetCode && responseGetCode.data.Status.Code === 1) {
            let code = responseGetCode.data.Data
            let responseGetAccessToken = null
            if (deviceId !== '') {
              responseGetAccessToken = await axios.post(process.env.SSO_OAUTH_URL + '/GetAccessToken', {
                Client_Id: clientId,
                Client_Secret: clientSecret,
                Code: code,
                DeviceId: deviceId
              })
            } else {
              responseGetAccessToken = await axios.post(process.env.SSO_OAUTH_URL + '/GetAccessToken', {
                Client_Id: clientId,
                Client_Secret: clientSecret,
                Code: code
              })
            }
            if (responseGetAccessToken && responseGetAccessToken.data.Status.Code === 1) {
              var accessTokenCab = responseGetAccessToken.data.Data
              try {
                let responseGetUserProfile = await axios.post(process.env.SSO_OAUTH_URL + '/GetProfile', {
                  Client_Id: clientId,
                  Client_Secret: clientSecret,
                  Token: accessTokenCab
                })

                if (responseGetUserProfile && responseGetUserProfile.data.Status.Code === 1) {
                  let userCabProfile = responseGetUserProfile.data.Data
                  var verifyFlag = false
                  // Filter phone of response cab and check verifyFlag
                  let userPhone = userCabProfile.ListPhone.map(function (phone) {
                    if (phone.STATUS === 1) {
                      verifyFlag = true
                    }
                    return {
                      'phone': phone.PHONENUMBER,
                      'verify': phone.STATUS,
                      'is_default': phone.ISDEFAULT
                    }
                  })
                  // Filter email of response cab
                  let userEmail = userCabProfile.ListEmail.map(function (email) {
                    return {
                      'phone': email.EMAIL,
                      'verify': email.STATUS,
                      'is_default': email.ISDEFAULT
                    }
                  })
                  // temp profile
                  let userOnSportProfile = {
                    cab_id: userCabProfile.IDENTITYID,
                    username: userCabProfile.USERNAME !== '' ? userCabProfile.USERNAME : null,
                    name: userCabProfile.FULLNAME,
                    dob: moment(userCabProfile.YEAROFBIRTH + '-' + userCabProfile.MONTHOFBIRTH + '-' + userCabProfile.DAYOFBIRTH, 'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss'),
                    avatar: userCabProfile.AVATAR,
                    address: '',
                    verify: verifyFlag
                  }
                  // Find user by cab id
                  var user = await app.models.User.findOne({
                    where: {
                      'cab_id': userOnSportProfile.cab_id
                    }
                  })
                  // let jwtToken = ''
                  if (user === null) {
                    // Create new user
                    user = await app.models.User.create(userOnSportProfile)
                    // Create user device
                    if (deviceId !== '') {
                      await app.models.UserDevice.create({
                        'user_id': user.id,
                        'device_id': deviceId,
                        'device_token': deviceToken,
                        'is_login': true
                      })
                    }
                  } else {
                    // Remove User Phone of User
                    await app.models.UserPhone.destroy({
                      where: {
                        user_id: user.id
                      }
                    })
                    // Remove User Phone of User
                    await app.models.UserEmail.destroy({
                      where: {
                        user_id: user.id
                      }
                    })
                    // Check user device
                    if (deviceId !== '') {
                      let device = await app.models.UserDevice.findOne({
                        where: {
                          'device_id': deviceId,
                          'user_id': user.id
                        }
                      })
                      if (device === null) {
                        await app.models.UserDevice.create({
                          'user_id': user.id,
                          'device_id': deviceId,
                          'device_token': deviceToken,
                          'is_login': true
                        })
                      } else {
                        if (device.is_login === false) {
                          await app.models.UserDevice.update({
                            'is_login': true
                          }, {
                            where: {
                              'device_id': deviceId,
                              'user_id': user.id
                            }
                          })
                        }
                      }
                    }
                    // Clear cache user profile
                    await clearCacheUserProfile(user.id)
                  }
                  // Create New Token
                  let token = helper.tokenFromUser(user)
                  let expireAt = moment().add(6, 'M').format('YYYY-MM-DD HH:mm:ss')
                  await app.models.UserToken.create({
                    'user_id': user.id,
                    'access_token_cab': accessTokenCab,
                    'access_token_on_sport': token.accessToken,
                    'refresh_token_on_sport': token.refreshToken,
                    'expired_at': expireAt
                  })
                  // Create New User Phone
                  userPhone = userPhone.map(function (item) {
                    return {
                      'user_id': user.id,
                      'phone': item.phone,
                      'verify': item.verify,
                      'is_default': item.is_default
                    }
                  })
                  let newUserPhone = await app.models.UserPhone.bulkCreate(userPhone, {
                    fields: ['user_id', 'phone', 'verify', 'is_default'],
                    returning: true
                  })
                  // Create New User Email
                  userEmail = userEmail.map(function (item) {
                    return {
                      'user_id': user.id,
                      'phone': item.phone,
                      'verify': item.verify,
                      'is_default': item.is_default
                    }
                  })
                  let newUserEmail = await app.models.UserEmail.bulkCreate(userEmail, {
                    fields: ['user_id', 'email', 'verify', 'is_default'],
                    returning: true
                  })
                  // Get User Profile
                  let userDevices = await user.getUserDevice()
                  user = user.toJSON()
                  user.token = token
                  user.phones = newUserPhone
                  user.emails = newUserEmail
                  user.devices = userDevices
                  return res.send(helper.sj(user))
                } else {
                  return res.send(helper.ej('Không lấy được profile', 404, false, 'Không lấy được profile'))
                }
              } catch (error) {
                console.log(error)
                return res.send(helper.ej(error.message, 500, false))
              }
            } else {
              return res.send(helper.ej('Không lấy được token', 404, false, 'Không lấy được token'))
            }
          } else {
            return res.send(helper.ej('Không get được code', 404, false, 'Không get được code'))
          }
        } catch (error) {
          console.log(error)
          return res.send(helper.ej(error, 500, false))
        }
        // GET PROFILE
      } else if (type === 'google') {
        return res.send(helper.ej('Not support', 400, false, 'Not support'))
      } else {
        return res.send(helper.ej('Type không đúng', 400, false, 'Type không đúng'))
      }
    } else {
      return res.send(helper.ej('Type and OpenUserId is required', 400, false, 'Type and OpenUserId is required'))
    }
  })

  // Done
  router.post('/send-otp', async (req, res) => {
    let token = req.body.token ? req.body.token : ''
    let phone = req.body.phone ? req.body.phone : ''
    if (token !== '' && phone !== '') {
      // regex phone.
      phone = phoneLib(phone, 'VN')
      if (phone.length !== 0) {
        phone = '0' + phone[0].substring(3)
        if (detectPhoneNumber(phone)) {
          let isVerify = helper.checkVerifyToken(token)
          if (isVerify) {
            let userToken = helper.userFromAuthToken(token)
            let timeUnix = moment().unix()
            if (timeUnix < userToken.exp) {
              let userTokenData = await getUserToken(token, userToken.id, userToken.exp)
              let cabToken = userTokenData.access_token_cab
              let userPhone = app.models.UserPhone.findOne({
                where: {
                  'user_id': userToken.id,
                  'phone': phone
                }
              })
              if (userPhone !== null && userPhone.verify === true) {
                return res.send(helper.ej('Số điện thoại này đã được verify trước đó.', 409, false, 'Số điện thoại này đã được verify trước đó.'))
              } else {
                try {
                  let responseSendOTP = await axios.post(process.env.SSO_AUTHEN_URL + '/SendOTP', {
                    Client_Id: process.env.SSO_CLIENT_MOBILE,
                    Client_Secret: process.env.SSO_KEY_MOBILE,
                    Token: cabToken,
                    Phone: phone
                  })
                  if (responseSendOTP && responseSendOTP.data.Status.Code === 1) {
                    if (userPhone === null) {
                      try {
                        await app.models.UserPhone.create({
                          'user_id': userToken.user_id,
                          'phone': phone,
                          'verify': false,
                          'is_default': false
                        })
                        await clearCacheUserProfile(userToken.user_id)
                      } catch (error) {
                        return res.send(helper.ej(error, 500))
                      }
                    }
                    return res.send(helper.sj(null, 0, 'Success'))
                  } else {
                    return res.send(helper.ej(responseSendOTP.data, 500))
                  }
                } catch (error) {
                  console.log(error)
                  return res.send(helper.ej(error, 500))
                }
              }
            } else {
              return res.send(helper.ej('Token không đúng.', 400, false, 'Token không đúng.'))
            }
          } else {
            return res.send(helper.ej('Token không đúng.', 400, false, 'Token không đúng.'))
          }
        } else {
          return res.send(helper.ej('Số điện thoại không đúng.', 400, false, 'Số điện thoại không đúng.'))
        }
      } else {
        return res.send(helper.ej('Số điện thoại không đúng.', 400, false, 'Số điện thoại không đúng.'))
      }
    } else {
      return res.send(helper.ej('Phone and Token is required', 400, false, 'Phone and Token is required'))
    }
  })

  // Done
  router.post('/verify-otp', async (req, res) => {
    let token = req.body.token ? req.body.token : ''
    let phone = req.body.phone ? req.body.phone : ''
    let otp = req.body.otp ? req.body.otp : ''
    if (token !== '' && phone !== '' && otp !== '') {
      // regex phone.
      phone = phoneLib(phone, 'VN')
      if (phone.length !== 0) {
        phone = '0' + phone[0].substring(3)
        if (detectPhoneNumber(phone)) {
          let dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
          let userToken = await app.models.UserToken.findOne({
            where: {
              'access_token_on_sport': token,
              'expired_at': {
                $gt: dateNow
              }
            }
          })
          if (userToken !== null) {
            let cabToken = userToken.toJSON().access_token_cab
            // call api send otp.
            try {
              let responseVerifyOTP = await axios.post(process.env.SSO_AUTHEN_URL + '/VerifyOTP', {
                Client_Id: process.env.SSO_CLIENT_MOBILE,
                Client_Secret: process.env.SSO_KEY_MOBILE,
                Otp: otp,
                Token: cabToken,
                Phone: phone
              })
              if (responseVerifyOTP && responseVerifyOTP.data.Status.Code === 1) {
                await app.models.UserPhone.update({
                  'verify': true
                }, {
                  where: {
                    'user_id': userToken.user_id,
                    'phone': phone
                  }
                })
                await app.models.User.update({
                  'verify': true
                }, {
                  where: {
                    'id': userToken.user_id
                  }
                })
                await clearCacheUserProfile(userToken.user_id)
                return res.send(helper.sj(null, 0, 'Verify success!'))
              } else {
                return res.send(helper.ej(responseVerifyOTP.data, 500, false, responseVerifyOTP.data.Status.Message))
              }
            } catch (error) {
              console.log(error)
              return res.send(helper.ej(error, 500))
            }
          } else {
            return res.send(helper.ej('Token không đúng.', 400, false, 'Token không đúng.'))
          }
        } else {
          return res.send(helper.ej('Số điện thoại không đúng.', 400, false, 'Số điện thoại không đúng.'))
        }
      } else {
        return res.send(helper.ej('Số điện thoại không đúng.', 400, false, 'Số điện thoại không đúng.'))
      }
    } else {
      return res.send(helper.ej('Phone and Token and Otp is required', 400, false, 'Phone and Token and Otp is required'))
    }
  })

  // Done
  router.get('/get-profile', async (req, res) => {
    let token = req.query.token ? req.query.token : ''
    if (token !== '') {
      let isVerify = helper.checkVerifyToken(token)
      if (isVerify) {
        let userToken = helper.userFromAuthToken(token)
        let timeUnix = moment().unix()
        if (timeUnix < userToken.exp) {
          let userProfile = await getProfileUser(userToken.id)
          if (userProfile !== null) {
            let userTokenData = await getUserToken(token, userToken.id, userToken.exp)
            if (userTokenData !== null) {
              userProfile.token = {
                accessToken: userTokenData.access_token_on_sport,
                refreshToken: userTokenData.refresh_token_on_sport
              }
            }
            return res.send(helper.sj(userProfile))
          } else {
            return res.send(helper.ej('Không tìm thấy thông tin user.', 404, false, 'Không tìm thấy thông tin user.'))
          }
        } else {
          return res.send(helper.ej('Token đã hết hạn.', 404, false, 'Token đã hết hạn.'))
        }
      } else {
        return res.send(helper.ej('Token không đúng.', 404, false, 'Token không đúng.'))
      }
    } else {
      return res.send(helper.ej('Token is required', 400, false, 'Token is required'))
    }
  })

  // Done
  router.post('/logout', async (req, res) => {
    let token = req.body.token ? req.body.token : ''
    let deviceId = req.body.deviceId ? req.body.deviceId : ''
    if (token !== '') {
      try {
        let dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
        let userToken = await app.models.UserToken.findOne({
          where: {
            'access_token_on_sport': token,
            'expired_at': {
              $gt: dateNow
            }
          }
        })
        if (userToken !== null) {
          try {
            let responseLogOut = await axios.post(process.env.SSO_AUTHEN_URL + '/LogoutApp', {
              Client_Id: process.env.SSO_CLIENT_WEB,
              Client_Secret: process.env.SSO_KEY_WEB,
              Token: userToken.access_token_cab
            })
            if (responseLogOut && responseLogOut.data.Status.Code === 1) {
              if (deviceId !== '') {
                await app.models.UserDevice.destroy({
                  where: {
                    'device_id': deviceId,
                    'user_id': userToken.user_id
                  }
                })
              }
              await userToken.destroy()
              await clearCacheUserToken(userToken.user_id)
              req.getUrl = function () {
                return req.protocol + '://' + req.get('host') + req.originalUrl
              }
              delete req.session.user
              // return res.redirect(process.env.SSO_SERVER + '/Logout?ur=' + req.getUrl())
              return res.send(helper.sj(null, 0, 'Success!'))
            } else {
              return res.send(helper.ej(responseLogOut.data, 500))
            }
          } catch (error) {
            console.log(error)
            return res.send(helper.ej(error, 500))
          }
        } else {
          return res.send(helper.ej('Token không đúng.', 404, false, 'Token không đúng.'))
        }
      } catch (error) {
        console.log(error)
        return res.send(helper.ej(error, 500))
      }
    } else {
      return res.send(helper.ej('Token is required', 400, false, 'Token is required'))
    }
  })

  // Done
  router.post('/update-profile', async (req, res) => {
    req.checkBody('token', 'Token không được để trống').notEmpty()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let token = req.body.token ? req.body.token : ''
    let name = req.body.name ? req.body.name : ''
    let dob = req.body.dob ? req.body.dob : ''
    if (!moment(dob, 'MM-DD-YYYY').isValid()) {
      return res.send(helper.ej(null, 400, false, 'Không đúng định dạng thời gian'))
    }
    let address = req.body.address ? req.body.address : ''
    if (token !== '') {
      try {
        let dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
        let userToken = await app.models.UserToken.findOne({
          where: {
            'access_token_on_sport': token,
            'expired_at': {
              $gt: dateNow
            }
          },
          include: [{
            association: 'user',
            attributes: ['username', 'cab_id']
          }]
        })
        if (userToken !== null) {
          try {
            let userUpdate = {}
            let objectUpdate = {
              Client_Id: process.env.SSO_CLIENT_MOBILE,
              Client_Secret: process.env.SSO_KEY_MOBILE,
              IdentityId: userToken.user.cab_id
            }
            if (name !== '') {
              userUpdate.name = name
              objectUpdate.FullName = name
            }
            if (dob !== '') {
              userUpdate.dob = moment(dob, 'MM-DD-YYYY').startOf('day').format('YYYY-MM-DD HH:mm:ss')
              objectUpdate.DayOfBirth = moment(dob, 'MM-DD-YYYY').startOf('day').format('DD')
              objectUpdate.MonthOfBirth = moment(dob, 'MM-DD-YYYY').startOf('day').format('MM')
              objectUpdate.YearOfBirth = moment(dob, 'MM-DD-YYYY').startOf('day').format('YYYY')
            }
            if (address !== '') {
              userUpdate.address = address
              objectUpdate.Address = address
            }
            let responseUpdateProfile = await axios.post(process.env.SSO_AUTHEN_URL + '/UpdateId', objectUpdate)
            if (responseUpdateProfile && responseUpdateProfile.data.Status.Code === 1) {
              try {
                await app.models.User.update(userUpdate, {
                  where: {
                    'id': userToken.user_id
                  }
                })
                await clearCacheUserProfile(userToken.user_id)
                let user = await getProfileUser(userToken.id)
                user.token = {
                  accessToken: userToken.access_token_on_sport,
                  refreshToken: userToken.refresh_token_on_sport
                }
                return res.send(helper.sj(user, 0, 'Update thành công'))
              } catch (error) {
                console.log(error)
                return res.send(helper.ej(error, 500))
              }
            } else {
              return res.send(helper.ej(responseUpdateProfile.data, 500, false, responseUpdateProfile.data.Status.Message))
            }
          } catch (error) {
            console.log(error)
            return res.send(helper.ej(error, 500))
          }
        } else {
          return res.send(helper.ej('Token không đúng.', 401, false, 'Token không đúng.'))
        }
      } catch (error) {
        console.log(error)
        return res.send(helper.ej(error, 500))
      }
    } else {
      return res.send(helper.ej('Token is required', 400, false, 'Token is required'))
    }
  })

  // Done
  router.post('/update-password', async (req, res) => {
    req.checkBody('token', 'Token không được để trống').notEmpty()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let token = req.body.token ? req.body.token : ''
    let oldPassword = req.body.oldPassword ? req.body.oldPassword : ''
    let newPassword = req.body.newPassword ? req.body.newPassword : ''
    if (token !== '') {
      try {
        let dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
        let userToken = await app.models.UserToken.findOne({
          where: {
            'access_token_on_sport': token,
            'expired_at': {
              $gt: dateNow
            }
          },
          include: [{
            association: 'user',
            attributes: ['username', 'cab_id']
          }]
        })
        if (userToken !== null) {
          try {
            let userUpdate = {}
            let objectUpdate = {
              Client_Id: process.env.SSO_CLIENT_MOBILE,
              Client_Secret: process.env.SSO_KEY_MOBILE,
              IdentityId: userToken.user.cab_id
            }
            if (newPassword !== '' && oldPassword !== '') {
              objectUpdate.OldPassword = oldPassword
              objectUpdate.NewPassword = newPassword
            } else if (newPassword !== '' && oldPassword === '') {
              objectUpdate.OldPassword = null
              objectUpdate.NewPassword = newPassword
            } else {
              objectUpdate.OldPassword = null
              objectUpdate.NewPassword = newPassword
            }
            let responseUpdateProfile = await axios.post(process.env.SSO_AUTHEN_URL + '/UpdateId', objectUpdate)
            if (responseUpdateProfile && responseUpdateProfile.data.Status.Code === 1) {
              try {
                if (newPassword !== '') {
                  userUpdate.has_password = true
                  await app.models.User.update(userUpdate, {
                    where: {
                      'id': userToken.user_id
                    }
                  })
                }
                await clearCacheUserProfile(userToken.user_id)
                let user = await getProfileUser(userToken.id)
                user.token = {
                  accessToken: userToken.access_token_on_sport,
                  refreshToken: userToken.refresh_token_on_sport
                }
                return res.send(helper.sj(user, 0, 'Update thành công'))
              } catch (error) {
                console.log(error)
                return res.send(helper.ej(error, 500))
              }
            } else {
              return res.send(helper.ej(responseUpdateProfile.data, 500, false, responseUpdateProfile.data.Status.Message))
            }
          } catch (error) {
            console.log(error)
            return res.send(helper.ej(error, 500))
          }
        } else {
          return res.send(helper.ej('Token không đúng.', 401, false, 'Token không đúng.'))
        }
      } catch (error) {
        console.log(error)
        return res.send(helper.ej(error, 500))
      }
    } else {
      return res.send(helper.ej('Token is required', 400, false, 'Token is required'))
    }
  })

  // Done
  router.post('/link-account', async (req, res) => {
    req.checkBody('token', 'Token không được để trống').notEmpty()
    var result = await req.getValidationResult()
    if (!result.isEmpty()) {
      return res.send(helper.ej(result.array(), 400, false, (result.array())[0].msg))
    }
    let token = req.body.token ? req.body.token : ''
    let username = req.body.username ? req.body.username : ''
    let password = req.body.password ? req.body.password : ''
    if (token !== '') {
      try {
        let dateNow = moment().format('YYYY-MM-DD HH:mm:ss')
        let userToken = await app.models.UserToken.findOne({
          where: {
            'access_token_on_sport': token,
            'expired_at': {
              $gt: dateNow
            }
          },
          include: [{
            association: 'user',
            attributes: ['username', 'cab_id']
          }]
        })
        if (userToken !== null) {
          try {
            let userUpdate = {
              username: username,
              password: password
            }
            let objectUpdate = {
              Client_Id: process.env.SSO_CLIENT_MOBILE,
              Client_Secret: process.env.SSO_KEY_MOBILE,
              IdentityId: userToken.user.cab_id,
              Username: username,
              NewPassword: password
            }
            let responseUpdateProfile = await axios.post(process.env.SSO_AUTHEN_URL + '/UpdateId', objectUpdate)
            if (responseUpdateProfile && responseUpdateProfile.data.Status.Code === 1) {
              try {
                if (password !== '') {
                  userUpdate.has_password = true
                  await app.models.User.update(userUpdate, {
                    where: {
                      'id': userToken.user_id
                    }
                  })
                }
                await clearCacheUserProfile(userToken.user_id)
                let user = await getProfileUser(userToken.id)
                user.token = {
                  accessToken: userToken.access_token_on_sport,
                  refreshToken: userToken.refresh_token_on_sport
                }
                return res.send(helper.sj(user, 0, 'Update thành công'))
              } catch (error) {
                console.log(error)
                return res.send(helper.ej(error, 500))
              }
            } else {
              return res.send(helper.ej(responseUpdateProfile.data, 500, false, responseUpdateProfile.data.Status.Message))
            }
          } catch (error) {
            console.log(error)
            return res.send(helper.ej(error, 500))
          }
        } else {
          return res.send(helper.ej('Token không đúng.', 401, false, 'Token không đúng.'))
        }
      } catch (error) {
        console.log(error)
        return res.send(helper.ej(error, 500))
      }
    } else {
      return res.send(helper.ej('Token is required', 400, false, 'Token is required'))
    }
  })

  // Done
  router.post('/refresh-token', async (req, res) => {
    let refreshToken = req.body.refreshToken ? req.body.refreshToken : ''
    if (refreshToken !== '') {
      try {
        let userToken = await app.models.UserToken.findOne({
          where: {
            'refresh_token_on_sport': refreshToken
          }
        })
        if (userToken !== null) {
          // Create New Token
          let token = helper.tokenFromUser({
            id: userToken.user_id
          })
          let expireAt = moment().add(6, 'M').format('YYYY-MM-DD HH:mm:ss')
          await app.models.UserToken.create({
            'user_id': userToken.user_id,
            'access_token_cab': userToken.access_token_cab,
            'access_token_on_sport': token.accessToken,
            'refresh_token_on_sport': token.refreshToken,
            'expired_at': expireAt
          })
          await userToken.destroy()
          await clearCacheUserToken(userToken.user_id)
          return res.send(helper.sj({
            token: token
          }))
        } else {
          return res.send(helper.ej('Refresh token không đúng.', 400, false, 'Refresh token không đúng.'))
        }
      } catch (error) {
        console.log(error)
        return res.send(helper.ej(error, 500))
      }
    } else {
      return res.send(helper.ej('Refresh token is required', 400, false, 'Refresh token is required'))
    }
  })

  async function getProfileUser (userId) {
    let userProfile = null
    let client = await require('../config/client')
    let cacheKey = `user_info_${userId}`
    if (client) {
      userProfile = await getProfileUserFromCache(userId, client, cacheKey)
    } else {
      userProfile = await getProfileUserFromDb(userId)
    }
    return userProfile
  }

  async function getProfileUserFromCache (userId, redis, cacheKey) {
    let userProfile = await redis.getAsync(cacheKey)
    if (userProfile) {
      userProfile = JSON.parse(userProfile)
    } else {
      userProfile = await getProfileUserFromDb(userId)
      redis.set(cacheKey, JSON.stringify(userProfile), 'EX', 60 * 60 * 24 * 30)
    }
    return userProfile
  }

  async function getProfileUserFromDb (userId) {
    let userProfile = await app.models.User.findOne({
      where: {
        'id': userId
      },
      include: [{
        association: 'UserDevice'
      },
      {
        association: 'UserPhone'
      },
      {
        association: 'UserEmail'
      }
      ]
    })
    if (userProfile !== null) {
      userProfile = userProfile.toJSON()
      userProfile.phones = userProfile.UserPhone
      userProfile.emails = userProfile.UserEmail
      userProfile.devices = userProfile.UserDevice
      userProfile = _.omit(userProfile, ['UserPhone', 'UserEmail', 'UserDevice'])
    }
    return userProfile
  }

  async function getUserToken (token, userId, exp) {
    let userToken = null
    let client = await require('../config/client')
    let cacheKey = `user_token_uid_${userId}_exp_${exp}`
    if (client) {
      userToken = await getUserTokenFromCache(token, client, cacheKey, userId)
    } else {
      userToken = await getUserTokenFromDb(token, userId)
    }
    return userToken
  }

  async function getUserTokenFromCache (token, redis, cacheKey, userId) {
    let userToken = await redis.getAsync(cacheKey)
    if (userToken) {
      userToken = JSON.parse(userToken)
    } else {
      userToken = await getUserTokenFromDb(token, userId)
      redis.set(cacheKey, JSON.stringify(userToken), 'EX', 60 * 60)
    }
    return userToken
  }

  async function getUserTokenFromDb (token, userId) {
    let userToken = await app.models.UserToken.findOne({
      where: {
        'user_id': userId,
        'access_token_on_sport': token
      }
    })
    if (userToken) {
      userToken = userToken.toJSON()
    }
    return userToken
  }

  async function clearCacheUserProfile (userId) {
    let client = await require('../config/client')
    if (client) {
      client.del(`profile_user_${userId}`)
    }
  }

  async function clearCacheUserToken (userId) {
    let client = await require('../config/client')
    if (client) {
      var cacheKeys = [`user_token_uid_${userId}`]
      if (cacheKeys.length !== 0) {
        cacheKeys.forEach(cacheKey => {
          client.keys(cacheKey + '*', function (err, keys) {
            if (!err) {
              keys.forEach(key => {
                client.del(key)
              })
            }
          })
        })
      }
    }
  }

  return router
}

function detectPhoneNumber (phone) {
  var regEx = /^0(1\d{9}|9\d{8}|8\d{8})$/
  if (!regEx.test(phone)) return false
  var telNumber = {
    '096': 'Viettel',
    '097': 'Viettel',
    '098': 'Viettel',
    '0162': 'Viettel',
    '0163': 'Viettel',
    '0164': 'Viettel',
    '0165': 'Viettel',
    '0166': 'Viettel',
    '0167': 'Viettel',
    '0168': 'Viettel',
    '0169': 'Viettel',

    '090': 'Mobifone',
    '093': 'Mobifone',
    '0120': 'Mobifone',
    '0121': 'Mobifone',
    '0122': 'Mobifone',
    '0126': 'Mobifone',
    '0128': 'Mobifone',

    '091': 'Vinaphone',
    '094': 'Vinaphone',
    '0123': 'Vinaphone',
    '0124': 'Vinaphone',
    '0125': 'Vinaphone',
    '0127': 'Vinaphone',
    '0129': 'Vinaphone',
    '088': 'Vinaphone',
    '086': 'Vinaphone',
    '089': 'Vinaphone',

    '0993': 'Gmobile',
    '0994': 'Gmobile',
    '0995': 'Gmobile',
    '0996': 'Gmobile',
    '0997': 'Gmobile',
    '0199': 'Gmobile',

    '092': 'Vietnamobile',
    '0186': 'Vietnamobile',
    '0188': 'Vietnamobile',

    '095': 'SFone'
  }
  let keys = Object.keys(telNumber)
  let isPhone = false
  keys.forEach(function (key) {
    if (phone.startsWith(key)) {
      isPhone = true
      return false
    }
  })
  return isPhone
}
