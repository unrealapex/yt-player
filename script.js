$(function() {
  // **TO DO LIST**
  // TODO: use overlay instead of modal for queue
  // FIXME: make current queue item automatically select the first item in queue a the video to be played
  // TODO: redesign queue layout and functioning
  // FIXME: fix queue number updating

  // globals
    // player URL
    var url = "";
    // player video id
    var videoId = "";
    // player iframe
    const $iframe = $("iframe");
    // input where user enters YouTube url to play
    const $inputField = $("#input-field");
    const $urlInput = $("#url-input");
    const $queueInput = $("#queue-input");
    const $urlRadio = $("#url-radio");
    const $queueRadio = $("#queue-radio");
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
    // parent div of options dropdown
    const $optionsDiv = $("#options-div");
    // button that toggles private mode
    const $privateModeButton = $("#private-mode");
    var queue = [];
    var queueNumber = 0;
    var toggleQueueDeleteWizard = false;
    // checks if the video is loaded or not
    var isLoaded = function () {
      return $iframe.readyState == "complete" || "interactive" ? true : false;
    };
    // determines if the video should be loaded with a YouTube privacy enhanced URL or a regular YouTube embed url
    var $privateMode = function () {
      return JSON.parse($("#private-mode").data("enabled"));
    };

    // regex
    // gets the youtube video id from strings
    const videoIdExtractor =
      /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
    // checks if the url is a valid youtube url and is something our player can play
    const urlValidator =
      /((http?(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;

    // expression to test if there are any whitespaces in our url
    const whiteSpaceRE = /\s/g;

  function getVideoURL() {
    // ternary operator which determines whether url should come from the main url bar or the queue
    url = $urlRadio.attr("checked")
      ? $urlInput.val()
      : queue[queueNumber];
    let hasWhiteSpace = whiteSpaceRE.test(url);
    url = hasWhiteSpace ? url.replace(/\s/g, "") : url;
    getId(url);
  }

  // TODO: add Vimeo support
  // TODO: add ability to play youtube playlists

  function validate() {
    // checks if url given is valid
    if ($urlInput.val().length === 0) {
      clearNotification();
      $urlInput.removeClass();
      $("#play").css("color",  "#1a1a1a");
      $("#play").removeClass();
      return false;
      // $("#play").prop("disabled", true);
    } else if (urlValidator.test($urlInput.val())) {
      clearNotification();
      $urlInput.addClass("correct");
      $("#play").addClass("valid");
      // $("#play").prop("disabled", false);
      $("#play").focus();
      return true;
    } else {
      setNotification("enter a valid url", -1);
      $urlInput.addClass("wrong");
      $("#play").removeClass();
      // $("#play").prop("disabled", true);
      $("#play").css("color",  "#c6262e");
      return false;
    }
  }

  function validateQueue() {
    // TODO: if input is blank, remove add queue button class
    // checks if url given is valid for queue
    if ($queueInput.val().length === 0) {
      clearNotification();
      $queueInput.removeClass();
      $("#add-queue").css("color", "#1a1a1a");
      $("#add-queue").removeClass();
      return false;
      // $("#play").prop("disabled", true);
    } else if (urlValidator.test($queueInput.val())) {
      clearNotification();
      $queueInput.addClass("correct");
      $("#add-queue").addClass("valid");
      $("#add-queue").prop("disabled", false);
      $("#add-queue").focus();
      return true;
    } else {
      setNotification("enter a valid url", -1);
      $queueInput.addClass("wrong");
      $("#add-queue").removeClass();
      $("#add-queue").prop("disabled", true);
      $("#add-queue").css("color",  "#c6262e");
      return false;
    }
  }

  function getId(url) {
    // strips the video id from our url
    videoId = videoIdExtractor.exec(url)[2];
    loadVideo(videoId);
    return videoId;
  }

  function loadVideo(videoId) {
    $overlay.show();
    if ($("#private-mode").prop("checked")) {
      // sets the video player iframe's url to a youtube privacy-enhanced url(video doesn't show up on user's youtube search history) if the user has enabled Privacy Mode
      $("#videoPlayer").attr("src",
        "https://www.youtube-nocookie.com/embed/" + videoId);
    } else {
      // sets the video player iframe's url to a youtube embed url (default)
      $("#videoPlayer").attr("src",
        "https://www.youtube.com/embed/" + videoId);
    }

    if ($("#load-fullscreen").prop("checked")) {
      openFullscreen();
    } else {
      return;
    }
    // checks if the iframe content (our video) has loaded
    $iframe.onload = function () {
      $("#videoPlayer").focus();
    };
  }

  function openFullscreen() {
    // puts the player in full screen mode
    var player = document.querySelector("iframe");
    if (player.attr("src").length !== 0 && isLoaded()) {
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
      console.log("Error: unable to toggle full screen\nReason: no URL found");
      alert(
        "We are unable to toggle full screen if a video hasn't been loaded\nPlease enter a URL first"
      );
    }
  }

  function refresh() {
    // allows the user to reset the player if they entered an invalid url or ran into another problem
    url = "";
    $iframe.attr("src", "");
    $("#expand").prop("disabled", true);
    $("#expand").css("cursor",  "default");
    $urlInput.removeClass();
    $("#play").removeClass();
    $("#play").css("color",  "#1a1a1a");
    // $("#play").prop("disabled", true);
    $urlInput.val();
    $urlInput.focus();
    $("#private-mode").prop("checked", false);
    clearNotification();
  }

  function shareVideo() {
    // copies shortened youtube url to the user's clipboard
    if (videoId !== undefined) {
      navigator.clipboard.writeText("https://youtu.be/" + videoId);
      alert("Link copied to clipboard");
    } else {
      console.log(
        "Error: unable to copy shortened URL to clipboard\nReason: no URL found"
      );
      alert("You haven't entered a URL to share\nPlay a video and try again");
      getVideoURL();
    }
  }

  function about() {
    alert(
      "yt player is a minimalistic video player for youtube videos(more support possibly in the near future). it was created by unrealapex with the aim of being able to watch youtube videos quickly with no interuptions. made with love by unrealapex.\nthank you to all those who helped improve this project!"
    );
  }

  function openVideoInNewTab() {
    // opens a window that takes the user to the video on the youtube site for the purpose of liking or disliking the video
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
      console.log("Error: unable to open video in new tab\nReason: no URL found");
      alert(
        "We can't open video in new tab because you haven't entered a URL\n Play a video and try again"
      );
      getVideoURL();
    }
  }

  // Private Mode allows users to view videos on YT Player without them influening their YouTube and browsing experience.
  // For example, I'm a cat person and I want cat ads when I browse the internet. Say if I watched a video titled "Top 10 Reasons Why You Should Buy A Dog"
  // Next time I would go on the Verge (https://www.theverge.com/) I would be getting dog adverts.
  // If I played the same video on YT Player with Private Mode on, I wouldn't get any dog ads nor would the video I watched be on my YouTube search history.

  function closeOverlay() {
    // Closes the video overlay and clears its iframe src
    // TODO: Use hidden class to change visibility of expand button
    $("#expand").prop("disabled", true);
    $overlay.hide();
    refresh();
  }

  function minimizeOverlay() {
    // Minimizes video overlay
    // TODO: Use hidden class to change visibility of expand button
    // $urlInput.focus();
    // $urlInput.select();
    $("#expand").prop("disabled", false);
    $overlay.hide();
    if (isLoaded()) {
      $("#expand").prop("disabled", false);
      $("#expand").focus();
    } else {
      $("#expand").prop("disabled", true);
      $("#expand").blur();
    }
  }

  function setNotification(message, level = 0) {
    // sets notification, different notification levels have different text colors, 0 being a normal message, 1 being a "correct" message, and -1 being an "error" message
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
  }

  function clearNotification() {
    // clears notification
    $notification.text("");
    $notification.removeClass();
  }

  function addQueue() {
    // adds video to queue and updates queue ui
    var linebreak = document.createElement("br");
    let queueValue = $queueInput.val();
    if (queueValue === "" || whiteSpaceRE.test(queueValue)) {
      $queueInput.focus();
      alert("You must write something!");
    } else {
      queue[queue.length] = $queueInput.val();
      $queueInput.val();
      $queueInput.focus();
      // $("#queue-list").appendChild(linebreak);
      // $("#queue-list").innerHTML +=
      //   queue.length + ". " + queueValue;
      $("#queue-count").text(`queue: ${
        queueNumber + 1
      } / ${queue.length}`);
      $(
        "#queue-counter-ui"
      ).text(`queue(${queue.length})`);
      $("#queue-counter-ui").attr("title",
        queue.length > 1
          ? `${queue.length} items in queue`
          : `${queue.length} item in queue`);
      $("#add-queue").removeClass();
      getThumbnail(queue.length - 1);
      $("#thumbnail-" + queueNumber)
        .addClass("current-video");

      if (
        !$("#thumbnail-" + queueNumber)
          .attr("title").includes("current video")
      ) {
        $(
          "#thumbnail-" + queueNumber
        ).attr("title", $("#thumbnail-0")
          .attr("title").replace(/^/, "current video" + "\n"));
      } else {
      }
    }

    return queue;
  }

  function deleteQueue() {
    // deletes queue
    if (queue.length != 0) {
      let confirmDelete = confirm("Are you sure you want to delete the queue?");
      if (confirmDelete) {
        queue = [];
        $("#queue-list").text("");
        $("#queue-count").text("queue: 0/0");
        $queueInput.val();
        $queueInput.focus();
        $("#queue-counter-ui").text("queue");
        $("#queue-counter-ui").attr("title", "");
        // delete this later

        while ($(".rectangle")[0]) {
          $("rectangle")[0]
            .parentNode.removeChild(
              $(".rectangle")[0]
            );
        }
        clearNotification();
        return queue;
      } else {
        confirm.log("Canceled queue delete");
      }
    } else {
      alert("No items in queue");
    }
  }

  function nextVideo() {
    // continues to the next video in the video queue if user isn't on the last video
    if (queueNumber + 1 !== queue.length) {
      queueNumber++;
      loadVideo(videoIdExtractor.exec(queue[queueNumber])[2]);
      $("#thumbnail-" + (queueNumber - 1))
        .removeClass("current-video");
      $("#thumbnail-" + queueNumber)
        .addClass("current-video");
      // removes "current video" from previous video thumbnail title and adds "current video" to current video thumbnail title
      $(
        "#thumbnail-" + (queueNumber - 1)
      ).attr("title", $("#thumbnail-" + queueNumber)
        .attr("title").replace("current video", ""));
      $(
        "#thumbnail-" + queueNumber
      ).attr("title", $("#thumbnail-" + queueNumber)
        .attr("title").replace(/^/, "current video" + "\n"));
      $("#queue-count").text(`queue: ${
        queueNumber + 1
      } / ${queue.length}`);
      return queueNumber;
    } else {
      alert("You are at the end of the queue");
    }
  }

  function previousVideo() {
    // goals to the previous video in the video queue if user isn't on the first video
    if (queueNumber !== 0) {
      queueNumber--;
      loadVideo(videoIdExtractor.exec(queue[queueNumber])[2]);
      $("#thumbnail-" + (queueNumber + 1))
        .removeClass("current-video");
      $("#thumbnail-" + queueNumber)
        .addClass("current-video");
      // removes "current video" from next video thumbnail title and adds "current video" to current video thumbnail title
      $(
        "#thumbnail-" + (queueNumber + 1)
      ).attr("title", $("#thumbnail-" + queueNumber)
        .attr("title").replace("current video", ""));
      $(
        "#thumbnail-" + queueNumber
      ).attr("title", $("#thumbnail-" + queueNumber)
        .attr("title").replace(/^/, "current video" + "\n"));
      $("#queue-count").text(`queue: ${
        queueNumber + 1
      } / ${queue.length}`);
      return queueNumber;
    } else {
      alert("You are at the start of the queue");
    }
  }

  function deleteQueueItem(index) {
    queue.splice(index, 1);
    // queueNumber--;
    // return queueNumber;
  }

  // function updateCurrentVideoIndicator() {

  // }

  // focuses input for queue when user opens details
  // $("details").on("toggle", function() {
  //   $queueInput.focus();
  // });

  // keyboard shortcuts
  $(document).on("keydown", function (event) {
    if (
      event.key === "r" &&
      $overlay.css("display") == "block"
    ) {
      loadVideo(videoId);
    } else if (
      (event.key === "Escape" || event.key === "x") &&
      document.fullscreenElement === null &&
      $overlay.css("display") == "block"
    ) {
      $overlay.hide();
      $urlInput.select();
    } else if (
      event.key === "f" &&
      document.fullscreenElement === null &&
      $overlay.css("display") == "block"
    ) {
      openFullscreen();
    } else if (
      (event.key === "m" || event.key === "_") &&
      $overlay.css("display") == "block"
    ) {
      minimizeOverlay();
    } else if (
      (event.key === "o" || event.key === "+") &&
      $overlay.css("display") == "none" &&
      $iframe.attr("src").length != 0
    ) {
      $overlay.show();
    } else if (
      (event.key === "<" || (event.key === "P" && event.shiftKey)) &&
      $overlay.css("display") == "block" &&
      queue.length !== 0
    ) {
      previousVideo();
    } else if (
      (event.key === ">" || (event.key === "N" && event.shiftKey)) &&
      $overlay.css("display") == "block" &&
      queue.length !== 0
    ) {
      nextVideo();
    } else {
    }
  });

  // // toggles queue ui elements based on if the queue play option is checked or not
  // $form).on("click", function () {
  //   if ($queueRadio.prop("checked")) {
  //     // $("#queue").removeClass("hidden");
  //     // $("details").open = true;
  //     $queueInput.focus();
  //     $("#queue-count").removeClass("hidden");
  //     $("#next-video").removeClass("hidden");
  //     $("#previous-video").removeClass("hidden");
  //     $("#queue-button").prop("disabled", false);
  //     $("#next-video").prop("disabled", false);
  //     $("#previous-video").prop("disabled", false);
  //   } else if ($urlRadio.prop("checked")) {
  //     // $("#queue").addClass("hidden");
  //     // $("details").open = false;
  //     $urlInput.focus();
  //     $("#queue-count").addClass("hidden");
  //     $("#next-video").addClass("hidden");
  //     $("#previous-video").addClass("hidden");
  //     $("#queue-button").prop("disabled", true);
  //     $("#next-video").prop("disabled", true);
  //     $("#previous-video").prop("disabled", true);
  //   } else {
  //   }
  // });

  // $form).on("click", function () {
  //   if ($queueRadio.prop("checked")) {
  //     document.querySel  ector("#queue-button").prop("disabled", false);
  //     $("#queue-div").removeClass("hidden");
  //     $queueInput.focus();
  //     $("#queue-count").removeClass("hidden");
  //     // $("#next-video").removeClass("hidden");
  //     // $("#previous-video").removeClass("hidden");
  //     $("#next-video").prop("disabled", false);
  //     $("#previous-video").prop("disabled", false);
  //   } else if ($urlRadio.prop("checked")) {
  //     $("#queue-button").prop("disabled", true);
  //     $("#queue-div").addClass("hidden");
  //     $urlInput.focus();
  //     $("#queue-count").addClass("hidden");
  //     // $("#next-video").addClass("hidden");
  //     // $("#previous-video").addClass("hidden");
  //     $("#next-video").prop("disabled", true);
  //     $("#previous-video").prop("disabled", true);
  //   } else {
  //   }
  // });

  // function getThumbnail(index) {
  //   var rectangle = document.createElement("div");
  //   rectangle.addClass("rectangle");
  //   rectangle.loading = "lazy";
  //   // with url parameter DO NOT USE
  //   // rectangle.css("backgroundImage = "url('https://i.ytimg.com/vi/" + videoIdExtractor.exec(url)[2] + "/mqdefault.jpg')";

  //   // maximum resolution thumbnail
  //   // rectangle.css("backgroundImage = "url('https://i.ytimg.com/vi/" + videoIdExtractor.exec(queue[index])[2] + "/maxresdefault.jpg')";
  //   // Default thumbnail
  //   rectangle.css("backgroundImage = "url('https://i.ytimg.com/vi/" + videoIdExtractor.exec(queue[index])[2] + "/mqdefault.jpg')";
  //   $("#queue-list").appendChild(rectangle);
  // }

  // retrieves the thumbnail image of youtube video url in queue
  function getThumbnail(index) {
    // create div as thumbnail wrapper
    var thumbnail = document.createElement("div");
    // create div that shows video number
    var thumbnailNumber = document.createElement("div");
    // create image which thumbnail will be loaded
    var thumbnailImage = document.createElement("img");
    var deleteQueueItemDiv = document.createElement("div");
    var x = document.createElement("div");
    thumbnail.addClass("thumbnail");
    thumbnailNumber.addClass("thumbnail-number");
    x.addClass("x");
    // give each thumbnail and its wrapper a numbered id of thumbnail-number
    thumbnail.id = "thumbnail-" + index;
    thumbnailImage.id = "thumbnail-image-" + index;
    thumbnailNumber.id = "thumbnail-number-" + index;
    deleteQueueItemDiv.id = "delete-queue-item-div-" + index;
    x.id = "x-" + index;
    deleteQueueItemDiv.css("position",  "relative");
    x.css("position",  "absolute");
    thumbnailImage.draggable = false;
    // TODO: Make sure that when videos are deleted, current video in player is changed
    $("#queue-list").appendChild(thumbnail);
    x.onclick = function () {
      if (toggleQueueDeleteWizard) {
        deleteQueueItem(index);
        $("#thumbnail-" + index).remove();
        $("#queue-counter-ui").text((queue.length > 0 ? `queue(${(queue.length)})` : "queue"));
        $("#queue-counter-ui").attr("title", queue.length > 1 ? `${queue.length} items in queue` : `${queue.length} item in queue`);
        // updateThumbnailNumbers();
        // alert("change number");
        // $("#x-" + index).remove();
        // for (let i = 0; i < $(".thumbnail-number").length; i++) {
        //   $("#thumbnail-number-" + i).text(i);
        // }
      } else {
      }
    };

    // thumbnailImage.loading = "lazy";
    thumbnail.attr("title", queue[index]);
    x.attr("title", "remove video from queue");
    // sets the thumbnail image's source to the url of the thumbnail image
    thumbnailImage.attr("src",
      "https://i.ytimg.com/vi/" +
      videoIdExtractor.exec(queue[index])[2] +
      "/mqdefault.jpg");
    // appends thumbnail image in thumbnail wrapper
    thumbnailNumber.text(index + 1);
    x.text("&times");
    deleteQueueItemDiv.appendChild(thumbnailImage);
    deleteQueueItemDiv.appendChild(x);
    thumbnail.appendChild(deleteQueueItemDiv);
    thumbnail.appendChild(thumbnailNumber);
    // appends thumbnail image and wrapper into queue list div
  }

  function showQueueItemRemovalButtons() {
    let removalButtons = $(".x");
    if (!toggleQueueDeleteWizard) {
      toggleQueueDeleteWizard = true;
      for (let i = 0; i < removalButtons.length; i++) {
        let s = removalButtons[i].style;
        s.show();
      }
      // for (let i = 0; i < document.getElementsByClass("x").length; i++) {
      //   $("x" + i).show();
      // }
      // $(".x").removeClass("hidden");
    } else {
      // $(".x").addClass("hidden");
      // document.querySelectorAll('.x').forEach(el => el.addClass('hidden'));
      toggleQueueDeleteWizard = false;
      for (let i = 0; i < removalButtons.length; i++) {
        let s = removalButtons[i].style;
        s.hide();
      }
    }
    return toggleQueueDeleteWizard;
  }

  // var modal = document.getElementById("queue-modal");

  // Get the button that opens the modal
  // var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  // var span = $(".close")[0];

  // When the user clicks the button, open the modal
  // btn.onclick = function() {
  //   modal.show();
  // }

  // When the user clicks on the close button (x), close the modal
  // $("#close").onclick = function () {
  //   $("#queue-modal").hide();
  // };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == $("#queue-modal")) {
      $("#queue-modal").hide();
    }
  };

  function updateThumbnailNumbers() {
    for (let i = 0; i < $(".thumbnail-number").length; i++) {
      $(".thumbnail-number")[i].text(i);
    }
  }

  // // when dragging the queue list, scroll(on the x axis); controls dragging behavior of queue list
  // document.on("DOMContentLoaded", function () {
  //   const ele = $("#queue-list");
  //   ele.css("cursor", "grab");

  //   let pos = { top: 0, left: 0, x: 0, y: 0 };

  //   const mouseDownHandler = function (e) {
  //     ele.css("cursor", "grabbing");
  //     ele.css("userSelect", "none");

  //     pos = {
  //       left: ele.scrollLeft,
  //       top: ele.scrollTop,
  //       // Get the current mouse position
  //       x: e.clientX,
  //       y: e.clientY
  //     };

  //     document.on("mousemove", mouseMoveHandler);
  //     document.on("mouseup", mouseUpHandler);
  //   };

  //   const mouseMoveHandler = function (e) {
  //     // How far the mouse has been moved
  //     const dx = e.clientX - pos.x;
  //     const dy = e.clientY - pos.y;

  //     // Scroll the element
  //     ele.scrollTop = pos.top - dy;
  //     ele.scrollLeft = pos.left - dx;
  //   };

  //   const mouseUpHandler = function () {
  //     ele.css("cursor",  "grab");
  //     ele.css("",emoveProperty("user-select"));

  //     document.off("mousemove", mouseMoveHandler);
  //     document.off("mouseup", mouseUpHandler);
  //   };

  //   // Attach the handler
  //   ele.on("mousedown", mouseDownHandler);
  // });



  // event listeners

  $playButton.on("click", function () {
    getVideoURL();
  });
  $urlInput.on("input", function () {
    validate();
  });

  $queueInput.on("input", function () {
    validateQueue();
  });
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

  // overlay next video button
  $("button:contains('skip-next')").on("click", function () {
    nextVideo();
  });

  // overlay previous video button
  $("button:contains('skip-previous')").on("click", function () {
    previousVideo();
  });

  $("#add-queue").on("click", function () {
    addQueue();
  });

  $("#delete-queue").on("click", function () {
    deleteQueue();
  });

  $("#delete-queue-items").on("click", function () {
    showQueueItemRemovalButtons();
  });

  $("#queue-button").on("click", function () {
    $("#queue-div").toggleClass("hidden");
    $("#queue-input").focus();
  });

  $("#").on("click", function () {});

  $("#").on("click", function () {});

  $("#").on("click", function () {});

  $("#").on("click", function () {});

  $("#").on("click", function () {});

  $("#").on("click", function () {});


});
