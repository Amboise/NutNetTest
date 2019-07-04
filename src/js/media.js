$(document).ready(function() {
  $("#menuadapt").on("click", function() {
    $(".nav-menu").slideToggle(300);
  });
  $(window).resize(function() {
    if ($(window).width() < 960) {
      $(".nav-menu").hide(300);
    }
  });
});
