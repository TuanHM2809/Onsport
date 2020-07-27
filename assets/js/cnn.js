/* 1. Page Loader */
$(".loader-item")
  .delay(700)
  .fadeOut();
$("#pageloader")
  .delay(1200)
  .fadeOut("slow");
/* 2. News Ticker */
$(".newsticker").easyTicker({
  direction: "up",
  easing: "easeOutSine",
  speed: "slow",
  interval: 4000,
  height: "auto",
  visible: 1,
  mousePause: 1,
  controls: {
    up: ".up",
    down: ".down"
  }
});

$("#longform-slider").owlCarousel({
  margin: 10,
  loop: true,
  autoWidth: true,
  center: true,
  nav: true,
  navSpeed: 1000,
  items: 1,
  autoHeight: true,
  navText: [
    "<i class='glyphicon glyphicon-chevron-left'>",
    "<i class='glyphicon glyphicon-chevron-right'>"
  ],
  dots: false
});

$("#gallery-slider").owlCarousel({
  margin: 10,
  loop: true,
  autoWidth: true,
  center: true,
  nav: true,
  navSpeed: 1000,
  items: 1,
  autoHeight: true,
  navText: [
    "<i class='glyphicon glyphicon-chevron-left'>",
    "<i class='glyphicon glyphicon-chevron-right'>"
  ],
  dots: false
});

$(function() {
  var $searchButton = $("#search-button");
  var $searchForm = $("#search-form");
  var $navSectionSubmenu = $("#nav-section-submenu");
  var $navSection = $("#nav-section");
  var $navExpandIcon = $(".nav-section__expand-icon");

  $searchButton.click(function() {
    $searchForm.toggleClass("search-expanded");
  });

  $navExpandIcon.click(function() {
    $navSection.toggleClass("nav-section--expanded");
    $navSectionSubmenu.toggleClass("nav-section--expanded");
  });
});