<template>
  <div class="wrap">
    <div class="center">
      <h1>Bạn đã đăng nhập thành công! </h1>
      <p class="text-center">Quay lại sau 2s</p>
    </div>
  </div>
</template>
<script>
  export default {
    layout: 'blank',
    data () {
      return {}
    },
    mounted () {
      this.$nextTick(async () => {
        await window.opener.$nuxt.$store.dispatch('cabLoginSuccess', this.$route.query.code)
        setTimeout(() => { window.close() }, 2000)
      })
    }
  }
</script>
<style scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.center {
  width: 50vh;
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
}
</style>

