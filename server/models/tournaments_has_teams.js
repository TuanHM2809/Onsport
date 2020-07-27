'use strict'
module.exports = function (sequelize, DataTypes) {
  var TournamentTeam = sequelize.define('TournamentTeam', {
    team_id: DataTypes.STRING,
    tournament_id: DataTypes.STRING,
    season_id: DataTypes.INTEGER,
    division_id: DataTypes.INTEGER
  }, {
    tableName: 'tournaments_has_teams',
    underscored: true,
    timestamps: false
  })
  return TournamentTeam
}
