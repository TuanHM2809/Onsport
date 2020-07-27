import Vue from 'vue'
import { Select, Tabs, Tooltip, TabPane, Option } from 'element-ui'

export default () => {
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Tabs)
  Vue.use(TabPane)
  Vue.use(Tooltip)
}
