<template>
  <div class="wrapper">
    <section class="error-wrap">
      <div class="pg-error pg-wrapper">
        <div class="error-container">
          <h1 v-if="error.statusCode">{{ error.statusCode}}</h1>
          <h2 class="error_headline2"> {{ error.message }}</h2>
        </div>
        <p style="text-align: center;">Quay về&nbsp;
          <nuxt-link to="/">Trang chủ</nuxt-link>
        </p>
      </div>
    </section>
    <my-footer/>
  </div>
</template>

<script>
import MyHeader from '~/components/frontend/common/header.vue'
export default {
  props: ['error'],
  components: {
    MyHeader
  }
}
</script>

<style scoped>
.wrapper {
  padding-top: 50px;
}
.error-wrap {
  height: calc(100vh - 102px);
  width: 100vw;
  padding-top: 100px;
}
#copyrights {
  position: relative;
}
@media (min-width: 992px) {
  .error-wrap {
    height: calc(100vh - 90px);
    width: 100vw;
    padding-top: 100px;
  }
}
.pg-error {
  min-height: 75vh;
  background-color: #fefefe;
  color: #262626;
}
.error-container,
.search-container {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.pg-wrapper p {
  font-size: 16px;
  font-weight: 400;
  font-family: "OnSport", sans-serif;
  line-height: 24px;
  margin-bottom: 24px;
}
.pg-wrapper a {
  color: #006eca;
}
.pg-wrapper a:focus,
.pg-wrapper a:hover {
  text-decoration: underline;
}
h1,
.h1 {
  font-family: "OnSport", sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 60px;
  padding: 0;
  font-size: 92px;
  margin-bottom: 24px;
}
</style>
