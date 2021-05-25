var url;
var videoId;
var embedURL;

function getVideoURL() {
  url = prompt("Insert the URL of the video you want to watch");
  // TODO: add Vimeo support
  if (url.substr(0, 5) === "https") {
    videoId = url.substr(32, 11);
    loadVideo();
  } else if (url.substr(0, 4) === "http") {
    videoId = url.substr(31, 11);
    loadVideo();
  } else {
    alert("Please enter a valid URL");
    reset();
  }

}

// only works for youtube videos at the moment
function urlValidate(testURL) {
  testURL = null;
  if (testURL.substr(10, 11) != "youtube.com" || testURL.substr(9, 11) != "youtube.com") {
    alert("Please enter a valid URL");
  }
}


function loadVideo() {
  embedURL = (`https://www.youtube.com/embed/${videoId}`);
  document.getElementById("videoPlayer").src = embedURL;
  alert("Loading video...");
}

var player = document.getElementById("videoPlayer");

function openFullscreen() {
  if (player.requestFullscreen) {
    player.requestFullscreen();
  } else if (player.webkitRequestFullscreen) {
    player.webkitRequestFullscreen();
  } else if (player.msRequestFullscreen) {
    player.msRequestFullscreen();
  }
}


function reset() {
  url = "";
  document.getElementById("videoPlayer").src = "";
}
