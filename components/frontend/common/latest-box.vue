<template>
  <div class="media-cate clearfix">
    <div class="container">
      <div class="list-news clearfix">
        <div class="row">

          <div class="col-md-4 news-highlight"  v-for="(item, index) in data" :key="index">
            <nuxt-link :to="handleLink(item)">
              <div class="media-video news-video">
                <blur-image v-if="item && item.thumbnail" :src="item.thumbnail" :alt="item.name"></blur-image>
              </div>
              <h3>{{ item.name}}</h3>
            </nuxt-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data () {
    return {
      loading: false,
      data: []
    }
  },
  mounted () {
    this.fetchList()
  },
  computed: {
    isMobile () {
      return this.$store.state.size.isMobile
    }
  },
  methods: {
    async fetchList () {
      try {
        this.loading = true
        const data = await this.$axios.$get(`top-view`)
        this.loading = false
        if (data.code === 0) {
          this.data = _.compact(data.data)
        } else {
          this.data = []
        }
      } catch (e) {
        this.loading = false
        this.$toast.error(e, {
          duration: 2000
        })
      }
    }
  }
}
</script>
<style scoped>
.large-post h4 a {
  display: block;
  padding: 7px 0;
  font-size: 18px;
  font-weight: 400;
  font-family: "OnSport", sans-serif;
  color: #262626;
  line-height: 1.3333;
  border-top: 1px solid #d9d9d9;
}

.large-post h4 a:hover {
  color: #4545a2;
}
.media {
  position: relative;
}
.media__icon {
  background: hsla(0, 0%, 5%, 0.3);
  color: #fefefe;
  padding: 5px;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  font-size: 18px;
  line-height: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: pointer;
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
}
.media__icon.center-icon:hover {
  opacity: 0.85;
}
.media__icon.center-icon i {
  color: #fff;
  font-size: 2rem;
  margin: 0 0 0 5px;
  line-height: 40px;
}
@media screen and (min-width: 768px) {
  .topview--item:not(:last-child):not(:first-child) {
    padding-left: 7.5px;
    padding-right: 7.5px;
  }
  .topview--item:last-child {
    padding-right: 0;
  }
  .topview--item:first-child {
    padding-left: 0;
  }
}
</style>


