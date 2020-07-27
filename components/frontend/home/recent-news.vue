<template>
  <!-- Recent news -->
  <div class="media-cate" id="recent-news">
    <div class="container p-t-0 p-b-15">
      <div class="row">
        <div class="col-xs-12 p-l-0 p-r-0">
          <div class="columns">
            <div ref="content" class="column">
              <div ref="topContent" class="large-post" v-if="feature">
                <blur-image :src="feature.thumbnail" :alt="feature.name" medium></blur-image>
                <h1 class="title">
                  <nuxt-link :to="handleLink(feature)">{{ feature.name }}
                    <span v-if="feature.item_type === 'file'" class="fa fa-film m-l-5"></span>
                    <span v-if="feature.short_title"> - {{ feature.short_title}}</span>
                  </nuxt-link>
                </h1>
              </div>
              <ul ref="bottomContent" class="list-post" v-if="latest">
                <li class="small-post" v-for="item in latest" :key="item.id">
                  <nuxt-link :to="handleLink(item)" class="">{{item.name}}
                    <span v-if="item.item_type === 'file'" class="fa fa-film m-l-5"></span>
                    <span v-if="item.short_title"> - {{ item.short_title}}</span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
            <div class="column is-narrow hidden-sm hidden-xs">
              <div style="width: 300px; height: 100%">
                <div v-if="image" class="right-aside">
                  <nuxt-link v-if="url && url.value && !testHttpLink(url.value)" :to="handleLink({link: url.value})">
                    <div class="opaci"></div>
                    <blur-image :imageStyle="{height:'100%', width:'auto', minWidth: '100%', minHeight:'100%'}" class="right-image" :aspectRatio="ratio" :src="image.value" :alt="image.name"></blur-image>
                  </nuxt-link>
                  <a v-else-if="url && url.value && testHttpLink(url.value)" :href="url.value" target="_blank">
                    <div class="opaci"></div>
                    <blur-image :imageStyle="{height:'100%', width:'auto', minWidth: '100%', minHeight:'100%'}" class="right-image" :aspectRatio="ratio" :src="image.value" :alt="image.name"></blur-image>
                  </a>
                  <blur-image v-else class="right-image" :aspectRatio="ratio" :src="image.value" :imageStyle="{height:'100%', width:'auto', minWidth: '100%', minHeight:'100%'}" :alt="image.name"></blur-image>
                  <nuxt-link v-if="url && url.value && !testHttpLink(url.value)" :to="handleLink({link: url.value})">
                    <h4 class="right-title" v-if="title">
                      {{ title.value }}
                    </h4>
                  </nuxt-link>
                  <a v-else-if="url && url.value && testHttpLink(url.value)" :href="url.value" target="_blank">
                    <h4 class=" right-title " v-if="title ">
                      {{ title.value }}
                    </h4>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      ratio: 2,
      ads: []
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    feature () {
      return this.data.screen_block_items[0]
    },
    latest () {
      return this.data.screen_block_items.slice(1, 9999)
    },
    browserWidth () {
      return this.$store.state.size.width
    },
    settings () {
      return this.$store.state.settings.data
    },
    image () {
      return this.settings.length > 0 && this.settings.find(ads => ads.key === 'ads_image')
    },
    url () {
      return this.settings.length > 0 && this.settings.find(ads => ads.key === 'ads_url')
    },
    title () {
      return this.settings.length > 0 && this.settings.find(ads => ads.key === 'ads_title')
    }
  },
  mounted () {
    this.calculateRatio()
    // console.log(this.buildThumb(this.imgUrl))
  },
  methods: {
    calculateRatio () {
      const topContentHeight = this.$refs && this.$refs.topContent ? this.$refs.topContent.getBoundingClientRect().height : 0
      const bottomContentHeight = this.$refs && this.$refs.bottomContent ? this.$refs.bottomContent.getBoundingClientRect().height : 0
      // console.log('bottom:', bottomContentHeight)
      // console.log('top:', topContentHeight)
      this.ratio = (bottomContentHeight + topContentHeight) / 300
    },
    testHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    }
  },
  watch: {
    browserWidth (aha) {
      this.calculateRatio()
    }
  },
  components: {

  }
}
</script>

<style lang="css">
img[lazy="loading"] {
  width: 100%;
  padding-bottom: 56.25%;
}
img[lazy="error"],
img[lazy="loaded"] {
  padding-bottom: 0;
}

</style>
