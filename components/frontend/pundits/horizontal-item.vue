<template >
  <article class="cd">
    <div class="cd__wrapper " :class="{ 'big-image' : bigImage} ">
      <div class="media ">
        <a href="# ">
          <blur-image v-if="data && data.avatar " :aspectRatio="aspectRatio " :src="data.avatar " :alt="data.name" />
        </a>
      </div>
      <div class="cd__content ">
        <h3 class="cd__headline ">
          <nuxt-link :to="handleLink({item_type: 'pundit', slug: data.slug}) ">
            <span class="cd__headline-text " v-if="data && data.name ">{{ data.name || 'Anomynous Pundits' }}</span>
          </nuxt-link>
        </h3>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {

  },
  props: {
    type: {
      type: String,
      default: 'image' // image video
    },
    theme: {
      type: String,
      default: 'light' //  light or dark
    },
    big: {
      // big font
      type: Boolean,
      default: false
    },
    bigImage: {
      // big font
      type: Boolean,
      default: false
    },
    aspectRatio: {
      // square image or not
      type: Number
    },
    data: {
      type: Object,
      required: true
    }
  },
  components: {}
}
</script>

<style scoped>
.cd {
  padding-bottom: 5px;
  font-weight: 400;
  font-size: 14px;
  display: block;
  color: #404040;
  border-top: 1px solid #404040;
  overflow-y: auto;
}

.cd__wrapper {
  border-color: transparent;
  position: relative;
}

.media {
  display: block;
  overflow: hidden;
  position: relative;
  float: left;
  width: 25%;
}
.big-image .media {
  width: 40%;
}
.big-image .cd__content {
  width: 60%;
}
.cd__content {
  float: left;
  width: 75%;
  padding: 4px 0;
  position: relative;
  padding-left: 10px;
  text-align: left;
}
.cd__content .cd__headline.big {
  font-size: 20px;
}
.cd__content .cd__headline {
  font-weight: 300;
  font-family: "Onsport", sans-serif;
  font-size: inherit;
  line-height: 1.2;
}
.cd__content .cd__headline:hover {
  color: #4545a2;
}
.cd__content .cd__headline a {
  color: inherit;
}
.media .duration {
  position: absolute;
  bottom: 0px;
  padding: 7px;
  background: hsla(0, 0%, 5%, 0.3);
  font-size: 15px;
  color: #000;
}
</style>
