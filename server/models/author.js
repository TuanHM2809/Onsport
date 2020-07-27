'use strict'
module.exports = function (sequelize, DataTypes) {
  var Author = sequelize.define('Author', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    avatar: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'authors'
  })
  Author.associate = model => {
    Author.belongsToMany(model.File, {
      through: {
        model: model.Authorable,
        scope: {
          authorable_type: 'file'
        }
      },
      foreignKey: 'author_id',
      otherKey: 'authorable_id',
      as: 'videos'
    })
    Author.belongsToMany(model.Post, {
      through: {
        model: model.Authorable,
        scope: {
          authorable_type: 'article'
        }
      },
      foreignKey: 'author_id',
      otherKey: 'authorable_id',
      as: 'posts'
    })

    Author.belongsToMany(model.Gallery, {
      through: {
        model: model.Authorable,
        scope: {
          authorable_type: 'gallery'
        }
      },
      foreignKey: 'author_id',
      otherKey: 'authorable_id',
      as: 'galleries'
    })
  }

  return Author
}
