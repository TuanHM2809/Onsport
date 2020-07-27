<template>
  <div class="pageHero">
    <div class="container">
      <h1 class="pageTitle m-b-0">
        <strong>{{ mainTitle || 'Tiêu đề'}}</strong>
        <span class="p-l-10">{{ subTitle || ''}}</span>
      </h1>
      <div class="pull-right">
        <div class="socialShareHover" :class="{open: show}">
          <div class="socialShareBtn" @click.prevent="show = !show">
            <div class="fa fa-share-alt m-r-10"></div>Chia sẻ</div>
          <ul class="socialOptions" role="listbox">
            <li>
              <div class="option twitter" role="option" tabindex="0" data-social-service="twitter">
                <span class="fa fa-twitter"></span>
                <span class="visuallyHidden">Share on Twitter</span>
              </div>
            </li>
            <li>
              <div class="option facebook" role="option" tabindex="0" data-social-service="facebook">
                <span class="fa fa-facebook"></span>
                <span class="visuallyHidden">Share on Facebook</span>
              </div>
            </li>
            <li>
              <div class="option google" role="option" tabindex="0" data-social-service="google">
                <span class="fa fa-google"></span>
                <span class="visuallyHidden">Google +</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    data () {
      return {
        show: false
      }
    },
    props: ['mainTitle', 'subTitle']
  }
</script>
<style scoped>
.pageHero {
  background: #000;
  margin-top: 0;
  background-repeat: no-repeat;
  background-position: 100% 0;
  padding: 3rem 0;
  position: relative;
}
.pageHero:before {
  content: "";
  display: block;
}
.pageTitle {
  font-family: "OnSport", sans-serif;
  font-size: 4rem;
}
.pageHero .pageTitle {
  color: #fff;
  float: left;
  max-width: 70%;
}
.pageTitle strong {
  font-weight: 700;
}
.pageTitle span {
  font-size: 3rem;
  font-weight: 300;
}

/* share */
.socialShareHover {
  position: relative;
  display: inline-block;
}
.pageHero .socialShareHover {
  position: absolute;
  top: 50%;
  right: 0rem;
  margin-top: -2rem;
}
.socialShareHover .socialShareBtn {
  padding: 1rem 1.2rem;
  background: #fff;
  border: 1px solid #e8e8e8;
  font-size: 1.2rem;
  height: 4rem;
  color: #76766f;
  position: relative;
  padding-top: 0.4rem;
  line-height: 3.6rem;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}
.pageHero .socialShareHover .socialShareBtn {
  padding-top: 0;
  line-height: 4rem;
  border-radius: 3px;
}
.socialShareHover.open .socialOptions {
  max-height: 200px;
  visibility: visible;
}
.socialShareHover .socialOptions {
  position: absolute;
  top: 4rem;
  right: 0;
  left: 0;
  max-height: 0;
  overflow: hidden;
  transition: 0.2s;
  z-index: 20;
  visibility: hidden;
}
.socialShareHover .socialOptions .option {
  width: 100%;
  height: 4rem;
  position: relative;
  transition: 0.2s;
  cursor: pointer;
  display: block;
}
.pageHero .socialShareHover .socialOptions li:last-child .option {
  border-radius: 0 0 3px 3px;
}
.socialShareHover .socialOptions .twitter {
  background: #00aced;
}
.socialShareHover .socialOptions .facebook {
  background: #3b5998;
}
.socialShareHover .socialOptions .google {
  background: #dd4b39;
}
.visuallyHidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}
.socialShareHover .socialOptions .fa {
  transition: 0.2s;
  color: white;
  transform: translateY(-0.5rem);
  opacity: 0;
}
.socialShareHover .socialOptions .facebook .fa {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  margin-top: -7.5px;
  margin-left: -4.5px;
}
.socialShareHover .socialOptions .twitter .fa {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  margin-top: -6.5px;
  margin-left: -7.5px;
}
.socialShareHover .socialOptions .google .fa {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  margin-top: -7.5px;
  margin-left: -7.5px;
}
.socialShareHover.open .socialOptions .fa {
  transform: translateY(0);
  opacity: 1;
}
.socialShareHover.open .socialOptions li:nth-child(2) .fa {
  transition-delay: 0.05s;
}
.socialShareHover.open .socialOptions li:nth-child(3) .fa {
  transition-delay: 0.1s;
}

@media (max-width: 992px) {
  .pageHero {
    padding-left: 1em;
    padding-right: 1em;
  }
}
</style>

