export default {
  methods: {
    scrollToPos (el, x, y, options) {
      if (el && !(el instanceof Node)) {
        throw new Error(`Scroll error: element passed to Scroll constructor must be a DOM node, you passed ${el}!`)
      }
      const elem = el || this.$el
      const fromY = elem.scrollTop
      // defaults
      options = options || {}
      options.duration = options.duration || 400

      let animMap = {
        linear: function (t) { return t },
        easeInQuad: function (t) { return t * t },
        easeOutQuad: function (t) { return t * (2 - t) },
        easeInOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
        easeInCubic: function (t) { return t * t * t },
        easeOutCubic: function (t) { return (--t) * t * t + 1 },
        easeInOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
        easeInQuart: function (t) { return t * t * t * t },
        easeOutQuart: function (t) { return 1 - (--t) * t * t * t },
        easeInOutQuart: function (t) { return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
        easeInQuint: function (t) { return t * t * t * t * t },
        easeOutQuint: function (t) { return 1 + (--t) * t * t * t * t },
        easeInOutQuint: function (t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
      }
      /**
       * Sets element's property to a value.
       * @param {string} prop - The property to set
       * @param {Number} value - The number value
       */
      let moveElement = (prop, value) => {
        elem[prop] = value
        // scroll the html element also for cross-browser compatibility
        // (ie. silly browsers like IE who need the html element to scroll too)
        if (elem === this.$el) {
          document.documentElement[prop] = value
        }
      }

      let getEasing = (easing) => {
        let defaultEasing = 'linear'
        let easeFunc = animMap[easing || defaultEasing]
        if (!easeFunc) {
          console.debug('Scroll error: scroller does not support an easing option of ' + easing + '. Using "' + defaultEasing + '" instead')
          easeFunc = animMap[easing]
        }
        return easeFunc
      }

      /**
       * Does a bit of calculating and scrolls an element.
       * @param {HTMLElement} el - The element to be scrolled
       * @param {Number} from - The number of where to scroll from
       * @param {Number} to - The number of where to scroll to
       * @param {string} prop - The property to animate
       * @param {Number} startTime - The timestamp of when the animation should start
       * @param {Number} duration - The amount of time for the animation
       * @param {Function} easeFunc - The easing function to use
       * @param [callback]
       */
      let scroll = (el, from, to, prop, startTime, duration, easeFunc, callback) => {
        window.requestAnimationFrame(() => {
          let currentTime = Date.now()
          let time = Math.min(1, ((currentTime - startTime) / duration))

          if (from === to) {
            return callback ? callback() : null
          }

          moveElement(prop, (easeFunc(time) * (to - from)) + from)

          /* prevent scrolling, if already there, or at end */
          if (time < 1) {
            scroll(el, el[prop], to, prop, startTime, duration, easeFunc, callback)
          } else if (callback) {
            callback()
          }
        })
      }

      return new Promise((resolve) => {
        scroll(elem, fromY, y, 'scrollTop', Date.now(), options.duration, getEasing(options.easing), resolve)
      })
    }
  }
}
