'use strict'

module.exports = function (sequelize, DataTypes) {
  var Lineup = sequelize.define('Lineup', {
    lineup: DataTypes.STRING,
    match_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'lineups',
    timestamps: false
  })

  Lineup.associate = model => {
    Lineup.hasMany(model.LineupItem, { foreignKey: 'lineup_id', as: 'items' })
    Lineup.belongsTo(model.Match, { foreignKey: 'match_id', as: 'matches' })
    Lineup.belongsTo(model.Team, { foreignKey: 'team_id', as: 'teams' })
  }
  return Lineup
}
