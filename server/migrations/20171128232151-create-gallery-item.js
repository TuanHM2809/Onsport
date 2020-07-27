'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('gallery_file', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gallery_id: {
        type: Sequelize.INTEGER
      },
      file_id: {
        type: Sequelize.INTEGER
      },
      caption: {
        type: Sequelize.STRING
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gallery_file')
  }
}
