'use strict'
module.exports = function (sequelize, DataTypes) {
  var MatchEvent = sequelize.define('MatchEvent', {
    event_type_id: DataTypes.INTEGER,
    action_owner: DataTypes.STRING,
    target: DataTypes.STRING,
    video: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    match_id: DataTypes.INTEGER,
    time: DataTypes.TIME,
    gmt_time: DataTypes.DATE,
    action_owner_team_id: DataTypes.INTEGER,
    target_team_id: DataTypes.INTEGER,
    assist: DataTypes.STRING,
    assist_type: DataTypes.STRING,
    detail: DataTypes.STRING,
    additional_time: {
      type: DataTypes.INTEGER
    },
    is_own_goal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    },
    is_second_yellow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: false
    }
  }, {
    underscored: true,
    tableName: 'match_events',
    timestamps: false
  })

  MatchEvent.associate = (model) => {
    MatchEvent.belongsTo(model.Match, {foreignKey: 'match_id', as: 'match'})
    MatchEvent.belongsTo(model.MatchEventType, {foreignKey: 'event_type_id', as: 'type'})
    MatchEvent.belongsTo(model.Team, {foreignKey: 'action_owner_team_id', as: 'action_owner_team'})
    MatchEvent.belongsTo(model.Team, {foreignKey: 'target_team_id', as: 'target_team'})
  }
  return MatchEvent
}
