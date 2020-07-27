require('dotenv').config()
const webpack = require('webpack')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
const isProdMode = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  /*
   ** Headers of the page
   */
  loading: {
    color: '#32cd32'  
  },
  head: {
    title: 'ONSports',
    meta: [
      { titleTemplate: '%s - onsports.vn' },
      { charset: 'utf-8' },
      { hid: 'description', name: 'description', content: 'ON Sports, cập nhật nhanh tin tức thể thao trong nước và thế giới trong ngày. Thông tin đầy đủ, hình ảnh, video chi tiết kết quả các môn thi thể thao mới nhất' },
      { name: 'author', content: 'vtvcabsport' },
      { name: 'MobileOptimized', content: '320' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' },
      { hid: 'keywords', name: 'keywords', content: 'On Sports, Thể thao, Bóng đá' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'http://vjs.zencdn.net/6.4/video-js.min.css' },
      { rel: 'stylesheet', href: '/css/custom-videojs.css' }
    ],
    script: [
      { src: isProdMode ? '/enc.onsports.js' : '/dev.onsports.js' }
    ]
  },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '~/assets/css/bootstrap.min.css',
    '~/assets/css/font.css',
    '~/assets/css/colors.css',
    '~/assets/css/responsive.css',
    '~/assets/css/space.css',
    '~/assets/css/cnn.css',
    '~/assets/css/custom-toast.css',
    '~/assets/css/onsports.css',
    'swiper/dist/css/swiper.css'
  ],
  modules: [
    '@nuxtjs/toast',
    '@nuxtjs/font-awesome',
    '@nuxtjs/axios',
    ['@nuxtjs/google-analytics', {
      id: isProdMode ? 'UA-112249419-1' : 'UA-100579684-1'
    }]
  ],
  plugins: [
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/element.js' },
    { src: '~/plugins/blur-image.js' },
    { src: '~/plugins/global.js' },
    { src: '~/plugins/swiper.js', ssr: false },
    { src: '~/plugins/infinite-scroll.js', ssr: false },
    { src: '~/plugins/moment.js' },
    { src: '~/plugins/scroll-to.js', ssr: false },
    { src: '~/plugins/chat-scroll.js', ssr: false },
    { src: '~/plugins/n-loading.js' },
    { src: '~/plugins/emoji.js', ssr: false }
  ],
  /*
   ** Config Vue Toasted
   */
  toast: {
    theme: 'primary',
    position: 'top-right',
    duration: 15000,
    containerClass: 'n-toast'
  },
  /*
   ** Config axios
   */
  axios: {
    baseURL: process.env.BASE_URL_API,
  },

  build: {
    cssSourceMap: false,
    maxChunkSize: 300000,
    vendor: [
      'moment',
      'lodash',
      'clipboard',
      'swiper',
      'video.js'
    ],
    plugins: [
      // set shortcuts as global for bootstrap
      new webpack.ProvidePlugin({
        'videojs': 'video.js',
        'window.videojs': 'video.js',
        '_': 'lodash',
        'swiper': 'swiper'
      }),
      new webpack.DefinePlugin({
        'typeof global': JSON.stringify('undefined')
      })

    ],
    node: { fs: 'empty' },
    /*
     ** Run ESLINT on save
     */
    extend(config, ctx) {
      if (ctx.isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'assets/libs'),
            path.resolve(__dirname, 'components/frontend/common/player.vue'),
            path.resolve(__dirname, 'components/frontend/posts/post-player.vue')
          ]
        })
      }

      if (!ctx.isDev) {
        // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
        // for more information about purgecss.

        config.plugins.push(
          new PurgecssPlugin({
            paths: glob.sync([
              path.join(__dirname, './pages/**/*.vue'),
              path.join(__dirname, './layouts/**/*.vue'),
              path.join(__dirname, './components/***/**/*.vue')
            ]),
            whitelist: ['html', 'body']
          })
        )
      }

      config.resolve.alias['webworkify'] = 'webworkify-webpack-dropin'
      config.resolve.alias['vue'] = 'vue/dist/vue.min'
      config.resolve.alias['videojs-contrib-hls'] = path.resolve(__dirname, 'assets/libs/videojs-contrib-hls.min')
    }
  },
  /*
   ** Add server middleware
   ** Nuxt.js uses `connect` module as server
   ** So most of express middleware works with nuxt.js server middleware
   */
  serverMiddleware: [
  ],
  env: {
    wsUrl: 'https://rm.vtvlive.vn',
    wsPassword: 'TESTTOKENFORADMIN',
    dev: !isProdMode,
    baseUrl: process.env.BASE_URL,
    cdnUrl: 'https://micros.onsports.vn/resize',
    controlUrl: 'http://static.onsports.vn/',
    baseUrlApi: process.env.BASE_URL_API,
    socketHost: process.env.SOCKET_HOST,
    ssoServer: process.env.SSO_SERVER,
    ssoClientWeb: process.env.SSO_CLIENT_WEB
  },
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  router: {
    // middleware: 'maintain', //maintain 
    middleware: 'auth',  //normal
    scrollBehavior(to, from, savedPosition) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ x: 0, y: 0 })
        }, 100)
      })
    }
  },
  render: {
    http2: {
      push: true
    },
    gzip: true
  }
}
