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
$("#news-slider").owlCarousel({
  autoPlay: 5000,
  stopOnHover: true,
  nav: true,
  navText: [
    "<i class='fa-angle-left'></i>",
    "<i class='fa-angle-right'></i>"
  ],
  paginationSpeed: 1000,
  singleItem: true,
  autoHeight: true,
  dots: false,
  items: 1,
});
$("#big-gallery-slider").owlCarousel({
  nav: true,
  navText: ["<i class='fa-angle-left'></i>", "<i class='fa-angle-right'></i>"],
  items: 5
});