<template >
  <h3 class="media-cate-title">
    <nuxt-link v-if="to" :to="to">
      {{ title}}
    </nuxt-link>
    <h4 v-else>
      {{ title}}
    </h4>
  </h3>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    to: {
      required: false
    },
    theme: {
      type: String,
      default: 'light' // light or dark
    },
    arrow: {
      type: Boolean,
      default: true
    }
  }
}
</script>

