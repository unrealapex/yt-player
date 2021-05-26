// FIXME: Fix video not playing bug

// definitions
var url;
var videoId;
var embedURL;
var player;

function getVideoURL() {
  url = prompt("Insert the URL of the video you want to watch");
  validateURL(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

// only works for youtube videos at the moment
// fix case that user puts in url without protocol
function validateURL(url) {
  // checks if link given is from youtube.com
  if (url.includes("youtube.com") && url.length > 30) {
    getId(url);
  } 
  else {
    alert("Please enter a valid URL");
    reset();
  }
}

// https://www.youtube.com/watch?v=9No-FiEInLA

function getId(url) {
  videoId = url.substr(url.search("=") + 1, 11);
  loadVideo(videoId);
  
}

function loadVideo(videoId) {
  embedURL = `https://www.youtube.com/embed/${videoId}`;
  document.getElementById("videoPlayer").src = embedURL;
  alert("Loading video...");
}

player = document.getElementById("videoPlayer");

// FIXME: Fix full screen
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

// function copyToClipboard(embedURL) {
//   if (embedURL.length >= 10) {
//   navigator.clipboard.writeText(embedURL);
//   alert("Copied to Clipboard!");
//   }
//   else {
//     alert("Unable to copy to clipboard");
//   }
// }