const baseUrl = 'http://api.top11.vn/api/stats/matches'
let models = require('../server/models/index1')
let axios = require('axios')
let Promise = require('bluebird')
let _ = require('lodash')
let moment = require('moment')

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
    raw: true,
    order: [
      ['code', 'desc']
    ]
  }),
  models.Team.findAll({
    raw: true
  }),
  models.Match.findAll({
    where: {
      status: 'Final'
    }
  }),
  models.MatchStatType.findAll({
    raw: true
  })
]).spread(async (tours, divisions, seasons, types, teams, matches, stat_types) => {
  await models.MatchEvent.destroy({ truncate: true })
  await models.MatchStat.destroy({ truncate: true })
  await Promise.map(matches, async match => {
    let { data } = await axios.get(`${baseUrl}/${match.top11_matchId}/matchOverview`)
    await Promise.all([
      updateMatch(models, match, teams, types, matches, data),
      insertMatchEvent(models, match, teams, types, matches, data),
      insertMatchStat(models, match, teams, types, matches, data, stat_types)
    ])
  }, {
    concurrency: 200
  })
  process.exit(0)
}).catch(e => {
  console.log(e)
  process.exit(-1)
})

async function insertMatchEvent (models, match, teams, types, matches, data) {
  try {
    match = await match.update({
      venue: data.venue.name,
      referee: data.gameDetail && !_.isEmpty(data.gameDetail) && data.gameDetail.referee && !_.isEmpty(data.gameDetail.referee) ? data.gameDetail.referee.name : null
    })
    // Nếu có detail về trận đấu
    if (data.periodDetails && data.periodDetails.length > 0) {
      data.periodDetails = _.map(data.periodDetails, p => {
        return _.omit(p, ['period'])
      })

      let events = data.periodDetails.reduce(function (result, currentObject) {
        for (var key in currentObject) {
          if (typeof result[key] === 'undefined') result[key] = []
          if (currentObject.hasOwnProperty(key)) {
            result[key] = result[key].concat(currentObject[key])
          }
        }
        return result
      }, {})
      // Tạo mảng event
      let array_events = await Promise.all(Object.keys(events).map(async key => {
        let type = _.find(types, t => t.name === key)
        if (!type) {
          type = await models.MatchEventType.create({
            name: key,
            code: types[0].code + 1
          })
          types.push(type.get({plain: true}))
        }
        let insert_event_data = await Promise.map(events[key], event => {
          let event_data = {}

          if (event.time && event.time && event.time.minutes >= 0 && event.time.minutes <= 100 && event.time.seconds >= 0 && event.time.seconds <= 60) {
            if (key !== 'substitutions') {
              event_data = {
                event_type_id: type.id,
                action_owner_team_id: (_.find(teams, t => t.top11_teamId === event.team.teamId)).id,
                action_owner: event.player.displayName,
                time: `${event.time.minutes}:${event.time.seconds}`,
                additional_time: `${event.time.additionalMinutes ? event.time.additionalMinutes : 0}`
              }
              // Nếu là bàn thắng thì kiểm tra xem có assist không
              if (key === 'goals') {
                event_data.detail = `event:${!_.isEmpty(event.playEvent) && event.playEvent ? event.playEvent.name : null},` +
                `shotType:${!_.isEmpty(event.shotType) && event.shotType ? event.shotType.name : null}`
                event_data.assist = event.assistingPlayer && event.assistingPlayer.displayName ? event.assistingPlayer.displayName : null
                event_data.assist_type = event.assistingPlayer && event.assistingPlayer.assistType ? event.assistingPlayer.assistType.name : null
              } else if (key === 'shots') {
                event_data.detail = `event:${!_.isEmpty(event.playEvent) && typeof event.playEvent !== 'undefined' ? event.playEvent.name : null},` +
                                     `shotType:${!_.isEmpty(event.shotType) && typeof event.shotType !== 'undefined' ? event.shotType.name : null},` +
                                     `shotResult:${!_.isEmpty(event.shotResult) && typeof event.shotResult !== 'undefined' ? event.shotResult.name : null},` +
                                     `shotDescription:${!_.isEmpty(event.shotDescription) && typeof event.shotDescription !== 'undefined' ? event.shotDescription.name : null}`
              }
            } else {
              event_data = {
                event_type_id: type.id,
                action_owner_team_id: (_.find(teams, t => t.top11_teamId === event.team.teamId)).id,
                action_owner: event.playerIn.displayName,
                target_team_id: (_.find(teams, t => t.top11_teamId === event.team.teamId)).id,
                time: `${event.time.minutes}:${event.time.seconds}`,
                additional_time: `${event.time.additionalMinutes}`,
                target: event.playerOut.displayName
              }
            }
            event_data.match_id = match.id
          }
          return event_data
        })
        return _.filter(insert_event_data, e => {
          return !_.isEmpty(e) && e.action_owner
        })
      }))

      array_events = [].concat.apply([], array_events)
      await models.MatchEvent.bulkCreate(array_events)
      return null
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

async function insertMatchStat (models, match, teams, types, matches, data, stat_types) {
  try {
    if (data.stats.length > 0) {
      await Promise.map(data.stats, async s => {
        let team = _.find(teams, t => t.top11_teamId === s.teamId)
        let stats = _.filter(s.top_stats, s => {
          return s.name !== 'pass_success'
        })
        stats = stats.concat(s.discipline)
        await Promise.all(_.map(stats, async stat => {
          let stat_type = _.find(stat_types, st => st.name === stat.name)
          if (!stat_type) {
            stat_type = await models.MatchStatType.findOrCreate({
              where: {
                name: stat.name
              },
              defaults: {
                code: stat.name,
                name: stat.name
              }
            })
            stat_types.push(stat_type[0])
            stat_type = stat_type[0]
          }
          await upsert(models.MatchStat, {
            stat_id: stat_type.id,
            match_id: match.id,
            team_id: team.id,
            value: stat.value
          }, {
            stat_id: stat_type.id,
            match_id: match.id,
            team_id: team.id
          })
        }))
      })
    }
    return null
  } catch (e) {
    console.log(e)
    return null
  }
}

async function updateMatch (models, match, teams, types, matches, data) {
  let updated_data = {}
  let top11_home_team = _.find(data.teams, t => t.teamLocationType.name === 'home') // lấy home team
  let top11_away_team = _.find(data.teams, t => t.teamLocationType.name === 'away') // lấy away team
  let home_team = _.find(teams, t => t.top11_teamId === top11_home_team.teamId)
  let away_team = _.find(teams, t => t.top11_teamId === top11_away_team.teamId)

  if (top11_home_team.isWinner) {
    updated_data.winner_id = home_team.id
  } else if (top11_away_team.isWinner) {
    updated_data.winner_id = away_team.id
  } else {
    updated_data.winner_id = null
  }
  updated_data.status = data.status
  updated_data.home_team_score = top11_home_team.score
  updated_data.away_team_score = top11_away_team.score

  await upsert(models.Match, updated_data, {
    top11_matchId: data.matchId
  })
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
