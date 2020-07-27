'use strict'
module.exports = function (sequelize, DataTypes) {
  var DetailRecord = sequelize.define('DetailRecord', {
    standing_id: DataTypes.INTEGER,
    type: DataTypes.ENUM('home', 'away', 'total'),
    wins: DataTypes.INTEGER,
    losses: DataTypes.INTEGER,
    ties: DataTypes.INTEGER,
    goals_for: DataTypes.INTEGER,
    goals_against: DataTypes.INTEGER,
    points: DataTypes.INTEGER,
    games_played: DataTypes.INTEGER
  }, {
    tableName: 'detail_records',
    timestamps: false,
    underscored: true
  })
  return DetailRecord
}
