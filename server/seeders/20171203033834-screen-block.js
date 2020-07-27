'use strict'
var Constant = require('../constants')
var faker = require('faker')
var _ = require('lodash')
var type = ['post', 'category', 'category', 'longform', 'media', 'pundit', 'gallery']
faker.locale = 'vi'
module.exports = {
  up: function (queryInterface, Sequelize) {
    var temp = 1
    var screenBlock = []
    _.times(7, n => {
      let name = faker.lorem.sentence()
      screenBlock.push({
        title: name,
        icon: null,
        url: null,
        type: type[n],
        lft: n + temp,
        rgt: n + 1 + temp,
        depth: 1,
        parent_id: 0,
        visible: true,
        created_by: faker.random.number({ min: 1, max: 100 })
      })
      temp++
    })
    return queryInterface.bulkInsert('screen_blocks', screenBlock, {}).then(() => {
      let screenBlockItem = []
      for (let i = 0; i < 7; i++) {
        switch (type[i]) {
          case 'post':
            temp = 1
            _.times(6, n => {
              screenBlockItem.push({
                screen_block_id: i + 1,
                icon: null,
                item_id: n + 1,
                item_type: Constant.POST_TYPE,
                lft: n + temp,
                rgt: n + 1 + temp,
                depth: 1,
                parent_id: 0,
                visible: true,
                created_by: faker.random.number({ min: 1, max: 100 })
              })
              temp++
            })
            break
          case 'category':
            let countBlock = i === 1 ? 2 : 9
            temp = 1
            _.times(countBlock, n => {
              screenBlockItem.push({
                screen_block_id: i + 1,
                // name: faker.lorem.sentence(),
                icon: null,
                item_id: n + 1,
                item_type: Constant.CATEGORY_TYPE,
                lft: n + temp,
                rgt: n + 1 + temp,
                depth: 1,
                parent_id: 0,
                visible: true,
                created_by: faker.random.number({ min: 1, max: 100 })
              })
              temp++
            })
            break
          case 'longform':
            temp = 1
            _.times(15, n => {
              screenBlockItem.push({
                screen_block_id: i + 1,
                // name: faker.lorem.sentence(),
                icon: null,
                item_id: n + 1,
                item_type: Constant.POST_TYPE,
                lft: n + temp,
                rgt: n + 1 + temp,
                depth: 1,
                parent_id: 0,
                visible: true,
                created_by: faker.random.number({ min: 1, max: 100 })
              })
              temp++
            })
            break
          case 'media':
            temp = 1
            _.times(15, n => {
              screenBlockItem.push({
                screen_block_id: i + 1,
                // name: faker.lorem.sentence(),
                icon: null,
                item_id: n + 1,
                item_type: Constant.FILE_TYPE,
                lft: n + temp,
                rgt: n + 1 + temp,
                depth: 1,
                parent_id: 0,
                visible: true,
                created_by: faker.random.number({ min: 1, max: 100 })
              })
              temp++
            })
            break
          case 'pundit':
            temp = 1
            _.times(3, n => {
              screenBlockItem.push({
                screen_block_id: i + 1,
                // name: faker.lorem.sentence(),
                icon: null,
                item_id: n + 1,
                item_type: Constant.POST_TYPE,
                lft: n + temp,
                rgt: n + 1 + temp,
                depth: 1,
                parent_id: 0,
                visible: true,
                created_by: faker.random.number({ min: 1, max: 100 })
              })
              temp++
            })
            break
          case 'gallery':
            temp = 1
            _.times(15, n => {
              screenBlockItem.push({
                screen_block_id: i + 1,
                // name: faker.lorem.sentence(),
                icon: null,
                item_id: n + 1,
                item_type: Constant.GALLERY_TYPE,
                lft: n + temp,
                rgt: n + 1 + temp,
                depth: 1,
                parent_id: 0,
                visible: true,
                created_by: faker.random.number({ min: 1, max: 100 })
              })
              temp++
            })
            break
          default:
            break
        }
      }

      return queryInterface.bulkInsert('screen_block_items', screenBlockItem, {})
    })
  },
  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('screen_blocks', null, {}).then(() => {
      return queryInterface.bulkDelete('screen_block_items', null, {})
    })
  }
}
