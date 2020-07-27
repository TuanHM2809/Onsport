'use strict'
module.exports = (sequelize, DataTypes) => {
  var VLStanding = sequelize.define('VLStanding', {
    team_id: DataTypes.INTEGER,
    season_id: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    wins: DataTypes.INTEGER,
    loses: DataTypes.INTEGER,
    ties: DataTypes.INTEGER,
    goal_in: DataTypes.INTEGER,
    goal_out: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    round_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'vleague_standings',
    underscored: true
  })

  VLStanding.associate = model => {
    VLStanding.belongsTo(model.Round, { foreignKey: 'round_id', as: 'round' })
    VLStanding.belongsTo(model.Team, { foreignKey: 'team_id', as: 'team' })
    VLStanding.belongsTo(model.Season, { foreignKey: 'season_id', as: 'season' })
  }
  return VLStanding
}
