<template>
  <div class="epg" :style="{height: `${height}px`}">
    <div class="epg-header">
      <span class="pre-day" @click.prevent="prevDay"> &lt; </span>
      <span>{{formatDay}}</span>
      <span class="next-day" @click.prevent="nextDay"> &gt; </span>
    </div>
    <ul v-if="data && data.length" class="epg-content" :style="{height: `${height - 40}px`}" v-loading.lock="loading">
      <li v-for="(item, index) in data" :key="item.id" :id="`program_${item.id}`" :class="{noBroadCast: noBroadCast(item.start_at)}" :style="liveProgramStyle(item)">
        <div class="col-xs-2  time-pro">
          {{ time(item.start_at) }}
        </div>
        <div class="col-xs-10 p-l-5 p-r-5" style="font-weight: inherit" @click.prevent="catchup(item)">
          <h3 v-if="item.title" :class="{'p-t-5': !item.description}" style="font-weight: inherit">{{ item.title}}</h3>
          <h4 v-if="item.description" style="font-weight: inherit">
            <i>{{ item.description}}</i>
          </h4>
        </div>
      </li>
    </ul>
    <ul v-else :style="{height: `${height - 40}px`}">
      <li class="no_program">
        Hiện tại không lịch phát sóng
      </li>
    </ul>
  </div>
</template>
<script>
import moment from 'moment'
import _ from 'lodash'

export default{
  data () {
    return {
      data: [],
      day: moment.utc().add(7, 'hour').format('YYYY-MM-DD'),
      liveProgram: null,
      interval: -1
    }
  },
  props: {
    height: {
      type: Number,
      required: true
    },
    today: {
      default: '2017-12-01'
    },
    schedules: {
      type: Array,
      required: true
    }
  },
  computed: {
    formatDay () {
      return moment(this.day).format('DD/MM/YYYY')
    }
  },
  methods: {
    async fetchData () {
      this.data = []
      this.loading = true
      try {
        const response = await this.$axios.$get(`live-channels/${this.$route.params.id}`, {
          params: {
            start_date: this.day ? this.day : this.today,
            end_date: this.day ? this.day : this.today
          }
        })
        if (response.code === 0) {
          this.data = response.data.schedules
          this.interValUpdate()
        } else {
          this.$toasted.error(response.message)
        }
        this.loading = false
      } catch (e) {
        this.$toasted.error(e)
      }
    },
    time (value) {
      return moment(value).utc().format('HH:mm ')
    },
    noBroadCast (startAt) {
      return moment(startAt).isAfter(moment().add(7, 'hour'))
    },
    nextDay () {
      this.day = moment(this.day).add(1, 'day').format('YYYY-MM-DD')
    },
    prevDay () {
      this.day = moment(this.day).subtract(1, 'day').format('YYYY-MM-DD')
    },
    scrollToSelected () {
      if (this.liveProgram && this.liveProgram.id && this.data) {
        this.$scrollTo(
          `#program_${this.liveProgram.id}`,
          0,
          {
            offset: -200,
            container: '.epg-content'
          })
      }
    },
    updateLiveProgram () {
      if (this.data) {
        const liveProgram = _.find(this.data, (program) => {
          return moment.utc().add(7, 'hour').isBetween(moment(program.start_at), moment(program.end_at))
        })
        this.liveProgram = liveProgram
      }
    },
    liveProgramStyle (program) {
      if (this.data && this.liveProgram && this.liveProgram.id === program.id) {
        return {
          fontWeight: 'bold',
          color: '#4545a2',
          borderBottomWidth: '2px',
          borderBottomColor: '#4545a2'
        }
      }
    },
    interValUpdate () {
      this.interval = setInterval(() => {
        this.updateLiveProgram()
      }, 60000)
    },
    catchup (item) {
      // console.log(item)
      if (!this.noBroadCast(item.start_at)) {
        let {start_at, end_at} = item
        let startTime = moment.utc(start_at).subtract(7, 'hour').unix()
        let stopTime = moment.utc(end_at).subtract(7, 'hour').unix()

        this.$emit('catchup', { startTime: startTime, stopTime: stopTime })
        this.liveProgram = item
      }
    }
  },
  created () {
    this.data = this.schedules
  },
  watch: {
    day () {
      this.fetchData()
    },
    liveProgram () {
      this.scrollToSelected()
    },
    data () {
      this.updateLiveProgram()
    }
  },
  beforeUpdate () {
    clearInterval(this.interval)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style scoped>
.epg {
  height: 400px;
  position: relative;
}
.epg-header {
  /* position: absolute;
  top: 0;
  left: 0;
  width: 100%; 
  padding: 10px;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #4545a2;
  color: white;
}
.pre-day,
.next-day {
  cursor: pointer;
  padding: 10px;
}
.epg-content {
  overflow-y: auto;
  height: 360px;
}
ul,
ul li {
  overflow: auto;
}
ul li {
  font-family: "OnSport", sans-serif;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
ul li.selected_program {
  font-weight: bold;
  color: #4545a2;
}
.time-pro {
  padding: 5px 5px 5px 0;
  vertical-align: middle;
  color: #363636;
  font-size: 14px;
}
.noBroadCast .time-pro,
.noBroadCast h3,
.noBroadCast h4 {
  color: #ccc;
  cursor: default;
}
ul li h3,
ul li h4 {
  font-family: "OnSport", sans-serif;
  margin: 0;
  padding: 0 0;
  color: inherit;
  font-size: 13px;
}
ul li h4 {
  font-size: 15px;
}
ul li.no_program {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  text-align: center;
  border-bottom: none;
  transform: translate(-50%, -50%);
}
</style>
