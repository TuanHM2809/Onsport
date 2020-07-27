'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('screen_blocks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      url: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM(['post', 'category', 'longform', 'media', 'pundit', 'gallery'])
      },
      clickable: {
        type: Sequelize.BOOLEAN
      },
      lft: {
        type: Sequelize.INTEGER
      },
      rgt: {
        type: Sequelize.INTEGER
      },
      depth: {
        type: Sequelize.INTEGER
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      visible: {
        type: Sequelize.BOOLEAN
      },
      created_by: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('screen_blocks')
  }
}
