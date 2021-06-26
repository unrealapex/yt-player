var url;
var videoId;
var embedURL;

const videoIdExtractor = /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
const urlValidator = /((https(?:s)?:\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;
const whiteSpaceValidator = /\s/g;
function getVideoURL() {
    // gets our url
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
    }
    else { 
    getId(url);
    }
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

function shareVideo() {
    if (videoId != undefined) {
      navigator.clipboard.writeText("https://youtu.be/" + videoId);
      alert("Link copied to clipboard");
    } else {
      alert("Play a video before trying to share\nTry Again");
      getVideoURL();
    }
  }
  

function info() {
    alert("Welcome to YT-Player! To use YT-Player, click the play icon to play a video, the full screen icon to put the video in full screen, and the reload icon to reset the player if something went wrong.\n\nMade with love by UnrealApex\nThank you to all those who gave feedback and helped improve this project");
}
