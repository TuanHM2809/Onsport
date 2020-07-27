<template>
  <div>
    <nuxt/>
  </div>
</template>

<script>
import {debounce} from 'lodash'
export default {
  components: {
  },
  methods: {
    checkSize (event) {
      const rect = document.body.getBoundingClientRect()
      this.$store.commit('size/checkMobile', rect.width)
    }
  },
  mounted () {
  // console.log(this.comments)
    const bodyClass = document.body.classList
    bodyClass.add('no_padding_blank_layout')
    this.$nextTick(function () {
      window.addEventListener('resize', debounce(this.checkSize, 20))
      // Init
      this.checkSize()
    })
  },
  beforeDestroy () {
    const bodyClass = document.body.classList
    if (bodyClass.contains('no_padding_blank_layout')) {
      bodyClass.remove('no_padding_blank_layout')
    }
    window.removeEventListener('resize', this.checkSize)
  }
}
</script>

<style>
body.match-result--showing.no_padding_blank_layout {
  padding-top: 0 !important;
}
</style>
