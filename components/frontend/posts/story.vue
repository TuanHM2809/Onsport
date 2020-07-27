<template>
  <div class="story-wrapper">
    <div class="story-title">{{title}}</div>
    <div class="story-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  export default{
    data () {
      return {
  
      }
    },
    props: ['title']
  }
</script>
<style scoped>
.story-wrapper {
  clear: both;
  cursor: default;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  float: left;
}
.story-title {
  color: #262626;
  padding: 10px 0;
  
  font-weight: 700;
  font-size: 22px;
  line-height: 1.2;
}
.story-content {
  border-top: 1px solid;
  padding: 10px 0;
  
  font-weight: 400;
  font-size: 16px;
  line-height: 1.4285714286;
  border-color: #d9d9d9;
}
.story-content strong {
  font-weight: 800;
}
@media (min-width: 480px) {
  .story-wrapper {
    width: 300px;
    padding: 10px;
    margin-bottom: 30px;
    margin-top: 10px;
    margin-right: 30px;
  }
}
</style>
