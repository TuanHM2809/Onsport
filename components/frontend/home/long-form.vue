<template>
  <div class="media-cate" v-if="data">
    <div class="container">
    <!--tuanhmfixstyle-->
      <div class="on-gallery">
      <block-title :url="data.url" colored :title="data.name" />
      <div class="list-news clearfix">
        <carousel :full="true" :data="data.screen_block_items" />
      </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Carousel from '~/components/frontend/common/carousel.vue'
  import BlockTitle from '~/components/frontend/common/block-title.vue'
  export default {
    props: {
      data: {
        type: Object
      }
    },
    components: {
      Carousel,
      BlockTitle
    }
  }
</script>
