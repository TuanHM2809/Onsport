'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('match_events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_type_id: {
        type: Sequelize.INTEGER
      },
      action_owner_team_id: {
        type: Sequelize.INTEGER
      },
      action_owner: {
        type: Sequelize.STRING
      },
      assist: {
        type: Sequelize.STRING
      },
      assist_type: {
        type: Sequelize.STRING
      },
      detail: {
        type: Sequelize.STRING
      },
      target_team_id: {
        type: Sequelize.INTEGER
      },
      target: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.STRING
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      match_id: {
        type: Sequelize.INTEGER
      },
      time: {
        type: Sequelize.TIME
      },
      additional_time: {
        type: Sequelize.INTEGER
      },
      gmt_time: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('match_events')
  }
}
