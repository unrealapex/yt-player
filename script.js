// definitions
var url;
var videoId;
var embedURL;

function getVideoURL() {
  // gets our url and remove any whitespaces the user may have added
  url = prompt("Insert the URL of the video you want to watch").replace(/\s/g,"");
  validateURL(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validateURL(url) {
  // checks if link given is from youtube.com
  if (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/") && url.length >= 20) {
    getId(url);
  } else {
    alert("Invalid URL\nTry Again");
    refresh();
    getVideoURL();
  }
}  

// strips the video id from our url
function getId(url) {
  // the video id is 11 characters long and is always at the end of the URL so we the the substring from the length minus 11
  videoId = url.substr(url.length - 11, 11);
  loadVideo(videoId);
  return videoId;
}

function loadVideo(videoId) {
  embedURL = `https://www.youtube.com/embed/${videoId}`;
  document.getElementById("videoPlayer").src = embedURL;
  alert("Loading video...");
  openFullscreen();
}

function openFullscreen() {
  var player = document.getElementById("videoPlayer");
  if (player.src.length != 0) {
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
    alert("Please enter a URL first");
    getVideoURL();
  }
}

function refresh() {
  url = "";
  document.getElementById("videoPlayer").src = "";
}

