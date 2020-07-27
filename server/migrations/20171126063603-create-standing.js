'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('standings', {
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
      tournament_id: {
        type: Sequelize.INTEGER
      },
      division_id: {
        type: Sequelize.INTEGER
      },
      home_detail: {
        type: Sequelize.INTEGER
      },
      away_detail: {
        type: Sequelize.INTEGER
      },
      total_detail: {
        type: Sequelize.INTEGER
      },
      rank: Sequelize.INTEGER,
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('standings')
  }
}
