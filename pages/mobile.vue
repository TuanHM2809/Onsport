<template>
  <div class="content">
    <div class="popup-wrap">
      <div class="info-wrap">
        <img class="appicon" src="/appicon.png" alt="appicon">
        <p>
          Onsports.vn mang đến cho các bạn chức năng xem trực tiếp các kênh/sự kiện thể thao chuyên biệt. Vui lòng tải ứng dụng
          <strong>
            ON Sports</strong> để xem được trọn vẹn.
        </p>
      </div>
      <a target="_blank" :href="link" class="button get-free-app">
        <i class="fa fa-tablet" aria-hidden="true"></i> Tải App
      </a>
      <nuxt-link to="/" class="btn btn-link" style="margin: 10px auto 0; display:block">
        Tôi chỉ xem trên web
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import UAParser from '~/utils/ua-parse'
export default {

  head () {
    return {
      title: 'ON Sports - Trang tin tức bóng đá nhanh và chính xác nhất',
      meta: [
        { hid: 'description', name: 'description', content: 'ON Sports, cập nhật nhanh tin tức thể thao trong nước và thế giới trong ngày. Thông tin đầy đủ, hình ảnh, video chi tiết kết quả các môn thi thể thao mới nhất' },
        { hid: 'og:title', property: 'og:title', content: 'ON Sports - Trang tin tức bóng đá nhanh và chính xác nhất' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:description', property: 'og:description', content: 'ON Sports, cập nhật nhanh tin tức thể thao trong nước và thế giới trong ngày. Thông tin đầy đủ, hình ảnh, video chi tiết kết quả các môn thi thể thao mới nhất' },
        { hid: 'og:url', property: 'og:url', content: 'http://onsports.vn' },
        { hid: 'og:image', property: 'og:image', content: 'http://onsports.vn/logo16x9.png' },
        { hid: 'fb:pages', property: 'fb:pages', content: '362562464141378' },
        { hid: 'og:image:alt', property: 'og:image:alt', content: 'ONSports.vn' },
        { hid: 'og:image:width', property: 'og:image:width', content: '160' },
        { hid: 'og:image:height', property: 'og:image:height', content: '90' },
        { name: 'google-site-verification', content: 'fZOtnkHJ4UjyUCoGyU88XaouooL3HA9M3mS8bbWYuRk' }
      ]
    }
  },
  data () {
    return {
      link: 'https://itunes.apple.com/vn/app/on-sports/id1282845933?l=vi&mt=8'
    }
  },

  mounted () {
    this.$nextTick(() => {
      let Ua = UAParser(navigator.userAgent)
      if (Ua.isMobile) {
        if (Ua.isIos) {
          this.link = 'https://itunes.apple.com/vn/app/on-sports/id1282845933?l=vi&mt=8'
        } else {
          this.link = 'https://play.google.com/store/apps/details?id=com.vtvcab.onsports'
        }
      } else {
        this.link = 'http://onsports.vn'
        this.$router.push('/')
        
      }
      // window.location.href = 'http://onsports.vn/_nuxt/img/MaintainPage/index.html'
    })
  }
}
</script>

<style scoped>
.content {
  width: 100vw;
  height: 100vh;
  margin-top: -50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 1000000000;
  background: rgba(0, 0, 0, 0.55);
}
.popup-wrap {
  padding: 10px;
  margin: 10px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.info-wrap {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.popup-wrap .appicon {
  margin-right: 0;
  border-radius: 24px;
  width: 72px;
  height: 72px;
}
.popup-wrap p {
  font-size: 14px;
  line-height: 20px;
  padding-left: 10px;
  margin-bottom: 5px;
  color: rgba(0, 0, 0, 0.9);
}
.popup-wrap .get-free-app {
  display: inline-block;
  font-size: 16px;
  padding: 8px 16px;
  min-width: 98px;
  min-height: 37px;
  font-weight: 700;
  text-align: center;
  width: 100%;
  max-width: 100%;
  background: #4545a2;
  color: #fff;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.55);
  margin: 0 auto;
  height: auto;
  text-transform: uppercase;
  border-radius: 0;
  border: none;
}
.get-free-app .fa {
  font-size: 16px;
  margin-right: 2px;
}
</style>
