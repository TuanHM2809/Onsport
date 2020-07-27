<template>
  <div class="index no-sub">
    <section class="module">
      <div class="container p-t-15 p-b-15">
        <page-title v-if="pundit && pundit.name" :title="pundit.name" />
        <div class="row">
          <div class="col-sm-8">
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
                  <items :data="item" :pundit="pundit" />
                </div>
              </div>
              <div v-else>
                <p class="text-center">
                  Hiện tại chưa có bài viết nào
                </p>
              </div>
              <div class="col-xs-12 p-b-20">
                <a v-if="pagination && pagination.pageLeft !== 0" @click.prevent="loadmorePundit" class="show-more" href="javascript:void(0)">
                  Xem tiếp</a>
              </div>
            </div>
            <!-- <a class="show-more" href="#">
              Xem tiếp</a>
              -->
          </div>
          <div class=" col-sm-4 ">

            <div class="m-b-20">
              <cate-title title="Thông tin chuyên gia" :arrow="false " />
              <a class="promo-block-single__link" href="">
                <div class="promo-block-single__figure ">
                  <blur-image :aspectRatio="1" :title="pundit.name" class="promo-block-single__image on-pundit__figure-image" :src="pundit.avatar" />
                </div>
                <div class="promo-block-single__body">
                  <h3 class="promo-block-single__headline">
                    {{ pundit.name}}
                  </h3>
                  <div v-if="pundit && pundit.bio" v-html="pundit.bio"></div>
                </div>
              </a>
            </div>
            <div v-if="pundits && pundits.length >0">
              <cate-title title="Có thể bạn quan tâm " :arrow="false "></cate-title>
              <horizontal-item :aspectRatio="1" :data="i" v-for="i in theOtherPundits" :key="i.id" />
              <p class="pull-right">
                <nuxt-link :to="{path: '/pundit'}">Xem toàn bộ
                  <i class="fa fa-angle-double-right"></i>
                </nuxt-link>
              </p>
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
  import HorizontalItem from '~/components/frontend/pundits/horizontal-item.vue'
  import Items from '~/components/frontend/category/horizontal-item.vue'
  // import _ from 'lodash'
  export default {
    name: 'pundit-detail',
    validate ({params}) {
      return (!!params.id)
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
        filterActiveKey: 'all'
      }
    },
    async fetch ({store, params, error}) {
      try {
        await Promise.all([
          store.dispatch('loadPundit', params),
          store.dispatch('loadPundits')
        ])
        // console.log(store.state.pundit.detail.data)
        if (Object.keys(store.state.pundit.detail.data.data).length === 0) {
          error({statusCode: 404, message: 'Trang không tồn tại'})
        }
      } catch (e) {
        error({statusCode: 404, message: e})
      }
    },
    head () {
      // const title = 'Demo Category'
      // const title = slug.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
      return {
        title: `${this.pundit.name}` || 'Chuyên gia'
      }
    },
    created () {
  
    },
    mounted () {
      // this.filterActiveId = this.pundit.id
    },
    components: {
      CateTitle,
      VerticalItem,
      HorizontalItem,
      PageTitle,
      Items
    },
    computed: {
      pundit () {
        return this.$store.state.pundit.detail.data.data
      },
      pagination () {
        return this.$store.state.pundit.detail.data.pagination
      },
      items () {
        return this.$store.state.pundit.detail.data.data.items
      },
      pundits () {
        return this.$store.state.pundit.total.data
      },
      theOtherPundits () {
        return this.pundits.filter(p => {
          return p.id !== this.pundit.id
        })
      },
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
        return this.$store.state.pundit.detail.data.data.items
      },
      article () {
        return this.$store.state.pundit.detail.data.data.items.filter(e => {
          return e.item_type === 'article' || e.item_type === 'post'
        })
      },
      video () {
        return this.$store.state.pundit.detail.data.data.items.filter(e => {
          return e.item_type === 'file' || e.item_type === 'video'
        })
      },
      gallery () {
        return this.$store.state.pundit.detail.data.data.items.filter(e => {
          return e.item_type === 'gallery'
        })
      },
      defaultParams () {
        return {
          id: this.pundit.slug
        }
      },
      nextPageParams () {
        return Object.assign({
          page: this.pagination.page + 1
        }, this.defaultParams)
      },
      textTarget () {
        return this.filters.find(e => {
          return e.key === this.filterActiveKey
        }).title
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
          'padding-bottom': `${offset}px`
        }
      }
    },
    methods: {
      loadmorePundit () {
        this.$store.dispatch('loadPundit', this.nextPageParams)
      },
      async changePundit (id) {
        // await this.$store.dispatch('loadPundit', {id: id})
        this.$router.push({name: 'pundit-id', params: {id: id}})
      }
    }
  }
</script>

<style scoped>
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
  padding: 10px 18px;
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
  margin-bottom: 4px;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 22px;
  color: inherit;
}
.page-filters__filter-body {
  display: flex;
  flex-wrap: wrap;
}
.page-filters__filter-item {
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 18px;
  color: inherit;
  margin: 0;
  list-style: none;
  display: inline-block;
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
