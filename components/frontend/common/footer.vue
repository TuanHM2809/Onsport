<template>
  <footer id="on-ftr">
    <div class="container" v-if="isMobile">
      <div class="row">
          <div class="col-md-6 logoFtMobile"></div>
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-3 android" style="width:50%"><a href="https://play.google.com/store/apps/details?id=com.vtvcab.onsports"><img src="/googlepplay.png" alt="googlepplay"></a></div>
              <div class="col-md-3 ios" style="width:50%"><a href="https://itunes.apple.com/vn/app/on-sports/id1282845933?l=vi&mt=8"><img src="/appstore.png" alt="appstore"></a></div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="row" style="padding-left:5px; padding-right:5px; padding-top:10px">
              <div class="on-sports-info">
              <p style="font-size: 14px; color: hsla(0,0%,100%,.5);">Tổng Công ty Truyền hình Cáp Việt Nam.</p>
              <p style="margin-bottom: 6px;font-size: 13px; color: hsla(0,0%,100%,.5);">Địa chỉ: Toà nhà VTVcab, số 3 ngõ 84 Ngọc Khánh, Ba Đình, Hà Nội</p>
              <p style="margin-bottom: 6px;font-size: 13px; color: hsla(0,0%,100%,.5);">Phone: (024) 37714929 . Email: onsports@vtvcab.vn</p>
              <p style="margin-bottom: 6px;font-size: 13px; color: hsla(0,0%,100%,.5);">Giấy phép trang thông tin điện tử số 80/GP-TTĐT, cấp ngày 18/04/2018, Cục Phát Thanh, Truyền Hình và Thông tin điện tử - Bộ TT&TT.</p>
              </div>
            </div>
          </div>
          
          <div class="col-md-6" style="text-align:center">
            <div class="app-store" style="width:100%">
              <ul class="on-follow" style="width:100%; float:left">
                <li style="color: hsla(0,0%,100%,.7);">FOLLOW ON SPORTS</li>
                <li class="facebook"><a target="_blank" href="https://www.facebook.com/Onsportchannel/"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                <li class="youtube"><a target="_blank" href="https://www.youtube.com/channel/UCIWo7q6irZUBaoPOrlf5IVw"><i class="fa fa-youtube-play" aria-hidden="true"></i></a></li>
                <li class="twitter"><a target="_blank" href="https://twitter.com/OnSportsChannel"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
                <li class="twitter"><a target="_blank" href="https://www.instagram.com/OnSportschannel/"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
              </ul>
            </div>
          </div>
          
      </div>
    </div>
    <div class="container" v-if="!isMobile">
      <div class="row">
        <div class="col-md-1 sportsFeatures"></div>
        <div class="col-md-11 sportsFeature">
          <div class="footer-top">
            <div class="app-menu"><h3 style="color: hsla(0,0%,100%,.7);">ON SPORTS</h3></div>
            <div class="app-store">
              <ul class="on-follow">
                <li style="color: hsla(0,0%,100%,.7);">FOLLOW ON SPORTS</li>
                <li class="facebook"><a target="_blank" href="https://www.facebook.com/Onsportchannel/"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                <li class="youtube"><a target="_blank" href="https://www.youtube.com/channel/UCIWo7q6irZUBaoPOrlf5IVw"><i class="fa fa-youtube-play" aria-hidden="true"></i></a></li>
                <li class="twitter"><a target="_blank" href="https://twitter.com/OnSportsChannel"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
                <li class="twitter"><a target="_blank" href="https://www.instagram.com/OnSportschannel/"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
              </ul>
            </div>
          </div>
          
          <div class="on-sports-info">
            <p style="font-size: 14px; color: hsla(0,0%,100%,.5);">Tổng Công ty Truyền hình Cáp Việt Nam.</p>
            <p style="margin-bottom: 6px;font-size: 13px; color: hsla(0,0%,100%,.5);">Địa chỉ: Toà nhà VTVcab, số 3 ngõ 84 Ngọc Khánh, Ba Đình, Hà Nội</p>
            <p style="margin-bottom: 6px;font-size: 13px; color: hsla(0,0%,100%,.5);">Phone: (024) 37714929 . Email: onsports@vtvcab.vn</p>
            <p style="margin-bottom: 6px;font-size: 13px; color: hsla(0,0%,100%,.5);">Giấy phép trang thông tin điện tử số 80/GP-TTĐT, cấp ngày 18/04/2018, Cục Phát Thanh, Truyền Hình và Thông tin điện tử - Bộ TT&TT.</p>
          </div>
        </div>

      </div>
      
      <div class="col-md-12">
        <div class="row">
          <div class="col-md-6 android"><a href="https://play.google.com/store/apps/details?id=com.vtvcab.onsports"><img src="/googlepplay.png" alt="googlepplay"></a></div>
          <div class="col-md-6 ios"><a href="https://itunes.apple.com/vn/app/on-sports/id1282845933?l=vi&mt=8"><img src="/appstore.png" alt="appstore"></a></div>
        </div>
      </div>

      <div class="col-md-12">
        <div class="copyright">
          <p>© VTVcab. Bản quyền thuộc Tổng công ty Truyền hình Cáp Việt Nam.</p>
        </div>
      </div>
    </div>
  </footer>

</template>
<script>
import moment from 'moment'
export default {
  computed: {
    isMobile () {
      return this.$store.state.size.isMobile
    }
  }
}
</script>




