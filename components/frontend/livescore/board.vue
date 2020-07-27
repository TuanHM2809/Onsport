<template>
  <div class="result_plugin" v-loading="loading" style="background-color: #fff">
    <cate-title v-if="dataCenter && dataCenter.name" :title="activeName === 'first' ? 'Tất cả trận đấu' : dataCenter.name"></cate-title>
    <ul class="ui-tabs-nav">
      <li class="ui-state-default" :class="{'ui-tabs-active': activeName === 'first'}">
        <a @click.prevent="handleClick('first')" href="#" class="ui-tabs-anchor">Kết quả</a>
      </li>
      <li class="ui-state-default" :class="{'ui-tabs-active': activeName === 'second'}">
        <a @click.prevent="handleClick('second')" href="#" class="ui-tabs-anchor">
          BXH
        </a>
      </li>
    </ul>
    <div class="tabs-content">
      <div id="result" v-if="activeName === 'first'">
        <div class="fixtures narrow" v-if="listMatches && listMatches.length > 0">
          <div v-if="matchesByDay && matchesByDay.length > 0">
            <div v-for="day in matchesByDay" :key="day.start_at">
              <h3>{{ formatDay(day.start_at)}}</h3>
              <dl class="match-group" v-if="day.data && day.data.length > 0">
                <dt class="match clearfix postmatch" v-for="match in day.data" :key="match.id">
                  <span class="home-side team" v-if="match.home && match.home.name">{{ match.home.name }}</span>
                  <span class="match-score" v-if="match.status === `Pre-Game`">
                    <a title="Match page" class="newtab-link">
                      <span class="match-score-home">&nbsp;&nbsp;VS</span>
                    </a>
                  </span>
                  <span class="match-score" v-if="match.status === `Final`">
                    <nuxt-link :to="handleLink({item_type: 'match', id: match.id})" title="Match page" class="newtab-link">
                      <span class="match-score-home" v-if="match.home">{{ match.home.score || 0 }}</span>
                      <span class="match-score-divider"> - </span>
                      <span class="match-score-away" v-if="match.away">{{ match.away.score || 0 }}</span>
                    </nuxt-link>
                  </span>
                  <span class="away-side team" v-if="match.away && match.away.name"> {{ match.away.name }}</span>
                </dt>
                <dd class="clearfix hidden"></dd>
              </dl>
            </div>
          </div>
          <dl class="match-group" v-else>
            <dt class="match">
              <p class="text-center p-t-15"> Không có trận đấu</p>
            </dt>
          </dl>
        </div>
      </div>
      <div v-if="activeName === 'second'">
        <div style="margin: 10px auto;" class='p-l-10 p-r-10' v-if="tournaments && tournaments.length > 0">
          <el-select v-model="activeTournamentId" placeholder="Select" style="width:100%">
            <el-option v-for="(tournament) in tournaments" :key="tournament.id" :label="tournament.display_name ? tournament.display_name: tournament.name" :value="tournament.id">
            </el-option>
          </el-select>
        </div>
        <div id="board" class="tabs-content__globtable" v-if="standings && standings.length === 1">
          <!-- <h2 class="" v-if="dataCenter && dataCenter.name">
          <span class="standings-competition-name text-bold">{{ dataCenter.name}}</span>
        </h2> -->

          <div class="standings-container narrow">
            <table>
              <colgroup><col width="3%"><col width="87%"><col width="5%"><col width="5%"></colgroup>
              <thead>
                <tr>
                  <th class="pos">
                    <abbr title="Position">Pos</abbr>
                  </th>
                  <th class="team">Đội</th>
                  <th class="st_played">
                    <abbr title="Played">Trận</abbr>
                  </th>
                  <th class="st_points">
                    <abbr title="Points">Điểm</abbr>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class=" bottom-section" v-for="(team, index) in standings[0].teams" :key="team.team.id">
                  <td class="position">{{ index + 1 }}</td>
                  <td class="team">{{ team.team.name }}</td>
                  <td class="st_played">{{team.total_record.games_played}}</td>
                  <td class="st_points">{{team.total_record.points}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id="board-special" class="tabs-content__globtable" v-if="standings && standings.length > 1">
          <div class="standings-container narrow" v-for="standing in standings" :key="standing.id">
            <h2 class="m-b-0">
              <span class="standings-competition-name text-bold ">{{standing.division.name }}</span>
            </h2>
            <table class="m-t-0">
              <colgroup><col width="3%"><col width="77%"><col width="5%"><col width="5%"><col width="5%"><col width="5%"><col width="5%"></colgroup>
              <thead>
                <tr>
                  <th class="pos">
                    <abbr title="Position">Pos</abbr>
                  </th>
                  <th class="team">Đội</th>
                  <th class="st_played">
                    <abbr title="Played" v-if="isMobile">Trận</abbr>
                    <abbr title="Played" v-else>Tr</abbr>
                  </th>
                  <th class="st_played">
                    <abbr title="Thắng" v-if="isMobile">Thắng</abbr>
                    <abbr title="Thắng" v-else>T</abbr>
                  </th>
                  <th class="st_played">
                    <abbr title="Hòa" v-if="isMobile">Hòa</abbr>
                    <abbr title="Hòa" v-else>H</abbr>
                  </th>
                  <th class="st_played">
                    <abbr title="Thua" v-if="isMobile">Thua</abbr>
                    <abbr title="Thua" v-else>Th</abbr>
                  </th>
                  <th class="st_points">
                    <abbr title="Points">Điểm</abbr>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class=" bottom-section" v-for="(team, index) in standing.teams" :key="team.team.id">
                  <td class="position">{{ index + 1 }}</td>
                  <td class="team">{{ team.team.name }}</td>
                  <td class="st_played">{{team.total_record.games_played}}</td>
                  <td class="st_played">{{team.total_record.wins}}</td>
                  <td class="st_played">{{team.total_record.ties}}</td>
                  <td class="st_played">{{team.total_record.losses}}</td>
                  <td class="st_points">{{team.total_record.points}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import CateTitle from '~/components/frontend/common/cate-title.vue'
import moment from 'moment'
import _ from 'lodash'
export default {
  data () {
    return {
      activeName: 'first',
      dataCenter: null,
      listMatches: [],
      loading: true,
      activeTournamentId: -1
    }
  },
  props: {
    tournamentId: {
      default: 0 // id cua giai dau
    },
    allResult: {
      default: true // lay tat ca ket qua hoac lay ket qua theo giai dau
    }
  },
  methods: {
    handleClick (tab) {
      this.activeName = tab
    },
    async fetchData () {
      this.loading = true
      try {
        const data = await this.$axios.$get(`/tournaments/${this.activeTournamentId || 1}/standing`)
        if (data.code === 0) {
          this.dataCenter = data.data
        } else {
          this.$toast.error(data.message)
        }
      } catch (e) {
        this.$toast.error(e)
      }
      this.loading = false
    },
    async fetchMatches () {
      try {
        const data = await this.$axios.$get('/matches', {
          params: {
            page: 1,
            pageSize: 12,
            tournament_id: !this.allResult ? this.tournamentId : -1,
            end_date: moment().format('YYYY-MM-DD') // end_date = now
          }
        })
        if (data.code === 0) {
          this.listMatches = data.data
        } else {
          this.$toast.error(data.message)
        }
      } catch (e) {
        this.$toast.error(e)
      }
    },
    formatDay (day) {
      return moment(day).format('dddd, DD MMMM')
    }
  },
  computed: {
    standings () {
      return this.dataCenter.standings
    },
    isMobile () {
      return this.$store.state.size.isMobile
    },
    tournaments () {
      return this.$store.state.tournament.all.data
    },
    matchesByDay () {
      let result = []
      result = _.chain(this.listMatches).groupBy('start_at').toPairs().map(function (currentItem) {
        return _.zipObject(['start_at', 'data'], currentItem)
      }).value()
      return result
    }

  },
  mounted () {
    // console.log(this.tournaments[0])
    if (this.tournamentId && this.tournamentId !== 0) {
      this.activeTournamentId = this.tournamentId
    } else {
      if (this.tournaments && this.tournaments.length > 0) {
        this.activeTournamentId = this.tournaments[0].id
      }
    }

    // Promise.all([
    //   this.fetchData(),
    //   this.fetchMatches()
    // ])
  },
  watch: {
    activeTournamentId (after) {
      Promise.all([
        this.fetchData(),
        this.fetchMatches()
      ])
    }
  },
  components: {
    CateTitle
  },
  created () {

  }
}
</script>

<style scoped>
.result_plugin {
  border: 1px solid #ccc;
}
.result_plugin .ui-tabs-nav {
  background: #fff;
  font-size: 2rem;
  color: #bcbbc9;
  text-transform: uppercase;
  padding: 0;
  overflow-y: auto;
}
.result_plugin .ui-tabs-nav li:first-child {
  border-left: none;
}
.result_plugin .ui-tabs-nav .ui-tabs-active {
  color: #222;
  background: #fff;
  border-bottom: none;
  padding-bottom: 0;
}
.result_plugin .ui-tabs-nav li {
  width: 50%;
  margin: 0;
  border-left: 1px solid #c4c3ca;
  background: #e9e8f0;
  border-bottom: 1px solid #c4c3ca;
  float: left;
  position: relative;
  top: 0;
  white-space: nowrap;
  text-align: center;
}
.result_plugin .ui-tabs-nav .ui-tabs-active a:active,
.result_plugin .ui-tabs-nav .ui-tabs-active a:focus,
.result_plugin .ui-tabs-nav .ui-tabs-active a:hover,
.result_plugin .ui-tabs-nav .ui-tabs-active a:link,
.result_plugin .ui-tabs-nav .ui-tabs-active a:visited {
  outline: 0;
}
.result_plugin .ui-tabs .ui-tabs-nav .ui-tabs-anchor {
  float: none;
}
.result_plugin .ui-tabs-nav .ui-tabs-active a {
  color: #222;
}
.result_plugin .ui-tabs-nav li a {
  padding: 0.5em 0;
  display: block;
  color: #bcbbc9;
  text-decoration: none;
}
.result_plugin .ui-tabs .ui-tabs-panel {
  padding: 0;
  width: 100%;
}
.result_plugin .fixtures h3 {
  margin: 0;
  padding: 4px 10px 4px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  font-family: "OnSport", sans-serif;
  background: #4545a2;
  color: #eee;
  text-transform: uppercase;
}
.fixtures .match-group {
  margin: 0;
  width: 100%;
  line-height: 1.5;
}
.fixtures .match-group dt {
  border-top: 1px solid #ccc;
  color: #404040;
  float: none;
  font-size: 1.3rem;
  padding: 16px 0;
  position: relative;
  text-align: left;
  width: 100%;
}
.result_plugin .fixtures .match-group dt .home-side {
  padding-left: 0;
  margin-right: 8px;
  margin-top: 2px;
  width: 40%;
  text-align: right;
}
.result_plugin .fixtures .match-group dt .away-side {
  padding-right: 0;
  margin-left: 8px;
  margin-top: 2px;
  width: 40%;
  text-align: left;
}
.fixtures .match-group dt .match-score {
  color: #7e7892;
  text-align: center;
  width: 14%;
  font-size: 2rem;
  font-family: "OnSport", sans-serif;
  margin: -5px 0 0;
}
.fixtures .match-group dt span {
  float: left;
}
.fixtures .match-group dt .match-score a.newtab-link {
  color: #7e7892;
}
.fixtures .match-group dt .match-score span.match-score-home {
  padding: 0;
  text-align: center;
  width: 42%;
}
.result_plugin .fixtures .match-group dt .match-score span.match-score-divider {
  margin-top: 0px;
}
.fixtures .match-group dt .match-score span.match-score-divider {
  text-align: center;
  width: 16%;
}
.fixtures .match-group dt .match-score span.match-score-away {
  padding: 0;
  text-align: center;
  width: 41.99%;
}

/* table */
.tabs-content {
  min-height: 100px;
}

.tabs-content__globtable table:first-child {
  margin: 0 0 25px;
}
.tabs-content__globtable table {
  width: 100%;
  margin: 25px 0;
  table-layout: auto;
  border: none;
}
.tabs-content__globtable table tbody td,
.tabs-content__globtable table thead th {
  border: none;
  border-bottom: 1px solid #c4c3ca;
  padding: 9px 1%;
  text-align: center;
}
.tabs-content__globtable table thead th {
  font-size: 1.4rem;
  color: #7e7892;
  text-transform: uppercase;
  font-weight: 400;
  padding-top: 35px;
}
.tabs-content__globtable .pos,
.tabs-content__globtable colgroup col:nth-child(3),
.tabs-content__globtable colgroup col:nth-child(4) {
  width: 11%;
}
.tabs-content__globtable table thead:nth-child(2) th {
  padding-top: 15px;
}
.tabs-content__globtable table thead th abbr {
  border: none;
}
.tabs-content__globtable .team {
  width: 65%;
  text-align: left;
}
.tabs-content__globtable .st_played,
.tabs-content__globtable .st_points {
  width: 11%;
}
.tabs-content__globtable table tbody td {
  border-bottom: 1px solid #e1e1e4;
}
.tabs-content__globtable table tbody .position,
.tabs-content__globtable table tbody .team {
  font-size: 1.3rem;
  color: #333;
  padding: 13px 1% 9px;
}
.tabs-content__globtable table tbody .position,
.tabs-content__globtable table tbody .team {
  font-size: 1.3rem;
  color: #333;
  padding: 13px 1% 9px;
}
.tabs-content__globtable .team {
  width: 65%;
  text-align: left;
}
.tabs-content__globtable table tbody .st_played {
  font-weight: 300;
  font-size: 1.8rem;
  color: #222;
}
.tabs-content__globtable table tbody .st_points {
  font-size: 1.8rem;
  color: #4545a2;
}
</style>
