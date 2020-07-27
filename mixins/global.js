export default {
  methods: {
    handleLink (item = null) {
      if (item && item.item_type && item.slug) {
        switch (item.item_type) {
          case 'pundit':
          case 'author':
          case 'category':
          case 'gallery':
          case 'post':
          case 'tag':
          case 'event':
            return { name: `${item.item_type}-id`, params: { id: item.slug } }
          case 'file':
          case 'video':
            return { name: `video-id`, params: { id: item.slug } }
          case 'article':
            return { name: `post-id`, params: { id: item.slug } }
          default:
            return { path: '/' }
        }
      } else if (item && item.link) {
        var testHttpLink = (link) => {
          const pattern = new RegExp('^(http|https)')
          return pattern.test(link)
        }
        if (testHttpLink(item.link)) return { redirect: `${item.link}` }
        return { path: `${item.link}` }
      } else if (item && item.id) {
        switch (item.item_type) {
          case 'match':
          case 'tournament':
          case 'livescore':
            return { name: `${item.item_type}-id`, params: { id: item.id } }
          case 'live_channels':
          case 'liveChannel':
            return { name: `livechannel-id`, params: { id: item.id } }
        }
      }
      return { path: '/' }
    },
    login () {
      this.$store.dispatch('cabLoginRequested')
      const encodeUri = encodeURIComponent(process.env.baseUrl)
      const loginWindow = window.open(`${process.env.ssoServer}?cid=${process.env.ssoClientWeb}&ur=${encodeUri}&continue=${process.env.baseUrlApi}/callback`, 'CabId', 'width=620,height=450')
      const popupTick = setInterval(() => {
        if (loginWindow.closed) {
          clearInterval(popupTick)
          this.$store.dispatch('cabLoginFailure')
        }
      }, 1000)
    }
  }
}
