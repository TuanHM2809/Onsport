<template>
  <div id="login" v-loading.fullscreen="isLogging">
    <div class="login-wrap ">
      <div class=" title m-b-10 text-center">
        <h2 class="">Đăng nhập với VTVCabId</h2>
      </div>
      <div class="description m-b-20 text-center">
        <p>Sử dụng tài khoản VTVCabId nhé</p>
      </div>
      <a href="#" @click.prevent="login()" tag="button" class="btn btn-block btn-danger btn-large">
        Đăng nhập với tài khoản CabId
      </a>
    </div>
  </div>
</template>

<script>
import {slugify} from '~/utils'
// import socket from '~/plugins/socket.io.js'
export default {
  layout: 'default',
  name: 'login',
  middleware: ['anonymous'],
  async asyncData ({app}) {
  },
  head () {
    return {
      title: 'Đăng nhập'
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    isLogging () {
      return this.$store.state.isLogging
    },
    isLoggedIn () {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    isLoggedIn (newState, oldState) {
      if (newState) {
        this.$router.push('/')
      }
    }
  },
  mounted () {
  },
  methods: {
    slug (name) {
      return slugify(name)
    }
  },
  components: {
  }
}
</script>
<style lang="css" scoped>
#login {
  display: flex;
  flex: 1;
  width: 100vw;
  height: calc(100vh - 90px);
  justify-content: center;
  align-items: center;
}

.login-wrap {
  padding: 20px;
}

.title,
.description {
  font-family: "OnSport", sans-serif;
}
</style>