var url;
var videoId;
var embedURL;

const videoIdExtractor = /(http(?: s) ?: \/\/(?:m.)?(?:www\.)?)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu\.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;;
const urlValidator = /((https(?:s):\/\/)?(www\.)?)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?&v=))((?:\w|-){11})((?:\&|\?)\S*)?/;
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
    var isValidURL = urlValidator.test(url);
    if (!isValidURL) {
        alert("Invalid URL\nTry Again");
        refresh();
        getVideoURL();
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

function info() {
    alert("Made with love by UnrealApex\nThank you to all those who gave feedback and helped improve this project");
}
