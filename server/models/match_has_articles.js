'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchArticle = sequelize.define('MatchArticle', {
    match_id: DataTypes.INTEGER,
    article_id: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    underscored: true,
    tableName: 'matches_has_articles'
  })
  return MatchArticle
}
