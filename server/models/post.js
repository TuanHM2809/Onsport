'use strict'
var Constant = require('../constants')
module.exports = function (sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    short_title: DataTypes.STRING,
    title_position: {
      type: DataTypes.ENUM('top', 'top_left', 'top_right', 'center', 'bottom_left', 'bottom', 'bottom_right'),
      defaultValue: 'center'
    },
    source: DataTypes.STRING,
    short_description: DataTypes.TEXT,
    post_type: DataTypes.ENUM(Constant.LONGFORM_TYPE, Constant.NORMAL_TYPE),
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
      defaultValue: 'PUBLISHED'
    },
    breaking_news: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    thumbnail: DataTypes.STRING,
    poster: DataTypes.STRING,
    poster_mobile: DataTypes.STRING,
    date: {
      type: DataTypes.DATE
    },
    content: DataTypes.TEXT,
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE
    },
    type: {
      type: DataTypes.VIRTUAL,
      get () {
        return Constant.POST_TYPE
      }
    }
  }, {
    tableName: 'articles',
    underscored: true
  })

  Post.associate = (model) => {
    Post.belongsToMany(model.Category, {
      through: {
        model: model.CategoryItem,
        scope: {
          categoriable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'categoriable_id',
      as: 'categories'
    })

    Post.belongsToMany(model.Platform, {
      through: {
        model: model.PlatformItem,
        scope: {
          item_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'item_id',
      as: 'platforms_has_posts'
    })

    Post.belongsToMany(model.Tag, {
      through: {
        model: model.ItemTag,
        scope: {
          taggable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'taggable_id',
      as: 'Tags'
    })

    Post.hasMany(model.ItemLike, {
      scope: {
        item_type: Constant.POST_TYPE
      },
      foreignKey: 'item_id',
      as: 'likes'
    })

    Post.belongsToMany(model.Pundit, {
      through: {
        model: model.Punditable,
        scope: {
          punditable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'punditable_id',
      as: 'pundit'
    })

    Post.belongsToMany(model.Author, {
      through: {
        model: model.Authorable,
        scope: {
          authorable_type: Constant.POST_TYPE
        }
      },
      foreignKey: 'authorable_id',
      as: 'author'
    })

    // // nghia add this
    Post.belongsToMany(model.Match, {
      through: {
        model: model.MatchArticle
      },
      foreignKey: 'article_id',
      as: 'matches'
    })
  }
  return Post
}
