<script>
import parser from '~/shortcodes/index.meta'
import parserMobile from '~/shortcodes/index_mobile.meta'
import MarkdownIt from 'markdown-it'
import MarkdownItTable from 'markdown-it-table'

import MarkdownItContainer from 'markdown-it-container'
import MarkdownItAttrs from 'markdown-it-attrs/markdown-it-attrs.browser.js'
import blockEmbedPlugin from 'markdown-it-block-embed'
import implicitFigures from 'markdown-it-implicit-figures'
export default {
  data () {
    return {
      template: '',
      isLoaded: false,
      isAvailble: false
    }
  },
  props: {
    content: {
      type: String,
      required: true
    },
    ios: {
      type: Boolean,
      default: false
    }
  },
  render (h) {
    var Child = {
      template: `<div id="instructions" class="instructions">${this.template}
      <p class="source text-right m-t-0" style="color: #000">
            <strong>Nguồn: Bóng đá TV, Thể thao TV (VTVcab)</strong>
      </p>
      </div>`
    }

    if (!this.template && !this.isLoaded) {
      return h('div')
    }
    return h(Child)
  },

  methods: {
    async parserShortcodes () {
      try {
        let rawHtml = this.renderMD(this.content)
        let parsedHtml
        if (this.ios) {
          parsedHtml = await parserMobile(rawHtml)
        } else {
          parsedHtml = await parser(rawHtml)
        }
        if (parsedHtml) {
          this.template = parsedHtml
        } else {
          this.$toast.error('Không thể lấy được dữ liệu')
        }
      } catch (e) {
        console.log(e)
      }
    },
    renderMD (content) {
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      })
      md.use(MarkdownItAttrs,
        {
          html: true,
          linkify: true,
          typographer: true
        })
      md.use(blockEmbedPlugin, {
        youtube: { width: 512, height: 288 }
        //   containerClassName: "video-embed"
      })
      md.use(implicitFigures, {
        dataType: true, // <figure data-type="image">, default: false
        figcaption: true // <figcaption>alternative text</figcaption>, default: false
      })

      md.use(MarkdownItTable)

      md.use(MarkdownItContainer, 'bg', {
        validate: function (params) {
          return params.trim().match(/^bg-(primary|success|info|warning|error)$/)
        },
        render: function (tokens, idx) {
          var m = tokens[idx].info.trim().match(/^bg-(primary|success|info|warning|error)$/)
          if (m) {
            // opening tag
            return `<div class="${tokens[idx].info.trim()}">\n`
          } else {
            // closing tag
            return '</div>\n'
          }
        }})
      // console.log(md.render('::: error \n*content*\n:::\n'))
      // add a div wrap table
      md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
        var data = self.renderToken(tokens, idx, options)
        const addedClass = tokens[idx].attrs ? tokens[idx].attrs[0][1] : ''
        return `<div class="block-table ` + addedClass + `">` + data
      }
      md.renderer.rules.table_close = function (tokens, idx, options, env, self) {
        var data = self.renderToken(tokens, idx, options)
        return data + `</div>`
      }

      // add aside tag wrap blockquote
      var blockquoteOpenOldRender = md.renderer.rules.blockquote_open || function (tokens, idx, options, env, self) {
        var data = self.renderToken(tokens, idx, options)
        return data
      }

      md.renderer.rules.blockquote_open = (tokens, idx, options, env, self) => {
        var data = blockquoteOpenOldRender(tokens, idx, options, env, self)
        const addedClass = tokens[idx].attrs ? tokens[idx].attrs[0][1] : ''
        return `<aside class="` + addedClass + `">` + data
      }

      var blockquoteCloseOldRender = md.renderer.rules.blockquote_close || function (tokens, idx, options, env, self) {
        var data = self.renderToken(tokens, idx, options)
        return data
      }
      md.renderer.rules.blockquote_close = (tokens, idx, options, env, self) => {
        var data = blockquoteCloseOldRender(tokens, idx, options, env, self)
        return data + `</aside>`
      }
      // chung ta khong giong nhau
      var oldRender = md.renderer.rules.paragraph_open || function (tokens, idx, options, env, self) {
        var data = self.renderToken(tokens, idx, options)
        return data
      }
      md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
        return oldRender(tokens, idx, options, env, self)
      }

      const data = md.render(content)
      // const data = md.render('::: bg-info \n*content*\n:::\n')
      return data
    },
    addPlatformScript (src) {
      const s = document.createElement('script')
      s.setAttribute('src', src)
      document.body.appendChild(s)
      let addScriptPromise = new Promise((resolve, reject) => {
        s.onload = () => {
          resolve(window.twttr)
        }
      })
      return addScriptPromise
    }

  },
  mounted () {
    Promise.resolve(window.twttr ? window.twttr : this.addPlatformScript('/widgets.js'))
      .then(data => {
        this.isAvailable = (data !== undefined)
        this.isLoaded = true
      }).then(() => this.parserShortcodes())
  }
}
</script>
<style>
.instructions {
  padding: 0px 0px 20px;
}
.instructions a {
  color: #0a1388;
}
.instructions a:hover {
  text-decoration: underline;
}
.instructions h1,
.instructions h2,
.instructions h3,
.instructions h4,
.instructions h5,
.instructions h6 {
  clear: both;
  display: block;
  padding: 0 10px;
  
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
  line-height: 1.4615384615;
  color: #000;
}
/* css color */
.instructions .text-muted {
  color: #777 !important;
}
.instructions .text-primary {
  color: #337ab7 !important;
}
.instructions .text-success {
  color: #3c763d !important;
}
.instructions .text-info {
  color: #31708f !important;
}
.instructions .text-warning {
  color: #8a6d3b !important;
}
.instructions .text-danger {
  color: #a94442 !important;
}

/* end css color */

.instructions h1 {
  line-height: 44px;
  margin: 0 0 22px 0;
  font-size: 33px;
  font-size: 3.3rem;
}

.instructions h2 {
  font-size: 25px;
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 42px;
  margin: 0 0 22px 0;
}

.instructions h3 {
  font-size: 20px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 1.45;
  margin-top: 6px;
}

.instructions h4 {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 24px;
  margin: 0;
}

.instructions h5 {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: normal;
  line-height: 18px;
  margin: 0 0 14px 0;
}

.instructions h6 {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 18px;
  margin: 0 0 14px 0;
}
.instructions figure,
figcaption,
.instructions > p {
  padding: 0 10px;
  font-size: 16px;
  text-align: justify;
  color: #333;
}
.instructions ul,
.instructions > ol,
.instructions > dl {
  padding: 0 10px;
}
.instructions ul {
  list-style: disc;
  padding-left: 30px;
}
.instructions ul ul,
.instructions ol ul {
  list-style-type: circle;
}
.instructions ol ol ul,
.instructions ol ul ul,
.instructions ul ol ul,
.instructions ul ul ul {
  list-style-type: square;
}
.instructions ul li + li {
  margin-top: 4px;
}

.instructions > p.text-center,
.instructions > p.center {
  text-align: center !important;
}
.instructions > p.text-right {
  text-align: right !important;
}
.instructions > p.text-left {
  text-align: left !important;
}
.instructions aside.quote,
.instructions aside.storyhighlight {
  clear: both;
}
/* css cho qoute */

/* css cho highlight */
blockquote {
    padding: 10px 20px;
    margin: 10px 30px !important;
    font-size: 17.5px;
    border-left: 0px;
}
.instructions aside.storyhighlight,
.instructions aside.quote {
  padding: 10px;
  margin-right: 0px;
  overflow-y: auto;
}
@media (max-width: 760px) {
    blockquote.storyhighlight {
      max-width: inherit !important;
    }
  }
.instructions aside.storyhighlight > blockquote.storyhighlight {
  background: #fff;
  color: #222222;
  padding-left: 50px;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(34, 34, 34, 0.12);
  position: relative;
  overflow: hidden;
  min-height: 120px;
  border-radius: 15px;
  max-width: 42%;
  margin-top: 15px;
}
.instructions aside.storyhighlight > blockquote.storyhighlight > p:first-child {
  font-size: 16px;
  line-height: normal;
  margin: 0;
  max-width: 90%;
  position: relative;
  z-index: 1;
  color: #fff;
}

.instructions aside.storyhighlight > blockquote.storyhighlight:before {
  font-family: Georgia, serif;
  content: "\201C";
  position: absolute;
  top: -1px;
  left: 10px;
  font-size: 3em;
  color: rgba(238, 238, 238, .2);
  font-weight: normal;
}

.instructions aside.storyhighlight > blockquote.storyhighlight:after {
  font-family: Georgia, serif;
  content: "\201D";
  position: absolute;
  bottom: -77px;
  line-height: 100px;
  right: 0px;
  font-size: 9em;
  color: rgba(238, 238, 238, .2);
  font-weight: normal;
}
.instructions aside.storyhighlight > blockquote.storyhighlight {
    background: #2e3591;
    color: #ffffff;
  }
  .instructions aside.storyhighlight > blockquote.storyhighlight:before, ..instructions aside.storyhighlight > blockquote.storyhighlight:after {
    color:#666aa8 ;
  }
.instructions
  aside.storyhighlight
  > blockquote.storyhighlight
  > p:not(:first-child) {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
  max-width: 80%;
  position: relative;
  z-index: 1;
}
strong {
  font-weight: 500;
  font-size: 16px;
}

/*end */
.instructions p > img {
  max-width: 100%;
}
/* TO DO */

.instructions > p.full-width,
.instructions > figure.full-width {
  width: 100%;
  max-width: inherit;
  margin: 0 0 15px 0 !important;
  padding: 0 !important;
}
.instructions > p.full-width img,
.instructions > figure.full-width img {
  width: 100%;
}
figcaption {
  line-height: 1.333;
  font-size: 12px;
  text-align: center;
  padding: 7.5px;
  margin-bottom: 10px;
}
.instructions figure {
  margin-bottom: 15px !important;
}
.instructions figure > img {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}
.instructions figure:not(.full-width) > img {
  width: 100%;
}
.instructions figure:not(.full-width) > figcaption {
  background-color: #eee;
}
/* table */
.instructions .block-table {
  padding: 0 10px;
}
.instructions .block-table table {
  padding: 0;
  overflow: auto;
  max-width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
}
.instructions table tr {
  border-top: 1px solid #cccccc;
  background-color: white;
  margin: 0;
  padding: 0;
}
.instructions table tr:nth-child(2n) {
  background-color: #f8f8f8;
}
.instructions table tr th {
  font-weight: bold;
  border: 1px solid #cccccc;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
}
.instructions table tr td {
  border: 1px solid #cccccc;
  text-align: left;
  margin: 0;
  padding: 6px 13px;
}
.instructions table tr th :first-child,
.instructions table tr td :first-child {
  margin-top: 0;
}
.instructions table tr th :last-child,
.instructions table tr td :last-child {
  margin-bottom: 0;
}
.instructions .text-left {
  text-align: left !important;
}

/* transfer css */
.instructions aside.transfer {
  padding-top: 0;
}
.instructions aside.transfer blockquote {
  float: left;
  width: 100%;
  height: 32px;
  margin-bottom: 0;
  box-sizing: content-box;
  padding: 0;
  padding-bottom: 10px;
  padding-top: 10px;
  min-height: 30px;
  text-align: left;
  border-left: none;
}
.instructions aside.transfer blockquote p {
  float: none !important;
  height: auto !important;
  text-align: center;
  font-family: "OnSport", sans-serif !important;
  font-weight: 300 !important;
  font-size: 18px !important;
  color: inherit !important;
  line-height: 22px !important;
  background-image: none !important;
  padding: 0 !important;
}
.instructions aside.transfer img {
  display: block;
  width: 32px;
  height: 32px;
  margin: 12px auto 0;
  float: none;
}

.instructions .twitter-tweet p {
  font: normal 18px/24px Georgia, "Times New Roman", Palatino, serif;
  margin: 0 5px 10px 0;
}

.instructions .twitter-tweet a[href^="https://twitter.com"] {
  font-weight: normal;
  color: #666;
  font-size: 12px;
}

/* end transfer */

/* css bg-*  */
.instructions div.bg-primary,
.instructions div.bg-success,
.instructions div.bg-info,
.instructions div.bg-warning,
.instructions div.bg-danger {
  padding: 15px;
  border-radius: 0px;
}
.instructions .bg-primary,
.instructions .bg-primary * {
  color: white;
}

@media (max-width: 639px) {
  .instructions table {
    width: 100%;
  }
  /* extend embed-responsive */
  .block-embed.block-embed-service-youtube,
  .block-embed.block-embed-service-media {
    position: relative;
    display: block;
    width: calc(100% - 20px);
    margin: 0 auto;
    height: 0;
    padding: 10px;
    overflow: hidden;
    padding-bottom: 61.25%;
  }
  .block-embed.block-embed-service-youtube iframe,
  .block-embed.block-embed-service-media div.video-player {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    border: 0;
    margin: 0 !important;
    padding: 0;
  }
  .ios .block-embed.block-embed-service-media {
    position: relative;
    display: block;
    width: calc(100% - 20px);
    margin: 0 auto;
    height: auto;
    padding: 0px;
    overflow-y: auto;
  }
  .instructions aside.transfer blockquote {
    position: relative;
  }

  .instructions aside.transfer blockquote p {
    text-align: left;
    line-height: 32px !important;
    padding-left: 10px !important;
  }
  .instructions aside.transfer img {
    position: absolute;
    top: 20px;
    right: 1em;
    float: none;
    margin: 0 auto;
    width: 32px;
    height: 32px;
    transform: translateY(-10px);
  }
  .instructions figure {
    width: 100% !important;
  }
  .the-longform .instructions figure.pull-right,
  .the-longform .instructions figure.pull-left {
    float: none;
    width: 100% !important;
  }
}

/* end table */
@media screen and (min-width: 640px) {
  instructions {
    padding: 0;
  }
  .instructions p,
  .instructions h1,
  .instructions h2,
  .instructions h3,
  .instructions h4,
  .instructions h5,
  .instructions h6,
  .instructions > hr,
  .instructions figure,
  .instructions ul,
  figcaption {
    max-width: 820px;
    margin: 0 auto;
    font-weight: 400;
    line-height: 1.333;
  }
  .instructions .bg-primary,
  .instructions .bg-success,
  .instructions .bg-info,
  .instructions .bg-warning,
  .instructions .bg-danger {
    max-width: 820px;
    margin: 0 auto;
  }
  .instructions ul {
    list-style: disc;
    padding-left: 40px;
    margin-bottom: 15px;
  }
  .instructions ul li {
    text-align: justify;
    font-size: 16px;
    line-height: 1.58;
  }
  .instructions > hr {
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .instructions > p {
    margin: 0 auto 15px !important;
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    line-height: 1.58;
    letter-spacing: -0.002em;
  }
  .instructions .block-embed div.post-player,
  .instructions .block-embed div.post-gallery {
    clear: both;
    max-width: 930px;
    padding-left: 0;
    padding-right: 0;
    position: relative;
    width: 100%;
    z-index: 0;
    margin: 0 auto;
  }

  figcaption {
    font-size: 15px;
  }

  .instructions .block-embed,
  .instructions aside.quote,
  .instructions aside.storyhighlight,
  .instructions aside.transfer,
  .instructions div.block-table {
    max-width: 930px;
    margin: 0 auto;
    padding-left: 10px;
    padding-right: 10px;
  }
  .instructions aside.storyhighlight,
  .instructions aside.quote {
    padding: 10px 0;
    overflow-y: inherit;
  }

  .instructions aside.storyhighlight blockquote.storyhighlight,
  .instructions aside.quote blockquote.quote {
    margin-top: 10px;
    margin-bottom: 30px;
    width: 300px;
    float: left;
  }
  .instructions
    aside.storyhighlight
    > blockquote.storyhighlight
    > p:first-child {
    font-size: 24px;
    line-height: normal;
  }
  .instructions aside.quote blockquote.quote > p + p:before {
    border-top: 1px solid #bfbfbf;
    content: "";
    display: block;
    height: 1px;
    margin: 10px 0;
    width: 80px;
  }
  .instructions aside.storyhighlight.right blockquote.storyhighlight {
    float: right;
    padding-left: 20px;
    padding-right: 0;
  }
  .instructions div.block-table.center table,
  .instructions div.block-table table {
    margin-bottom: 20px;
  }
  .instructions div.block-table.right table {
    float: right;
    margin-left: 30px;
  }
  .instructions div.block-table.left table {
    float: left;
    margin-right: 30px;
  }

  .instructions figure.transfer-img {
    margin: 0;
    padding: 0;
    float: left;
    max-width: 78%;
  }

  .instructions .block-embed iframe {
    display: block;
    margin: 10px auto 30px;
    padding: 10px;
  }
  .instructions .block-embed.center iframe,
  .instructions .block-embed iframe.center {
    display: block;
    margin: 0 auto;
  }

  .instructions .block-embed.left iframe,
  .instructions .block-embed iframe.left,
  .instructions .block-embed.block-embed-service-media.left > * {
    padding: 0;
    float: left;
    margin-right: 20px;
  }
  .instructions .block-embed.block-embed-service-media.left > *,
  .instructions .block-embed.block-embed-service-media.right > * {
    clear: none;
  }

  .instructions .block-embed.block-embed-service-twitter .twitter-tweet,
  .instructions .twitter-tweet,
  .instructions .twitter-tweet.center,
  .instructions .block-embed.block-embed-service-twitter.center .twitter-tweet,
  .instructions .block-embed.block-embed-service-twitter .twitter-tweet.center {
    margin: 0 auto;
    float: none;
    margin-bottom: 20px;
  }

  .instructions .block-embed.right iframe,
  .instructions .block-embed iframe.right,
  .instructions .block-embed.block-embed-service-media.right > * {
    padding: 0;
    float: right;
    margin-left: 20px;
  }
  .instructions .block-embed.block-embed-service-twitter.right iframe,
  .instructions .block-embed.block-embed-service-twitter iframe.right,
  .instructions .block-embed.block-embed-service-twitter.right .twitter-tweet,
  .instructions .block-embed.block-embed-service-twitter .twitter-tweet.right {
    padding: 0;
    float: right;
    margin-left: 20px;
  }
  .instructions .block-embed.block-embed-service-twitter.left iframe,
  .instructions .block-embed.block-embed-service-twitter iframe.left,
  .instructions .block-embed.block-embed-service-twitter.left .twitter-tweet,
  .instructions .block-embed.block-embed-service-twitter .twitter-tweet.left {
    padding: 0;
    float: left;
    margin-right: 20px;
  }
  .instructions .block-embed.block-embed-service-facebook iframe,
  .instructions .block-embed.block-embed-service-facebook iframe.left,
  .instructions .block-embed.block-embed-service-facebook iframe.right,
  .instructions .block-embed.block-embed-service-facebook iframe.center {
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 0;
    padding-top: 0;
  }
  .instructions aside.transfer blockquote {
    width: 20%;
    max-height: inherit;
    height: auto;
    padding: 0;
    padding-left: 10px;
    padding-right: 18px;
    box-sizing: border-box;
  }
  .the-article .instructions aside.transfer blockquote p {
    font-size: 17px !important;
  }
  .instructions aside.transfer blockquote p {
    font-size: 22px !important;
  }
  .instructions aside.transfer img {
    display: block;
    width: 64px;
    height: 64px;
    margin: 12px auto 0;
    float: none;
  }
  .the-article
    .instructions
    .block-embed.block-embed-service-twitter
    .twitter-tweet {
    width: 75% !important;
  }

  .the-longform .instructions figure.pull-right {
    margin: 10px 0px 30px 20px;
  }
  .the-longform .instructions figure.pull-left {
    margin-top: 10px;
    margin-bottom: 30px;
    margin-right: 20px;
  }
}

@media (min-width: 640px) and (max-width: 991px) {
  .instructions aside.storyhighlight blockquote.storyhighlight,
  .instructions aside.quote blockquote.quote {
    margin-left: 10px;
  }
}

@media screen and (min-width: 992px) {
  .the-longform .instructions figure.pull-right {
    margin: 10px 0px 30px 20px;
    margin-right: calc((100% - 930px) / 2);
  }
  .the-longform .instructions figure.pull-left {
    margin-top: 10px;
    margin-bottom: 30px;
    margin-right: 20px;
    margin-left: calc((100% - 930px) / 2);
  }
}
</style>

