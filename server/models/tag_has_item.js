'use strict'
module.exports = function (sequelize, DataTypes) {
  var ItemTag = sequelize.define('ItemTag', {
    tag_id: DataTypes.INTEGER,
    taggable_id: DataTypes.INTEGER,
    taggable_type: DataTypes.STRING,
    status: true
  }, {
    underscored: true,
    tableName: 'taggables'
  })
  return ItemTag
}
