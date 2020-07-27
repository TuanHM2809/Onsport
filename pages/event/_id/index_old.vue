<template>
  <div v-if="event">
    <div class="module root" :class="{dark: theme ==='dark'}">
      <div class="container">
        <div class="media-event">
          <div v-if="!isAuthenticated && event.login_required" class="media-wrapper">
            <div class="row">
              <div class="col-xs-12" style="padding-bottom: 56.25%; position:relative;">
                <div class="notify center-block">
                  <p>Vui lòng đăng nhập để xem nội dung</p>
                  <button @click.prevent="login()" class="btn btn-danger">Đăng nhập</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="media-wrapper">
            <div class="row">
              <div v-if="isComing(event) && showCountdown" class="col-lg-12" style="padding-bottom: 56.25%; position:relative;">
                <div class="center-block notify" style="font-size: 14px;text-align: center;">
                  <span v-if="event.start_at">
                    Sự kiện sẽ bắt đầu sau:
                  </span>
                  <Countdown v-if="event && event.start_at" :deadline="startAtToDate(event.start_at)" @reachEnd="hideCountdown"></Countdown>
                  <!--<p>-->
                  <!--<router-link class="btn clip-btn-4" to="/goi-dich-vu" tag="button">Mua gói dịch vụ-->
                  <!--</router-link>-->
                  <!--</p>-->
                </div>
              </div>
              <player v-else-if="event.link" class="vjs-custom-skin" ref="eventPlayer" :options="playerOptions"></player>
              <div v-else class="col-xs-12" style="padding-bottom: 56.25%; position:relative;">
                <div class="notify center-block" v-if="!$store.getters.isAuthenticated">
                  <p>Vui lòng đăng nhập để xem nội dung</p>
                  <button @click.prevent="login()" class="btn btn-danger">Đăng nhập</button>
                </div>
                <div class="notify center-block" v-else>
                  <p>Kênh đang gián đoạn. Vui lòng thử lại sau</p>
                </div>
              </div>
            </div>
          </div>
          <div class="info-wrapper">
            <h1 class="media__event-headline" v-if="event.name">{{ event.name}}</h1>
            <div class="media__event-description text-justify" v-if="event.description">{{ event.description}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module" style="background-color: #fafafa;">
      <div class="container">
        <div class="row">
          <block-title title="Bình luận" />
          <comment-box :itemId="event.id" :itemType="event.type" />
        </div>
      </div>
    </div>
    <div class="module" v-if="event && event.related">
      <div class="container">
        <block-title :arrow="false" title="Sự kiện khác" />
        <div v-if="event.related" class="relate">
          <div class="columns">
            <vertical-item class="column" v-for="relate in event.related" :key="relate.id" :data="relate" />
          </div>
        </div>
      </div>
    </div>

    <share-box />
    <!--<popup v-show="isIos" />-->
  </div>
</template>


<script>
  import player from '~/components/frontend/common/player.vue'
  import CateTitle from '~/components/frontend/common/cate-title.vue'
  import BlockTitle from '~/components/frontend/common/block-title.vue'
  import VerticalItem from '~/components/frontend/common/vertical-item.vue'
  import TagList from '~/components/frontend/posts/tag.vue'
  import Countdown from '~/components/frontend/common/countdown.vue'
  import moment from 'moment'
  import UAParser from '~/utils/ua-parse'
  import Popup from '~/components/frontend/event/popup.vue'
  import socketMixins from '~/mixins/socket.io'
  require('videojs-youtube')

export default {
    name: 'event_id',
    layout: 'default',
    mixins: [socketMixins],
    async asyncData ({app, params, error, userAgent}) {
      try {
        // console.log(req.headers['user-agent'])

        let isIos = false
        if (userAgent) {
          isIos = UAParser(userAgent).isIos
        }
  
        const response = await app.$axios.$get(`/events/${params.id}`)
        if (response.code === 0) {
          return {event: response.data, isIos}
        } else {
          error({ statusCode: 404, message: 'Sự kiện không tồn tại' })
        }
      } catch (e) {
        console.log(e)
      }
    },
    validate ({ params }) {
      return (!!params.id)
    },
    head () {
      const event = this.event
      const testHttpLink = (link) => {
        const pattern = new RegExp('^(http|https)')
        return pattern.test(link)
      }

      const generateLink = (link) => {
        if (testHttpLink(link)) {
          return link
        } else {
          return encodeURI(`${process.env.controlUrl}${link}`)
        }
      }
      return {
        title: event ? event.name : 'OnSports',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: (event && event.name ? event.name : '') || ''
          },
          { hid: 'description', name: 'description', content: event && event.description ? event.name + ' ' + event.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:title', property: 'og:title', content: event && event.name ? event.name : '' },
          { hid: 'og:type', property: 'og:type', content: 'video.other' },
          { hid: 'og:description', property: 'og:description', content: event && event.description ? event.name + ' ' + event.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:image', property: 'og:image', content: event && event.thumbnail ? generateLink(event.thumbnail) : '' },
          { hid: 'og:image:alt', property: 'og:image:alt', content: event && event.description ? event.name + ' ' + event.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:image:width', property: 'og:image:width', content: '512' },
          { hid: 'og:image:height', property: 'og:image:height', content: '288' },
          { hid: 'og:url', property: 'og:url', content: 'http://onsports.vn/post/' + event.slug },
          { hid: 'al:ios:app_store_id', property: 'al:ios:app_store_id', content: '1282845933' },
          { hid: 'al:ios:app_name', property: 'al:ios:app_name', content: 'ON Sports' },
          { hid: 'al:ios:url', property: 'al:ios:url', content: 'onsports://event/' + event.slug },
          { hid: 'al:web:should_fallback', content: 'false' },
          {hid: 'al:android:url', property: 'al:android:url', content: 'onsports://event/' + event.slug},
          {hid: 'al:android:package', property: 'al:android:package', content: 'com.vtvcab.onsports'},
          {hid: 'al:android:app_name', property: 'al:android:app_name', content: 'ON Sports'}
        ]
      }
    },
    data () {
      return {
        theme: 'light',
        showCountdown: true,
        playerOptions: {
          muted: false,
          autoplay: true,
          aspectRatio: '16:9',
          sources: []
        }
      }
    },
    computed: {
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      }
    },
    created () {
    },
    mounted () {
      this.setup()
    },
    beforeDestroy () {},
    methods: {
      async fetchData () {
        try {
          const response = await this.$axios.$get(`/events/${this.$route.params.id}`)
          if (response.code === 0) {
            this.event = response.data
          } else {
            this.$toast.error(response.message)
          }
        } catch (e) {
          console.log(e)
        }
      },
      startAtToDate (start_at) {
        return moment.utc(start_at).subtract(7, 'hour').format('X')
      },
      isComing (event) {
        const now = moment()
        const startAt = moment.utc(event.start_at)
        return now.isSameOrBefore(startAt)
      },
      hideCountdown () {
        this.showCountdown = false
      },
      setupNew () {
        if (this.event && this.event.link) {
          if (this.event.link_type === 'STREAM') { // link stream thi xu ly nhu binh thuong
            this.playerOptions = Object.assign(this.playerOptions, {
              sources: [
                {
                  type: 'application/x-mpegURL',
                  src: this.event.link
                }
              ]
            }, this.isIos
              ? {
                html5: {
                  nativeAudioTracks: false,
                  nativeVideoTracks: false,
                  hls: {
                    debug: true,
                    overrideNative: true
                  }
                }} : {})
          } else {
            // link video chia lam 2 loai
            // th1: link m3u8 --> xu ly qua cdn roi
            if (this.event.fullUrl.includes('m3u8')) {
              this.playerOptions = Object.assign(this.playerOptions, {
                sources: [
                  {
                    type: 'application/x-mpegURL',
                    src: this.event.fullUrl
                  }
                ]
              }, this.isIos
                ? {
                  html5: {
                    nativeAudioTracks: false,
                    nativeVideoTracks: false,
                    hls: {
                      debug: true,
                      overrideNative: false
                    }
                  }} : {})
            } else {
              // link mp4 ben ngoai
              this.playerOptions = Object.assign(this.playerOptions, {
                sources: [
                  {
                    type: 'video/mp4',
                    src: this.event.fullUrl
                  }
                ]
              })
            }
          }
        }
      },
      setup () {
        if (this.event && this.event.link) { // co link
          switch (this.event.link_type) {
            case 'YOUTUBE':
              const pattenrYoutube = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
              if (this.event.link.match(pattenrYoutube)) {
                this.playerOptions = Object.assign(this.playerOptions, {
                  sources: [
                    {
                      type: 'video/youtube',
                      src: this.event.link ? this.event.link : ''
                    }
                  ],
                  techOrder: ['youtube'],
                  autoplay: false,
                  controls: false,
                  youtube: {
                    ytControls: 2,
                    customVars: {
                      wmode: 'transparent'
                    }
                  }
                })
              }

              break
            case 'STREAM':
            case 'VIDEO':
            default:
              // video va stream setup nhu nhau vi deu chuyen sang

              if (this.isHttpLink(this.event.link)) { // kiem tra link http
                let isControlLink = '://control.onsports.vn'
                if (this.event.link.includes(isControlLink)) { // link http tu trang control
                  // change control to static

                  if (this.event.link.includes('https')) {
                    this.event.link = this.event.link.replace('https://control', 'http://static') + '/playlist.m3u8'
                  } else {
                    this.event.link = this.event.link.replace('control', 'static') + '/playlist.m3u8'
                  }

                  this.playerOptions = Object.assign(this.playerOptions, {
                    sources: [
                      {
                        type: 'application/x-mpegURL',
                        src: this.event.link
                      }
                    ]
                  }, this.isIos
                    ? {
                      html5: {
                        nativeAudioTracks: false,
                        nativeVideoTracks: false,
                        hls: {
                          debug: true,
                          overrideNative: true
                        }
                      }} : {})
                } else { // link http tu nguon be ngoi
                  this.playerOptions = Object.assign(this.playerOptions, {
                    sources: [
                      {
                        type: this.event.link_type === 'VIDEO' ? 'video/mp4' : 'application/x-mpegURL',
                        src: this.event.link ? this.event.link : ''
                      }
                    ]
                  })
                }
                // co 2 kieu. 1 la video ngoai 2 la video trong control
              } else {
                this.playerOptions = Object.assign(this.playerOptions, {
                  sources: [
                    {
                      type: 'application/x-mpegURL',
                      src: this.event.link ? `${process.env.controlUrl}${this.event.link}/playlist.m3u8` : ''
                    }
                  ]
                })
              }

              // 2 truong hop - 1:video ben ngoai & 2 video lay tu nas
              break
          }
        }
      },
      isHttpLink (link) {
        const pattern = new RegExp('^(http|https)')
        return pattern.test(link)
      }
    },
    watch: {
      isAuthenticated (newValue) {
        if (newValue !== null) {
          this.fetchData()
        }
      },
      event () {
        this.setup()
      }
    },
    components: {
      CateTitle,
      BlockTitle,
      VerticalItem,
      TagList,
      player,
      Countdown,
      Popup
    }
  }
</script>

<style scoped>
.media-wrapper {
  padding-bottom: 0px;
  position: relative;
  overflow: hidden;
  background: transparent;
  margin: 0 0 10px;
}

.info-wrapper {
  margin: 0 auto 20px;
  display: block;
  overflow: hidden;
  color: #404040;
}

.dark .info-wrapper {
  color: #fefefe;
}

.info-wrapper > h2 {
  margin-bottom: 15px;
  
  font-weight: 300;
  text-align: justify;
  -webkit-font-smoothing: antialiased;
  font-size: 28px;
  line-height: 1.133;
}

.info-wrapper > h1 {
  margin-bottom: 15px;
  
  font-weight: 300;
  text-align: justify;
  -webkit-font-smoothing: antialiased;
  font-size: 28px;
  line-height: 1.133;
}

div.tag-list {
  margin: 0 auto;
  clear: both;
}
.relate {
  width: 100%;
}
.notify {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  color: #fff
}

.columns {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}
.columns:not(:last-child) {
  margin-bottom: calc(1.5rem - 0.75rem);
}
.column {
  display: block;
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -ms-flex-negative: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}
.column {
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  width: 50%;
}
@media (max-width: 991px) and (min-width: 640px) {
  .column {
    width: 33.33%;
  }
}
@media (max-width: 640px) {
  .info-wrapper > h2 {
    font-size: 24px;
  }
  .info-wrapper > h1 {
    font-size: 24px;
  }
}

@media screen and (min-width: 992px) {
  .column {
    width: 25%;
  }
  .media-event {
    padding-right: 320px;
  }
  .media-event .media-wrapper {
    float: left;
    width: 100%;
    overflow: hidden;
  }
  .info-wrapper {
    float: right;
    margin-right: -320px;
    width: 300px;
  }
}
@media screen and (min-width: 1400px) {
  .module.root > .container {
    padding-top: 25px;
  }
}
</style>
