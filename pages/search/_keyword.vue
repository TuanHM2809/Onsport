<template>
  <div class="index no-sub">
    <section class="module">
      <div class="container p-t-15 p-b-15">
        <div class="row">
          <div class="col-sm-8 ">
            <div class="page-filters">
              <div class="page-filters__header">
                <h3 class="page-filters__title">
                  <span>{{ textTarget }}</span>
                </h3>
                <a class="page-filters__button" href="#" @click.prevent="showFilter = !showFilter" style="pointer-events: auto;">Lọc theo</a>
              </div>
              <div class="page-filters__frame">
                <div class="page-filters__body" ref="filterBody" :class="{'page-filters__body--open' : showFilter}" :style="pageFitlerBodyStyle">
                  <div class="page-filters__filter">
                    <ul class="page-filters__filter-body">
                      <li class="page-filters__filter-item" v-for="filter in filters" :key="filter.key">
                        <a class="page-filters__filter-link" :class="{'page-filters__filter-link--active': filter.key === filterActiveKey}" @click.prevent="filterActiveKey = filter.key" href="#">
                          {{ filter.title}}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="row page-filters__offset" :style="pageOffsetStyle">
              <div v-if="result && result.length > 0">
                <div class="col-xs-12" v-for="item in result" :key="item.id">
                  <items :data="item" />
                </div>
              </div>
              <div v-else>
                <p class="text-center"> Không có kết quả với từ khóa: "{{ $route.params.keyword }}"</p>
              </div>
            </div>
            <a v-if="pagination && pagination.pageLeft !== 0" @click.prevent="loadMore" class="show-more m-b-20" href="#">
              Xem tiếp</a>
          </div>
          <div class=" col-sm-4  p-l-0 hidden-xs">
            <div>
              <cate-title title="Có thể bạn quan tâm " :arrow="false "></cate-title>
              <horizontal-item bigImage :data='i' v-for="i in relate " :key="i.id " />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import CateTitle from '~/components/frontend/common/cate-title.vue'
  import PageTitle from '~/components/frontend/common/page-title.vue'
  import VerticalItem from '~/components/frontend/common/vertical-item.vue'
  import HorizontalItem from '~/components/frontend/common/horizontal-item.vue'
  import Items from '~/components/frontend/category/horizontal-item.vue'
  // import _ from 'lodash'
  export default {
    name: 'search-keyword',
    validate ({params}) {
      return (!!params.keyword)
    },
    data () {
      return {
        showFilter: false,
        filters: [
          {
            title: 'Tất cả',
            key: 'all'
          },
          {
            title: 'Bài viết',
            key: 'article'
          },
          {
            title: 'Video',
            key: 'video'
          },
          {
            title: 'Gallery',
            key: 'gallery'
          }
        ],
        filterActiveKey: 'all',
        relate: []
      }
    },
    async fetch ({store, params, error}) {
      const query = params.keyword
      try {
        await store.dispatch('search', {query})
        // if (Object.keys(store.state.search.data).length === 0) {
        //   error({statusCode: 404, message: 'Trang không tồn tại'})
        // }
      } catch (e) {
        error({statusCode: 404, message: e})
      }
    },
    head () {
      // const keyword = params.keyword
      // const title = slug.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
      return {
        title: `Tìm kiếm`
      }
    },
    created () {
  
    },
    mounted () {
      this.fetchRelate()
    },
    components: {
      CateTitle,
      VerticalItem,
      HorizontalItem,
      PageTitle,
      Items
    },
    computed: {
      result () {
        switch (this.filterActiveKey) {
          case 'all':
            return this.all
          case 'video':
            return this.video
          case 'gallery':
            return this.gallery
          case 'article':
            return this.article
          default:
            return this.all
        }
      },
      all () {
        return this.$store.state.search.data
      },
      article () {
        return this.$store.state.search.data.filter(e => {
          return e.item_type === 'article'
        })
      },
      video () {
        return this.$store.state.search.data.filter(e => {
          return e.item_type === 'file'
        })
      },
      gallery () {
        return this.$store.state.search.data.filter(e => {
          return e.item_type === 'gallery'
        })
      },
      pagination () {
        return this.$store.state.search.pagination
      },
      defaultParams () {
        return {
          query: this.$route.params.keyword
        }
      },
      nextPageParams () {
        return Object.assign({
          page: parseInt(this.pagination.page) + 1
        }, this.defaultParams)
      },
      textTarget () {
        return `Tìm kiếm : "${this.$route.params.keyword}"`
      },
      pageFitlerBodyStyle () {
        return {
          'visibility': this.showFilter ? 'visible' : 'none'
        }
      },
      pageOffsetStyle () {
        const offset = this.showFilter ? this.$refs.filterBody.getBoundingClientRect().height : 0
        return {
          'transform': `translateY(${offset}px)`,
          'margin-bottom': `${offset}px`
        }
      }
    },
    methods: {
      loadMore () {
        this.$store.dispatch('search', this.nextPageParams)
      },
      async fetchRelate () {
        try {
          const response = await this.$axios.$get('/posts', {
            page: 1,
            pageSize: 8
          })
          if (response.code === 0) {
            this.relate = response.data
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped>
.author-header {
  display: flex;
}
.author-header .img-blockquote {
  flex-basis: 90px;
  position: relative;
  padding-right: 20px;
}
.author-header .img-blockquote .avatar-halo {
  display: inline-block;
  color: #03a87c !important;
  fill: #03a87c !important;
  position: absolute !important;
  width: calc(82px);
  height: calc(82px);
  top: -6px;
  left: -6px;
}
.author-header .author-title {
  flex: 1;
}

.index {
  padding-top: 0px;
  min-height: calc(100vh - 100px);
}
.row {
  margin-left: -15px;
  margin-right: -15px;
}
.page-filters {
  position: relative;
  padding-top: 12px;
  margin-bottom: 18px;
}
.page-filters__header {
  display: table;
  width: 100%;
  border-bottom: 1px solid #dcdcdc;
}
.page-filters__title {
  display: table-cell;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  top: -7px;
  vertical-align: middle;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 26px;
  color: inherit;
  width: 100%;
}
.page-filters__button {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  background: white;
  border: 1px solid #dcdcdc;
  border-radius: 9px 9px 0 0;
  padding: 6px 12px;
  white-space: nowrap;
  border-bottom: 0;
  cursor: pointer;
  pointer-events: none;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 18px;
  color: #214cb8;
}
.page-filters__frame {
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  overflow: hidden;
}
.page-filters__body {
  background: #f4f4f4;
  transform: translateY(-100%);
  transition: transform 0.33s ease-in-out;
  visibility: hidden;
  padding: 10px;
  border-bottom: 1px solid #dcdcdc;
}
.page-filters__body--open {
  transform: translateY(0);
  display: block !important;
}
.page-filters__filter:last-of-type {
  border-bottom: 0;
  padding-bottom: 0;
}
.page-filters__filter:first-child {
  padding-top: 6px;
}
.page-filters__filter-head {
  padding: 0 6px;
  margin-bottom: 4px;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 22px;
  color: inherit;
}
.page-filters__filter-body {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0;
}
.page-filters__filter-item {
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 18px;
  text-align: center;
  color: inherit;
  margin: 0;
  margin-bottom: 2px;
  list-style: none;
  display: block;
  width: 100%;
  flex: 1;
}
.page-filters__filter-link {
  display: inline-block;
  padding: 5px 6px 0;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
}
.page-filters__filter-link--active {
  font-family: "OnSport", sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: inherit;
  border-bottom: 2px solid red;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: -ms-fit-content;
  pointer-events: none;
}
.page-filters__offset {
  -webkit-transition: -webkit-transform 0.33s ease-in-out;
  -moz-transition: -moz-transform 0.33s ease-in-out;
  transition: transform 0.33s ease-in-out;
  position: relative;
  z-index: 2;
}
.show-more {
  display: block;
  width: 100%;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  font-family: "OnSport", sans-serif;
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

.promo-block-single__link {
  display: block;
  background: #fff;
}
.promo-block-single__body {
  padding: 18px;
  padding-top: 14px;
}
.promo-block-single__headline {
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 22px;
  color: inherit;
  line-height: 1.1;
  margin: 1px 0 5px;
}
.on-pundit__figure-image {
  display: block;
  margin: 20px auto;
  width: 50%;
  border: 5px solid #fff;
  background: #fff;
  border-radius: 50%;
}
@media (max-width: 640px) {
  .page-filters__title {
    font-size: 18px;
  }
  .page-filters__title {
    top: 0;
  }
  .page-filters__filter-item,
  .page-filters__button,
  .page-filters__filter-link--active {
    font-size: 14px;
  }
}
</style>
