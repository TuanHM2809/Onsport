'use strict'
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('categoriables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      categoriable_id: {
        type: Sequelize.STRING
      },
      categoriable_type: {
        type: Sequelize.STRING
      }
    })
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('categoriables')
  }
}
