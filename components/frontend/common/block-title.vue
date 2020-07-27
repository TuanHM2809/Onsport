<template >
  <div class="block-title m-b-10" :class="{'dark' : theme === 'dark','colored': colored}">
    <h2 v-if="url">
      {{ title }}
      <nuxt-link :to="url">
        Xem tất cả
      </nuxt-link>
    </h2>
    <h2 v-else>
      {{ title }}
    </h2>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    theme: {
      type: String,
      required: false,
      default: 'light' //  dark or light
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: false
    },
    colored: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  }
}
</script>

