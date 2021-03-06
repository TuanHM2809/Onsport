'use strict'
require('dotenv').config({ path: '../../.env' })
var fs = require('fs')
var path = require('path')
var Sequelize = require('sequelize')
var basename = 'index1.js'
var env = process.env.NODE_ENV || 'development'
// var config = require(path.resolve(__dirname, '..', 'config/config.js'))[env]

var config = require('../config/config.js')[env]
var db = {}
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file !== 'index.js') && (file.slice(-3) === '.js')
  })
  .forEach(function (file) {
    var model = sequelize['import'](path.resolve('..', __dirname, file))
    // var model = sequelize['import'](path.resolve(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize
module.exports = db
// export default db
// export default db
