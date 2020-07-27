<template>
  <div class="cover-basic">
    <div class="opaci" v-cloak></div>
    <blur-background v-if="isMobile" :style="blurImageStyle" :src="data.poster_mobile ? data.poster_mobile: data.poster" />
    <blur-background v-else :style="blurImageStyle" :src="data.poster" />
    <div class="cover-text-outside-wrapper" :class="`${data.title_position}`">
      <div class="cover-text-inside-wrapper">
        <h1 class="cover-title ">
          {{ data.title}}
        </h1>
        <h2 class="cover-subtitle p-b-5" v-if="data.short_title">
          {{ data.short_title}}
        </h2>
        <div class="meta-wrapper">
          <div class="cover-author p-b-5" v-if="data.author && data.author.length > 0">
            <div class="box_author" v-for="au in data.author" :key="au.id">
              <div class="avata_box_author">
                <nuxt-link :to="handleLink({item_type: 'author', slug: au.slug})">
                  <blur-image v-if="au.avatar" :imageStyle="authorWrapperStyle" :src="au.avatar" :alt="au.name" :aspectRatio="1" />
                </nuxt-link>
              </div>
              <p class="author_name">
                <nuxt-link :to="handleLink({item_type: 'author', slug: au.slug})">{{au.name}}</nuxt-link>
                <span>{{au.bio}}</span>
              </p>
            </div>
          </div>
          <p v-if="data && data.source " class="cover-source">
            <em>{{data.source}}</em>
          </p>
          <p class="cover-meta">
            <span class="update-time" v-if="data.date || data.created_at">{{createdTime(data)}}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {

    }
  },
  props: [
    'data'
  ],
  computed: {
    created () {
      const createdAt = moment.utc(this.data.created_at)
      if (!!this.post.created_at && !!this.post.date) {
        const publishedAt = moment.utc(this.post.date)
        if (publishedAt.isSameOrAfter(createdAt)) {
          return publishedAt.format('HH:mm | DD-MM-YYYY')
        } else {
          return createdAt.format('HH:mm | DD-MM-YYYY ')
        }
      }
      return createdAt.format('HH:mm | DD-MM-YYYY ')
    },
    isMobile () {
      return this.$store.state.size.isMobile
    },
    matchResults () {
      return this.$store.state.matchResult.data
    },
    headerHeight () {
      if (this.matchResults && this.matchResults.length > 0) {
        return 117
      } else {
        return 50
      }
    },
    blurImageStyle () {
      if (!this.isMobile) {
        return {width: '100%', minWidth: '100vw', height: `calc(100vh - 350px)`, objectFit: 'inherit'}
      } else {
        return {width: '100%', minWidth: '100vw', height: `calc(100vh - ${this.headerHeight}px - 4em)`, objectFit: 'inherit'}
      }
    },
    authorWrapperStyle () {
      if (this.isMobile) {
        return {
          width: '60px',
          height: '60px',
          borderRadius: '50%'
        }
      } else {
        return {
          width: '100px',
          height: '100px',
          borderRadius: '50%'
        }
      }
    }
  },
  methods: {
    createdTime (data) {
      moment.locales('vi')
      const createdAt = moment.utc(data.created_at).add(7, 'hour')
      if (!!data.created_at && !!data.date) {
        const publishedAt = moment.utc(data.date)
        if (publishedAt.isSameOrAfter(createdAt)) {
          return publishedAt.format('HH:mm | DD-MM-YYYY')
        } else {
          // console.log(data.created_at)
          return createdAt.format('HH:mm | DD-MM-YYYY')
        }
      }
      return createdAt.format('HH:mm | DD-MM-YYYY')
    }
  },
  mounted () {
    // this.headerHeight = document.getElementById('nav__plain-header').getBoundingClientRect().height
  }
}
</script>
<style scoped>
.cover-basic {
  position: relative;
  z-index: 12;
}
.opaci {
  width: 100%;
  height: 100%;
  z-index: 11;
  top: 0;
  left: 0;
  position: absolute;
  background: rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}
.opaci:hover {
  background: transparent;
}
.cover-text-outside-wrapper {
  width: 100%;
  position: absolute;
  z-index: 13;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
}
.cover-text-inside-wrapper {
  text-align: center;
  color: #eeeeee;
  
  line-height: 1;
}
h1,
h2,
h3 {
  line-height: 1.113;
}
h1 {
  font-size: 28px;
  line-height: inherit;
  font-weight: 500;
  margin-bottom: 10px;
}
h2 {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 10px;
}
h3.cover-author:hover {
  color: #ffffff;
}
span {
  font-size: 14px;
}
.cover-subtitle,
.cover-meta,
.cover-author,
.cover-source {
  width: 100%;
  max-width: 100%;
  padding: 0;
  color: white;
  opacity: 0.875;
  
}
.cover-subtitle {
  text-transform: uppercase;
}
.cover-meta {
  margin-bottom: 0;
  margin-top: 1em;
  overflow: hidden;
  position: relative;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  font-size: 14px;
}
.cover-meta a {
  color: #0a1388;
  cursor: pointer;
}
.cover-meta a:hover {
  text-decoration: underline;
}
.cover-source {
  
  font-weight: normal;
  color: inherit;
  font-size: 18px;
  margin: 20px 0;
}
h3.cover-author:hover {
  color: #ffffff;
  opacity: 1;
}

.box_author {
  width: 80px;
  vertical-align: top;
  display: inline-block;
  padding: 10px;
}

.box_author .avata_box_author {
  text-align: center;
  margin-bottom: 10px;
}
.box_author .author_name {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  line-height: 18px;
}
.box_author .author_name a {
  color: #fff;
}
.box_author .author_name span {
  display: block;
  font-size: 13px;
  font-weight: normal;
  color: #ccc;
}

@media (min-width: 640px) {
  .box_author {
    width: 120px;
    display: inline-block;
    padding: 10px;
  }
  h1 {
    font-size: 4em;
    margin: 0;
  }
  h2 {
    font-size: 2.2em;
  }
  h3 {
    font-size: 1.6em;
  }
  span {
    font-size: 1.1em;
  }
  .cover-subtitle,
  .cover-meta,
  .cover-author {
    margin: 0;
  }
  .cover-text-outside-wrapper.top {
    top: 40px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .cover-text-outside-wrapper.top_left {
    top: 20px;
    left: 20px;
    transform: translate(0, 0);
  }
  .cover-text-outside-wrapper.top_right {
    left: auto;
    top: 20px;
    right: 20px;
    transform: translate(0, 0);
  }
  .cover-text-outside-wrapper.bottom {
    top: auto;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .cover-text-outside-wrapper.bottom_left {
    top: auto;
    bottom: 20px;
    left: 20px;
    transform: translate(0, 0);
  }
  .cover-text-outside-wrapper.bottom_right {
    left: auto;
    top: auto;
    bottom: 20px;
    right: 20px;
    transform: translate(0, 0);
  }

  .bottom_left .cover-text-inside-wrapper,
  .top_left .cover-text-inside-wrapper {
    text-align: left;
  }
  .bottom_right .cover-text-inside-wrapper,
  .top_right .cover-text-inside-wrapper {
    text-align: right;
  }
  .cover-text-outside-wrapper.top {
    top: 40px;
  }
  .cover-text-outside-wrapper.top_left {
    top: 40px;
    left: 40px;
  }
  .cover-text-outside-wrapper.top_right {
    top: 40px;
    right: 40px;
  }
  .cover-text-outside-wrapper.bottom {
    bottom: 40px;
  }
  .cover-text-outside-wrapper.bottom_left {
    bottom: 40px;
    left: 40px;
  }
  .cover-text-outside-wrapper.bottom_right {
    bottom: 40px;
    right: 40px;
  }
}
@media (min-width: 992px) {
  h1 {
    font-size: 5em;
    margin-bottom: 0.2em;
  }
  h2.cover-subtitle {
    font-size: 2.835em;
    padding-bottom: 1.5rem;
  }
  h3.cover-author {
    margin-top: 1.25rem;
    font-size: 1.8em;
  }
  .cover-meta {
    margin-top: 1em;
  }
  span {
    font-size: 1.4em;
  }
}
</style>
