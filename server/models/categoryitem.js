'use strict'
module.exports = function (sequelize, DataTypes) {
  var CategoryItem = sequelize.define('CategoryItem', {
    category_id: DataTypes.INTEGER,
    categoriable_id: DataTypes.INTEGER,
    categoriable_type: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    tableName: 'categoriables',
    underscored: true,
    timestamps: false
  })
  return CategoryItem
}
