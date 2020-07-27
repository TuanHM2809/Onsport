<template>
  <div><!--content category-->
    <cate-title :title="data.name" :to="handleLink(data)" />
    <div class="list-news clearfix">
      <div class="news-highlight clearfix">
        <nuxt-link :to="handleLink(feature)">
          <div class="media-video news-video">
            <blur-image :src="feature.thumbnail" :alt="feature.name" medium></blur-image>
<!--            <span class="media-duration" v-if="feature.duration !== 1">{{feature.duration|mmss}}</span>-->
          </div>
          <h3>{{feature.name}}</h3>
        </nuxt-link>
        <p class="news-datetime">
          <span class="datetime">{{ formatHour(feature.created_at)}} | {{ formatDay(feature.created_at)}}</span>
        </p>
      </div>

      <div class="news-item clearfix" v-if="data && latest" v-for="late in latest.slice(0,2)" :key="late.item_id">
        <nuxt-link :to="handleLink(late)">
          <div class="media-video">
            <blur-image :src="late.thumbnail" :alt="feature.name" />
          </div>
          <h3>{{late.name}}</h3>
        </nuxt-link>
        <p class="news-datetime">
          <span class="datetime">{{ formatHour(late.created_at)}} | {{ formatDay(late.created_at)}}</span>
        </p>
      </div>


    </div>
  </div>
</template>
<script>
import CateTitle from '~/components/frontend/common/cate-title.vue'
import moment from 'moment'
export default {
  data () {
    return {}
  },
  props: {
    titleArrow: {
      type: String
    },
    data: {
      type: Object,
      required: false
    }
  },
  computed: {
    feature () {
      if (this.data && this.data.children) {
        return this.data.children[0]
      } else if (this.data && this.data.items) {
        return this.data.items[0]
      } else {
        return {}
      }
    },
    latest () {
      if (this.data && this.data.children) {
        return this.data.children.slice(1, 5)
      } else if (this.data && this.data.items) {
        return this.data.items.slice(1, 5)
      } else {
        return []
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
  },
  components: {
    CateTitle
  }
}
</script>
<style scoped>
.large-post {
  position: relative;
}

.large-post .title {
  position: absolute;
  bottom: 0px;
  width: 100%;
  padding: 7px 10px;
  background: hsla(0, 0%, 98%, 0.7);
  color: #262626;
}

.large-post .title a {
  text-decoration: none;
  color: inherit;
  font-size: 26px;
  font-family: "OnSport", sans-serif;
  line-height: 1.25;
}

.large-post .title a:hover {
  color: #4545a2;
}

.small-post {
  width: 100%;
  float: left;
  border-top: 1px solid #d9d9d9;
  padding-bottom: 5px;
}

.small-post .post-image {
  float: left;
  width: 40%;
}

.small-post a {
  display: block;
  width: 60%;
  padding: 7px 0;
  color: #262626;
  line-height: 1.333333;
  float: left;
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: 18px;
  padding-left: 10px;
}

.small-post a:hover {
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
@media screen and (max-width: 640px) {
  .large-post .title {
    position: static;
    padding: 7px 0px;
  }
  .small-post a {
    font-size: 16px;
  }
}
</style>

