import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)
if (process.BROWSER_BUILD) {
  const VueTouch = require('vue-touch')
  Vue.use(VueTouch, { name: 'v-touch' })
}
