'use strict'
module.exports = (sequelize, DataTypes) => {
  var ScreenItem = sequelize.define('ScreenItem', {
    item_id: DataTypes.INTEGER,
    item_type: DataTypes.STRING,
    pin_top: DataTypes.BOOLEAN,
    order: DataTypes.INTEGER,
    created_by: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'screen_items',
    underscored: true
  })
  return ScreenItem
}
