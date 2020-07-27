'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('lineups_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      row: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      column: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      lineup_id: {
        type: Sequelize.INTEGER,
        alowNull: false
      },
      is_home: {
        type: Sequelize.BOOLEAN,
        defaultValue: true // mac dinh la chu nha di
      },
      player_id: {
        type: Sequelize.INTEGER,
        alowNull: false
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}
