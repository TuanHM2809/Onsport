<template>

  <div class="list-news clearfix">
    <div class="news-highlight clearfix">
      <nuxt-link :to="handleLink(data)">
        <div class="media-video news-video">
          <blur-image :src="data.thumbnail" bigImage :alt="data.name"></blur-image>
<!--          <span class="media-duration">{{msToTime}}</span>-->
        </div>
        <h3>{{ data.name }}</h3>
      </nuxt-link>
      <p class="news-datetime">
<!--        <span class="datetime">28 Tháng 9</span>-->
<!--        <a class="sourcename" rel="bookmark" href="#">V - League</a>-->
        <nuxt-link v-if="pundit" :to="handleLink({item_type: 'pundit', slug: pundit.slug})" class="label__tag">{{ pundit.name }}</nuxt-link>
        <nuxt-link v-else-if="author" :to="handleLink({item_type: 'author', slug: author.slug})" class="label__tag">{{ author.name }}</nuxt-link>
        <nuxt-link v-else-if="data && data.categories && data.categories.length > 0" :to="handleLink({item_type: 'category', slug: data.categories[0].slug})" class="label__tag">{{ data.categories[0].name }}</nuxt-link>

      </p>
    </div>
  </div>

</template>
<script>
import moment from 'moment'
export default {
  props: ['data', 'pundit', 'author'],
  computed: {
    formatTime () {
      const createdAt = moment.utc(this.data.created_at)
      if (!!this.data.created_at && !!this.data.date) {
        const publishedAt = moment(this.data.date).utc()
        if (publishedAt.isSameOrAfter(createdAt)) {
          return this.data.date
        } else {
          return createdAt.format(' DD-MM-YYYY')
        }
      }
      return moment(createdAt).utc().add(7, 'hour').format('dddd, DD MMMM')
    },
    msToTime () {
      const duration = moment.utc(this.data.duration)
      if (!!this.data.duration && !!this.data.date) {
        return moment(duration).utc().add(7, 'hour').format('HH:mm')
      }
    },
    isMobile () {
      return this.$store.state.size.isMobile
    }
  },
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

