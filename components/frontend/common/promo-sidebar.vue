<template>
  <div>
    <cate-title title="phet" />
    <horizontal-item :aspectRatio="1" v-for="i in 5" :key="i"></horizontal-item>
  </div>
</template>
<script>
  import Catetitle from '~/components/frontend/common/cate-title.vue'
  import HorizontalItem from '~/components/frontend/common/horizontal-item.vue'
  export default {
    data () {
      return {

      }
    },
    components: {
      Catetitle,
      HorizontalItem
    }
  }
</script>