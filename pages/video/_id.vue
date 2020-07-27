<template>
  <div>
    <div class="module root" :class="{dark: theme ==='dark'}">
      <div class="container">
        <div class="row fixrow">
          <div class="media-video col-md-9">
            <div v-if="video && video.url" class="media-wrapper">
              <transition name="module" mode="out-in">
<!--                <div class="row">-->
                  <player class="vjs-custom-skin" ref="videoPlayer" :options="playerOptions"></player>
<!--                </div>-->
              </transition>
            </div>
            <div v-else class="media-wrapper">
              <div class="row">
                <div class="col-xs-12" style="padding-bottom: 56.25%; position:relative;">
                  <div class="notify center-block" v-if="!$store.getters.isAuthenticated">
                    <p>Vui lòng đăng nhập để xem nội dung</p>
                    <button @click.prevent="login()" class="btn btn-danger">Đăng nhập</button>
                  </div>
                  <div class="notify center-block" v-else>
                    <p>Nội dung đang gián đoạn. Vui lòng thử lại sau</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="info-wrapper">
              <h1 class="media__video-headline" v-if="video.title">{{ video.title}}</h1>
              <div class="media__video-description text-justify" v-html="video.description" v-if="video.description"></div>
              <p class="source text-right m-t-0" style="color: #777">
                <strong>Nguồn: Bóng đá TV, Thể thao TV (VTVcab)</strong>
              </p>
	            <!--<div v-bind:data-href="'http://onsports.vn/video/'+video.slug" class="fb-comments" data-width="100%" data-numposts="10"></div>-->
              <block-title :title="'Bình Luận'" />
              <div class="module" style="background-color: #fafafa;">
                <comment-box :itemId="video.id" :itemType="video.type" />
              </div>
              
              <div class="tag-list" v-if="video.tags">
                <tag-list :tags="video.tags" />
              </div>
              
            </div>
          </div>
          <div class="col-md-3">
          <h2 style="font-size: 26px;margin-top:0px; margin-bottom: 15px">Xem gì hôm nay?</h2>
          <div class="highlight-today">
            <a href="#">
              <img src="@/assets/img/01.jpg" alt="">
            </a>
          </div>
          <h2 style="font-size: 26px;">Top cầu thủ ghi bàn</h2>
            <div class="highlight-today">
                <iframe frameborder="0"  scrolling="no" width="255" height="390" src="https://www.fctables.com/vietnam/v-league/iframe=/?type=top-scorers&lang_id=21&country=235&template=371&team=&timezone=Asia/Bangkok&time=24&limit=10&ppo=1&pte=1&pgo=1&pma=0&pas=0&ppe=0&width=255&height=390&font=Arial&fs=12&lh=20&bg=FFFFFF&fc=222&logo=1&tlink=0&ths=1&thb=1&thba=ffffff&thc=222&bc=dddddd&hob=f5f5f5&hobc=ebe7e7&lc=222&sh=0&hfb=1&hbc=3bafda&hfc=FFFFFF"></iframe>
              </div>
          </div>
        </div>
      </div>
    </div>

    <div class="module" v-if="video && video.related">
      <div class="container">
        <block-title :arrow="false" title="Video liên quan" />
        <div v-if="video.related" class="relate">
          <div class="columns">
            <vertical-item class="column" v-for="relate in video.related" :key="relate.id" :data="relate" />
          </div>
        </div>
      </div>
    </div>

    <share-box class="article-share"></share-box>
    <!--<popup v-show="isIos" />-->
  </div>
</template>


<script>
  import player from '~/components/frontend/common/player.vue'
  import CateTitle from '~/components/frontend/common/cate-title.vue'
  import BlockTitle from '~/components/frontend/common/block-title.vue'
  import VerticalItem from '~/components/frontend/common/vertical-item.vue'
  import TagList from '~/components/frontend/posts/tag.vue'
  import UAParser from '~/utils/ua-parse'
  import Popup from '~/components/frontend/event/popup.vue'

  export default {
    layout: 'default',
    async asyncData ({app, params, error, userAgent}) {
      let isIos = false
      if (userAgent) {
        isIos = UAParser(userAgent).isIos
      }
      try {
        const response = await app.$axios.$get(`/videos/${params.id}`)
        if (response.code === 0) {
          return {video: response.data, isIos}
        } else {
          // app.$toast.error(response.message)
          error({ statusCode: 404, message: 'Video không tồn tại' })
        }
      } catch (e) {
        console.log(e)
      }
    },
    validate ({ params }) {
      return (!!params.id)
    },
    head () {
      const video = this.video
      let keywords = ' '
      if (video && video.tags) {
        keywords = video.tags.map(function (elem) {
          return elem.name
        }).join(', ')
      }

      const isHttpLink = (link) => {
        const pattern = new RegExp('^(http|https)')
        return pattern.test(link)
      }

      const generateLink = (link) => {
        if (isHttpLink(link)) {
          return link
        } else {
          return encodeURI(`${process.env.controlUrl}${link}`)
        }
      }
      return {
        title: video && video.title ? video.title : 'OnSports',
        meta: [
          { hid: 'keywords',
            name: 'keywords',
            content: (video && video.tags ? keywords : '') || ''
          },
          { hid: 'description', name: 'description', content: video && video.description ? video.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:title', property: 'og:title', content: video && video.title ? video.title : '' },
          { hid: 'og:type', property: 'og:type', content: 'video.other' },
          { hid: 'og:description', property: 'og:description', content: video && video.description ? video.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:image', property: 'og:image', content: video && video.thumbnail ? generateLink(video.thumbnail) : '' },
          { hid: 'og:image:alt', property: 'og:image:alt', content: video && video.description ? video.description.trim().replace(/<[^>]*>?/g, '') : '' },
          { hid: 'og:image:width', property: 'og:image:width', content: '512' },
          { hid: 'og:image:height', property: 'og:image:height', content: '288' },
          { hid: 'og:url', property: 'og:url', content: 'http://onsports.vn/video/' + video.slug },
          { hid: 'al:ios:app_store_id', property: 'al:ios:app_store_id', content: '1282845933' },
          { hid: 'al:ios:app_name', property: 'al:ios:app_name', content: 'ON Sports' },
          { hid: 'al:ios:url', property: 'al:ios:url', content: 'onsports://video/' + video.slug },
          { hid: 'al:web:should_fallback', content: 'false' },
          {hid: 'al:android:url', property: 'al:android:url', content: 'onsports://video/' + video.slug},
          {hid: 'al:android:package', property: 'al:android:package', content: 'com.vtvcab.onsports'},
          {hid: 'al:android:app_name', property: 'al:android:app_name', content: 'ON Sports'}
        ]
      }
    },
    data () {
      return {
        theme: 'light',
        isIos: false,
        playerOptions: {
          muted: false,
          autoplay: true,
          aspectRatio: '16:9',
          sources: []
        }
      }
    },
    computed: {
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      }
    },
    created () {
      this.setup()
    },
    mounted () {
    window.FB.XFBML.parse();
      // this.$nextTick(() => {
      //   let Ua = UAParser(navigator.userAgent)
      //   if (Ua.isIos) {
      //     this.isIos = true
      //   }
      // })
    },
    beforeDestroy () {},
    methods: {
      async fetchData () {
        try {
          const response = await this.$axios.$get(`/videos/${this.$route.params.id}`)
          if (response.code === 0) {
            this.video = response.data
          }
        } catch (e) {
          console.log(e)
        }
      },
      setup () {
        if (this.video && this.video.url) {
          const url = this.video.fullUrl ? this.video.fullUrl : this.video.url
          if (url.trim().includes('m3u8')) {
            this.playerOptions = Object.assign(this.playerOptions, {
              sources: [
                {
                  type: 'application/x-mpegURL',
                  src: url || ''
                }
              ]
            })
          } else {
            this.playerOptions = Object.assign(this.playerOptions, {
              sources: [
                {
                  type: 'video/mp4',
                  src: this.video.url ? this.video.url : ''
                }
              ]
            })
          }
        }
      },
      isHttpLink (link) {
        const pattern = new RegExp('^(http|https)')
        return pattern.test(link)
      },
      generateLink (link) {
        if (this.isHttpLink(link)) {
          return link
        } else {
          return encodeURI(`${process.env.controlUrl}${link}`)
        }
      }
    },
    watch: {
      async isAuthenticated () {
        await this.fetchData()
      },
      video () {
        this.setup()
      }
    },
    components: {
      CateTitle,
      BlockTitle,
      VerticalItem,
      TagList,
      player,
      Popup
    }
  }
</script>

<style scoped>
.media-wrapper {
  padding-bottom: 0px;
  position: relative;
  overflow: hidden;
  background: transparent;
  margin: 0 0 10px;
}

.ads-right-wrapper {
  margin: 0 auto 20px;
  display: block;
  overflow: hidden;
  color: #404040;
}

.dark .ads-right-wrapper {
  color: #fefefe;
}

.ads-right-wrapper > h1,
.ads-right-wrapper > h2 {
  margin-bottom: 15px;
  font-family: "OnSport", sans-serif;
  font-weight: 300;
  text-align: justify;
  -webkit-font-smoothing: antialiased;
  font-size: 28px;
  line-height: 1.133;
}

div.tag-list {
  margin: 0 auto;
  clear: both;
}
.relate {
  width: 100%;
}
.notify {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  color: #fff;
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
@media (max-width: 640px) {
  .ads-right-wrapper > h1,
  .ads-right-wrapper > h2 {
    font-size: 24px;
  }
}

@media screen and (min-width: 992px) {
  .column {
    width: 33.33%;
  }
  .media-video .media-wrapper {
    float: left;
    width: 100%;
    overflow: hidden;
  }
  .ads-right-wrapper {
    float: right;
    margin-right: -320px;
    width: 300px;
  }
}
@media screen and (min-width: 1400px) {
  .module.root > .container {
    padding-top: 25px;
  }
}

.on-ads{background:#eae9e9; padding:30px 0; text-align:center}
@media (max-width: 780px){
	.on-ads{padding:15px 0}
}

.info-wrapper strong {
  FONT-SIZE: 16px;
  color: rgb(0, 0, 0);
}

@media screen and (min-width: 992px) {
  .highlight-today {
    height:auto;
  }
}
.highlight-today img{
  max-width:100%;
}
.fixrow {
    max-width:inherit !important;
    margin-left:-15px;
    margin-right:-15px;
}

</style>
