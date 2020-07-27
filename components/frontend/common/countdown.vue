<template>
  <ul class="vue-countdown" :class="{darkTheme: darkTheme}">
    <li v-if="days">
      <p class="digit">{{ days | twoDigits }}</p>
      <p class="text">Ngày</p>
    </li>
    <li>
      <p class="digit">{{ hours | twoDigits }}</p>
      <p class="text">giờ</p>
    </li>
    <li>
      <p class="digit">{{ minutes | twoDigits }}</p>
      <p class="text">phút</p>
    </li>
    <li>
      <p class="digit">{{ seconds | twoDigits }}</p>
      <p class="text">giây</p>
    </li>
  </ul>
</template>

<script type="text/javascript">
//import Vue from 'vue'
//Vue.filter('twoDigits', (value) => {
//    if ( value.toString().length <= 1 ) {
//        return '0'+value.toString()
//    }
//    return value.toString()
//})
let interval = null
export default {
  props: ['deadline', 'stop', 'reachEnd', 'darkTheme'],
  data () {
    return {
      now: Math.trunc((new Date()).getTime() / 1000),
      diff: 0
    }
  },
  filters: {
    twoDigits: (value) => {
      if (value.toString().length <= 1) {
        return '0' + value.toString()
      }
      return value.toString()
    }
  },
  mounted () {
    interval = setInterval(() => {
      this.now = Math.trunc((new Date()).getTime() / 1000)
    }, 1000)
  },
  computed: {
    seconds () {
      return Math.trunc(this.diff) % 60
    },
    minutes () {
      return Math.trunc(this.diff / 60) % 60
    },
    hours () {
      return Math.trunc(this.diff / 60 / 60) % 24
    },
    days () {
      return Math.trunc(this.diff / 60 / 60 / 24)
    }
  },
  watch: {
    now (value) {
      this.diff = this.deadline - this.now
      if (this.diff <= 0 || this.stop) {
        this.diff = 0
        // Remove interval
        clearInterval(interval)
        this.$emit('reachEnd')
      }
    }
  }
}
</script>
<style>
.vue-countdown {
  padding: 0;
  margin: 0;
}
.vue-countdown li {
  display: inline-block;
  margin: 0 8px;
  text-align: center;
  position: relative;
}
.vue-countdown li p {
  margin: 0;
}
.vue-countdown li:after {
  content: ":";
  position: absolute;
  top: 0;
  right: -13px;
  font-size: 32px;
}
.vue-countdown li:first-of-type {
  margin-left: 0;
}
.vue-countdown li:last-of-type {
  margin-right: 0;
}
.vue-countdown li:last-of-type:after {
  content: "";
}
.vue-countdown .digit {
  font-size: 32px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0;
}
.vue-countdown .text {
  text-transform: uppercase;
  margin-bottom: 0;
  font-size: 10px;
}
.darkTheme.vue-countdown .digit,
.darkTheme.vue-countdown .text {
  color: white;
}
</style>