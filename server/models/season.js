'use strict'
module.exports = function (sequelize, DataTypes) {
  var Season = sequelize.define('Season', {
    season: DataTypes.INTEGER
  }, {
    // classMethods: {
    //   associate: function(models) {
    //     // associations can be defined here
    //   }
    // }
    underscored: true,
    tableName: 'seasons'
  })

  Season.associate = model => {
    Season.hasMany(model.Match, { foreignKey: 'season_id', as: 'matches' })
  }
  return Season
}
