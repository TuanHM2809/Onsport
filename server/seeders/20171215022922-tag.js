'use strict'
var Constant = require('../constants')
var faker = require('faker')
var _ = require('lodash')
var slug = require('slug')
faker.locale = 'vi'
module.exports = {
  up: (queryInterface, Sequelize) => {
    var tag = _.times(10, n => {
      let name = faker.name.findName()
      let slugUrl = slug(name, { lower: true })
      return {
        name: name,
        slug: slugUrl
      }
    })
    return queryInterface.bulkInsert('tags', tag, {}).then(() => {
      var taggables = []
      _.times(2, i => {
        _.times(10, n => {
          _.times(20, m => {
            let item = {
              tag_id: (n + 1),
              taggable_type: (i === 1 ? Constant.FILE_TYPE : Constant.POST_TYPE),
              taggable_id: (m + 1)
            }
            taggables.push(item)
          })
        })
      })
      return queryInterface.bulkInsert('taggables', taggables, {})
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
}
