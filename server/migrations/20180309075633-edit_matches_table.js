'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return [
      queryInterface.addColumn('matches', 'is_vleague', {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }),
      queryInterface.addColumn('matches', 'match_sumary', {
        type: Sequelize.TEXT,
        defaultValue: ''
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return [
      queryInterface.removeColumn('matches', 'is_vleague'),
      queryInterface.removeColumn('matches', 'match_sumary')]
  }
}
