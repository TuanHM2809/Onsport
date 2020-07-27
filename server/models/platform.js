'use strict'
module.exports = function (sequelize, DataTypes) {
  var Platform = sequelize.define('Platform', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    is_special: DataTypes.BOOLEAN
  }, {
    underscored: true,
    tableName: 'platforms'
  })
  return Platform
}
