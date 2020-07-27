'use strict'
var Constant = require('../constants')
module.exports = function (sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    description: DataTypes.TEXT,
    content: DataTypes.TEXT,
    link: DataTypes.STRING,
    start_catchup: {
      allowNull: true,
      type: DataTypes.DATE
    },
    end_catchup: {
      allowNull: true,
      type: DataTypes.DATE
    },
    link_type: {
      type: DataTypes.ENUM('STREAM', 'VIDEO'),
      defaultValue: 'STREAM'
    },
    show_at: DataTypes.DATE,
    start_at: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('PUBLISHED', 'DRAFT'),
      defaultValue: 'PUBLISHED'
    },
    thumbnail: DataTypes.STRING,
    deleted_at: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'live_events'
  })

  Event.associate = (model) => {
    Event.belongsToMany(model.Category, {
      through: {
        model: model.CategoryItem,
        scope: {
          categoriable_type: Constant.EVENT_TYPE
        }
      },
      foreignKey: 'categoriable_id',
      as: 'categories'
    })
  }
  return Event
}
