'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('vleague_standings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      team_id: {
        type: Sequelize.INTEGER
      },
      season_id: {
        type: Sequelize.INTEGER
      },
      wins: {
        type: Sequelize.INTEGER
      },
      loses: {
        type: Sequelize.INTEGER
      },
      ties: {
        type: Sequelize.INTEGER
      },
      goal_in: {
        type: Sequelize.INTEGER
      },
      goal_out: {
        type: Sequelize.INTEGER
      },
      rank: Sequelize.INTEGER,
      round_id: Sequelize.INTEGER, // cai nay chac cop vi ben kia
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'created_at'
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'updated_at'
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
    return queryInterface.dropTable('vleague_standings')
  }
}
