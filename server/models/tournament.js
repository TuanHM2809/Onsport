'use strict'
module.exports = function (sequelize, DataTypes) {
  var Tournament = sequelize.define('Tournament', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    abbreviation: DataTypes.STRING,
    top11_leagueId: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    sport_id: DataTypes.INTEGER,
    league_type: DataTypes.INTEGER,
    display_name: DataTypes.STRING,
    status: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'tournaments'
  })
  Tournament.associate = (model) => {
    Tournament.belongsTo(model.Sport, {
      foreignKey: 'sport_id',
      as: 'sport'
    })

    Tournament.belongsToMany(model.Team, {
      through: {
        model: model.TournamentTeam
      },
      foreignKey: 'tournament_id',
      as: 'teams'
    })

    Tournament.belongsToMany(model.Tag, {
      through: {
        model: model.TagItem,
        scope: {
          taggable_type: 'tournament'
        }
      },
      foreignKey: 'taggable_id',
      as: 'tags'
    })

    Tournament.hasMany(model.Standing, { foreignKey: 'tournament_id', as: 'standings' })

    Tournament.hasMany(model.Match, { foreignKey: 'tournament_id', as: 'matches' })
  }
  return Tournament
}
