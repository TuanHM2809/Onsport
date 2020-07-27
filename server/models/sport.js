'use strict'
module.exports = function (sequelize, DataTypes) {
  var Sport = sequelize.define('Sport', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    thumbnail: DataTypes.STRING
  }, {
    underscored: true,
    tableName: 'sports'
  })

  Sport.associate = (model) => {
    Sport.hasMany(model.Tournament, {
      foreignKey: 'sport_id',
      as: 'tournaments'
    })
    Sport.belongsToMany(model.Tag, {
      through: {
        model: model.TagItem,
        scope: {
          taggable_type: 'sport'
        }
      },
      foreignKey: 'taggable_id',
      as: 'tags'
    })
  }
  return Sport
}
