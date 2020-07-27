'use strict'
module.exports = (sequelize, DataTypes) => {
  var Setting = sequelize.define('Setting', {
    key: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    value: DataTypes.TEXT,
    field: DataTypes.TEXT,
    active: DataTypes.BOOLEAN
  }, {
    tableName: 'settings',
    underscored: true,
    timestamps: false
  })
  return Setting
}
