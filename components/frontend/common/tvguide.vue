<template>
  <div class="containertop">
    <div class="row no-gutter m-b-20">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <table width="100%" border="0" class="day_table">
          <tbody>
            <tr>
              <td v-for="i in 7" :key="i">
                <div style="width:100%" :class="{ 'day_item_selected': i === 1, 'day_item' : i!==1 }">
                  <a href="">Tue</a>
                </div>
                <div style="width:100%" :class="{ 'day_item1_selected': i === 1, 'day_item1' : i!==1 }">
                  <a href="#">2{{ i }}</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row no-gutter">
      <div class="col-xs-3 col-sm-2 col-lg-1 p-r-0">
        <div style="background-color:#d1d0de;width:100%">
          <div id="left-sidebar" class="slider_time" style="width:100%">
            <ul id="timer">
              <li class="item-timer" style="width:100%">
                <span style="text-decoration: none;">Kênh</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="list-channel">
          <ul class="m-b-0 left-sidebar-content">
            <li v-for="i in 4" :key="i">
              <div class="channel">
                <div class="centered">
                  <img align="center" src="https://epg.beinsports.com/mena_sports/News_ar.svg?2018" alt="beinsports news">
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-xs-9 col-sm-10 col-lg-11 p-l-0">
        <div class="onsports-program">
          <div style="width:100%" class=" programs-schedule">
            <div ref="epg" class="swiper-wrapper">
              <div class="swiper-slide">
                <div>
                  <div style="background-color:#d1d0de;width:100%">
                    <div id="slider_timer" class="slider_time">
                      <ul :style="computedChannelStyle" id="timer">
                        <li :style="computedTimerStyle" :class="{'item-timer-selected': i === 1}" class="item-timer" v-for="i in 24" :key="i">
                          <span style="text-decoration: none;">{{i - 1}}:00</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <ul class="m-b-0" :style="computedChannelStyle">
                    <li class="swiper-slide-1" :style="`left: ${(i-1) * hourWidth}px; width: ${hourWidth}px`" v-for="i in 24" :key="i">
                      <div class="program-wrapper" style="left: 0px; width: auto;">
                        <p class="sub-genre">MARTIAL ARTS</p>
                        <p class="programme m-b-10">The Ultimate Fighter: A New World Champion</p>
                        <p class="time">12:00 AM - 12:59 AM</p>
                      </div>
                    </li>
                  </ul>
                  <ul class="m-b-0" :style="computedChannelStyle">
                    <li class="swiper-slide-1" :style="`left: ${(i-1) * hourWidth}px; width: ${hourWidth}px`" v-for="i in 24" :key="i">
                      <div class="program-wrapper" style="left: 0px; width: auto;">
                        <p class="sub-genre">MARTIAL ARTS</p>
                        <p class="programme m-b-10">The Ultimate Fighter: A New World Champion</p>
                        <p class="time">12:00 AM - 12:59 AM</p>
                      </div>
                    </li>
                  </ul>
                  <ul class="m-b-0" :style="computedChannelStyle">
                    <li class="swiper-slide-1" :style="`left: ${(i-1) * hourWidth}px; width: ${hourWidth}px`" v-for="i in 24" :key="i">
                      <div class="program-wrapper" style="left: 0px; width: auto;">
                        <p class="sub-genre">MARTIAL ARTS</p>
                        <p class="programme m-b-10">The Ultimate Fighter: A New World Champion</p>
                        <p class="time">12:00 AM - 12:59 AM</p>
                      </div>
                    </li>
                  </ul>
                  <ul class="m-b-0" :style="computedChannelStyle">
                    <li class="swiper-slide-1" :style="`left: ${(i-1) * hourWidth}px; width: ${hourWidth}px`" v-for="i in 24" :key="i">
                      <div class="program-wrapper" style="left: 0px; width: auto;">
                        <p class="sub-genre">MARTIAL ARTS</p>
                        <p class="programme m-b-10">The Ultimate Fighter: A New World Champion</p>
                        <p class="time">12:00 AM - 12:59 AM</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev" @click.prevent="seekBack()"></div>
            <div class="swiper-button-next" @click.prevent="seekNext()"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {debounce} from 'lodash'
export default {
  async asyncData ({app, error}) {
    const response = await app.$axios.$get('https://apiv2.vtvplay.vn/v1/live-channel/schedule-by-day?platform=Web&liveChannelId=5&day=2017-12-14')
    const success = response && Object.is(response.code, 0)
    if (success) {
      return {data: response.data}
    } else {
      error({statusCode: 404, message: 'Không lấy được dữ liệu'})
    }
  },
  data () {
    return {
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 0,
        navigationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        direction: 'vertical',
        mousewheelControl: true,
        freeMode: true
      },
      currentPage: 0, // 1 page = 2 hours
      pageCount: 12,
      hourWidth: 300,
      dragOffset: 0,
      dragStartX: 0,
      minSwipeDistance: 10,
      mousedown: false
    }
  },
  computed: {
    computedChannelStyle () {
      return {
        width: 24 * this.hourWidth + 'px',
        transition: ` 0.5s transform`,
        transform: `translateX(${this.currentOffset}px`
      }
    },
    computedTimerStyle () {
      return {
        width: this.hourWidth + 'px'
      }
    },

    currentOffset () {
      if (process.browser) {
        const page = this.currentPage
        const epgWidth = this.getEpgWidth()
        const width = this.hourWidth
        const wip = (24 * width) - (page * 2 * width) - epgWidth // WIP
        if (wip > 0) {
          return (page * 2 * width) * -1
        } else {
          return ((24 * width) - epgWidth) * -1
        }
      }
      return 0

      // const offset = (this.scrollPerPage) ? (page * width * this.currentPerPage) : (page * width)
      // return (offset) * -1
    }
  },
  methods: {
    seekNext () {
      // console.log(this.$el.getBoundingClientRect().width)
      if (this.currentPage === 11) {
        this.currentPage = 0
      } else {
        this.currentPage = this.currentPage + 1
      }
    },
    seekBack () {
      if (this.currentPage === 0) {
        this.currentPage = 11
      } else {
        this.currentPage = this.currentPage - 1
      }
    },
    setSlideWidth () {
      const width = this.getBrowserWidth()
      if (width < 480) {
        this.hourWidth = 180
      } else if (width >= 480 && width < 768) {
        this.hourWidth = 240
      } else {
        this.hourWidth = 360
      }
    },
    getBrowserWidth () {
      this.browserWidth = window.innerWidth
      return this.browserWidth
    },
    getEpgWidth () {
      this.carouselWidth = (this.$refs.epg && this.$refs.epg.clientWidth) || 0 // Assign globally
      return this.carouselWidth
    },

    computedProgramStyle (i) {

    },
    handleMousedown (e) {
      if (!e.touches) { e.preventDefault() }
      this.mousedown = true
      this.dragStartX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
    },

    handleMouseup () {
      this.mousedown = false
      this.dragOffset = 0
    },

    handleMousemove (e) {
      if (!this.mousedown) {
        return
      }
      const eventPosX = ('ontouchstart' in window) ? e.touches[0].clientX : e.clientX
      const deltaX = (this.dragStartX - eventPosX)
      this.dragOffset = deltaX
      if (this.dragOffset > this.minSwipeDistance) {
        this.handleMouseup()
        this.seekNext()
      } else if (this.dragOffset < -this.minSwipeDistance) {
        this.handleMouseup()
        this.seekBack()
      }
    }
  },

  mounted () {
    // console.log(this.data)
    if (!this.$isServer) {
      window.addEventListener('resize', debounce(this.setSlideWidth, 16))
      if ('ontouchstart' in window) {
        this.$el.addEventListener('touchstart', this.handleMousedown)
        this.$el.addEventListener('touchend', this.handleMouseup)
        this.$el.addEventListener('touchmove', this.handleMousemove)
      } else {
        this.$el.addEventListener('mousedown', this.handleMousedown)
        this.$el.addEventListener('mouseup', this.handleMouseup)
        this.$el.addEventListener('mousemove', this.handleMousemove)
      }
    }

    this.$nextTick(() => {
      this.setSlideWidth()
    })
  },
  destroyed () {
    if (!this.$isServer) {
      window.removeEventListener('resize', this.setSlideWidth)
      if ('ontouchstart' in window) {
        this.$el.removeEventListener('touchmove', this.handleMousemove)
      } else {
        this.$el.removeEventListener('mousemove', this.handleMousemove)
      }
    }
  }
}
</script>
<style scoped>
.slider_time {
  background-color: #d1d0de;
  display: block;
  overflow: hidden; /* only one item at time will be visible */
  height: 50px;
  margin: 0 auto;
  padding: 0px;
}

.programs-schedule .slider_time ul {
  text-align: center;
  width: 7200px;
  height: 50px;
  white-space: nowrap;
  /* For WebKit implementations, provide inertia scrolling */
  -webkit-overflow-scrolling: touch;
  list-style: none;
  margin: 0px;
  padding: 0px;
}

.programs-schedule .slider_time ul li {
  float: left;
  list-style: none;
  width: 300px;
  height: 100%;
  margin: 0px;
  font-family: "OnSport";
  font-size: 21px;
  cursor: pointer;
  position: static;
  border-top: none;
  /* border-left: 1px solid #716c83;
  border-right: 1px solid #716c83; */
}
.day_table {
  background-color: #ffffff;
  width: 100%;
  border-collapse: collapse;
  padding: 0;
}
.day_item_selected a,
.day_item1_selected a {
  color: #ffffff;
}
.item-timer {
  color: #3c3f3d;
  text-align: center;
  outline: none;
  cursor: pointer;
  font-family: "OnSport", sans-serif;
  font-size: 17px;
  font-style: normal;
  font-variant: normal;
  color: #3c323f;
  height: 100%;
  padding-top: 12px;
}
.item-timer-selected {
  color: #ffffff;
  background-color: #716c83 !important;
  text-align: center;
  outline: none;
  cursor: pointer;
  font-size: 21px;
  height: 100%;
  padding-top: 10px;
}
@media (min-width: 0px) {
  .slider_time {
    background-color: #d1d0de;
    display: block;
    overflow: hidden; /* only one item at time will be visible */
    height: 50px;
    margin: 0 auto;
    padding: 0px;
  }

  .slider_time ul {
    height: 50px;
  }

  .slider_time ul li {
    float: left;
    list-style: none;
    width: 106px;
    margin: 0px;
    font-family: "Open Sans";
    cursor: pointer;
  }
  .day_item_selected {
    color: #ffffff;
    background-color: #716c83;
    text-align: center;
    outline: none;
    cursor: pointer;
    font-family: "OnSport", sans-serif;
    font-size: 18px;
    font-style: normal;
    font-variant: normal;
    height: 30px;
    display: inline-block;
    position: relative;
    padding-top: 5px;
  }
  .day_item1_selected {
    color: #ffffff;
    background-color: #716c83;
    text-align: center;
    outline: none;
    cursor: pointer;
    font-family: "OnSport", sans-serif;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    height: 35px;
    display: inline-block;
    position: relative;
    top: 0px;
    line-height: 1em;
  }
  .day_item {
    color: #3c3f3d;
    background-color: #ffffff;
    text-align: center;
    outline: none;
    cursor: pointer;
    font-family: "OnSport", sans-serif;
    font-size: 18px;
    font-style: normal;
    font-variant: normal;
    height: 30px;
    display: inline-block;
    position: relative;
    padding-top: 5px;
  }
  .day_item1 {
    color: #3c3f3d;
    background-color: #ffffff;
    text-align: center;
    outline: none;
    cursor: pointer;
    font-family: "OnSport", sans-serif;
    font-size: 24px;
    font-style: normal;
    font-variant: normal;
    height: 35px;
    display: inline-block;
    position: relative;
    top: 0px;
    line-height: 1em;
  }
}

.onsports-program {
  position: relative;
  width: 100%;
  border-right: 1px solid #b4b4b4;
  overflow: hidden;
  cursor: pointer;
}
.programs-schedule {
  overflow: hidden;
  position: relative;
}
.programs-schedule ul {
  position: relative;
  top: 0;
  left: 0;
  overflow: hidden;
  height: 112px;
  width: 7200px;
  /* For WebKit implementations, provide inertia scrolling */
  -webkit-overflow-scrolling: touch;
  /* width: 1000%; 
  border-bottom: 1px solid #b4b4b4; */
  padding-left: 10%;
  background-color: #e4e4e4;
}
.programs-schedule ul li {
  position: absolute;
  top: 0;
  left: 0;
  width: 600px;
  height: 110px;
  border-top: 1px solid #fff;
  background-repeat: repeat-y;
  overflow: hidden;
  background-color: #e4e4e4;
}
.programs-schedule ul li.swiper-slide-1 {
  width: 300px;
}
.programs-schedule ul li.swiper-slide-2 {
  width: 480px;
}
.programs-schedule ul li p {
  margin: 0;
  color: #000;
  padding: 0 5px;
  text-align: left;
  overflow: hidden;
  line-height: 14px;
}
.programs-schedule ul li div.program-wrapper {
  position: relative;
  height: 110px;
  margin: 0 1px;
  background-color: #fff;
}
.programs-schedule ul li p.sub-genre {
  font-size: 10px;
  padding: 10px;
  line-height: 10px;
}
.programs-schedule ul li p.programme {
  color: #3a577f;
  font-weight: bold;
  max-height: 44px;
  line-height: 22px;
  font-size: 19px;
  font-style: normal;
  font-variant: normal;
  color: #666666;
  padding-left: 10px;
  white-space: pre-line;
  word-wrap: break-word;
}

.swiper-button-next.swiper-button-disabled,
.swiper-button-prev.swiper-button-disabled {
  opacity: 1;
  cursor: pointer;
  pointer-events: auto;
}
/* style left sidebar */
.left-sidebar-content li {
  background-color: #e4e4e4;
}
.left-sidebar-content li div.channel {
  position: relative;
  height: 110px;
  margin-bottom: 2px;
  background-color: #fff;
}
</style>
<style scoped>
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.centered {
  width: 45%;
  height: auto;
}
</style>
