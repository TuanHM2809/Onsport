<template>
  <div>
    <div class="module p-t-30 " :class="{dark: theme ==='dark'}">
      <div class="container">
          <div class="media-wrapper" v-if="channel && channel.link">
            <transition name="module" mode="out-in">
              <div class="row">
                <div class="col-sm-8  p-l-0 p-r-0">
                  <player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions"></player>
                </div>
                <div class="col-sm-4  p-r-0">
                  <epg :schedules="channel.schedules" :height="playerHeight" @catchup="setupCatchup" />
                </div>
              </div>
            </transition>
          </div>
          <div v-else class="media-wrapper">
            <div class="row">
              <div class="col-sm-8  p-l-0 p-r-0">
                
                  <div class="col-xs-12 setbackground" style="padding-bottom: 56.25%; position:relative;">
                    <div class="notify center-block" v-if="!$store.getters.isAuthenticated">
                      <p>Vui lòng đăng nhập để xem nội dung</p>
                      <button @click.prevent="login()" class="btn btn-danger">Đăng nhập</button>
                    </div>
                    <div class="notify center-block" v-else>
                      <p>Kênh đang gián đoạn. Vui lòng thử lại sau</p>
                    </div>
                  </div>
                
              </div>
              <div class="col-sm-4 p-l-0 p-r-0">
                <epg :schedules="channel.schedules" :height="playerHeight" @catchup="setupCatchup" />
              </div>
            </div>
          </div>
          <div class="info-wrapper">
            <h2 v-if="channel.display_name" class="media__video-headline">{{ channel.display_name}}</h2>
            <div class="media__video-description" v-if="channel.description">
              <div v-html="channel.display_name"></div>
            </div>
          </div>
      </div>
      <div class="module">
        <div class="container">
          <div class="columns" v-if="channels && channels.length > 0">
            <div class="column" v-for="item in channels" :key="item.id">
              <nuxt-link :to="handleLink({item_type: 'live_channels', id: item.slug})">
                <img class="center-block" width="48" height="48" :src="buildThumb(item.thumbnail, true)" :alt="item.name" />
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
      <div class="module" :class="{dark: theme ==='dark'}" style="background-color: #fafafa;">
        <div class="container">
          <div class="row">
            <!--<div v-bind:data-href="'http://onsports.vn/livechannel/'+channel.slug" class="fb-comments" data-width="100%" data-numposts="10"></div>-->
            <block-title :title="'Bình Luận'" />
            <comment-box :itemId="channel.id" itemType="liveChannel" />
          </div>
        </div>
      </div>
      <share-box />
      <!--<popup v-show="isIos" />-->
    </div>
  </div>
</template>


<script>
  import {
    slugify
  } from '~/utils'
  import player from '~/components/frontend/common/player.vue'
  import epg from '~/components/frontend/livechannel/epg.vue'
  import apiConfig from '~/api.config.js'
  import BlockTitle from '~/components/frontend/common/block-title.vue'
  import VerticalItem from '~/components/frontend/common/vertical-item.vue'
  import {debounce} from 'lodash'
  import UAParser from '~/utils/ua-parse'
  import Popup from '~/components/frontend/event/popup.vue'
  import socketMixins from '~/mixins/socket.io'

  export default {
    layout: 'default',
    name: 'LiveChannel',
    mixins: [socketMixins],
    async fetch ({store, params, error, userAgent}) {
      try {
        await Promise.all([
          store.dispatch('loadChannel', params)
        ])
        // console.log(store.state.pundit.detail.data)
        if (Object.keys(store.state.livechannel.detail.data).length === 0) {
          error({statusCode: 404, message: 'Trang không tồn tại'})
        }
      } catch (e) {
        error({statusCode: 404, message: e})
      }
    },
    asyncData ({userAgent}) {
      let isIos = false
      if (userAgent) {
        isIos = UAParser(userAgent).isIos
      }
      return {isIos}
    },
    head () {
      const channel = this.channel
      return {
        title: channel && channel.display_name ? channel.display_name : 'OnSports',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: (channel && channel.tags ? channel.tags.join(',') : '') || ''
          },
          { hid: 'description', name: 'description', content: channel && channel.description ? channel.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:title', property: 'og:title', content: channel && channel.display_name ? channel.display_name : '' },
          { hid: 'og:description', property: 'og:description', content: channel && channel.description ? channel.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:image', property: 'og:image', content: channel && channel.thumbnail ? encodeURI(`${process.env.controlUrl}/${channel.thumbnail}`) : '' },
          { hid: 'og:image:alt', property: 'og:image:alt', content: channel && channel.description ? channel.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:image:width', property: 'og:image:width', content: '512' },
          { hid: 'og:image:height', property: 'og:image:height', content: '288' },
          { hid: 'og:url', property: 'og:url', content: 'http://onsports.vn/livechannel/' + channel.slug },
          { hid: 'al:ios:app_store_id', property: 'al:ios:app_store_id', content: '1282845933' },
          { hid: 'al:ios:app_name', property: 'al:ios:app_name', content: 'ON Sports' },
          { hid: 'al:ios:url', property: 'al:ios:url', content: 'onsports://livechannel/' + channel.slug },
          { hid: 'al:web:should_fallback', content: 'false' },
          {hid: 'al:android:url', property: 'al:android:url', content: 'onsports://livechannel/' + channel.slug},
          {hid: 'al:android:package', property: 'al:android:package', content: 'com.vtvcab.onsports'},
          {hid: 'al:android:app_name', property: 'al:android:app_name', content: 'ON Sports'}

        ]
      }
    },
    data () {
      return {
        theme: 'light',
        playerHeight: 371,
        playerOptions: {
          muted: false,
          autoplay: true,
          aspectRatio: '16:9'
        },
        hls: {
          withCredentials: true
        },
        isIos: false
      }
    },
    computed: {
      channel () {
        return this.$store.state.livechannel.detail.data
      },
      channels () {
        return this.$store.state.livechannel.total.data
      },
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      },
      fetching () {
        return this.$store.state.livechannel.fetching
      }
    },
    created () {
      this.$store.dispatch('loadChannels', this.$route.params)
      this.setup()
    },
    mounted () {
      if (this.channel && this.channel.link) {
        window.addEventListener('resize', debounce(this.setPlayerHeight, 50))
        this.setPlayerHeight()
      }
      window.FB.XFBML.parse();
    },
    beforeDestroy () {
      window.removeEventListener('resize', this.setPlayerHeight)
    },
    methods: {
      slug (name) {
        return slugify(name)
      },
      setPlayerHeight () {
        this.playerHeight = this.$refs.videoPlayer.$el.getBoundingClientRect().height
      },
      testHttpLink (link) {
        const pattern = new RegExp('^(http|https)')
        return pattern.test(link)
      },
      buildThumb (image, hq = false) {
        let width = 10
        if (hq) { width = this.hd ? 1920 : 1200 }
        if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
        if (typeof image === 'undefined') return `/loading.png`
        return this.testHttpLink(image) ? `${apiConfig.cdnUrl}/?url=${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}` : `${apiConfig.cdnUrl}/?url=https%3A%2F%2Fcontrol.onsports.vn%2F${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}`
      },
      setup () {
        if (this.channel && this.channel.link) {
          if (this.testHttpLink(this.channel.link)) {
            this.playerOptions = Object.assign(this.playerOptions, {
              // poster: this.video.thumbnail || '',
              sources: [
                {
                  type: 'application/x-mpegURL',
                  src: this.channel.link ? this.channel.link : ''
                }
              ]
            }, this.isIos
              ? {
                html5: {
                  nativeAudioTracks: false,
                  nativeVideoTracks: false,
                  hls: {
                    overrideNative: true
                  }
                }
              } : {})
          } else {
            this.playerOptions = Object.assign(this.playerOptions, {
              // poster: this.video.thumbnail || '',
              sources: [
                {
                  type: 'application/x-mpegURL',
                  src: this.channel.link ? `${process.env.controlUrl}${this.channel.link}` : ''
                }
              ]
            }, this.isIos
              ? {
                html5: {
                  nativeAudioTracks: false,
                  nativeVideoTracks: false,
                  hls: {
                    overrideNative: true
                  }
                }
              } : {})
          }
        }
      },
      setupCatchup (time) {
        const {startTime, stopTime} = time
        if (this.channel && this.channel.link) {
          if (this.testHttpLink(this.channel.link)) {
            this.playerOptions = Object.assign(this.playerOptions, {
              // poster: this.video.thumbnail || '',
              sources: [
                {
                  type: 'application/x-mpegURL',
                  src: this.channel.link ? `${this.channel.link}&startTime=${startTime}&stopTime=${stopTime}` : ''
                }
              ]
            }, this.isIos
              ? {
                html5: {
                  nativeAudioTracks: false,
                  nativeVideoTracks: false,
                  hls: {
                    overrideNative: true
                  }
                }
              } : {})
          } else {
            this.playerOptions = Object.assign(this.playerOptions, {
              // poster: this.video.thumbnail || '',
              sources: [
                {
                  type: 'application/x-mpegURL',
                  src: this.channel.link ? `${process.env.controlUrl}${this.channel.link}&startTime=${startTime}&stopTime=${stopTime}` : ''
                }
              ]
            }, this.isIos
              ? {
                html5: {
                  nativeAudioTracks: false,
                  nativeVideoTracks: false,
                  hls: {
                    overrideNative: true
                  }
                }
              } : {})
          }
        }
      }
    },
    watch: {
      isAuthenticated (newValue, oldValue) {
        if (newValue !== null) {
          this.$store.dispatch('loadChannel', this.$route.params)
        }
      },
      channel (newValue) {
        if (this.fetching === false) {
          this.setup()
        }
      }
    },
    components: {
      epg,
      player,
      BlockTitle,
      VerticalItem,
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
  font-family: "OnSport", sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  font-size: 30px;
  line-height: 1.133;
}

.media__video-description.media__video-description--inline {
  font-family: "OnSport", sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  font-size: 24px;
  font-size: 1.2rem;
  display: inline;
  margin-right: 5px;
  line-height: 1.6666666667;
}

.video__metadata__source-name {
  font-family: "OnSport", sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  font-size: 24px;
  font-size: 1.2rem;
  line-height: 1.6666666667;
  display: inline;
}
.next-day,
.pre-day {
  position: absolute;
  top: 31px;
  font-weight: 700;
  height: 30px;
}
.pre-day {
  color: #fff;
  left: 15px;
  width: 25px;
  padding: 5px 0 0 7px;
  cursor: pointer;
}
.next-day {
  color: #fff;
  width: 20px;
  right: 5px;
  padding: 5px 0 0 10px;
}
.notify {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  color: #fff;
}
@media (max-width: 767px) {
  .media-wrapper .col-sm-4 {
    padding-left: 0;
  }
}
</style>
<style>
.video-player-box .video-js {
  width: 100%;
  height: auto;
  padding-bottom: 56.25%;
}
</style>
<style scoped>
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
@media screen and (max-width: 640px) {
  .column.is-two-third {
    flex: 1;
  }
  .column.is-one-third {
    flex: 1;
  }
  #recent-news .large-post .title {
    position: static;
    padding: 7px 0px;
  }
}
@media screen and (min-width: 641px) {
  .column.is-two-third {
    flex: 2;
  }
  .column.is-one-third {
    flex: 1;
  }
  .column.is-narrow {
    flex: none;
  }
}
</style>

