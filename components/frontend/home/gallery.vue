<template>
<!--tuanhmfixstyle-->
  <div class="media-cate" v-if="data" style="display:none">
    <div class="container">
      <div class="on-gallery" style="background:url(https://micros.onsports.vn/resize/?width=1024&url=http://static.onsports.vn/nas/Post/2019/THANG%2012/11/8.jpg) no-repeat 50% 50%;">
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
