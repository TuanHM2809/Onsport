<template>
  <div class="index no-sub">
    <!-- <special-title :mainTitle="`Long Form`"></special-title> -->
    <section class="module">
      <div class="container p-b-15">
        <page-title title="Long Form"></page-title>
        <div class="columns" v-if="longforms">
          <div class="column" v-for="longform in longforms" :key="longform.id">
            <div class="large-post">
              <blur-image :src="longform.thumbnail" :alt="longform.title" />
              <div>
                <div class="label-item">
                  <nuxt-link v-if="longform.pundit && longform.pundit.length > 0" :to="handleLink({item_type: 'pundit', slug: longform.pundit.slug})" class="label__tag">{{ longform.pundit.name }}</nuxt-link>
                  <span v-else-if="longform.author && longform.author.length > 0">

                    <span class="label__timestamp" v-if="longform.created_at">{{createdTime(longform)}}</span>

                    <span v-for="(au, auIndex) in longform.author" :key="au.id">
                      <nuxt-link class="label__tag" style="border-right: none" :to="handleLink({item_type: 'author', slug: au.slug})">{{ au.name }}</nuxt-link>
                      <span v-if="auIndex < longform.author.length - 1"> - </span>
                    </span>
                  </span>
                  
                </div>
                <h4 class="news-list__headline">
                  <nuxt-link class="news-list__headline-link" :to="handleLink(longform)"> {{longform.title}} {{ longform.short_title ? ' - ': ''}} {{ longform.short_title}} </nuxt-link>
                </h4>
                <p v-if="longform && longform.short_description" class="news-list__snippet">{{longform.short_description || longform.description}} </p>
              </div>
            </div>
          </div>
        </div>
        <a v-if="pagination.pageLeft !== 0" @click.prevent="loadmodeLongForm" class="show-more m-b-20" href="#">
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
    name: 'longform-list',
    data () {
      return {
      }
    },
    async fetch ({store, params, error}) {
      try {
        await Promise.all([
          store.dispatch('loadLongForm', params)
        ])
        if (Object.keys(store.state.longform.data).length === 0) {
          error({statusCode: 404, message: 'Trang không tồn tại'})
        }
      } catch (e) {
        error({statusCode: 404, message: e})
      }
    },
    head () {
      return {
        title: 'Longform',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: 'Longform, On Sports, Thể thao, Bóng đá'
          },
          { hid: 'description', name: 'description', content: 'Longform' },
          { hid: 'og:title', property: 'og:title', content: 'Longform' },
          { hid: 'og:type', property: 'og:type', content: 'Longform' },
          { hid: 'og:description', property: 'og:description', content: 'Longform' },
          { hid: 'og:url', property: 'og:url', content: 'longform' }
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

      longforms () {
        return this.$store.state.longform.data
      },
      pagination () {
        return this.$store.state.longform.pagination
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
      loadmodeLongForm () {
        this.$store.dispatch('loadLongForm', this.nextPageParams)
      },
      createdTime (longform) {
        const createdAt = moment.utc(longform.created_at).add(7, 'hour')
        if (!!longform.created_at && !!longform.date) {
          const publishedAt = moment.utc(longform.date)
          if (publishedAt.isSameOrAfter(createdAt)) {
            return publishedAt.format('HH:mm | DD-MM-YYYY')
          } else {
            // console.log(longform.created_at)
            return createdAt.format('HH:mm | DD-MM-YYYY')
          }
        }
        return createdAt.format('HH:mm | DD-MM-YYYY')
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
  font-size: 12px;
  color: #ff7800 !important;
  position: relative;
  border-right: 12px solid transparent;
  background-clip: padding-box !important;
  max-width: 270px;
  margin: 10px 0 !important;
}
.label__timestamp {
  
  font-weight: normal;
  font-size: 12px;
  color: #666;
  margin: 10px 0 !important;
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
}
.news-list__headline:hover,
.news-list__headline-link:hover {
  color: #4545a2;
}
.news-list__snippet {
  
  font-weight: normal;
  font-size: 14px;
  color: #333;
  /* margin-bottom: -5px; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  padding: 5px 0 0 0;
}

.label__tag:hover {
  text-decoration: underline;
}
</style>