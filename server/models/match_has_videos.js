'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchVideo = sequelize.define('MatchVideo', {
    match_id: DataTypes.INTEGER,
    file_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    underscored: true,
    tableName: 'matches_has_videos'
  })
  return MatchVideo
}
