'use strict'
module.exports = function (sequelize, DataTypes) {
  var TagItem = sequelize.define('TagItem', {
    tag_id: DataTypes.INTEGER,
    taggable_id: DataTypes.INTEGER,
    taggable_type: DataTypes.STRING,
    status: DataTypes.BOOLEAN
  }, {
    tableName: 'taggables',
    underscored: true,
    timestamps: false
  })
  return TagItem
}
