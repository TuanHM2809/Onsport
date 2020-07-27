'use strict'
var Constant = require('../constants')
module.exports = (sequelize, DataTypes) => {
  var Gallery = sequelize.define('Gallery', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    content: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
      defaultValue: 'PUBLISHED'
    },
    deleted_at: DataTypes.DATE,
    type: {
      type: DataTypes.VIRTUAL,
      get () {
        return Constant.GALLERY_TYPE
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'galleries',
    underscored: true
  })
  Gallery.associate = function (models) {
    Gallery.hasMany(models.GalleryItem, {
      as: 'gallery_items',
      foreignKey: 'gallery_id'
    })

    Gallery.belongsToMany(models.Pundit, {
      through: {
        model: models.Punditable,
        scope: {
          punditable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'punditable_id',
      as: 'pundit'
    })

    Gallery.belongsToMany(models.Author, {
      through: {
        model: models.Authorable,
        scope: {
          authorable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'authorable_id',
      as: 'author'
    })

    Gallery.belongsToMany(models.Category, {
      through: {
        model: models.CategoryItem,
        scope: {
          categoriable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'categoriable_id',
      as: 'categories'
    })

    Gallery.belongsToMany(models.Tag, {
      through: {
        model: models.ItemTag,
        scope: {
          taggable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'taggable_id',
      as: 'Tags'
    })
  }
  return Gallery
}
