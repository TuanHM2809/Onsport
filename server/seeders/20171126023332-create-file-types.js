'use strict'
var Constant = require('../constants')
module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    let data = [{
      id: 1,
      name: Constant.VIDEO_TYPE
    },
    {
      id: 2,
      name: Constant.IMAGE_TYPE
    }
    ]
    return queryInterface.bulkInsert('file_types', data, {})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('file_types', null, {})
  }
}
