'use strict'
module.exports = function (sequelize, DataTypes) {
  var Match = sequelize.define('Match', {
    home_team: DataTypes.INTEGER,
    away_team: DataTypes.INTEGER,
    home_team_score: DataTypes.INTEGER,
    away_team_score: DataTypes.INTEGER,
    visible: DataTypes.BOOLEAN,
    start_at: DataTypes.DATE,
    end_at: DataTypes.DATE,
    tournament_id: DataTypes.INTEGER,
    winner_id: DataTypes.INTEGER,
    season_id: DataTypes.INTEGER,
    top11_matchId: {
      type: DataTypes.INTEGER
    },
    is_vleague: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    },
    status: {
      type: DataTypes.ENUM('Pre-Game', 'Processing', 'Final', 'Postponed'),
      defaultValue: 'Processing'
    },
    venue: {
      type: DataTypes.STRING
    },
    referee: {
      type: DataTypes.STRING
    },
    round_id: {
      type: DataTypes.INTEGER
    },
    match_sumary: DataTypes.TEXT,
    home_color: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    away_color: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    hashtag: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    attendance: {
      allowNull: true,
      type: DataTypes.INTEGER
    }
  }, {
    underscored: true,
    tableName: 'matches',
    timestamps: false
  })

  Match.associate = (model) => {
    Match.belongsTo(model.Team, { foreignKey: 'home_team', as: 'home' })
    Match.belongsTo(model.Team, { foreignKey: 'away_team', as: 'away' })
    Match.belongsTo(model.Team, { foreignKey: 'winner_id', as: 'winner' })
    Match.belongsTo(model.Season, { foreignKey: 'season_id', as: 'season' })
    Match.belongsTo(model.Round, { foreignKey: 'round_id', as: 'round' })
    Match.belongsTo(model.Tournament, { foreignKey: 'tournament_id', as: 'tournament' })
    // nghiA add this
    Match.hasMany(model.MatchEvent, { foreignKey: 'match_id', as: 'match_events' })
    Match.hasMany(model.MatchStat, { foreignKey: 'match_id', as: 'match_stats' })
    Match.hasMany(model.Lineup, { foreignKey: 'match_id', as: 'lineups' })

    Match.belongsToMany(model.Post, {
      through: {
        model: model.MatchArticle
      },
      foreignKey: 'match_id',
      otherKey: 'article_id',
      as: 'posts'
    })

    Match.belongsToMany(model.File, {
      through: {
        model: model.MatchPhoto
      },
      foreignKey: 'match_id',
      as: 'photos'
    })

    Match.belongsToMany(model.File, {
      through: {
        model: model.MatchVideo
      },
      foreignKey: 'match_id',
      as: 'videos'
    })
  }
  return Match
}
