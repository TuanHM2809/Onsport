const filter = {
  data () {
    return {
      showFilter: false
    }
  },
  computed: {
    textTarget () {
      const target = this.filters.find(e => {
        return e.key === this.filterActiveKey
      })
      return target.title
    },
    pageFitlerBodyStyle () {
      return {
        'visibility': this.showFilter ? 'visible' : 'none'
      }
    },
    pageOffsetStyle () {
      const offset = this.showFilter ? 145 : 0
      return {
        'transform': `translateY(${offset}px)`,
        'padding-bottom': `${offset}px`
      }
    }
  }
}

export default filter
