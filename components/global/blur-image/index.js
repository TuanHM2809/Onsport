import BlurImage from './blur-image.vue'
import BlurBackground from './blur-background.vue'
const blurImage = {
  install: function (Vue) {
    Vue.component('blur-image', BlurImage.default || BlurImage)
    Vue.component('blur-background', BlurBackground.default || BlurBackground)
  }
}
export default blurImage
