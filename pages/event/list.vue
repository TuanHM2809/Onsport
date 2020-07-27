<template>
  <div class="index video-list">
    <section class="module">
      <div class="container p-b-15" v-if="data">
        <page-title style="width:100%" :title="data.title" />
        <div class="page-block-wrapper" v-for="category in data.page_block_items" :key="category.id">
          <header>
            <h2 class="subHeader">{{category.name}}
            <nuxt-link class="btn moreBtn" :to="`/category/${category.slug}/event`">Xem toàn bộ</nuxt-link>
            </h2>
          </header>

          <div class="columns">
            <div class="column" v-for="item in category.items.slice(0,6)" :key="item.id">
              <div class="large-post">
                <nuxt-link :to="handleLink(item)">
                  <blur-image :src="item.thumbnail" :alt="item.name"/>
                </nuxt-link>
                <div class="p-t-10" style="position: relative">
                  <span class="runTime" v-if="item && item.duration">
                    <span class="fa fa-clock-o" style="font-size:16px"></span>
                    <time class="hidden"></time>
                    <span class=" timeStart"> {{mmss(item.duration)}}</span>
                  </span>
                  <h4 class="news-list__headline">
                    <nuxt-link class="news-list__headline-link" :to="handleLink(item)"> {{item.name}} </nuxt-link>
                  </h4>
                  <div class="label-item">
                    <span class="label__timestamp">{{createdTime(item)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'
import PageTitle from '~/components/frontend/common/page-title.vue'
export default {
  head () {
    const data = this.data
    return {
      title: data && data.title ? data.title : 'Sự kiện'
    }
  },
  async asyncData ({app}) {
    try {
      let { data } = await app.$axios.$get(`/home/event`)
      return {data}
    } catch (e) {
      return {
        data: {}
      }
    }
    // return { title: data.title }
  },
  methods: {
    createdTime (event) {
      const createdAt = moment.utc(event.created_at).add(7, 'hour')
      return createdAt.format('DD-MM-YYYY')
    },
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
  components: {
    PageTitle
  }
}
</script>

<style scoped>
.index {
  padding-top: 0px;
  min-height: calc(100vh - 100px);
}
.page-block-wrapper {
  position: relative;
}
.moreBtn {
  text-align: center;
  cursor: pointer;
  top: 0;
  font-size: 14px;
  text-decoration: underline;
  font-weight: normal;
  color: #888;
  text-transform: uppercase;
  padding: 0 12px;
}

a.btn.moreBtn {
    cursor: pointer;
}
.moreBtn:hover,
.moreBtn:focus,
.moreBtn:hover {
  text-decoration: none;
}

.index.video-list header:not(:last-child) {
  margin-bottom: 20px;
  height: auto;
}
.video-list header:before {
  content: "";
  display: block;
}
.video-list header .subHeader {
  margin-bottom: 0;
  font-weight: 500;
  margin-bottom: 10px;
  position: relative;
  clear: both;
  line-height: 1.2;
}
.columns {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}
.columns:not(:last-child) {
  margin-bottom: calc(1.5rem - 0.75rem);
}
.column {
  flex: none;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}
@media screen and (max-width: 480px) {
  .column {
    flex: none;
    width: 50%;
  }
  .news-list__headline,
  .news-list__headline-link {
    font-size: 14px !important;
  }
  .moreBtn {
    position: relative;
    clear: both;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .column {
    flex: none;
    width: 50%;
  }
  .news-list__headline,
  .news-list__headline-link {
    font-size: 18px !important;
  }
}
@media screen and (min-width: 768px) {
  .column {
    flex: none;
    width: 33.33%;
  }
  .news-list__headline,
  .news-list__headline-link {
    font-size: 18px !important;
  }
}

.label-item {
  white-space: nowrap;
  overflow: hidden;
  line-height: 1;
}
.news-list__body > .label-item {
  margin-top: -3px;
  margin-bottom: -3px;
}
.label__tag,
.label__timestamp,
.label__url {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  vertical-align: middle;
  padding: 6px 4px 6px 2px;
}
.label__tag {
  
  font-weight: normal;
  font-size: 14px;
  color: #214cb8;
  border-right: 12px solid transparent;
  background-clip: padding-box !important;
  max-width: 270px;
}
.label__timestamp {
    font-weight: normal;
    font-size: 12px;
    color: #666;
    margin: 5px 0 !important;
}
.news-list__headline,
.news-list__headline-link {
    display: inline-block;
    font-weight: normal;
    font-size: 18px;
    color: #212529;
    font-weight: 700;
    line-height: 1.13;
    margin-bottom: 2px;
    height:40px;
}
.news-list__headline:hover,
.news-list__headline-link:hover {
  color: #4545a2;
}
.news-list__snippet {
  
  font-weight: normal;
  font-size: 16px;
  color: #333;
  margin-bottom: -5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* number of lines to show */
}
.label-item .label__tag:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.runTime {
  position: absolute;
  left: 1rem;
  bottom: calc(100% + 1rem);
  background: #4545a2;
  color: #fff;
  font-size: 0.8rem;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  line-height: 2.4rem;
}
.runTime .fa {
  margin: 0 0.6rem 0 0.8rem;
  display: inline-block;
  vertical-align: middle;
  position: static;
}
.runTime time {
  display: inline-block;
  vertical-align: middle;
  margin-right: -2px;
  padding: 0.1rem 0.8rem;
  background: rgba(69, 69, 162, 0.7);
  font-size: 15px;
}
.runTime .timeStart {
  background: #38003c;
  font-size: 15px;
  font-weight: 700;
  vertical-align: middle;
  padding: 1px 8px;
}

.wrap:hover:after{background:rgba(0,0,0,.25); -o-transition:.2s; -ms-transition:.2s; -moz-transition:.2s; -webkit-transition:.2s}
.wrap{position:relative}
.wrap:after,.news-photo:after{content:""; background:rgba(0,0,0,0); width:100%; height:100%; position:absolute; top:0; left:0}
.wrap:hover:after{background:rgba(0,0,0,.25); -o-transition:.2s; -ms-transition:.2s; -moz-transition:.2s; -webkit-transition:.2s}
.news-photo:before{content:""}
.wrap:before{content:"\f04b"; width:64px; height:64px; line-height:64px; padding:0 22px; color:#fff; border-radius:100%; border:2px solid rgba(255,255,255,.5);
background:rgba(0,0,0,.65); position:absolute; top:50%; left:50%; margin:-32px 0 0 -32px; z-index:1; font-family:FontAwesome;
    font-size:26px;
    text-rendering:auto;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;}
.wrap:hover:before{border:2px solid rgba(255,255,255,.85); -o-transition:.2s; -ms-transition:.2s; -moz-transition:.2s; -webkit-transition:.2s}
.news-photo:before{content:"\f030"; position:absolute; left:15px; bottom:8px; font-family:FontAwesome; z-index:1;
    font-size:19px; color:#fff;
    text-rendering:auto;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;}
</style>
