<template>
  <div class="the-longform">
    <div class="module p-0">
      <my-heading :data="post"></my-heading>
    </div>
    <div class="module p-0" v-if="post && post.content">
      <div class="container-fluid">
        <div class="content p-t-20">
          <instructions :content="post.content" :ios="ios" :class="{'ios' :ios}"></instructions>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Instructions from '~/components/frontend/posts/Instructions'
import MyHeading from '~/components/frontend/posts/longform_head'
export default {
  name: 'longform-mobile',
  data () {
    return {
      theme: 'light',
      maxHeight: 0
    }
  },
  props: ['post', 'ios'],
  computed: {
  },
  created () {

  },
  mounted () {

  },
  beforeDestroy () {
  },
  methods: {

  },
  components: {
    Instructions,
    MyHeading
  }
}
</script>
<style scoped>
div.tag-list {
  max-width: 800px;
  margin: 0 auto;
  clear: both;
}
.relate {
  width: 100%;
}

.columns {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}
.columns:not(:last-child) {
  margin-bottom: calc(1.5rem - 0.75rem);
}
.column {
  display: block;
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -ms-flex-negative: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}
.column {
  -webkit-box-flex: 0;
  -ms-flex: none;
  flex: none;
  width: 50%;
}
@media (max-width: 991px) and (min-width: 640px) {
  .column {
    width: 33.33%;
  }
}
@media screen and (min-width: 992px) {
  .column {
    width: 25%;
  }
}
</style>
