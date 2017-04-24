var revealPoint, animatePoints, sellingPoints, scrollDistance;

animatePoints = function() {
  revealPoint = function() {
    $(this).css({
      // Transitions to opaque, full x size, and y position
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
  };
  // Facilitates transition for each selling point
  $.each($('.point'), revealPoint);
}

$(window).load(function() {
  // If the height of the screen indicates that selling-points are already in view, reveal the points.
  if ($(window).height() > 950) {
    animatePoints();
  }
  // Otherwise, reveal points after top page has been scrolled through up to location of selling points
  scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
  $(window).scroll(function(event) {
    if ($(window).scrollTop() >= scrollDistance) {
      animatePoints();
    }
  });
});
