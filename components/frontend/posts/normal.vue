<template>
  <div class="the-article">
    <blur-image v-if="post && post.poster" :src="post.poster" :alt="post.title" noRatio/>
    <!-- <breaking-news v-else />-->
    <div class="module p-t-0">
      <div class="container p-t-0">
        <page-title v-if="post && post.title" :createdAt="handleCreated" :author="post.author" :title="post.title"></page-title>
        <div class="content row">
          <div class="col-md-8 p-l-0 p-r-0" style="margin-left: -10px;" :style="{'margin-right':isMobile? '-10px': 0}">
            <instructions :content="post.content"></instructions>
            <tag-list v-if="post.tags" :tags="post.tags" />
          </div>
          <div class="col-md-4 p-r-0 relate-post " v-if="post.related">
            <cate-title :arrow="false" title="Tin liên quan" />
            <div>
              <h-item bigImage v-for="relate in post.related" :key="relate.id" :data="relate"></h-item>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="module" style="background-color: #fafafa" v-if="post.id">
      <div class="container">
        <div class="row">
          <block-title :title="'Bình luận'" />
          <comment-box :itemId="post.id" :itemType="post.type" />
        </div>
      </div>
    </div>
    <div class="module" v-if="post.id">
      <div class="container">
        <block-title :title="'Xem nhiều nhất'" />
        <latest-box />
      </div>
    </div>
    <!--  <div class="module">
      <div class="container">
        <div class="row">
          <div class="col-sm-4" v-for="i in 3" :key="i">
            <cate-title :arrow="false" title="Tin liên quan" />
            <div v-if="post.related">
              <h-item :aspectRatio="1" v-for="relate in post.related" :key="relate.id" :data="relate"></h-item>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <share-box />
  </div>
</template>
<script>
import BreakingNews from '~/components/frontend/home/breaking-news.vue'
import PageTitle from '~/components/frontend/common/page-title.vue'
import CateTitle from '~/components/frontend/common/cate-title.vue'
import BlockTitle from '~/components/frontend/common/block-title.vue'
import LatestBox from '~/components/frontend/common/latest-box.vue'
import HItem from '~/components/frontend/common/horizontal-item.vue'
import Instructions from '~/components/frontend/posts/Instructions'
import TagList from '~/components/frontend/posts/tag'
import moment from 'moment'
export default {

  data () {
    return {
      theme: 'light'
    }
  },
  props: ['post'],
  computed: {
    isMobile () {
      return this.$store.state.size.isMobile
    },
    handleCreated () {
      const createdAt = moment.utc(this.post.created_at)
      if (!!this.post.created_at && !!this.post.date) {
        const publishedAt = moment.utc(this.post.date)
        if (publishedAt.isSameOrAfter(createdAt)) {
          return publishedAt.format('HH:mm | DD-MM-YYYY')
        } else {
          return createdAt.format('HH:mm | DD-MM-YYYY ')
        }
      }
      return createdAt.format('HH:mm | DD-MM-YYYY ')
    }
  },
  created () {
  },
  mounted () {
    window.moment = moment
    window.post = this.post
    // this.$nextTick(() => {
    //   // console.log(window.twttr)
    //   if (window.twttr) {
    //     console.log(window.twttr)
    //     window.twttr.widgets.load()
    //   }
    // })
    // console.log(this.post)
  },
  beforeDestroy () {
  },
  methods: {
  },
  components: {
    CateTitle,
    HItem,
    PageTitle,
    BlockTitle,
    BreakingNews,
    Instructions,
    TagList,
    LatestBox
  }
}
</script>
<style scoped>
@media (max-width: 767px) {
  .relate-post {
    padding-left: 0;
    padding-right: 0;
  }
}

@media (max-width: 479px) and (min-width: 0) {
  .the-article {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
@media (max-width: 639px) and (min-width: 480px) {
  .the-article {
    overflow: hidden;
    -webkit-box-shadow: none;
    box-shadow: none;
    padding: 10px 30px 0;
  }
}
@media (max-width: 991px) and (min-width: 640px) {
  .the-article {
    -webkit-box-shadow: none;
    box-shadow: none;
    padding: 10px 60px 0;
    overflow: hidden;
  }
}
@media (max-width: 1250px) and (min-width: 992px) {
  .the-article {
    padding: 10px 60px 0;
    background: #fff;
    margin-top: 0;
  }
}
</style>

