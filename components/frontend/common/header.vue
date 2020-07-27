<template>
  <header id="on-hdr" class="header">
  <div id="nav__plain-header" class="nav--plain-header" :class="{'nav-open': navOpen}">
    <div class="eventNotify" v-if="eventShowing">
      <nuxt-link to="/event">{{eventText}}</nuxt-link>
      <div class="close-btn" @click="hiddenEventShowing">
        <i class="fa fa-times"></i>
      </div>
    </div>

    <match-result @hiddenMatchShowing="hiddenMatchShowing" />

      <div class="site-header-top">
        <div class="container">
          <div class="site-brand col-md-1"><nuxt-link to="/" id="logo" class="nav__logo">ON Sports</nuxt-link></div>
          
          <div class="site-navigation col-md-9">
            <ul class="nav" v-if="menu">
              <li v-for="(item, index) in menu " :key="item.id">
                <nuxt-link :to="handleLink(item)">{{item.name}}</nuxt-link>
                <div class="sub-nav"  v-if="item.children.length">
                    <ul >
                      <li v-for="(child, childIndex) in item.children" :key="child.item_id">
                        <nuxt-link :to="handleLink(child)">
                          {{ child.name}}
                        </nuxt-link>
                      </li>
                    </ul>
                </div>
              </li>
            </ul>
            <!--
            <ul class="social-channel">
              <li class="facebook"><a target="_blank" href="https://www.facebook.com/Onsportchannel/"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
              <li class="youtube"><a target="_blank" href="https://www.youtube.com/channel/UCIWo7q6irZUBaoPOrlf5IVw"><i class="fa fa-youtube-play" aria-hidden="true"></i></a></li>
              <li class="twitter"><a target="_blank" href="https://twitter.com/OnSportsChannel"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
              <li class="twitter"><a target="_blank" href="https://www.instagram.com/OnSportschannel/"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
            </ul>
            <breaking-news /> -->
          </div>
          <div class="site-header col-md-2">
            <ul class="site-user">
              <li class="login">
                <a v-if="!$store.getters.user " @click.prevent="login()" href="#">Đăng nhập</a>
                <a v-if="$store.getters.user " href="# " :class="{open: openUserAction} " @click.prevent="openUserAction=! openUserAction ">
                    {{ $store.getters.user.name }}
                    <i v-if="!openUserAction " class="fa fa-chevron-down " aria-hidden="true "></i>
                    <i v-else class="fa fa-chevron-up " aria-hidden="true "></i>
                </a>
                <div v-else class="nav-section__submenu-item ">
                  <div class="user-dropdown " v-if="openUserAction">
                    <div class="action-list ">
                      <div class="action-item " @click.prevent="$store.dispatch('cabLogoutRequested')">Đăng xuất</div>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <form id="search-form " class="search__form " :class="{ 'search-expanded' : openSearch} " method="get" name="headerSearch" @submit.prevent="toSearch">
                  <div class="search__form-fields ">
                    <input id="search-input-field" class="search__input-field " type="search" placeholder="Tìm kiếm Onsports... " name="search" v-model.trim="keyword" @keyup.enter="toSearch">
                    <button id="submit-button" @click.prevent="toSearch" class="search__submit-button ">Search »</button>
                  </div>
                  <div id="search-button " v-if="!navOpen" class="search__button " @click.prevent="openSearch=! openSearch " type="button " role="button ">
                    <i class="fa fa-search "></i>
                  </div>
                </form>
                <div class="nav-menu-hamburger " @click.prevent="navOpen=! navOpen ">
                  <div class="nav-menu__hamburger ">
                  
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="menu_responsive" v-if="navOpen">
        <div class="container">
          <ul class="nav" v-if="menu">
            <li v-for="(item, index) in menu " :key="item.id">
              <nuxt-link :to="handleLink(item)">{{item.name}}</nuxt-link>
            </li>
          </ul> 
        </div>
      </div>

  </div>
  </header>
</template>
<script>
import MatchResult from './match-result.vue'
import BreakingNews from '~/components/frontend/home/breaking-news.vue'
export default {
  data () {
    return {
      openUserAction: false, // user action
      openSearch: false, // open/ close search form
      navOpen: false, // nav on mobile mode
      keyword: '',
      matchShowing: true,
      eventShowing: false,
      eventText: 'Sự kiện'
    }
  },
  computed: {
    menu () {
      return this.$store.state.menu.data
    },
    matchResults () {
      return this.$store.state.matchResult.data
    },
    settings () {
      return this.$store.state.settings.data
    },
    isLogging () {
      return this.$store.state.isLogging
    },
    isLoggedIn () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    toSearch () {
      const keyword = this.keyword
      const paramsKeyword = this.$route.params.keyword
      const isSearchPage = Object.is(this.$route.name, 'search-keyword')
      if (keyword && (isSearchPage ? !Object.is(paramsKeyword, keyword) : true)) {
        this.$router.push({name: 'search-keyword', params: { keyword }})
      }
    },
    checkMatchShowing () {
      const bodyClass = document.body.classList
      if (this.matchShowing === true) {
        if (bodyClass.contains('match-result--hidden')) {
          bodyClass.remove('match-result--hidden')
        }
        bodyClass.add('match-result--showing')
      } else {
        if (bodyClass.contains('match-result--showing')) {
          bodyClass.remove('match-result--showing')
        }
        bodyClass.add('match-result--hidden')
      }
    },

    checkEventShowing () {
      const bodyClass = document.body.classList
      if (this.eventShowing) {
        if (bodyClass.contains('event--hidden')) {
          bodyClass.remove('event--hidden')
        }
        bodyClass.add('event--showing')
      } else {
        if (bodyClass.contains('event--showing')) {
          bodyClass.remove('event--showing')
        }
        bodyClass.add('event--hidden')
      }
    },

    listenScrollEvent (e) {
      const y = window.scrollY
      let breakpoint = 0

      if (this.matchShowing && this.eventShowing) {
        breakpoint = 90
      }
      if (this.matchShowing && !this.eventShowing) {
        breakpoint = 50
      }
      if (!this.matchShowing && this.eventShowing) {
        breakpoint = 40
      }
      const bodyClass = document.body.classList
      if ((this.matchShowing || this.eventShowing) && y > breakpoint) {
        bodyClass.add('scrolled')
      } else {
        bodyClass.remove('scrolled')
      }
    },
    hiddenMatchShowing () {
      this.matchShowing = false
    },
    hiddenEventShowing () {
      this.eventShowing = false
    },
    logoutCabId () {
      window.location.href = `${process.env.ssoServer}/Logout?ur=${encodeURI(window.location.href)}`
    }
  },
  watch: {
    $route () {
      this.navOpen = false
    },
    openSearch (after, before) {
      const searchField = document.getElementById('search-input-field')
      if (after && searchField) {
        searchField.focus()
      }
    },
    matchResults (after, before) {
      this.matchShowing = !!(after && after.length > 0)
    },
    matchShowing (after, before) {
      this.checkMatchShowing()
    },
    eventShowing () {
      this.checkEventShowing()
    },
    isLoggedIn (after, before) {
      if (after === false && before === true) {
        this.logoutCabId()
      }
    }
  },
  created () {
    if (this.settings && this.settings.length > 0) {
      // console.log(this.settings)
      let showEvent = this.settings.find(setting => {
        return setting.key === 'show_events'
      })

      if (showEvent && parseInt(showEvent.value)) {
      // console.log(showEvent.value)
        this.eventShowing = true
        let eventText = this.settings.find(setting => {
          return setting.key === 'show_events_text'
        })
        if (eventText && eventText.value) { this.eventText = eventText.value }
      } else {
        this.eventShowing = false
      }
    }
  },
  mounted () {
    if (Object.is(this.$route.name, 'search-keyword')) {
      this.keyword = this.$route.params.keyword
    }
    this.checkMatchShowing()
    // check scrolled
    window.addEventListener('scroll', this.listenScrollEvent)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.listenScrollEvent)
  },
  components: {
    MatchResult, BreakingNews
  }
}
</script>

<style scoped>
 .search__button{
    position: absolute;
    right: -8px;
    top: 45px;
  }
  .search__form {
    display: none;
    padding: 0 0 1rem 1rem;
    margin: 1rem 0 0;
    width: 100%;
  }
 .search-expanded>.search__button {
   right: -8px;
   top: 37px !important;
 }
  @media (min-width: 1024px) and (max-width: 1099px) {
    .search__form {
      /* padding: 0 0 0 1rem; */
    }
  }

  @media (max-width: 1099px) {
    #search-form-mobile {
      display: block;
      padding-left: 0;
    }
    .search__button--mobile {
      display: block;
    }
  }

  @media (min-width: 1000px) {
    .search__button--mobile {
      display: none;
    }
    .search__form {
      display: block;
      margin: 0;
      max-width: 50px;
      padding: 0;
      /*position: absolute;*/
      right: 0;
      text-align: right;
      top: 0;
      transition: max-width 0.3s ease-out;
      width: -webkit-calc(100% - 545px);
      width: calc(100% - 545px);
      z-index: 9999;
    }
  }

  .search__form-fields {
    display: inline-block;
    width: -webkit-calc(100% - 60px);
    width: calc(100% - 60px);
  }

  @media (min-width: 800px) {
    .search__form-fields {
      height: 30px;
      overflow: hidden;
      position: relative;
      top: -4px;
      right: 30px;
    }
  }

  .search__button,
  .search__input-field {
    background: 0 0;
    border: 0;
    color: #a6a6a6;
  }

  .search__button:focus,
  .search__input-field:focus {
    color: #fefefe;
    outline: none;
  }

  .search__field {
    background: #262626;
    line-height: 2;
    padding: 20px 0 10px;
    position: absolute;
    right: 0;
    top: 60px;
    transform: translateY(-100%);
    transition: background 0.4s, max-width 0.4s, -webkit-transform 0.4s;
    width: 100%;
    z-index: 26;
  }

  .search-open .search__field {
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }

  @media (min-width: 800px) {
    .skinny .search__field {
      top: 5px;
      padding: 0;
      width: 200px;
      z-index: 30;
    }
    .search-open .skinny .search__field,
    .skinny .search__field {
      -webkit-transform: translateY(0);
      -ms-transform: translateY(0);
      transform: translateY(0);
      -webkit-transition: none;
      -o-transition: none;
      transition: none;
    }
    .android .skinny .search__field,
    .iemobile .skinny .search__field,
    .ios .skinny .search__field {
      padding: 20px 0 10px;
      top: 60px;
      -webkit-transform: translateY(-100%);
      -ms-transform: translateY(-100%);
      transform: translateY(-100%);
      -webkit-transition: background 0.4s, max-width 0.4s, -webkit-transform 0.4s;
      transition: background 0.4s, max-width 0.4s, -webkit-transform 0.4s;
      -o-transition: transform 0.4s, background 0.4s, max-width 0.4s;
      transition: transform 0.4s, background 0.4s, max-width 0.4s;
      transition: transform 0.4s, background 0.4s, max-width 0.4s,
      -webkit-transform 0.4s;
      width: 100%;
      z-index: 26;
    }
    .android .search-open .skinny .search__field,
    .iemobile .search-open .skinny .search__field,
    .ios .search-open .skinny .search__field {
      -webkit-transform: translateY(0);
      -ms-transform: translateY(0);
      transform: translateY(0);
    }
  }

  @media (min-width: 800px) and (max-width: 1039px) {
    .skinny .search__field {
      background: transparent;
      max-width: 30px;
      overflow: hidden;
      right: 10px;
    }
    .android .skinny .search__field,
    .iemobile .skinny .search__field,
    .ios .skinny .search__field {
      background: #262626;
      max-width: 100%;
      overflow: visible;
      right: 0;
    }
  }

  .search__input-field {
    font-weight: 300;
    min-height: 28px;
    padding: 6px 10px;
    width: 100%;
    font-size: 16px;
    line-height: 1;
  }

  .search__input-field:-moz-placeholder,
  .search__input-field::-moz-placeholder {
    text-transform: capitalize;
  }

  .search__input-field:-ms-input-placeholder {
    text-transform: capitalize;
  }

  .search__input-field::-webkit-input-placeholder {
    text-transform: capitalize;
  }

  .search__input-field:focus + button:before {
    color: #fefefe;
  }

  .search__input-field + button {
    display: none;
    position: absolute;
    right: 0;
    top: 0;
  }

  .nav-open .search__form {
    display: block;
  }

  .nav-menu-login {
    display: block;
    cursor: pointer;
    height: 50px;
    transition: color 0.2s;
    width: auto;
    position: absolute;
    top: 0;
    right: 64px;
    z-index: 29;
  }
  .nav-menu-login .nav-section__submenu-item {
    line-height: 50px;
    text-align: right;
  }
  .nav-menu-login .user-dropdown {
    /* background: rgba(0, 0, 0, 0.9); */
    background: #4545a2;
    font-size: 14px;
    padding-left: 16px;
    text-align: left;
    position: absolute;
    right: -16px;
    top: 50px;
    width: 100px;
    z-index: 30;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
  }
  .nav-menu-login .open + .user-dropdown {
    max-height: 50px;
  }
  .nav-menu-login .action-list {
    margin: 0 0 15px;
  }
  .action-list .action-item {
    color: #ffff;
    cursor: pointer;
    padding: 10px 10px 10px;
    transition: color .2s;
  }
  .action-list .action-item:hover {
    color: #fff;
  }

  @media screen and (max-width: 1000px) {
    .nav-menu-login .nav-section__submenu-item {
      line-height: 50px;
      padding: 0;
      color: #a6a6a6;
    }
    .nav-menu-login:hover .nav-section__submenu-item {
      color: #fff;
    }
  }
  .nav-menu-hamburger {
    display: block;
    cursor: pointer;
    height: 0px;
    -webkit-transition: color 0.2s;
    transition: color 0.2s;
    width: 29px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 32;
  }

  .nav-menu__hamburger {
    margin: -1.5px 0 0 -10px;
    transition: background 0.3s, color 0.2s;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 32;
  }

  .nav-open .nav-menu__hamburger {
    background: transparent;
  }

  .nav-menu__hamburger:after,
  .nav-menu__hamburger:before {
    content: "";
    transform-origin: center center;
    transition: background 0.3s, -webkit-transform 0.3s;
    transition: transform 0.3s, background 0.3s;
    transition: transform 0.3s, background 0.3s, -webkit-transform 0.3s;
  }

  .nav-menu__hamburger,
  .nav-menu__hamburger:after,
  .nav-menu__hamburger:before {
    background: #a6a6a6;
    height: 2px;
    width: 20px;
  }

  .nav-menu:hover .nav-menu__hamburger,
  .nav-menu:hover .nav-menu__hamburger:after,
  .nav-menu:hover .nav-menu__hamburger:before {
    background: #fff;
  }

  .nav-menu__hamburger:before {
    position: absolute;
    top: -6px;
    left: 0;
  }

  .nav-menu__hamburger:after {
    position: absolute;
    bottom: -6px;
    left: 0;
  }

  .nav-open .nav-menu-hamburger .nav-menu__hamburger:after,
  .nav-open .nav-menu-hamburger .nav-menu__hamburger:before {
    background: #5295ff;
  }

  .nav-open .nav-menu-hamburger .nav-menu__hamburger:before {
    -webkit-transform: translateY(6px) rotate(-45deg);
    -ms-transform: translateY(6px) rotate(-45deg);
    transform: translateY(6px) rotate(-45deg);
  }

  .nav-open .nav-menu-hamburger .nav-menu__hamburger:after {
    -webkit-transform: translateY(-6px) rotate(45deg);
    -ms-transform: translateY(-6px) rotate(45deg);
    transform: translateY(-6px) rotate(45deg);
  }

  @media (min-width: 800px) {
    .search__input-field + button {
      display: block;
    }
    .android .search__input-field + button,
    .iemobile .search__input-field + button,
    .ios .search__input-field + button {
      display: none;
    }
  }

  .nav--plain-header .search__input-field + .search__submit-button {
    display: none;
  }

  @media (min-width: 1000px) {
    .nav--plain-header .search__input-field + .search__submit-button {
      display: inline-block !important;
    }
    .nav-menu-hamburger {
      display: none;
    }
  }

  .nav--plain-header .search__submit-button {
    background: #fff;
    border: 0;
    color: #0c0c0c;
    display: none;
    margin: 0;
    padding-bottom: 0;
    padding-top: 0;
    position: absolute;
    right: 0;
    width: 100px;
  }

  .nav--plain-header .search__input-field {
    background: #fff;
  }

  .nav--plain-header .search__input-field {
    border: 0;
    border-radius: 0;
    color: #0f0f0f;
    font-weight: 300;
    line-height: 30px;
    padding: 0 0.5em;
    width: 100%;
  }

  @media (min-width: 800px) {
    .nav--plain-header .search__input-field {
      display: inline-block;
      height: 30px;
      left: 0;
      min-height: 0;
      position: absolute;
      width: -webkit-calc(100% - 100px);
      width: calc(100% - 100px);
    }
  }

  @media (min-width: 800px) {
    .nav--plain-header .search__submit-button {
      display: inline-block !important;
      height: 30px;
      line-height: 30px;
    }
  }

  .search__button {
    background-color: #262626;
    padding-bottom: 0;
    padding-top: 0;
    -webkit-transition: color 0.3s;
    -o-transition: color 0.3s;
    transition: color 0.3s;
    vertical-align: top;
    /*width: 30px;*/
    line-height: 2;
  }

  .nav--plain-header .search__button {
    background: 0;
    border: 0;
    color: #fff;
    /*float: right;*/
    text-align: center;
    -webkit-transition: color 0.3s;
    -o-transition: color 0.3s;
    transition: color 0.3s;
    /*width: 50px;*/
  }

  @media (min-width: 800px) {
    .nav--plain-header .search__button {
      color: #ffffff;
      cursor: pointer;
      line-height: normal;
      pointer-events: auto;
      margin-top: -36px;
      margin-right: 15px;
    }
    .nav--plain-header .search__button .fa{
      font-size: 18px;
    }
    .search-expanded.search__form {
      max-width: 1000px;
    }
  }

  @media (min-width: 1000px) {
    .search-expanded.search__form {
      width: 500px;
      position: absolute;
      top: -10px;
    }
  }

  /* css phan sub menu */

  @media (max-width: 1099px) {
    .site-nav-desktop__menu {
      padding: 8px 12px 0;
    }
    .site-nav-desktop__menu-item {
      padding: 4px 0;
    }
    .site-nav-desktop__menu-item a {
      padding: 6px 0px !important;
    }
    .site-nav-desktop__icon {
      display: none;
    }
  }

  @media (min-width: 1000px) {
    .site-nav-desktop__menu {
      position: absolute;
      visibility: hidden;
      background: rgba(0, 0, 0, 0.9);
      top: calc(100% + 16px);
      box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s;
    }
    .site-nav-desktop__menu--right {
      right: -5px;
    }
    .site-nav-desktop__menu--left {
      left: -5px;
    }
    .site-nav-desktop__menu-body {
      padding: 8px;
    }
    .site-nav-desktop__icon {
      display: inline-block;
      width: 8px;
      height: 8px;
      vertical-align: middle;
      margin: 0 0 0 4px;
      position: relative;
      fill: #fff;
    }
    .site-nav-desktop__menu-links {
      -webkit-column-count: 1;
      -moz-column-count: 1;
      column-count: 1;
      list-style: none;
      padding: 0;
      width: 240px;
    }
    .site-nav-desktop__menu-link {
      display: block;
      padding: 8px 3px !important;
      color: #dcdcdc;
    }
    .site-nav-desktop__menu-item-header,
    .site-nav-desktop__menu-link {
      font-weight: 400;
      font-size: 14px !important;
    }
    .nav-section__submenu-item:hover .site-nav-desktop__menu {
      visibility: visible;
    }
    .site-nav-desktop__menu-link:hover {
      background-color: rgba(0, 0, 0, 0.08);
      color: #ffffff;
    }
  }

  /* css for nav expand */

  .nav-flyout {
    background-color: #4545a2;
    padding: 0 0 20px;
    position: relative;
    display: none;
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scroll: touch;
    -webkit-font-smoothing: subpixel-antialiased;
    transform: translateY(-100%);
    transition: -webkit-transform 0.2s ease-out;
    transition: transform 0.2s ease-out, -webkit-transform 0.2s ease-out;
    z-index: 30;
  }

  .nav-open .nav-flyout {
    display: block;
    -webkit-transform: translateY(0);
    -ms-transform: translateY(0);
    transform: translateY(0);
  }

  .nav-flyout__container {
    margin: 0 auto;
    max-width: 1000px;
    padding: 1rem;
  }

  .nav-flyout__section-title {
    color: #fff;
    display: block;
    font-size: 22px;
    font-weight: 300;
    padding: 0.2em 0;
  }

  .nav-flyout__submenu {
    display: none;
    list-style: none;
    padding: 0;
  }

  .nav-flyout__submenu-item {
    line-height: 1.5;
    font-weight: 300;
    font-size: 14px;
  }

  .nav-flyout__submenu-link {
    color: #bfbfbf;
  }

  .nav-flyout-footer {
    max-width: 1000px;
    margin: 0 auto 2em;
  }

  .nav-flyout-footer__social {
    float: right;
    padding: 10px 0 0;
  }

  .nav-flyout-footer__social-link {
    background-image: url(//edition.i.cdn.cnn.com/.a/2.49.5/assets/nav_social_share_bar.svg);
    background-position: 0 0;
    background-repeat: no-repeat;
    display: inline-block;
    height: 2.2em;
    margin: 0 0.5em 0 0;
    outline: none;
    width: 2.2em;
  }

  .nav-flyout-footer__social-icon-label {
    display: inline-block;
    visibility: hidden;
    width: 0;
  }

  .nav-flyout-footer__social-link--twitter {
    background-position: -45px 0;
  }

  .nav-flyout-footer__social-link--instagram {
    background-position: -90px 0;
  }

  @media (max-width: 1119px) and (min-width: 0px) {
    .nav-flyout-footer__social-link {
      width: 3em;
      height: 3em;
      background-size: cover;
      margin: 0 1em;
    }
    .nav-flyout-footer__social-link--twitter {
      background-position: -4.25em;
    }
    .nav-flyout-footer__social-link--instagram {
      background-position: -8.575em;
    }
  }

  @media (min-width: 480px) {
    .nav-flyout {
      padding: 0 0 80px;
    }
  }
  @media (max-width: 3000px) and (min-width: 801px) {
    .menu_responsive {
      display: none;
    }
  }
  @media (max-width: 800px) and (min-width: 0px) {
    .menu_responsive {
      position: absolute;
      right: 0px;
      width: 60%;
      height: 100vh;
      z-index: 99999999;
      float: right;
      background-color: #eae9e9;
      padding-right: 0px;
      padding-left: 0px;
    }

    .menu_responsive .nav {
      list-style: none;
      margin: 0;
      padding: 0;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }

    .menu_responsive .nav li {
      display: inline-block;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      position: relative;
      cursor: pointer;
      width: 100%;
    }

    .menu_responsive .nav li a {
      color: #000;
      line-height: 42px;
      position: relative;
    }

    .menu_responsive container {
      padding-left : 0px !important;
      padding-right : 0px !important;
    }

    .menu_responsive .nav li a:hover {
        color: #326295;
    }
  }

  
</style>
