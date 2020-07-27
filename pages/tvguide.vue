<template>
  <div class="container">
    <div class="row-tvguide">
      <section id="tvguide">
        <div class="module p-l-0 p-r-0">

            <div class="row-tvguide">
              <div class="tvguide-header clearfix">
                <h1 class="title-tvguide">Lịch phát sóng</h1>
                <nav class="days ">
                  <ul class="nav">
                    <!--  <li class="prev">
                  <a href="?date=2017-12-31" rel="nofollow" class="prev icon leftthinarrow">Prev</a>
                </li> -->
                    <li class="p-b-20" :class="index !== activeIndex ? 'day': 'active'" v-for="(day, index) in listDays" :key="index" @click.prevent="activeIndex = index">
                      <a href="#" rel="nofollow">
                        <strong>{{day.day}}</strong>
                        <span>{{ day.date}}</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>

          <div class="container-fluild" style="background:#f0f3f5;" :class="{'view-list': isMobile}">
            <div class="row p-r-0 p-l-0">
              <ul class="day-nav ">
                <li class="now">
                  <a href="#now" class="now" :class="{active: sessionDay === 'now'}" @click.prevent="handleClickNow">Hiện tại</a>
                </li>
                <li>
                  <a href="#early" class="" :class="{active: sessionDay === 'early'}" @click.prevent="sessionDay = 'early'">Đầu ngày</a>
                </li>
                <li>
                  <a href="#morning" class="" :class="{active: sessionDay === 'morning'}" @click.prevent="sessionDay = 'morning'">Sáng</a>
                </li>
                <li>
                  <a href="#afternoon" class="" :class="{active: sessionDay === 'afternoon'}" @click.prevent="sessionDay = 'afternoon'">Chiều</a>
                </li>
                <li>
                  <a href="#evening" class="" :class="{active: sessionDay === 'evening'}" @click.prevent="sessionDay = 'evening'">Tối</a>
                </li>
              </ul>

            </div>
          </div>
          <div class="container-fluid" style="background:#fff;">
            <div class="row">
              <div class="containertop m-b-20">
                <div class="tvg-channels">
                  <div class="col" v-for="channel in schedules" :key="channel.id">
                    <nuxt-link :to="handleLink({item_type: 'live_channels',id: channel.slug})">
                  <span class="ss-tvlogo span3 centered">
                    <blur-image :aspectRatio="1" align="center" :src="channel.thumbnail" :alt="channel.slug" :title="channel.name" />
                  </span>
                    </nuxt-link>
                  </div>
                </div>
                <div class="main-epg" id="main-epg" v-loading="fetching">
                  <div class="channel__programme__section" id="hook_wrap" ref="hookWrap">
                    <div v-if="activeIndex === 3" class="time-marker" :style="calculateOffsetTimeMarker"></div>
                    <div class="end-day"></div>
                    <!-- EPG Header -->
                    <div class="programme__header">
                      <div class="header__time" :id="`hook_${n}`" v-for="n in 24" :key="n">
                        <strong> {{n - 1}}:00</strong>
                      </div>
                    </div>
                    <!-- Programme Listing -->
                    <div class="programme__row" v-for="channel in schedules" :key="channel.id">
                      <div class="programme" :class="{'short-programme': computedDurationInMinutes(program) < 60}" :style="[{ flex:'0 0 ' +(computedDurationInMinutes(program) * minuteWidthPx) + 'px'}, calculateOffset(program, index)]" v-for="(program, index) in channel.schedules" :key="program.id">
                        <nuxt-link :to="handleLink({item_type: 'live_channels',id: channel.slug})">
                          <h3> {{program.title}}</h3>
                          <time :datetime="program.start_at">
                            <meta itemprop="startDate" :content="program.start_at"> {{timeStart(program.start_at)}} - {{timeStart(program.end_at)}}
                            <meta itemprop="endDate" :content="program.end_at">
                          </time>
                          <span style="float:right" class="p-t-10">{{computedDurationInMinutes(program)}} phút .</span>
                        </nuxt-link>
                      </div>
                    </div>
                  </div>
                </div>
                <a href="#prev" @click.prevent="seekPrev" class="prev leftthinarrow">Prev</a>
                <a href="#next" @click.prevent="seekNext" class="next rightthinarrow">Next</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

</template>

<script>
import PageTitle from '~/components/frontend/common/page-title.vue'
import moment from 'moment'
import Board from '~/components/frontend/livescore/board.vue'
import _ from 'lodash'
export default {
  async fetch ({store, params, error}) {
    // console.log('moment', moment())
    let startDate = moment().utc().add(7, 'hour').format('YYYY-MM-DD')
    let endDate = moment().utc().add(7, 'hour').format('YYYY-MM-DD')
    // const startDate = new Date('YYYY-MM-DD')
    // startDate = '2018-01-07'
    try {
      await Promise.all([store.dispatch('loadSchedules', {startDate, endDate})])
    } catch (e) {
      error({statusCode: 404, message: e})
    }
  },
  head () {
    return {
      title: 'Lịch chiếu',
      meta: [
        { hid: 'keywords',
          name: 'keywords',
          content: 'tvguide, On Sports, Thể thao, Bóng đá, Lịch chiếu'
        },
        { hid: 'description', name: 'description', content: 'Lịch phát sóng các kênh truyền hình trên ONSports.vn' },
        { hid: 'og:title', property: 'og:title', content: 'Lịch phát song' },
        { hid: 'og:type', property: 'og:type', content: 'tvguide' },
        { hid: 'og:description', property: 'og:description', content: 'Lịch phát sóng các kênh truyền hình trên ONSports.vn' },
        { hid: 'og:url', property: 'og:url', content: 'https://onsports.vn/tvguide' },
        { hid: 'og:image', property: 'og:image', content: '' },
        { hid: 'og:image:alt', property: 'og:image:alt', content: 'Lịch phát sóng các kênh truyền hình trên ONSports.vn' },
        { hid: 'og:image:width', property: 'og:image:width', content: '512' },
        { hid: 'og:image:height', property: 'og:image:height', content: '288' }
      ]
    }
  },
  data () {
    return {
      minuteWidthPx: 5,
      radiusDays: 3, // mobile is 1
      activeIndex: 3, // 0 -> 6, tuong ung voi 7 ngay trong tuan
      sessionDay: 'now', // now, early, morning, afternoon, evening
      offset: 0, // de xem dang cuon o vi tri thu may trong cai livechannels
      offsetMarker: 0,
      perSeek: 400,
      intervalMarker: null,
      activeChannelIndex: 0 // only mobile mode
    }
  },
  computed: {
    isMobile () {
      return this.$store.state.size.isMobile
    },
    schedules () {
      return this.$store.state.schedule.data
    },
    fetching () {
      return this.$store.state.schedule.fetching
    },
    listDays () {
      let listDays = []
      let isoToStr = (wday) => {
        switch (wday) {
          case 1: return 'HAI'
          case 2: return 'BA'
          case 3: return 'TƯ'
          case 4: return 'NĂM'
          case 5: return 'SÁU'
          case 6: return 'BẢY'
          case 7: return 'CN'
        }
      }
      if (this.radiusDays) {
        for (var i = -this.radiusDays; i <= this.radiusDays; i++) {
          listDays.push({
            day: isoToStr(moment().add(i, 'days').isoWeekday()),
            date: moment().add(i, 'days').format('DD/MM'),
            params: moment().add(i, 'days').format('YYYY-MM-DD')
          })
        }
      }
      return listDays
    },
    isReachEnd () {
      const {clientWidth} = this.$refs.hookWrap
      return (this.offset + clientWidth) >= this.minuteWidthPx * 24 * 60
    },
    calculateOffsetTimeMarker () {
      return {
        transform: `translateX(${this.offsetMarker}px)`
      }
    }

  },
  methods: {
    offsetChange () {
      const {scrollLeft} = this.$refs.hookWrap
      this.offset = scrollLeft
    },
    seekPrev () {
      const {clientWidth} = this.$refs.hookWrap
      const options = {
        container: '#hook_wrap',
        easing: 'linear',
        offset: this.offset - clientWidth > 0 ? this.offset - clientWidth : 0,
        cancelable: true,
        x: true,
        y: false
      }
      this.$scrollTo(`#hook_1`, 200, options)
    },
    seekNext () {
      const {clientWidth} = this.$refs.hookWrap
      const maxOffset = this.minuteWidthPx * 24 * 60 - clientWidth
      const options = {
        container: '#hook_wrap',
        easing: 'linear',
        offset: this.offset + clientWidth < maxOffset ? this.offset + clientWidth : maxOffset,
        cancelable: true,
        x: true,
        y: false
      }
      this.$scrollTo(`#hook_1`, 200, options)
    },
    // cho nay danh cho viec xu ly tvguide
    computedDurationInMinutes (program) {
      const { start_at, end_at } = program
      return moment(end_at).diff(moment(start_at), 'minutes')
    },
    timeStart (time) {
      return moment.utc(time).format('HH:mm')
    },
    hoursToNow () {
      let now = moment()
      return now.get('hour')
    },
    calculateOffset (programe, index) {
      if (index === 0) {
        const startOfDay = moment(programe.start_at).utc().startOf('day')
        const offsetLeft = moment(programe.start_at).utc().diff(startOfDay, 'minutes')
        // console.log(offsetLeft)
        return {
          marginLeft: `${offsetLeft * this.minuteWidthPx}px`
        }
      }
      return {}
    },
    initMarker () {
      this.offsetMarker = moment().diff(moment().startOf('day'), 'minute') * this.minuteWidthPx
    },
    handleClickNow () {
      this.activeIndex = 3
      if (this.sessionDay === 'now') {
        this.scrollToNow()
      } else {
        this.sessionDay = 'now'
      }
    },
    scrollToNow () {
      const options = {
        container: '#hook_wrap',
        easing: 'linear',
        offset: (moment().diff(moment().startOf('day'), 'minute') - 60) * this.minuteWidthPx,
        cancelable: true,
        x: true,
        y: false
      }
      this.$scrollTo(`#hook_1`, 300, options)
    }

    // handleMouseOver: _.debounce((programe, e) => {
    //   // let big = true
    //   // if (this.computedDurationInMinutes(programe) * this.minuteWidthPx <= 500) {
    //   //   big = false
    //   // }
    //   // console.log(this.$refs)
    // }, 300),
    // handleMouseLeave (e) {
    //   // const elClassList = e.currentTarget.classList
    //   // // if (elClassList.contains('hovered')) {
    //   // elClassList.remove('hovered')
    //   // // }
    //   console.log('leaved')
    // }

  // new version scroll
  },
  watch: {
    isMobile () {
    },
    offset (after) {
      // console.log(this.isReachEnd)
    },
    activeIndex (after) {
      const startDate = moment().utc().add(7, 'hour').add(after - this.radiusDays, 'day').format('YYYY-MM-DD')
      const endDate = moment().utc().add(7, 'hour').add(after - this.radiusDays, 'day').format('YYYY-MM-DD')
      this.$store.dispatch('loadSchedules', {startDate, endDate})

      this.intervalMarker = null //remove interval when change change day

      if (after === 3) {
        this.initMarker() // first run
        this.intervalMarker = setInterval(() => {
          this.initMarker()
        }, 300000) // run every 30s
      }
    },
    sessionDay (after) {
      let offset = 0
      switch (after) {
        case 'now':
          offset = (moment().diff(moment().startOf('day'), 'minute') - 60) * this.minuteWidthPx
          // console.log(offset)
          break
        case 'early':
          offset = 0 // 0h
          break
        case 'morning':
          offset = 6 * 60 * this.minuteWidthPx // 6h sang
          break
        case 'afternoon':
          offset = 12 * 60 * this.minuteWidthPx // 6h sang
          break
        case 'evening':
          offset = 18 * 60 * this.minuteWidthPx // 6h sang
          break
        default:
          offset = 0 // 0h
          break
      }
      const options = {
        container: '#hook_wrap',
        easing: 'linear',
        offset: offset,
        cancelable: true,
        x: true,
        y: false
      }
      this.$scrollTo(`#hook_1`, 300, options)
    }
  },
  mounted () {
    this.minuteWidthPx = window.innerWidth > 600 ? 5 : 3
    if (this.activeIndex === 3) {
      //init marker when first run
      this.scrollToNow()
      this.initMarker() // first run
      this.intervalMarker = setInterval(() => {
        this.initMarker()
      }, 300000) // run every 30s
    }

    document.getElementById('hook_wrap').addEventListener('scroll', _.debounce(this.offsetChange, 300), false)
  },
  beforeDestroy () {
    this.intervalMarker = null //remove interval when change page
    document.getElementById('hook_wrap').removeEventListener('scroll', _.debounce(this.offsetChange, 300), false)
  },
  components: {
    PageTitle,
    Board
  }
}
</script>
<style scoped>
.containertop {
  padding-left: 90px !important;
  position: relative;
  background: #ffffff;
  overflow:hidden;
}
.containertop > .tvg-channels {
  position: absolute;
  top: 0;
  left: 0;
  width: 90px;
  height: 100%;
  padding-top: 62px;
  z-index: 1;
}
.tvg-channels > .col {
  font-size: 22px;
  font-weight: bold;
  color: white;
  text-align: center;
  height: 80px;
  padding: 11px 0;
  position: relative;
}
.tvg-channels > col:nth-of-type(2n) {
  background-color: #e6e9ec;
}
.tvg-channels > .col span.span3 {
  width: 58px !important;
  height: 58px !important;
}
.tvg-channels > .col .ss-tvlogo {
  height: 100%;
}
.ss-tvlogo {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  white-space: nowrap;
  background: none !important;
  margin-top: 0 !important;
}

.containertop > .row {
  max-width: inherit;
}
.title-tvguide {
  font-weight: 700;
  color: #17151f;
  font-size: 32px;
  margin-top: 10px;
  margin-bottom: 9px;
  float: left;
  width: 20.1%;
  margin-bottom: -1px;
}
nav.days {
  float: left;
  width: 79.9%;
}
nav.days ul {
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
nav.days li {
  flex: 0 0 120px;
}

nav.days li a {
  color: #17151f;
  font-family: "OnSport", sans-serif;
  font-weight: 300;
  font-size: 24px;
  text-align: center;
  display: block;
  text-decoration: none;
  text-align: center;
  padding-top: 9px;
  height: 60px;
}
nav.days li.active {
  background: #4545a2;
  color: #fff;
  flex: 0 0 140px;
}
nav.days li.active a,
nav.days li.active span,
nav.days li.active a:focus {
  color: #fff;
  background: #4545a2;
}

nav.days li.active a:hover,
nav.days li.active span:hover {
  background: transparent;
}
nav.days li a strong {
  font-weight: 100;
  margin-bottom: -3px;
  display: block;
}
nav.days li a span {
  font-family: "OnSport", sans-serif;
  font-weight: 800;
  display: block;
  font-size: 18px;
}
</style>
<style scoped>
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>



<style scoped>
/* copy and paste */

.leftthinarrow,
.rightthinarrow {
  color: #9da7ad;
  text-decoration: none;
  float: left;
  text-indent: -9999px;
  height: 62px;
  width: 90px;
  font-size: 45px;
}
.leftthinarrow {
  position: absolute;
  top: 0px;
  left: 0px;
}
.rightthinarrow {
  margin-right: 0;
  position: absolute;
  top: 0px;
  right: 1px;
  background: #fff;
  z-index: 10;
}
.leftthinarrow:before {
  content: "\f053";
  font-family: FontAwesome;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  position: absolute;
  text-indent: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.rightthinarrow:before {
  content: "\f054";
  font-family: FontAwesome;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  position: absolute;
  text-indent: 0;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  right: 0;
  bottom: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.channel__programme__section {
  position: relative;
  overflow-x: scroll;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.channel__programme__section .programme__header {
  height: 62px;
  color: #4085ce;
  line-height: 62px;
  display: flex;
  background-color: #e6e9ec;
  flex-direction: row;
}

.programme__header .header__time {
  flex: 0 0 300px;
  box-sizing: border-box;
  background-color: #fff;
  border: none;
  height: 100%;
  border-left: 1px solid #e1e5e8;
  padding: 11px 15px;
}
.programme__header .header__time strong {
  color: #333;
  font-family: "OnSport", sans-serif;
  font-weight: 300;
  font-size: 22px;
  line-height: 62px;
}

.programme__row {
  display: flex;
  flex-direction: row;
  height: 80px;
  /*border: 1px solid #dcdcdc;*/
  /*padding: 0 10px;*/
}

.programme__timing__section {
  background-color: #e7e7e7;
}

.programme__row .programme {
  flex: 0 0 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* line-height: 30px; */
  padding: 8px 10px;
  font-size: 0.8em;
  font-weight: bold;
  box-sizing: border-box;
  background-color: #e7e7e7;
  background: #fff;
  border-left: 5px solid #f0f3f5;
  border-top: 5px solid #f0f3f5;
  border-bottom: 5px solid #f0f3f5;
  padding: 6px 10px;
  overflow: hidden;
  min-width: 0;
}
.programme__row .programme:last-child {
  border-right: 5px solid #f0f3f5;
}
.programme__row .programme.hovered,
.programme__row .programme:hover {
  border-color: #283842 !important;
  border-right: 5px solid #283842 !important;
  z-index: 20;
}
.programme__row .programme.short-programme:hover {
  flex: 0 0 450px !important;
}
.programme__row .programme h3 {
  color: #17151f;
  font-family: "OnSport", sans-serif;
  font-weight: 800;
  font-size: 18px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 23px;
}

.programme__row .programme--no__data {
  line-height: 40px;
  padding: 0 10px;
  font-size: 0.8em;
  font-weight: bold;
  box-sizing: content-box;
}

.programme__row sup {
  color: rgb(198, 88, 42);
  line-height: 15px;
}

.day-nav {
  font-family: "OnSport", sans-serif;
  font-weight: 500;
  font-size: 18px;
  left: 0;
  padding-left: 10px;
  width: 100%;
  overflow-y: auto;
  margin-top: 14px;
}
.day-nav li {
  list-style: none;
  display: inline;
}
.day-nav a {
  color: #9da7ad;
  text-decoration: none;
  float: left;
  margin-right: 21px;
}
.day-nav li.now a.active,
.day-nav li.now a:active,
.day-nav li.now a:hover {
  color: #fff;
  background: #4545a2;
}
.day-nav li.now a {
  color: #9da7ad;
  background: #f0f3f5;
  font-family: AktivGrotesk, Helvetica, Arial, sans-serif;
  font-weight: 800;
  font-size: 14px;
  text-transform: uppercase;
  padding: 1px 7px;
}
.day-nav a.active {
  color: #4545a2;
}
.time-marker {
  background: #4545a2;
  position: relative;
  transition: transform 0.3s linear;
  position: absolute;
  height: 100%;
  width: 3px;
  top: 0;
  left: -6px;
}
.time-marker:before {
  content: "";
  background: #4545a2;
  width: 15px;
  height: 15px;
  position: absolute;
  left: -6px;
}
.end-day {
  background: #ccc;
  position: absolute;
  height: calc(100% - 62px);
  width: 2px;
  top: 62px;
  left: 0px;
  transform: translateX(7200px);
  z-index: 100;
}
@media (max-width: 992px) {
  .title-tvguide {
    width: 100%;
    margin-bottom: 10px;
  }
  nav.days {
    width: 100%;
  }
  nav.days li {
    flex: 0 0 90px;
  }
  nav.days li.active {
    flex: 0 0 100px;
  }
}
@media (max-width: 767px) {
  .leftthinarrow,
  .rightthinarrow {
    width: 50px;
    font-size: 32px;
  }
  .leftthinarrow:before,
  .rightthinarrow:before {
    top: 50%;
  }
  .day-nav a {
    margin-right: 10px;
  }

  nav.days li {
    flex: 0 0 60px;
  }
  nav.days li.active {
    flex: 0 0 70px;
  }
  nav.days li a {
    color: #17151f;
    font-family: "OnSport", sans-serif;
    font-weight: 300;
    font-size: 18px;
    text-align: center;
    display: block;
    text-decoration: none;
    text-align: center;
    padding-top: 9px;
    height: 40px;
  }

  /* mobile tvguide */

  .view-list .containertop {
    padding-left: 50px !important;
    position: relative;
  }
  .view-list .containertop > .tvg-channels {
    position: absolute;
    padding-top: 62px;
    top: 0;
    left: 0;
    width: 50px;
    height: 100%;
    z-index: 1;
  }
  .view-list .tvg-channels > .col {
    font-size: 22px;
    font-weight: bold;
    color: white;
    text-align: center;
    height: 80px;
    padding: 0;
    position: relative;
  }
  .view-list .programme__header .header__time {
    flex: 0 0 180px;
  }
  .view-list .programme__row .programme.hovered,
  .view-list .programme__row .programme:hover {
    flex: 0 0 300px !important;
  }
  .tvg-channels > .col span.span3 {
    width: 38px !important;
    height: 38px !important;
  }
  .end-day {
    transform: translateX(4320px);
  }
}
.tvguide-header{
  width:100%;
}
.row-tvguide{

}
</style>
