'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('live_channels', {
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
      display_name: {
        type: Sequelize.STRING
      },
      short_description: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('PUBLISHED', 'DRAFT'),
        defaultValue: 'PUBLISHED'
      },
      link_type: {
        type: Sequelize.ENUM('youtube', 'stream')
      },
      link: {
        type: Sequelize.STRING
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'created_at'
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('live_channels')
  }
}
