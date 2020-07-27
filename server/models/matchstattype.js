'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchStatType = sequelize.define('MatchStatType', {
    name: DataTypes.STRING,
    code: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'match_stat_types',
    timestamps: false
  })
  return MatchStatType
}
