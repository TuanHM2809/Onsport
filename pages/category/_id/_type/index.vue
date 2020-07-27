<template>
  <div class="cate-type">
    <div class="index no-sub">
      <section class="module">
        <div class="container p-b-15">
          <page-title :title="category.name" />
          <p v-if="category.description">{{category.description}}</p>
          <div class="row" v-infinite-scroll="loadmoreCategory" infinite-scroll-disabled="loading" infinite-scroll-distance="10" infinite-scroll-throttle-delay="500">
            <div v-if="category.items && category.items.length > 0">
              <div class="columns">
                <div class="column" v-for="item in sortByStartAt(category.items)" :key="item.id">
                  <div class="large-post">
                    <nuxt-link :to="handleLink(item)">
                      <blur-image :src="item.thumbnail" :alt="item.name" />
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
              <div class="col-xs-12 p-b-20">
                <a style="display:none" v-if="pagination && pagination.pageLeft !== 0" @click.prevent="loadmoreCategory" class="show-more" href="#">
                  Xem tiếp</a>
                <div>
                  <loading style="margin: 10px auto" :status="loading" :clockwise="true" :size="40" :speed="0.5"></loading>
                </div>
              </div>
            </div>
            <div v-else>
              <p class="text-center">Không có bài viết nào</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import PageTitle from '~/components/frontend/common/page-title.vue'
  import moment from 'moment'
  import _ from 'lodash'
  export default {
    name: 'category-type-detail',
    validate ({ params }) {
      return (!!params.id)
    },
    data () {
      return {
        page: 1,
        pageSize: 48,
        loading: false
      }
    },
    async asyncData ({app, params, error}) {
      try {
        const response = await app.$axios.get(`categories/${params.id}/withEvent`, {
          params: {
            page: 1,
            pageSize: 48,
            type: params.type || null
          }
        })
        const success = !!response.status && response.data && Object.is(response.data.code, 0)
        if (success) {
          return {category: response.data.data, pagination: response.data.pagination}
        } else {
          error({statusCode: 404, message: 'Không lấy được dữ liệu'})
        }
      } catch (e) {
        console.log(e)
        return {category: null, pagination: null}
      }
    },

    head () {
      let post = this.category
      return {
        title: post ? `${post.name} ` : 'Sôi động trong nước',
        meta: [
          { hid: 'og:title', property: 'og:title', content: post && post.name ? post.name : '' },
          { hid: 'og:type', property: 'og:type', content: 'video' },
          { hid: 'og:image:width', property: 'og:image:width', content: '512' },
          { hid: 'og:image:height', property: 'og:image:height', content: '288' }
        ]
      }
    },
    created () {

    },
    mounted () {
      this.fetchRelate()
    },
    components: {
      PageTitle
    },
    computed: {
      isMobile () {
        return this.$store.state.size.isMobile
      },
      noData () {
        return Object.is(this.category.items.length)
      },
      defaultParams () {
        return {
          type: this.$route.params.type
        }
      },
      nextPageParams () {
        return Object.assign({
          page: this.pagination.page + 1,
          pageSize: this.pagination.pageSize
        }, this.defaultParams)
      }
    },
    methods: {
      async loadmoreCategory () {
        if (this.pagination.pageLeft > 0) {
          this.loading = true
          try {
            const response = await this.$axios.get(`categories/${this.$route.params.id}/withEvent`, {
              params: {
                ...this.nextPageParams
              }
            })
            const success = !!response.status && response.data && Object.is(response.data.code, 0)
            if (success) {
              this.category.items = this.category.items.concat(response.data.data.items)
              this.pagination = response.data.pagination
            }
          } catch (e) {
            return {category: null, pagination: null}
          }
          this.loading = false
        }
      },
      async fetchRelate () {
        try {
          const response = await this.$axios.$get('/posts', {
            page: 1,
            pageSize: 12
          })
          if (response.code === 0) {
            this.relate = response.data
          }
        } catch (e) {
          console.log(e)
        }
      },
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
      },
      sortByStartAt (array) {
        return _.orderBy(array, ['start_at'], ['desc']) // hot fix 11/05/2018
      }
    }
  }
</script>

<style scoped>
.show-more {
  display: block;
  width: 100%;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  
  font-weight: 600;
  font-size: 18px;
  color: inherit;
  background: none;
  border: 1px solid #dcdcdc;
  color: #333;
  user-select: none;
  text-align: center;
  cursor: pointer;
  -webkit-appearance: none;
  line-height: 1.4em;
  -webkit-font-smoothing: antialiased;
}
.show-more:hover {
  background-color: #f4f4f4;
}
.index {
  padding-top: 0px;
  min-height: calc(100vh - 100px);
}

.row.no-gutter [class*="col-"]:nth-child(odd) {
  padding-left: 0;
}

.row.no-gutter [class*="col-"]:nth-child(even) {
  padding-right: 0;
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
  height: 40px;
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
