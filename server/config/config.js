let path = require('path')
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env')
})
let sql = require('sql')
module.exports = {
  'development': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASS || '',
    'database': process.env.DB_DATABASE || 'onsports',
    'host': process.env.DB_HOST || '127.0.0.1',
    'port': process.env.DB_PORT || '3306',
    'dialect': process.env.DB_DIALECT || 'mysql',
    logging: console.log,
    benchmark: true,
    // logging: false,
    'timezone': '+07:00',
    pool: {
      max: 20,
      min: 0,
      idle: 10000,
      acquire: 30000,
      evict: 30000
    }
    // define: {
    //   classMethods: {
    //     // Readds the dataset method that was removed in sequelize#2.0.0-rc3
    //     // Original implementation: https://github.com/sequelize/sequelize/blob/a3dc4bef1988ef1de1fb52ea9d5fbd23192ce93d/lib/model.js
    //     _setSqlDialect: function () {
    //       const dialect = this.modelManager.sequelize.options.dialect
    //       this._sql = sql.setDialect('mysql')
    //     },
    //     dataset: function () {
    //       if (!this._sql) {
    //         this._setSqlDialect()
    //       }
    //
    //       const instance = this._sql.define({
    //         name: this.tableName,
    //         columns: []
    //       })
    //       _.forEach(this.attributes, (value, key) => instance.addColumn(key, value))
    //       return instance
    //     }
    //   },
    //   instanceMethods: {}
    // }
  },
  'test': {
    'username': 'root',
    'password': '',
    'database': 'onsports',
    'host': 'localhost',
    'dialect': 'mysql'
    // define: {
    //   classMethods: {
    //     // Readds the dataset method that was removed in sequelize#2.0.0-rc3
    //     // Original implementation: https://github.com/sequelize/sequelize/blob/a3dc4bef1988ef1de1fb52ea9d5fbd23192ce93d/lib/model.js
    //     _setSqlDialect: function () {
    //       const dialect = this.modelManager.sequelize.options.dialect
    //       this._sql = sql.setDialect('mysql')
    //     },
    //     dataset: function () {
    //       if (!this._sql) {
    //         this._setSqlDialect()
    //       }
    //
    //       const instance = this._sql.define({
    //         name: this.tableName,
    //         columns: []
    //       })
    //       _.forEach(this.attributes, (value, key) => instance.addColumn(key, value))
    //       return instance
    //     }
    //   },
    //   instanceMethods: {}
    // }
  },
  'production': {
    'username': process.env.DB_USER || 'root',
    'password': process.env.DB_PASS || '',
    'database': process.env.DB_DATABASE || 'onsports',
    'host': process.env.DB_HOST || '127.0.0.1',
    'port': process.env.DB_PORT || '3307',
    'dialect': process.env.DB_DIALECT || 'mysql',
    pool: {
      max: 50,
      min: 5,
      idle: 10000,
      acquire: 30000,
      evict: 30000
    },
    'timezone': '+00:00'
    // define: {
    //   classMethods: {
    //     // Readds the dataset method that was removed in sequelize#2.0.0-rc3
    //     // Original implementation: https://github.com/sequelize/sequelize/blob/a3dc4bef1988ef1de1fb52ea9d5fbd23192ce93d/lib/model.js
    //     _setSqlDialect: function () {
    //       const dialect = this.modelManager.sequelize.options.dialect
    //       this._sql = sql.setDialect('mysql')
    //     },
    //     dataset: function () {
    //       if (!this._sql) {
    //         this._setSqlDialect()
    //       }
    //
    //       const instance = this._sql.define({
    //         name: this.tableName,
    //         columns: []
    //       })
    //       _.forEach(this.attributes, (value, key) => instance.addColumn(key, value))
    //       return instance
    //     }
    //   },
    //   instanceMethods: {}
    // }
  }
}
