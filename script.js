$(function () {
  // globals
  // player URL
  var url = "";
  // player video id
  var videoId = "";
  // player iframe
  const $iframe = $("iframe");
  // input where user enters YouTube url to play
  const $inputField = $("#input-field");
  // button to play YouTube video url entered
  const $playButton = $("#play");
  // overlay that video player iframe is shown
  const $overlay = $("#overlay");
  // notification that shows errors and information
  const $notification = $("#notification");
  // loading text that displays when video is loading
  const $loader = $("#loader");
  // modal that shows all the availible shortcuts in the video player
  const $shortcutsModal = $("#shortcuts-modal");
  // url submission form
  const $form = $("form");
  // parent for button and video thumbnail that appear when a video is minimized
  const $expandBox = $("#expand-box");
  const $thumbnail = $("#thumbnail");
  // parent div of options dropdown
  const $optionsDiv = $("#options-div");
  const $menu = $("#context-menu");
  var isLoaded = function () {
    return $iframe.readyState == "complete" || "interactive" ? true : false;
  };
  var privateMode = false;

  // regex
  // gets the youtube video id from strings
  // checks if the url is a valid youtube url and is something our player can play
  const urlDissector =
    /((http?(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|v\/|watch\?v=|watch\?(?:([^=]+)\=([^&]+))+&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;

  // expression to test if there are any whitespaces in our url
  const whiteSpaceRE = /\s/g;

  function getVideoURL() {
    // gets our url from the input field
    url = $inputField.val();
    // checks if there is whitespace in the url, if there is, reassign the url to the string with the whitespace removed
    let hasWhiteSpace = whiteSpaceRE.test(url);
    url = hasWhiteSpace ? url.replace(/\s/g, "") : url;
    getId(url);
  }

  // TODO: add ability to play youtube playlists

  // checks if url given is valid
  function validate() {
    // if the input field is blank
    if ($inputField.val().length === 0) {
      clearNotification();
      $inputField.removeClass();
      $playButton.removeClass();
      $playButton.css("color", "#1a1a1a");
      $playButton.prop("disabled", true);
      // if the url in the input field is valid
    } else if (urlDissector.test($inputField.val())) {
      clearNotification();
      $inputField.addClass("correct");
      $inputField.removeClass("wrong");
      $playButton.addClass("valid");
      $playButton.css("color", "#1a1a1a");
      $playButton.prop("disabled", false);
      // if the url in the input field is invalid
    } else {
      setNotification("enter a valid url", -1);
      $inputField.addClass("wrong");
      $inputField.removeClass("correct");
      $playButton.removeClass();
      $playButton.prop("disabled", true);
      $playButton.css("color", "#c6262e");
    }
  }

  // gets youtube video id of given url
  // takes parameter url(string)
  function getId(url) {
    // strips the video id from our url
    videoId = urlDissector.exec(url)[6];
    if (
      $iframe.attr("src") !== undefined &&
      $iframe.attr("src").includes(videoId)
    ) {
      $expandBox.hide();
      openOverlay();
      $playButton.blur();
      // $overlay.css("display", "block");
    } else {
      loadVideo(videoId);
    }
    return videoId;
  }

  // loads the youtube video into the player iframe
  // take parameter videoId(string)
  function loadVideo(videoId) {
    openOverlay();
    $playButton.blur();
    $expandBox.hide();
    $loader.show();
    if (privateMode) {
      // sets the video player iframe's url to a youtube privacy-enhanced url
      $iframe.attr(
        "src",
        `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&dnt=1`
      );

      $overlay.addClass('private-mode-overlay')
      $("#private-mode-context").text('turn private mode off')
    } else {
      // sets the video player iframe's url to a youtube embed url (default)
      $iframe.attr(
        "src",
        `https://www.youtube.com/embed/${videoId}?autoplay=1`
      );

      $overlay.removeClass('private-mode-overlay')
      $("#private-mode-context").text('turn private mode on')
    }

    // focus iframe when it has loaded
    $iframe.onload = function () {
      $iframe.focus();
    };
  }

  // toggles fullscreen for the iframe
  function openFullscreen() {
    // puts the player in full screen mode
    var player = document.querySelector("iframe");
    if (player.src.length !== 0 && isLoaded()) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.webkitRequestFullscreen) {
        /* Safari */
        player.webkitRequestFullscreen();
      } else if (player.msRequestFullscreen) {
        /* IE11 */
        player.msRequestFullscreen();
      } else {
        alert("Unable to open video in full screen");
      }
    } else {
      console.warn(
        "Error: unable to toggle full screen" + "\n" + "Reason: no URL found"
      );
      alert(
        "Unable to toggle full screen, video hasn't been loaded" +
          "\n" +
          "Please enter a URL first"
      );
    }
  }

  // resets player state
  function reset() {
    url = "";
    $iframe.attr("src", "");
    $inputField.removeClass();
    $playButton.removeClass();
    $playButton.css("color", "#1a1a1a");
    $playButton.prop("disabled", true);
    $inputField.val("");
    $inputField.focus();
    privateMode = false;
    $overlay.removeClass('private-mode-overlay')
    $("#private-mode-context").text("turn private mode on");
    clearNotification();
  }

  function about() {
    alert(
      "yt player is a minimalistic video player for youtube videos. it was created by unrealapex with the aim of being able to watch youtube videos quickly with no interuptions. made with love by unrealapex.\nthank you to all those who helped improve this project!"
    );
  }

  // opens youtube video in a window so the user can like, dislike a video, or subscribe to a youtube channel
  function openVideo() {
    if (isLoaded()) {
      // TODO: change to responsive size
      let w = 1000;
      let h = 900;
      let left = screen.width / 2 - w / 2;
      let top = screen.height / 2 - h / 2;
      window.open(
        "https://www.youtube.com/watch?v=" + videoId,
        document.title,
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
          w +
          ", height=" +
          h +
          ", top=" +
          top +
          ", left=" +
          left
      );
    } else {
      console.warn(
        "Error: unable to open video in new tab" + "\n" + "Reason: no URL found"
      );
      alert(
        "Unable to open video in new tab, no URL entered" +
          "\n" +
          "Play a video and try again"
      );
    }
  }

  // open overlay
  function openOverlay() {
    $overlay.show();
    $expandBox.hide();
  }

  // close overlay
  function closeOverlay() {
    $overlay.hide();
    $expandBox.hide();
    $thumbnail.attr("src", "");
    reset();
  }

  // Minimizes video overlay
  function minimizeOverlay() {
    $overlay.hide();
    if (isLoaded()) {
      $expandBox.show();
      if (
        $thumbnail.attr("src") !==
        `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
      ) {
        $thumbnail.attr(
          "src",
          `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
        );
      }
    } else {
      $expandBox.hide();
      $thumbnail.attr("src", "");
    }
  }

  // sets $notification, levels show different $notification colors, duration determines how long $notification appears on screen
  // takes parameters message(string), level(integer), and duration(float)
  function setNotification(message, level = 0, duration = 0) {
    // level 0 is a normal message, level 1 is a "correct" message, and level -1 is an "error" message
    $notification.text(message);
    if (level === 0) {
      $notification.addClass("normal");
    } else if (level === 1) {
      $notification.addClass("correct");
    } else if (level === -1) {
      $notification.addClass("wrong");
    } else {
      console.error("Error setting notification");
    }

    if (duration > 0) {
      setTimeout(clearNotification, (duration *= 1000));
    } else if (duration === 0) {
      console.log("No duration given for notification");
    } else {
      console.warn("Invalid notification duration given!");
    }
  }

  // clears notification
  function clearNotification() {
    $notification.text("");
    $notification.removeClass();
  }

  let idleMouseTimer;
  let forceMouseHide = false;
    $overlay.mousemove(function (ev) {
      if (!forceMouseHide) {
        $overlay.css("cursor", "");
        clearTimeout(idleMouseTimer);
        idleMouseTimer = setTimeout(function () {
          $overlay.css("cursor", "none");
          forceMouseHide = true;
          setTimeout(function () {
            forceMouseHide = false;
          }, 200);
        }, 2000);
      }
    });

  // keyboard shortcuts event listener
  $(document).on("keydown", function (e) {
    if (document.activeElement.id !== "input-field") {
      if (e.key === '/' && $overlay.is(":hidden")) {
        $inputField.focus();
      } else if (e.key === "r" && $overlay.is(":visible")) {
        loadVideo(videoId);
      } else if (
        (e.key === "Escape" || e.key === "x") &&
        document.fullscreenElement === null &&
        $overlay.is(":visible")
      ) {
        minimizeOverlay();
        $inputField.select();
      } else if (
        e.key === "f" &&
        document.fullscreenElement === null &&
        $overlay.is(":visible")
      ) {
        openFullscreen();
      } else if ((e.key === "m" || e.key === "_") && $overlay.is(":visible")) {
        minimizeOverlay();
      } else if (
        (e.key === "o" || e.key === "+") &&
        $overlay.is(":hidden") &&
        $iframe.attr("src").length != 0
      ) {
        openOverlay();
        $playButton.blur();
      } else if (e.key === "?") {
        if ($shortcutsModal.is(":hidden")) {
          $shortcutsModal.show();
        } else {
          $shortcutsModal.hide();
        }
      } else {
      }
      e.preventDefault();
    } else {
    }
  });

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (e) => {
    if (e.target == $shortcutsModal) {
      $shortcutsModal.hide();
    }
  };

  // hide the loader every time a video loads in the iframe
  $iframe.on("load", function () {
    $loader.hide();
  });

  // event listener that listens for successful form submissions
  // if the input field is submitted successfully, get the video url via the getVideoURL() function
  $("form").on("submit", function () {
    getVideoURL();
  });

  // show the overlay whe the user clicks on the video expand thumbnail
  $expandBox.on("click", function () {
    openOverlay();
    $playButton.blur();
    // expandButton.disabled = "true";
    $expandBox.hide();
    $thumbnail.attr("src", "");
  });

  // submit URL form when the user presses enter in the input field
  $inputField.on("keydown", function (e) {
    if (e.key === "Enter") {
      $form.submit();
    }
  });


$overlay.on("contextmenu", function(e) {
  e.preventDefault();
  $menu.toggle();
  // make sure that the context menu doesn't go off the screen
  // FIXME: handle bottom and right edges
  if (e.clientX + $menu.width() > $(window).width()) {
    $menu.css("left", e.clientX - $menu.width());
  } else {
    $menu.css("left", e.clientX);
  }
  if (e.clientY + $menu.height() > $(window).height()) {
    $menu.css("top", e.clientY - $menu.height());
  } else {
    $menu.css("top", e.clientY);
  }
})

  // context menu click handler
 $(document).on("click", function (e) {
    switch (e.target.id) {
      case "private-mode-context":
        privateMode = (privateMode ? false : true);
        loadVideo(videoId);
        break;
      case "reload-context":
        loadVideo(videoId);
        break;
      case "open-video-context":
        if (privateMode) {
          if (
            confirm(
              "Warning, this video is playing in private mode. If you open the video, it will show up as you viewing it and will not load if restricted mode is enabled for your YouTube account.\nDo you wish to still open the video?"
            )
          ) {
            openVideo();
          }
        } else {
          openVideo();
        }
        break;
      case "copy-url-context":
        navigator.clipboard.writeText($iframe.attr("src"));
        break;
      case "copy-id-context":
        navigator.clipboard.writeText(videoId);
        break;
      case "enter-full-screen-context":
        openFullscreen();
        break;
      case "close-player-context":
        closeOverlay();
        break;
      default:
        console.error("error: unknown button clicked in options dropdown");
    }
    $menu.hide();
  });

  // validate user input when they type or paste into the input field
  $inputField.on("input", function () {
    validate();
  });

  // select the input field when the user clicks on it
  $inputField.on("click", function () {
    $inputField.select();
  });

  // submit the URL form when the user clicks on the play button
  $playButton.on("click", function (e) {
    // enable private mode if the user is holding shift when they click the play button
    if (e.shiftKey) {
      privateMode = true;
    } else {}
    $form.submit();
    return privateMode;
  });


  // change play button color when user holds shift on play button
  $(document).on("keydown", function (e) {
    if (e.key === "Shift" && $playButton.is(":hover") && $playButton.hasClass('valid')) {
      $playButton.addClass("private-mode-button");
      $playButton.removeClass("valid");
      // set play button tooltip to "play in private mode"
      $playButton.attr("aria-label", "play in private mode")
    }
  })

  // revert to normal play button color when user releases shift
  $(document).on("keyup", function () {
    if ($playButton.hasClass("private-mode-button")) {
      $playButton.removeClass("private-mode-button");
      $playButton.addClass('valid');
      $playButton.attr("aria-label", "play video")
    }
  })


  // overlay close overlay button
  $("button:contains('close')").on("click", function () {
    closeOverlay();
  });

  // overlay fullscreen button
  $("button:contains('check_box_outline_blank')").on("click", function () {
    openFullscreen();
  });

  // overlay minimize video button
  $("button:contains('minimize')").on("click", function () {
    minimizeOverlay();
  });

  // close shortcuts modal button
  $("#close").on("click", function () {
    $shortcutsModal.hide();
  });

  // validate when the page loads; browser might have a url saved in the input
  validate();
});
