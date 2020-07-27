'use strict'
module.exports = function (sequelize, DataTypes) {
  var Standing = sequelize.define('Standing', {
    team_id: DataTypes.INTEGER,
    season_id: DataTypes.INTEGER,
    tournament_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER,
    home_detail: DataTypes.INTEGER,
    away_detail: DataTypes.INTEGER,
    total_detail: DataTypes.INTEGER,
    rank: DataTypes.INTEGER
  }, {
    tableName: 'standings',
    timestamps: false,
    underscored: true
  })

  Standing.associate = (model) => {
    Standing.belongsTo(model.Team, {foreignKey: 'team_id', as: 'team'})
    Standing.belongsTo(model.Season, {foreignKey: 'season_id', as: 'season'})
    Standing.belongsTo(model.Tournament, {foreignKey: 'tournament_id', as: 'tournament'})
    Standing.belongsTo(model.Division, {foreignKey: 'division_id', as: 'division'})
    Standing.belongsTo(model.DetailRecord, {foreignKey: 'home_detail', as: 'home_record'})
    Standing.belongsTo(model.DetailRecord, {foreignKey: 'away_detail', as: 'away_record'})
    Standing.belongsTo(model.DetailRecord, {foreignKey: 'total_detail', as: 'total_record'})
  }
  return Standing
}
