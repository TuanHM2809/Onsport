'use strict'
module.exports = (sequelize, DataTypes) => {
  var UserDevice = sequelize.define('UserDevice', {
    user_id: DataTypes.INTEGER,
    device_id: DataTypes.STRING,
    device_token: DataTypes.STRING,
    is_login: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'user_devices',
    timestamps: false
  })
  return UserDevice
}
