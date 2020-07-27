<template >
  <li class="popular-news-item">
    <p class="news-datetime">
      <span>{{ formatHour(data.duration)}} | {{ formatDay(data.duration)}}</span>
    </p>
    <nuxt-link :to="handleLink(data)">
      <span class="" v-if="data && data.title">{{ data.title || 'The Olympian aiming to win the toughest race in sport' }}</span>
    </nuxt-link>
  </li>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {}
  },
  computed: {

  },
  props: {
    type: {
      type: String,
      default: 'image' // image video
    },
    theme: {
      type: String,
      default: 'light' //  light or dark
    },
    big: {
      // big font
      type: Boolean,
      default: false
    },
    bigImage: {
      // big font
      type: Boolean,
      default: false
    },
    aspectRatio: {
      // square image or not
      type: Number
    },
    data: {
      type: Object,
      required: true
    }
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
<style>
  li{
    list-style: none;
  }
</style>
