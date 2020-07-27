<template>
  <div class="inner">
    <nuxt-link :to="handleLink(data)">
    </nuxt-link>
    <div class="event-info">
      <nuxt-link :to="handleLink(data)">
      <h4 style="min-height: 35px; color: #172f6f; font-size: 14px; line-height:35px; font-weight: 400;">{{ data.link_type}}</h4>
      <h4 class="nameEvent"style="line-height: 1.2; font-size: 24px; font-weight: 500; width:75%;height: 100px;">{{ data.name}}</h4>
      <h4 style="min-height: 35px; font-size: 16px; line-height:35px;color: rgb(74, 74, 74); -webkit-font-smoothing: antialiased;">
      {{ formatHour(data.start_at)}} | {{ formatDay(data.start_at)}}
      </h4>
      <div class="imageEvent"><h4></h4></div>
    </nuxt-link>
    
    </div>
    
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {

    }
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
    big: { // big font
      type: Boolean,
      default: false
    },
    hideCategory: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      required: true
    }
  },
  filters: {
    mmss (secs) {
      //                return moment(value).seconds().format('mm:ss')
      function pad (num) {
        const result = (`0${num}`).slice(-2)
        return result
      }

      secs = parseInt(secs)
      let minutes = Math.floor(secs / 60)
      secs %= 60
      const hours = Math.floor(minutes / 60)
      minutes %= 60

      if (pad(hours) === 0 || pad(hours) === '00') {
        return `${pad(minutes)}:${pad(secs)}`
      }
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
    }
  },
  computed: {
    // duration () {
    //   const duration = moment.duration(this.data.duration, 'seconds')
    //   return `${duration.get('hours')}: ${duration.minutes()}: ${duration.seconds()}`
    // }
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
    // handleLink (item) {
    //   switch (item.item_type) {
    //     case 'file':
    //       return {name: `video-id`, params: {id: item.item_id}}
    //     case 'post':
    //       return {name: `${item.item_type}-id`, params: {id: item.item_id}}
    //     default:
    //       return {name: `${item.item_type}-id`, params: {id: item.item_id}}
    //   }
    // }
  },
  components: {
  }
}
</script>

<style scoped>
.normal-post {
  padding-bottom: 10px;
}
.normal-post .title {
  padding: 5px 0 0 0;
  height: 58px;
}

.normal-post .title span.headline-text {
  text-decoration: none;
  font-weight: 300;
  font-size: 16px;
  white-space: inherit;
  text-decoration: none;
  box-sizing: border-box;
  -webkit-line-clamp: 3;
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  font-family: "Roboto" sans-serif;
  line-height: 1.133;
  color: #404040;
  max-height: 58px;
}

.normal-post.darken .title span.headline-text {
  color: #fefefe;
}
.normal-post .title span.headline-text.big {
  font-size: 24px;
}

.normal-post .title:hover span,
.normal-post .category:hover,
.normal-post.darken .title:hover span.headline-text,
.normal-post.darken .category:hover {
  color: #4545a2;
}

.normal-post .category {
  font-weight: lighter;
  line-height: 1.25;
  font-style: italic;
  color: #404040;
  padding: 5px 5px 0px;
  text-align: left;
  font-size: 15px;
}
.normal-post.darken .category {
  color: #fefefe;
}

.normal-post .post-image {
  position: relative;
}

.normal-post .post-image img {
  width: 100%;
}

.normal-post .post-image .duration {
  position: absolute;
  bottom: 0px;
  padding: 2px 5px;
  background: hsla(0, 0%, 5%, 0.3);
  font-size: 15px;
  color: #fefefe;
}
.normal-post.darken .post-image .duration {
  color: #fff;
}

.normal-post .post-image .duration span {
  display: inline-block;
  color: #fefefe;
}
.normal-post.darken .post-image .duration span {
  color: #fff;
}
.normal-post.darken .post-image:hover .duration span {
  color: #4545a2;
}

.normal-post .post-image:hover .duration span {
  color: #4545a2;
}
.media {
  position: relative;
}
.media__icon {
  background: hsla(0, 0%, 5%, 0.3);
  color: #fefefe;
  padding: 5px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  font-size: 18px;
  line-height: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
}
.media__icon.center-icon {
  top: 50%;
  left: 50%;
  bottom: auto;
  padding: 5px;
  border-radius: 30px;
  line-height: 40px;
  display: inline-block;
  height: 50px;
  width: 50px;
  text-align: center;
  background-color: #4545a2;
  opacity: 0.7;
  transform: translate(-50%, -50%);
}
.media__icon.center-icon:hover {
  opacity: 0.85;
}
.media__icon.center-icon i {
  color: #fff;
  font-size: 2rem;
  margin: 0 0 0 5px;
  line-height: 40px;
}
@media (max-width: 640px) {
  .normal-post .title span.headline-text {
    font-size: 15px;
  }
  .normal-post .title span.headline-text.big {
    font-size: 18px;
  }
}
.event-info a{
  color: #0f0f0f;
}
</style>
