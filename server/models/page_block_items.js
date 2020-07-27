'use strict'
module.exports = (sequelize, DataTypes) => {
  var PageBlockItem = sequelize.define('PageBlockItem', {
    page_block_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER,
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
      tableName: 'pages_block_items',
      underscored: true
    })
  PageBlockItem.associate = function (models) {
    PageBlockItem.hasMany(models.PageBlockItem, {
      as: 'children',
      foreignKey: 'parent_id',
      sourceKey: 'id'
    })
    PageBlockItem.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_id',
      targetKey: 'id'
    })
    PageBlockItem.belongsTo(models.PageBlock, {
      as: 'owner',
      foreignKey: 'page_block_id',
      targetKey: 'id'
    })
  }
  return PageBlockItem
}
