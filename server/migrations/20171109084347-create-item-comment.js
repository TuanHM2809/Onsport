'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      commentable_id: {
        type: Sequelize.STRING
      },
      commentable_type: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      visible: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('comments')
  }
}
