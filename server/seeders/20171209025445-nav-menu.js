'use strict'
var Constant = require('../constants')
var faker = require('faker')
faker.locale = 'vi'

module.exports = {
  up: (queryInterface, Sequelize) => {
    let navMenu = [{
      name: 'Sôi động trong nước',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 1,
      rgt: 10,
      depth: 1,
      parent_id: null,
      deleted_at: null
    },
    {
      name: 'Đội tuyển Việt Nam',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 2,
      rgt: 3,
      depth: 2,
      parent_id: 1,
      deleted_at: null
    },
    {
      name: 'Các đội trẻ',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 4,
      rgt: 5,
      depth: 2,
      parent_id: 1,
      deleted_at: null
    },
    {
      name: 'VLeague',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 6,
      rgt: 7,
      depth: 2,
      parent_id: 1,
      deleted_at: null
    },
    {
      name: 'Thể thao Việt Nam',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 8,
      rgt: 9,
      depth: 2,
      parent_id: 1,
      deleted_at: null
    },
    {
      name: 'Sôi động quốc tế',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 11,
      rgt: 20,
      depth: 1,
      parent_id: null,
      deleted_at: null
    },
    {
      name: 'Premier League',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 12,
      rgt: 13,
      depth: 2,
      parent_id: 6,
      deleted_at: null
    },
    {
      name: 'La Liga',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 14,
      rgt: 15,
      depth: 2,
      parent_id: 6,
      deleted_at: null
    },
    {
      name: 'UEFA Champions League',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 16,
      rgt: 17,
      depth: 2,
      parent_id: 6,
      deleted_at: null
    },
    {
      name: 'Các giải khác',
      link: null,
      item_id: faker.random.number({ min: 1, max: 100 }),
      item_type: Constant.POST_TYPE,
      page_id: null,
      lft: 18,
      rgt: 19,
      depth: 2,
      parent_id: 1,
      deleted_at: null
    },
    {
      name: 'Long-form',
      link: faker.internet.url(),
      item_id: null,
      item_type: null,
      page_id: null,
      lft: 21,
      rgt: 22,
      depth: 1,
      parent_id: null,
      deleted_at: null
    },
    {
      name: 'Infographic',
      link: faker.internet.url(),
      item_id: null,
      item_type: null,
      page_id: null,
      lft: 23,
      rgt: 24,
      depth: 1,
      parent_id: null,
      deleted_at: null
    },
    {
      name: 'Media',
      link: faker.internet.url(),
      item_id: null,
      item_type: null,
      page_id: null,
      lft: 25,
      rgt: 26,
      depth: 1,
      parent_id: null,
      deleted_at: null
    },
    {
      name: 'TV Guide',
      link: faker.internet.url(),
      item_id: null,
      item_type: null,
      page_id: null,
      lft: 27,
      rgt: 28,
      depth: 1,
      parent_id: null,
      deleted_at: null
    },
    {
      name: 'Góc chuyên gia',
      link: faker.internet.url(),
      item_id: null,
      item_type: null,
      page_id: null,
      lft: 29,
      rgt: 30,
      depth: 1,
      parent_id: null,
      deleted_at: null
    },
    {
      name: 'More',
      link: faker.internet.url(),
      item_id: null,
      item_type: null,
      page_id: null,
      lft: 31,
      rgt: 32,
      depth: 1,
      parent_id: null,
      deleted_at: null
    }
    ]
    return queryInterface.bulkInsert('menu_items', navMenu, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('menu_items', null, {})
  }
}
