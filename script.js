// globals
// player URL
var url = "";
// player video id
var videoId = "";
// player iframe
const iframe = document.querySelector("iframe");
// input where user enters YouTube url to play
const inputField = document.querySelector("#input-field");
// button to play YouTube video url entered
const playButton = document.querySelector("#play");
// overlay that video player iframe is shown
const overlay = document.querySelector("#overlay");
// button used to maximize minimized videos
// const expandButton = document.querySelector("#expand");
// notification that shows errors and information
const notification = document.querySelector("#notification");
// loading text that displays when video is loading
const loader = document.querySelector("#loader");
// modal that shows all the availible shortcuts in the video player
const shortcutsModal = document.querySelector("#shortcuts-modal");
// / url submission form
const form = document.querySelector("form");
const expandBox = document.querySelector("#expand-box");
const thumbnail = document.querySelector("#thumbnail");
// stores boolean determining if video is loaded or not
// var isLoaded = false;
var isLoaded = () => {
  return (iframe.readyState == "complete" || "interactive") ? true : false;
}
// configs
// determines if the video should be loaded with a YouTube privacy enhanced URL or a regular YouTube embed url
var privateMode = () => document.querySelector("#private-mode").checked;
// determines if the video should be loaded in full screen when the user plays it
var loadInFullscreen = () => document.querySelector("#load-fullscreen").checked;
// list of all shortcuts keys
const shortcutKeys = ["r", "Escape", "x", "f", "m", "_", "o", "+", "?"];

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
  // gets our url from the input field
  url = inputField.value;
  // checks if there is whitespace in the url, if there is, reassign the url to the string with the whitespace removed
  let hasWhiteSpace = whiteSpaceRE.test(url);
  url = hasWhiteSpace ? url.replace(/\s/g, "") : url;
  getId(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

// checks if url given is valid
function validate() {
  // if the input is blank
  if (inputField.value.length === 0) {
    clearNotification();
    inputField.className = "";
    playButton.style.color = "#1a1a1a";
    playButton.className = "";
    playButton.disabled = true;
    // if the url in the input is valid
  } else if (urlValidator.test(inputField.value)) {
    clearNotification();
    inputField.className = "correct";
    playButton.className = "valid";
    playButton.style.color = "#1a1a1a";
    playButton.disabled = false;
    // playButton.focus();
    // if the url in the input is invalid
  } else {
    setNotification("enter a valid url", -1);
    inputField.className = "wrong";
    playButton.className = "";
    playButton.disabled = true;
    playButton.style.color = "#c6262e";
  }
}

// gets youtube video id of given url
// takes parameter url(string)
function getId(url) {
  // strips the video id from our url
  videoId = videoIdExtractor.exec(url)[2];
  // let currentValues = [document.querySelector("#load-fullscreen").value, document.querySelector("#private-mode").value];

  // if (iframe.src.length !== 0 && url.includes(videoIdExtractor.exec(iframe.src)[2] && ((currentValues[0] == valuesAtLoad[0]) && (currentValues[1] == valuesAtLoad[1])))) {
  if (iframe.src.length !== 0 && url.includes(videoIdExtractor.exec(iframe.src)[2])) {
    expandBox.classList.add("hidden");
    overlay.style.display = "block";
  } else {
  loadVideo(videoId);
  }
  return videoId;
}

// loads the youtube video into the player iframe
// take parameter videoId(string)
function loadVideo(videoId) {
  // isLoaded = true;
  overlay.style.display = "block";
  expandBox.classList.add("hidden");
  loader.classList.remove("hidden");
  // var valuesAtLoad = [document.querySelector("#load-fullscreen").value, document.querySelector("#private-mode").value];
  // expandButton.disabled = true;
  if (privateMode()) {
    // sets the video player iframe's url to a youtube privacy-enhanced url(video doesn't show up on user's youtube search history) if the user has enabled Privacy Mode
    iframe.src = "https://www.youtube-nocookie.com/embed/" + videoId + "?dnt=1";
  } else {
    // sets the video player iframe's url to a youtube embed url (default)
    iframe.src = "https://www.youtube.com/embed/" + videoId;
  }

  if (loadInFullscreen()) {
    openFullscreen();
  } else {
  }
  // focus iframe when it has loaded
  iframe.onload = function () {
    iframe.focus();
  };
  // return valuesAtLoad;
}

// toggles fullscreen for the iframe
function openFullscreen() {
  // puts the player in full screen mode
  var player = iframe;
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
    console.log(
      "Error: unable to toggle full screen" + "\n" + "Reason: no URL found"
    );
    alert(
      "We are unable to toggle full screen if a video hasn't been loaded" +
        "\n" +
        "Please enter a URL first"
    );
    // getVideoURL();
  }
}

// resets numerous things for the player
function reset() {
  // allows the user to reset the player if they entered an invalid url or ran into another problem
  url = "";
  iframe.src = "";
  // expandButton.disabled = true;
  inputField.className = "";
  playButton.className = "";
  playButton.style.color = "#1a1a1a";
  playButton.disabled = true;
  inputField.value = "";
  inputField.focus();
  document.querySelector("#private-mode").checked = false;
  clearNotification();
  // isLoaded = false;
  // return isLoaded;
}

// copies a youtube share url onto user's clipboard
function shareVideo() {
  // copies shortened youtube url to the user's clipboard
  if (videoId !== undefined) {
    navigator.clipboard.writeText("https://youtu.be/" + videoId);
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

// opens youtube video in a window so the user can like, dislike a video, or subscribe to a youtube channel
function openVideoInNewTab() {
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

// TODO: Delete this function if not in use
// allows us to sleep for x seconds
// takes parameter duration(float)
function sleep(duration) {
  var currentTime = new Date().getTime();
  while (new Date().getTime() < currentTime + duration * 1000) {
    /* Do nothing */
  }
}

// closes player video overlay
function closeOverlay() {
  overlay.style.display = "none";
  expandBox.classList.add("hidden");
  thumbnail.src = "";
  reset();
}

// Minimizes video overlay
function minimizeOverlay() {
  // inputField.focus();
  // inputField.select();
  overlay.style.display = "none";
  if (isLoaded()) {
    expandBox.classList.remove("hidden");
    if (
      thumbnail.src !==
      "https://i.ytimg.com/vi/" + videoId + "/mqdefault.jpg"
    ) {
      thumbnail.src = "https://i.ytimg.com/vi/" + videoId + "/mqdefault.jpg";
    }
    // expandButton.disabled = false;
    // expandButton.focus();
  } else {
    expandBox.classList.add("hidden");
    thumbnail.src = "";

    // expandButton.disabled = true;
    // expandButton.blur();
  }
}

// sets notification, levels show different notification colors, duration determines how long notification appears on screen
// takes parameters message(string), level(integer), and duration(float)
function setNotification(message, level = 0, duration = 0) {
  // level 0 is a normal message, level 1 is a "correct" message, and level -1 is an "error" message
  notification.innerHTML = message;
  if (level === 0) {
    notification.className = "normal";
  } else if (level === 1) {
    notification.className = "correct";
  } else if (level === -1) {
    notification.className = "wrong";
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

// clears notification
function clearNotification() {
  notification.innerHTML = "";
  notification.className = "";
}

// keyboard shortcuts event listener
document.addEventListener("keydown", function (event) {
  for (let i in shortcutKeys) {
    if (event.key === shortcutKeys[i]) {
      event.preventDefault();
      break;
    }
  }
  if (event.key === "r" && overlay.style.display == "block") {
    loadVideo(videoId);
  } else if (
    (event.key === "Escape" || event.key === "x") &&
    document.fullscreenElement === null &&
    overlay.style.display == "block"
  ) {
    minimizeOverlay();
    inputField.select();
  } else if (
    event.key === "f" &&
    document.fullscreenElement === null &&
    overlay.style.display == "block"
  ) {
    openFullscreen();
  } else if (
    (event.key === "m" || event.key === "_") &&
    overlay.style.display == "block"
  ) {
    minimizeOverlay();
  } else if (
    (event.key === "o" || event.key === "+") &&
    overlay.style.display == "none" &&
    iframe.src.length != 0
  ) {
    overlay.style.display = "block";
  } else if (event.key === "?") {
    if (
      shortcutsModal.style.display === "" ||
      shortcutsModal.style.display === "none"
    ) {
      shortcutsModal.style.display = "block";
    } else {
      shortcutsModal.style.display = "none";
    }
  } else {
  }
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == shortcutsModal) {
    shortcutsModal.style.display = "none";
  }
};

// focus the window when the user is on it
// document.addEventListener("mouseover", function () {
//   window.focus();
// });

// hide the loader every time a video loads in the iframe
iframe.addEventListener("load", function () {
  loader.classList.add("hidden");
});

// event listener that listens for successful form submissions
// if the input field is submitted successfully, get the video url via the getVideoURL() function
document.querySelector("form").addEventListener("submit", function () {
  getVideoURL();
});

expandBox.addEventListener("click", function () {
  overlay.style.display = "block";
  // expandButton.disabled = "true";
  expandBox.classList.add("hidden");
  thumbnail.src = "";
});

// FIXME: fix focus handling
// document.addEventListener("blur", function () {
//   lastFocused = document.activeElement;
//   return lastFocused;
// })

// document.addEventListener("mouseover", function () {
//   lastFocused.focus();
// });

document.addEventListener("focusin", function () {
  window.focus();
});

inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    form.submit();
  }
});
