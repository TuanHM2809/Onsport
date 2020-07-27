<template>
  <svg :style='svgStyle'>
    <text x='50%' y='50%' text-anchor='middle' dominant-baseline='central' :style='textStyle'>
      {{ avatarLetter }}
    </text>
  </svg>
</template>
<script>
export default {
  props: {
    size: {
      type: String,
      default: '50'
    },
    rounded: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    avatarLetter () {
      let nameSplit = this.name.split(' ')
      if (nameSplit.length > 1) {
        return nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase()
      } else {
        return nameSplit[0].charAt(0).toUpperCase()
      }
    },
    svgStyle () {
      // use hsl to define the background color.
      const letterIndex = this.avatarLetter.charCodeAt() - 64
      const hue = (360 / 26) * letterIndex
      const backgroundColor = `hsl(${hue}, 68%, 48%)`
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        borderRadius: this.rounded ? '100%' : '0',
        background: backgroundColor
      }
    },
    textStyle () {
      return {
        fill: 'rgba(255, 255, 255, .7)',
        fontFamily: "'OnSport', Monaco, monospace",
        fontSize: `${this.size * 0.45}px`
      }
    }
  }
}
</script>