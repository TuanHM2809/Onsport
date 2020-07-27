<template>
  <div class="col-md-4">
    <cate-title v-if="data && data.name" :title="data.name" :to="handleLink(data)" />
    <nuxt-link :to="handleLink(feature)">
        <blur-image v-if="feature" :src="feature.thumbnail" :alt="feature.name"/>
        <span class="media-duration">{{feature.duration}}</span>
      <h3>{{feature.name.slice(0,56)}}</h3>
    </nuxt-link>

    <div class="news-item clearfix" v-if="data && latest" v-for="item in latest" :key="item.id">
      <nuxt-link :to="handleLink(feature)">
        <blur-image v-if="feature" :src="item.thumbnail" :alt="item.name"/>
        <h3>{{item.name}}</h3>
      </nuxt-link>
    </div>
  </div>
  
</template>
<script>
import CateTitle from '~/components/frontend/common/cate-title.vue'
export default {
  name: 'mini-cate',
  data () {
    return {}
  },
  props: {
    data: {
      type: Object
    }
  },
  components: {
    CateTitle
  },
  computed: {
    feature () {
      if (this.data && this.data.children) {
        // console.log(this.data.children)
        return this.data.children[0]
        return {}
      }
    },
    latest () {
      if (this.data && this.data.children) {
        return this.data.children.slice(1, 3)
      } else {
        return []
      }
    }
  },
  methods: {
    // handleLink (item) {
    //   switch (item.item_type) {
    //     case 'file':
    //       return {name: `video-id`, params: {id: item.item_id}}
    //     case 'post':
    //       return {name: `${item.item_type}-id`, params: {id: item.item_id}}
    //     default:
    //       return {name: `${item.item_type}-id`, params: {id: item.item_id}}
    //   }
    // }
  },
  mounted () {
    //console.log(this.data)
  }
}
</script>