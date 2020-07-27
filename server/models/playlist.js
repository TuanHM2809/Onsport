'use strict';
module.exports = function(sequelize, DataTypes) {
  var Playlist = sequelize.define('Playlist', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    visible: DataTypes.BOOLEAN,
    published: DataTypes.BOOLEAN,
    author_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Playlist;
};