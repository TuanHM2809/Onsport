import socket from '~/plugins/socket.io.js'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      socket: null,
      socketAuth: false
    }
  },
  methods: {
    initClient () {
      if (socket.disconnected === true) {
        socket.connect()
      }
      socket.emit('authentication', {
        password: process.env.wsPassword
      })

      socket.on('authenticated', data => {
        this.socketAuth = data
      })

      socket.on('response', data => {
        if (data.action === 'watermark') {
          const payload = data.payload
          this.$store.dispatch('setInfoSocket', payload)
        }

        // if (data.action === 'refresh_key') {
        //   let old = window.sessionStorage.getItem('refresh')
        //   if (old) {
        //     window.sessionStorage.removeItem('refresh')
        //   }
        // }
      })

      socket.on('refresh_key', data => {
        let old = window.sessionStorage.getItem('uuid')
        if (old) {
          console.log('refresh key')
          window.sessionStorage.removeItem('uuid')
        }
        // sessionStorage.removeItem('uuid')
        console.log(data)
      })

      socket.on('connect', data => {
        console.log('connected')
      })

      socket.on('disconnect', data => {
        console.log('disconnected')
      })
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'isAuthenticated'
    })
  },
  created () {
  },
  mounted () {
    if (this.isAuthenticated) {
      this.initClient()
    } else {
      if (socket.connected) {
        socket.disconnect()
      }
    }
  },
  watch: {
    isAuthenticated (newValue, oldValue) {
      if (newValue) {
        this.initClient()
      } else {
        if (socket.connected) {
          socket.disconnect()
        }
      }
    }
  },
  beforeDestroy () {
    socket.disconnect()
  }
}
