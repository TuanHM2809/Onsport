'use strict'
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
        cab_id: faker.random.uuid(),
        name: faker.internet.userName(),
        email: faker.internet.email(),
        dob: faker.date.between('1970-01-01', '2000-01-01'),
        address: faker.address.country(),
        avatar: faker.image.avatar(),
        verify: faker.random.boolean()
      }
    })
    return queryInterface.bulkInsert('users', dataTest, {})
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
