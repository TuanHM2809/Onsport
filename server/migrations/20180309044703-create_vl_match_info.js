'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('vl_match_info', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      league_name: Sequelize.STRING, // leaguename cua API crawl. Chua nghi de lam gi nhung cuu luu lai de phuc vu crawl
      season_name: Sequelize.STRING, // seasonname cua API crawl thoi ma
      round_name: Sequelize.STRING, // seasonname cua API crawl thoi ma
      match_id: Sequelize.INTEGER // id cua tran dau
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('vl_match_info')
  }
}
