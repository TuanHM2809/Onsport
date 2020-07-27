<template>
  <div class="module">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <page-title :title="`Danh sách trận đấu`"></page-title>
        </div>
        <div class="col-sm-8">
          <div class="page-filters">
            <div class="page-filters__header">
              <h3 class="page-filters__title">
                <span class="swap-text--bp30" title="Latest">
                  <span class="swap-text__target">Tất cả giải đấu</span>
                </span>
              </h3>
              <a class="page-filters__button" href="#" @click.prevent="showFilter = !showFilter" style="pointer-events: auto;">Tất cả</a>
            </div>
            <div class="page-filters__frame">
              <div class="page-filters__body" ref="filterBody" :class="{'page-filters__body--open' : showFilter}" :style="pageFitlerBodyStyle">
                <div class="page-filters__filter">
                  <ul class="page-filters__filter-body">
                    <li class="page-filters__filter-item" v-for="tour in tournaments" :key="tour.id">
                      <nuxt-link :to="handleLink({item_type: 'livescore',id:tour.id })" class="page-filters__filter-link" :class="{'page-filters__filter-link--active': tour.id === $route.params.id}">
                        {{ tour.name}}
                      </nuxt-link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <list-match :style="pageOffsetStyle" class="page-filters__offset" :data="matches"></list-match>
          <a v-loading="loadingMore" v-if="pagination && pagination.pageLeft !== 0" @click.prevent="loadmoreMatches" class="show-more m-b-20" href="#">
            Xem tiếp</a>
        </div>
        <div class="col-sm-4">
          <board></board>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import PageTitle from '~/components/frontend/common/page-title.vue'
import ListMatch from '~/components/frontend/livescore/list-match.vue'
import Board from '~/components/frontend/livescore/board.vue'
import moment from 'moment'
export default {
  data () {
    return {
      showFilter: false
    }
  },
  async fetch ({store, params, error}) {
    try {
      await Promise.all([
        store.dispatch('loadTournaments'),
        store.dispatch('loadMatches', params)
      ])
      // console.log(store.state.pundit.detail.data)
      if (Object.keys(store.state.livescore.detail.data.data).length === 0) {
        error({statusCode: 404, message: 'Trang không tồn tại'})
      }
    } catch (e) {
      error({statusCode: 404, message: e})
    }
  },
  head () {
    return {
      title: 'Lịch thi đấu, kết quả trận đấu - Onsports',
      meta: [
        { hid: 'description', name: 'description', content: 'ON Sports, cập nhật nhanh tin tức thể thao trong nước và thế giới trong ngày. Thông tin đầy đủ, hình ảnh, video chi tiết kết quả các môn thi thể thao mới nhất' },
        { hid: 'og:title', property: 'og:title', content: 'ON Sports - Trang tin tức bóng đá nhanh và chính xác nhất' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:description', property: 'og:description', content: 'ON Sports, cập nhật nhanh tin tức thể thao trong nước và thế giới trong ngày. Thông tin đầy đủ, hình ảnh, video chi tiết kết quả các môn thi thể thao mới nhất' },
        { hid: 'og:url', property: 'og:url', content: 'http://onsports.vn' },
        { hid: 'og:image', property: 'og:image', content: 'http://onsports.vn/logo16x9.png' },
        { hid: 'og:image:alt', property: 'og:image:alt', content: 'ONSports.vn' },
        { hid: 'og:image:width', property: 'og:image:width', content: '160' },
        { hid: 'og:image:height', property: 'og:image:height', content: '90' }
      ]
    }
  },
  computed: {
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
    },
    matches () {
      return this.$store.state.livescore.detail.data.data
    },
    tournaments () {
      return this.$store.state.tournament.all.data
    },
    pagination () {
      return this.$store.state.livescore.detail.data.pagination
    },
    loadingMore () {
      return this.$store.state.livescore.detail.fetching
    },
    defaultParams () {
      return {
        end_date: moment().format('YYYY-MM-DD')
      }
    },
    nextPageParams () {
      return Object.assign({
        page: this.pagination.page + 1
      }, this.defaultParams)
    }
  },
  methods: {
    loadmoreMatches () {
      this.$store.dispatch('loadMatches', this.nextPageParams)
    }
  },
  components: {
    ListMatch,
    PageTitle,
    Board
  }
}
</script>
<style scoped>
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
  font-size: 16px;
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
}
.page-filters__filter-item {
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 16px;
  color: inherit;
  margin: 0;
  list-style: none;
  display: block;
  width: 100%;
  text-align: left;
  flex-basis: 50%;
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
  font-size: 16px;
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
