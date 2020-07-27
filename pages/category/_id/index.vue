<template>

  <div class="cate-type">

    <!--begin on-ads-->
    <div class="on-ads">
      <div class="container">
        <a target="_blank" href="#">
          <img src="@/assets/img/onsports_banner_1140_90.jpg">
        </a>
      </div>
    </div>
    <!--end on-ads-->


    <div class="on-main" v-if="category.children.length > 0">
      <div class="container">
          <p v-if="category && category.description">{{ category.description }}</p>
          <!--Category-->
          <div class="row">
            <div class="col-md-9 main-content">
              <div class="row">
                <div class="col-md-6 article-group" v-for="child in category.children" :key="child.id">
                  <large-cate :data="child"></large-cate>
                </div>
              </div>
            </div>
            <!--begin side content-->
            <div class="col-md-3 side">
              <h2 style="font-size: 26px;">Xem gì hôm nay?</h2>
              <div class="highlight-today">
                <a href="#">
                  <img src="@/assets/img/01.jpg" alt="">
                </a>
              </div>
              <h2 style="font-size: 26px;">Top cầu thủ ghi bàn</h2>
              <iframe frameborder="0"  scrolling="no" width="255" height="390" src="https://www.fctables.com/vietnam/v-league/iframe=/?type=top-scorers&lang_id=21&country=235&template=371&team=&timezone=Asia/Bangkok&time=24&limit=10&ppo=1&pte=1&pgo=1&pma=0&pas=0&ppe=0&width=255&height=390&font=Arial&fs=12&lh=20&bg=FFFFFF&fc=222&logo=1&tlink=0&ths=1&thb=1&thba=ffffff&thc=222&bc=dddddd&hob=f5f5f5&hobc=ebe7e7&lc=222&sh=0&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
              <h2 style="font-size: 26px;">Có thể bạn quan tâm</h2>
              <ul class="popular-news">
                <div v-if="relate">
                  <horizontal-item bigImage :data="item" v-for="(item, index) in relate" :key="index" />
                </div>
              </ul>
            </div>
            <!--end side content-->
          </div>

        <!--begin polls content-->

        <!--end polls content-->
      </div>
      <!--begin on-ads-->
      <div class="on-ads">
        <div class="container">
          <a target="_blank" href="#">
            <img src="@/assets/img/onsports_banner_1140_90.jpg">
          </a>
        </div>
      </div>
      <!--end on-ads-->
    </div>
    <!--Sub category-->
    <div class="on-main" v-else>
      <div class="container">
        <div class="row">
          <page-title :title="category.name" />
          <p v-if="category.description">{{category.description}}</p>
        </div>
        <div class="row">
          <div class="col-sm-9">

              <ul class="on-tab clearfix">
                <li :class="{'selected': filter.key === filterActiveKey}" @click.prevent="filterActiveKey = filter.key" v-for="filter in filters" :key="filter.key">
                  <a class=""  href="#">
                    {{ filter.title}}
                  </a>
                </li>
              </ul>

            <div class="row page-filters__offset" :style="pageOffsetStyle" v-if="result && result.length > 0">
              <div class="col-md-6 article-group" v-for="(item, index) in result" :key="index">
                <item :data="item" />
              </div>
            </div>
            <div class="row page-filters__offset" :style="pageOffsetStyle" v-if="result && result.length > 0">
              <div class="row showMore clearfix">
                <a v-if="pagination && pagination.pageLeft !== 0" @click.prevent="loadmoreCategory" href="#">
                  BẤM ĐỂ XEM THÊM</a>
              </div>
            </div>
            <div class="row page-filters__offset" v-else>
              <p class="text-center">Không có bài viết nào</p>
            </div>

          </div>
          <div class="col-sm-3 ">
            <div class="highlight-today">
              <a href="#">
                <img src="@/assets/img/01.jpg" alt="">
              </a>
            </div>
            <h2 style="font-size: 23px;">Top cầu thủ ghi bàn</h2>
            <iframe frameborder="0"  scrolling="no" width="255" height="390" src="https://www.fctables.com/vietnam/v-league/iframe=/?type=top-scorers&lang_id=21&country=235&template=371&team=&timezone=Asia/Bangkok&time=24&limit=10&ppo=1&pte=1&pgo=1&pma=0&pas=0&ppe=0&width=255&height=390&font=Arial&fs=12&lh=20&bg=FFFFFF&fc=222&logo=1&tlink=0&ths=1&thb=1&thba=ffffff&thc=222&bc=dddddd&hob=f5f5f5&hobc=ebe7e7&lc=222&sh=0&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
<!--            <h2 style="font-size: 26px;">Cup Quốc Gia 2019</h2>-->
            <h2 style="font-size: 26px;">Có thể bạn quan tâm</h2>
            <ul class="popular-news">
              <div v-if="relate">
                <horizontal-item bigImage :data="item" v-for="(item, index) in relate" :key="index" />
              </div>
            </ul>
          </div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RecentNews from '~/components/frontend/home/recent-news.vue'
  import BlockTitle from '~/components/frontend/common/block-title.vue'
  import CateTitle from '~/components/frontend/common/cate-title.vue'
  import PageTitle from '~/components/frontend/common/page-title.vue'
  import LargeCate from '~/components/frontend/common/large-cate.vue'
  import VerticalItem from '~/components/frontend/common/vertical-item.vue'
  import HorizontalItem from '~/components/frontend/common/horizontal-item.vue'
  import Item from '~/components/frontend/category/horizontal-item.vue'
  import PromoSidebar from '~/components/frontend/common/promo-sidebar.vue'
  // import _ from 'lodash'
  export default {
    name: 'category-detail',
    validate ({ params }) {
      return (!!params.id)
    },
    data () {
      return {
        type: 'hasSub',
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
            title: 'Sự kiện',
            key: 'event'
          }
        ],
        filterActiveKey: 'all',
        relate: []
      }
    },
    async fetch ({store, params, error}) {
      await store.dispatch('loadCategory', params)
      if (store.state.category.data.length < 1) {
        error({statusCode: 404, message: 'Category không tồn tại'})
      }
    },

    head () {
      return {
        title: this.category ? `${this.category.name} ` : 'Category onsports',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: this.category ? this.category.name : ''
          },
          { hid: 'description', name: 'description', content: this.category && this.category.name ? this.category.name : '' },
          { hid: 'og:title', property: 'og:title', content: this.category && this.category.name ? this.category.name : '' },
          { hid: 'og:type', property: 'og:type', content: 'category' },
          { hid: 'og:description', property: 'og:description', content: this.category && this.category.name ? this.category.name : '' },
          { hid: 'og:url', property: 'og:url', content: this.category && this.category.slug ? this.category.slug : '' }
        ]
      }
    },
    created () {

    },
    mounted () {
      if (!this.category.children) {
        this.type = 'hasSub'
      } else {
        this.type = 'hasItem'
      }

      this.fetchRelate()
    },
    components: {
      RecentNews,
      BlockTitle,
      LargeCate,
      CateTitle,
      VerticalItem,
      PageTitle,
      PromoSidebar,
      HorizontalItem,
      Item
    },
    computed: {
      isMobile () {
        return this.$store.state.size.isMobile
      },
      chidlren () {
        return this.category.children
      },
      textTarget () {
        const target = this.filters.find(e => {
          return e.key === this.filterActiveKey
        })
        return target.title
      },
      result () {
        switch (this.filterActiveKey) {
          case 'all':
            return this.all
          case 'video':
            return this.video
          case 'event':
            return this.event
          case 'article':
            return this.article
          default:
            return this.all
        }
      },
      all () {
        return this.$store.state.category.data.items
      },
      article () {
        return this.$store.state.category.data.items.filter(e => {
          return e.item_type === 'article' || e.item_type === 'post'
        })
      },
      video () {
        return this.$store.state.category.data.items.filter(e => {
          return e.item_type === 'file' || e.item_type === 'video'
        })
      },
      event () {
        return this.$store.state.category.data.items.filter(e => {
          return e.item_type === 'event'
        })
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
      },
      category () {
        return this.$store.state.category.data
      },
      items () {
        return this.$store.state.category.data.items
      },
      pagination () {
        return this.$store.state.category.pagination
      },
      currentCategory () {
        // return this.$store.state.category.data.data.find(category => {
        //   return Object.is(category.slug, this.$route.params.category_slug)
        // })
      },
      noData () {
        return Object.is(this.category.children.length, 0) && Object.is(this.category.items.length)
      },
      defaultParams () {
        return {
          id: this.category.slug
        }
      },
      nextPageParams () {
        return Object.assign({
          page: this.pagination.page + 1
        }, this.defaultParams)
      }
    },
    methods: {
      loadmoreCategory () {
        this.$store.dispatch('loadCategory', this.nextPageParams)
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
      }
    }
  }
</script>

