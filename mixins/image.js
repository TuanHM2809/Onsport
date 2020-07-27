export default {
  props: {
    src: {
      type: null,
      required: true
    },
    placeholder: {
      type: String
    },
    blur: {
      type: Number
    },
    aspectRatio: {
      type: Number
    },
    noRatio: {
      type: Boolean
    },
    fallback: {
      type: String
    },
    alt: {
      type: String
    }
  },

  data () {
    return {
      isRendered: false,
      options: {},
      defaultBlur: 20,
      image: null,
      placeholderImage: null,
      aspectRatioDetect: 0.5625,
      isPollingKilled: false,
      cached: false,
      imageError: false
    }
  },

  watch: {
    src () {
      this.handleImageLoading()
    }
  },

  computed: {
    shouldPlaceholderRender () {
      return !!this.placeholderImage
    },

    shouldImageRender () {
      return this.isRendered
    },

    calculatedRatio () {
      return this.aspectRatio || this.aspectRatioDetect
    },

    wrapperStyle () {
      if (this.noRatio) {
        return {}
      }

      return {
        paddingBottom: `${this.calculatedRatio * 100}%`
      }
    },

    blurStyle () {
      let blur = this.defaultBlur

      if (this.is(this.blur)) {
        return this.getBlurStyle(this.blur)
      }

      if (this.is(this.options.blur)) {
        return this.getBlurStyle(this.options.blur)
      }

      return this.getBlurStyle(blur)
    }
  },

  mounted () {
    this.handleImageLoading()
  },

  methods: {
    is (value) {
      return typeof value !== 'undefined' && value !== null
    },
    getBlurStyle (amount) {
      if (amount === 0) {
        return
      }

      return {
        filter: `blur(${amount}px)`
      }
    },

    defineAspectRatio (img) {
      const delay = this.options.timeout || 2500
      const pollInterval = this.options.pollInterval || 80

      const poll = setInterval(() => {
        if (!img.naturalWidth) {
          return
        }

        clearInterval(poll)

        const { naturalHeight, naturalWidth } = img

        this.aspectRatioDetect = naturalHeight / naturalWidth
      }, pollInterval)

      setTimeout(() => {
        if (img.naturalWidth) {
          return
        }

        clearInterval(poll)
        this.isPollingKilled = true
      }, delay)
    },
    testHttpLink (link) {
      const pattern = new RegExp('^(http|https)')
      return pattern.test(link)
    },
    // buildLargeBg (image) {
    //   // let width = this.$el.getBoundingClientRect().width
    //   var encodeImg = encodeURI(image)
    //   let width = 1920
    //   if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
    //   if (typeof image === 'undefined') return `/loading.png`
    //   return this.testHttpLink(image) ? `${process.env.cdnUrl}/?url=${encodeImg}&width=${width}&height=9999&watermark=0` : `${process.env.cdnUrl}/?url=http%3A%2F%static.onsports.vn%2F${encodeImg}&width=${width}&height=9999&watermark=0`
    // },

    buildLargeBg (image) {
      // let width = this.$el.getBoundingClientRect().width
      // let width = 1000
      // if (this.hd) width = 1920
      // if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
      // if (typeof image === 'undefined') return `/loading.png`
      // return this.testHttpLink(image) ? `${process.env.cdnUrl}/?url=${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}` : `${process.env.cdnUrl}/?url=https%3A%2F%2Fcontrol.onsports.vn%2F${image}&width=${width}&height=9999&watermark=${this.hd ? 1 : 0}`
      // return this.testHttpLink(image) ? image : process.env.controlUrl + image
      if (!this.testHttpLink(image)) {
        image = process.env.controlUrl + image
      }
      // cho nay tao (Nghia) co tinh viet nhu nay day
      const resolution = 1920
      if (typeof image === 'undefined' && (this.aspectRatio === 1 || this.aspectRatio === '1')) return `/loading_square.png`
      if (typeof image === 'undefined') return `/loading.png`
      return `${process.env.cdnUrl}/?width=${resolution}&url=${encodeURI(image)}`
    },

    loadImage () {
      const image = new Image()
      const delay = this.options.delay || 0
      const fallbackSrc = this.fallback || this.options.fallback
      const imageSource = this.imageError ? fallbackSrc : this.buildLargeBg(this.src)

      // reset the image holder
      this.image = null
      this.isRendered = false

      if (!this.aspectRatio) {
        this.defineAspectRatio(image)
      }

      image.onload = () => {
        if (this.image) {
          return
        }

        if (this.isPollingKilled && !this.aspectRatio) {
          this.defineAspectRatio(image)
        }

        // assign the image
        this.image = imageSource

        // let ctx
        // try {
        //   // the drawImage it's a synchronous method, so when it's done
        //   // the nextTick will notify the view that we're ready
        //   // to fadeIn the main image
        //   ctx = this.$refs.canvas.getContext('2d')
        //   ctx.drawImage(this.$refs.main, 0, 0)
        // } catch (e) {
        //   console.log('Canvas erroR:', e)
        // }

        // next tick to know when the image is rendered
        this.$nextTick(() => {
          // timeout for a custom delay
          setTimeout(() => {
            this.isRendered = true
            // remove placeholder image
            this.placeholderImage = null
          }, delay)
        })

        this.imageError = false

        this.$emit('onLoad', image.src)
      }

      image.onerror = error => {
        this.$emit('onError', error)

        if (process.env.NODE_ENV !== 'production' && !this.fallback) {
          console.warn('[blur-background] An error occured during the image loading')
          console.log(error)
        }

        if (this.fallback || this.options.fallback) {
          this.imageError = true
          this.handleImageLoading()
        }
      }

      image.src = imageSource
    },

    loadPlaceholder () {
      if (!this.placeholder && !this.options.placeholder) {
        return
      }

      const image = new Image()
      const src = this.placeholder || this.options.placeholder

      image.src = src

      image.onload = () => {
        this.placeholderImage = src

        // Dispatches an event on placeholder image load
        this.$emit('onLoadPlaceholder', src)
      }

      image.onerror = error => {
        this.$emit('onPlaceholderError', error)

        if (process.env.NODE_ENV !== 'production') {
          console.warn('[vue-progressive-image] An error occured during the placeholder image loading')
        }
      }
    },

    handleImageLoading () {
      this.loadPlaceholder()
      this.loadImage()
    }
  }
}
