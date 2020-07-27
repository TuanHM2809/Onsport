<template>
  <div class="component">
    <div v-if="!shouldImageRender">
      <canvas width="1" height="1" class="canvas" ref="canvas"></canvas>
      <img ref="main" :src="image" hidden>
    </div>
    <div :style="wrapperStyle">
      <transition enter-class="enter" enter-active-class="before">
        <div class="imagego" v-if="shouldImageRender" :style="imageStyle"></div>
      </transition>
      <div class="slot">
        <slot />
      </div>
      <transition enter-class="enter" enter-active-class="before">
        <div v-if="shouldPlaceholderRender" class="placeholder" :style="placeholderStyle"></div>
      </transition>
    </div>
  </div>
</template>

<script>
  import image from '~/mixins/image.js'
  export default {
    name: 'blur-background',
    props: {
      noRatio: {
        type: Boolean,
        required: false
      }
    },
    mixins: [
      image
    ],
    data () {
      return {
        applyRatio: !this.noRatio
      }
    },
    computed: {
      imageStyle () {
        return {
          background: `url(${this.image}) no-repeat center top`,
          backgroundSize: `cover`
        }
      },
      placeholderStyle () {
        return {
          ...this.blurStyle,
          background: `url(${this.placeholderImage}) center center`
        }
      }
    }
  }
</script>

<style scope lang="css">
.component {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.slot {
  position: relative;
  z-index: 1;
}
.canvas {
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}
.imagego {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: all 0.4s ease-out;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.placeholder {
  transform: scale(1.1);
  z-index: 0;
}
.before {
  opacity: 1;
}
.enter {
  opacity: 0;
}
</style>