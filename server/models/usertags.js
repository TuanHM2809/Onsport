'use strict'
module.exports = (sequelize, DataTypes) => {
  var UserDevice = sequelize.define('UserTag', {
    user_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {
    tableName: 'users_follow_tags',
    underscored: true,
    timestamps: false
  })
  return UserDevice
}
