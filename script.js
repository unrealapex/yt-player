
// definitions
var url;
var videoId;
var embedURL;

function getVideoURL() {
  // gets our url and remove any whitespaces the user may have added
  url = prompt("Insert the URL of the video you want to watch").replace(/\s/g, "");
  validateURL(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validateURL(url) {
  // checks if link given is from youtube.com 
  if (url.includes("youtube.com/watch?v=") || url.includes("youtu.be/") && url.length >= 20) {
    getId(url);
  }
  else {
    alert("Please enter a valid URL");
    reset();
  }
}

// strips the video id from our url 
function getId(url) {
  // the video id is 11 characters long and is always at the end of the URL so we the the substring from the length minus 11
  videoId = url.substr(url.length - 11, 11)
  loadVideo(videoId);
  return videoId;
}



function loadVideo(videoId) {
  embedURL = `https://www.youtube.com/embed/${videoId}`;
  document.getElementById("videoPlayer").src = embedURL;
  alert("Loading video...");
}

var player = document.getElementById("videoPlayer");

// FIXME: Fix full screen not loading

// function openFullscreen() {
// var doc = window.document;
//   var docEl = doc.documentElement.getElementById("videoPlayer");

//   var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
//   var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

//   if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
//     requestFullScreen.call(docEl);
//   }
//   else {
//     cancelFullScreen.call(doc);
//   }
// }


// Temporary fix for full screen not working
// var fullScreen = false;
// function openFullscreen() {
//   if (fullScreen == false) {
//   document.getElementById("videoPlayer").width = "100%";
//   document.getElementById("videoPlayer").height = "100%";
//   fullScreen = true;
//   }
//   else {
//     document.getElementById("videoPlayer").width = "75%";
//     document.getElementById("videoPlayer").height = "75%";
//   }
// }

function reset() {
  url = "";
  document.getElementById("videoPlayer").src = "";
}



// function shareVideo(videoId) {
//   if (true) {
//     navigator.clipboard.writeText("https://youtu.be/" + videoId);
//     alert("Copied to Clipboard!");
//   }
//   else {
//     alert("Unable to copy to clipboard");
//   }

// }