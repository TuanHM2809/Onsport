$(function(){
  var $searchButton = $('#search-button');
  var $searchForm = $('#search-form');
  var $navSectionSubmenu = $('#nav-section-submenu')
  var $navSection = $('#nav-section')
  var $navExpandIcon = $('.nav-section__expand-icon')
  
  $searchButton.click(function(){
      $searchForm.toggleClass('search-expanded')
  })

  $navExpandIcon.click(function(){
    $navSection.toggleClass('nav-section--expanded')
    $navSectionSubmenu.toggleClass('nav-section--expanded')
  })



})

