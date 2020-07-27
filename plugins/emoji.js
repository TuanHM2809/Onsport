import Vue from 'vue'
import { Emoji, Picker } from 'emoji-mart-vue'
const global = {
  install: function (Vue) {
    Vue.component('emoji', Emoji)
    Vue.component('picker', Picker)
  }
}

Vue.use(global)
