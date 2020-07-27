<template>
  <div>

    <!--begin on-ads-->
    <div class="on-ads">
      <div class="container">
        <a target="_blank" href="#">
          <img src="@/assets/img/onsports_banner_1140_90.jpg">
        </a>
      </div>
    </div>
    <!--end on-ads-->

    <template v-for="(child, index) in data">
      <component :is="checkTypeComponent(child)" :key="child.name" :data="child"></component>
    </template>



    <!--begin on-ads-->
    <div class="on-ads">
      <div class="container">
        <a target="_blank" href="#">
          <img src="@/assets/img/onsports_banner_footer1140_250.jpg">
        </a>
      </div>
    </div>
    <!--end on-ads-->

  </div>
</template>

<script>
  
  import Big from '~/components/frontend/home/big.vue'
  import Mini from '~/components/frontend/home/mini.vue'
  import Media from '~/components/frontend/home/media-block.vue'
  import LongForm from '~/components/frontend/home/long-form.vue'
  import Gallery from '~/components/frontend/home/gallery.vue'
  import Pundit from '~/components/frontend/home/pundit.vue'
  import Event from '~/components/frontend/home/event.vue'

  export default {
    layout: 'default',
    head () {
      return {
        title: 'ON Sports - Trang tin tức bóng đá nhanh và chính xác nhất',
        meta: [
          { hid: 'description', name: 'description', content: 'ON Sports, cập nhật nhanh tin tức thể thao trong nước và thế giới trong ngày. Thông tin đầy đủ, hình ảnh, video chi tiết kết quả các môn thi thể thao mới nhất' },
          { hid: 'og:title', property: 'og:title', content: 'ON Sports - Trang tin tức bóng đá nhanh và chính xác nhất' },
          { hid: 'og:type', property: 'og:type', content: 'website' },
          { hid: 'og:description', property: 'og:description', content: 'ON Sports, cập nhật nhanh tin tức thể thao trong nước và thế giới trong ngày. Thông tin đầy đủ, hình ảnh, video chi tiết kết quả các môn thi thể thao mới nhất' },
          { hid: 'og:url', property: 'og:url', content: 'http://onsports.vn' },
          { hid: 'og:image', property: 'og:image', content: 'http://onsports.vn/logo16x9.png' },
          { hid: 'og:image:alt', property: 'og:image:alt', content: 'ONSports.vn' },
          { hid: 'og:image:width', property: 'og:image:width', content: '160' },
          { hid: 'og:image:height', property: 'og:image:height', content: '90' },
          { name: 'google-site-verification', content: 'fZOtnkHJ4UjyUCoGyU88XaouooL3HA9M3mS8bbWYuRk' }
        ]
      }
    },
    mounted () {},
    computed: {
      data () {
        return this.$store.state.home.data
      }
    },
    methods: {
      checkTypeComponent (block) {
        let componentName = 'div'
        switch (block.type) {
          case 'post':
            componentName = 'RecentNews'
            break
          case 'category':
            if (block.screen_block_items.length > 2) {
              componentName = 'Mini'
            } else {
              componentName = 'Big'
            }
            break
          case 'longform':
            componentName = 'LongForm'
            break
          case 'event':
            componentName = 'Event'
            break
          case 'media':
            componentName = 'Media'
            break
          case 'pundit':
            componentName = 'Pundit'
            break
          case 'gallery':
            componentName = 'Gallery'
            break
          default:
            componentName = 'div'
            break
        }
        return componentName
      }
    },
    components: {
      Big,
      Mini,
      Media,
      LongForm,
      Gallery,
      Pundit,
      Event
    }
  }
</script>

<style scoped>
.title {
  margin: 30px 0;
}

.users {
  list-style: none;
  margin: 0;
  padding: 0;
}

.user {
  margin: 10px 0;
}
</style>
