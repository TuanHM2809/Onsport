<template>
  <div @click.stop="closeLightBox">
    <a class="vue-lb-container" v-show="lightBoxOn" v-if="images && images.length > 0">
      <button type="button" title="Đóng (Esc)" class="vue-lb-button-close">
        <span>
          <svg fill="white" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;">
            <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4 L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1 c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1 c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
          </svg>
        </span>
      </button>
      <div class="vue-lb-content">
        <!-- .vue-lb-header -->
        <div class="vue-lb-figure" @click.stop>
          <transition mode="out-in" name="fade">
            <blur-image high :wrapStyle="{width:'auto',margin: '0 auto'}" noRatio :imageStyle="imageStyle" :key="images[select].image" :src="images[select].image" :alt="images[select].name" class="vue-lb-modal-image" />
          </transition>

          <div class="rest-of-figure">
            <div class="vue-lb-info" v-html="images[select].caption" v-show="showCaption"></div>

          </div>
          <div class="vue-lb-footer">
            <div class="vue-lb-footer-info"></div>
            <div class="vue-lb-footer-count">
              {{ select + 1 }}/{{ countImages }}
            </div>
          </div>

        </div>
      </div>
      <!-- .vue-lb-content -->
      <div class="vue-lb-thumbnail-wrapper">
        <div v-if="showThumbs" class="vue-lb-thumbnail">
          <button v-if="images.length > 1" type="button" class="vue-lb-thumbnail-arrow vue-lb-thumbnail-left" title="Quay lại" @click.stop="previousImage()">
            <span>
              <svg fill="white" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512">
                <path d="M213.7,256L213.7,256L213.7,256L380.9,81.9c4.2-4.3,4.1-11.4-0.2-15.8l-29.9-30.6c-4.3-4.4-11.3-4.5-15.5-0.2L131.1,247.9 c-2.2,2.2-3.2,5.2-3,8.1c-0.1,3,0.9,5.9,3,8.1l204.2,212.7c4.2,4.3,11.2,4.2,15.5-0.2l29.9-30.6c4.3-4.4,4.4-11.5,0.2-15.8 L213.7,256z"></path>
              </svg>
            </span>
          </button>

          <div v-for="(image, index) in imagesThumb" :key="index" :class="`vue-lb-modal-thumbnail${thumbSelect === index ? '-active' : ''}`" @click.stop="showImage(index + beginThumbIndex)">
            <blur-image :aspectRatio="1" :src="buildThumb(image) " :alt="image"></blur-image>
          </div>

          <button v-if="images.length> 1" type="button" class="vue-lb-thumbnail-arrow vue-lb-thumbnail-right" title="Tiếp theo" @click.stop="nextImage()">
            <span>
              <svg fill="white" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512">
                <path d="M298.3,256L298.3,256L298.3,256L131.1,81.9c-4.2-4.3-4.1-11.4,0.2-15.8l29.9-30.6c4.3-4.4,11.3-4.5,15.5-0.2l204.2,212.7 c2.2,2.2,3.2,5.2,3,8.1c0.1,3-0.9,5.9-3,8.1L176.7,476.8c-4.2,4.3-11.2,4.2-15.5-0.2L131.3,446c-4.3-4.4-4.4-11.5-0.2-15.8 L298.3,256z"></path>
              </svg>
            </span>
          </button>
        </div>
        <!-- .vue-lb-thumbnail -->
      </div>
      <button v-if="images.length > 1" type="button" class="vue-lb-arrow vue-lb-left" title="Quay laị" @click.stop="previousImage()">
        <span>
          <svg fill="white" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512">
            <path d="M213.7,256L213.7,256L213.7,256L380.9,81.9c4.2-4.3,4.1-11.4-0.2-15.8l-29.9-30.6c-4.3-4.4-11.3-4.5-15.5-0.2L131.1,247.9 c-2.2,2.2-3.2,5.2-3,8.1c-0.1,3,0.9,5.9,3,8.1l204.2,212.7c4.2,4.3,11.2,4.2,15.5-0.2l29.9-30.6c4.3-4.4,4.4-11.5,0.2-15.8 L213.7,256z"></path>
          </svg>
        </span>
      </button>

      <button v-if="images.length > 1" type="button" class="vue-lb-arrow vue-lb-right" title="Next" @click.stop="nextImage()">
        <span>
          <svg fill="white" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 512 512" xml:space="preserve">
            <path d="M298.3,256L298.3,256L298.3,256L131.1,81.9c-4.2-4.3-4.1-11.4,0.2-15.8l29.9-30.6c4.3-4.4,11.3-4.5,15.5-0.2l204.2,212.7 c2.2,2.2,3.2,5.2,3,8.1c0.1,3-0.9,5.9-3,8.1L176.7,476.8c-4.2,4.3-11.2,4.2-15.5-0.2L131.3,446c-4.3-4.4-4.4-11.5-0.2-15.8 L298.3,256z"></path>
          </svg>
        </span>
      </button>
    </a>
    <!-- .vue-lb-container -->
  </div>
</template>
<script>
export default {
  props: {
    images: {
      type: Array,
      required: true
    },

    showLightBox: {
      type: Boolean,
      default: true
    },

    startAt: {
      type: Number,
      default: 0
    },

    nThumbs: {
      type: Number,
      default: 5
    },

    showThumbs: {
      type: Boolean,
      default: true
    },

    // Mode
    autoPlay: {
      type: Boolean,
      default: false
    },

    autoPlayTime: {
      type: Number,
      default: 3000
    },
    showCaption: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      select: this.startAt,
      thumbSelect: this.startAt,
      lightBoxOn: this.showLightBox,
      displayThumbs: this.images.slice(0, this.nThumbs),
      timer: null,
      beginThumbIndex: 0
    }
  },

  computed: {
    countImages () {
      return this.images.length
    },
    imagesThumb () {
      return this.displayThumbs.map(({ image }) => image)
    },
    imageStyle () {
      return {
        cursor: `pointer`,
        maxHeight: `100vh`,
        display: `block`,
        height: `auto`,
        margin: `0 auto`,
        maxWidth: `100%`,
        userSelect: `none`
      }
    }
  },

  watch: {
    startAt () {
      this.$set(this, 'select', this.startAt)
      this.$set(this, 'thumbSelect', this.startAt)
    },

    images () {
      this.$set(this, 'displayThumbs', this.images.slice(0, this.nThumbs))
    },

    select () {
      let halfDown = Math.floor(this.nThumbs / 2)
      let mod = 1 - (this.nThumbs % 2)

      if (this.select <= halfDown) {
        this.$set(this, 'beginThumbIndex', 0)
        this.$set(this, 'thumbSelect', this.select)
        this.$set(this, 'displayThumbs', this.images.slice(0, this.nThumbs))
        return
      }

      if (this.select >= this.countImages - halfDown) {
        this.$set(this, 'beginThumbIndex', this.countImages - this.nThumbs)
        this.$set(this, 'thumbSelect', this.nThumbs - (this.countImages - this.select))
        this.$set(this, 'displayThumbs', this.images.slice(-this.nThumbs))
        return
      }

      this.$set(this, 'beginThumbIndex', this.select - halfDown + mod)
      this.$set(this, 'thumbSelect', halfDown - mod)
      this.$set(this, 'displayThumbs', this.images.slice(this.select - halfDown + mod, this.select + halfDown + 1))
    },

    lightBoxOn (value) {
      if (document != null) {
        if (value) {
          document.getElementsByTagName('body')[0].classList.add('vue-lb-open')
          this.$emit('lightBoxOn', true)
        } else {
          document.getElementsByTagName('body')[0].classList.remove('vue-lb-open')
          this.$emit('lightBoxOn', false)
        }
      }
    }
  },

  mounted () {
    if (this.autoPlay) {
      this.timer = setInterval(() => {
        this.nextImage()
      }, this.autoPlayTime)
    }
  },

  methods: {
    showImage (index) {
      document.addEventListener('keydown', this.addKeyEvent)

      this.$set(this, 'lightBoxOn', true)
      this.$set(this, 'select', index)
    },

    addKeyEvent (event) {
      if (event.keyCode === 37) this.previousImage()
      if (event.keyCode === 39) this.nextImage()
      if (event.keyCode === 27) this.closeLightBox()
    },

    closeLightBox () {
      this.$set(this, 'lightBoxOn', false)
      document.removeEventListener('keydown', this.addKeyEvent)
    },

    nextImage () {
      this.$set(this, 'select', (this.select + 1) % this.countImages)
    },

    previousImage () {
      this.$set(this, 'select', ((this.select - 1) + this.countImages) % this.countImages)
    },
    testHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    },
    buildThumb (image, hq = false) {
      if (!image) return `/loading.png`
      return this.testHttpLink(image) ? image : process.env.controlUrl + image

      // if (hq) { width = this.hd ? 1920 : 1200 }
      // if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
      // if (typeof image === 'undefined') return `/loading.png`
      // return this.testHttpLink(image) ? this.src : `https://control.onsports.vn/${image}`
    }
  },
  beforeDestroy () {
    document.removeEventListener('keydown', this.addKeyEvent)

    if (this.autoPlay) {
      clearInterval(this.timer)
    }
  }
}
</script>
<style scoped>
.vue-lb-box {
  width: 100%;
}

.vue-lb-container {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
  box-sizing: border-box;
  height: 100%;
  left: 0px;
  padding: 10px;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 2001;
}

.vue-lb-content {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  /*padding-bottom: 60px; */
  max-width: 2000px;
  position: relative;
  overflow-y: hidden;
}

.vue-lb-header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  -webkit-box-pack: justify;
}

.vue-lb-button-close {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  position: fixed;
  z-index: 1000;
  top: 0px;
  right: 0;
  vertical-align: bottom;
  height: 40px;
  padding: 10px;
  width: 40px;
}

.vue-lb-figure {
  margin: 0px;
  position: relative;
  max-width: 2000px;
  width: 100%;
  height: 100%;
  display: flex;
}

.vue-lb-modal-image {
  cursor: pointer;
  flex: 1;
  display: flex;
  user-select: none;
  overflow-y: hidden;
}
.rest-of-figure {
  background: rgba(0, 0, 0, 0.7);
  position: absolute;
  top: auto;
  bottom: 0;
  left: 0;
  width: 100%;
}
.vue-lb-info {
  visibility: initial;
  color: white;
  /* background-color: rgba(0, 0, 0, 0.7); */
  line-height: 1.5;
  font-size: 14px;
  width: 100%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 5px;
  margin: 0 auto;
  max-width: 1000px;
}

.vue-lb-footer {
  box-sizing: border-box;
  color: white;
  cursor: auto;
  line-height: 1.3;
  padding-bottom: 5px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 5px;
  margin: 0 auto;
  max-width: 2000px;
  position: fixed;
  left: 10px;
  bottom: 10px;
}

.vue-lb-footer-info {
  display: block;
  flex: 1 1 0;
  -webkit-flex: 1 1 0;
  -ms-flex: 1 1 0;
}

.vue-lb-footer-count {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.85em;
  padding-left: 1em;
}

.vue-lb-thumbnail {
  top: 10px;
  height: 50px;
  padding: 0 50px;
  text-align: center;
  white-space: nowrap;
  display: inline-block;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
}

.vue-lb-modal-thumbnail {
  background-position: center;
  background-size: cover;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px hsla(0, 0%, 100%, 0.2);
  cursor: pointer;
  display: inline-block;
  height: 50px;
  margin: 2px;
  overflow: hidden;
  width: 50px;
  padding: 5px;
}

.vue-lb-modal-thumbnail-active {
  background-position: center;
  background-size: cover;
  border-radius: 2px;
  box-shadow: inset 0 0 0 2px white;
  cursor: pointer;
  display: inline-block;
  height: 50px;
  margin: 2px;
  overflow: hidden;
  width: 50px;
  padding: 5px;
}

.vue-lb-thumbnail-arrow {
  height: 54px;
  width: 40px;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  padding: 10px;
  position: absolute;
  top: 50%;
  -webkit-touch-callout: none;
  user-select: none;
  height: 50px;
  margin-top: -25px;
  width: 30px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.vue-lb-thumbnail-left {
  left: 10px;
}

.vue-lb-thumbnail-right {
  right: 10px;
}

.vue-lb-arrow {
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  padding: 10px;
  position: absolute;
  top: 50%;
  -webkit-touch-callout: none;
  user-select: none;
  height: 120px;
  margin-top: -60px;
  width: 40px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.vue-lb-left {
  left: 10px;
}

.vue-lb-right {
  right: 10px;
}

.vue-lb-open {
  overflow: hidden;
}

.vue-lb-thumbnail-wrapper {
  top: 10px;
  height: 50px;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  text-align: center;
}

@media (max-width: 767px) {
  .vue-lb-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .rest-of-figure {
    position: fixed;
    top: auto;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
  }
  .vue-lb-footer {
    top: 10px;
    bottom: auto;
  }
}

@media (min-width: 500px) {
  .vue-lb-thumbnail-arrow {
    width: 40px;
  }
}

@media (min-width: 768px) {
  .vue-lb-arrow {
    width: 70px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
