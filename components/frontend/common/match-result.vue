<template>
  <div id="match-result" class="match-result__background">
    <div class="container">
      <div class="match-result">
        <!--  <div class="match-result__close-btn" @click="hiddenMatchResult">
          <i class="fa fa-times"></i>
        </div>
        <div class="match-result__title">
            <span class="match-result__title-text">Kết quả trận đấu</span>
          </div> -->

        <div v-if="loading">
          <loading style="margin: 10px auto" :status="loading" :clockwise="true" :size="40" :speed="0.5"></loading>
        </div>
        <div class="match-result__msg" v-else>
          <div v-show="offset" class="os-score-prev" @click.prevent="seekPrev">
            <img src="/chev-left.png" :alt="chev-left">
          </div>
          <ul v-on:scroll.passive="offsetChange" ref="listOsScore" id="list-os-score" class="list-os-score m-b-0">
            <li :id="`os-score_row_${index}`" class="os-score" v-for="(match, index) in matchResults" :key="match.id">
              <div v-if="!isNotShowing(match)">
                <a v-if="match.link " :href="match.link ? match.link : '#'" target="_blank">
                  <div class="os-score_overview">
                    <div class="os-score_date-time">
                      <span class="os-score_time">
                        {{formatTime(match)}}
                        <span v-if="match && match.note">{{match.note }}</span>
                      </span>
                    </div>
                  </div>
                  <div class="os-score-details">
                    <div class="os-score-game">
                      <div class="os-score_item os-score_item--home " :class="{'team--win': match.winner !== 'away'}">
                        <div class="os-score_logo">
                          <img class="os-score_image" width='16px' height='16px' :alt="match.home_name" :src="buildSrc(match.home_logo)" />
                        </div>
                        <div class="os-score_team ">
                          <div class="os-score_truncate">
                            <span class="os-score_name os-score_name--abbrev">{{ match.home_name}}</span>
                            <span class="os-score_rate" v-if="match.home_rate && match.home_score">{{ match.home_rate }}</span>
                          </div>
                          <div class="os-score_score update__score" v-if="match.home_score || match.home_rate">
                            <span v-if="match.home_score" :class="{'text-danger': isNegative(match.home_score)}">{{ match.home_score}}</span>
                            <span v-else :class="{'text-danger': isNegative(match.home_rate)}"> {{ match.home_rate}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="os-score_item os-score_item--away" :class="{'team--win': match.winner !== 'home'}">
                        <div class="os-score_logo">
                          <img class="os-score_image" width='16px' height='16px' :alt="match.away_name" :src="buildSrc(match.away_logo)" />
                        </div>
                        <div class="os-score_team  icon-font-after">
                          <div class="os-score_truncate">
                            <span class="os-score_name os-score_name--abbrev">{{ match.away_name}}</span>
                            <span class="os-score_rate" v-if="match.away_rate && match.away_score">{{ match.away_rate }}</span>
                          </div>
                          <div class="os-score_score update__score  " v-if="match.away_score">
                            <span :class="{'text-danger': isNegative(match.away_score)}"> {{ match.away_score}}</span>
                          </div>
                          <div class="os-score_score update__score  " v-else>
                            <span :class="{'text-danger': isNegative(match.away_rate)}"> {{ match.away_rate}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="os-score_network" v-if="match.link && match.channel_logo">
                      <img width='32' height='32' class="" :alt="match.channel_logo" :src="buildSrc(match.channel_logo)" />

                    </div>
                  </div>
                </a>
                <div v-else>
                  <div class="os-score_overview">
                    <div class="os-score_date-time">
                      <span class="os-score_time">
                        {{formatTime(match)}}
                        <span v-if="match && match.note">{{match.note }}</span>
                      </span>
                    </div>
                  </div>
                  <div class="os-score-details">
                    <div class="os-score-game">
                      <div class="os-score_item os-score_item--home ">
                        <div class="os-score_logo">
                          <img class="os-score_image" width='16px' height='16px' :alt="match.home_name" :src="buildSrc(match.home_logo)" />
                        </div>
                        <div class="os-score_team ">
                          <div class="os-score_truncate">
                            <span class="os-score_name os-score_name--abbrev">{{ match.home_name}}</span>
                            <span class="os-score_rate" v-if="match.home_rate && match.home_score">{{ match.home_rate }}</span>
                          </div>
                          <div class="os-score_score update__score" v-if="match.home_score || match.home_rate">
                            <span v-if="match.home_score" :class="{'text-danger': isNegative(match.home_score)}">{{ match.home_score}}</span>
                            <span v-else :class="{'text-danger': isNegative(match.home_rate)}"> {{ match.home_rate}}</span>
                          </div>
                        </div>
                      </div>
                      <div class="os-score_item os-score_item--away">
                        <div class="os-score_logo">
                          <img class="os-score_image" width='16px' height='16px' :alt="match.away_name" :src="buildSrc(match.away_logo)" />
                        </div>
                        <div class="os-score_team  icon-font-after">
                          <div class="os-score_truncate">
                            <span class="os-score_name os-score_name--abbrev">{{ match.away_name}}</span>
                            <span class="os-score_rate" v-if="match.away_rate && match.away_score">{{ match.away_rate }}</span>
                          </div>
                          <div class="os-score_score update__score  " v-if="match.away_score">
                            <span :class="{'text-danger': isNegative(match.away_score)}"> {{ match.away_score}}</span>
                          </div>
                          <div class="os-score_score update__score  " v-else>
                            <span :class="{'text-danger': isNegative(match.away_rate)}"> {{ match.away_rate}}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="os-score_network" v-if="match.link && match.channel_logo">
                      <img width='32' height='32' class="" :alt="match.channel_logo" :src="buildSrc(match.channel_logo)" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div v-show="!isReachEnd" class="os-score-next" @click.prevent="seekNext">
            <img src="/chev-right.png" :alt="chev-right">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
// import _ from 'lodash'
export default {
  data () {
    return {
      offset: 0, // de xem dang cuon o vi tri thu may trong cai livechannels
      isReachEnd: false,
      perSeek: 400,
      eventListen: -1,
      loading: false
    }
  },
  computed: {
    matchResults () {
      return this.$store.state.matchResult.data
    }
  },
  methods: {
    isNotShowing (match) {
      const now = moment().utc()
      const endAt = moment(match.end_at).utc()
      return now.isAfter(endAt)
    },
    isNegative (score) {
      return parseFloat(score) < 0
    },

    formatTime (match) {
      const {start_at, is_match_end, end_at} = match
      const startAt = moment(start_at)
      const endAt = moment(end_at)
      const now = moment()
      if (is_match_end) {
        return 'KT'
      }
      if (now.isBefore(endAt)) {
        return startAt.format('HH:mm - DD/MM')
      }
      return ' '
    },
    testHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    },
    buildSrc (image) {
      if (!this.testHttpLink(image)) {
        image = process.env.controlUrl + image
      }

      let resolution = 32
      return image
      // cho nay tao (Nghia) co tinh viet nhu nay day
      return `${process.env.cdnUrl}/?width=${resolution}&url=${encodeURI(image)}`
    },
    // methods of seek
    offsetChange () {
      const {scrollLeft} = this.$refs.listOsScore
      this.offset = scrollLeft
      this.checkReachedEnd()
    },
    checkReachedEnd () {
      const {scrollLeft, scrollWidth, clientWidth} = this.$refs.listOsScore
      this.isReachEnd = (scrollLeft + clientWidth) >= scrollWidth
    },
    hiddenMatchResult () {
      this.$emit('hiddenMatchResult')
    },
    seekPrev () {
      const {clientWidth} = this.$refs.listOsScore
      const options = {
        container: '#list-os-score',
        easing: 'linear',
        offset: this.offset - clientWidth > 0 ? this.offset - clientWidth : 0,
        cancelable: true,
        x: true,
        y: false
      }
      this.$scrollTo(`#os-score_row_0`, 500, options)
    },
    seekNext () {
      const {clientWidth, scrollWidth} = this.$refs.listOsScore
      const maxOffset = scrollWidth - clientWidth
      const options = {
        container: '#list-os-score',
        easing: 'linear',
        offset: this.offset + clientWidth < maxOffset ? this.offset + clientWidth : maxOffset,
        cancelable: true,
        x: true,
        y: false
      }
      this.$scrollTo(`#os-score_row_0`, 500, options)
    }
  },
  created () {
    this.loading = true
  },
  async mounted () {
    await this.$store.dispatch('loadMatchResults')
    this.loading = false
    this.$nextTick(() => {
      if (this.matchResults && this.matchResults.length > 0) {
        // document.getElementById('list-os-score').addEventListener('scroll', _.debounce(this.offsetChange, 100), false)
        this.checkReachedEnd()
        this.eventListen = 1
      }
    })
  },
  beforeDestroy () {
    // check scrolled

    // if (this.eventListen !== -1) {
    //   document.getElementById('list-os-score').removeEventListener('scroll', _.debounce(this.offsetChange, 100), false)
    // }
  }
}
</script>

<style>
.match-result__background {
  background-color: #fcfcfc;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 30;
  height: 81px;
}
.match-result--hidden .match-result__background {
  height: 0;
}
.match-result--showing .match-result__background .match-result {
  display: block;
}

.match-result--showing .match-result__background {
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.4);
}

.match-result__background:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

@media (min-width: 320px) and (max-width: 1039px) {
  .match-result__background .match-result {
    padding-left: 0;
  }
}

@media (min-width: 320px) and (max-width: 639px) {
  .match-result__background .match-result__title {
    font-size: 12px;
    line-height: 1.067;
  }
}

@media (min-width: 320px) and (max-width: 1039px) {
  .match-result__background .match-result__title {
    padding-left: 0;
  }
}

.match-result__background .match-result__msg {
  display: block;
  /* padding-right: 30px; */
  padding-right: 0;
  font-weight: 300;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.match-result__background .match-result__msg a {
  color: #96c1ff;
  font-weight: 300;
}

.match-result__background .match-result__msg a:hover {
  color: #c3dcff;
}

.match-result__background .match-result__msg a:active {
  color: #5295ff;
}

@media (min-width: 480px) and (max-width: 799px) {
  .match-result__background .match-result__msg {
    font-size: 16px;
    line-height: 1.1;
  }
}

@media (min-width: 800px) {
  .match-result__background .match-result__msg {
    font-size: 20px;
    line-height: 1.33;
  }
}

.match-result__background:after {
  content: "";
  height: 81px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #eae9e9;
}

.match-result__background .match-result {
  color: #262626;
  padding: 0;
  display: none;
  position: relative;
  z-index: 30;
}

@media (min-width: 320px) and (max-width: 1039px) {
  .match-result__background .match-result {
    padding-left: 0;
  }
}

.match-result__background .match-result__close-btn {
  color: #262626;
  cursor: pointer;
  padding-top: 10px;
  font-size: 16px;
  line-height: 1.1428571429;
  position: absolute;
  top: -1px;
  right: 10px;
}

.match-result__background .match-result__title {
  color: #262626;
  font-weight: 700;
  text-transform: uppercase;
  padding: 10px 0 0 6px;
  font-size: 14px;
  line-height: 1.6;
  position: absolute;
  top: 0;
  left: 0;
}

@media (min-width: 320px) and (max-width: 639px) {
  .match-result__background .match-result__title {
    font-size: 12px;
    line-height: 1.0666666667;
  }
}

@media (min-width: 320px) and (max-width: 1039px) {
  .match-result__background .match-result__title {
    padding-left: 0;
  }
}
</style>


<style scoped>
.list-os-score {
  position: relative;
  overflow-x: scroll;
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  list-style: none;
  margin : 0;
  padding: 0;
  height: 81px;
}
.list-os-score::-webkit-scrollbar {
  display: none;
}
.os-score {
  background: #fff;
  flex-basis: 120px;
  position: relative;
  border: 1px solid #a5a6a7;
  border-right: none;
  border-top: none;
}
.os-score > div {
  padding: 5px 12px;
}
.os-score:last-child {
  border-right: 1px solid #a5a6a7;
}
.os-score_overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
}
.os-score_date-time {
  color: #000;
  line-height: 1.2;
  font-size: 12px;
}
.os-score-game {
  width: 100%;
  flex-basis: 30px;
}

.os-score-details {
  display: flex;
  align-items: center;
}
.os-score_item:first-child {
  padding-bottom: 5px;
}
.os-score_item {
  display: flex;
  align-items: center;
  position: relative;
}
.os-score_logo{
  width: 16px;
}
.os-score_logo,
.os-score_rank,
.os-score_team {
  position: relative;
  vertical-align: middle;
  line-height: 1;
}
.os-score_time {
  font-weight: bold;
  font-size: 11px;
}
.os-score_logo {
  font-size: 16px;
  padding-right: 5px;
}

.os-score_image {
  vertical-align: top;
  width: 16px;
}
.os-score_team {
  display: flex;
  align-items: flex-end;
  flex: 1 0 auto;
}
.os-score_truncate {
  color: #a5a6a7;
  font-size: initial;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.team--win .os-score_truncate {
  color: #1d1e1f;
}
.os-score_name {
  display: inline;
  font-weight: 600;
  line-height: 14px;
  font-size: 12px;
}
.os-score_rate {
  font-size: 10px;
  color: #262626;
  padding-left: 5px;
  font-weight: 600;
  line-height: 1.2;
}
.os-score_score {
  font-size: 12px;
  padding-left: 10px;
  color: #a5a6a7;
  display: block;
  font-weight: 600;
  line-height: 15px;
  margin-left: auto;
  position: relative;
  text-align: right;
  white-space: nowrap;
  font-family: OnSport, sans-serif;
}
.team--win .os-score_score {
  color: #1d1e1f;
}
.os-score_score > span {
  font-weight: 600;
}

.os-score_network {
  margin-left: 10px;
  font-weight: 400;
  white-space: nowrap;
  font-size: 12px;
  color: #a5a6a7;
}

.os-score-prev,
.os-score-next {
  color: transparent;
  text-shadow: none;
  transition: background-position 0.3s ease-in-out;
  cursor: pointer;
  display: block;
  height: 81px;
  overflow: hidden;
  position: absolute;
  text-align: center;
  min-width: 40px;
  z-index: 30;
  background: #fcfcfc;
  top: 0;
  left: 0;
}
.os-score-prev {
  border-left: 1px solid #a5a6a7;
}
.os-score-next {
  /* right: 30px; */
  right: 0;
  left: auto;
  border-right: 1px solid #a5a6a7;
}

.os-score-prev img,
.os-score-next img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media screen and (min-width: 768px) {
  .os-score {
    min-height: 66px;
  }
  .os-score > div {
    padding: 5px 12px;
  }
  .os-score_overview {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .os-score_date-time {
    padding-right: 10px;
  }
  .os-score_game {
    display: flex;
    align-items: center;
  }
  .os-score-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .os-score_name,
  .os-score_score {
    font-size: 12px;
  }
}
</style>
