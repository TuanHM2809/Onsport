<template>
  <div class="index no-sub">
    <!-- <special-title :mainTitle="`Long Form`"></special-title> -->
    <section class="module">
      <div class="container p-b-15">
        <page-title title="Sự kiện"></page-title>
        <div class="columns" v-if="events">
          <div class="column" v-for="event in events" :key="event.id">
            <div class="large-post">
              <blur-image :src="event.thumbnail" :alt="event.name"/>
              <div class="p-t-10" style="position: relative">
                <span class="runTime" v-if="event && event.link_type === 'VIDEO'">
                  <span class="fa fa-clock-o" style="font-size:16px"></span>
                  <time class="hidden"></time>
                  <span class=" timeStart"> {{formatMinute(event)}}</span>
                </span>
                <h4 class="news-list__headline">
                  <nuxt-link class="news-list__headline-link" :to="handleLink(event)"> {{event.name}} </nuxt-link>
                </h4>
                <div class="label-item">
                  <span class="label__timestamp">{{createdTime(event)}}</span>
                </div>
                <p v-if="event && event.description" class="news-list__snippet">{{event.description}} </p>
              </div>
            </div>
          </div>
        </div>
        <a v-if="pagination.pageLeft !== 0" @click.prevent="loadmoreEvents" class="show-more m-b-20" href="#">
          Xem tiếp</a>
      </div>
    </section>
  </div>
</template>

<script>
  import moment from 'moment'
  import PageTitle from '~/components/frontend/common/page-title.vue'
  import SpecialTitle from '~/components/frontend/common/special-title.vue'
  export default {
    name: 'events',
    data () {
      return {
      }
    },
    async fetch ({store, params, error}) {
      try {
        await Promise.all([
          store.dispatch('loadEvents', params)
        ])
        if (Object.keys(store.state.event.data).length === 0) {
          error({statusCode: 404, message: 'Trang không tồn tại'})
        }
      } catch (e) {
        error({statusCode: 404, message: e})
      }
    },
    head () {
      return {
        title: 'Sự kiện',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: 'event'
          },
          { hid: 'description', name: 'description', content: 'Sự kiện' },
          { hid: 'og:title', property: 'og:title', content: 'Sự kiện' },
          { hid: 'og:type', property: 'og:type', content: 'Sự kiện' },
          { hid: 'og:description', property: 'og:description', content: 'Sự kiện' },
          { hid: 'og:url', property: 'og:url', content: 'event' }
        ]
      }
    },
    created () {

    },
    mounted () {
    },
    components: {
      PageTitle,
      SpecialTitle
    },
    computed: {
      events () {
        return this.$store.state.event.data
      },
      pagination () {
        return this.$store.state.event.pagination
      },
      defaultParams () {
        return {
        }
      },
      nextPageParams () {
        return Object.assign({
          page: this.pagination.page + 1
        }, this.defaultParams)
      }

    },
    methods: {
      loadmoreEvents () {
        this.$store.dispatch('loadEvents', this.nextPageParams)
      },
      createdTime (event) {
        const createdAt = moment.utc(event.created_at).add(7, 'hour')
        if (!!event.created_at && !!event.start_at) {
          const publishedAt = moment.utc(event.start_at)
          if (publishedAt.isSameOrAfter(createdAt)) {
            return publishedAt.format('DD-MM-YYYY')
          } else {
            // console.log(longform.created_at)
            return createdAt.format('DD-MM-YYYY')
          }
        }
        return createdAt.format('DD-MM-YYYY')
      },
      formatMinute (event) {
        return moment.utc(event.start_at).format('HH:mm')
      }
    }
  }
</script>

<style scoped>
.index {
  padding-top: 0px;
  min-height: calc(100vh - 100px);
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
    width: 100%;
  }
}
@media (min-width: 481px) and (max-width: 767px) {
  .column {
    flex: none;
    width: 50%;
  }
}
@media screen and (min-width: 768px) {
  .column {
    flex: none;
    width: 33.3333%;
  }
}
@media screen and (min-width: 1024px) {
  .column {
    flex: none;
    width: 25%;
  }
}

.show-more {
  display: block;
  width: 100%;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  
  font-weight: 600;
  font-size: 16px;
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
  
  font-weight: bold;
  color: #666;
  margin-bottom: 2px;
  min-height: 13px;
  color: #4545a2;
  font-size: 1.1rem;
  padding: 2px 4px 6px 2px;
}
.news-list__headline,
.news-list__headline-link {
  display: inline-block;
  
  font-weight: normal;
  font-size: 22px;
  color: inherit;
  line-height: 1.13;
  margin-bottom: 2px;
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
</style>
