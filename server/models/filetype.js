'use strict'
module.exports = (sequelize, DataTypes) => {
  var FileType = sequelize.define('FileType', {
    name: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'file_types'
  })
  return FileType
}
