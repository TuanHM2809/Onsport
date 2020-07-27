'use strict'
module.exports = (sequelize, DataTypes) => {
  var UserEmail = sequelize.define('UserEmail', {
    user_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    verify: DataTypes.BOOLEAN,
    is_default: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'user_emails',
    timestamps: false
  })
  return UserEmail
}
