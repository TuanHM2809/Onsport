<template-old>
  <div ref="wrap" class="wrap" :style="[wrapperStyle, wrapStyle]" :class="{ 'rounded': rounded}">
    <div v-if="isPlaceHolder" :class="{'progressive-image-placeholder-out': isImage }" class="progressive-image-placeholder">
      <!-- <img src="/loading.png" alt=""> -->
    </div>
    <canvas v-show="isCanvas" class="canvas"></canvas>
    <transition enter-class="progressive-image-enter" enter-active-class="progressive-image-before-enter">
      <img v-show="isImage" :style="[imgStyle, this.imageStyle]" :title="title" :alt="alt" :src="hiSrc" class="" :class="{'no-ratio': noRatio}" />
    </transition>
  </div>
</template-old>

<template>
  <div ref="wrap" class="wrap" :style="[wrapperStyle, wrapStyle]" :class="{ 'rounded': rounded}">
    <transition enter-class="progressive-image-enter" enter-active-class="progressive-image-before-enter">
      <img v-show="isImage" :style="[imgStyle, this.imageStyle]" :title="title" :alt="alt" :src="buildLarge(src)" class="" :class="{'no-ratio': noRatio}" />
    </transition>
  </div>
</template>


<script>
// import apiConfig from '~/api.config.js'

export default {
  props: {
    src: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: false
    },
    alt: {
      type: String,
      require: false
    },
    aspectRatio: {
      type: Number
    },
    noRatio: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: Object
    },
    imageStyle: {
      type: Object
    },
    rounded: {
      type: Boolean,
      default: false
    },
    high: {
      type: Boolean,
      default: false
    },
    medium: {
      type: Boolean,
      default: false
    },
    low: {
      type: Boolean,
      default: true
    },
    icon: {
      type: Boolean,
      default: false
    }
  },

  data: function () {
    return {
      currentSrc: null,
      loSrc: null,
      hiSrc: null,
      aspectRatioDetect: 0.5625,
      iconSize: 16,
      lowSize: 512,
      mediumSize: 1024,
      highSize: 1600
    }
  },
  computed: {
    isPlaceHolder () {
      return this.currentSrc === null
    },
    isCanvas () {
      return this.currentSrc === this.loSrc
    },
    isImage () {
      return this.currentSrc === this.hiSrc
    },
    calculatedRatio () {
      return this.aspectRatio || this.aspectRatioDetect
    },

    wrapperStyle () {
      if (this.noRatio) {
        return {}
      }
      return {
        paddingBottom: `${this.calculatedRatio * 100}%`
      }
    },
    imgStyle () {
      if (this.noRatio) {
        return {
          position: 'static',
          minHeight: '100%',
          objectFit: 'contain;'
        }
      } else {
        if (this.aspectRatio === 1) {
          return {
            height: '100%',
            width: 'auto'
          }
        }
      }
      return {}
    }
  },
  methods: {
    testHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    },
    buildThumb (image, hq = false) {
      // let width = 10
      // if (hq) { width = this.hd ? 1920 : 1000 }
      // if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
      // if (typeof image === 'undefined') return `/loading.png`
      // return this.testHttpLink(image) ? `${process.env.cdnUrl}/?url=${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}` : `${process.env.cdnUrl}/?url=https%3A%2F%2Fcontrol.onsports.vn%2F${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}`

      return this.testHttpLink(image) ? image : process.env.controlUrl + image

      // if (hq) { width = this.hd ? 1920 : 1200 }
      // if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
      // if (typeof image === 'undefined') return `/loading.png`
      // return this.testHttpLink(image) ? this.src : `https://control.onsports.vn/${image}`
    },

    buildSmall (image) {
      // let width = 10
      // if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
      // if (typeof image === 'undefined') return `/loading.png`
      // return this.testHttpLink(image) ? `${process.env.cdnUrl}/?url=${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}` : `${process.env.cdnUrl}/?url=https%3A%2F%2Fcontrol.onsports.vn%2F${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}`

      return this.testHttpLink(image) ? image : process.env.controlUrl + image
    },
    buildLarge (image) {
      // let width = this.$el.getBoundingClientRect().width
      // let width = 1000
      // if (this.hd) width = 1920
      // if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
      // if (typeof image === 'undefined') return `/loading.png`
      // return this.testHttpLink(image) ? `${process.env.cdnUrl}/?url=${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}` : `${process.env.cdnUrl}/?url=https%3A%2F%2Fcontrol.onsports.vn%2F${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}`
      // return this.testHttpLink(image) ? image : process.env.controlUrl + image
      if (!this.testHttpLink(image)) {
        image = process.env.controlUrl + image
      }

      let resolution = 0

      if (this.low) {
        resolution = this.lowSize
      }
      if (this.medium) {
        resolution = this.mediumSize
      }
      if (this.high) {
        resolution = this.highSize
      }
      if (this.icon) {
        resolution = this.iconSize
      }

      // cho nay tao (Nghia) co tinh viet nhu nay day

      return `${process.env.cdnUrl}/?width=${resolution}&url=${encodeURI(image)}`
    },

    loadPlaceholder () {
      let loResImg = new Image()
      // let context = this.$el.getElementsByTagName('canvas')[0].getContext('2d')
      // const {width, height} = context.canvas
      loResImg.src = this.loSrc

      loResImg.onload = () => {
        // context.drawImage(loResImg, 0, 0, width, height)
        if (this.currentSrc !== this.hiSrc) {
          this.currentSrc = this.loSrc
        }
      }
    },
    loadImage () {
      let hiResImg = new Image()
      hiResImg.src = this.hiSrc
      hiResImg.onload = () => {
        this.currentSrc = this.hiSrc
      }
    },
    handleImageLoading () {
      this.loadPlaceholder()
      this.loadImage()
    }
    // createloadImageImg () {
    //   let papa = this.$refs.wrap
    //   let x = document.createElement('img')
    //   x.setAttribute('src', this.hiSrc)
    //   x.setAttribute('class', 'progressiveMedia-image')
    //   x.setAttribute('alt', 'The Pulpit Rock')
    //   papa.appendChild(x)
    // }

  },
  created () {
    // if (!this.loSrc) this.loSrc = this.buildSmall(this.src) // only build small image
    // if (!this.hiSrc) this.hiSrc = this.buildLarge(this.src, true)
    // if (!this.hiSrc) this.hiSrc = this.src
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        // this.handleImageLoading()
      }, 0)
    })
  },
  watch: {
    src () {
      this.loaded = false
      this.loSrc = this.buildSmall(this.src)
      this.hiSrc = this.buildLarge(this.src, true)
      this.$nextTick(() => {
        this.handleImageLoading()
      })
    }
  },
  updated () {
    if (this.currentSrc !== this.hiSrc) {
      this.$nextTick(() => {
        this.handleImageLoading()
      })
    }
  }
}
</script>

<style scoped>
.wrap {
  /* background-color: rgba(0, 0, 0, 0.05);
  background-size: cover;
  background-repeat: no-repeat;

  width: 100%;
  height: 100%; */
  position: relative;
  overflow: hidden;
}
img,
canvas,
.placeholder {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
canvas {
  height: 100%;
}
.no-ratio {
  object-fit: contain;
}
.placeholder {
  /* background-color: rgba(0, 0, 0, 0.05); */
}
.placeholder:after {
  /* 16:9 ratio */
  display: block;
  content: "";
}
canvas {
  filter: blur(10px);
  transform: scale(1);
}
/*.loadPlaceholder-transition {
  transition: opacity linear 0.4s 0s;
  opacity: 1;
  -ms-interpolation-mode: nearest-neighbor;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: -webkit-crisp-edges;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: pixelated;
}
 */
.progressive-image-before-enter {
  opacity: 1;
}

.progressive-image-enter {
  opacity: 0;
}

.progressive-image-placeholder {
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
  overflow: hidden;
  transition-duration: 300ms;
  transition-property: all;
  transition-timing-function: ease-out;
  backface-visibility: hidden;
  transform: translateZ(0) scale(1);
  width: 100%;
  height: 100%;
  background-size: cover;
  background-color: rgba(0, 0, 0, 0.05);
}

.progressive-image-placeholder-out {
  transition-duration: inherit;
  transition-property: all;
  transition-timing-function: ease-out;

  /**
     * the transitioon delay needs to be longer than the
     * .progressive-image-main transition-duration, otherwise it will flick
     * because there won't be a background.
    */
  transition-delay: 0.4s;

  opacity: 0;
}
.rounded {
  border-radius: 50%;
}
</style>

<style>
.progressiveMedia,
.progressiveMedia-canvas,
.progressiveMedia-image,
.progressiveMedia-noscript,
.progressiveMedia-zoom {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  box-sizing: border-box;
}
</style>
