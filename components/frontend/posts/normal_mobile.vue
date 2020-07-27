<template>
  <div class="the-article m-t-10">
    <blur-image v-if="post && post.poster" :src="post.poster" :alt="post.title" noRatio/>
    <div class="module p-t-0">
      <div class="container p-t-0">
        <page-title v-if="post && post.title" :createdAt="handleCreated" :author="post.author" :title="post.title"></page-title>
        <div class="content row">
          <div class="col-md-8 p-l-0 p-r-0" style="margin:0 -10px;">
            <instructions :content="post.content" :ios="ios" :class="{'ios' : ios}"> </instructions>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PageTitle from '~/components/frontend/common/page-title.vue'
import Instructions from '~/components/frontend/posts/Instructions'
import moment from 'moment'
export default {
  name: 'normal-mobile',
  data () {
    return {
      theme: 'light'
    }
  },
  props: ['post', 'ios'],
  computed: {
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
  },
  beforeDestroy () {
  },
  methods: {
    dynamic () {
      return 'instrucions'
      // return this.ios ? 'instructions-mobile' : 'instructions'
    }
  },
  components: {
    PageTitle,
    Instructions
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

