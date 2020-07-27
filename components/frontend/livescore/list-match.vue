<template>
  <div class="bet-list-box" id="bet-list">
    <div v-if="data && data.length > 0">
      <div v-for="day in matchesByDay" :key="day.id">
        <h4 class="comp-5">{{ formatDay(day.start_at) }}</h4>
        <ul class="bet-list" v-for="(tournament, index) in day.data" :key="index">
          <nuxt-link :to="handleLink({item_type :'livescore', id :tournament.league.id })">
            <h5 class="tournament">{{ tournament.league.name }}</h5>
          </nuxt-link>
          <bet-item v-for="(item, index) in tournament.data" :key="index" :class="{even: index % 2 == 1 }" :item="item"></bet-item>
        </ul>
      </div>
    </div>
    <ul class="bet-list" v-else>
      <div class="no-result">
        <p>Hiện tại không có trận nào</p>
      </div>
    </ul>
  </div>
</template>

<script>
    import BetItem from './match.vue'
    import moment from 'moment'
    import _ from 'lodash'
    export default{
      data () {
        return {
    
        }
      },
      props: {
        data: { // danh sach cac trận dau
          type: Array,
          required: true
        },
        filter: { // kiểu filter theo thể loại
          type: String,
          default: 'all' // all, betable
        },
        history: { // có phải dùng ở lichj sử bet k
          type: Boolean,
          default: false
        }
      },
      computed: {
        matchesByDay () {
          let result = []
          result = _.chain(this.data).groupBy('start_at').toPairs().map(function (currentItem) {
            let data = _.zipObject(['start_at', 'data'], currentItem)
            let groupByTournament = _.chain(data.data).groupBy(item => (item.tournament.id)).toPairs().map(function (currentData) {
              // set tournament to league
              // console.log(currentData)
              currentData[0] = currentData[1][0].tournament
              return _.zipObject(['league', 'data'], currentData)
            }).value()
            data.data = groupByTournament
            return data
          }).value()
    
          return result
        }
      },
      created () {
      },
      methods: {
        formatDay (day) {
          return moment(day).utc().add(7, 'hour').format('dddd, DD MMMM - HH:mm')
        }
      },
      components: {
        BetItem
      }
    }
</script>
<style lang="css">
/*vp game*/

.bet-before > i,
.bet-after > i {
  font-size: 28px;
  line-height: 50px;
}

.bet-list-box {
  /*width: 770px;*/
  /*height: 630px;*/
}

#bet-list,
ul.bet-list {
  flex: -1;
  min-height: 50px;
  margin: 0;
  position: relative;
  /* background-color: #34393f; */
}

#bet-list ul.bet-list > li {
  /*width: 770px;*/
  position: relative !important;
  flex: 1;
  display: flex;
}

#bet-list h2 {
  font-size: 16px;
  color: white;
  position: relative;
  padding: 6px 10px;
  text-shadow: 1px 1px 2px black;
  text-transform: uppercase;
  font-weight: normal;
  height: 50px;
  line-height: 38px;
  background: #2e3238;
}

#bet-list .more {
  color: #cccccc;
  float: right;
  margin-top: 5px;
  font-size: 12px;
}

#bet-list .more i.fa {
  font-size: 18px;
  vertical-align: baseline;
}

ul.bet-list .no-result {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
}

.bet-match:first-child {
  margin-top: 0;
}

.bet-list-body {
  position: relative;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}

li.even > .bet-match {
  background: transparent;
}

li:hover > .bet-match {
  background-color: rgba(0, 0, 0, 0.08);
}

.bet-right-img {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
}

.bet-right-img img {
  height: 100%;
  width: auto;
  opacity: 0.2;
  filter: alpha(
    opacity=0,
    finishopacity=30,
    style=1,
    startX=0,
    startY=0,
    finishX=50,
    finishY=0
  );
}

.bet-right-img .opacity-b {
  position: absolute;
  content: "";
  display: block;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  background: -ms-linear-gradient(
    left,
    rgba(52, 57, 63, 1),
    rgba(0, 0, 0, 0) 50%
  );
  background: -moz-linear-gradient(
    left,
    rgba(52, 57, 63, 1),
    rgba(0, 0, 0, 0) 50%
  );
  background: -webkit-linear-gradient(
    left,
    rgba(52, 57, 63, 1),
    rgba(0, 0, 0, 0) 50%
  );
  filter: progid:DXImageTransform.Microsoft.Gradient(
      startColorStr="#34393f",
      endColorStr="#19000000",
      gradientType="1"
    );
}

.bet-title-wrap {
  /*float: left;*/
  /*width: 100px;*/

  flex-basis: 120px;
  padding: 5px 10px;
}
.match-info-wrap {
  min-height: 30px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid #ccc;
  color: #404040;
  float: none;
  padding: 6px 0;
  position: relative;
  text-align: left;
  width: 100%;
}
.bet-title {
  margin-bottom: 0;
  max-width: 100px;
}

.ellipsis-nghia,
.steam-item-name {
  -o-text-overflow: ellipsis;
  word-break: normal;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 174px;
  margin: 0;
  padding: 0;
}

.status-doing-close,
.status-doing-cancel {
  color: rgb(68, 68, 68);
}

.status-doing-live {
  color: #f8600c;
}

.spinach-item-team {
  flex: 8;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.spinach-item-center + .spinach-item-team {
  justify-content: flex-start;
}

.spinach-item-img {
  position: relative;
}

.pull-right {
  float: right !important;
}

.spinach-item-img img {
  /*background: #000;*/
  border-radius: 4px;
}

.spinach-item-team.pull-left .spinach-item-data {
  /*margin-right: 107px;*/
  text-align: right;
}

.spinach-item-data p {
  padding: 0 5px;
  margin: 0;
  line-height: 1;
  font-size: 14px;
  font-weight: 700;
}

.spinach-name-length {
  /* width: 103px; */
  display: inline-block;
}

.spinach-item-img {
  position: relative;
}

.spinach-item-team.pull-right .spinach-item-data {
  /*margin-left: 107px;*/
  text-align: left;
}

.spinach-item-name {
  color: rgb(68, 68, 68);
}

.spinach-item-center {
  flex: 4;
  padding: 0 10px;
  /*position: absolute;*/
  /*left: 360px;*/
  /*top: 50%;*/
  /*transform: translateY(-50%);*/
  /*float: left;*/
  /*width: 154px;*/
  /*text-align: center;*/
}

.spinach-item-score {
  text-align: center;
  color: #000;
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: 0;
}

.spinach-btn-wrap .btn {
  font-size: 12px;
  height: 26px;
  line-height: 24px;
  border-radius: 0;
  padding: 7px 15px;
  border: 2px solid #666b70;
  color: #afb0b2;
  white-space: nowrap;
}

.spinach-btn-wrap .btn:hover {
  border: 2px solid #fff;
  color: #ccc;
}

.bet-match-middle {
  vertical-align: middle;
}

.bet-match-body,
.bet-match-left,
.bet-match-right {
  /*display: table-cell;*/
  /*vertical-align: top;*/
}

.bet-match {
  flex: 1;
  display: flex;
  color: #878a8c;
  text-decoration: none;
  overflow: hidden;
  /* background: #34393f; */
}

.current-watch {
  color: black;
  padding: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: absolute;
  top: 0%;
  left: 0%;
  font-weight: 500;
  line-height: 1;
  font-size: 13px;
  z-index: 11;
  /*display: none;*/
  background: #fff;
}

#links-wrapper a.active {
  text-decoration: none;
  color: #ed1c24;
  font-weight: 700;
}

.bet-head {
  /*padding: 0 12px;*/
  /*height: 50px;*/
  /*line-height: 50px;*/
  /*background: #2e3238;*/
  /*width: 770px;*/
  /*margin: 0 auto;*/
}

.bet-before,
.bet-after {
  /*display: block;*/
  /*height: 50px;*/
  display: flex;
  color: #75797e;
  flex-basis: 50px;
  align-items: center;
  justify-content: center;
}

.container-breadcrumb {
  /* width: 1080px; */
  margin: auto;
  padding-top: 0px;
  margin-bottom: 00px;
}

.container-breadcrumb .demo-nav {
  padding-left: 0;
}
.bet-list-box h4 {
  background: #4545a2;
  clear: both;
  color: #fff;
  margin: 0 0 0px;
  text-transform: uppercase;
  height: 30px;
  line-height: 30px;
  font-size: 1.4rem;
  padding: 0 0 0 10px;
  font-weight: 400;
  font-family: OnSport, sans-serif;
}
.bet-list-box h5.tournament {
  background: #e9e8f0;
  clear: both;
  color: #5c2d91;
  margin: 5px 0 0px;
  text-transform: uppercase;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  padding: 0 0 0 10px;
  font-weight: 600;
}
</style>