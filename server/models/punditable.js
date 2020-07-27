'use strict'
module.exports = function (sequelize, DataTypes) {
  var Punditable = sequelize.define('Punditable', {
    pundit_id: DataTypes.INTEGER,
    punditable_type: DataTypes.STRING,
    punditable_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'punditables'
  })
  return Punditable
}
