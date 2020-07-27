'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users_follow_tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      tag_id: {
        type: Sequelize.INTEGER
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users_follow_tags')
  }
}
