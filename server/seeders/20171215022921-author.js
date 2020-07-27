'use strict'
var Constant = require('../constants')
var faker = require('faker')
var _ = require('lodash')
var slug = require('slug')
faker.locale = 'vi'
module.exports = {
  up: (queryInterface, Sequelize) => {
    var author = _.times(10, n => {
      let name = faker.name.findName()
      let slugUrl = slug(name, { lower: true })
      return {
        name: name,
        slug: slugUrl,
        avatar: faker.image.imageUrl(400, 400, 'people'),
        bio: faker.lorem.paragraph()
      }
    })
    return queryInterface.bulkInsert('authors', author, {}).then(() => {
      var authorable = []
      _.times(2, i => {
        _.times(10, n => {
          _.times(20, m => {
            let item = {
              author_id: (n + 1),
              authorable_type: (i === 1 ? Constant.FILE_TYPE : Constant.POST_TYPE),
              authorable_id: (m + 1)
            }
            authorable.push(item)
          })
        })
      })
      return queryInterface.bulkInsert('authorables', authorable, {})
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
