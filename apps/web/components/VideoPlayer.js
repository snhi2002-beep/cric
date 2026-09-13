'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export default function VideoPlayer({ streamUrl }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        maxBufferLength: 30,
      });
      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    }

    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleQualityChange = (e) => {
    const index = parseInt(e.target.value, 10);
    setCurrentLevel(index);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
    }
  };

  const goLive = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = video.duration;
    }
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!document.fullscreenElement) {
      video.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/80">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-auto aspect-video bg-black object-contain block"
      />

      {/* Top Bar */}
      <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
        <span className="flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg shadow-red-600/50">
          <span className="h-2 w-2 rounded-full bg-white animate-ping" />
          LIVE
        </span>
        <button
          onClick={goLive}
          className="rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-gray-200 backdrop-blur-md border border-white/10 hover:bg-white/20 transition"
        >
          Go Live
        </button>
      </div>

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2 rounded-lg bg-black/80 px-4 py-2 text-sm font-medium text-white border border-white/10">
            <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Buffering...
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-center gap-3 z-20">
        <button
          onClick={togglePlay}
          className="rounded-lg bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-blue-500 cursor-pointer"
          />
        </div>

        {levels.length > 0 && (
          <select
            value={currentLevel}
            onChange={handleQualityChange}
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition cursor-pointer"
          >
            <option value="-1" className="bg-gray-900 text-white">Auto</option>
            {levels.map((lvl, idx) => (
              <option key={idx} value={idx} className="bg-gray-900 text-white">
                {lvl.height ? `${lvl.height}p` : `Level ${idx + 1}`}
              </option>
            ))}
          </select>
        )}

        <div className="flex-1" />

        <button
          onClick={toggleFullscreen}
          className="rounded-lg bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20 border border-white/10 transition"
          title="Fullscreen"
        >
          ⛶
        </button>
      </div>
    </div>
  );
}
