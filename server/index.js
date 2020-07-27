import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import expressValidator from 'express-validator'
import morgan from 'morgan'
import { Builder, Nuxt } from 'nuxt'
import path from 'path'
import phone from 'phone'
import api from './api'
import compression from 'compression'

const RedisStore = require('connect-redis')(session)
let config = require('../nuxt.config.js')
var RateLimit = require('express-rate-limit')
require('./libs/helper')
require('dotenv').config('../.env')

const app = express()

const host = process.env.HOST
const port = process.env.PORT

app.models = require('./models')
app.helper = require('./libs/helper')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: true }))
app.disable('etag')
app.use(morgan('dev'))
app.set('port', port)
app.use(expressValidator({
  customValidators: {
    between (param, low, high) {
      return (param >= low) && (param <= high)
    },
    isValidItemType (param, arrayItemType) {
      return arrayItemType.indexOf(param) != -1
    },
    isPhoneNumber (param) {
      const patt = phone(param, 'VN')
      return patt.length > 0
    }
  }
}))

// Config rate limit
var limiter = new RateLimit({
  windowMs: 15 * 1000,
  max: 15000,
  delayMs: 0
})

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  store: new RedisStore({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || '6379',
    pass: process.env.REDIS_PASS || ''
  }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_KEY_SSS,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 1 tháng
  }
}))

// Import API Routes
app.use('/api', limiter, compression(), api(app))

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Give nuxt middleware to express
app.use(nuxt.render)

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
    .then(listen)
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
} else {
  listen()
}

function listen () {
  // Listen the server
  app.listen(port, host)
  console.log('Server listening on `' + host + ':' + port + '`.')
}
