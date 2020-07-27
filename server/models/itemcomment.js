'use strict'
module.exports = function (sequelize, DataTypes) {
  var ItemComment = sequelize.define('ItemComment', {
    commentable_id: DataTypes.STRING,
    commentable_type: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    content: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    visible: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'comments',
    underscored: true
  })
  ItemComment.associate = function (models) {
    ItemComment.hasMany(models.ItemCommentLike, {
      as: 'likes',
      foreignKey: 'comment_id'
    })
    ItemComment.belongsTo(models.User, {
      as: 'author',
      foreignKey: 'user_id'
    })
    ItemComment.hasMany(models.ItemComment, {
      as: 'children',
      foreignKey: 'parent_id'
    })
  }
  return ItemComment
}
