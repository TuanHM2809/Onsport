$('ul.tert-nav li.searchit img.closesearch').click(function(e) {
    e.stopPropagation();
    $('.searchbox').hide();
    $('ul.tert-nav li').removeClass('search');
});

$(window).scroll(function () {
    if ($(this).scrollTop() > 75) {
        $('#on-hdr').addClass('fixed-top');
    } else {
        $('#on-hdr').removeClass('fixed-top');
    }
});

$('.carousel').carousel({
	interval:2000,
	item:4,
    pager:true,
    autoWidth:true,
    slideMargin:0
})