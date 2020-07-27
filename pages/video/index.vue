<template>
  <div class="index">
    <section class="module">
      <div class="container p-b-15">
        <page-title :title="`Video`" />
        <div class="page-nav">
          <a class="page-nav__head m-b-15" :class="{'page-nav__head--open': showDropdownMobile}" href="#" id="page-nav-control">
            <h3 class="page-nav__title">Trang chủ</h3>
            <div class="page-nav__title-more" @click.prevent="showDropdownMobile = !showDropdownMobile"></div>
          </a>
          <div class="page-nav__frame" ref="pageNavFrame">
            <div class="page-nav__body" id="page-nav" :style="mobileMode">
              <ul class="page-nav__item-group" v-if="onBoard && onBoard.length >0">
                <li class="page-nav__item" v-for="item in onBoard" :key="item.id">
                  <nuxt-link :to="handleLink({item_type: 'category', slug: item.slug})" class="page-nav__link">{{item.name || item.title}}</nuxt-link>
                </li>
                <li class="page-nav__item page-nav__item--dropdown" :class="{'page-nav__item--active-dropdown': showDropdown}">
                  <p class="page-nav__link" @click.prevent="showDropdown = !showDropdown">More</p>
                  <ul class="page-nav__dropdown" v-if="offBoard && offBoard.length > 0">
                    <li class="page-nav__dropdown-item" v-for="item in offBoard" :key="item.id">
                      <nuxt-link :to="handleLink({item_type: 'category', slug: item.slug})" class="page-nav__link">{{item.name || item.title}}</nuxt-link>
                    </li>
                  </ul>
                </li>
              </ul>
              <h5 class="page-nav__supplementary-header">More</h5>
              <ul class="page-nav__item-group page-nav__supplementary-links" v-if="offBoard && offBoard.length > 0">
                <li class="page-nav__item" v-for="item in offBoard" :key="item.id">
                  <nuxt-link :to="handleLink({item_type: 'category', slug: item.slug})" class="page-nav__link">{{item.name || item.title}}</nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div class="page-filters__offset" :style="pageOffsetStyle">
            <div class="columns" v-if="videos">
              <div class="column" v-for="video in videos" :key="video.id">
                <vertical-item :data="video" />
              </div>
            </div>
            <a v-loading="loadingMore" v-if="pagination && pagination.pageLeft !== 0" @click.prevent="loadmoreVideo" class="show-more m-b-20" href="#">
              Xem tiếp</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import PageTitle from '~/components/frontend/common/page-title.vue'
  import VerticalItem from '~/components/frontend/common/vertical-item.vue'
  export default {
    name: 'video-list',
    validate ({params}) {
      return 1
    },
    data () {
      return {
        showDropdown: false,
        showDropdownMobile: false
      }
    },
    async fetch ({store, params, error}) {
      try {
        await store.dispatch('loadVideos')
      } catch (e) {
        console.log(e)
      }
    },
    async asyncData ({app}) {
      try {
        let { data } = await app.$axios.$get(`/categories`)
        return {categories: data}
      } catch (e) {
        console.log(e)
      }
      // return { title: data.title }
    },
    head () {
      return {
        title: 'Video',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: 'video, On Sports, Thể thao, Bóng đá'
          },
          { hid: 'description', name: 'description', content: 'Video' },
          { hid: 'og:title', property: 'og:title', content: 'Video' },
          { hid: 'og:type', property: 'og:type', content: 'Video' },
          { hid: 'og:description', property: 'og:description', content: 'Video' },
          { hid: 'og:url', property: 'og:url', content: 'video' }
        ]
      }
    },
    created () {

    },
    mounted () {
      // console.log(this.categories)
      // this.filterActiveId = this.pundit.id
    },
    components: {
      VerticalItem,
      PageTitle,
    },
    computed: {
      videos () {
        return this.$store.state.video.data
      },
      loadingMore () {
        return this.$store.state.video.fetching
      },
      pagination () {
        return this.$store.state.video.pagination
      },

      defaultParams () {
        return {
        }
      },
      nextPageParams () {
        return Object.assign({
          page: this.pagination.page + 1
        }, this.defaultParams)
      },
      textTarget () {
        return this.tag.name
      },
      pageOffsetStyle () {
        const offset = this.showDropdownMobile && this.width < 992 ? this.$refs.pageNavFrame.getBoundingClientRect().height : 0
        return {
          'transform': `translateY(${offset}px)`,
          'padding-bottom': `${offset}px`
        }
      },
      width () {
        return this.$store.state.size.width
      },
      mobileMode () {
        if (!this.showDropdownMobile) {
          return {
            transform: 'translateY(-100%)',
            visibility: 'hidden'
          }
        } else {
          return {
            transform: 'translateY(0%)',
            visibility: 'visible'
          }
        }
      },
      onBoard () {
        return this.categories.slice(0, 7)
      },
      offBoard () {
        return this.categories.slice(7, 9999)
      }

    },
    methods: {
      loadmoreVideo () {
        this.$store.dispatch('loadVideos', this.nextPageParams)
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
</style>



<style scoped>
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

.show-more {
  display: block;
  width: 100%;
  background: none;
  user-select: none;
  text-align: center;
  cursor: pointer;
  -webkit-appearance: none;
  line-height: 1.4em;
  -webkit-font-smoothing: antialiased;
  text-transform: uppercase;
  color: #212529;
  border: 1px solid #dcdcdc;
  padding-top: .5em;
  padding-bottom: .5em;
  font-size: 14px;
  letter-spacing: 1px;
  position: relative;
}
.show-more:hover {
  background-color: #dcdcdc;
}
@media screen and (max-width: 768px) {
  .column {
    flex: none;
    width: 50%;
  }
}
@media screen and (min-width: 769px) {
  .column {
    flex: none;
    width: 33.3333%;
  }
}
@media screen and (min-width: 1024px) {
  .column {
    flex: none;
    width: 33.3333%;
  }
}

@media (min-width: 640px) {
}
</style>


<style scoped>
/* css cho phan nav */
.page-nav__item--dropdown {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.page-nav__dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  left: auto;
  list-style: none;
  background: #fff;
  border: 1px solid #dcdcdc;
  width: 300px;
  font-size: 0;
  white-space: normal;
}
.page-nav__dropdown-item {
  font-size: 16px;
  display: inline-block;
  width: 50%;
  padding-left: 11px;
}
.page-nav__item--active-dropdown {
  overflow: initial;
  cursor: pointer;
}
.page-nav__item {
  padding: 5px;
}

@media (min-width: 992px) {
  .page-nav {
    background: #fff;
    position: relative;
    margin-bottom: 24px;
    z-index: 3;
    -webkit-transform: translateZ(0);
  }
  .page-nav__head {
    display: none;
  }
  .page-nav__body {
    transform: translateY(0) !important;
    visibility: visible !important;
  }
  .page-nav__item-group {
    white-space: nowrap;
    padding-left: 0;
    margin-bottom: 0;
  }
  .page-nav__item {
    display: inline-block;
    vertical-align: top;
  }
  .page-nav__item-group li+li:after{content:""; width:1px; height:12px; background:#ccc; position:absolute; top:8px; left:1px}
  .page-nav__item-group li {
    position: relative;
    padding-left:10px;
    padding-right:5px;
  }
  .page-nav__item li a{display:block; padding:3px 3px;}
  a.page-nav__link:hover{background:#ccc;border-radius:5px;color:#212529;}
  .page-nav__link,
  .page-nav__select-mask {
    font-weight: normal;
    font-size: 16px;
    color: inherit;
    display: block;
    margin-bottom: 0;
    cursor:pointer;
  }
  .page-nav__item {
    display: inline-block;
    vertical-align: top;
  }
  .page-nav__supplementary-header,
  .page-nav__supplementary-links {
    display: none;
  }
  .page-nav__item-group {
    white-space: nowrap;
    padding-left: 0;
  }
}
@media (max-width: 991px) {
  .page-nav__head {
    background-color: #02024d;
    color: white;
    display: table;
    width: 100%;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
  }
  .page-nav__frame {
    position: absolute;
    width: 100%;
    overflow: hidden;
    -webkit-transform: translateZ(0);
  }
  .page-nav__body {
    background: #f4f4f4;
    transform: translateY(-100%);
    transition: transform 0.33s ease-in-out;
    padding-bottom: 6px;
  }
  .page-nav__item-group {
    list-style: none;
    padding: 12px;
  }
  .page-nav__link,
  .page-nav__select-mask {
    padding: 5px 6px;
    
    font-weight: normal;
    font-size: 16px;
    color: inherit;
    white-space: nowrap;
  }
  .page-nav__item--dropdown {
    display: none;
  }
  .page-nav__supplementary-links {
    padding-bottom: 9px;
  }
  .page-nav__item-group {
    list-style: none;
    padding: 12px;
  }
  .page-nav__title-more {
    display: block;
    position: absolute;
    right: 14px;
    height: 100%;
    height: 14px;
    top: 50%;
    margin-top: -7px;
    line-height: 0.7;
  }
  .page-nav__title-more:before {
    content: "Menu";
    
    font-weight: normal;
    font-size: 13px;
    color: #fff;
    position: relative;
    left: -3px;
    vertical-align: middle;
  }
  .page-nav__title-more:after {
    content: "\f078";
    font-family: FontAwesome;
    font-size: 13px;
    position: relative;
    top: 2px;
  }
}
@media (max-width: 600px) {
  .page-nav {
    position: relative;
  }
  .page-nav__head {
    height: 48px;
  }
  .page-nav__item-group {
    column-count: 2;
    padding: 9px;
    padding-bottom: 8px;
  }
  .page-nav__supplementary-header {
    padding-left: 14px;
  }
  .page-nav__supplementary-header {
    
    font-weight: normal;
    font-size: 18px;
    color: inherit;
    padding-left: 18px;
    margin-bottom: -6px;
  }
  .page-nav__item-group {
    -webkit-column-count: 2;
    -moz-column-count: 2;
    column-count: 2;
    padding: 9px;
    padding-bottom: 8px;
  }
  .page-nav__title {
    
    font-weight: normal;
    font-size: 18px;
    color: #fff;
    padding: 0 14px;
    display: table-cell;
    vertical-align: middle;
  }
}
@media (max-width: 991px) and (min-width: 601px) {
  .page-nav__head {
    height: 52px;
  }
  .page-nav__title {
    
    font-weight: normal;
    font-size: 22px;
    color: #fff;
    padding: 0 18px;
    display: table-cell;
    vertical-align: middle;
    width: 100%;
  }
  .page-nav {
    position: relative;
    margin-bottom: 18px;
  }
  .page-nav__item-group {
    -webkit-column-count: 3;
    -moz-column-count: 3;
    column-count: 3;
  }
}
@media screen and (min-width: 1400px) {
  .module.root > .container {
    padding-top: 25px;
  }
}
</style>



