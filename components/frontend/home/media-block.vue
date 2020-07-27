<template>
  <div class="media-cate">
    <div class="container">
      <block-title :url="data.url" v-if="data && data.name" :title="data.name" />
      <!--tuanhmfixstyle-->
      <div class="list-news clearfix">
        <div class="row">
          <div class="col-md-4 news-highlight" v-for="item in fullCol.slice(0,6)" :key="item.item_id">
            <nuxt-link :to="handleLink(item)">
              <div class="media-video news-video">
                  <blur-image :src="item.thumbnail" :alt="item.name" />
                  <div class="media__icon" v-if="item.item_type === 'gallery'">
                    <i :class="`fa ${!isMobile ? 'fa-2x': '' } fa-camera`"></i>
                  </div>
              </div>
            </nuxt-link>
              <h3><nuxt-link :to="handleLink(item)">{{ item.name}}</nuxt-link></h3>
            <!--<p class="news-datetime">
              <span class="datetime">{{ formatHour(item.created_at)}} | {{ formatDay(item.created_at)}}</span>
            </p>-->
          </div>

        </div>
    </div>
  </div>

    
  </div>

</template>

<script>
  import BlockTitle from '~/components/frontend/common/block-title.vue'
  import moment from 'moment'
  export default {
    data () {
      return {
      }
    },
    props: {
      theme: {
        type: String,
        default: 'light'
      },
      data: {
        type: Object,
        required: true
      }
    },
    filters: {
      mmss (secs) {
        const pad = num => {
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
      isMobile () { return this.$store.state.size.isMobile },
      leftCol () {
        return this.data.screen_block_items.slice(0, 5)
      },
      rightCol () {
        return this.data.screen_block_items.slice(5, 13)
      },
      fullCol () {
        return this.data.screen_block_items.slice(0, 12)
      },
      feature () {
        if (this.data && this.data.screen_block_items && this.leftCol) {
          return this.leftCol[0]
        } else {
          return {}
        }
      },
      latest () {
        if (this.data && this.data.screen_block_items && this.leftCol) {
          return this.leftCol.slice(1, 999)
        } else {
          return {}
        }
      }
    },
    components: {
      BlockTitle
      //LargeCate
      //VerticalItem
    },
    methods: {
      checkCol (i) {
        return i % 2 ? 'p-r-0 ' : 'p-l-0'
      },
      formatDay (day) {
        return moment(day).utc().add(7, 'hour').format('DD-MM-YYYY')
      },
      formatHour (day) {
        return moment(day).utc().add(7, 'hour').format('hh:ss')
      }
    },
    mounted () {
    }
  }
</script>

