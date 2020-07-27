<template>
  <div class="row">
    <div class="col-md-4 news-highlight" v-for="item in data.slice(0, 3)"  :key="item.id">
      <nuxt-link :to="handleLink(item)">
        <div class="media-video news-photo">
           <blur-image :src="item.thumbnail" :alt="item.name" high></blur-image>
          <span class="media-duration" v-if="item.duration">{{item.duration}}</span>
        </div>
          <h3 v-if="item.name">
            {{ item.name}}
          </h3>
      </nuxt-link>
      <!--tuanhmfixstyle
      <p class="news-datetime">
        <span class="datetime">{{ formatHour(item.created_at)}} | {{ formatDay(item.created_at)}}</span>
      </p>-->
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'carousel',
  data () {
    return {
      swiperOption: {
        initialSlide: 1,
        autoPlay: 5000,
        speed: 1000,
        slidesPerView: 'auto',
        centeredSlides: true,
        navigationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 20,
        lazy: true
      }
    }
  },
  props: {
    data: {
      type: Array || Object,
      required: false
    },
    theme: {
      type: String,
      default: 'light' // dark or light
    },
    full: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  created () {
    this.swiperOption.spaceBetween = this.full ? 20 : 20
  },
  components: {},
  methods: {
    formatDay (day) {
      return moment(day).utc().add(7, 'hour').format('DD-MM-YYYY')
    },
    formatHour (day) {
      return moment(day).utc().add(7, 'hour').format('hh:ss')
    }
  }
}
</script>

