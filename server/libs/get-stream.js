const axios = require('axios')
const jwt256 = require('./jwt256')
const path = require('path')
const fs = require('fs')
const cert = fs.readFileSync(path.join('server/key/jwtRS256.secret'))
const _ = require('lodash')

const linkGenerate = (channel, userId) => {
  var inputData = {
    partner_id: 6,
    partner_user_id: userId,
  }
  return jwt256.encode(inputData, cert)
}
module.exports = linkGenerate
