<template>
  <div class="media-cate">
    <div class="container p-t-0 p-b-15">
      <block-title :url="data.url" v-if="data && data.name" :title="data.name"></block-title>
      <div class="row no-gutter" v-if="data">
        <div class="col-sm-6" v-for="child in data.screen_block_items" :key="child.id">
          <large-cate :data="child"></large-cate>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LargeCate from '~/components/frontend/common/large-cate.vue'
import BlockTitle from '~/components/frontend/common/block-title.vue'
export default {
  data () {
    return {

    }
  },
  props: {
    title: {
      type: String
    },
    data: {
      type: Object,
      required: false
    }
  },
  components: {
    LargeCate,
    BlockTitle
  }
}
</script>
<style scoped>
.row.no-gutter [class*="col-"]:nth-child(odd) {
  padding-left: 0;
}
.row.no-gutter [class*="col-"]:nth-child(even) {
  padding-right: 0;
}
.cnn-category-title-style01 .title-stripes {
  display: inline-block;
  height: 13px;
  vertical-align: middle;
  margin-left: 10px;
}
.cnn-category-title-style01 .title-stripes:after {
  content: "";
  border-bottom: 4px solid #d9d9d9;
  border-top: 4px solid #d9d9d9;
  display: inline-block;
  position: absolute;
  width: 100%;
  height: 10px;
}
</style>

