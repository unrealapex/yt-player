// globals
var url;
var videoId;
var isLoaded = false;
var privateMode = false;
// const inputField = document.querySelector('#input-field');
// const expand = document.querySelector("#expand");
// const overlay = document.querySelector("#overlay");
// regular expressions used in the program, I highly suggest using regex101.com for a detailed explaination of the expression's inner workings
// gets the video id from the url inputted by the user
const videoIdExtractor = /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
// checks if the url is a valid youtube url and is something our player can play
const urlValidator = /((http?(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;
// expression to test if there are any whitespaces in our url
const whiteSpaceRE = /\s/g;

function getVideoURL() {
  // gets our url from the input field
  url = document.querySelector("#input-field").value;
  // alert("executed got video url");
  let hasWhiteSpace = whiteSpaceRE.test(url);
  url = (hasWhiteSpace ? url.replace(/\s/g, "") : url);
  getId(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists


function validate() {
  // checks if url given is valid
  if (document.querySelector("#input-field").value.length === 0) {
    clearNotification();
    document.querySelector("#input-field").className = "";
    document.querySelector("#play").style.color = "#1a1a1a";
    document.querySelector("#play").className = "";
    document.querySelector("#play").disabled = true;
  } else if (urlValidator.test(document.querySelector("#input-field").value)) {
    clearNotification();
    document.querySelector("#input-field").className = "correct";
    document.querySelector("#play").className = "valid";
    document.querySelector("#play").disabled = false;
    document.querySelector("#play").focus();
  } else {
    setNotification("enter a valid url", -1);
    document.querySelector("#input-field").className = "wrong";
    document.querySelector("#play").className = "";
    document.querySelector("#play").disabled = true;
    document.querySelector("#play").style.color = "#c6262e";
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
  document.querySelector("iframe").onload = function() {
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
    console.log("Error: unable to toggle full screen" + "\n" + "Reason: no URL found");
    alert(
      "We are unable to toggle full screen if a video hasn't been loaded" + "\n" + "Please enter a URL first"
    );
    // getVideoURL();
  }
}

function refresh() {
  // allows the user to reset the player if they entered an invalid url or ran into another problem
  url = "";
  document.querySelector("iframe").src = "";
  document.querySelector("#expand").disabled = true;
  document.querySelector("#expand").style.cursor = "default";
  document.querySelector("#input-field").className = "";
  document.querySelector("#play").className = "";
  document.querySelector("#play").style.color = "#1a1a1a";
  document.querySelector("#play").disabled = true;
  document.querySelector("#input-field").value = "";
  document.querySelector("#input-field").focus();
  document.querySelector("#private-mode").checked = false;
  clearNotification();
  isLoaded = false;
  return isLoaded;
}

// reloads video in video player
function reload() {
  loadVideo(videoIdExtractor.exec(document.querySelector("#url-input").value)[2]);
}

function shareVideo() {
  // copies shortened youtube url to the user's clipboard
  if (videoId !== undefined) {
    navigator.clipboard.writeText("https://youtu.be/" + videoId);
    alert("Link copied to clipboard");
  } else {
    console.log(
      "Error: unable to copy shortened URL to clipboard" + "\n" + "Reason: no URL found"
    );
    alert("You haven't entered a URL to share" + "\n" + "Play a video and try again");
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
    console.log("Error: unable to open video in new tab" + "\n" + "Reason: no URL found");
    alert(
      "We can't open video in new tab because you haven't entered a URL" + "\n" + "Play a video and try again"
    );
    getVideoURL();
  }
}


// remove this function if not in use
// Private Mode allows users to view videos on YT Player without them influening their YouTube and browsing experience.
// For example, I'm a cat person and I want cat ads when I browse the internet. Say if I watched a video titled "Top 10 Reasons Why You Should Buy A Dog"
// Next time I would go on the Verge (https://www.theverge.com/) I would be getting dog adverts.
// If I played the same video on YT Player with Private Mode on, I wouldn't get any dog ads nor would the video I watched be on my YouTube search history.
function togglePrivateMode() {
  // toggles icon state for Private Mode and tells loadVideo function if it should load in Private Mode
  if (!privateMode) {
    document.querySelector("#private-mode").style.opacity = "100%";
    document
      .querySelector("#private-mode")
      .setAttribute("title", "Toggle Private Mode, Private Mode is enabled.");
    privateMode = true;
  } else if (privateMode) {
    document.querySelector("#private-mode").style.opacity = "38%";
    document
      .querySelector("#private-mode")
      .setAttribute(
        "title",
        "Toggle Private Mode, Private Mode is off, toggling will enable Private Mode"
      );
    privateMode = false;
  } else {
    console.log("Unable to toggle private mode");
  }
  return privateMode;
}

// TODO: Delete this function if not in use
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
  document.querySelector("#expand").style.opacity = 0;
  document.querySelector("#overlay").style.display = "none";
  refresh();
}

function minimizeOverlay() {
  // Minimizes video overlay
  // TODO: Use hidden class to change visibility of expand button
  // document.querySelector("#input-field").focus();
  // document.querySelector("#input-field").select();
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
  document.querySelector("#notification").innerHTML = message;
  if (level === 0) {
    document.querySelector("#notification").className = "normal";
  } else if ((level === 1)) {
    document.querySelector("#notification").className = "correct";
  } else if ((level === -1)) {
    document.querySelector("#notification").className = "wrong";
  } else {
    console.error("Error setting notification");
  }

  if (duration > 0) {
    setTimeout(clearNotification, duration *= 1000);
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

// keyboard shortcuts
document.addEventListener("keydown", function(event) {
  if (event.key === "r" && document.querySelector("#overlay").style.display == "block") {
    reload();
  }  else if (event.key === "Escape" && document.fullscreenElement === null &&  document.querySelector("#overlay").style.display == "block") {
    document.querySelector("#overlay").style.display = "none";
  } else {

  }
});
