'use strict'

module.exports = function (sequelize, DataTypes) {
  var LineupItem = sequelize.define('LineupItem', {
    row: DataTypes.INTEGER,
    column: DataTypes.INTEGER,
    lineup_id: DataTypes.STRING,
    is_home: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1
    },
    player_id: DataTypes.INTEGER,
    sector_id: DataTypes.FLOAT
  }, {
    underscored: true,
    tableName: 'lineups_items',
    timestamps: false
  })

  LineupItem.associate = model => {
    LineupItem.belongsTo(model.Lineup, { foreign: 'lineup_id', as: 'lineup' })
    LineupItem.belongsTo(model.Player, { foreign: 'player_id', as: 'player' })
  }
  return LineupItem
}
