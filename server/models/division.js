'use strict'
module.exports = function (sequelize, DataTypes) {
  var Division = sequelize.define('Division', {
    top11_divisionId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    abbreviation: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'divisions'
  })
  return Division
}
