<template>
  <div class="module">
    <div class="container">
      <div class="row">
        <div class="col-xs-12" v-if="tournament && tournament.name">
          <page-title :title="tournament.name"></page-title>
        </div>
        <div class="col-sm-8">
          <div class="page-filters">
            <div class="page-filters__header">
              <h3 class="page-filters__title">
                <span class="swap-text--bp30" title="Latest">
                  <span class="swap-text__target">{{ tournament.name }}</span>
                </span>
              </h3>
              <a class="page-filters__button" href="#" @click.prevent="showFilter = !showFilter" style="pointer-events: auto;">Tất cả</a>
            </div>
            <div class="page-filters__frame">
              <div class="page-filters__body" ref="filterBody" :class="{'page-filters__body--open' : showFilter}" :style="pageFitlerBodyStyle">
                <div class="page-filters__filter">
                  <h4 class="page-filters__filter-head">Tất cả</h4>
                  <ul class="page-filters__filter-body">
                    <li class="page-filters__filter-item" v-for="tour in tournaments" :key="tour.id">
                      <nuxt-link :to="handleLink({item_type: 'livescore',id:tour.id })" class="page-filters__filter-link" :class="{'page-filters__filter-link--active': tour.id === $route.params.id}">
                        {{ tour.name}}
                      </nuxt-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class=" page-filters__offset" :style="pageOffsetStyle">

            <el-tabs v-model="activeTab" @tab-click="handleClick">
              <el-tab-pane label="Bảng xếp hạng" name="standings">
                <div class="tabs-content__globtable">
                  <div id="board" v-if="standings && standings.length === 1">
                    <div class="standings-container narrow">
                      <!-- <h2 class="">
                        <span class="standings-competition-name text-bold">Bảng xếp hạng</span>
                      </h2> -->
                      <table>
                        <colgroup><col width="3%"><col width="77%"><col width="5%"><col width="5%"><col width="5%"><col width="5%"><col width="5%"></colgroup>
                        <thead>
                          <tr>
                            <th class="pos">
                              <abbr title="Position">Pos</abbr>
                            </th>
                            <th class="team">Đội</th>
                            <th class="st_played">
                              <abbr title="Played" v-if="!isMobile">Trận</abbr>
                              <abbr title="Played" v-else>Tr</abbr>
                            </th>
                            <th class="st_played">
                              <abbr title="Thắng" v-if="!isMobile">Thắng</abbr>
                              <abbr title="Thắng" v-else>T</abbr>
                            </th>
                            <th class="st_played">
                              <abbr title="Hòa" v-if="!isMobile">Hòa</abbr>
                              <abbr title="Hòa" v-else>H</abbr>
                            </th>
                            <th class="st_played">
                              <abbr title="Thua" v-if="!isMobile">Thua</abbr>
                              <abbr title="Thua" v-else>Th</abbr>
                            </th>
                            <th class="st_played">
                              <abbr title="Hiệu số">+/-</abbr>
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
                            <td class="st_played">{{team.total_record.wins}}</td>
                            <td class="st_played">{{team.total_record.ties}}</td>
                            <td class="st_played">{{team.total_record.losses}}</td>
                            <td class="st_played">
                              <strong>{{ countGoals(team.total_record) }}</strong>
                            </td>
                            <td class="st_points">
                              <strong>
                                {{team.total_record.points}}</strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div id="board-special" v-if="standings && standings.length > 1">
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
                            <th class="st_played">
                              <abbr title="Points">+/-</abbr>
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
                            <td class="st_played">
                              <strong>{{countGoals(team.total_record)}}</strong>
                            </td>
                            <td class="st_points">
                              <strong>
                                {{team.total_record.points}}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="Lịch thi đấu" name="fixtures">
                <list-match :data="fixtures"></list-match>
                <a v-if="paginationFixtures && paginationFixtures.pageLeft !== 0" @click.prevent="loadmoreFixtures" class="show-more m-b-20" href="#">
                  Xem tiếp</a>
              </el-tab-pane>
              <el-tab-pane label="Kết quả" name="results">
                <list-match :data="matches"></list-match>
                <a v-if="pagination && pagination.pageLeft !== 0" @click.prevent="loadmoreMatches" class="show-more m-b-20" href="#">
                  Xem tiếp</a>
              </el-tab-pane>
            </el-tabs>

          </div>

        </div>
        <div class="col-sm-4">
          <board :tournamentId="tournament.id" :allResult="false"></board>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import PageTitle from '~/components/frontend/common/page-title.vue'
import ListMatch from '~/components/frontend/livescore/list-match.vue'
import Board from '~/components/frontend/livescore/board.vue'
import moment from 'moment'
export default {
  name: 'livescore-id',
  data () {
    return {
      showFilter: false,
      activeTab: 'standings'
    }
  },
  async fetch ({store, params, error}) {
    // console.log(params)
    try {
      await Promise.all([
        store.dispatch('loadTournaments'),
        store.dispatch('loadTournament', params),
        store.dispatch('loadTournamentStandings', params),
        store.dispatch('loadTournamentFixtures', params),
        store.dispatch('loadMatches', params)
      ])
      // console.log(store.state.pundit.detail.data)
      // if (Object.keys(store.state.livescore.detail.data.data).length === 0) {
      //   error({statusCode: 404, message: 'Trang không tồn tại'})
      // }
    } catch (e) {
      error({statusCode: 404, message: e})
    }
  },
  computed: {
    pageFitlerBodyStyle () {
      return {
        'visibility': this.showFilter ? 'visible' : 'none'
      }
    },
    pageOffsetStyle () {
      const offset = this.showFilter ? this.$refs.filterBody.getBoundingClientRect().height : 0
      return {
        'transform': `translateY(${offset}px)`,
        'padding-bottom': `${offset}px`
      }
    },
    isMobile () {
      return this.$store.state.size.isMobile
    },
    matches () {
      return this.$store.state.livescore.detail.data.data
    },
    tournaments () {
      return this.$store.state.tournament.all.data
    },
    standings () {
      return this.$store.state.tournament.standings
    },
    fixtures () {
      return this.$store.state.tournament.fixtures.data
    },
    paginationFixtures () {
      return this.$store.state.tournament.fixtures.pagination
    },
    tournament () {
      return this.$store.state.tournament.data
    },
    pagination () {
      return this.$store.state.livescore.detail.data.pagination
    },
    defaultParams () {
      return {
        end_date: moment().format('YYYY-MM-DD')
      }
    },
    nextPageParams () {
      // console.log(this.$route)
      return Object.assign({
        page: this.pagination.page + 1,
        id: this.$route.params.id
      }, this.defaultParams)
    },
    defaultFixturesParams () {
      return {
        // end_date: moment().format('YYYY-MM-DD')
      }
    },
    nextPageFixturesParams () {
      // console.log(this.$route)
      return Object.assign({
        page: this.paginationFixtures.page + 1,
        id: this.$route.params.id
      }, this.defaultFixturesParams)
    }
  },
  head () {
    return {
      title: this.tournament ? `${this.tournament.name} ` : 'livescore',
      meta: [
        { hid: 'keywords',
          name: 'keywords',
          content: this.tournament ? `${this.tournament.name} ` : 'livescore'
        },
        { hid: 'description', name: 'description', content: this.tournament && this.tournament.name ? this.tournament.name : 'livescore' },
        { hid: 'og:title', property: 'og:title', content: this.tournament && this.tournament.name ? this.tournament.name : 'livescore' },
        { hid: 'og:type', property: 'og:type', content: this.tournament && this.tournament.name ? this.tournament.name : 'livescore' },
        { hid: 'og:description', property: 'og:description', content: this.tournament && this.tournament.name ? this.tournament.name : 'livescore' },
        { hid: 'og:url', property: 'og:url', content: this.tournament && this.tournament.name ? this.tournament.name : 'livescore' }
      ]
    }
  },
  mounted () {
    console.log(this.standings)
  },
  methods: {
    loadmoreMatches () {
      this.$store.dispatch('loadMatches', this.nextPageParams)
    },
    loadmoreFixtures () {
      this.$store.dispatch('loadTournamentFixtures', this.nextPageFixturesParams)
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    countGoals (record) {
      let goals = parseInt(record.goals_for) - parseInt(record.goals_against)
      if (goals >= 0) {
        return `+${goals}`
      } else {
        return goals
      }
    }
  },
  components: {
    ListMatch,
    PageTitle,
    Board
  }
}
</script>
<style scoped>
.row {
  margin-left: -15px;
  margin-right: -15px;
}
.page-filters {
  position: relative;
  padding-top: 12px;
  margin-bottom: 18px;
}
.page-filters__header {
  display: table;
  width: 100%;
  border-bottom: 1px solid #dcdcdc;
}
.page-filters__title {
  display: table-cell;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  top: -7px;
  vertical-align: middle;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 26px;
  color: inherit;
  width: 100%;
}
.page-filters__button {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  background: white;
  border: 1px solid #dcdcdc;
  border-radius: 9px 9px 0 0;
  padding: 6px 12px;
  white-space: nowrap;
  border-bottom: 0;
  cursor: pointer;
  pointer-events: none;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 16px;
  color: #214cb8;
}
.page-filters__frame {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  overflow: hidden;
}
.page-filters__body {
  background: #f4f4f4;
  transform: translateY(-100%);
  transition: transform 0.33s ease-in-out;
  visibility: hidden;
  padding: 10px;
  border-bottom: 1px solid #dcdcdc;
}
.page-filters__body--open {
  transform: translateY(0);
  display: block !important;
}
.page-filters__filter:last-of-type {
  border-bottom: 0;
  padding-bottom: 0;
}
.page-filters__filter:first-child {
  padding-top: 6px;
}
.page-filters__filter-head {
  padding: 0 6px;
  margin-bottom: 4px;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 22px;
  color: inherit;
}
.page-filters__filter-body {
  display: flex;
  flex-wrap: wrap;
}
.page-filters__filter-item {
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 16px;
  color: inherit;
  margin: 0;
  list-style: none;
  display: block;
  width: 100%;
  text-align: left;
  flex-basis: 50%;
}
.page-filters__filter-link {
  display: inline-block;
  padding: 5px 10px 0;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
}
.page-filters__filter-link--active,
.nuxt-link-exact-active {
  font-family: "OnSport", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: inherit;
  border-bottom: 2px solid red;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: -ms-fit-content;
  pointer-events: none;
}
.page-filters__offset {
  -webkit-transition: -webkit-transform 0.33s ease-in-out;
  -moz-transition: -moz-transform 0.33s ease-in-out;
  transition: transform 0.33s ease-in-out;
  position: relative;
  z-index: 2;
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
  .page-filters__title {
    font-size: 16px;
  }
  .page-filters__title {
    top: 0;
  }
  .page-filters__filter-item,
  .page-filters__button,
  .page-filters__filter-link--active {
    font-size: 14px;
  }
}
</style>

<style scoped>
/* table */

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

