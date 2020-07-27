import NLoading from './n-loading.vue'

const loading = {
  install: function (Vue) {
    Vue.component('loading', NLoading.default || NLoading)
  }
}

export default loading
