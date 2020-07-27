<template>
  <div>
    <my-header/>
    <nuxt/>
    <my-footer/>
  </div>

</template>

<script>
import MyFooter from '~/components/frontend/common/footer.vue'
import MyHeader from '~/components/frontend/common/header.vue'
import {debounce} from 'lodash'
export default {
  head () {
    const host = process.server
      ? this.$ssrContext.req.headers.host
      : window.location.host

    return {
      link: [
        // We use $route.path since we don't use query parameters
        { rel: 'canonical', href: `http://${host}${this.$route.path}` }
      ]
    }
  },
  components: {
    MyFooter,
    MyHeader
  },
  mounted () {
    this.$nextTick(function () {
      window.addEventListener('resize', debounce(this.checkSize, 20))
      // Init
      this.checkSize()
    })
  },
  methods: {
    checkSize (event) {
      const rect = document.body.getBoundingClientRect()
      this.$store.commit('size/checkMobile', rect.width)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.checkSize)
  }
}
</script>

<style scoped>
#wrapper {
  /* padding-top: 50px;
  min-height: calc(100vh - 50px); */

  padding-top: 0;
  min-height: 100vh;
}
</style>
<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
</style>

