const baseUrl = 'http://api.top11.vn/api/stats'
let models = require('../server/models/index1')
let axios = require('axios')
let Promise = require('bluebird')
let _ = require('lodash')
var Constant = require('../server/constants')

let apiEndpoint = {
  getLeagues: '/leagues',
  getTeams: '/leagues/'
}

Promise.all([
  models.Standing.destroy({ truncate: true }),
  models.DetailRecord.destroy({ truncate: true })
])
models.Sport.findOrCreate({
  where: {
    name: 'Bóng đá'
  },
  defaults: {
    name: 'Bóng đá',
    description: 'Bóng đá'
  }
}).then(async sport => {
  try {
    // Create tag that associate with sport
    let sport_tag = await models.Tag.findOrCreate({
      where: {
        name: sport[0].name
      },
      defaults: {
        name: sport[0].name
      }
    })
    await models.TagItem.findOrCreate({
      where: {
        tag_id: sport_tag[0].id,
        taggable_type: Constant.SPORT_TYPE,
        taggable_id: sport[0].id
      },
      defaults: {
        tag_id: sport_tag[0].id,
        taggable_type: Constant.SPORT_TYPE,
        taggable_id: sport[0].id
      }
    })

    let { data } = await axios.get(baseUrl + apiEndpoint.getLeagues)
    // crawling League
    await Promise.all(_.map(data, async league => {
      // Tạo object data
      let top11_league = {
        name: league.name,
        top11_leagueId: league.leagueId,
        abbreviation: league.abbreviation,
        league_type: league.type,
        sport_id: sport[0].id
      }
      // Insert vào db
      let tournament = await models.Tournament.findOrCreate({
        where: {
          top11_leagueId: league.leagueId
        },
        defaults: top11_league
      })
      // Create tag that associate with tournament
      let tournament_tag = await models.Tag.findOrCreate({
        where: {
          name: tournament[0].name
        },
        defaults: {
          name: tournament[0].name
        }
      })
      await models.TagItem.findOrCreate({
        where: {
          tag_id: tournament_tag[0].id,
          taggable_type: Constant.TOURNAMENT_TYPE,
          taggable_id: tournament[0].id
        },
        defaults: {
          tag_id: tournament_tag[0].id,
          taggable_type: Constant.TOURNAMENT_TYPE,
          taggable_id: tournament[0].id
        }
      })

      // Lấy dữ liệu về standing
      // if (tournament[0].top11_leagueId !== 68) {
      let standing_data = await axios.get(`${baseUrl}${apiEndpoint.getLeagues}/${tournament[0].top11_leagueId}/standing`)
      // if(list_teams.tournament.)
      await insertStanding(models, standing_data.data, tournament[0].get({ plain: true }))
      // }
      // Lấy dữ liệu về rankings
      // Bắt đầu crawl rankings
    }))
    //crawling
  } catch (e) {
    console.log(e)
  }
}).then(() => {
  // await Promise.all([
  //   models.Sport.destroy({where: {}, truncate: true}),
  //   models.Tournament.destroy({where: {}, truncate: true})
  // ])
  process.exit(0)
}).catch(async e => {
  console.log(e)
  await Promise.all([
    models.Sport.destroy({ where: {}, truncate: true }),
    models.Tournament.destroy({ where: {}, truncate: true })
  ])
  process.exit(0)
})

// async function insertTeam (models, data, tournament) {
//   try {
//     let season = await models.Season.findOrCreate({
//       where: {
//         season: 2017 // fix cứng mùa giải hiện tại
//       },
//       defaults: {
//         season: 2017
//       }
//     })
//     let t = {
//       tournament: tournament.get({ plain: true }),
//       teams: [],
//       season: season && season[0] ? season[0].get({ plain: true }) : null
//     }
//     await Promise.map(data, async top11_team => {
//       var division_id = null
//       var division = null
//       // Nếu có division
//       if (top11_team.divisionId) {
//         division = await models.Division.findOrCreate({
//           where: {
//             top11_divisionId: top11_team.divisionId
//           },
//           defaults: {
//             top11_divisionId: top11_team.divisionId,
//             name: top11_team.divisionName,
//             abbreviation: top11_team.divisionAbbreviation
//           }
//         })
//         division_id = division[0].id
//       }
//
//       var team = await models.Team.findOrCreate({
//         where: {
//           top11_teamId: top11_team.teamId
//         },
//         defaults: {
//           top11_teamId: top11_team.teamId,
//           name: top11_team.displayName,
//           description: top11_team.displayName,
//           abbreviation: top11_team.abbreviation
//         }
//       })
//       var tournament_team_data = {
//         season_id: season[0].id,
//         team_id: team[0].id,
//         division_id: division_id,
//         tournament_id: tournament.id
//       }
//       await models.TournamentTeam.findOrCreate({
//         where: {
//           season_id: season[0].id,
//           team_id: team[0].id,
//           division_id: division_id,
//           tournament_id: tournament.id
//         },
//         defaults: tournament_team_data
//       })
//       var push_data = team[0].get({ plain: true })
//       push_data.division = division && division[0] ? division[0].get({ plain: true }) : null
//       t.teams.push(push_data)
//     }, {
//       concurrency: 1000
//     })
//     return t
//   } catch (e) {
//     console.log(e)
//     return null
//   }
// }
//
// async function insertStanding (models, data, list_teams) {
//   try {
//     if (data && !_.isEmpty(data)) {
//       var stand_data = {
//         tournament_id: list_teams.tournament.id,
//         season_id: list_teams.season.id
//       }
//       // NHA, BUND, LIGA
//       var top11_standing_data
//       if (list_teams.tournament.league_type === 1) {
//         top11_standing_data = _.find(data.eventType, e => e.eventTypeId === 1).conferences[0].divisions
//       } else {
//         top11_standing_data = _.find(data.eventType, e => e.eventTypeId === 8).conferences[0].divisions
//       }
//
//       await Promise.map(top11_standing_data, async division => {
//         // Nếu có divsionId
//         if (division.divisionId) {
//           await Promise.map(division.teams, async team => {
//             // console.log(team.teamId, t.top11_teamId)
//             let found_team = _.find(list_teams.teams, t => { return t.top11_teamId === team.teamId })
//             if (typeof found_team === 'undefined') {
//               var new_team = await models.Team.findOrCreate({
//                 where: {
//                   top11_teamId: team.teamId
//                 },
//                 defaults: {
//                   top11_teamId: team.teamId,
//                   name: team.displayName,
//                   description: team.displayName,
//                   abbreviation: team.abbreviation
//                 }
//               })
//
//               var tournament_team_data = {
//                 season_id: list_teams.season.id,
//                 team_id: new_team[0].id,
//                 division_id: division.divisionId,
//                 tournament_id: list_teams.tournament.id
//               }
//               await models.TournamentTeam.findOrCreate({
//                 where: {
//                   season_id: list_teams.season.id,
//                   team_id: new_team[0].id,
//                   division_id: division.divisionId,
//                   tournament_id: list_teams.tournament.id
//                 },
//                 defaults: tournament_team_data
//               })
//               found_team = new_team[0].get({ plain: true })
//               found_team.division = await models.Division.findOne({
//                 where: {
//                   top11_divisionId: division.divisionId
//                 }
//               })
//             }
//             console.log(found_team)
//           })
//         } else {
//         }
//       })
//     }
//     return null
//   } catch (e) {
//     console.log(e)
//     return null
//   }
// }

async function insertStanding (models, data, tournament) {
  try {
    if (!_.isEmpty(data)) {
      let [season, is_season_created] = await models.Season.findOrCreate({
        where: {
          season: data.season
        },
        defaults: {
          season: data.season
        }
      })

      // NHA, BUND, LIGA
      var top11_standing_data
      if (tournament.league_type === 1) {
        top11_standing_data = _.find(data.eventType, e => e.eventTypeId === 1).conferences[0].divisions
      } else {
        //C1, C2
        // console.log(data.eventType)
        if (_.find(data.eventType, e => e.eventTypeId === 8)) {
          top11_standing_data = _.find(data.eventType, e => e.eventTypeId === 8).conferences[0].divisions
        } else if (_.find(data.eventType, e => e.eventTypeId === 1)) {
          top11_standing_data = _.find(data.eventType, e => e.eventTypeId === 1).conferences[0].divisions
        }
      }
      await Promise.map(top11_standing_data, async top11_division => {
        //Nếu là giải c1,c2
        if (top11_division.divisionId) {
          // Tạo mới division
          let [division, is_division_created] = await models.Division.findOrCreate({
            where: {
              top11_divisionId: top11_division.divisionId
            },
            defaults: {
              top11_divisionId: top11_division.divisionId,
              name: top11_division.name,
              abbreviation: top11_division.abbreviation
            }
          })
          await Promise.map(top11_division.teams, async top11_team => {
            await insertTeam(models, top11_team, division.get({ plain: true }), season.get({ plain: true }), tournament)
          })
        } else {
          // Nếu là NHA, BUND, LIGA
          await Promise.map(top11_division.teams, async top11_team => {
            await insertTeam(models, top11_team, {}, season.get({ plain: true }), tournament)
          })
        }
      })
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

//insert team, what tournaments that team join, where's it stand
async function insertTeam (models, top11_team, division, season, tournament) {
  try {
    //insert team
    let [team, is_team_created] = await models.Team.findOrCreate({
      where: {
        top11_teamId: top11_team.teamId
      },
      defaults: {
        top11_teamId: top11_team.teamId,
        name: top11_team.displayName,
        abbreviation: top11_team.abbreviation
      }
    })

    let team_tag = await models.Tag.findOrCreate({
      where: {
        name: team.name
      },
      defaults: {
        name: team.name
      }
    })
    await models.TagItem.findOrCreate({
      where: {
        tag_id: team_tag[0].id,
        taggable_type: Constant.TEAM_TYPE,
        taggable_id: team.id
      },
      defaults: {
        tag_id: team_tag[0].id,
        taggable_type: Constant.TEAM_TYPE,
        taggable_id: team.id
      }
    })

    // insert what tournament that team join
    let [team_tournament, is_team_tournament_created] = await models.TournamentTeam.findOrCreate({
      where: {
        team_id: team.id,
        season_id: season.id,
        tournament_id: tournament.id,
        division_id: division.id ? division.id : null
      },
      defaults: {
        team_id: team.id,
        season_id: season.id,
        tournament_id: tournament.id,
        division_id: division.id ? division.id : null
      }
    })

    //insert where's it stand
    let stand_data = {
      team_id: team.id,
      season_id: season.id,
      tournament_id: tournament.id,
      division_id: division.id
      // rank: top11_team.division.rank
    }

    if (tournament.league_type == 1) {
      stand_data.rank = top11_team.league.rank
    } else {
      if (top11_team.division && top11_team.division.rank) {
        stand_data.rank = top11_team.division.rank
      }
      if (top11_team.league && top11_team.league.rank) {
        stand_data.rank = top11_team.league.rank
      }
    }

    //create stand
    let [team_stand, is_team_stand_created] = await models.Standing.findOrCreate({
      where: {
        team_id: team.id,
        season_id: season.id,
        tournament_id: tournament.id,
        division_id: division.id
      },
      defaults: stand_data
    })
    // Tạo dữ liệu cho detail records

    let home_data = _.find(top11_team.recordDetails, rd => { return rd.recordDetailId === 1 })
    // _.forEach(top11_team.recordDetails, rd => {
    //   if (rd.recordDetailId !== 1 && rd.recordDetailId !== 2) {
    //     console.log(rd)
    //   }
    // })

    let away_data = _.find(top11_team.recordDetails, rd => { return rd.recordDetailId === 2 })
    if (home_data == undefined || away_data == undefined) {
      // console.log(top11_team)
      // process.exit(0)
      return null
    }
    let total_detail = {
      standing_id: team_stand.id,
      type: 'total',
      wins: top11_team.record.wins,
      losses: top11_team.record.losses,
      ties: top11_team.record.ties,
      games_played: top11_team.record.gamesPlayed,
      goals_for: top11_team.goalsFor.overall,
      goals_against: top11_team.goalsAgainst.overall,
      points: top11_team.teamPoints
    }

    let home_detail = {
      standing_id: team_stand.id,
      type: 'home',
      wins: home_data && home_data.wins ? home_data.wins : 0,
      losses: home_data && home_data.losses ? home_data.losses : 0,
      ties: home_data && home_data.ties ? home_data.ties : 0,
      goals_for: home_data && home_data.goalsFor && home_data.goalsFor.overall ? home_data.goalsFor.overall : 0,
      goals_against: home_data && home_data.goalsAgainst && home_data.goalsAgainst.overall ? home_data.goalsAgainst.overall : 0,
      points: home_data && home_data.points ? home_data.points : 0
    }

    home_detail.games_played = getGamePlayed(home_detail.wins, home_detail.ties, home_detail.losses)

    let away_detail = {
      standing_id: team_stand.id,
      type: 'away',
      wins: away_data.wins ? away_data.wins : 0,
      losses: away_data.losses ? away_data.losses : 0,
      ties: away_data.ties ? away_data.ties : 0,
      goals_for: away_data.goalsFor.overall,
      goals_against: away_data.goalsAgainst.overall,
      points: away_data.points
    }

    away_detail.games_played = getGamePlayed(away_detail.wins, away_detail.ties, away_detail.losses)
    // attaching relation
    let [total, home, away] = await Promise.all([
      models.DetailRecord.create(total_detail),
      models.DetailRecord.create(home_detail),
      models.DetailRecord.create(away_detail)
    ])

    await team_stand.updateAttributes({
      total_detail: total.id,
      home_detail: home.id,
      away_detail: away.id
    })
  } catch (e) {
    console.log(e)
    return null
  }
}

function getGamePlayed (wins, ties, losses) {
  return wins + ties + losses
}
