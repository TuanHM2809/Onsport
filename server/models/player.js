'use strict'
module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define('Player', {
    name: DataTypes.STRING,
    code: DataTypes.INTEGER,
    born_at: DataTypes.STRING,
    nation: DataTypes.STRING,
    dob: DataTypes.STRING,
    position_id: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    team_id: DataTypes.INTEGER,
    vl_teamid: DataTypes.INTEGER,
    vl_playerid: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'players',
    underscored: true
  })

  Player.associate = model => {
    Player.belongsTo(model.Team, {
      foreignKey: 'team_id',
      as: 'teams'
    })
    Player.belongsTo(model.Position, {
      foreignKey: 'position_id',
      as: 'positions'
    })
    Player.hasMany(model.LineupItem, {
      foreignKey: 'player_id',
      as: 'players'
    })
  }
  return Player
}
