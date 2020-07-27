<template>
  <!-- Breaking news -->

  <div class="site-header-middle">
    <!-- tuanhmfixstyle -->
    <div class="spotlight" style="display:none">
    <!-- tuanhmfixstyle -->
      <div class="spotlight-title" >Tin nóng</div>
      <ul class="spotlight-list" style="margin-left: 88px; position: absolute; top: 0px; transition: all 0.3s; width:100%" :style="{top: ( 0 - indexActive*itemHeight)+ 'px'}">
        <li class="spotlight-content"  v-for="(item, index) in data" :key="item.id" @mouseover="isPause = true" @mouseleave="isPause = false">
            <nuxt-link :to="handleLink(item)">
              {{ item.title }}
            </nuxt-link>
        </li>
      </ul>
    </div>
  </div>


</template>
<script>
export default {
  data () {
    return {
      data: [],
      isPause: false,
      itemHeight: 20,
      indexActive: 0,
      ticketInteval: null
    }
  },
  watch: {
    break: 'contentUpdated'
  },
  computed: {
    tickerTopStyle () {
      return {
        top: this.indexActive * this.itemHeight + 'px'
      }
    }
  },
  methods: {
    contentUpdated () {
      this.removeListeners()
      this.$nextTick(() => {
        this.addListeners()
      })
    },
    next () {
      if (this.indexActive === this.data.length - 1) {
        this.indexActive = 0
      } else {
        this.indexActive++
      }

      this.resetInterval()
    },
    prev () {
      if (this.indexActive === 0) {
        this.indexActive = this.data.length - 1
      } else {
        this.indexActive--
      }
      this.resetInterval()
    },
    initTicker () {
      this.ticketInteval = setInterval(() => {
        if (!this.isPause) {
          if (this.indexActive === this.data.length - 1) {
            this.indexActive = 0
          } else {
            this.indexActive++
          }
        }
      }, 4000)
    },
    resetInterval () {
      this.$nextTick(() => {
        this.removeTicker()
        this.initTicker()
      })
    },
    removeTicker () {
      clearInterval(this.ticketInteval)
    },
    async fetchData () {
      try {
        const response = await this.$axios.$get('/home/breaking-news')
        if (response.code === 0) {
          this.data = response.data
        } else {
          this.$toast.error(response.message)
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  created () {
    this.fetchData()
  },
  mounted () {
    this.$nextTick(() => {
      this.initTicker()
    })
  },
  beforeDestroy () {
    this.removeTicker()
  }
}
</script>
<style scoped>
.spotlight-content{
  line-height: 20px;
}
@media only screen and (max-width: 767px) {
  #breaking-news .outer {
    display: block !important;
  }
}
@media (min-width: 1400px) {
  .module .container {
    padding-bottom: 1em;
  }
}
</style>
