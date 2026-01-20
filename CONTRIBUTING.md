# Contributing

### Code Structure

yt player's codebase is primarily written with jQuery.

The code structure of the project is as follows:

- `player and element variables` - player variables initiallized such as `url`,
  `videoId` DOM elements

---

- `helper functions`
  - `getVideoURL()` - value of URL inputted and passes it to `getId`
  - `validate()` - tests the URL inputted against `urlDissector` to see if it is
    a valid url
  - `getId()` - takes `url` and returns the video id, the id is then passed to
    `loadVideo()`
  - `loadVideo()` - takes `videoId` and opens `$overlay` and sets video player
    state
  - `openFullscreen()` - request iframe fullscreen
  - `reset()` - reset player to inital state
  - `openVideo()` - open video on youtube.com in popup window
  - `openOverlay` - open video overlay
  - `closeOverlay` - close video overlay
  - `minimizeOverlay()` - hide overlay and show thumbnail of video that can be
    clicked to reopen the overlay
  - `setNotification()` - send a player notification, takes `message`,
    (notification) `level`, and `duration` in seconds.
  - `clearNotification()` - clears any notifications that are displayed
- `event listeners`

---

- run `validate()` on page load in case the browser has stored a url in the
  input field

### Formatting and Commits

Formatting should be done with Prettier. Commits should be formatted with the
[conventional commits specification](https://www.conventionalcommits.org). **PRs
that do not meet these standards will be rejected.**
