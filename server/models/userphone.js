'use strict'
module.exports = (sequelize, DataTypes) => {
  var UserPhone = sequelize.define('UserPhone', {
    user_id: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    verify: DataTypes.BOOLEAN,
    is_default: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'user_phones',
    timestamps: false
  })
  return UserPhone
}
