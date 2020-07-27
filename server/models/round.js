'use strict'
module.exports = function (sequelize, DataTypes) {
  var Round = sequelize.define('Round', {
    name: DataTypes.STRING,
    vleague_id: DataTypes.INTEGER,
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE
  }, {
    // classMethods: {
    //   associate: function(models) {
    //     // associations can be defined here
    //   }
    // }
    underscored: true,
    tableName: 'rounds'
  })

  Round.associate = (model) => {
    Round.hasMany(model.Match, { foreignKey: 'round_id', as: 'matches' })
    Round.hasMany(model.VLStanding, { foreignKey: 'round_id', as: 'vlStandings' })
  }
  return Round
}
