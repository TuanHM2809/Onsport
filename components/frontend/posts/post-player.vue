<template>
  <div class="vjs-custom-skin video-player post-player m-t-10 m-b-10" :style="setWidth">
    <video class="video-js"></video>
    <p v-if="title" class="videocaption">{{ title}}</p>
  </div>
</template>

<script>
// import '~/assets/css/custom-videojs.css'
import videojs from 'video.js'
// import {debounce} from 'lodash'

// import 'videojs-contrib-hls'
// import 'imports-loader?global=>undefined!videojs-contrib-hls'

export default {
  name: 'video-player',
  props: {
    options: {
      type: Object,
      required: false
    },
    fileId: {
      required: true
    },
    start: {
      type: Number,
      default: function () {
        return 0
      }
    },
    width: {
      required: false
    },
    height: {
      required: false
    },
    playsinline: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    customEventName: {
      type: String,
      default: function () {
        return 'statechanged'
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selfOptions: {
        // width: 640,
        resizeManager: false,
        sources: [{
          type: 'video/mp4',
          src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm'
        }]
      },
      sticky: false,
      top: null,
      offset: null
    }
  },
  computed: {
    setWidth () {
      if (this.width) {
        return {
          width: this.width + 'px'
        }
      } else {
        return {}
      }
    }
  },
  mounted: function () {
    require('!!videojs-contrib-hls')
    if (!this.player) {
      // this.initializeVideo()
      this.reload()
    }
  },
  beforeDestroy: function () {
    if (this.player) {
      this.dispose()
    }
  },
  methods: {
    async reload () {
      if (this.player) {
        this.dispose()
      }
      await this.getLink()
      this.initializeVideo()
    },
    initializeVideo: function () {
      // init
      var self = this
      this.player = null
      // videojs options
      var videoOptions = Object.assign({
        autoplay: false,
        controls: true,
        preload: 'auto',
        fluid: true,
        muted: false,
        width: this.width ? this.width : '100%',
        controlBar: {
          remainingTimeDisplay: true,
          playToggle: {},
          progressControl: {},
          fullscreenToggle: {},
          volumeMenuButton: {
            inline: false,
            vertical: true
          }
        },
        techOrder: ['html5'],
        plugins: {}
      }, this.selfOptions)
      // check sources
      /*
        if (!videoOptions.sources || !videoOptions.sources.length) {
          console.warn('Missing required option: "sources".')
          return false
        }
        */
      // ios fullscreen
      var playsinline = this.playsinline
      if (playsinline) {
        this.$el.children[0].setAttribute('playsinline', playsinline)
        this.$el.children[0].setAttribute('webkit-playsinline', playsinline)
      }
      // emit event
      var emitPlayerState = function (event, value) {
        if (event) {
          self.$emit(event, self.player)
        }
        if (value) {
          var values = {}
          values[event] = value
          self.$emit(self.customEventName, values)
        }
      }
      // videoOptions
      // console.log(videoOptions)
      // avoid error "VIDEOJS: ERROR: Unable to find plugin: __ob__"
      if (videoOptions.plugins) {
        delete videoOptions.plugins.__ob__
      }

      this.player = videojs(this.$el.children[0], videoOptions, function () {
        // player readied
        var _this = this
        self.$emit('ready', self.player)
        // events
        var events = ['loadeddata',
          'canplay',
          'canplaythrough',
          'play',
          'pause',
          'waiting',
          'playing',
          'ended',
          'error']
        for (var i = 0; i < events.length; i++) {
          (function (event) {
            _this.on(event, function () {
              emitPlayerState(event, true)
            })
          })(events[i])
        }
        this.on('timeupdate', function () {
          emitPlayerState('timeupdate', this.currentTime())
        })
        this.on('mouseout', function () {
          this.controlBar.addClass('vjs-fade-out')
        })

        this.on('mouseover', function () {
          this.controlBar.removeClass('vjs-fade-out')
        })
      })
    },
    dispose: function () {
      if (this.player && videojs) {
        if (this.player.techName_ !== 'Flash') {
          this.player.pause && this.player.pause()
        }
        videojs(this.$el.children[0]).dispose()
        if (!this.$el.children.length) {
          var video = document.createElement('video')
          video.className = 'video-js'
          this.$el.appendChild(video)
        }
        this.player = null
      }
    },
    async getLink () {
      if (this.fileId) {
        try {
          const response = await this.$axios.$get(`/videos/${this.fileId}`)
          if (response.code === 0) {
            const {data} = response
            console.log(data)
            if (data && data.url) {
              const url = data.fullUrl ? data.fullUrl : data.url
              // console.log(url)
              if (url.trim().includes('m3u8')) {
                this.playerOptions = Object.assign(this.selfOptions, {
                  sources: [
                    {
                      type: 'application/x-mpegURL',
                      src: url || ''
                    }
                  ],
                  poster: data.thumbnail ? `${process.env.controlUrl}${data.thumbnail}` : ''
                })
              } else {
                this.selfOptions = Object.assign(this.selfOptions, {
                  sources: [{
                    type: 'video/mp4',
                    src: url
                  }],
                  poster: data.thumbnail ? `${process.env.controlUrl}${data.thumbnail}` : ''
                })
              }
            }
          } else {
            this.$toast.error(response.message)
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    isHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    }
  },
  watch: {
    // options: {
    //   deep: true,
    //   handler: function (options, oldOptions) {
    //     this.dispose()
    //     if (options && options.sources && options.sources.length) {
    //       this.initializeVideo()
    //     }
    //   }
    // },
    fileId: {
      handler: async function (fileId, oldFileId) {
        this.reload()
      }
    }
  }
}
</script>
<style>
.vjs-fade-out {
  display: block !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
</style>

<style scoped>
.video-js .vjs-big-play-button {
  background-color: rgba(0, 0, 0, 0.45);
  font-size: 3.5em;
  border-radius: 50%;
  width: 2em !important;
  height: 2em !important;
  line-height: 2em !important;
  margin-top: -1em !important;
  margin-left: -1em !important;
}
/* custom */
.video-player.left {
  float: left;
}

.content-media--video {
  background-color: #ddd;
  display: block;
  position: relative;
  padding: 0 0 56.25% 0;
}
.content-media--video video {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.content-media__object {
  transition: width 0.2s ease-in-out, height 0.2s ease-in-out,
    transform 0.38s ease-in-out;
}
/** Use .sticky */
.content-media__object.is-sticky {
  position: fixed;
  top: 15px;
  right: 100px;
  left: auto;
  max-width: 280px;
  max-height: 158px;
  width: 280px;
  height: 158px;
  z-index: 100;
}

.videocaption {
  max-width: 910px;
  margin: 0 auto;
  font-weight: 400;
  line-height: 1.333;
  background-color: #eee;
  text-align: center;
  padding: 7.5px;
  font-size: 15px;
}

@media screen and (max-width: 640px) {
  .videocaption {
    font-size: 12px;
  }
}
@media screen and (min-width: 1120px) {
  #featured-video.is-sticky {
    transform: translateX(-80%);
  }
}
@media screen and (min-width: 1300px) {
  #featured-video.is-sticky {
    transform: translateX(-115%);
  }
}
</style>
