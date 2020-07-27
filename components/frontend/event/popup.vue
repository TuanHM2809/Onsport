<template>
  <div class="content">
    <div class="popup-wrap">
      <div class="info-wrap">
        <img class="appicon" src="/appicon.png" alt="appicon">
        <p>
          Onsports.vn mang đến cho các bạn chức năng xem trực tiếp các kênh/sự kiện thể thao chuyên biệt. Nếu bạn sử dụng hệ điều hành
          <strong>iOS</strong> vui lòng tải ứng dụng
          <strong>
            ON Sports</strong> để xem được trọn vẹn.
        </p>
      </div>
      <a target="_blank" href="https://itunes.apple.com/vn/app/on-sports/id1282845933?l=vi&mt=8" class="button get-free-app">
        <i class="fa fa-tablet" aria-hidden="true"></i> Tải App
      </a>
      <nuxt-link to="/" class="btn btn-link" style="margin: 10px auto 0; display:block">
        Tôi chỉ xem trên web
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {

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
