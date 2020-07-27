'use strict'
module.exports = (sequelize, DataTypes) => {
  var UserToken = sequelize.define('UserToken', {
    user_id: DataTypes.INTEGER,
    access_token_cab: DataTypes.STRING,
    refresh_token_cab: DataTypes.STRING,
    access_token_on_sport: DataTypes.STRING,
    refresh_token_on_sport: DataTypes.STRING,
    ip: DataTypes.STRING,
    ua: DataTypes.TEXT,
    expired_at: DataTypes.DATE
  }, {
    underscored: true,
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'user_tokens',
    timestamps: false
  })

  UserToken.associate = function (models) {
    UserToken.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
  }
  return UserToken
}
