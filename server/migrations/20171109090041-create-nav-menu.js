'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('menu_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.TEXT
      },
      item_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      item_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      page_id: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      parent_id: {
        allowNull: true,
        type: Sequelize.INTEGER
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
      deleted_at: {
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
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('menu_items')
  }
}
