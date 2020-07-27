'use strict';
module.exports = (sequelize, DataTypes) => {
  var Slider = sequelize.define('Sliders', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    type: DataTypes.ENUM('gallery', 'slide'),
    desc: DataTypes.STRING,
    seo_title: DataTypes.STRING,
    seo_desc: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Slider;
};