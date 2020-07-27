'use strict'
module.exports = function (sequelize, DataTypes) {
  var Authorable = sequelize.define('Authorable', {
    author_id: DataTypes.INTEGER,
    authorable_type: DataTypes.STRING,
    authorable_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'authorables'
  })
  return Authorable
}
