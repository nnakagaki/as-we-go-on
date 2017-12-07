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

    updateDepth = function (book, newPage) {
      var page = book.turn('page'),
        pages = book.turn('pages'),
        depthWidth,
        gutter;

      if (isFullScreen) {
        depthWidth = 25 * Math.min(1, page * 2 / pages);
        gutter = 30;
      } else {
        depthWidth = 16 * Math.min(1, page * 2 / pages);
        gutter = 20;
      }

      newPage = newPage || page;

      if (newPage > 3) {
        $('.front-side .depth').css({
          width: depthWidth,
          left: gutter - depthWidth
        });
      } else {
        $('.front-side .depth').css({ width: 0 });
        if (isFullScreen) {
          depthWidth = 16 * Math.min(1, (pages - page) * 2 / pages);
        } else {
          depthWidth = 25 * Math.min(1, (pages - page) * 2 / pages);
        }
      }


      if (newPage < pages - 3) {
        $('.back-side .depth').css({
          width: depthWidth,
          right: gutter - depthWidth
        });
      } else {
        $('.back-side .depth').css({ width: 0 });
      }
    }

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
          updateDepth(book, page);
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
          height : newHeight - 10
        });
        flipbook.turn('size', newOuterWidth, newHeight);
      }

      if (noDoodleMode || isFullScreen) {
        $("[id^=js-canvas-page-]").addClass('is-hidden');
      } else {
        $("[id^=js-canvas-page-]").removeClass('is-hidden');
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
      } else if (e.which === 68) {
        if (inDrawMode) {
          exitDrawMode();
        } else {
          enterDrawMode();
        }
      } else if (e.which === 72) {
        if (noDoodleMode) {
          showDoodles();
        } else {
          hideDoodles();
        }
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
        height : newHeight - 10
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
          height : 604
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
      $('.js-google-signin').append('<img class="js-google-name-tooltip google-signed-in-image" data-tooltip-position="bottom right" data-tooltip="' + profile.getName() + '" src="' + profile.getImageUrl() + '" />');
      $('.js-google-signin-button').addClass('is-hidden');
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
      _.forEach($('.js-google-name-tooltip'), function(el) {
        new Tooltip({
          target : el
        });
      });
      ws.send(JSON.stringify({ name : profile.getName(), profileImage : profile.getImageUrl() }));
      loggedIn = true;
      $('.js-draw').removeClass('is-disabled');
      doodleLoginTooltip.destroy();
    }

    enterDrawMode = function() {
      if (loggedIn) {
        flipbook.turn('disable', true);
        $('#js-left-canvas').removeClass('is-hidden');
        $('#js-right-canvas').removeClass('is-hidden');
        $('.js-flip').removeClass('is-hidden');
        $('.js-draw').addClass('is-hidden');
        inDrawMode = true;
      }
    }

    exitDrawMode = function() {
      flipbook.turn('disable', false);
      $('#js-left-canvas').addClass('is-hidden');
      $('#js-right-canvas').addClass('is-hidden');
      $('.js-flip').addClass('is-hidden');
      $('.js-draw').removeClass('is-hidden');
      inDrawMode = false;
    }

    $('.js-draw').on('click', enterDrawMode);
    $('.js-flip').on('click', exitDrawMode);

    $('.js-go-to-page').on('click', function(e) {
      var page = $(e.currentTarget).data('page');
      flipbook.turn('page', page);
    });

    $('.js-toggle-sidebar').on('click', function() {
      $('.yearbook-index-sidebar').toggleClass('open');
    });

    hideDoodles = function() {
      $('.js-hide-doodle').addClass('is-hidden');
      $('.js-show-doodle').removeClass('is-hidden');
      exitDrawMode();
      $("[id^=js-canvas-page-]").addClass('is-hidden');
      noDoodleMode = true;
    };

    showDoodles = function() {
      $('.js-hide-doodle').removeClass('is-hidden');
      $('.js-show-doodle').addClass('is-hidden');
      $("[id^=js-canvas-page-]").removeClass('is-hidden');
      noDoodleMode = false;
    };

    $('.js-hide-doodle').on('click', hideDoodles);
    $('.js-show-doodle').on('click', showDoodles);
  }
}