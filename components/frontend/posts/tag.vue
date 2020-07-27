<template>
  <div class="postTags" v-if="tags">
    <div class="p-b-20">
      <ul class="tags tags--postTags tags--borderless">
        <li v-for="tag in tags" :key="tag.id">
          <nuxt-link :to="handleLink({item_type: 'tag', slug:tag.slug})">
            {{ tag.name}}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['tags']
}
</script>

<style scoped>
/* global css for tag */
.postTags {
  display: block;
  clear: both;
}

.tags {
  font-size: 15px;
  letter-spacing: 0;
  font-weight: 400;
  font-style: normal;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2) !important;
  padding: 0;
  margin: 0;
}

.tags--postTags > li {
  margin-right: 6px;
  margin-bottom: 6px;
}
.tags--postTags > li {
  
  font-weight: 400;
  font-style: normal;
  color: rgba(0, 0, 0, 0.54);
  font-size: 13px;
  letter-spacing: 0;
  text-decoration: none;
  background: #fafafa;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  border: 1px solid #f0f0f0;
  padding: 4px 13px;
  display: inline-block;
  position: relative;
}
.tags--borderless > li {
  border: none;
  color: rgba(0, 0, 0, 0.68);
  background: rgba(0, 0, 0, 0.05);
}
.tags > li a:hover {
  color: #0a1388;
}
@media screen and (max-width: 640px) {
  .tags {
    padding: 0 10px;
  }
}
</style>

