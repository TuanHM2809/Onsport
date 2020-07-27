'use strict'
module.exports = function (sequelize, DataTypes) {
  var Platform = sequelize.define('PlatformItem', {
    platform_id: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    item_type: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'platforms_has_items'
  })
  return Platform
}
