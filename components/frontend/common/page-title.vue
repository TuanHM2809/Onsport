<template>
  <div class="header-page">
    <h1 :style="titleStyle" class="pg-headline">{{title}}</h1>
    <div :style="metaStyle" class="metadata" v-if="author || createdAt">
      <div>
        <p class="writer">
          <nuxt-link class="p-r-10" v-if="author" :to="handleLink({item_type: 'author', slug: author[0].slug})"> {{ author[0].name }}</nuxt-link>
          <span class="update-time" v-if="createdAt">{{createdAt}}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  // import moment from 'moment'
  export default {
    data () {
      return {

      }
    },
    props: {
      title: {
        type: String,
        required: true
      },
      time: {
        type: String
      },
      author: {
        type: Array
      },
      createdAt: {
        type: String
      },
      titleStyle: {
        type: Object
      },
      metaStyle: {
        type: Object
      }
    },
    computed: {

    }
  }
</script>
