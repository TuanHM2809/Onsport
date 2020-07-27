'use strict'
module.exports = function (sequelize, DataTypes) {
  var GaStats = sequelize.define('GaStats', {
    item_type: DataTypes.STRING,
    slug: DataTypes.STRING,
    view: DataTypes.INTEGER
  }, {
    underscored: true, // chap nhan item_type
    tableName: 'ga_stats',
    timestamps: false //khong dung timestamps
  })
  return GaStats
}
