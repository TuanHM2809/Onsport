'use strict'

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
    let dataTest = [
      {
        name: 'goals',
        code: 0
      },
      {
        name: 'redCards',
        code: 1
      },
      {
        name: 'yellowCards',
        code: 2
      },
      {
        name: 'endFirstPeriod',
        code: 3
      },
      {
        name: 'endMatch',
        code: 4
      },
      {
        name: 'startMatch',
        code: 5
      },
      {
        name: 'endSecondPeriod',
        code: 6
      },
      {
        name: 'missPenalty',
        code: 7
      },
      {
        name: 'substitutions',
        code: 8
      }
    ]
    return queryInterface.bulkInsert('match_event_types', dataTest, {})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('match_event_types', null, {})
  }
}
