<template>
  <div class="the-longform">

    <div class="module p-0">
      <my-heading :data="post"></my-heading>
    </div>
    <div class="module p-0" v-if="post && post.content">
      <div class="container-fluid">
        <div class="content p-t-20">
          <instructions :content="post.content"></instructions>

          <div class="tag-list" v-if="post.tags">
            <tag-list :tags="post.tags" />
          </div>
          
          <div class="module tag-list" style="background-color: #fafafa;" v-if="post.id">
            <comment-box :itemId="post.id" :itemType="post.type" />
          </div>
        </div>
      </div>
    </div>
    
    <div class="module" v-if="post && post.related">
      <div class="container">
        <block-title :arrow="false" title="Tin liên quan" />
        <div v-if="post.related" class="relate">
          <div class="columns">
            <vertical-item class="column" v-for="relate in post.related" :key="relate.id" :data="relate" />
          </div>
        </div>
      </div>
    </div>
    <share-box />
  </div>
</template>
<script>
import {slugify} from '~/utils'
import BreakingNews from '~/components/frontend/home/breaking-news.vue'
import PageTitle from '~/components/frontend/common/page-title.vue'
import CateTitle from '~/components/frontend/common/cate-title.vue'
import BlockTitle from '~/components/frontend/common/block-title.vue'
import VerticalItem from '~/components/frontend/common/vertical-item.vue'
import Instructions from '~/components/frontend/posts/Instructions'
import MyHeading from '~/components/frontend/posts/longform_head'
import TagList from '~/components/frontend/posts/tag'
import parser from '~/shortcodes/index.meta'
export default {

  data () {
    return {
      theme: 'light',
      maxHeight: 0
    }
  },
  props: ['post'],
  computed: {
    swiperTopSlideStyle () {
      if (!this.maxHeight) return {}
      return {
        'max-height': `${this.maxHeight}px`
      }
    }
  },
  created () {
  },
  mounted () {

  },
  beforeDestroy () {
  },
  methods: {
    slug (name) {
      return slugify(name)
    },
    async parserShortcodes (html) {
      try {
        const parsedHtml = await parser(html)
        if (parsedHtml) {
          this.parsedHtml = parsedHtml
        } else {
          this.$toast.err('Không thể lấy được dữ liệu')
        }
      } catch (e) {
        console.log(e)
      }
    }

  },
  components: {
    CateTitle,
    VerticalItem,
    PageTitle,
    BlockTitle,
    BreakingNews,
    Instructions,
    TagList,
    MyHeading
  }
}
</script>
<style scoped>
div.tag-list {
  max-width: 800px;
  margin: 0 auto;
  clear: both;
}
.relate {
  width: 100%;
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
  display: block;
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -ms-flex-negative: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}
.column {
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  width: 50%;
}
@media (max-width: 991px) and (min-width: 640px) {
  .column {
    width: 33.33%;
  }
}
@media screen and (min-width: 992px) {
  .column {
    width: 33.333%;
  }
}
</style>
