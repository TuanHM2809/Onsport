'use strict'
var Constant = require('../constants')
module.exports = (sequelize, DataTypes) => {
  var ScreenBlock = sequelize.define('ScreenBlock', {
    title: DataTypes.STRING,
    icon: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.ENUM([Constant.POST_TYPE, Constant.CATEGORY_TYPE, Constant.LONGFORM_TYPE, Constant.MEDIA_TYPE, Constant.PUNDIT_TYPE, Constant.GALLERY_TYPE]),
    clickable: DataTypes.BOOLEAN,
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
    tableName: 'screen_blocks',
    underscored: true
  })
  ScreenBlock.associate = function (models) {
    ScreenBlock.hasMany(models.ScreenBlockItem, {
      as: 'screen_block_items',
      foreignKey: 'screen_block_id'
    })
  }
  return ScreenBlock
}
