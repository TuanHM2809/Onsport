'use strict'
var Constant = require('../constants')
var faker = require('faker')
var _ = require('lodash')
faker.locale = 'vi'
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    var dataTest = _.times(100, n => {
      return {
        commentable_id: faker.random.number({ min: 1, max: 100 }),
        commentable_type: Constant.FILE_TYPE,
        user_id: faker.random.number({ min: 1, max: 100 }),
        content: faker.lorem.sentences(),
        parent_id: null,
        visible: 1
      }
    })
    return queryInterface.bulkInsert('comments', dataTest, {}).then(() => {
      let commentChildren = []
      _.times(100, n => {
        _.times(3, m => {
          let item = {
            commentable_id: faker.random.number({ min: 1, max: 100 }),
            commentable_type: Constant.FILE_TYPE,
            user_id: faker.random.number({ min: 1, max: 100 }),
            content: faker.lorem.sentences(),
            parent_id: n,
            visible: 1
          }
          commentChildren.push(item)
        })
      })
      return queryInterface.bulkInsert('comments', commentChildren, {}).then(() => {
        let likeItem = []
        _.times(300, n => {
          _.times(3, m => {
            let item = {
              item_comment_id: (n + 1),
              user_id: faker.random.number({ min: 1, max: 100 })
            }
            likeItem.push(item)
          })
        })
        return queryInterface.bulkInsert('comment_like', likeItem, {})
      })
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
