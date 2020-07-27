// require('dotenv').config('../../.env')
let path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
module.exports = {
  development: {
    port: '6379',
    host: 'localhost'
  },
  production: {
    port: process.env.REDIS_PORT || '6379',
    host: process.env.REDIS_HOST || '127.0.0.1',
    pass: process.env.REDIS_PASS || ''
  },
  test: {
    port: '6379',
    host: 'localhost'
  }
}
