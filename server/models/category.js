'use strict'
var Constant = require('../constants')

module.exports = function (sequelize, DataTypes) {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.STRING,
    seo_title: DataTypes.STRING,
    seo_description: DataTypes.STRING,
    type: DataTypes.ENUM(Constant.VIDEO_TYPE, Constant.POST_TYPE),
    lft: DataTypes.INTEGER,
    rgt: DataTypes.INTEGER,
    pinned_id: DataTypes.INTEGER,
    pinned_type: DataTypes.STRING,
    status: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    tableName: 'categories',
    timestamps: false,
    underscored: true
  })
  Category.associate = (models) => {
    Category.belongsToMany(models.Post, {
      through: {
        model: models.CategoryItem,
        scope: {
          categoriable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'category_id',
      as: 'posts',
      where: {
        delete_at: null,
        status: 'PUBLISHED'
      }
    })
    Category.belongsToMany(models.File, {
      through: {
        model: models.CategoryItem,
        scope: {
          categoriable_type: Constant.FILE_TYPE
        }
      },
      foreignKey: 'category_id',
      as: 'videos',
      where: {
        delete_at: null,
        status: 'PUBLISHED'
      }
    })
    Category.belongsToMany(models.Event, {
      through: {
        model: models.CategoryItem,
        scope: {
          categoriable_type: Constant.EVENT_TYPE
        }
      },
      foreignKey: 'category_id',
      as: 'events',
      where: {
        delete_at: null,
        status: 'PUBLISHED'
      }
    })
    Category.hasMany(models.Category, {
      as: 'children',
      foreignKey: 'parent_id',
      sourceKey: 'id'
    })
  }

  return Category
}
