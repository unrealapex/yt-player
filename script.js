var url;
var videoId;
var embedURL;
var modal = document.getElementById("modal");
var player = document.getElementById("videoPlayer");
const videoIdExtractor = /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
const urlValidator = /((https(?:s):\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;
const whiteSpaceValidator = /\s/g;

function getVideoURL() {
  // gets our url
  url = document.getElementById("url").value;
  let hasWhiteSpace = whiteSpaceValidator.test(url);
  if (hasWhiteSpace) {
    url.replace(/\s/g, "");
  }
  if (url) {
    validateURL(url);
  } else {
    refresh();
  }
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validateURL(url) {
  // checks if link given is from youtube.com using regex
  var isValidURL = urlValidator.test(url);
  if (!isValidURL && url.length != 0 && url != null) {
    alert("Invalid URL\nTry Again");
    refresh();
    // getVideoURL();
  }
  getId(url);
}

// strips the video id from our url
function getId(url) {
  videoId = videoIdExtractor.exec(url)[2];
  loadVideo(videoId);
  return videoId;
}

function loadVideo(videoId) {
  embedURL = `https://www.youtube.com/embed/${videoId}`;
  document.getElementById("videoPlayer").src = embedURL;
  modal.style.display = "block";
}

function openFullscreen() {
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
  document.getElementById("url").value = "";
  document.getElementById("videoPlayer").src = "";

}

function info() {
  alert("Welcome to YT-Player! To use YT-Player, click the play icon to play a video, the full screen icon to put the video in full screen, and the reload icon to reset the player if something went wrong.\n\nMade with love by UnrealApex\nThank you to all those who gave feedback and helped improve this project");
}

function help() {
  alert("Welcome to YT-Player! To use YT-Player, click the play icon to play a video, the full screen icon to put the video in full screen, and the reload icon to reset the player if something went wrong.");
}


// Get the modal
var modal = document.getElementById("modal");

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var x = document.getElementById("close");


// When the user clicks on the button, open the modal
/* btn.onclick = function() {
	if (player.src.length != 0) {
  	modal.style.display = "block";
    } else {
    	alert("Enter a url first");
      getVideoURL();
     
    }
}
*/

// When the user clicks on (x), close the modal

x.onclick = function() {
  modal.style.display = "none";
  desertVideo();
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    desertVideo();

  }
}


function desertVideo() {
  if (confirm("Are you sure you want to close the player?\nThe video will close if you do.\nPress OK to continue")) {
    modal.style.display = "none";
    refresh();
  } else {
    modal.style.display = "block";
  }


}
