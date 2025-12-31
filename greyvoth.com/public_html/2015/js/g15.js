$(document).ready(function() {
//  "use strict";

  $(document).on('click', '.toggleAll', function() {
    $('.pp, .coat, .heart-wrap, .comment-wrap, .check-wrap, .grip .btn').slideToggle('fast');

    var el = $(this);
    el.text() === el.data("text-swap") ? el.text(el.data("text-original")) : el.text(el.data("text-swap"));
  });

  $(window).scroll(function() {
    if ($(this).scrollTop() > 52) {
      $('.scrollup').fadeIn();
    } else {
      $('.scrollup').fadeOut();
    }
  });

  $('.scrollup').click(function() {
    //		alert('SCROLL');
    $("html, body").animate({
      scrollTop: 0
    }, 600);
    return false;
  });

});

//------------------------------------------------

//This controls the music playback on the media page

window.addEventListener("play", function(evt) {
  "use strict";
  if (window.$_currentlyPlaying) {
    window.$_currentlyPlaying.pause();
  }
  window.$_currentlyPlaying = evt.target;
}, true);

//------------------------------------------------
$(function(){
    var lastScrollTop = 0, delta = 15;
    $(window).scroll(function(event){
       var st = $(this).scrollTop();
       
       if(Math.abs(lastScrollTop - st) <= delta)
          return;
if ((st > lastScrollTop) && (lastScrollTop>0)) {
       // downscroll code
      $(".header").css("top","-80px");
      $("#menu").css("opacity","0");
   } else {
      // upscroll code
      $(".header").css("top","0px");
      $("#menu").css("opacity","1");
   }
		lastScrollTop = st;
    });
});

//------------------------------------------------

//------------------------------------------------


// -- Carousel --//
function slideCarousel() {
  let items = document.querySelectorAll('.carousel .carousel-item');

  items.forEach((el) => {
    const minPerSlide = 4;
    let next = el.nextElementSibling;
    for (var i = 1; i < minPerSlide; i++) {
      if (!next) {
        // Wrap carousel by using first child
        next = items[0];
      }
      let cloneChild = next.cloneNode(true);
      el.appendChild(cloneChild.children[0]);
      next = next.nextElementSibling;
    }
  });
}

// Set the interval (in milliseconds) for sliding
const slideInterval = 2000; // 2 seconds

// Call the function initially
slideCarousel();

// Set an interval to call the function periodically
setInterval(slideCarousel, slideInterval);
// -- Carousel --//

$('.fancybox').fancybox();