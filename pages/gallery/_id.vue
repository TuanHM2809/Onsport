<template>
  <div>
    <div class="module">
      <div class="container p-t-0 p-b-20" v-if="gallery">
        <page-title v-if="gallery && gallery.title" :createdAt="handleCreated" :title="gallery.title"></page-title>
        <div class="carrousel">
          <transition name="module" mode="out-in">
            <div class="swiper" v-swiper:swiperTop="bigSwiper" ref="swiperTop">
              <div class="swiper-wrapper" :class="{dark : theme === 'dark'}">
                <div class="swiper-slide" v-for="(image, index) in gallery.gallery_items" :key="image.id" @click.prevent="handleClickImage(index)">
                  <blur-image high :style="swiperTopSlideStyle" :src="image.image" />
                  <div class="swiper-text-content">
                    <div v-if="image.caption" class="swiper-text-description">{{image.caption}}</div>
                  </div>
                </div>
              </div>
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
          </transition>
        </div>
        <div class="thumb">
          <transition name="module" mode="out-in">
            <div class="swiper">
              <div class="swiper-wrapper-thumb" :class="{dark : theme==='dark' } ">
                <div class="swiper-slide" :class="{'swiper-slide-active' :index === (select - beginThumbIndex)}" v-for="(image, index) in displayThumbs " :key="image.id">
                  <div @click.prevent="handleClickThumb(index + beginThumbIndex) " class="m-t-10 m-r-10">
                    <blur-image :src="image.image " :title="image.caption" />
                  </div>
                </div>
              </div>
              <!-- If we need navigation buttons 
              <div class="swiper-button-prev "></div>
              <div class="swiper-button-next "></div> -->
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div class="module " style="background-color: #fafafa; ">
      <div class="container ">
        <div class="row ">
          <block-title :title="'Bình luận'" />
          <comment-box :itemId="gallery.id" itemType="gallery" />
        </div>
      </div>
    </div>
    <share-box/>
    <GalleryBox ref="galleryBox" :showLightBox="false " :images="gallery.gallery_items " />
  </div>
</template>
<script>
import PageTitle from '~/components/frontend/common/page-title.vue'
import CateTitle from '~/components/frontend/common/cate-title.vue'
import BlockTitle from '~/components/frontend/common/block-title.vue'
import HItem from '~/components/frontend/common/horizontal-item.vue'
import GalleryBox from '~/components/frontend/gallery/light-box.vue'
import moment from 'moment'
export default {
  layout: 'default',
  async asyncData ({app, params, error}) {
    try {
      let response = await app.$axios.$get(`/gallery/${params.id}`)
      if (response.code === 0) {
        return {gallery: response.data}
      } else {
        error({ statusCode: 404, message: 'Trang không tồn tại' })
      }
    } catch (e) {
      console.log(e)
    }
  },
  validate ({ params }) {
    return (!!params.id)
  },
  head () {
    const gallery = this.gallery
    return {
      title: `${gallery.title}` || 'Thư viện ảnh',
      meta: [
        { hid: 'description', name: 'description', content: gallery && gallery.content ? gallery.content : '' },
        { hid: 'og:title', property: 'og:title', content: gallery && gallery.title ? gallery.title : '' },
        { hid: 'og:type', property: 'og:type', content: 'article' },
        { hid: 'og:description', property: 'og:description', content: gallery && gallery.content ? gallery.content : '' },
        { hid: 'og:image', property: 'og:image', content: gallery && gallery.thumbnail ? encodeURI(`${process.env.controlUrl}/${gallery.thumbnail}`) : '' },
        { hid: 'og:image:alt', property: 'og:image:alt', content: gallery && gallery.content ? gallery.content : '' },
        { hid: 'og:image:width', property: 'og:image:width', content: '512' },
        { hid: 'og:image:height', property: 'og:image:height', content: '288' }
      ]
    }
  },
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
        lazy: true,
        onSlideChangeEnd: swiper => {
          this.$set(this, 'select', swiper.realIndex)
          // console.log('onSlideChangeEnd', swiper.realIndex)
        }
      },
      theme: 'light',
      maxHeight: 0,
      showLightBox: false,
      startAt: 0,
      select: 0,
      thumbSelect: 0,
      displayThumbs: [],
      beginThumbIndex: 0,
      nThumbs: 7
    }
  },
  computed: {
    swiperTopSlideStyle () {
      if (!this.maxHeight) return {}
      return {
        'max-height': `${this.maxHeight}px`
      }
    },
    countImages () {
      return this.gallery.gallery_items.length
    },
    imagesThumb () {
      return this.displayThumbs.map(({ image }) => image)
    },
    handleCreated () {
      const createdAt = moment.utc(this.gallery.created_at)
      if (!!this.gallery.created_at && !!this.gallery.date) {
        const publishedAt = moment.utc(this.gallery.date)
        if (publishedAt.isSameOrAfter(createdAt)) {
          return publishedAt.format('HH:mm | DD-MM-YYYY')
        } else {
          return createdAt.format('HH:mm | DD-MM-YYYY ')
        }
      }
      return createdAt.format('HH:mm | DD-MM-YYYY ')
    }
  },
  created () {
    // this.calculatedMaxHeight()
  },
  mounted () {
    window.addEventListener('resize', this.calculatedMaxHeight)
    this.$nextTick(() => {
      // const swiperTop = this.swiperTop
      // const swiperThumbs = this.swiperThumbs
      // swiperTop.params.control = swiperThumbs
      // swiperThumbs.params.control = swiperTop
      // console.log(swiperTop.params.control)
      this.$set(this, 'displayThumbs', this.gallery.gallery_items.slice(0, this.nThumbs))
      this.calculatedMaxHeight()
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
    handleClickImage (index) {
      this.$refs.galleryBox.showImage(index)
    },
    handleClickThumb (index) {
      this.swiperTop.slideTo(index)
      this.$set(this, 'select', index)
    },
    nextImage () {
      this.$set(this, 'select', (this.select + 1) % this.countImages)
    },
    previousImage () {
      this.$set(this, 'select', ((this.select - 1) + this.countImages) % this.countImages)
    }
  },
  watch: {
    maxHeight (newHeight, oldHeight) {
      // console.log('max height:', newHeight)
    },
    startAt () {
      this.$set(this, 'select', this.startAt)
      this.$set(this, 'thumbSelect', this.startAt)
    },
    gallery () {
      this.$set(this, 'displayThumbs', this.gallery.gallery_items.slice(0, this.nThumbs))
    },
    select () {
      let halfDown = Math.floor(this.nThumbs / 2) // 7/2
      let mod = 1 - (this.nThumbs % 2)
      if (this.select <= halfDown) {
        this.$set(this, 'beginThumbIndex', 0)
        this.$set(this, 'thumbSelect', this.select)
        this.$set(this, 'displayThumbs', this.gallery.gallery_items.slice(0, this.nThumbs))
        return
      }
      if (this.select >= this.countImages - halfDown) {
        this.$set(this, 'beginThumbIndex', this.countImages - this.nThumbs)
        this.$set(this, 'thumbSelect', this.nThumbs - (this.countImages - this.select))
        this.$set(this, 'displayThumbs', this.gallery.gallery_items.slice(-this.nThumbs))
        return
      }
      this.$set(this, 'beginThumbIndex', this.select - halfDown + mod)
      this.$set(this, 'thumbSelect', halfDown - mod)
      this.$set(this, 'displayThumbs', this.gallery.gallery_items.slice(this.select - halfDown + mod, this.select + halfDown + 1))
    },
    swiperTop: {
      handler: (after, before) => {
        // Return the object that changed
        console.log(this.swiperTop)
      },
      deep: true
    }
  },
  components: {
    CateTitle,
    HItem,
    PageTitle,
    BlockTitle,
    GalleryBox
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
  font-family: "OnSport", sans-serif;
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
.swiper-wrapper-thumb {
  display: flex;
  justify-content: center;
  align-items: center;
}
.thumb {
  height: auto;
  box-sizing: border-box;
  padding: 0;
}

.thumb .swiper {
  position: relative;
  padding: 0px 0px;
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
