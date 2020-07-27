const baseUrl = 'http://api.top11.vn/api/stats/matches?time_zone_offset=420'
let models = require('../server/models/index1')
let axios = require('axios')
let Promise = require('bluebird')
let _ = require('lodash')
let moment = require('moment')
var Constant = require('../server/constants')

Promise.all([
  models.Tournament.findAll({
    raw: true
  }),
  models.Division.findAll({
    raw: true
  }),
  models.Season.findAll({
    raw: true
  }),
  models.MatchEventType.findAll({
    raw: true
  }),
  models.Team.findAll({
    raw: true
  }),
  models.CrawlSchedule.findOne({
    where: {
      end_at: {
        // $gt: `${models.sequelize.fn('NOW')}`
        $gt: `${moment().subtract(5, 'days').toDate()}`
      }
    },
    order: [
      ['start_at', 'desc']
    ]
  })
]).spread(async (tours, divisions, seasons, types, teams, schedule) => {
  let tour_ids = _.map(tours, 'top11_leagueId')

  if (!schedule) {
    schedule = await models.CrawlSchedule.create({
      start_at: models.sequelize.fn('NOW'),
      end_at: models.sequelize.literal('DATE_ADD(NOW(), INTERVAL 30 DAY)'),
      status: 0
    })
  } else {
    if (schedule && schedule.status) {
      return process.exit(0)
    }
  }
  let start_date = moment.utc().format('YYYY-MM-DD')
  let end_date = moment.utc().add(30, 'days').format('YYYY-MM-DD')
  // console.log(start_date, end_date)
  // console.log(`${baseUrl}&start_date=${start_date}&end_date=${end_date}&league_id=[${tour_ids}]`)
  let { data } = await axios.get(`${baseUrl}&start_date=${start_date}&end_date=${end_date}&league_id=[${tour_ids}]`)
  console.log(data)
  await Promise.map(data, async league => {
    await insertMatch(models, league, tours, divisions, seasons, types, teams)
  }, {
    concurrency: 2
  })
  schedule.status = 1
  await schedule.save()
  process.exit(0)
}).catch(e => {
  console.log(e)
  process.exit(-1)
})

async function insertMatch (models, league, tours, divisions, seasons, types, teams) {
  try {
    if (league.matches.length > 0) {
      await Promise.map(league.matches, async top11_match => {
        let season = _.find(seasons, s => s.season === top11_match.season)
        if (!season) {
          season = await models.Season.create({
            season: top11_match.season
          })
        }
        let match_data = {
          top11_matchId: top11_match.matchId,
          tournament: (_.find(tours, t => t.top11_leagueId)).id,
          season_id: season.id,
          start_at: moment(top11_match.startTimeDateFormat).format('YYYY-MM-DD HH:mm:ss')
        }

        // Lấy đội tham gia trận đấu

        let top11_home_team = _.find(top11_match.teams, t => t.teamLocationType.name === 'home') // lấy home team
        let top11_away_team = _.find(top11_match.teams, t => t.teamLocationType.name === 'away') // lấy away team
        let home_team = _.find(teams, t => t.top11_teamId === top11_home_team.teamId)
        let away_team = _.find(teams, t => t.top11_teamId === top11_away_team.teamId)
        if (!home_team || typeof home_team === 'undefined') {
          if (!top11_home_team.displayName) {
            return
          }
          home_team = await models.Team.findOrCreate({
            where: {
              top11_teamId: top11_home_team.teamId
            },
            defaults: {
              top11_teamId: top11_home_team.teamId,
              name: top11_home_team.displayName,
              abbreviation: top11_home_team.abbreviation
            }
          })
          let home_tag = await models.Tag.findOrCreate({
            where: {
              name: home_team[0].name
            },
            defaults: {
              name: home_team[0].name
            }
          })
          await Promise.all([
            models.TagItem.findOrCreate({
              where: {
                taggable_type: Constant.TEAM_TYPE,
                taggable_id: home_team[0].id
              },
              defaults: {
                taggable_type: Constant.TEAM_TYPE,
                taggable_id: home_team[0].id,
                tag_id: home_tag[0].id
              }
            }),
            models.TournamentTeam.findOrCreate({
              where: {
                team_id: home_team[0].id,
                tournament_id: (_.find(tours, t => t.top11_leagueId === league.leagueId)).id,
                season_id: season.id
              },
              defaults: {
                team_id: home_team.id,
                tournament_id: (_.find(tours, t => t.top11_leagueId === league.leagueId)).id,
                season_id: season.id
              }
              // Thiếu division : sau này tính sau
            })
          ])
          teams.push(home_team[0])
        }

        if (!away_team || typeof away_team === 'undefined') {
          if (!top11_away_team.displayName) {
            return
          }
          away_team = await models.Team.findOrCreate({
            where: {
              top11_teamId: top11_away_team.teamId
            },
            defaults: {
              top11_teamId: top11_away_team.teamId,
              name: top11_away_team.displayName,
              abbreviation: top11_away_team.abbreviation
            }
          })
          let away_tag = await models.Tag.findOrCreate({
            where: {
              name: away_team[0].name
            },
            defaults: {
              name: away_team[0].name
            }
          })
          await Promise.all([
            models.TagItem.findOrCreate({
              where: {
                taggable_type: Constant.TEAM_TYPE,
                taggable_id: away_team[0].id
              },
              defaults: {
                taggable_type: Constant.TEAM_TYPE,
                taggable_id: away_team[0].id,
                tag_id: away_tag[0].id
              }
            }),
            models.TournamentTeam.findOrCreate({
              where: {
                team_id: away_team[0].id,
                tournament_id: (_.find(tours, t => t.top11_leagueId === league.leagueId)).id,
                season_id: season.id
              },
              defaults: {
                team_id: away_team.id,
                tournament_id: (_.find(tours, t => t.top11_leagueId === league.leagueId)).id,
                season_id: season.id
              }
              // Thiếu division : sau này tính sau
            })
          ])
          teams.push(away_team[0])
        }
        match_data.home_team = home_team.id
        match_data.away_team = away_team.id

        // console.log(tours) // cay cay

        match_data.tournament_id = (_.find(tours, t => t.top11_leagueId === league.leagueId)).id
        match_data.season_id = season.id
        if (top11_home_team.isWinner) {
          match_data.winner_id = home_team.id
        } else if (top11_away_team.isWinner) {
          match_data.winner_id = away_team.id
        } else {
          match_data.winner_id = null
        }
        match_data.status = top11_match.status // set defaultValue là processing
        // Nếu trận đấu kết thúc
        if (match_data.status === 'Final') {
          match_data.home_team_score = top11_home_team.score
          match_data.away_team_score = top11_away_team.score
        }
        match_data.visible = 1 // fix cứng visible
        // match_data.venue = top11_match.venue.name
        let match = await upsert(models.Match, match_data, {
          top11_matchId: top11_match.matchId
        })
        return 1
      }, {
        concurrency: 150
      })
    }
    return null
  } catch (e) {
    console.log(e)
    return null
  }
}

async function upsert (Model, values, condition) {
  let model = await Model.findOne({ where: condition })
  if (model) { // update
    await model.update(values)
  } else { // insert
    await Model.create(values)
  }
  return model
}
