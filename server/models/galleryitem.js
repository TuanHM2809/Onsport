'use strict'
module.exports = (sequelize, DataTypes) => {
  var GalleryItem = sequelize.define('GalleryItem', {
    gallery_id: DataTypes.INTEGER,
    file_id: DataTypes.INTEGER,
    caption: DataTypes.STRING,
    featured: DataTypes.BOOLEAN,
    lft: DataTypes.INTEGER,
    rgt: DataTypes.INTEGER,
    depth: DataTypes.STRING,
    visible: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'gallery_file',
    timestamps: false,
    underscored: true
  })
  GalleryItem.associate = function (models) {
    GalleryItem.belongsTo(models.File, {
      as: 'file',
      foreignKey: 'file_id'
    })
  }
  return GalleryItem
}
