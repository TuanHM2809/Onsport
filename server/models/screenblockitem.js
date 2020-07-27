'use strict'
var Constant = require('../constants')
module.exports = (sequelize, DataTypes) => {
  var ScreenBlockItem = sequelize.define('ScreenBlockItem', {
    screen_block_id: DataTypes.INTEGER,
    icon: DataTypes.STRING,
    item_id: DataTypes.INTEGER,
    item_type: DataTypes.STRING,
    lft: DataTypes.INTEGER,
    rgt: DataTypes.INTEGER,
    depth: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    visible: DataTypes.BOOLEAN,
    created_by: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'screen_block_items',
    underscored: true
  })
  ScreenBlockItem.associate = function (models) {
    ScreenBlockItem.hasMany(models.ScreenBlockItem, {
      as: 'children',
      foreignKey: 'parent_id',
      sourceKey: 'id'
    })
    ScreenBlockItem.belongsTo(models.Category, {
      as: 'item',
      foreignKey: 'item_id',
      scope: {
        item_type: Constant.CATEGORY_TYPE
      },
      targetKey: 'id'
    })
    ScreenBlockItem.belongsTo(models.Gallery, {
      as: 'galleries',
      foreignKey: 'item_id',
      scope: {
        item_type: Constant.GALLERY_TYPE
      },
      targetKey: 'id'
    })
    ScreenBlockItem.belongsTo(models.Post, {
      as: 'posts',
      foreignKey: 'item_id',
      scope: {
        item_type: Constant.POST_TYPE
      },
      targetKey: 'id'
    })
    ScreenBlockItem.belongsTo(models.File, {
      as: 'Videos',
      foreignKey: 'item_id',
      scope: {
        item_type: Constant.FILE_TYPE
      },
      targetKey: 'id'
    })
  }
  return ScreenBlockItem
}
