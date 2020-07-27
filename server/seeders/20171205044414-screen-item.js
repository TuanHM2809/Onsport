'use strict'
var Constant = require('../constants')
var faker = require('faker')
var _ = require('lodash')
faker.locale = 'vi'
module.exports = {
  up: function (queryInterface, Sequelize) {
    var dataTest = _.times(50, n => {
      return {
        item_id: faker.random.number({ min: 1, max: 50 }),
        item_type: faker.random.arrayElement([Constant.FILE_TYPE, Constant.POST_TYPE]),
        pin_top: false,
        order: n,
        created_by: faker.random.number({ min: 1, max: 100 })
      }
    })
    return queryInterface.bulkInsert('screen_items', dataTest, {})
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('screen_items', null, {})
  }
}
