'use strict'
var Constant = require('../constants')
module.exports = function (sequelize, DataTypes) {
  var LiveChannelSchedule = sequelize.define('LiveChannelSchedule', {
    title: DataTypes.STRING,
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    description: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    live_channel_id: DataTypes.INTEGER
  }, {
    underscored: true,
    tableName: 'live_channel_schedules',
    timestamps: true
  })

  LiveChannelSchedule.associate = model => {
    LiveChannelSchedule.belongsTo(model.LiveChannel, { foreignKey: 'live_channel_id', as: 'live_channel' })
    LiveChannelSchedule.belongsToMany(model.Tag, {
      through: {
        model: model.ItemTag,
        scope: {
          taggable_type: Constant.SCHEDULE_TYPE
        }
      },
      foreignKey: 'taggable_id',
      as: 'Tags'
    })
  }
  return LiveChannelSchedule
}
