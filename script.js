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
  const $overlayNotification = $("#overlay-notification");
  // loading text that displays when video is loading
  const $loader = $("#loader");
  // explains how to use the player
  const $helpModal = $("#help-modal");
  // url submission form
  const $form = $("form");
  // parent for button and video thumbnail that appear when a video is minimized
  const $expandBox = $("#expand-box");
  const $thumbnail = $("#thumbnail");
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

      $overlay.addClass("private-mode-overlay");
      $overlayNotification.text("private mode enabled");
      $("#private-mode-context").text("turn private mode off");
    } else {
      // sets the video player iframe's url to a youtube embed url (default)
      $iframe.attr(
        "src",
        `https://www.youtube.com/embed/${videoId}?autoplay=1`
      );

      $overlay.removeClass("private-mode-overlay");
      $overlayNotification.text("");
      $("#private-mode-context").text("turn private mode on");
    }
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
    $overlay.removeClass("private-mode-overlay");
    $("#private-mode-context").text("turn private mode on");
    clearNotification();
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
    $expandBox.show();
    $thumbnail.attr(
      "src",
      $thumbnail.attr("src") !==
        `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
        ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
        : ""
    );
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
      if (e.key === "/" && $overlay.is(":hidden")) {
        $inputField.focus();
        // handle shift + enter
      } else if (e.key === "Enter" && !e.shiftKey && $overlay.is(":hidden")) {
        $form.submit();
      } else if (e.shiftKey && e.key === "Enter" && $overlay.is(":hidden")) {
        privateMode = true;
        $form.submit();
        return privateMode;
      } else if (e.key === "r" && $overlay.is(":visible")) {
        loadVideo(videoId);
      } else if (
        (e.key === "Escape") &&
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
      } else if ((e.key === "m") && $overlay.is(":visible")) {
        minimizeOverlay();
      } else if (
        (e.key === "o") &&
        $overlay.is(":hidden") &&
        $iframe.attr("src").length != 0
      ) {
        openOverlay();
        $playButton.blur();
      } else if (e.key === "?") {
        $helpModal.toggle();
      } else {
      }
      e.preventDefault();
    } else {
    }
  });

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (e) => {
    if (e.target.id == "help-modal") {
      $helpModal.hide();
    }
  };

  $iframe.on("load", function () {
    // hide the loader every time a video loads in the iframe
    $loader.hide();
    // focus iframe when video has loaded
    $iframe.focus();
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
    if (e.key === "Enter" && !e.shiftKey) {
      $form.submit();
    } else if (e.key === "Enter" && e.shiftKey) {
      privateMode = true;
      $form.submit();
      return privateMode;
    }
  });

  $(document).on("contextmenu", function (e) {
    if ($inputField.is(":focus")) {
      // prevent context menu from showing up when the input field is focused
      return true;
    } else {
      e.preventDefault();
    }

    // show different menu options based on whether the overlay is visible or not
    $menu.empty();
    if ($overlay.is(":visible")) {
      $menu.append(`
      <li id='reload-context' class="menu-item">reload video</li>
      <li id='private-mode-context' class="menu-item">turn private mode ${
        privateMode ? "off" : "on"
      }</li>
      <li id='open-video-context' class="menu-item">open video on youtube</li>
      <li id='enter-full-screen-context' class="menu-item">full screen</li>
      <li id='copy-url-context' class="menu-item">copy video url</li>
      <li id='copy-id-context' class="menu-item">copy video id</li>
      <li id='close-player-context' class="menu-item">close player</li>
      <li id='help-context' class="menu-item">help</li>
    `);
    } else {
      $menu.append(`
      <li id="play-context" class="menu-item">play video</li>
      <li id="private-context" class="menu-item">play video in private mode</li>
      <li id="clear-url-context" class="menu-item">clear url</li>
      <li id='help-context' class="menu-item">help</li>
    `);
    }

    $menu.toggle();
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
  });

  // context menu click handler
  $(document).on("click", function (e) {
    $menu.hide();
    switch (e.target.id) {
      case "play-context":
        validate();
        $inputField.focus();
        $playButton.click();
        break;
      case "clear-url-context":
        $inputField.val("");
        $inputField.focus();
        break;
      case "private-context":
        privateMode = privateMode ? false : true;
        validate();
        $inputField.focus();
        $playButton.click();
        break;
      case "private-mode-context":
        privateMode = privateMode ? false : true;
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
      case "help-context":
        $helpModal.show();
        break;
      default:
    }
  });

  // validate user input when they type or paste into the input field
  $inputField.on("input", function () {
    validate();
  });

  // submit the URL form when the user clicks on the play button
  $playButton.on("click", function (e) {
    // enable private mode if the user is holding shift when they click the play button
    if (e.shiftKey) {
      privateMode = true;
    } else {
    }
    $form.submit();
    return privateMode;
  });

  // change play button color when user holds shift on play button
  $(document).on("keydown", function (e) {
    if (e.key === "Shift" && $playButton.hasClass("valid")) {
      $playButton.addClass("private-mode-button");
      $playButton.removeClass("valid");
      // set play button tooltip to "play in private mode"
      $playButton.attr("aria-label", "play in private mode");
      $playButton.attr("data-balloon-visible", "");
    }
  });

  // revert to normal play button color when user releases shift
  $(document).on("keyup", function () {
    if ($playButton.hasClass("private-mode-button")) {
      $playButton.removeClass("private-mode-button");
      $playButton.addClass("valid");
      $playButton.attr("aria-label", "play video");
      $playButton.removeAttr("data-balloon-visible");
    }
  });

  $("#buttons-container").on("click", function (e) {
    switch (e.target.id) {
      case "close-button":
        closeOverlay();
        break;
      case "fullscreen-button":
        openFullscreen();
        break;
      case "minimize-button":
        minimizeOverlay();
        break;
      default:
    }
  });

  // validate when the page loads; browser might have a url saved in the input
  validate();
});
