'use strict'
var Constant = require('../constants')
module.exports = (sequelize, DataTypes) => {
  var PageBlock = sequelize.define('PageBlock', {
    title: DataTypes.STRING,
    url: DataTypes.STRING,
    type: DataTypes.ENUM([Constant.POST_TYPE, Constant.VIDEO_TYPE, Constant.GALLERY_TYPE]),
    depth: DataTypes.INTEGER,
    visible: DataTypes.BOOLEAN,
    created_by: DataTypes.INTEGER
  }, {
      classMethods: {
        associate: function (models) {
          // associations can be defined here
        }
      },
      tableName: 'pages_blocks',
      underscored: true
    })
  PageBlock.associate = function (models) {
    PageBlock.hasMany(models.PageBlockItem, {
      as: 'page_block_items'
    })
  }
  return PageBlock
}
