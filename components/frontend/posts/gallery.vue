<template>
  <div class="post-gallery m-t-20 m-b-20">
    <div v-if="gallery">
      <div class="carrousel">
        <transition name="module" mode="out-in">
          <div class="swiper" v-swiper:swiperTop="bigSwiper">
            <div class="swiper-wrapper" :class="{dark : theme === 'dark'}">
              <div class="swiper-slide" v-for="image in gallery.gallery_items" :key="image.id">
                <blur-image :style="swiperTopSlideStyle" :src="image.image" :alt="image.caption" />
                <div class="swiper-text-content">
                  <!-- <h3 class="swiper-text-headline">
                      <a href="#">
                        <span class="swiper-text-headline-text">{{ image.caption}}</span>
                      </a>
                    </h3> -->
                  <div class="swiper-text-description">
                    <strong>Photos:</strong> {{ gallery.name }}</div>
                  <div v-if="image.caption" class="swiper-text-description">{{image.caption}}</div>
                </div>
              </div>
            </div>
            <!-- If we need navigation buttons -->
            <!-- <div class="swiper-pagination" slot="pagination"></div> -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </transition>
      </div>
      <div class="thumb">
        <transition name="module" mode="out-in">
          <div class="swiper" v-swiper:swiperThumbs="smallSwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="image in gallery.gallery_items" :key="image.id">
                <blur-image :src="image.image" :title="image.caption" :alt="image.caption" />
              </div>
            </div>
            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      bigSwiper: {
        initialSlide: 0,
        speed: 1000,
        slidesPerView: 1,
        centeredSlides: true,
        navigationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 40,
        keyboardControl: true,
        pagination: '.swiper-pagination',
        paginationType: 'fraction',
        lazy: true
      },
      theme: 'light',
      smallSwiper: {
        notNextTick: true,
        centeredSlides: true,
        spaceBetween: 10,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        navigationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slideToClickedSlide: true,
        paginationClickable: true,
        autoHeight: true
      },
      maxHeight: 0,
      gallery: {}
    }
  },
  props: ['galleryId'],
  computed: {
    swiperTopSlideStyle () {
      if (!this.maxHeight) return {}
      return {
        'max-height': `${this.maxHeight}px`
      }
    }
  },
  created () {
    this.fetchData()
  },
  mounted () {
    window.addEventListener('resize', this.calculatedMaxHeight)
    this.$nextTick(() => {
      const swiperTop = this.swiperTop
      const swiperThumbs = this.swiperThumbs
      if (swiperTop && swiperThumbs) {
        swiperTop.params.control = swiperThumbs
        swiperThumbs.params.control = swiperTop
        this.calculatedMaxHeight()
      }
    })
    // console.log(this.gallery)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.calculatedMaxHeight)
  },
  methods: {
    calculatedMaxHeight () {
      if (this.swiperTop.width) {
        this.maxHeight = parseInt(parseInt(this.swiperTop.width) * 0.5625)
      }
    },
    async fetchData () {
      try {
        const response = await this.$axios.$get(`/gallery/${this.galleryId}`)
        if (response.code === 0) {
          this.gallery = response.data
        } else {
          this.$toast.error(response.message)
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
    maxHeight (newHeight, oldHeight) {
      // console.log('max height:', newHeight)
    }
  },
  components: {
  }
}
</script>
<style scoped>
.carrousel {
  padding-bottom: 0px;
  position: relative;
  overflow: hidden;
}
.swiper-slide {
  max-width: 100%;
  height: 100%;
  position: relative;
}
@media (min-width: 1100px) {
  .swiper-slide {
    height: 100%;
    position: relative;
  }
}

.swiper-slide-prev::before,
.swiper-slide-next::before {
  background: hsla(0, 0%, 5%, 0.3);
  content: " ";
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}
.swiper-text-content {
  bottom: 0;
  left: 0;
  padding: 7px 0;
  padding-left: 10px;
  padding-right: 10px;
  position: static;
  width: 100%;
  background: hsla(0, 0%, 98%, 0.7);
}
h3.swiper-text-headline,
h3.swiper-text-headline a,
h3.swiper-text-headline a span {
  font-weight: 300;
  
  -webkit-font-smoothing: antialiased;
  font-size: 30px;
  color: #141417;
  line-height: 1.1;
}
.swiper-text-description {
  margin: 5px 0 0;
  padding-bottom: 7px;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
  line-height: 1.375;
  color: #141417;
}
.dark.swiper-wrapper {
  background: #141417;
  overflow: visible;
}
.dark .swiper-text-content {
  background: #141417;
}
.dark h3.swiper-text-headline,
.dark .swiper-text-description {
  color: #fefefe;
}

/* css cho navigator */

.swiper-button-prev {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23404040'/%3E%3C/svg%3E") !important;
}
.swiper-button-next {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23404040'/%3E%3C/svg%3E") !important;
}
.swiper-button-disabled {
  visibility: hidden;
}
.swiper-pagination-fraction {
  color: #fefefe;
  font-size: 16px;
  text-align: left;
  padding-left: 10px;
}

/* css cho thang be */

.thumb {
  height: auto;
  box-sizing: border-box;
  padding: 0;
}

.thumb .swiper {
  position: relative;
  padding: 0px 30px;
  overflow: hidden;
}

.darken.thumb .swiper {
  background: transparent;
}

.thumb .swiper-slide {
  max-width: 120px;
  height: auto;
  opacity: 0.7;
}

.thumb .swiper-slide-active {
  opacity: 1;
}

.thumb .swiper-button-next,
.thumb .swiper-button-prev {
  width: 28px;
  height: 44px;
  margin-top: -22px;
  background-size: 28px 44px;
  background-position: 50%;
  background-repeat: no-repeat;
}
</style>
