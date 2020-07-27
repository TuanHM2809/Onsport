<template>
  <div class="index">
    <section class="module p-t-10">
      <div class="container  p-b-15">
        <page-title :title="`Tác giả`" />
        <hr>
        <div>
          <div class="page-filters__offset">
            <div class="columns" v-if="authors">
              <div class="column author-detail" v-for="author in authors" :key="author.id">
                <article class="list_item clearfix">
                  <div class="author_avatar">
                    <nuxt-link :to="handleLink({item_type: 'author', slug: author.slug})" class="thumb">
                      <blur-image v-if=author.avatar :aspectRatio="1" :src="author.avatar" class="promo-block__image " aria-hidden="true" />
                      <img v-else class="img-square img-responsive" src="/human-missing.png" alt="human-missing">
                    </nuxt-link>
                  </div>
                  <h2 class="title_item title_equal" style="height: 60px;">
                    <nuxt-link :to="handleLink({item_type: 'author', slug: author.slug})" class="thumb">
                      {{ author.name}}
                    </nuxt-link>
                  </h2>
                </article>
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
  export default {
    name: 'video-list',
    validate ({params}) {
      return 1
    },
    data () {
      return {
        showDropdown: false,
        showDropdownMobile: false
      }
    },
    async fetch ({store, params, error}) {
      try {
        await store.dispatch('loadAuthors')
      } catch (e) {
        console.log(e)
      }
    },
    head () {
      return {
        title: 'Các tác giả'
      }
    },
    created () {
  
    },
    mounted () {
      // console.log(this.categories)
      // this.filterActiveId = this.pundit.id
    },
    components: {
      PageTitle
    },
    computed: {
      authors () {
        return this.$store.state.author.total.data
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
  flex: none;
  display: block;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  padding: 0.75rem;
}
.author-detail .list_item {
  border-bottom: none;
  margin-top: 10px;
  padding-bottom: 7px;
}
.author-detail .title_item {
  border-bottom: 1px dotted #ddd;
}
.author-detail .list_item .title_item {
  margin-bottom: 20px;
  line-height: 60px;
}
.title_item a {
  font-size: 22px;
  font-family: "OnSport", sans-serif;
  font-weight: normal;
}
.title_item span {
  font-size: 13px;
  color: #666;
  display: block;
  font-weight: normal;
  line-height: 18px;
}
.author-detail .author_avatar {
  float: left;
  margin-right: 15px;
  width: 60px;
  height: 60px;
  overflow: hidden;
}

@media screen and (max-width: 768px) {
  .column {
    flex: none;
    width: 50%;
  }
}
@media screen and (min-width: 769px) {
  .column {
    flex: none;
    width: 33.3333%;
  }
}
@media screen and (min-width: 1024px) {
  .column {
    flex: none;
    width: 25%;
  }
}

@media (min-width: 640px) {
}
</style>
