<template>

  <div class="video-player">
    <video class="video-js"></video>
  </div>

</template>

<script>
import videojs from 'video.js'
import {mapState} from 'vuex'
// import 'videojs-contrib-hls'
// import 'imports-loader?global=>undefined!videojs-contrib-hls'

const Plugin = videojs.getPlugin('plugin')

class WaterMark extends Plugin {
  constructor (player, options) {
    super(player, options)

    var defaults = {
      xpos: 0,
      ypos: 0,
      opacity: 100,
      clickable: false,
      url: '',
      className: 'vjs-watermark',
      text: false,
      debug: true
    }

    options = Object.assign(defaults, options)

    let div = document.createElement('div')
    div.className = options.className

    // if else cac options
    if (options.text) {
      div.textContent = options.text
    }
    if ((options.ypos === 0) && (options.xpos === 0)) // Top left
    {
      div.style.top = '0'
      div.style.left = '0'
    } else if ((options.ypos === 0) && (options.xpos === 100)) // Top right
    {
      div.style.top = '0'
      div.style.right = '0'
    } else if ((options.ypos === 100) && (options.xpos === 100)) // Bottom right
    {
      div.style.bottom = '0'
      div.style.right = '0'
    } else if ((options.ypos === 100) && (options.xpos === 0)) // Bottom left
    {
      div.style.bottom = '0'
      div.style.left = '0'
    } else if ((options.ypos === 50) && (options.xpos === 50)) // Center
    {
      if (options.debug) console.log('watermark: player:' + player.width + 'x' + player.height)
      div.style.top = (player.height() / 2) + 'px'
      div.style.left = (player.width() / 2) + 'px'
    } else {
      div.style.top = options.ypos + '%'
      div.style.left = options.xpos + '%'
    }

    div.style.opacity = options.opacity

    player.el().appendChild(div)

    // if (options.clickable && options.url !== '') {
    //   link = document.createElement('a')
    //   link.href = options.url
    //   link.target = '_blank'
    //   link.appendChild(div)
    //   //add clickable watermark to the player
    //   this.player.appendChild(link)
    // } else {
    //   //add normal watermark to the player
    //   this.player.appendChild(div)
    // }

    player.on('playing', function () {
      videojs.log('playback began!')
    })
  }
  dispose () {
    super.dispose()
    videojs.log('the advanced plugin is being disposed')
  }

  updateState () {
    this.setState({playing: !this.player.paused()})
  }

  logState (changed) {
    videojs.log(`the player is now ${this.state.playing ? 'playing' : 'paused'}`)
  }
}
class HideYoutubeLogo extends Plugin {
  constructor (player, options) {
    super(player, options)

    var defaults = {
      url: '',
      className: 'vjs-hide-youtube',
      debug: true
    }

    options = Object.assign(defaults, options)

    let div = document.createElement('div')
    div.className = options.className

    player.el().appendChild(div)

    // if (options.clickable && options.url !== '') {
    //   link = document.createElement('a')
    //   link.href = options.url
    //   link.target = '_blank'
    //   link.appendChild(div)
    //   //add clickable watermark to the player
    //   this.player.appendChild(link)
    // } else {
    //   //add normal watermark to the player
    //   this.player.appendChild(div)
    // }

    player.on('playing', function () {
      videojs.log('playback began!')
    })
  }
  dispose () {
    super.dispose()
    videojs.log('the advanced plugin is being disposed')
  }

  updateState () {
    this.setState({playing: !this.player.paused()})
  }

  logState (changed) {
    videojs.log(`the player is now ${this.state.playing ? 'playing' : 'paused'}`)
  }
}

export default {
  name: 'video-player',
  props: {
    options: {
      type: Object,
      required: true
    },
    start: {
      type: Number,
      default: function () {
        return 0
      }
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
    }
  },
  created () {

  },
  computed: {
    ...mapState({
      socket: 'socket'
    })
  },
  mounted: function () {
    require('!!videojs-contrib-hls')
    if (!this.player) {
      this.initialize()
    }
  },
  beforeDestroy: function () {
    if (this.player) {
      this.dispose()
    }
  },
  methods: {
    initialize: function () {
      // init
      var self = this
      this.player = null
      // videojs options
      var videoOptions = Object.assign({
        autoplay: false,
        controls: true,
        preload: 'auto',
        fluid: false,
        muted: false,
        width: '100%',
        height: '360',
        language: 'en',
        controlBar: {
          remainingTimeDisplay: false,
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
      }, this.options)
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
      // console.log("ok")
      // console.log(videojs.getPlugin('watermark'))
      if (videojs.getPlugin('watermark') === undefined) {
        videojs.registerPlugin('watermark', WaterMark)
      }
      if (videojs.getPlugin('hideYoutube') === undefined) {
        videojs.registerPlugin('hideYoutube', HideYoutubeLogo)
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
    }
  },
  watch: {
    options: {
      deep: true,
      handler: function (options, oldOptions) {
        this.dispose()
        if (options && options.sources && options.sources.length) {
          this.initialize()
        }
      }
    },
    socket: {
      deep: true,
      handler: function (socket) {
        let unsetWatermark = () => {
          this.player.watermark().dispose()
          const wtms = document.querySelectorAll('.vjs-watermark')
          if (wtms && wtms.length > 0) {
            wtms.forEach(wtm => {
              wtm.classList.add('vjs-watermark-hide')
            })
          }
        }

        if (socket) {
          if (socket.status === true) {
            unsetWatermark()
            this.player.watermark({
              xpos: parseInt(socket.x),
              ypos: parseInt(socket.y),
              opacity: 1,
              text: `[6:${this.$store.state.user.id}]`
            })
          } else {
            unsetWatermark()
            // console.log(this.player.watermark({
            //   xpos: parseInt(socket.x),
            //   ypos: parseInt(socket.y),
            //   opacity: 0,
            //   text: ``
            // }))
          }
        } else {
          unsetWatermark()
          this.player.watermark({
            xpos: parseInt(socket.x),
            ypos: parseInt(socket.y),
            opacity: 0,
            text: ``
          })
        }
      }
    }
  }
}
</script>

<style>
.vjs-watermark {
  position: absolute;
  top: 70%;
  left: 10%;
  opacity: 0.7;
  color: #fff;
  font-size: 16px;
  display: inline;
  z-index: 100000;
}
.vjs-hide-youtube {
  position: absolute;
  width: 110px;
  height: 110px;
  bottom: 0px;
  right: 16px;
  z-index: 20000000;
  opacity: 1;
  background: url("~/static/logo/square.png") no-repeat center center fixed;
  background-size: cover;
}
.vjs-watermark-hide {
  display: none;
}
.vjs-fade-out {
  display: block !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
</style>
