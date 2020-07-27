'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('detail_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      standing_id: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('home', 'away', 'total')
      },
      wins: {
        type: Sequelize.INTEGER
      },
      losses: {
        type: Sequelize.INTEGER
      },
      ties: {
        type: Sequelize.INTEGER
      },
      goals_for: {
        type: Sequelize.INTEGER
      },
      goals_against: {
        type: Sequelize.INTEGER
      },
      games_played: Sequelize.INTEGER,
      points: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('detail_records')
  }
}
