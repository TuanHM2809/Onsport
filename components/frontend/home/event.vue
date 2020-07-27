<template>
  <div class="media-cate module media-block">
    <div class="container">
      <block-title :url="data.url" v-if="data && data.name" :title="data.name" />
      <div class="on-events">
          <div v-show="offset" class="os-score-prev prev" @click.prevent="seekPrev()"></div>
          <div v-on:scroll.passive="offsetChange" class="list-event" ref="listEvent" id="list-event">
            <div :id="`os-score_row_${index}`" class="os-score event-item" v-for="(item,index) in data.screen_block_items" :key="item.item_id">
              <vertical-item hideCategory :data="item" />
            </div>
          </div>
          <div v-show="!isReachEnd" class="os-score-next next" @click.prevent="seekNext()"></div>
      </div>
    </div>

    <!--begin on-ads-->
    <div class="on-ads" style="margin-top:20px">
      <div class="container">
        <a target="_blank" href="#">
          <img src="@/assets/img/onsports_banner_1140_90.jpg">
        </a>
      </div>
    </div>
    <!--end on-ads-->

  </div>
</template>

<script>
  import BlockTitle from '~/components/frontend/common/block-title.vue'
  import VerticalItem from '~/components/frontend/common/vertical-itemEvents.vue'
  // import moment from 'moment'
  import _ from 'lodash'

export default {
    data () {
      return {
        offset: 0, // de xem dang cuon o vi tri thu may trong cai livechannels
        isReachEnd: false,
        perSeek: 20,
        eventListen: -1
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
        //                return moment(value).seconds().format('mm:ss')
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
      chunkie () {
        return _.chunk(this.data.screen_block_items, 2)
      }
    },
    components: {
      BlockTitle,
      VerticalItem
    },
    methods: {
      checkCol (i) {
        return i % 2 ? 'p-r-0 ' : 'p-l-0'
      },
      offsetChange () {
        const {scrollLeft} = this.$refs.listEvent
        this.offset = scrollLeft
        this.checkReachedEnd()
      },
      checkReachedEnd () {
        const {scrollLeft, scrollWidth, clientWidth} = this.$refs.listEvent
        this.isReachEnd = (scrollLeft + clientWidth) >= scrollWidth
      },
      seekPrev () {
        console.log('back')
        const {clientWidth} = this.$refs.listEvent
        const options = {
          container: '#list-event',
          easing: 'linear',
          offset: this.offset - clientWidth > 0 ? this.offset - clientWidth : 0,
          cancelable: true,
          x: true,
          y: false
        }
        this.$scrollTo(`#os-score_row_0`, 200, options)
      },
      seekNext () {
        console.log('next')
        const {clientWidth, scrollWidth} = this.$refs.listEvent
        console.log(clientWidth)
        console.log('--------')
        console.log(scrollWidth)
        console.log('--------')
        console.log(this.offset)

        const maxOffset = scrollWidth - clientWidth
        const options = {
          container: '#list-event',
          easing: 'linear',
          offset: this.offset + clientWidth < maxOffset ? this.offset + clientWidth : maxOffset,
          cancelable: true,
          x: true,
          y: false
        }
        this.$scrollTo(`#os-score_row_0`, 200, options)
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.getElementById('list-event').addEventListener('scroll', this.offsetChange())
        this.checkReachedEnd()
        this.eventListen = 1
      })
    },
    beforeDestroy () {
    // check scrolled

      if (this.eventListen !== -1) {
        document.getElementById('list-event').removeEventListener('scroll', this.offsetChange())
      }
    }
  }
</script>

