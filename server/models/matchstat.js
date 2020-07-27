'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchStat = sequelize.define('MatchStat', {
    stat_id: DataTypes.INTEGER,
    match_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER,
    value: DataTypes.FLOAT
  }, {
    underscored: true,
    tableName: 'match_stats',
    timestamps: false
  })

  MatchStat.associate = (model) => {
    MatchStat.belongsTo(model.Team, {foreignKey: 'team_id', as: 'team'})
    MatchStat.belongsTo(model.MatchStatType, {foreignKey: 'stat_id', as: 'type'})
  }
  return MatchStat
}
