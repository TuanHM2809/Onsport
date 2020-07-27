'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('screen_block_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      screen_block_id: {
        type: Sequelize.INTEGER
      },
      icon: {
        type: Sequelize.STRING
      },
      item_id: {
        type: Sequelize.INTEGER
      },
      item_type: {
        type: Sequelize.STRING
      },
      visible: {
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
    return queryInterface.dropTable('screen_block_items')
  }
}
