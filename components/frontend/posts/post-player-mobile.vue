<template>
  <div v-if="video" class="" :style="setWidth">
    <figure class="fake-video-player">
      <img class="img-responsive" :src="buildThumb(video.thumbnail)" alt="">
      <a :href="`video://${fileId}`">
        <div class="media__icon center-icon">
          <i class=" fa  fa-play"></i>
        </div>
      </a>
      <figcaption>{{ title}}</figcaption>
    </figure>
  </div>
</template>

<script>

export default {
  name: 'fake-video-player',
  props: {
    options: {
      type: Object,
      required: false
    },
    fileId: {
      required: true
    },
    start: {
      type: Number,
      default: function () {
        return 0
      }
    },
    width: {
      required: false
    },
    height: {
      required: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      top: null,
      offset: null,
      video: null
    }
  },
  computed: {
    setWidth () {
      if (this.width) {
        return {
          width: this.width + 'px'
        }
      } else {
        return {}
      }
    }
  },
  async created () {
    await this.getLink()
  },
  mounted: function () {

  },
  beforeDestroy: function () {

  },
  methods: {
    async getLink () {
      if (this.fileId) {
        try {
          const response = await this.$axios.$get(`/videos/${this.fileId}`)
          if (response.code === 0) {
            const {data} = response
            this.video = data
            console.log(this.video)
          } else {
            this.$toast.error(response.message)
          }
        } catch (e) {
          console.log(e)
        }
      }
    },
    isHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    },
    buildThumb (image, hq = false) {
      if (!image) return `/loading.png`
      return this.isHttpLink(image) ? image : process.env.controlUrl + image
    }
  },
  watch: {
    fileId: {
      handler: async function (fileId, oldFileId) {
        this.reload()
      }
    }
  }
}
</script>
<style>
@media (max-width: 639px) {
  figure.fake-video-player {
    padding: 0;
    position: relative;
  }
  .media__icon.center-icon {
    top: 50%;
    left: 50%;
    bottom: auto;
    padding: 5px;
    border-radius: 30px;
    line-height: 40px;
    display: inline-block;
    height: 50px;
    width: 50px;
    text-align: center;
    background-color: #4545a2;
    opacity: 0.7;
    transform: translate(-50%, -50%);
    position: absolute;
    color: white;
  }
  .media__icon.center-icon i {
    color: #fff;
    font-size: 32px;
    font-size: 2rem;
    margin: 0 0 0 5px;
    line-height: 40px;
  }
}
@media (min-width: 639px) {
  figure.fake-video-player {
    margin: 0 -5px;
    /* width: calc(100% + 20px); */
    width: calc(100% + 20px) !important;
  }
}
</style>
