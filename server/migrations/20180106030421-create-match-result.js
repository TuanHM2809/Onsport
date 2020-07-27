'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('MatchResults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      home_name: {
        type: Sequelize.STRING
      },
      home_logo: {
        type: Sequelize.STRING
      },
      home_score: {
        type: Sequelize.INTEGER
      },
      away_name: {
        type: Sequelize.STRING
      },
      away_logo: {
        type: Sequelize.STRING
      },
      away_score: {
        type: Sequelize.INTEGER
      },
      start_at: {
        type: Sequelize.STRING
      },
      is_match_end: {
        type: Sequelize.INTEGER
      },
      end_at: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('MatchResults')
  }
}
