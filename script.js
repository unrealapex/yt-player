// video player object
var player = {
  // player URL
  url: "", 
  // player video id
  videoId: "",
  // player iframe
  iframe: document.querySelector("iframe"),
  // input where user enters YouTube url to play
  inputField: document.querySelector("#input-field"),
  // button to play YouTube video url entered
  playButton: document.querySelector("#play"),
  // overlay that video player iframe is shown
  overlay: document.querySelector("#overlay"),
  // button used to maximize minimized videos
  expandButton: document.querySelector("#expand"),
  // notification that shows errors and information
  notification: document.querySelector("#notification"),
  // loading text that displays when video is loading
  loader: document.querySelector(".loader"),
  // modal that shows all the availible shortcuts in the video player
  shortcutsModal: document.querySelector("#shortcuts-modal"),
  // stores boolean determining if video is loaded or not
  isLoaded: false,
  // isLoaded: (document.querySelector("iframe").readyState === "complete" ? true : false),
  // configs
  // determines if the video should be loaded with a YouTube privacy enhanced URL or a regular YouTube embed url
  privateMode: () => document.querySelector("#private-mode").checked,
  // determines if the video should be loaded in full screen when the user plays it
  loadInFullscreen: () => document.querySelector("#load-fullscreen").checked,
  // regex
  // checks if the url is a valid youtube url, is something our player can play, and gets the video id from strings
  urlManipulatorRE: /((http?(?:s)?:?\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?|(?:^(\w|-){11}$)|(?:\w|-){11}$/,
  // expression to test if there are any whitespaces in our url
  whiteSpaceRE: /\s/g
};

function getVideoURL() {
  // gets our url from the input field
  player.url = player.inputField.value;
  // alert("executed got video url");
  let hasWhiteSpace = player.whiteSpaceRE.test(player.url);
  player.url = (hasWhiteSpace ? player.url.replace(/\s/g, "") : player.url);
  getId(player.url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validate() {
  // checks if url given is valid
  if (player.inputField.value.length === 0) {
    clearNotification();
    player.inputField.className = "";
    player.playButton.style.color = "black";
    player.playButton.className = "";
    player.playButton.disabled = true;
  } else if (
    player.urlManipulatorRE.test(player.inputField.value)
  ) {
    clearNotification();
    player.inputField.className = "correct";
    player.playButton.className = "valid";
    player.playButton.disabled = false;
    player.playButton.focus();
  } else {
    setNotification("enter a valid url", -1);
    player.inputField.className = "wrong";
    player.playButton.className = "";
    player.playButton.disabled = true;
    player.playButton.style.color = "#c6262e";
  }
}

function getId(url) {
  // strips the video id from our url
  player.videoId = player.urlManipulatorRE.exec(player.url)[4];
  loadVideo(player.videoId);
}

function loadVideo(videoId) {
  player.isLoaded = true;
  player.overlay.style.display = "block";
  player.loader.classList.remove("hidden");
  if (player.privateMode()) {
    // sets the video player iframe's url to a youtube privacy-enhanced url(video doesn't show up on user's youtube search history) if the user has enabled Privacy Mode
    player.iframe.src =
      "https://www.youtube-nocookie.com/embed/" + player.videoId + "?dnt=1";
  } else {
    // sets the video player iframe's url to a youtube embed url (default)
    player.iframe.src =
      "https://www.youtube.com/embed/" + player.videoId;
  }

  if (player.loadInFullscreen()) {
    openFullscreen();
  } else {
  }
  // checks if the iframe content (our video) has loaded
player.iframe.onload = function () {
    player.iframe.focus();
  };
}

function openFullscreen() {
  // puts the player in full screen mode
  if (player.iframe.src.length !== 0 && player.isLoaded) {
    if (player.iframe.requestFullscreen) {
      player.iframe.requestFullscreen();
    } else if (player.iframe.webkitRequestFullscreen) {
      /* Safari */
      player.iframe.webkitRequestFullscreen();
    } else if (player.iframe.msRequestFullscreen) {
      /* IE11 */
      player.iframe.msRequestFullscreen();
    } else {
      alert("Unable to open video in full screen");
    }
  } else {
    console.log(
      "Error: unable to toggle full screen" + "\n" + "Reason: no URL found"
    );
    alert(
      "We are unable to toggle full screen if a video hasn't been loaded" +
        "\n" +
        "Please enter a URL first"
    );
  }
}

function refresh() {
  // allows the user to reset the player if they entered an invalid url or ran into another problem
  player.url = "";
  player.iframe.src = "";
  player.expandButton.disabled = true;
  player.expandButton.style.cursor = "default";
  player.inputField.className = "";
  player.playButton.className = "";
  player.playButton.style.color = "black";
  player.playButton.disabled = true;
  player.inputField.value = "";
  player.inputField.focus();
  document.querySelector("#private-mode").checked = false;
  clearNotification();
  player.isLoaded = false;
}

// reloads video in video player
function reload() {
  loadVideo(
    player.urlManipulatorRE.exec(player.inputField.value)[4]
  );
}

function shareVideo() {
  // copies shortened youtube url to the user's clipboard
  if (player.videoId !== undefined) {
    navigator.clipboard.writeText("https://youtu.be/" + player.videoId);
    alert("Link copied to clipboard");
  } else {
    console.log(
      "Error: unable to copy shortened URL to clipboard" +
        "\n" +
        "Reason: no URL found"
    );
    alert(
      "You haven't entered a URL to share" + "\n" + "Play a video and try again"
    );
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
  if (player.isLoaded) {
    // TODO: change to responsive size
    let w = 1000;
    let h = 900;
    let left = screen.width / 2 - w / 2;
    let top = screen.height / 2 - h / 2;
    window.open(
      "https://www.youtube.com/watch?v=" + player.videoId,
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
    console.log(
      "Error: unable to open video in new tab" + "\n" + "Reason: no URL found"
    );
    alert(
      "We can't open video in new tab because you haven't entered a URL" +
        "\n" +
        "Play a video and try again"
    );
    getVideoURL();
  }
}

// allows us to sleep for x seconds
function sleep(duration) {
  var currentTime = new Date().getTime();
  while (new Date().getTime() < currentTime + duration * 1000) {
    /* Do nothing */
  }
}

function closeOverlay() {
  // Closes the video overlay and clears its iframe src
  // TODO: Use hidden class to change visibility of expand button
  player.expandButton.style.opacity = 0;
  player.overlay.style.display = "none";
  refresh();
}

function minimizeOverlay() {
  // Minimizes video overlay
  // TODO: Use hidden class to change visibility of expand button
  // document.querySelector("#input-field").focus();
  // document.querySelector("#input-field").select();
  player.expandButton.style.opacity = "100%";
  player.overlay.style.display = "none";
  if (player.isLoaded) {
    player.expandButton.disabled = false;
    player.expandButton.style.cursor = "pointer";
    player.expandButton.focus();
  } else {
    player.expandButton.disabled = true;
    player.expandButton.style.cursor = "default";
    player.expandButton.blur();
  }
}

function setNotification(message, level = 0, duration = 0) {
  // sets notification, levels show different notification colors, duration determines how long notification appears on screen
  // level 0 is a normal message, level 1 is a "correct" message, and level -1 is an "error" message
  player.notification.innerHTML = message;
  if (level === 0) {
    player.notification.className = "normal";
  } else if (level === 1) {
    player.notification.className = "correct";
  } else if (level === -1) {
    player.notification.className = "wrong";
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
  player.notification.innerHTML = "";
  player.notification.className = "";
}

// keyboard shortcuts
document.addEventListener("keydown", function (event) {
  if (
    event.key === "r" &&
    player.overlay.style.display == "block"
  ) {
    reload();
  } else if (
    (event.key === "Escape" || event.key === "x") &&
    document.fullscreenElement === null &&
    player.overlay.style.display == "block"
  ) {
    player.overlay.style.display = "none";
    player.inputField.select();
  } else if (
    event.key === "f" &&
    document.fullscreenElement === null &&
    player.overlay.style.display == "block"
  ) {
    openFullscreen();
  } else if (
    (event.key === "m" || event.key === "_") &&
    player.overlay.style.display == "block"
  ) {
    minimizeOverlay();
  } else if (
    (event.key === "o" || event.key === "+") &&
    player.overlay.style.display == "none" &&
    player.iframe.src.length != 0
  ) {
    player.overlay.style.display = "block";
  } else if (event.key === "?") {
    if (
      player.shortcutsModal.style.display === "" ||
      player.shortcutsModal.style.display === "none"
    ) {
      player.shortcutsModal.style.display = "block";
    } else {
      player.shortcutsModal.style.display = "none";
    }
  } else {
  }
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == player.shortcutsModal) {
    player.shortcutsModal.style.display = "none";
  }
};

document.addEventListener("mouseover", function () {
  window.focus();
});

player.iframe.addEventListener("load", function () {
  player.loader.classList.add("hidden");
});
