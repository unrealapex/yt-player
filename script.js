$(function() {
  // **TO DO LIST**
  // TODO: use more variables
  // TODO: use overlay instead of modal for queue
  // TODO: redesign queue layout and functioning

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
    // add video to queue button
    const $addQueue = $("#add-queue");
    // video expand button
    const $expand = $("#expand");
    // queue list item container
    const $queueList = $("#queue-list");
    // queue item delete x buttons
    const $x = $(".x");
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
    // const videoIdExtractor =
    //   /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
    // main regex we can use to disect parts of a youtube url
    const urlDissector  =
      /((http?(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;

    // expression to test if there are any whitespaces in our url
    const whiteSpaceRE = /\s/g;

  function getVideoURL() {
    // ternary operator which determines whether url should come from the main url bar or the queue
    // url = ($urlRadio.is(":checked")) ? $urlInput.val() : queue[queueNumber];
    if ($urlRadio.is(":checked")) {
      url = $urlInput.val();
    } else {
      url = queue[queueNumber];
    }
    let hasWhiteSpace = whiteSpaceRE.test(url);
    url = hasWhiteSpace ? url.replace(/\s/g, "") : url;
    getId(url);
    return url;
  }

  // TODO: add Vimeo support
  // TODO: add ability to play youtube playlists

  function validate() {
    // checks if url given is valid
    if ($urlInput.val().length === 0) {
      clearNotification();
      $urlInput.removeClass();
      $playButton.css("color",  "#1a1a1a");
      $playButton.removeClass();
      return false;
      // $playButton.prop("disabled", true);
    } else if (urlDissector.test($urlInput.val())) {
      clearNotification();
      $urlInput.addClass("correct");
      $playButton.addClass("valid");
      // $playButton.prop("disabled", false);
      $playButton.focus();
      return true;
    } else {
      setNotification("enter a valid url", -1);
      $urlInput.addClass("wrong");
      $playButton.removeClass();
      // $playButton.prop("disabled", true);
      $playButton.css("color",  "#c6262e");
      return false;
    }
  }

  function validateQueue() {
    // TODO: if input is blank, remove add queue button class
    // checks if url given is valid for queue
    if ($queueInput.val().length === 0) {
      clearNotification();
      $queueInput.removeClass();
      $addQueue.css("color", "#1a1a1a");
      $addQueue.removeClass();
      return false;
      // $playButton.prop("disabled", true);
    } else if (urlDissector.test($queueInput.val())) {
      clearNotification();
      $queueInput.addClass("correct");
      $addQueue.addClass("valid");
      $addQueue.prop("disabled", false);
      $addQueue.focus();
      return true;
    } else {
      setNotification("enter a valid url", -1);
      $queueInput.removeClass("correct");
      $queueInput.addClass("wrong");
      $addQueue.removeClass();
      $addQueue.prop("disabled", true);
      $addQueue.css("color", "#c6262e");
      return false;
    }
  }

  function getId(url) {
    // strips the video id from our url
    videoId = urlDissector.exec(url)[4];
    loadVideo(videoId);
    return videoId;
  }

  function loadVideo(videoId) {
    $overlay.show();
    if ($("#private-mode").is(":checked")) {
      // sets the video player iframe's url to a youtube privacy-enhanced url(video doesn't show up on user's youtube search history) if the user has enabled Privacy Mode
      $iframe.attr("src",
        "https://www.youtube-nocookie.com/embed/" + videoId);
    } else {
      // sets the video player iframe's url to a youtube embed url (default)
      $iframe.attr("src",
        "https://www.youtube.com/embed/" + videoId);
    }

    if ($("#load-fullscreen").is(":checked")) {
      openFullscreen();
    } else {
      return;
    }
    // checks if the iframe content (our video) has loaded
    $iframe.onload = function () {
      $iframe.focus();
    };
  }

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
    $expand.hide();
    $expand.css("cursor",  "default");
    $urlInput.removeClass();
    $playButton.removeClass();
    $playButton.css("color", "#1a1a1a");
    // $playButton.prop("disabled", true);
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
    $expand.hide();
    $overlay.hide();
    refresh();
  }

  function minimizeOverlay() {
    // Minimizes video overlay
    // TODO: Use hidden class to change visibility of expand button
    // $urlInput.focus();
    // $urlInput.select();
    $overlay.hide();
    if (isLoaded()) {
      $expand.show();
      $expand.focus();
    } else {
      $expand.hide();
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
    // var linebreak = document.createElement("br");
    let queueValue = $queueInput.val();
    if (queueValue === "" || whiteSpaceRE.test(queueValue)) {
      $queueInput.focus();
      alert("You must write something!");
    } else {
      queue[queue.length] = $queueInput.val();
      $queueInput.val("");
      $queueInput.focus();
      // $queueList.append(linebreak);
      // $queueList.innerHTML +=
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
      $addQueue.removeClass();
      getThumbnail(queue.length - 1);
      $(`.thumbnail:nth-of-type(${queueNumber + 1})`)
      // $("#thumbnail-" + queueNumber)
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
      updateThumbnailNumbers()
    }

    return queue;
  }

  function deleteQueue() {
    // deletes queue
    if (queue.length != 0) {
      if (confirm("Are you sure you want to delete the queue?")) {
        queue = [];
        $queueList.text("");
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
        console.log("Canceled queue delete");
      }
    } else {
      alert("No items in queue");
    }
  }

  function nextVideo() {
    // continues to the next video in the video queue if user isn't on the last video
    if (queueNumber + 1 !== queue.length) {
      queueNumber++;
      loadVideo(urlDissector.exec(queue[queueNumber])[4]);
      $(`.thumbnail:nth-of-type(${queueNumber- 2})`)
      // $("#thumbnail-" + (queueNumber - 1))
        .removeClass("current-video");
      $(`.thumbnail:nth-of-type(${queueNumber + 1})`)
      // $("#thumbnail-" + queueNumber)
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
      loadVideo(urlDissector.exec(queue[queueNumber])[4]);
      $(`.thumbnail:nth-of-type(${queueNumber + 2})`)
      // $("#thumbnail-" + (queueNumber + 1))
        .removeClass("current-video");
      $(`.thumbnail:nth-of-type(${queueNumber + 1})`)
      // $("#thumbnail-" + queueNumber)
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
  //   // rectangle.css("backgroundImage = "url('https://i.ytimg.com/vi/" + urlDissector.exec(url)[2] + "/mqdefault.jpg')";

  //   // maximum resolution thumbnail
  //   // rectangle.css("backgroundImage = "url('https://i.ytimg.com/vi/" + urlDissector.exec(queue[index])[2] + "/maxresdefault.jpg')";
  //   // Default thumbnail
  //   rectangle.css("backgroundImage = "url('https://i.ytimg.com/vi/" + urlDissector.exec(queue[index])[2] + "/mqdefault.jpg')";
  //   $queueList.append(rectangle);
  // }

  // retrieves the thumbnail image of youtube video url in queue
  function getThumbnail(index) {
    // create div as thumbnail wrapper
    // var thumbnail = document.createElement("div");
    let thumbnail = $(`
    <div id="thumbnail-${index}" class="thumbnail" title="${queue[index]}" data-url="${queue[index]}" data-thumbnail-position="${index}">
      <div id="delete-queue-item-div-${index}" style="position:relative;">
        <img id="thumbnail-image-${index}" src="https://i.ytimg.com/vi/${
      urlDissector.exec(queue[index])[4]}/mqdefault.jpg">
        <div id="x-${index}" class="x" data-index="${index}" title="remove video from queue" style="position:absolute;">
          &times;
        </div>
      </div>
      <div id="thumbnail-number-${index}" class="thumbnail-number">${index + 1}</div>
    </div>
    `);
    // create div that shows video number
    // var thumbnailNumber = document.createElement("div");
    // create image which thumbnail will be loaded
    // var thumbnailImage = document.createElement("img");
    // var deleteQueueItemDiv = document.createElement("div");
    // var x = document.createElement("div");
    // thumbnail.addClass("thumbnail");
    // thumbnailNumber.addClass("thumbnail-number");
    // x.addClass("x");
    // give each thumbnail and its wrapper a numbered id of thumbnail-number
    // thumbnail.id = "thumbnail-" + index;
    // thumbnailImage.id = "thumbnail-image-" + index;
    // thumbnailNumber.id = "thumbnail-number-" + index;
    // deleteQueueItemDiv.id = "delete-queue-item-div-" + index;
    // x.id = "x-" + index;
    // deleteQueueItemDiv.css("position",  "relative");
    // x.css("position", "absolute");
    // x.data("index", index);
    // thumbnailImage.attr("draggable", false);
    // TODO: Make sure that when videos are deleted, current video in player is changed

    // thumbnailImage.loading = "lazy";
    // thumbnail.attr("title", queue[index]);
    // x.attr("title", "remove video from queue");
    // sets the thumbnail image's source to the url of the thumbnail image
    // thumbnailImage.attr("src",
    //   "https://i.ytimg.com/vi/" +
    //   urlDissector.exec(queue[index])[2] +
    //   "/mqdefault.jpg");
    // appends thumbnail image in thumbnail wrapper
    // thumbnailNumber.text(index + 1);
    // x.text("&times");
    // deleteQueueItemDiv.append(thumbnailImage);
    // deleteQueueItemDiv.append(x);
    // thumbnail.append(deleteQueueItemDiv);
    // thumbnail.append(thumbnailNumber);
    // appends thumbnail image and wrapper into queue list div

    $queueList.append(thumbnail);

    $queueList.sortable({
      axis: "x",
      placeholder: "ui-state-highlight",
      containment: "parent",
      cursor: "move",
      helper: "clone",
      forcePlaceholderSize: true,
      tolerance: "pointer",
      update: function( event, ui ) {
        updateQueue();
        updateThumbnailNumbers();
        updateQueueUI();
      }
    });

    $x.on("click", function (event) {
      let index = $(event.target).data("index");
      if (toggleQueueDeleteWizard) {
        deleteQueueItem(index);
        $("#thumbnail-" + index).remove();
        $("#queue-counter-ui").text(($(".thumbnail").length > 0 ? `queue(${($(".thumbnail").length)})` : "queue"));
        $("#queue-counter-ui").attr("title", $(".thumbnail").length > 1 ? `${$(".thumbnail").length} items in queue` : `${$(".thumbnail").length} item in queue`);
         $("#queue-count").text(
           `queue: ${queueNumber + 1} / ${$(".thumbnail").length}`
         );
        updateThumbnailNumbers();
      } else {
      }
    });
  }

  function showQueueItemRemovalButtons() {
    if (!toggleQueueDeleteWizard) {
      toggleQueueDeleteWizard = true;
      $x.show();
    } else {
      toggleQueueDeleteWizard = false;
      $x.hide();
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

  function updateQueue() {
    $(".thumbnail").map(function(index) {
      queue[index] = $(this).data("url");
      }).get();
    return queue;
  }

  function updateQueueUI() {
    queueNumber = $(".current-video").data("thumbnail-position");
    $("#queue-count").text(`queue: ${
      queueNumber + 1
    } / ${queue.length}`);
    return queueNumber;
  }

  function updateThumbnailNumbers() {
    $(".thumbnail-number").each(function (index) {
      $(this).text(index + 1);
    });

    $(".thumbnail").each(function (index) {
      $(this).data("thumbnail-position", index);
    });
  }

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
  $("#next-video").on("click", function () {
    nextVideo();
  });

  // overlay previous video button
  $("#previous-video").on("click", function () {
    previousVideo();
  });

  $addQueue.on("click", function () {
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

  $expand.on("click", function () {
    $(this).hide();
    $overlay.show();
  });

});
