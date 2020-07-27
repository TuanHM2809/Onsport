'use strict'
module.exports = (sequelize, DataTypes) => {
  var Tag = sequelize.define('Tag', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    status: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    defaultScope: {
      where: {
        status: 'PUBLISHED',
        deleted_at: null
      }
    },
    scopes: {
      hide: {
        where: {
          status: 'DRAFT',
          deleted_at: null
        }
      },
      show: {
        where: {
          status: 'PUBLISHED',
          deleted_at: null
        }
      }
    },
    underscored: true,
    timestamps: true,
    paranoid: true,
    tableName: 'tags'
  })
  Tag.associate = (model) => {
    Tag.belongsToMany(model.User, {
      through: {
        model: model.UserTag
      },
      foreignKey: 'tag_id',
      as: 'users'
    })

    Tag.belongsToMany(model.Sport, {
      through: {
        model: model.TagItem,
        scope: {
          taggable_type: 'sport'
        }
      },
      foreignKey: 'tag_id',
      otherKey: 'taggable_id',
      as: 'sports'
    })

    Tag.belongsToMany(model.Tournament, {
      through: {
        model: model.TagItem,
        scope: {
          taggable_type: 'tournament'
        }
      },
      foreignKey: 'tag_id',
      otherKey: 'taggable_id',
      as: 'tournaments'
    })
  }
  return Tag
}
