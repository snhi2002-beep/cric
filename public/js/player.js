const video = document.getElementById("video");
const playBtn = document.getElementById("play");
const volume = document.getElementById("volume");
const fullscreenBtn = document.getElementById("fullscreen");
const buffering = document.getElementById("buffering");
const goLiveBtn = document.getElementById("goLive");
const qualitySelect = document.getElementById("quality");

// Retrieve stream URL passed from template data attribute
const streamURL = video.dataset.streamUrl;

let hls;

// Load Stream
if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = streamURL;
} else if (Hls.isSupported()) {
    hls = new Hls({
        liveSyncDurationCount: 3,
        maxBufferLength: 30
    });

    hls.loadSource(streamURL);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, function () {
        qualitySelect.innerHTML = '<option value="-1">Auto</option>';
        hls.levels.forEach((level, index) => {
            qualitySelect.innerHTML += `<option value="${index}">${level.height}p</option>`;
        });
    });

    qualitySelect.addEventListener("change", function () {
        hls.currentLevel = parseInt(this.value);
    });
}

// Play / Pause
playBtn.addEventListener("click", () => {
    if (video.paused) {
        video.play();
        playBtn.innerText = "⏸";
    } else {
        video.pause();
        playBtn.innerText = "▶";
    }
});

// Volume
volume.addEventListener("input", () => {
    video.volume = volume.value;
});

// Fullscreen
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        video.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Buffering Indicator
video.addEventListener("waiting", () => {
    buffering.style.display = "block";
});

video.addEventListener("playing", () => {
    buffering.style.display = "none";
});

// Go Live Button
goLiveBtn.addEventListener("click", () => {
    if (hls) {
        video.currentTime = video.duration;
    }
});

// Error Handling
video.addEventListener("error", () => {
    alert("Stream failed. Check URL or server.");
});
