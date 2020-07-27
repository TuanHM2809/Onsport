<template>
  <div id="share" class="article-share">
    <div class="share-box" :style="shareBoxStyle">

      <a title="qrcode" rel="nofollow noopener" class="share-link qzone" @click.prevent="shareWindow(`http://qr.topscan.com/api.php?text=${url}&w=300&el=h&m=10`)">
        <i class="fa fa-qrcode"></i>
      </a>
      <a title="twitter" rel="nofollow noopener" class="share-link twitter" @click.prevent="shareWindow(`http://twitter.com/share?text=${title()}&url=${url}`)">
        <i class="fa fa-twitter"></i>
      </a>
      <a title="facebook" rel="nofollow noopener" class="share-link facebook" @click.prevent="shareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}`)">
        <i class="fa fa-facebook-square"></i>
      </a>

      <a title="google plus" rel="nofollow noopener" class="share-link google-plus" @click.prevent="shareWindow(`https://plus.google.com/share?url=${url}`)">
        <i class="fa fa-google-plus"></i>
      </a>
      <a title="email" rel="nofollow noopener" class="share-link mail" @click.prevent="shareWindow(`mailto:?subject=${title()}&body=${url}`)">
        <i class="fa fa-envelope"></i>
      </a>
      <span ref="share_copy_btn" class="share-link link" rel="nofollow noopener" :data-clipboard-text="url" @click.prevent="$toasted.show('<strong>Đã sao chép vào bộ nhớ đệm!</strong>')">
        <i class="fa fa-clipboard"></i>
      </span>
    </div>
    <div id="at4-scc" @click.prevent="show = !show" :class="`hidden-xs share-link at-share-close-control at4-show at4-${show ? 'show' :'hide'}-content `" title="Hide">
      <i class="fa fa-angle-double-left "></i>
    </div>
    <div v-show="!show" @click.prevent="show = !show" id="at4-soc" :class="`hidden-xs share-link at-share-open-control at-share-open-control-left`" title="Show">
      <i class="fa fa-angle-double-right "></i>
    </div>
  </div>
</template>

<script>
  import Clipboard from 'clipboard'
  export default {
    name: 'share',
    data () {
      return {
        show: true,
        shareCount: 0,
        commentCount: 0,
        url: ''
      }
    },
    created () {
      this.url = `http://onsports.vn${this.$route.fullPath}`
    },
    mounted () {
      this.url = window.location.href
      this.clipboard = new Clipboard(this.$refs.share_copy_btn)
      // this.$nextTick(() => {
      //   this.getFbShare()
      // })
    },
    computed: {
      shareBoxStyle () {
        if (this.show) {
          return {
            transform: 'translateX(0)'
          }
        } else {
          return {
            transform: 'translateX(-100%)'
          }
        }
      }
    },
    methods: {
      description () {
        try { if (document) return document.getElementsByName('description')[0].getAttribute('content') } catch (err) { return '' }
      },
      title () {
        try { if (document) return document.title } catch (err) { return 'Onsports.vn' }
      },
      shareWindow (url) {
        url = url.includes('mailto') ? url.replace(/\s|\||onsports.vn/g, '') : encodeURI(url)
        let winName = 'newWin'
        let awidth = screen.availWidth / 6 * 2
        let aheight = screen.availHeight / 5 * 2
        let atop = (screen.availHeight - aheight) / 2
        let aleft = (screen.availWidth - awidth) / 2
        let param0 = 'scrollbars=0,status=0,menubar=0,resizable=2,location=0'
        let params = `top=${atop},left=${aleft},width=${awidth},height=${aheight},${param0}`
        const win = window.open(url, winName, params)
        win.focus()
      },
      async getFbShare () {
        try {
          const res = await this.$axios.get(`https://graph.facebook.com`, {
            params: {
              id: `http://onsports.vn${window.location.pathname}`
            }
          })
          if (res && res.status === 200) {
            const {share_count, comment_count} = res.data.share
            this.shareCount = share_count
            this.commentCount = comment_count
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped>
.article-share {
  position: fixed;
  top: auto;
  bottom: 10%;
  left: 0;
  width: 3em;
  z-index: 10;
  padding: 0;
  margin-bottom: 1em;
}
@media (max-width: 767px) {
  .article-share {
    bottom: 0;
    left: 0;
    top: auto;
    width: 100%;
    margin-bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
}
.share-box {
  transition: all 0.2s ease;
}

#share .share-box > .share-link {
  cursor: pointer;
  display: inline-block;
  text-align: center;
  background-color: #fff;
}
#share.article-share > .share-box > .share-link {
  width: 4em;
  height: 4em;
  line-height: 4em;
}
#share .share-box > .share-link.qzone:hover {
  background-color: rgb(43, 130, 217);
}

#share .share-box > .share-link.twitter:hover {
  background-color: #55acee;
}
#share .share-box > .share-link.facebook span {
  display: none;
  line-height: 2.5em;
}
#share .share-box > .share-link.facebook:hover {
  background-color: #3b5998;
}

#share .share-box > .share-link.google-plus:hover {
  background-color: #dd4b39;
}

#share .share-box > .share-link.mail:hover {
  background-color: #5dc732;
}
#share .share-box > .share-link.link:hover {
  background-color: #e67a1c;
}
#share .share-box > .share-link:hover > .fa {
  color: #fff;
}
@media screen and (min-width: 768px) {
  #share.article-share > .share-box > .share-link {
    width: 3em;
    height: 2.5em;
    line-height: 2.5em;
  }
}
</style>

<style>
@media (min-width: 768px) {
  .at4-hide-content {
    opacity: 0 !important;
    visibility: hidden;
  }
  .at4-show-content {
    opacity: 1 !important;
    visibility: visible;
    transition: all 0.2s ease;
  }
  .at4-show {
    display: block !important;
    opacity: 1 !important;
  }
  #at4-scc {
    display: block !important;
  }

  .at-share-close-control {
    position: relative;
    width: 3em;
    height: 2.5em;
    line-height: 2.5em;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    background-color: #fff;
  }
  div.at4-arrow {
    /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAoCAYAAABpYH0BAAAAGXRFW…QarO77TyKdBsyRPuwV0h0gmoGnTWFYzVkYBoAA+I/2FmAAt6+b5XM9mFkAAAAASUVORK5CYII=); 
  */
    background-image: url("/arrow.png");
    background-size: 20px;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    margin: 0;
    padding: 0;
    overflow: hidden;
    text-indent: -9999em;
    text-align: left;
    cursor: pointer;
  }
  div.at4-arrow.at-right {
    background-image: url("/brrow.png");
  }

  #share .at4-arrow.at-left {
    transition: all 0.2s ease;
    visibility: hidden;
  }
  #share:hover .at4-arrow.at-left {
    visibility: visible;
  }
  div.at4-arrow.at-left {
    background-position: 0 0;
  }
  .at-share-close-control .at4-arrow.at-left {
    float: right;
  }
  /* show button */
  .at-share-open-control-left {
    position: absolute;
    z-index: 100020;
    left: 0;
    top: auto;
    bottom: 0;
    width: 3em;
    height: 2.5em;
    line-height: 2.5em;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    background-color: #fff;
  }
  #at4-scc > i,
  #at4-soc > i {
    cursor: pointer;
    line-height: inherit;
  }
}
</style>
