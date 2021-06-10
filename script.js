var url;
var videoId;
var embedURL;

const ytURLValidator = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/;
const ytURLidExtract = /http(?:s)?:\/\/(?:m.)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?(?:feature=youtu.be\&)?v=|v\/|embed\/|user\/(?:[\w#]+\/)+))([^&#?\n]+)/;
const whitespacesValidator = /\s/;

function getVideoURL() {
    // gets our url and removes any whitespaces the user may have added
    url = prompt("Insert the URL of the video you want to watch");

    // checks for whitespaces first, if true then removes
    // because it threw null error
    let hasWhitepaces = whitespacesValidator.test(url);
    if (hasWhitepaces) {
        url.replace(/\s/g, "");
    }

    validateURL(url);
}

// TODO: add Vimeo support
// TODO: add ability to play youtube playlists

function validateURL(url) {
    // checks if link given is from youtube.com
    // doing this with regex validation for
    // dynammic domains or other yt feature urls
    let isYtFormatMatch = ytURLValidator.test(url);

    if (!isYtFormatMatch) {
        alert("Invalid URL\nTry Again");
        refresh();
        getVideoURL();
    }

    getId(url);
}

// strips the video id from our url
function getId(url) {
    // check url and always get ytID
    let ytID = ytURLidExtract.exec(url)[1];

    // the video id is 11 characters long and is always at the end of the URL so we the the substring from the length minus 11
    // videoId = url.substr(url.length - 11, 11);

    loadVideo(ytID);

    return ytID;
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
