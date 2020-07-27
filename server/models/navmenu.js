'use strict'
module.exports = function (sequelize, DataTypes) {
  var NavMenu = sequelize.define('NavMenu', {
    name: DataTypes.STRING,
    link: DataTypes.TEXT,
    item_id: DataTypes.INTEGER,
    item_type: DataTypes.STRING,
    page_id: DataTypes.INTEGER,
    parent_id: DataTypes.INTEGER,
    lft: DataTypes.INTEGER,
    rgt: DataTypes.INTEGER,
    depth: DataTypes.INTEGER,
    deleted_at: DataTypes.DATE
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'menu_items',
    underscored: true
  })
  NavMenu.associate = function (models) {
    NavMenu.hasMany(models.NavMenu, {
      as: 'children',
      foreignKey: 'parent_id',
      sourceKey: 'id'
    })

    NavMenu.belongsTo(models.Category, {
      where: {
        item_type: 'category'
      },
      as: 'category',
      foreignKey: 'item_id'
    })
  }
  return NavMenu
}
