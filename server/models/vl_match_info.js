'use strict'
module.exports = (sequelize, DataTypes) => {
  var VlMatchInfo = sequelize.define('VLMatchInfo', {
    league_name: DataTypes.STRING,
    season_name: DataTypes.STRING,
    round_name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'vl_match_info',
    underscored: true
  })

  return VlMatchInfo
}
