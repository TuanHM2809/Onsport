'use strict'
module.exports = function (sequelize, DataTypes) {
  var Team = sequelize.define(
    'Team',
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      top11_teamId: {
        type: DataTypes.INTEGER
      },
      abbreviation: {
        type: DataTypes.STRING
      },
      establish: DataTypes.STRING,
      stadium: DataTypes.STRING,
      coach: DataTypes.STRING,
      vl_teamid: {
        type: DataTypes.INTEGER
      }
      // tournament_id: DataTypes.INTEGER
    },
    {
      underscored: true,
      tableName: 'teams'
    }
  )

  Team.associate = model => {
    Team.belongsToMany(model.Tournament, {
      through: {
        model: model.TournamentTeam
      },
      foreignKey: 'team_id',
      as: 'tournaments'
    })

    Team.belongsToMany(model.Tag, {
      through: {
        model: model.TagItem,
        scope: {
          taggable_type: 'team'
        }
      },
      foreignKey: 'taggable_id',
      as: 'tags'
    })

    Team.hasMany(model.Lineup, {
      foreignKey: 'team_id',
      as: 'lineups'
    })

    Team.hasMany(model.Player, { // cho nay kieu gi cung sai. vi k lien ket 1 nhieu kieu nay
      foreignKey: 'team_id',
      as: 'players'
    })
  }
  return Team
}
