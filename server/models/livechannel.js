'use strict'
var Constant = require('../constants')
module.exports = function (sequelize, DataTypes) {
  var LiveChannel = sequelize.define('LiveChannel', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    display_name: DataTypes.STRING,
    short_description: DataTypes.STRING,
    description: DataTypes.STRING,
    link_type: DataTypes.ENUM('youtube', 'stream'),
    link: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
      defaultValue: 'PUBLISHED'
    },
    deleted_at: DataTypes.DATE,
    type: {
      type: DataTypes.VIRTUAL,
      get () {
        return 'live_channels'
      }
    }
  }, {
    underscored: true,
    tableName: 'live_channels',
    timestamps: true
  })

  LiveChannel.associate = model => {
    LiveChannel.belongsToMany(model.Category, {
      through: {
        model: model.CategoryItem,
        scope: {
          categoriable_type: Constant.LIVECHANNEL_TYPE
        }
      },
      foreignKey: 'categoriable_id',
      as: 'categories'
    })

    LiveChannel.belongsToMany(model.Platform, {
      through: {
        model: model.PlatformItem,
        scope: {
          item_type: Constant.LIVECHANNEL_TYPE
        }
      },
      foreignKey: 'item_id',
      as: 'platforms_has_posts'
    })

    LiveChannel.belongsToMany(model.Tag, {
      through: {
        model: model.ItemTag,
        scope: {
          taggable_type: Constant.LIVECHANNEL_TYPE
        }
      },
      foreignKey: 'taggable_id',
      as: 'Tags'
    })

    LiveChannel.hasMany(model.ItemLike, {
      scope: {
        item_type: Constant.LIVECHANNEL_TYPE
      },
      foreignKey: 'item_id',
      as: 'likes'
    })

    LiveChannel.hasMany(model.LiveChannelSchedule, { foreignKey: 'live_channel_id', as: 'schedules' })
    LiveChannel.hasOne(model.LiveChannelSchedule, { foreignKey: 'live_channel_id', as: 'live_program' })
  }
  return LiveChannel
}
