'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('tournaments_has_teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tournament_id: {
        type: Sequelize.INTEGER
      },
      team_id: {
        type: Sequelize.INTEGER
      },
      season_id: {
        type: Sequelize.INTEGER
      },
      division_id: {
        type: Sequelize.INTEGER
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('tournaments_has_teams')
  }
}
