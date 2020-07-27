'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      home_team: {
        type: Sequelize.INTEGER
      },
      away_team: {
        type: Sequelize.INTEGER
      },
      home_team_score: {
        type: Sequelize.INTEGER
      },
      away_team_score: {
        type: Sequelize.INTEGER
      },
      visible: {
        type: Sequelize.BOOLEAN
      },
      start_at: {
        type: Sequelize.DATE
      },
      end_at: {
        type: Sequelize.DATE
      },
      tournament_id: {
        type: Sequelize.INTEGER
      },
      division_id: {
        type: Sequelize.INTEGER
      },
      season_id: {
        type: Sequelize.INTEGER
      },
      winner_id: {
        type: Sequelize.INTEGER
      },
      top11_matchId: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Pre-Game', 'Processing', 'Final', 'Postponed'),
        defaultValue: 'Processing'
      },
      venue: {
        type: Sequelize.STRING
      },
      referee: {
        type: Sequelize.STRING
      },
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
    return queryInterface.dropTable('matches')
  }
}
