'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('files', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      featured: {
        type: Sequelize.BOOLEAN
      },
      is_free: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('PUBLISHED', 'DRAFT'),
        defaultValue: 'PUBLISHED'
      },
      date: {
        type: Sequelize.DATE
      },
      metadata: {
        type: Sequelize.JSON
      },
      file_type_id: {
        type: Sequelize.INTEGER
      },
      deleted_at: {
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
    return queryInterface.dropTable('files')
  }
}
