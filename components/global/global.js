import PostPlayer from '~/components/frontend/posts/post-player'
import PostPlayerMobile from '~/components/frontend/posts/post-player-mobile'
import Story from '~/components/frontend/posts/story'
import Quote from '~/components/frontend/posts/quote'
import Gallery from '~/components/frontend/posts/gallery'
import ShareBox from '~/components/frontend/common/share.vue'
import CommentBox from '~/components/frontend/comment/comment-box.vue'
import globalMixin from '~/mixins/global.js'
const global = {
  install: function (Vue) {
    Vue.component('post-player', PostPlayer)
    Vue.component('post-player-mobile', PostPlayerMobile)
    Vue.component('share-box', ShareBox)
    Vue.component('comment-box', CommentBox)
    Vue.component('story-highlights', Story)
    Vue.component('quote', Quote)
    Vue.component('gallery', Gallery)
    Vue.mixin(globalMixin)
  }
}
export default global
