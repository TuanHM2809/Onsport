'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      access_token_cab: {
        type: Sequelize.STRING
      },
      refresh_token_cab: {
        type: Sequelize.STRING
      },
      access_token_on_sport: {
        type: Sequelize.STRING
      },
      refresh_token_on_sport: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      ua: {
        type: Sequelize.TEXT
      },
      expired_at: {
        allowNull: true,
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_tokens')
  }
}
