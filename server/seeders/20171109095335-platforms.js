'use strict'

var faker = require('faker')
var _ = require('lodash')
faker.locale = 'vi'

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
    return queryInterface.bulkInsert('platforms', [{
      name: 'Phone',
      description: 'Phone',
      is_special: 0
    }, {
      name: 'Web',
      description: 'Web',
      is_special: 0
    }], {})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('platforms', null, {})
  }
}
