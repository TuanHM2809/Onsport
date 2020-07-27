'use strict'
var Constant = require('../constants')
let _ = require('lodash')
var faker = require('faker')
faker.locale = 'vi'
var slug = require('slug')
module.exports = {
  up: (queryInterface, Sequelize) => {
    var temp = 1
    var dataTest = []
    _.times(20, n => {
      let name = faker.lorem.sentence()
      let slugUrl = slug(name, { lower: true })
      dataTest.push({
        name: name,
        slug: slugUrl,
        description: faker.lorem.sentences(),
        seo_title: name,
        seo_description: faker.lorem.sentences(),
        type: n >= 10 ? Constant.FILE_TYPE : Constant.POST_TYPE,
        lft: n + temp,
        rgt: n + 1 + temp,
        deleted_at: null
      })
      temp++
    })
    return queryInterface.bulkInsert('categories', dataTest, {}).then(() => {
      var categoryItems = []
      _.times(20, n => {
        _.times(20, m => {
          let item = {
            category_id: n + 1,
            categoriable_id: m + 1,
            categoriable_type: n >= 10 ? Constant.FILE_TYPE : Constant.POST_TYPE
          }
          categoryItems.push(item)
        })
      })
      return queryInterface.bulkInsert('categoriables', categoryItems, {})
    })
  },

  down: (queryInterface, Sequelize) => {}
}
