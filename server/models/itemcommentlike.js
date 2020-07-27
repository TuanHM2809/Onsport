'use strict'
module.exports = function (sequelize, DataTypes) {
  var ItemCommentLike = sequelize.define('ItemCommentLike', {
    comment_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'comment_like',
    timestamps: false
  })
  ItemCommentLike.associate = function (models) {
    ItemCommentLike.belongsTo(models.User, {
      as: 'user_likes',
      foreignKey: 'user_id'
    })
  }
  return ItemCommentLike
}
