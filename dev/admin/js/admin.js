function toggleBubbles(i,e){
  if ($(i).hasClass(e)){
    bubbles();
    $(".mask").fadeIn('0.5s');
    $('.miniBtnDiv').css('display','none');
  } else {
      $(".bubble-container").remove();
      $(".mask").fadeOut('0.5s');
      $('.miniBtnDiv').css('display','inline-block');
  }
}

function initNav(){
  $(".menu-link").click(function () {
    $("#menu").toggleClass("active");
    $(".main").toggleClass("active");

    toggleBubbles('#menu','active')
  });


  $(".menuHead").click(function () {
    $("i", this).toggleClass("icon-right-open icon-down-open");
    $(this).next().toggle("slow");
  });
}

function otherFadeIn(i,e,x){
  $(i).mouseenter(function() {
    $(e).html(x).fadeIn('slow', function() {
      $(i).mouseleave(function() {
        $(e).fadeOut('slow').empty();
      });
    });
  });
}

function bubbles() {

  var min_bubble_count = 4,
      max_bubble_count = 10,
      min_bubble_size = 10,
      max_bubble_size = 40,
      min_speed = 10,
      max_speed = 12,
      max_delay = 10;

  var bubbleCount = min_bubble_count + Math.floor(Math.random() * (max_bubble_count + 1));

  for (var i = 0; i < bubbleCount; i++) {
      $('.bubbles').append('<div class="bubble-container"><div class="bubble"></div></div></div>').append('<div class="bubble-container"><div class="bubble2"></div></div></div>');
    }
  $('.bubbles').find('.bubble-container').each(function(){
  pos_rand = Math.floor(Math.random() * 99),
  size_rand = min_bubble_size + Math.floor(Math.random() * (max_bubble_size + 1)),
  delay_rand = Math.floor(Math.random() * max_delay),
  speed_rand = min_speed + Math.floor(Math.random() * (max_speed + 1));


    $(this).css({
      'left': pos_rand + '%',
      '-webkit-animation-duration': speed_rand + 's',
      '-moz-animation-duration': speed_rand + 's',
      '-ms-animation-duration': speed_rand + 's',
      'animation-duration': speed_rand + 's',
      '-webkit-animation-delay': delay_rand + 's',
      '-moz-animation-delay': delay_rand + 's',
      '-ms-animation-delay': delay_rand + 's',
      'animation-delay': delay_rand + 's'
    });
    $(this).children('.bubble, .bubble2').css({
    'width': size_rand + 'px',
    'height': size_rand + 'px'
    });
  });
}
