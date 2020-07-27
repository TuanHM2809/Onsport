'use strict'

var jwt = require('jsonwebtoken')
var _ = require('lodash')
var path = require('path')
// require('dotenv').config('../../.env')

var helper = {}

helper.MSG_SUCCESS = 'Lấy dữ liệu thành công!'
helper.MSG_CREATE_SUCCESS = 'Thêm mới dữ liệu thành công!'
helper.MSG_UPDATE_SUCCESS = 'Cập nhật dữ liệu thành công!'
helper.MSG_UNDO_SUCCESS = 'Khôi phục dữ liệu thành công!'
helper.MSG_DELETE_SUCCESS = 'Xóa dữ liệu thành công!'
helper.MSG_404 = 'Không tìm thấy dữ liệu!'
helper.MSG_500 = 'Có lỗi xảy ra, vui lòng thử lại!'
helper.MSG_403 = 'Không có quyền truy cập!'
helper.ROOT_DIR = path.join(__dirname, '/..')
helper.CONFIG_DIR = path.join(helper.ROOT_DIR, 'config')

helper.sj = (data = {}, tokenStatus = 0, message = helper.MSG_SUCCESS, code = 0) => {
  return {
    code,
    message,
    data,
    token_status: tokenStatus
  }
}

helper.ej = (error = '', code = -1, debug = false, showMessage = helper.MSG_500) => {
  console.log('----------------------------------------\n')
  console.log(error)
  console.log('----------------------------------------\n')
  if (debug === true || debug === 1 || debug === '1') {
    if (typeof error === 'object') {
      error = error.message
    }
    return {
      code,
      message: showMessage,
      error: error
    }
  }
  return {
    code,
    message: showMessage
  }
}

helper.tj = (data = {}, pagination = {}, tokenStatus = 0, message = helper.MSG_SUCCESS, code = 0) => {
  return {
    code,
    message,
    data,
    pagination,
    token_status: tokenStatus
  }
}

helper.pj = () => {
  return helper.ej('', 403, false, helper.MSG_403)
}

/* Create Token from user profile */
helper.tokenFromUser = (user, remember = false) => {
  let accessToken = jwt.sign(_.pick(user, 'id'), process.env.JWT_SECRET, {
    expiresIn: '180d'
  })
  let refreshToken = jwt.sign({
    token: 'accessToken',
    expiresIn: '180d'
  }, process.env.JWT_SECRET)
  return {
    'accessToken': accessToken,
    'refreshToken': refreshToken
  }
}

/* Check Token is verify */
helper.checkVerifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

/* Get User profile form Token */
helper.userFromAuthToken = (token) => {
  return jwt.decode(token)
}

global.helper = helper
