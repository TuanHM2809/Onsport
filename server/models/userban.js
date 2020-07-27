'use strict'
module.exports = (sequelize, DataTypes) => {
  var UserBan = sequelize.define('UserBan', {
    user_id: DataTypes.INTEGER,
    reason: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    },
    tableName: 'user_bans',
    timestamps: false
  })
  return UserBan
}
