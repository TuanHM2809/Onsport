<template>
  <div class="module dark">
    <div class="container">
        <div v-html="phet"></div>
    </div>
  </div>
</template>

<script>
if (process.browser) {
  var Swiper = require('swiper')
}
export default {
  data () {
    return {
      phet: `
       <div class="phet">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
             <img class="img-responsive img-full" alt="upsieutoc" src="http://sv1.upsieutoc.com/2017/11/12/8k.jpg"/>
             <div class="swiper-text-content">
              <h3 class="swiper-text-headline">
                <a href="#">
                  <span class="swiper-text-headline-text">30 amazing sports photos</span>
                </a>
              </h3>
              <div class="swiper-text-description">Take a look at 30 amazing sports photos from September 19 through September 25.</div>
             </div>
          </div>
          <div class="swiper-slide">
             <img class="img-responsive img-full" alt="upsieutoc" src="http://sv1.upsieutoc.com/2017/11/12/8k.jpg" />
             <div class="swiper-text-content">
              <h3 class="swiper-text-headline">
                <a href="#">
                  <span class="swiper-text-headline-text">30 amazing sports photos</span>
                </a>
              </h3>
              <div class="swiper-text-description">Take a look at 30 amazing sports photos from September 19 through September 25.</div>
             </div>
          </div>
          <div class="swiper-slide">
             <img class="img-responsive img-full" alt="upsieutoc" src="http://sv1.upsieutoc.com/2017/11/12/8k.jpg"/>
             <div class="swiper-text-content">
              <h3 class="swiper-text-headline">
                <a href="#">
                  <span class="swiper-text-headline-text">30 amazing sports photos</span>
                </a>
              </h3>
              <div class="swiper-text-description">Take a look at 30 amazing sports photos from September 19 through September 25.</div>
             </div>
          </div>
          <div class="swiper-slide">
             <img class="img-responsive img-full" alt="upsieutoc" src="http://sv1.upsieutoc.com/2017/11/12/8k.jpg"/>
             <div class="swiper-text-content">
              <h3 class="swiper-text-headline">
                <a href="#">
                  <span class="swiper-text-headline-text">30 amazing sports photos</span>
                </a>
              </h3>
              <div class="swiper-text-description">Take a look at 30 amazing sports photos from September 19 through September 25.</div>
             </div>
          </div>
          <div class="swiper-slide">
             <img class="img-responsive img-full" alt="upsieutoc" src="http://sv1.upsieutoc.com/2017/11/12/8k.jpg"/>
             <div class="swiper-text-content">
              <h3 class="swiper-text-headline">
                <a href="#">
                  <span class="swiper-text-headline-text">30 amazing sports photos</span>
                </a>
              </h3>
              <div class="swiper-text-description">Take a look at 30 amazing sports photos from September 19 through September 25.</div>
             </div>
          </div>
        </div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
      `
    }
  },
  mounted () {
    this.$nextTick(() => {
      Swiper('.phet', {
        initialSlide: 1,
        autoPlay: 5000,
        slidesPerView: 'auto',
        centeredSlides: true,
        navigationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        spaceBetween: 20,
        // loop: true,
        lazy: true
      })
    })
  }
}
</script>

<style>
.phet.swiper-container-horizontal{
  overflow: hidden;
}
.phet .swiper-slide {
    width: 66.7%;
    position: relative;
}
.phet .swiper-slide-prev::before,.phet  .swiper-slide-next::before{
  background: hsla(0,0%,5%,.3);
  content: " ";
  position: absolute;
  width: 100%;
  height:100%;
  z-index: 10
}
.phet .swiper-text-content{
    bottom: 0;
    left: 0;
    padding: 7px 0;
    padding-left: 10px;
    padding-right: 10px;
    position: absolute;
    width: 100%;
    background: hsla(0,0%,98%,.85);
}
.phet h3.swiper-text-headline {
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    font-size: 30px;
    line-height: 1.1333333333;
}
.swiper-text-description{
    margin: 5px 0 0;
    padding-bottom: 7px;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    font-size: 16px;
    line-height: 1.375;
}
.phet .dark.swiper-wrapper {
  background: rgba(38,38,38,.85);
  overflow: visible;
}
.phet .dark .swiper-text-content{
  background: rgba(38,38,38,.85);
}
.phet .dark h3.swiper-text-headline , .dark .swiper-text-description{
  color: #fefefe
}

/* css cho navigator */

.phet .swiper-button-prev{
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23fff'/%3E%3C/svg%3E") !important;
}
.phet .swiper-button-next{
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23fff'/%3E%3C/svg%3E") !important;
}
</style>

