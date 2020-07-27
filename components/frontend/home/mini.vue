<template>
  <div class="media-cate news-group clearfix">
  
    <div class="container">
      <block-title :url="data.url" v-if="data && data.name" :title="data.name"></block-title>
      <div class="list-news clearfix">
        <!--<div class="row" v-if="data && data.screen_block_items"  v-for="child in categories.slice(0,1)" :key="child.id">
            <firtmini-cate v-for="item in child.slice(0,1)" :data="item" :key="item.id" />
        </div> -->

        <div class="row" v-if="data && data.screen_block_items"  v-for="child in categories" :key="child.id">
            <mini-cate v-for="item in child" :data="item" :key="item.id" />
        </div>

      </div>
    </div>

  </div>
</template>
<script>
import FirtminiCate from '~/components/frontend/common/firtmini-cate.vue'
import MiniCate from '~/components/frontend/common/mini-cate.vue'
import BlockTitle from '~/components/frontend/common/block-title.vue'
import _ from 'lodash'
export default {
  data () {
    return {

    }
  },
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    categories () {
      // console.log(this.data.screen_block_items[0])
      return _.chunk(this.data.screen_block_items, 3)
    }
  },
  components: {
    FirtminiCate,
    MiniCate,
    BlockTitle
  }
}
</script>
<style scoped>
@media screen and (min-width: 640px) {
  .mini-cate:not(:first-child):not(:last-child) {
    padding: 0 7.5px;
  }
}

</style>



