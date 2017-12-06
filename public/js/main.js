mainObject = {
  initialize : function() {
    baseOuterWidth = 440;
    baseOuterHeight = 307;
    baseInnerWidth = 420;
    baseInnerHeight = 297;
    isFullScreen = false;
    currentOuterWidth = baseOuterWidth * 2;
    currentOuterHeight = baseOuterHeight * 2;

    zoomWrap = $('#js-zoom-wrap');
    flipbook = $("#js-flipbook");
    slider = $('#js-slider');

    zoomWrap.css({ width : baseOuterWidth * 2 });
    slider.css({ width : baseOuterWidth });

    flipbook.turn({
      width      : baseOuterWidth * 2,
      height     : baseOuterHeight * 2,
      elevation  : 50,
      autoCenter : true,
      when       : {
        turning : function (e, page, view) {
          var book = $(this)
          if (page >= 2) {
            $('.hard.front-side').addClass('fixed');
          }
          else {
            $('.hard.front-side').removeClass('fixed');
          }
          if (page < book.turn('pages')) {
            $('.hard.back-side').addClass('fixed');
          }
          else {
            $('.hard.back-side').removeClass('fixed');
          }
        }
      }
    });

    slider.slider({
      min    : 1,
      max    : flipbook.turn("pages"),
      change : function(e, ui) {
        flipbook.turn('page', ui.value)
      }
    });

    flipbook.on('turned', function(event, page, view) {
      slider.slider('value', page);
    });

    flipbook.on('start', function(event, page, view) {
      if (isFullScreen) {
        var newHeight = screen.height;
        var outerRatio = screen.height / currentOuterHeight;
        var newOuterWidth = (currentOuterWidth) * outerRatio;
        var innerRatio = screen.height / baseInnerHeight;
        var newInnerWidth = baseInnerWidth * innerRatio;
        var newInnerHeight = baseInnerHeight * innerRatio;
        $('.own-size').css({
          width  : newInnerWidth / 2 - 20,
          height : newInnerHeight - 20
        });
        $('.depth').css({
          height : newHeight - 10,
          width  : 25
        });
        flipbook.turn('size', newOuterWidth, newHeight);
      }
    });

    $('.js-zoom-in').on('click', function() {
      if (zoomWrap.width() < baseOuterWidth * 2.7) {
        var newWidth = zoomWrap.width() + baseOuterWidth * 0.5;
        var newHeight = zoomWrap.height() + baseOuterHeight * 0.5;
        zoomWrap.css({ width : newWidth })
        flipbook.turn('size', newWidth, newHeight);
      }
    });
    $('.js-zoom-out').on('click', function() {
      if (zoomWrap.width() > baseOuterWidth) {
        var newWidth = zoomWrap.width() - baseOuterWidth * 0.5;
        var newHeight = zoomWrap.height() - baseOuterHeight * 0.5;
        zoomWrap.css({ width : newWidth })
        flipbook.turn('size', newWidth, newHeight);
      }
    });
    $(document).on('keyup', function(e) {
      if (e.which === 39) {
        flipbook.turn('next');
      } else if (e.which === 37) {
        flipbook.turn('previous');
      }
    });
    $('.js-fullscreen').on('click', function() {
      req = zoomWrap[0].requestFullScreen || zoomWrap[0].webkitRequestFullScreen || zoomWrap[0].mozRequestFullScreen;

      currentOuterWidth = zoomWrap.width();
      currentOuterHeight = zoomWrap.height();

      var newHeight = screen.height;
      var outerRatio = screen.height / currentOuterHeight;
      var newOuterWidth = (currentOuterWidth) * outerRatio;
      var innerRatio = screen.height / baseInnerHeight;
      var newInnerWidth = baseInnerWidth * innerRatio;
      var newInnerHeight = baseInnerHeight * innerRatio;
      $('.own-size').css({
        width  : newInnerWidth / 2 - 20,
        height : newInnerHeight - 20
      });
      $('.depth').css({
        height : newHeight - 10,
        width  : 25
      });
      zoomWrap.css({ width: newOuterWidth });
      flipbook.turn('size', newOuterWidth, newHeight);

      req.call(zoomWrap[0]);
    });

    onFullscreenChangeHandler = function() {
      if (isFullScreen) {
        zoomWrap.css({ width : currentOuterWidth });
        $('.own-size').css({
          width  : baseInnerWidth,
          height : baseInnerHeight * 2
        });
        $('.depth').css({
          height : 604,
          width  : 16
        })
        flipbook.turn('size', currentOuterWidth, currentOuterHeight);
        isFullScreen = false;
      } else {
        isFullScreen = true;
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChangeHandler);
    document.addEventListener('webkitfullscreenchange', onFullscreenChangeHandler);
    document.addEventListener('mozfullscreenchange', onFullscreenChangeHandler);
    document.addEventListener('MSFullscreenChange', onFullscreenChangeHandler);

    onSignIn = function(googleUser) {
      var profile = googleUser.getBasicProfile();
      $('.js-google-signin').append('<img class="google-signed-in-image" src="' + profile.getImageUrl() + '" />')
      $('.js-google-signin-button').addClass('is-hidden');
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    }

    $('.js-draw').on('click', function() {
      flipbook.turn('disable', true);
      $('#js-left-canvas').removeClass('is-hidden');
      $('#js-right-canvas').removeClass('is-hidden');
      $('.js-flip').removeClass('is-hidden');
      $('.js-draw').addClass('is-hidden');
    });

    $('.js-flip').on('click', function() {
      flipbook.turn('disable', false);
      $('#js-left-canvas').addClass('is-hidden');
      $('#js-right-canvas').addClass('is-hidden');
      $('.js-flip').addClass('is-hidden');
      $('.js-draw').removeClass('is-hidden');
    });

    $('.js-go-to-page').on('click', function(e) {
      var page = $(e.currentTarget).data('page');
      flipbook.turn('page', page);
    })

    saveLeft = function() {
      var canvas = document.getElementById("js-left-canvas");
      canvas.toBlob(function(blob) {
        saveAs(blob, "lol.png");
      });
    }

    saveRight = function() {
      var canvas = document.getElementById("js-right-canvas");
      canvas.toBlob(function(blob) {
        saveAs(blob, "pretty image.png");
      });
    }

    $('.js-toggle-sidebar').on('click', function() {
      $('.yearbook-index-sidebar').toggleClass('open');
    });
  }
}