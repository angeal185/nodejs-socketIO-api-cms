function ToastBuilder(options) {
  // options are optional
  var opts = options || {};


  // setup some defaults
  opts.defaultText = opts.defaultText;
  opts.displayTime = opts.displayTime || 3000;
  opts.target = 'body';

  return function (text) {
    $('<div/>')
      .addClass('toast blink')
      .prependTo($(opts.target))
      .text(text || opts.defaultText)
      .queue(function(next) {
        $(this).css({
          'opacity': 1
        });
        var topOffset = 40;
        $('.toast').each(function() {
          var height = $(this).outerHeight();
          var offset = 15;
          $(this).css('bottom', topOffset + 'px');

          topOffset += height + offset;
        });
        next();
      })
      .delay(opts.displayTime)
      .queue(function(next) {
        var width = $(this).outerWidth() + 20;
        $(this).css({
          'right': '-' + width + 'px',
          'opacity': 0
        });
        next();
      })
      .delay(600)
      .queue(function(next) {
        $(this).remove();
        next();
      });
  };
}


var showtoast = new ToastBuilder();

function scrollTop() {
  $(window).scroll(function() {
    $(this).scrollTop() > 100 ? $("#toTop").fadeIn() : $("#toTop").fadeOut();
  }), $("#toTop").click(function() {
    return $("html, body").animate({
        scrollTop: 0
    }, 1e3), !1;
  });
}

function backToTop(i){
  $('html,body').animate({scrollTop: i},200);
}
