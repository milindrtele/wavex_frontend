import React, { useRef, useState, useEffect, useMemo } from "react";
import VideoExport from "./videoExporter";

const VideoPreview = ({ clips, audioClips }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [readyToPlay, setReadyToPlay] = useState(false);
  const isAdvancingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // 🔢 Total video duration (memoized)
  const totalDuration = useMemo(() => {
    return clips.reduce((acc, clip) => {
      if (clip.startTime !== undefined && clip.endTime !== undefined) {
        return acc + (clip.endTime - clip.startTime);
      }
      return acc;
    }, 0);
  }, [clips]);

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentAudioIndex(0);
  }, [clips, audioClips]);

  useEffect(() => {
    setReadyToPlay(false);
  }, [currentIndex, currentAudioIndex]);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !audio) return;

    const currentClip = clips[currentIndex];
    const currentAudioClip = audioClips[currentAudioIndex];

    if (!currentClip || currentClip.startTime === undefined) return;

    const handleVideoLoadedMetadata = () => {
      video.currentTime = currentClip.startTime;
      play();
      setIsPlaying(true);
      isAdvancingRef.current = false;
    };

    const handleAudioLoadedMetadata = () => {
      audio.currentTime = currentAudioClip.startTime;
      play();
      setIsPlaying(true);
      isAdvancingRef.current = false;
    };

    const handleVideoTimeUpdate = () => {
      const elapsedInCurrentClip = video.currentTime - currentClip.startTime;

      // 🧠 Sum durations of previous clips
      const previousDuration = clips
        .slice(0, currentIndex)
        .reduce((acc, clip) => acc + (clip.endTime - clip.startTime), 0);

      const totalElapsed = previousDuration + elapsedInCurrentClip;
      const progressPercent = (totalElapsed / totalDuration) * 100;
      setProgress(progressPercent);

      if (video.currentTime >= currentClip.endTime && !isAdvancingRef.current) {
        isAdvancingRef.current = true;
        pause();
        setIsPlaying(false);

        setTimeout(() => {
          if (currentIndex + 1 < clips.length) {
            setCurrentIndex((i) => i + 1);
          } else {
            // 🔁 Restart from beginning
            setCurrentIndex(0);
            setCurrentAudioIndex(0);
            setProgress(0);

            // Seek manually to first clip’s startTime after a tiny delay to ensure video/audio reset
            setTimeout(() => {
              const firstClip = clips[0];
              const firstAudioClip = audioClips[0];
              if (
                videoRef.current &&
                audioRef.current &&
                firstClip &&
                firstAudioClip
              ) {
                videoRef.current.currentTime = firstClip.startTime;
                audioRef.current.currentTime = firstAudioClip.startTime;
                play();
                setIsPlaying(true);
                isAdvancingRef.current = false;
              }
            }, 100);
          }
        }, 100);
      }
    };

    const handleAudioTimeUpdate = () => {
      if (
        !isAdvancingRef.current &&
        audio.currentTime >= currentAudioClip.endTime
      ) {
        isAdvancingRef.current = true;
        pause();
        setIsPlaying(false);
        setTimeout(() => {
          setCurrentAudioIndex((i) => (i + 1 < audioClips.length ? i + 1 : i));
        }, 100);
      }
    };

    pause();
    setIsPlaying(false);

    video.removeEventListener("loadedmetadata", handleVideoLoadedMetadata);
    video.removeEventListener("timeupdate", handleVideoTimeUpdate);
    audio.removeEventListener("loadedmetadata", handleAudioLoadedMetadata);
    audio.removeEventListener("timeupdate", handleAudioTimeUpdate);

    video.addEventListener("loadedmetadata", handleVideoLoadedMetadata);
    video.addEventListener("timeupdate", handleVideoTimeUpdate);
    audio.addEventListener("loadedmetadata", handleAudioLoadedMetadata);
    audio.addEventListener("timeupdate", handleAudioTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", handleVideoLoadedMetadata);
      video.removeEventListener("timeupdate", handleVideoTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleAudioLoadedMetadata);
      audio.removeEventListener("timeupdate", handleAudioTimeUpdate);
    };
  }, [currentIndex, clips, currentAudioIndex, audioClips, totalDuration]);

  const play = () => {
    videoRef.current?.play();
    audioRef.current?.play();
  };

  const pause = () => {
    videoRef.current?.pause();
    audioRef.current?.pause();
  };

  const handlePlayPause = () => {
    if (!videoRef.current || !audioRef.current) return;

    if (isPlaying) {
      pause();
    } else {
      play();
    }

    setIsPlaying((prev) => !prev);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const formatted = [
      h > 0 ? h.toString().padStart(2, "0") : null,
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");

    return formatted;
  };

  const currentClip = clips[currentIndex];
  const currentAudioClip = audioClips[currentAudioIndex];

  return (
    <div className="flex-1 justify-items-center mt-8 top-10 right-0 p-5 pl-0">
      <h2 className="text-lg font-semibold mb-2">Video Preview</h2>

      {currentAudioClip ? (
        <audio
          ref={audioRef}
          src={currentAudioClip.src}
          controls
          autoPlay
          style={{ display: "none" }}
        />
      ) : (
        <p>No audio clip</p>
      )}

      {currentClip ? (
        <video ref={videoRef} src={currentClip.src} autoPlay width="800" />
      ) : (
        <p>No clip</p>
      )}

      {/* 🎯 Controls container */}
      <div className="mt-4 flex flex-col items-center justify-center space-y-3 w-full max-w-3xl mx-auto">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="w-full flex items-center space-x-2">
          <div className="flex-1 h-2 bg-gray-300 rounded relative">
            <div
              className="h-2 bg-blue-600 rounded absolute top-0 left-0 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm whitespace-nowrap">
            {formatTime(totalDuration)}
          </span>
        </div>
        <VideoExport clips={clips} audioClips={audioClips} />
      </div>
    </div>
  );
};

export default VideoPreview;
