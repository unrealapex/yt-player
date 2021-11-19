// globals
var url;
var videoId;
var isLoaded = false;
var privateMode = false;
var queue = [];
var queueNumber = 0;
// TODO: find out why using these variables isn't working
// const urlInput = document.querySelector('#url-input');
// const expand = document.querySelector("#expand");
// const overlay = document.querySelector("#overlay");
// regular expressions used in the program, I highly suggest using regex101.com for a detailed explaination of the expression's inner workings
// gets the video id from the url inputted by the user
// extracts any YouTube video id found inside given string
const videoIdExtractor =
  /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
// FIXME: fix expression not catching mistakes in the url protocol or the url subdomain
// returns true if string tested is a YouTube video url, note: expression doesn't catch errors in the protocol or subdomain but video plays normally
const urlValidator =
  /((http?(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;
// returns true if string tested has whitespace in it
const whiteSpaceRE = /\s/g;

function getVideoURL() {
  // ternary operator which determines whether url should come from the main url bar or the queue
  url = document.querySelector("#url-radio").checked
    ? document.querySelector("input[type=url]").value
    : queue[queueNumber];
  url = whiteSpaceRE.test(url) ? url.replace(/\s/g, "") : url;
  getId(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validate() {
  // checks if url given is valid
  if (document.querySelector("input[type=url]").value.length === 0) {
    clearNotification();
    document
      .querySelector("input[type=url]")
      .classList.remove("correct", "wrong");
    document.querySelector("#play").classList.remove("valid", "wrong");
    document.querySelector("#add-queue").classList.remove("correct", "wrong");
    document.querySelector("#play").style.color = "#1a1a1a";
    return false;
    // document.querySelector("#play").disabled = true;
  } else if (
    urlValidator.test(document.querySelector("input[type=url]").value)
  ) {
    clearNotification();
    document.querySelector("input[type=url]").classList.add("correct");
    document.querySelector("input[type=url]").classList.remove("wrong");
    document.querySelector("#play").classList.add("valid");
    document.querySelector("#play").classList.remove("wrong");
    document.querySelector("#add-queue").classList.add("correct");
    document.querySelector("#add-queue").classList.remove("wrong");
    // document.querySelector("#play").disabled = false;
    if (document.querySelector("#url-radio").checked) {
     document.querySelector("#play").focus();
    } else {
     document.querySelector("#add-queue").focus();
    }
    return true;
  } else {
    setNotification("enter a valid url", -1);
    document.querySelector("input[type=url]").classList.add("wrong");
    document.querySelector("input[type=url]").classList.remove("correct");
    document.querySelector("#play").classList.add("wrong");
    document.querySelector("#play").classList.remove("valid");
    document.querySelector("#add-queue").classList.add("wrong");
    document.querySelector("#add-queue").classList.remove("correct");
    // document.querySelector("#play").disabled = true;
    document.querySelector("#play").style.color = "#c6262e";
    return false;
  }
}

function validateQueue() {
  // TODO: if input is blank, remove add queue button class
  // checks if url given is valid for queue
  if (document.querySelector("input[type=url]").value.length === 0) {
    clearNotification();
    document.querySelector("input[type=url]").className = "";
    document.querySelector("#add-queue").style.color = "#1a1a1a";
    document.querySelector("#add-queue").className = "";
    return false;
    // document.querySelector("#play").disabled = true;
  } else if (
    urlValidator.test(document.querySelector("input[type=url]").value)
  ) {
    clearNotification();
    document.querySelector("input[type=url]").className = "correct";
    document.querySelector("#add-queue").className = "valid";
    document.querySelector("#add-queue").disabled = false;
    document.querySelector("#add-queue").focus();
    return true;
  } else {
    setNotification("enter a valid url", -1);
    document.querySelector("input[type=url]").className = "wrong";
    document.querySelector("#add-queue").className = "";
    document.querySelector("#add-queue").disabled = true;
    document.querySelector("#add-queue").style.color = "#c6262e";
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
  isLoaded = true;
  document.querySelector("#overlay").style.display = "block";
  if (document.querySelector("#private-mode").checked) {
    // sets the video player iframe's url to a youtube privacy-enhanced url(video doesn't show up on user's youtube search history) if the user has enabled Privacy Mode
    document.querySelector("#videoPlayer").src =
      "https://www.youtube-nocookie.com/embed/" + videoId;
  } else {
    // sets the video player iframe's url to a youtube embed url (default)
    document.querySelector("#videoPlayer").src =
      "https://www.youtube.com/embed/" + videoId;
  }

  if (document.querySelector("#load-fullscreen").checked) {
    openFullscreen();
  } else {
    return;
  }
  // checks if the iframe content (our video) has loaded
  document.querySelector("iframe").onload = function () {
    document.querySelector("#videoPlayer").focus();
  };
}

function openFullscreen() {
  // puts the player in full screen mode
  var player = document.querySelector("#videoPlayer");
  if (player.src.length !== 0 && isLoaded) {
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
  document.querySelector("iframe").src = "";
  document.querySelector("#expand").disabled = true;
  document.querySelector("#expand").style.cursor = "default";
  document.querySelector("input[type=url]").className = "";
  document.querySelector("#play").className = "";
  document.querySelector("#play").style.color = "#1a1a1a";
  // document.querySelector("#play").disabled = true;
  document.querySelector("input[type=url]").value = "";
  document.querySelector("input[type=url]").focus();
  document.querySelector("#private-mode").checked = false;
  clearNotification();
  isLoaded = false;
  return isLoaded;
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
  if (isLoaded) {
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
  document.querySelector("#expand").style.opacity = 0;
  document.querySelector("#overlay").style.display = "none";
  refresh();
}

function minimizeOverlay() {
  // Minimizes video overlay
  // TODO: Use hidden class to change visibility of expand button
  // document.querySelector("input[type=url]").focus();
  // document.querySelector("input[type=url]").select();
  document.querySelector("#expand").style.opacity = "100%";
  document.querySelector("#overlay").style.display = "none";
  if (isLoaded) {
    document.querySelector("#expand").disabled = false;
    document.querySelector("#expand").style.cursor = "pointer";
    document.querySelector("#expand").focus();
  } else {
    document.querySelector("#expand").disabled = true;
    document.querySelector("#expand").style.cursor = "default";
    document.querySelector("#expand").blur();
  }
}

function setNotification(message, level = 0, duration = 0) {
  // sets notification, levels show different notification colors, duration determines how long notification appears on screen
  // level 0 is a normal message, level 1 is a "correct" message, and level -1 is an "error" message
  // 5 seconds is the recommended duration of notifications
  document.querySelector("#notification").innerHTML = message;
  if (level === 0) {
    document.querySelector("#notification").className = "normal";
  } else if (level === 1) {
    document.querySelector("#notification").className = "correct";
  } else if (level === -1) {
    document.querySelector("#notification").className = "wrong";
  } else {
    console.error("Error setting notification");
  }

  if (duration > 0) {
    setTimeout(clearNotification, (duration *= 1000));
  } else if (duration === 0) {
    console.log("No duration given for notification");
  } else {
    console.error("Invalid duration given!");
  }
}

function clearNotification() {
  // clears notification
  document.querySelector("#notification").innerHTML = "";
  document.querySelector("#notification").className = "";
}

function addQueue() {
  // adds video to queue and updates queue ui
  var linebreak = document.createElement("br");
  let queueItemWrapper = document.createElement("div");
  let queueValue = document.querySelector("input[type=url]").value;
  queueItemWrapper.classList.add("queue-item-wrapper");
  queueItemWrapper.id = "queue-item-wrapper-" + queue.length;
  queueItemWrapper.innerHTML = queue.length + 1 + ". " + queueValue;
  if (queueValue === "" || whiteSpaceRE.test(queueValue)) {
    document.querySelector("input[type=url]").focus();
    setNotification("You must enter a url to add to the queue", -1, 2);
  } else {
    queue[queue.length] = document.querySelector("input[type=url]").value;
    document.querySelector("input[type=url]").value = "";
    document.querySelector("input[type=url]").focus();
    document.querySelector("#queue-list").appendChild(queueItemWrapper);
    document.querySelector("#queue-count").innerHTML = `queue: ${
      queueNumber + 1
    } / ${queue.length}`;
    document.querySelector(
      "#queue-counter-ui"
    ).innerHTML = `queue(${queue.length})`;
    document.querySelector("#queue-counter-ui").title =
      queue.length > 1
        ? `${queue.length} items in queue`
        : `${queue.length} item in queue`;
    // document.querySelector("#add-queue").classList.remove("");
    document
      .querySelector("#queue-item-wrapper-" + queueNumber)
      .classList.add("current-video");
    setNotification("video added to queue", 1, 5);
  }

  return queue;
}

function deleteQueue() {
  // deletes queue
  if (queue.length != 0) {
    let confirmDelete = confirm("Are you sure you want to delete the queue?");
    if (confirmDelete) {
      queue = [];
      document.querySelector("#queue-list").innerHTML = "";
      document.querySelector("#queue-count").innerHTML = "queue: 0/0";
      document.querySelector("input[type=url]").value = "";
      document.querySelector("input[type=url]").focus();
      document.querySelector("#queue-counter-ui").innerHTML = "queue";
      document.querySelector("#queue-counter-ui").title = "";
      setNotification("queue deleted", 1, 5);
      return queue;
    } else {
      confirm.log("Canceled queue delete");
    }
  } else {
    setNotification("no items in queue", -1, 5);
  }
}

function nextVideo() {
  // continues to the next video in the video queue if user isn't on the last video
  if (queueNumber + 1 !== queue.length) {
    queueNumber++;
    loadVideo(videoIdExtractor.exec(queue[queueNumber])[2]);
    document.querySelector("#queue-count").innerHTML = `queue: ${
      queueNumber + 1
    } / ${queue.length}`;
    document
      .querySelector("#queue-item-wrapper-" + (queueNumber - 1))
      .classList.remove("current-video");
    document
      .querySelector("#queue-item-wrapper-" + queueNumber)
      .classList.add("current-video");
    document.querySelector("#queue-item-wrapper-" + queueNumber).scrollIntoView();
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
    document.querySelector("#queue-count").innerHTML = `queue: ${
      queueNumber + 1
    } / ${queue.length}`;
    document
      .querySelector("#queue-item-wrapper-" + (queueNumber + 1))
      .classList.remove("current-video");
    document
      .querySelector("#queue-item-wrapper-" + queueNumber)
      .classList.add("current-video");
    document.querySelector("#queue-item-wrapper-" + queueNumber).scrollIntoView();
    return queueNumber;
  } else {
    alert("You are at the start of the queue");
  }
}

// focuses input for queue when user opens details
// document.querySelector("details").addEventListener("toggle", function() {
//   document.querySelector("input[type=url]").focus();
// });

// keyboard shortcuts
document.addEventListener("keydown", function (event) {
  if (
    event.key === "r" &&
    document.querySelector("#overlay").style.display == "block"
  ) {
    // reload();
  } else if (
    (event.key === "Escape" || event.key === "x") &&
    document.fullscreenElement === null &&
    document.querySelector("#overlay").style.display == "block"
  ) {
    document.querySelector("#overlay").style.display = "none";
    document.querySelector("#input-field").select();
  } else if (
    event.key === "f" &&
    document.fullscreenElement === null &&
    document.querySelector("#overlay").style.display == "block"
  ) {
    openFullscreen();
  } else if (
    (event.key === "m" || event.key === "_") &&
    document.querySelector("#overlay").style.display == "block"
  ) {
    minimizeOverlay();
  } else if (
    (event.key === "o" || event.key === "+") &&
    document.querySelector("#overlay").style.display == "none" &&
    document.querySelector("iframe").src.length != 0
  ) {
    document.querySelector("#overlay").style.display = "block";
  } else if (
    (event.key === "<" || (event.key === "P" && event.shiftKey)) &&
    document.querySelector("#overlay").style.display == "block" &&
    queue.length !== 0
  ) {
    previousVideo();
  } else if (
    (event.key === ">" || (event.key === "N" && event.shiftKey)) &&
    document.querySelector("#overlay").style.display == "block" &&
    queue.length !== 0
  ) {
    nextVideo();
  } else {
  }
});

// toggles queue ui elements based on if the queue play option is checked or not
document.querySelector("form").addEventListener("click", function () {
  if (document.querySelector("#queue-radio").checked) {
    document.querySelector("#queue").classList.remove("hidden");
    document.querySelector("#add-queue").classList.remove("hidden");
    document.querySelector("#add-queue").classList.add("add-queue-queue");
    document.querySelector("#play").classList.add("play-queue");
    // document.querySelector("details").open = true;
    document.querySelector("#queue-count").classList.remove("hidden");
    document.querySelector("#next-video").classList.remove("hidden");
    document.querySelector("#previous-video").classList.remove("hidden");
    document.querySelector("#next-video").disabled = false;
    document.querySelector("#previous-video").disabled = false;
    document.querySelector("input[type=url]").placeholder =
      "add video to queue";
  } else if (document.querySelector("#url-radio").checked) {
    document.querySelector("#queue").classList.add("hidden");
    document.querySelector("#add-queue").classList.add("hidden");
    document.querySelector("#add-queue").classList.remove("add-queue-queue");
    document.querySelector("#play").classList.remove("play-queue");
    // document.querySelector("details").open = false;
    document.querySelector("#queue-count").classList.add("hidden");
    document.querySelector("#next-video").classList.add("hidden");
    document.querySelector("#previous-video").classList.add("hidden");
    document.querySelector("#next-video").disabled = true;
    document.querySelector("#previous-video").disabled = true;
    document.querySelector("input[type=url]").placeholder =
      "enter a youtube video url";
  } else {
  }
  document.querySelector("input[type=url]").focus();
});
