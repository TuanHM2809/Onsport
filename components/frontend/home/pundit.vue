<template>
  <div class="media-cate ">
    <div class="container">
      <block-title v-if="data && data.name" :title="data.name" :url="data.url" />
      <div class="pundit-wrapper" v-if="data && data.screen_block_items">
        <div v-for="item in data.screen_block_items" :key="item.id" class="on-pundit sdc-site-tiles__item on-pundit--has-link m-t-10 m-b-10">
          <div class="on-pundit__inner">
            <div class="on-pundit__figure">
              <nuxt-link v-if="item && item.pundit && item.pundit.id" :to="handleLink({item_type: 'pundit', slug: item.pundit.slug})" class="on-pundit__figure-image-wrap">
                <blur-image rounded :aspectRatio="1" v-if="item && item.pundit && item.pundit.avatar" :src="item.pundit.avatar" :alt="item.pundit.name" class="on-pundit__figure-image" />
              </nuxt-link>
            </div>
            <div class="on-pundit__body">
              <nuxt-link v-if="item && item.pundit && item.pundit.id" :to="handleLink({item_type: 'pundit', slug: item.pundit.slug})">
                <span class="on-pundit__tag" v-if="item && item.pundit && item.pundit.name">{{ item.pundit.name }} </span>
              </nuxt-link>
              <h4 class="on-pundit__headline">
                <nuxt-link :to="handleLink(item)" class="on-pundit__headline-link">
                  <span class="on-pundit__headline-text">
                    <span>{{ item.title}}</span>
                  </span>
                </nuxt-link>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
 import BlockTitle from '~/components/frontend/common/block-title.vue'
 export default {
   props: {
     data: {
       type: Object
     }
   },
   components: {
     BlockTitle
   }
 }
</script>

<style scoped>
.pundit-wrapper {
  display: block;
}
.on-pundit {
  text-align: center;
  position: relative;
  font-size: 1.35em;
  border: 5px solid hsla(0, 0%, 100%, 0.1);
  background-color: #fff;
  background-clip: padding-box;
  cursor: pointer;
}

.on-pundit:before {
  box-shadow: 1px 1px 15px rgba(0, 0, 0, 0.14);
  border: 1px solid hsla(0, 0%, 100%, 0);
  content: "";
  position: absolute;
  pointer-events: none;
  top: -5px;
  left: -5px;
  bottom: -5px;
  right: -5px;
}

.on-pundit__inner {
  /* background: radial-gradient(circle at center, #fff 0, #f7f7f7 100%);*/
  padding: 1em 0 2em;
  height: 100%;
}
.on-pundit__inner:after {
  content: "";
  position: absolute;
  pointer-events: none;
  top: -15px;
  left: -5px;
  bottom: -15px;
  right: -5px;
  background-image: radial-gradient(
      hsla(0, 0%, 100%, 0.8) 15%,
      hsla(0, 0%, 100%, 0.15) 38%,
      hsla(0, 0%, 100%, 0) 50%
    ),
    radial-gradient(
      hsla(0, 0%, 100%, 0.8) 15%,
      hsla(0, 0%, 100%, 0.15) 38%,
      hsla(0, 0%, 100%, 0) 50%
    ),
    radial-gradient(
      hsla(0, 0%, 100%, 0.8) 15%,
      hsla(0, 0%, 100%, 0.35) 35%,
      hsla(0, 0%, 100%, 0.15) 40%,
      hsla(0, 0%, 100%, 0) 50%
    ),
    radial-gradient(
      hsla(0, 0%, 100%, 0.8) 15%,
      hsla(0, 0%, 100%, 0.35) 35%,
      hsla(0, 0%, 100%, 0.15) 40%,
      hsla(0, 0%, 100%, 0) 50%
    );
  background-repeat: no-repeat;
  background-position: left -120px top 6px, right -120px bottom 5px,
    left 0 top -1px, right 0 bottom -2px;
  background-size: 300px 14px, 300px 14px, 60px 28px, 60px 28px;
  opacity: 0;
  transition: background-position 0.5s ease-out, opacity 0.5s ease-out;
  will-change: background-position, opacity;
}

.sdc-site-tiles__group:after {
  clear: both;
  content: "";
  display: table;
}
.on-pundit__inner:hover {
  background-color: #f2f2f2;
  transition: background-color 0.3s ease;
}
.on-pundit__inner:hover:after {
  background-position: left calc(100% + 67px) top 6px,
    right calc(100% + 67px) bottom 5px, left calc(100% - 50px) top -1px,
    right calc(100% - 50px) bottom -1px;
  opacity: 0.9;
}

.on-pundit:after,
.sdc-site-tile:after {
  z-index: 5;
}

.sdc-site-tiles__item {
  min-height: 50px;
  display: block;
}

.on-pundit__figure {
  display: inline-block;
  width: 50%;
  margin: 1em 0;
  position: relative;
  z-index: 4;
}

.on-pundit__figure-image-wrap {
  position: relative;
  padding-bottom: 100%;
  display: block;
  overflow: hidden;
}

.on-pundit__figure-image {
  position: absolute;
  left: 0;
  width: 100%;
  border-radius: 50%;
  border: 5px solid #fff;
  background: #fff;
}

.on-pundit__tag {
  font-weight: 400;
  font-size: 16px;
  color: #0a1388;
  margin-bottom: 0.1em;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  padding: 3px 5px;
  text-overflow: ellipsis;
  line-height: 1.3;
  position: relative;
  z-index: 5;
}
.on-pundit__tag:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.on-pundit__headline {
  font-size: 24px;
  line-height: 1.3333;
  font-weight: 300;
  padding: 0 24px;
}

.on-pundit__inner:hover .on-pundit__headline:after {
  background-color: #f2f2f2;
}
.on-pundit__headline-text {
  position: relative;
  z-index: 4;
  background: inherit;
}
.on-pundit__headline-text:hover {
  color: #4545a2;
}

.on-pundit__headline-link:before,
.on-pundit__headline:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
}

.on-pundit__headline:after {
  opacity: 0;
  transition: opacity 0.5s;
  z-index: 3;
}

.on-pundit__headline-link:before,
.on-pundit__headline:after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
}

@media (min-width: 640px) {
  .sdc-site-tiles__item {
    display: inline-block;
    width: calc(33.33% - 10px);
    margin: 0;
    counter-increment: items-to-show-3;
  }
  .pundit-wrapper {
    display: flex;
  }
  .sdc-site-tiles__item:not(:first-child):not(:last-child) {
    margin-left: 15px;
    margin-right: 15px;
  }
}
</style>


