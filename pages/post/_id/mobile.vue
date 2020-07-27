<template>
  <component :is="dynamic" :post="post" :ios="isIos"></component>
</template>
<script>
import Normal from '~/components/frontend/posts/normal_mobile.vue'
import LongForm from '~/components/frontend/posts/longform_mobile.vue'
import UAParser from '~/utils/ua-parse'
export default {
  layout: 'blank',
  async asyncData ({app, params, error, userAgent}) {
    try {
      let isIos = false
      if (userAgent) {
        isIos = UAParser(userAgent).isIos
      }
      let response = await app.$axios.$get(`/posts/${params.id}`)
      if (response.code === 0) {
        return {post: response.data, isIos}
      } else {
        error({ statusCode: 404, message: 'Bài viết không tồn tại' })
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Bài viết không tồn tại' })
      console.log(e)
    }
  },
  validate ({ params }) {
    return (!!params.id)
  },
  head () {
    const post = this.post
    let keywords = ' '

    const testHttpLink = (link) => {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    }

    const generateLink = (link) => {
      if (testHttpLink(link)) {
        return link
      } else {
        return encodeURI(`${process.env.controlUrl}${link}`)
      }
    }

    if (post) {
      keywords = post.tags.map(function (elem) {
        return elem.name
      }).join(', ')

      return {
        title: `${post.title}${post.short_title ? ' - ' : ''}${post.short_title}` || 'OnSports',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: (post.tags ? keywords : post.title) || ''
          },
          { hid: 'description', name: 'description', content: post && post.short_description ? post.short_description : '' },
          { hid: 'og:title', property: 'og:title', content: `${post.title}${post.short_title ? ' - ' : ''}${post.short_title}` },
          { hid: 'og:type', property: 'og:type', content: 'article' },
          { hid: 'og:description', property: 'og:description', content: post && post.short_description ? post.short_description : '' },
          { hid: 'og:url', property: 'og:url', content: 'http://onsports.vn/post/' + post.slug },
          { hid: 'og:image', property: 'og:image', content: post && post.thumbnail ? generateLink(post.thumbnail) : '' },
          { hid: 'og:image:alt', property: 'og:image:alt', content: post && post.short_description ? post.short_description : '' },
          { hid: 'og:image:width', property: 'og:image:width', content: '512' },
          { hid: 'og:image:height', property: 'og:image:height', content: '288' },
          { hid: 'al:ios:app_store_id', property: 'al:ios:app_store_id', content: '1282845933' },
          { hid: 'al:ios:app_name', property: 'al:ios:app_name', content: 'ON Sports' },
          { hid: 'al:ios:url', property: 'al:ios:url', content: 'onsports://post/' + post.slug },
          { hid: 'al:web:should_fallback', content: 'false' },
          {hid: 'al:android:url', property: 'al:android:url', content: 'onsports://post/' + post.slug},
          {hid: 'al:android:package', property: 'al:android:package', content: 'com.vtvcab.onsports'},
          {hid: 'al:android:app_name', property: 'al:android:app_name', content: 'ON Sports'}
        ]
      }
    } else {
      return {
        title: 'LongForm'
      }
    }
  },
  data () {
    return {
      maxHeight: 0
    }
  },
  computed: {
    dynamic () {
      if (this.post && this.post.post_type === 'longform') {
        return 'long-form'
      } else {
        return 'normal'
      }
    }
  },
  created () {
    console.log(this.isIos)
  },
  mounted () {
    console.log(this.isIos)
    setTimeout(() => {
      window.twttr.widgets.load()
    }, 200)
  },
  components: {
    LongForm,
    Normal
  }
}
</script>
<style>
</style>
