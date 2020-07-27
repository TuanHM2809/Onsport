'use strict'
var Constant = require('../constants')
module.exports = function (sequelize, DataTypes) {
  var File = sequelize.define('File', {
    url: DataTypes.STRING,
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT,
    featured: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
      defaultValue: 'PUBLISHED'
    },
    is_free: DataTypes.BOOLEAN,
    thumbnail: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    date: DataTypes.DATE,
    metadata: DataTypes.JSON,
    file_type_id: DataTypes.INTEGER,
    //TuanHM
    transcode_status: DataTypes.INTEGER,
    //TuanHM
  }, {
    underscored: true,
    tableName: 'files'
  })
  File.associate = function (models) {
    File.belongsTo(models.FileType, {
      as: 'type',
      foreignKey: 'file_type_id'
    })
    File.belongsToMany(models.Category, {
      through: {
        model: models.CategoryItem,
        scope: {
          categoriable_type: Constant.FILE_TYPE
        }
      },
      foreignKey: 'categoriable_id',
      as: 'categories'
    })
    File.belongsToMany(models.Platform, {
      through: {
        model: models.PlatformItem,
        scope: {
          item_type: Constant.FILE_TYPE
        }
      },
      foreignKey: 'item_id',
      as: 'platforms_has_files'
    })
    File.belongsToMany(models.Tag, {
      through: {
        model: models.TagItem,
        scope: {
          taggable_type: Constant.FILE_TYPE
        }
      },
      foreignKey: 'taggable_id',
      as: 'Tags'
    })
    File.hasMany(models.ItemLike, {
      scope: {
        item_type: Constant.FILE_TYPE
      },
      foreignKey: 'item_id',
      as: 'likes'
    })
    File.belongsToMany(models.Pundit, {
      through: {
        model: models.Punditable,
        scope: {
          punditable_type: Constant.FILE_TYPE
        }
      },
      foreignKey: 'punditable_id',
      as: 'pundit'
    })

    File.belongsToMany(models.Author, {
      through: {
        model: models.Authorable,
        scope: {
          authorable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'authorable_id',
      as: 'author'
    })
    // nghia add this
    File.belongsToMany(models.Match, {
      through: {
        model: models.MatchPhoto
      },
      foreignKey: 'file_id',
      as: 'matches_photos'
    })
    File.belongsToMany(models.Match, {
      through: {
        model: models.MatchVideo
      },
      foreignKey: 'file_id',
      as: 'matches_videos'
    })
  }
  return File
}
