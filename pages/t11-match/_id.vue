<template>
  <div class="module p-t-30" style="background: #f0f0f0">
    <div class="container">
      <div class="row">
        <div class="col-sm-12 m-b-20">
          <div id="opta-widget-idx-0" class="opta-widget-container opta-timeline" style="display: block;">
            <div class="timeline">
              <div class="p-t-10 match-score-details clearfix">
                <img width="69" height="69" v-if="matchDetail.home" :src="buildSrc(matchDetail.home.thumbnail) || '/logo-team.png'" :alt="matchDetail.home.name" class="hometeam-crest">
                <div class="score-line">
                  <span class="home-team team ">
                    <a href="#" v-if="!isMobile">{{matchDetail.home.name}}</a>
                    <a href="#" v-else>{{matchDetail.home.abbreviation}}</a>
                  </span>
                  <span class="score-center" v-if="matchDetail.status === 'Final' || matchDetail.status ==='In-Progress'"> {{ matchDetail.home.score}} - {{ matchDetail.away.score}}</span>
                  <span class="away-team team ">
                    <a href="#" v-if="!isMobile">{{matchDetail.away.name}}</a>
                    <a href="#" v-else>{{matchDetail.away.abbreviation}}</a>
                  </span>
                </div>
                <div class="goal-scorers-home ">
                  <ul v-if="homeGoals && homeGoals.length > 0">
                    <li v-for="(goal, index) in homeGoals" :key="index">
                      <span class="score-goal"></span>
                      <span class="player">
                        <a href="#">{{goal.action_owner}} {{ isOwnGoal(goal) }}</a>
                        <span class=" p-l-5 timing">{{ formatMinutes(goal.time, goal.additional_time) }}</span>
                      </span>
                    </li>
                  </ul>
                </div>
                <div class="goal-scorers-away ">
                  <ul v-if="awayGoals && awayGoals.length > 0">
                    <li v-for="(goal, index) in awayGoals" :key="index">
                      <span class="score-goal"></span>
                      <span class="player">
                        <a href="#">{{goal.action_owner}} {{ isOwnGoal(goal) }}</a>
                        <span class=" p-l-5 timing">{{ formatMinutes(goal.time, goal.additional_time) }}</span>
                      </span>
                    </li>
                  </ul>
                </div>
                <img width="69" height="69" v-if="matchDetail.away " :src="buildSrc(matchDetail.away.thumbnail) || '/logo-team.png'" :alt="matchDetail.away.name" class="awayteam-crest">
              </div>
              <div class="clearfix"></div>
              <div class="match-details hidden-xs" v-if="matchDetail">
                <dl>
                  <dt class="competition">Competition</dt>
                  <dd>
                    <nuxt-link :to="handleLink({item_type: 'livescore',id :matchDetail.tournament.id})">
                      <span style="color: #fff;">{{matchDetail.tournament.name || ' '}}</span>
                    </nuxt-link>
                  </dd>
                  <dt v-if="matchDetail.referee">
                    <abbr title="Referee"> Trọng tài</abbr>
                  </dt>
                  <dd>{{ matchDetail.referee }}</dd>
                  <!-- <dt>Attendance</dt>
                  <dd>42,679</dd> -->
                  <dt>
                    <abbr title="Venue">SVĐ</abbr>
                  </dt>
                  <dd>{{matchDetail.venue || ' '}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-8">
          <div class="tabs-widget-content">
            <div class="matchstats-teamstats-container p-t-10">
              <div class="matchup hidden-xs">
                <img width="44" v-if="matchDetail.home " :src="buildSrc(matchDetail.home.thumbnail) || '/logo-team.png'" :alt="matchDetail.home.name">
                <span>
                  <span v-if="!isMobile">{{matchDetail.home.name}}</span>
                  <span href="#" v-else>{{matchDetail.home.abbreviation}}</span>v.
                  <span v-if="!isMobile">{{matchDetail.away.name}}</span>
                  <span href="#" v-else>{{matchDetail.away.abbreviation}}</span>
                </span>
                <img width="44" v-if="matchDetail.away " :src="buildSrc(matchDetail.away.thumbnail) || '/logo-team.png'" :alt="matchDetail.away.name">
              </div>
              <!-- timeline -->
              <div class="game-timeline m-t-20 m-b-20">
                <a href="#" class="team home" v-if="matchDetail.home">
                  <img class="m-r-10" width="24" v-if="matchDetail.home " :src="buildSrc(matchDetail.home.thumbnail) || '/logo-team.png'" :alt="matchDetail.home.name">
                  <span v-if="!isMobile" class="team-name">{{matchDetail.home.name}}</span>
                  <span v-else class="team-name-short">{{matchDetail.home.abbreviation}}</span>
                </a>
                <div class="game-progress m-t-10 m-b-10 p-l-20 p-r-20">
                  <ul class="home-progress-event" v-if="homeGoals && homeGoals.length > 0">
                    <li v-for="(event, index) in homeGoals" :key="index" :title="formatMinutes(event.time, event.additional_time)" :style="stylingGoalsProgress(event)">
                      <el-tooltip class="item" effect="dark" :content="`${event.action_owner} ${formatMinutes(event.time, event.additional_time)} ${isOwnGoal(event)}`" placement="top">
                        <span class="goal-progress"></span>
                      </el-tooltip>
                    </li>

                  </ul>
                  <div class="progress m-b-0">
                    <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" :style="`width:${matchDetail.status === 'Final'? '100%': '0%'}`">
                      <span class="sr-only">100% Complete</span>
                    </div>
                  </div>
                  <ul class="away-progress-event" v-if="awayGoals && awayGoals.length > 0">
                    <li v-for="(event, index) in awayGoals" :key="index" :style="stylingGoalsProgress(event)" :title="formatMinutes(event.time, event.additional_time)">
                      <el-tooltip class="item" effect="dark" :content="`${event.action_owner} ${formatMinutes(event.time, event.additional_time)} ${isOwnGoal(event)}` " placement="bottom">
                        <span class="goal-progress"></span>
                      </el-tooltip>
                    </li>
                  </ul>
                </div>
                <a href="#" class="team away pull-right" v-if="matchDetail.away">
                  <img class="m-r-10" width="24" v-if="matchDetail.away " :src="buildSrc(matchDetail.away.thumbnail) || '/logo-team.png'" :alt="matchDetail.away.name">
                  <span v-if="!isMobile" class="team-name">{{matchDetail.away.name}}</span>
                  <span v-else class="team-name-short">{{ matchDetail.away.abbreviation}}</span>
                </a>
              </div>
              <div class="clearfix"></div>
              <!-- end timeline-->

              <div id="match-teamstats" v-if="stats">
                <ul class="match-teamstats-list">
                  <li class="match-teamstats-item" v-for="(stat, index) in listStat" :key="index">
                    <p class="text-center">
                      {{ toTitleCase(stat)}}
                    </p>
                    <div class="stats">
                      <span class="stat-home" v-if="stats.home[index]">{{ stats.home[index].value }}</span>
                      <div class="progress" v-if="stats.home[index] && stats.away[index]">
                        <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" :style="{width: `${percentStat(stats.home[index], stats.away[index])}%`}">
                          <span class="sr-only">100% Complete</span>
                        </div>
                      </div>
                      <span class="stat-away" v-if="stats.away[index]">{{ stats.away[index].value }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="!isMobile" v-loading="loading" style="background: #fff;">
            <h2 class="fixtures-title p-l-15">Lịch thi đấu</h2>
            <list-match :data="allMatches"></list-match>
          </div>
        </div>
        <div class="col-sm-4 m-b-20">
          <div class="opta-widget-container opta-commentary" v-if="events">
            <h2>
              <span>Diễn biến</span>
            </h2>
            <div class="commentary">
              <ul>
                <li v-for="(event, index) in reverseEvents" :key="index">
                  <span class="comment-time">{{formatMinutes(event.time, event.additional_time)}}</span>
                  <span class="comment-type" :class="`${event.type.name}`">{{ event.type.name }}</span>
                  <span>{{transType(event)}}&nbsp;</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-xs-12">
          <div v-if="isMobile" v-loading="loading" style="background: #fff;">
            <h2 class="fixtures-title p-l-15">Lịch thi đấu</h2>
            <list-match :data="allMatches"></list-match>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import ListMatch from '~/components/frontend/livescore/list-match.vue'
import filter from '~/mixins/filter.js'
import _ from 'lodash'
import moment from 'moment'
export default {
  data () {
    return {
      allMatches: [],
      loading: false
      // showFilter: false,
      // eventsReverse: []
    }
  },
  mixins: [filter],
  async asyncData ({app, params, error}) {
    try {
      const response = await app.$axios.$get(`/t11Matches/${params.id}`)
      if (response.code === 0) {
        const data = response.data

        const events = data.match_events

        const stats = data.stats

        const matchDetail = _.omit(data, ['match_events', 'stats'])

        return {
          matchDetail: matchDetail, stats: stats, events: events }
      } else {
        error({ statusCode: 404, message: 'Trận đấu không tồn tại' })
      }
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    reverseEvents () {
      if (this.events) {
        return this.events.slice().reverse()
      }
      return []
    },
    listStat () {
      return _.map(this.stats.home, (obj) => (obj.type.name))
    },
    homeGoals () {
      const {home, away} = this.matchDetail
      const homeEvents = _.filter(this.events, event => {
        return (event.action_owner_team.id === home.id && event.is_own_goal === false) || (event.action_owner_team.id === away.id && event.is_own_goal)
      })
      // return home
      return _.filter(homeEvents, event => {
        return event.type.name === 'goals'
      })
    },
    awayGoals () {
      const {home, away} = this.matchDetail
      const awayEvents = _.filter(this.events, event => {
        return (event.action_owner_team.id === away.id && event.is_own_goal === false) || (event.action_owner_team.id === home.id && event.is_own_goal)
      })
      // return away
      return _.filter(awayEvents, event => {
        return event.type.name === 'goals'
      })
    },
    isMobile () {
      return this.$store.state.size.isMobile
    }
  },
  methods: {
    percentStat (home, away) {
      if (home) { if (parseInt(home.value) === parseInt(away.value)) return 50 }
      return parseInt(home.value) / (parseInt(home.value) + parseInt(away.value)) * 100
    },
    toTitleCase (str) {
      switch (str) {
        case 'ball_possesion':
          return 'Tỷ lệ kiếm soát bóng (%)'
        case 'corners':
          return 'Phạt góc'
        case 'fouls':
          return 'Phạm lỗi'
        case 'offsides':
          return 'Việt vị'
        case 'passes':
          return 'Tổng số đường truyền'
        case 'red_cards':
          return 'Thẻ đỏ'
        case 'total_shots':
          return 'Sút khung thành'
        case 'yellow_cards':
          return 'Thẻ vàng'
      }
    },
    formatMinutes (minute, addTime) {
      let minutes = minute ? minute.slice(0, 2) : '00'
      switch (minutes) {
        case '45':
        case '90':
          return `${minutes}'${parseInt(addTime) > 0 ? '+' + addTime + "'" : ''}`
        default:
          return `${minutes}'`
      }
    },
    async fetchAllMatches () {
      this.loading = true
      try {
        const response = await this.$axios.get(`matches`, {
          params: {
            page: 1,
            pageSize: 200,
            end_date: moment().add(1, 'months').format('YYYY-MM-DD'),
            start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
            tournament_id: this.matchDetail.tournament.id
          }
        })
        const success = !!response.status && response.data && Object.is(response.data.code, 0)

        if (success) {
          this.allMatches = response.data.data
        } else {
          this.$toast.error('Không thể lấy được danh sách trận đấu')
        }
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    stylingGoalsProgress (event) {
      const {time, additional_time} = event
      const minutes = time ? time.slice(0, 2) : '00'
      const totalTime = parseInt(minutes) + parseInt(additional_time || 0)
      return {
        left: `${totalTime / 90 * 100}%`
      }
    },
    transType (event) {
      // special event
      if (event.type.name === 'goals' && event.is_own_goal === true) {
        return `PHẢN LƯỚI!!! ${event.action_owner} (${event.action_owner_team.name}) phản lưới nhà.`
      }

      // regular event

      switch (event.type.name) {
        case 'goals':
          return `VÀO!!! ${event.action_owner} (${event.action_owner_team.name}) ghi bàn.`
        case 'shots':
          return `Sút! ${event.action_owner} (${event.action_owner_team.name}) dứt điểm.`
        case 'yellowCards':
          return `Thẻ vàng!!! ${event.action_owner} (${event.action_owner_team.name}) nhận thẻ vàng.`
        case 'redCards':
          return `Thẻ đỏ!!! ${event.action_owner} (${event.action_owner_team.name}) nhận thẻ đỏ.`
        case 'substitutions':
          return `Thay người!! ${event.action_owner} vào sân thay cho ${event.target}`
      }
    },
    testHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    },
    buildSrc (src) {
      if (src) {
        return this.testHttpLink(src) ? `${src}` : `${process.env.controlUrl}/${src}`
      } else {
        return false
      }
    },
    isOwnGoal (event) {
      return event.is_own_goal ? '(OG)' : ''
    },
    async loadEvents () {
      try {
        const response = await this.$axios.get(`matches/${this.matchDetail.id}/events`)
        const success = !!response.status && response.data && Object.is(response.data.code, 0)
        if (success) {
          this.events = response.data.data
        }
      } catch (e) {
        console.log(e)
      }
    },
    async loadStats () {
      try {
        const response = await this.$axios.get(`matches/${this.matchDetail.id}/stats`)
        const success = !!response.status && response.data && Object.is(response.data.code, 0)
        if (success) {
          this.stats = response.data.data
        }
      } catch (e) {
        console.log(e)
      }
    }

  },
  components: {
    ListMatch
  },
  mounted () {
    this.fetchAllMatches()
    // this.eventsReverse = Object.assign
  }
}
</script>
<style scoped>
.row {
  margin-left: -15px;
  margin-right: -15px;
}

.show-more {
  display: block;
  width: 100%;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  font-family: "OnSport", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: inherit;
  background: none;
  border: 1px solid #dcdcdc;
  color: #333;
  user-select: none;
  text-align: center;
  cursor: pointer;
  -webkit-appearance: none;
  line-height: 1.4em;
  -webkit-font-smoothing: antialiased;
}
.show-more:hover {
  background-color: #f4f4f4;
}
@media (max-width: 640px) {
}
</style>

<style scoped>
.opta-timeline {
  background-color: #fff;
}
.timeline {
  position: relative;
}
.timeline .match-score-details .score-line {
  margin: 0 auto 10px;
  text-align: center;
  width: 100%;
}
.timeline .match-score-details .score-line span {
  color: #333;
  display: inline-block;
  font-size: 2.6rem;
  width: 20%;
}

.timeline .match-score-details .score-line .home-team {
  text-align: right;
}
.timeline .match-score-details .goal-scorers-home {
  clear: none;
  float: left;
  color: #222;
  font-size: 1.4rem;
  font-weight: 600;
  text-align: right;
  vertical-align: top;
  width: 44%;
  margin: 0 0 20px;
}
.timeline .match-score-details .goal-scorers-away {
  clear: none;
  float: right;
  color: #222;
  font-size: 1.4rem;
  font-weight: 600;
  width: 44%;
  margin: 0 0 20px;
}
.timeline .match-score-details .goal-scorers-home ul,
.timeline .match-score-details .goal-scorers-away ul {
  margin: 0;
}
.timeline .match-score-details .goal-scorers-away li,
.timeline .match-score-details .goal-scorers-home li {
  border: none;
  display: list-item;
}
.timeline .match-score-details .score-line span {
  color: #333;
  display: inline-block;
  font-size: 2.6rem;
  width: 32%;
}
.timeline .match-score-details .score-line .score-center {
  text-align: center;
  width: 11%;
  color: #553160;
  font-size: 3.6rem;
  font-family: OnSport, sans-serif;
  font-weight: 400;
}
.timeline .match-score-details .score-line .away-team {
  text-align: left;
}
.timeline .match-score-details .awayteam-crest {
  right: 6%;
}
.timeline .match-score-details .hometeam-crest {
  left: 5%;
}
.timeline .match-score-details .awayteam-crest,
.timeline .match-score-details .hometeam-crest {
  position: absolute;
  top: 10px;
}

.timeline .match-details {
  border-top: 1px solid #c4c3ca;
  background: #d1d0de;
  height: 40px;
  left: 0;
  padding: 7px 0;
  overflow: hidden;
  width: 100%;
}
.timeline .match-details dd,
.timeline .match-details dt {
  font-size: 1.6rem;
  font-weight: 400;
  font-family: OnSport, sans-serif;
  text-transform: uppercase;
}
.timeline .match-details dd,
.timeline .match-details dt {
  clear: none;
  color: #222;
  float: left;
  width: auto;
}
.timeline .match-details dt {
  border: 0;
  color: #7e7892;
  display: block;
  padding: 0;
}
.timeline .match-details dt.competition {
  overflow: hidden;
  text-indent: -999em;
  width: 0;
  direction: ltr;
}
.timeline .match-details dl dd:nth-child(2) {
  color: #fff;
  background: #7e7892;
  position: relative;
  margin: -12px 50px -13px 0;
  padding: 12px 12px 13px 29px;
}
.timeline .match-details dl dd:nth-child(2):after {
  left: 100%;
  top: 50%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
  border-color: rgba(0, 138, 185, 0);
  border-left-color: #7e7892;
  border-width: 25px;
  margin-top: -25px;
}
.timeline .match-details dt abbr {
  border: none;
}
.timeline .match-details dt:after {
  content: ":";
  margin-right: 5px;
}
.opta-commentary {
  background: 0 0;
  margin: 0 0 21px;
  padding: 17px 0px 18px 0px;
}
.opta-commentary h2,
h2.fixtures-title {
  font-size: 2rem;
  color: #222;
  text-transform: uppercase;
  font-family: OnSport, sans-serif;
  font-weight: 400;
  margin: 0 0 5px;
}
.commentary li {
  border-bottom: 1px solid #d4d3df;
  clear: both;
  font-size: 1.2rem;
  padding: 10px 5px 10px 0;
  font-weight: 600;
  position: relative;
}
.commentary li:first-child {
  color: #008ab9;
  text-transform: uppercase;
  font-size: 1.6rem;
}
.commentary .comment-time {
  float: left;
  margin-left: 0;
  width: 40px;
  font-size: 1.3rem;
  color: #553160;
}

.commentary .comment-time,
.commentary li:first-child {
  font-family: OnSport, sans-serif;
  font-weight: 400;
}
.commentary li span {
  display: block;
  margin-left: 60px;
}
.commentary .comment-type {
  text-indent: -999em;
  direction: ltr;
  background: 25% 50% no-repeat none;
  float: left;
  height: 15px;
  margin-left: 0;
  margin-top: 2px;
  width: 20px;
}
.tabs-widget-content {
  clear: both;
  background: #fff;
  padding: 0px 10px 10px;
}
.matchstats-teamstats-container {
  background: 0 0;
  margin-bottom: 10px;
  position: relative;
}
.matchup {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #553160;
  font-size: 3.6rem;
}
.matchstats-teamstats-container .matchup > span > span {
  color: #333;
  font-size: 16px;
  padding: 0 20px;
  vertical-align: middle;
  font-family: "OnSport", sans-serif;
}
.match-teamstats-item {
  padding-bottom: 10px;
}
.match-teamstats-item p {
  margin-bottom: 5px;
  font-size: 1.6rem;
  line-height: 25px;
  text-align: center;
  width: 100%;
  color: #333;
  font-family: "OnSport", sans-serif;
}
.match-teamstats-item > .stats {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
.stats .stat-home,
.stats .stat-away {
  flex-basis: 10%;
  text-align: center;
  color: #553160;
  font-family: OnSport, sans-serif;
  font-weight: 400;
  font-size: 18px;
}
.match-teamstats-item > .stats .progress {
  flex-basis: 80%;
  margin-bottom: 0;
  height: 10px;
  border-radius: 0;
  background-image: linear-gradient(180deg, #f5f5f5 0, #f5f5f5);
}
.stats .progress-bar {
  background-image: linear-gradient(180deg, #4545a2 0, #4545a2);
}
.commentary .yellowCards {
  background: url("/events-sprite.png") -5px -64px no-repeat;
}
.commentary .substitutions {
  background: url("/events-sprite.png") -5px -383px no-repeat;
}
.commentary .endFirstPeriod,
.commentary .endSecondPeriod,
.commentary .startMatch,
.commentary .endMatch {
  background: url("/events-sprite.png") -5px -398px no-repeat;
}
.commentary .goals,
.goal-progress {
  background: url("/events-sprite.png") -5px -173px no-repeat;
}

.commentary .redCards {
  background: url("/events-sprite.png") -5px -44px no-repeat;
}
.commentary .ownGoals {
  background: url("/events-sprite.png") -5px -103px no-repeat;
}
.commentary .doubleYellows {
  background: url("/events-sprite.png") -5px 0 no-repeat;
}
.commentary .penalty-in-game-miss,
.commentary .penalty-shootout-miss {
  background: url("/events-sprite.png") -5px -398px no-repeat;
}

ul.home-progress-event,
ul.away-progress-event {
  position: relative;
  width: 100%;
  height: 20px;
  padding: 0;
  margin: 0;
}
ul.home-progress-event li,
ul.away-progress-event li {
  border: 0;
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
}
ul.away-progress-event li {
  top: auto;
  bottom: -2px;
}
ul.away-progress-event li span,
ul.home-progress-event li span {
  width: 12px;
  height: 12px;
  display: block;
}

.game-progress .progress,
.game-progress .progress-bar {
  height: 12px;
}
@media (min-width: 960px) {
  .opta-timeline {
    padding: 27px 0 0;
  }
  .timeline {
    position: relative;
  }
  .timeline .match-score-details {
    min-height: 50px;
    padding-top: 0;
  }
  .timeline .match-score-details .score-line {
    margin: 0 auto 15px;
  }
  .timeline .match-score-details .score-line span {
    font-size: 2.2rem;
    width: 27%;
  }
  .timeline .match-score-details .awayteam-crest,
  .timeline .match-score-details .hometeam-crest {
    top: 0;
  }

  .timeline .match-score-details .awayteam-crest {
    right: 15%;
  }
  .timeline .match-score-details .hometeam-crest {
    left: 14%;
  }
  .timeline .match-details dd,
  .timeline .match-details dt {
    font-size: 1.4rem;
  }
  .timeline .match-details dl dd:nth-child(2) {
    padding: 15px 5px 13px 15px;
    margin: -12px 40px -13px 0;
  }
  .timeline .match-details dl dd:not(:nth-child(2)),
  .timeline .match-details dl dt:not(:first-child) {
    line-height: 26px;
    padding-right: 5px;
  }
  .opta-commentary {
    padding: 17px 0 18px 2px;
  }
  .commentary li:first-child {
    font-size: 2rem;
    line-height: 25px;
    padding: 10px 5px 0px 0;
  }
}
@media only screen and (max-width: 767px) {
  .timeline .match-score-details .score-line .score-center {
    width: 25%;
    margin: 0;
  }
  .timeline .match-score-details .score-line span {
    font-size: 14px;
    width: 37%;
    margin: 43px 0 0;
  }
  .timeline .match-score-details .awayteam-crest,
  .timeline .match-score-details .hometeam-crest {
    width: 56px;
    height: 56px;
  }
  ,
  .timeline .match-score-details .goal-scorers-away,
  .timeline .match-score-details .goal-scorers-home {
    width: 38%;
  }
}
</style>

