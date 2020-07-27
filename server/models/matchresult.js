'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchResult = sequelize.define('MatchResult', {
    home_name: DataTypes.STRING,
    home_logo: DataTypes.STRING,
    home_score: DataTypes.INTEGER,
    home_rate: DataTypes.INTEGER,
    away_name: DataTypes.STRING,
    away_logo: DataTypes.STRING,
    away_score: DataTypes.INTEGER,
    away_rate: DataTypes.INTEGER,
    start_at: DataTypes.STRING,
    is_match_end: DataTypes.TINYINT,
    end_at: DataTypes.STRING,
    link: DataTypes.TEXT,
    channel_logo: DataTypes.STRING,
    winner: DataTypes.STRING,
    note: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'match_results',
    timestamps: true
  })
  return MatchResult
}
