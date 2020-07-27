'use strict'
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    cab_id: DataTypes.STRING,
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    dob: DataTypes.DATE,
    address: DataTypes.TEXT,
    avatar: DataTypes.TEXT,
    verify: DataTypes.BOOLEAN,
    has_password: DataTypes.BOOLEAN,
    is_verify_rm: DataTypes.BOOLEAN
  }, {
    tableName: 'users',
    timestamps: false,
    underscored: true
  })
  User.associate = function (models) {
    User.hasMany(models.UserToken, {
      as: 'UserToken',
      foreignKey: 'user_id'
    })
    User.hasMany(models.UserPhone, {
      as: 'UserPhone',
      foreignKey: 'user_id'
    })
    User.hasMany(models.UserEmail, {
      as: 'UserEmail',
      foreignKey: 'user_id'
    })
    User.hasMany(models.UserDevice, {
      as: 'UserDevice',
      foreignKey: 'user_id'
    })
  }

  return User
}
