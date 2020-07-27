'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchEventType = sequelize.define('MatchEventType', {
    name: DataTypes.STRING,
    code: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    tableName: 'match_event_types',
    underscored: true,
    timestamps: false
  })
  return MatchEventType
}
