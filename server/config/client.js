const run_env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
let redis_config = require('./redis')[run_env]
let redis = require('redis')
const bluebird = require('bluebird')

module.exports = new Promise((resolve, reject) => {
  // return resolve(null)
  let client = redis.createClient({
    host: redis_config.host,
    port: redis_config.port,
    password: redis_config.pass,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return resolve(null)
      }
    }
  })

  bluebird.promisifyAll(redis.RedisClient.prototype)
  bluebird.promisifyAll(redis.Multi.prototype)

  client.on('ready', () => {
    console.log('Already!')
    return resolve(client)
  })

  client.on('error', (err) => {
    console.log(err)
    return resolve(null)
  })
})
