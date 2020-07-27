'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      seo_title: {
        type: Sequelize.STRING
      },
      seo_description: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      depth: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      lft: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        defaultValue: 1
      },
      rgt: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        defaultValue: 2
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
    return queryInterface.dropTable('categories')
  }
}
