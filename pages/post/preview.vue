<template>
  <div>
    <component v-if="post && post.content" :is="dynamic" :post="post"></component>
    <div v-else style="min-height: 100vh"></div>
  </div>
</template>
<script>
import Normal from '~/components/frontend/posts/normal.vue'
import LongForm from '~/components/frontend/posts/longform.vue'
import usbase64 from 'urlsafe-base64'
const decodeDataForPreview = encodedData => JSON.parse(usbase64.decode(encodedData))

export default {
  layout: 'default',
  validate ({ params }) {
    return 1
  },
  head () {
    return {
      title: 'Preview'
    }
  },
  data () {
    return {
      post: {
        content: null,
        type: 'normal',
        postId: null
      }
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
  components: {
    LongForm,
    Normal
  },
  methods: {
    // getParameterByName (name, url) {
    //   if (!url) url = window.location.href
    //   name = name.replace(/[[\]]/g, '\\$&')
    //   let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
    //   let results = regex.exec(url)
    //   if (!results) return null
    //   if (!results[2]) return ''
    //   return decodeURIComponent(results[2].replace(/\+/g, ' '))
    // }
  },
  created () {
    // window.p = JSON.parse(usbase64.decode(this.$route.query.data))
    // console.log(window.p)
    this.post = decodeDataForPreview(this.$route.query.data)
    if (this.post && this.post.postId) {
      this.$axios.$get(`/posts/preview/${this.post.postId}`, {
        headers: {'Pragma': 'no-cache'}
      }).then(async data => {
        if (data.code === 0) {
          // console.log(data.data)
          this.post = data.data
        }
      }).catch(e => {
        console.log(e)
      })
    }
    // this.post = JSON.parse(decodeURIComponent(this.$route.query.data)).content
  }
}
</script>
<style>
</style>
