<template>
<div class="content-wrapper">
    <div class="bg-video">
        <div class="bg-video-replacer"></div> <!-- hidden for non-mobiles -->
        <div id="bg-video"></div>
        <div class="video-hover-left"></div>
        <div class="video-hover-right"></div>
    </div>
    <div id="content">

        <div id="logo"></div>

        <div class="main-title" style="font-size: 42px;text-align: center;margin-top: 30px;">Onsports.vn</div>
        <div style="padding: 5% 10% 0; ">
            <p style="font-size: 20px;text-align: center">Website đang bảo trì để thay đổi giao diện và nâng cao trải nghiệm sử dụng!!!</p>
        </div>
        
        
    </div>

    <div id="parallax-section" style="top:260px">

        <div id="download-app">
            <p>Bạn có download app để tiếp tục trải nghiệm các dịch vụ của OnSports </p>
            <ul class="on-app" style="width:100%">
                <li class="ios"><a href="https://play.google.com/store/apps/details?id=com.vtvcab.onsports"><img style="height: 45px;"src="/googlepplay.png" alt="googlepplay"></a></li>
                <li class="android"><a href="https://itunes.apple.com/vn/app/on-sports/id1282845933?l=vi&mt=8"><img style="height: 45px;" src="/appstore.png" alt="appstore"></a></li>
            </ul>
        </div>


        <div class="footer">Onsports © Copyrights<br></div>
    </div>

</div>
</template>

<script>

  export default {
    layout: 'main',
   
  }
</script>
<style>
#download-app img {
    padding-top: 15px;
    width: 125px;
    height: 40px;
}
.footer {
    margin: 0 auto;
    margin-top: 140px;
    padding-bottom: 30px;
    width: 200px;
    color: rgba(255,255,255,0.5);
    text-align: center;
    font-size: 14px; 
}
#download-app {
    margin: 0 auto;
    margin-top: 50px;
    padding-bottom: 30px;
    text-align: center;
    font-size: 20px;
}
#download-app ul {
    margin: 0;
    padding: 0;
    list-style: none;
}
.bg-video {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    margin-left: -681px;
    width: 150%;
    height: 100%;
    min-height: 900px;
}
</style>
