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
      queryInterface.addColumn('teams', 'establish', {
        allowNull: true,
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('teams', 'stadium', {
        allowNull: true,
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('teams', 'coach', {
        allowNull: true,
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('teams', 'vl_teamid', {
        allowNull: true,
        type: Sequelize.INTEGER
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
      queryInterface.removeColumn('teams', 'establish'),
      queryInterface.removeColumn('teams', 'stadium'),
      queryInterface.removeColumn('teams', 'coach'),
      queryInterface.removeColumn('teams', 'vl_teamid')
    ]
  }
}
