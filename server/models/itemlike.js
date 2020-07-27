'use strict'
module.exports = (sequelize, DataTypes) => {
  var ItemLike = sequelize.define('ItemLike', {
    item_id: DataTypes.INTEGER,
    item_type: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'item_likes',
    timestamps: false
  })
  return ItemLike
}
