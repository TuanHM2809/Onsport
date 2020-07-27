<template>
  <nuxt-link class="promo-block__item" :to="handleLink({item_type: 'author', slug: author.slug})">
    <div class="promo-block__figure">
      <div class="auto-size-1/1">
        <blur-image v-if=author.avatar :aspectRatio="1" :src="author.avatar" class="promo-block__image " aria-hidden="true" :alt="author.name" />
        <img v-else class="promo-block__image img-responsive" src="/human-missing.png" alt="human missing">
      </div>
    </div>
    <div class="promo-block__body ">
      <h4 class="promo-block__headline ">{{author.name}}</h4>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: ['author']
}
</script>

<style scoped>
.promo-block__item {
  display: table;
  table-layout: fixed;
  width: 100%;
  margin-bottom: 14px;
  background: #fff;
}
.promo-block__figure,
.promo-block__body {
  display: table-cell;
  vertical-align: middle;
}

.promo-block__figure {
  width: 25%;
}
.promo-block__body {
  padding: 0 18px;
}
.promo-block__headline {
  font-family: "OnSport", sans-serif;
  font-weight: normal;
  font-size: 18px;
  color: #000;
  line-height: 1.1;
  margin-bottom: 4px;
}
@media (max-width: 640px) {
  .promo-block__item {
    margin-bottom: 9px;
  }
  .promo-block__figure {
    width: 88px;
  }
  .promo-block__body {
    padding: 0 9px;
  }
}
@media (max-width: 992px) and (min-width: 640px) {
  .promo-block__item:nth-child(-n + 2) {
    margin-bottom: 14px;
  }
}
</style>
