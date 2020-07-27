'use strict';
module.exports = (sequelize, DataTypes) => {
  var SliderItem = sequelize.define('SliderItems', {
    slide_id: DataTypes.INTEGER,
    item_type: DataTypes.ENUM('image', 'video'),
    item_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    order: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return SliderItem;
};