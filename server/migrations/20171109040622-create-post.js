'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('articles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      short_title: {
        type: Sequelize.STRING
      },
      short_description: {
        type: Sequelize.TEXT
      },
      post_type: {
        type: Sequelize.ENUM('longform', 'normal')
      },
      status: {
        type: Sequelize.ENUM('PUBLISHED', 'DRAFT'),
        defaultValue: 'PUBLISHED'
      },
      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      breaking_news: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      poster: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      content: {
        type: Sequelize.TEXT
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
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        field: 'deleted_at'
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('articles')
  }
}
