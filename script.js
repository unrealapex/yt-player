var url;
var videoId;
var isLoaded = false;

// regular expressions used in the program, I highly suggest using regex101.com for a detailed explaination of the expression's inner workings 
// gets the video id from the url inputted by the user
const videoIdExtractor =
  /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
// checks if the url is a valid youtube url and is something our player can play
const urlValidator =
  /((https(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;
// expression to test if there are any whitspaces in our url
const whiteSpaceValidator = /\s/g;
function getVideoURL() {
  // gets our url from a prompt
  url = prompt("Insert the URL of the video you want to watch");
  var hasWhiteSpace = whiteSpaceValidator.test(url);
  if (hasWhiteSpace) {
    url.replace(/\s/g, "");
  }

  validateURL(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validateURL(url) {
  // checks if link given is from youtube.com using regex
  // TODO: add logic to check if url links to existing video
  var isValidURL = urlValidator.test(url);
  if (!isValidURL && url.length != 0 && url !== undefined) {
    alert("Invalid URL\nTry Again");
    refresh();
    getVideoURL();
  } else {
    getId(url);
  }
}


function getId(url) {
  // strips the video id from our url
  videoId = videoIdExtractor.exec(url)[2];
  loadVideo(videoId);
  return videoId;
}

function loadVideo(videoId) {
  // sets the video player iframe's url to a youtube privacy-enhanced url(video doesn't show up on user's youtube search history)
  document.getElementById("videoPlayer").src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  isLoaded = true;
}

function openFullscreen() {
  // puts the player in full screen mode
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
  // resets the player if the user entered an invalid url or ran into another problem
  url = "";
  document.getElementById("videoPlayer").src = "";
  isLoaded = false;
}

function shareVideo() {
  // copies shortened youtube url to the user's clipboard
  if (videoId != undefined) {
    navigator.clipboard.writeText("https://youtu.be/" + videoId);
    alert("Link copied to clipboard");
  } else {
    alert("Play a video before trying to share\nTry Again");
    getVideoURL();
  }
}

function info() {
  // help if the user is stuck or wants to get info
  alert(
    "Welcome to YT-Player! To use YT-Player, click the play icon to play a video, the full screen icon to put the video in full screen, and the reload icon to reset the player if something went wrong.\n\nMade with love by UnrealApex\nThank you to all those who gave feedback and helped improve this project"
  );
}


function openVideoInNewTab() {
  // opens a window that takes the user to the video on the youtube site for the purpose of liking or disliking the video
  if (isLoaded) {
    // TODO: change to responsive size
    let w = 1000;
    let h = 900;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    window.open("https://www.youtube.com/watch?v=" + videoId, document.title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left)
  } else {
    alert("Unable to open video in new tab\nEnter a url first");
    getVideoURL();
  }
}
