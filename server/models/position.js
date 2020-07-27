'use strict'
module.exports = (sequelize, DataTypes) => {
  var Position = sequelize.define('Position', {
    name: DataTypes.STRING,
    abbr: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    underscored: true,
    tableName: 'positions',
    timestamps: false
  })

  Position.associate = model => {
    Position.hasMany(model.Player, { foreignKey: 'position_id', as: 'players' })
  }
  return Position
}
