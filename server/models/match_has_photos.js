
'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchPhoto = sequelize.define('MatchPhoto', {
    match_id: DataTypes.INTEGER,
    file_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    underscored: true,
    tableName: 'matches_has_photos'
  })
  return MatchPhoto
}
