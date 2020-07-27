'use strict'
module.exports = function (sequelize, DataTypes) {
  var Pundit = sequelize.define('Pundit', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    avatar: DataTypes.STRING,
    bio: DataTypes.TEXT
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'pundits'
  })
  Pundit.associate = model => {
    Pundit.belongsToMany(model.File, {
      through: {
        model: model.Punditable,
        scope: {
          punditable_type: 'file'
        }
      },
      foreignKey: 'pundit_id',
      otherKey: 'punditable_id',
      as: 'videos'
    })
    Pundit.belongsToMany(model.Post, {
      through: {
        model: model.Punditable,
        scope: {
          punditable_type: 'article'
        }
      },
      foreignKey: 'pundit_id',
      otherKey: 'punditable_id',
      as: 'posts'
    })

    Pundit.belongsToMany(model.Gallery, {
      through: {
        model: model.Punditable,
        scope: {
          punditable_type: 'gallery'
        }
      },
      foreignKey: 'pundit_id',
      otherKey: 'punditable_id',
      as: 'galleries'
    })
  }

  return Pundit
}
