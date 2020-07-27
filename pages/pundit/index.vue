<template>
  <div class="index">
    <section class="module">
      <div class="container p-b-15">
        <page-title :title="`Danh sách chuyên gia`" />
        <div class="on-pundit-columns" v-if="pundits">
          <div class="on-pundit-column" v-for="pundit in pundits" :key="pundit.id">
            <div class="on-pundit sdc-site-tiles__item on-pundit--has-link ">
              <div class="on-pundit__inner">
                <div class="on-pundit__figure" v-if="pundit && pundit.avatar">
                  <nuxt-link :to="handleLink({item_type: 'pundit', slug:pundit.slug})" class="on-pundit__figure-image-wrap">
                    <blur-image rounded :aspectRatio="1" class="on-pundit__figure-image" :src="pundit.avatar" />
                  </nuxt-link>
                </div>
                <div class="on-pundit__body">
                  <h4 class="on-pundit__headline">
                    <nuxt-link :to="handleLink({item_type: 'pundit', slug:pundit.slug})" class="on-pundit__headline-link">
                      <span class="on-pundit__headline-text">
                        <span>{{ pundit.name}}</span>
                      </span>
                    </nuxt-link>
                  </h4>
                  <div class="on-pundit__bio" v-html="pundit.bio" v-if="pundit.bio">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import PageTitle from '~/components/frontend/common/page-title.vue'
  // import _ from 'lodash'
  export default {
    name: 'pundit-list',
    validate ({params}) {
      return 1
    },
    data () {
      return {
      }
    },
    async fetch ({store, params, error}) {
      try {
        await Promise.all([
          store.dispatch('loadPundits')
        ])
        // console.log(store.state.pundit.detail.data)
        if (Object.keys(store.state.pundit.total.data).length === 0) {
          error({statusCode: 404, message: 'Trang không tồn tại'})
        }
      } catch (e) {
        error({statusCode: 404, message: e})
      }
    },
    head () {
      // const title = 'Demo Category'
      // const title = slug.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
      return {
        title: 'Chuyên gia'
      }
    },
    created () {
  
    },
    mounted () {
      // this.filterActiveId = this.pundit.id
    },
    components: {
      PageTitle
    },
    computed: {
      pundits () {
        return this.$store.state.pundit.total.data
      }
    },
    methods: {
  
    }
  }
</script>

<style scoped>
.index {
  padding-top: 0px;
  min-height: calc(100vh - 100px);
}
.row {
  margin-left: -15px;
  margin-right: -15px;
}
</style>



<style scoped>
.pundit-wrapper {
  display: block;
}
.on-pundit-columns {
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.75rem;
  margin-right: -0.75rem;
  margin-top: -0.75rem;
}
.on-pundit-columns:not(:last-child) {
  margin-bottom: calc(1.5rem - 0.75rem);
}
.on-pundit-column {
  flex: none;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}

@media screen and (max-width: 480px) {
  .on-pundit-column {
    flex: none;
    width: 100%;
  }
}
@media (min-width: 481px) and (max-width: 768px) {
  .on-pundit-column {
    flex: none;
    width: 50%;
  }
}
@media screen and (min-width: 769px) {
  .on-pundit-column {
    flex: none;
    width: 33.3333%;
  }
}
@media screen and (min-width: 1024px) {
  .on-pundit-column {
    flex: none;
    width: 25%;
  }
}

.on-pundit {
  text-align: center;
  position: relative;
  font-size: 1.35em;
  border: 5px solid hsla(0, 0%, 100%, 0.1);
  background-color: #fff;
  background-clip: padding-box;
  cursor: pointer;
  width: 100%;
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
  width: 60%;
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

.on-pundit__headline {
  font-size: 24px;
  line-height: 1.3333;
  font-weight: 300;
  padding: 0 12px;
  color: #000;
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
.on-pundit__bio {
  margin-top: 20px;
  padding: 0 24px;
  text-align: justify;
  font-size: 14px;
  line-height: 1.133;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5; /* number of lines to show */
  max-height: 91px;
}
.on-pundit__bio p {
  margin-bottom: 0;
}

@media (min-width: 640px) {
  .sdc-site-tiles__item {
    display: inline-block;
    margin: 0;
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


