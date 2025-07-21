import React, { useRef, useState, useEffect } from "react";

const VideoPreview = ({ clips, audioClips }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [readyToPlay, setReadyToPlay] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    setCurrentAudioIndex(0);
  }, [clips, audioClips]);

  useEffect(() => {
    setReadyToPlay(false); // force waiting for loadedmetadata
  }, [currentIndex, currentAudioIndex]);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    const currentClip = clips[currentIndex];
    const currentAudioClip = audioClips[currentIndex];

    const handleVideoLoadedMetadata = () => {
      video.currentTime = currentClip.startTime;
      video.play();
    };

    const handleAudioLoadedMetadata = () => {
      audio.currentTime = currentAudioClip.startTime;
      audio.play();
    };

    const handleVideoTimeUpdate = () => {
      if (video.currentTime >= currentClip.endTime) {
        video.pause();
        setTimeout(() => {
          setCurrentIndex((i) => (i + 1 < clips.length ? i + 1 : i));
        }, 200);
      }
    };

    const handleAudioTimeUpdate = () => {
      if (audio.currentTime >= currentAudioClip.endTime) {
        audio.pause();
        setTimeout(() => {
          setCurrentAudioIndex((i) => (i + 1 < audioClips.length ? i + 1 : i));
        }, 200);
      }
    };

    video.addEventListener("loadedmetadata", handleVideoLoadedMetadata);
    video.addEventListener("timeupdate", handleVideoTimeUpdate);

    audio.addEventListener("loadedmetadata", handleAudioLoadedMetadata);
    audio.addEventListener("timeupdate", handleAudioTimeUpdate);

    return () => {
      // remove on cleanup:
      video.removeEventListener("loadedmetadata", handleVideoLoadedMetadata);
      video.removeEventListener("timeupdate", handleVideoTimeUpdate);

      audio.removeEventListener("loadedmetadata", handleAudioLoadedMetadata);
      audio.removeEventListener("timeupdate", handleAudioTimeUpdate);
    };
  }, [currentIndex, clips, currentAudioIndex, audioClips]);

  const currentClip = clips[currentIndex];
  const currentAudioClip = audioClips[currentAudioIndex];

  return (
    <div className="flex-1 justify-items-center mt-8 top-10 right-0 p-5 pl-0">
      <h2 className="text-lg font-semibold mb-2">Video Preview</h2>
      {currentAudioClip ? (
        <audio
          key={currentAudioClip.id || currentAudioIndex} // ensures full remount on clip change
          ref={audioRef}
          src={currentAudioClip.src}
          controls
          autoPlay
          width="800"
          style={{ display: "none" }}
        />
      ) : (
        <p>No audio clip</p>
      )}
      {currentClip ? (
        <video
          key={currentClip.id || currentIndex} // ensures full remount on clip change
          ref={videoRef}
          src={currentClip.src}
          controls
          autoPlay
          width="800"
        />
      ) : (
        <p>No clip</p>
      )}
    </div>
  );
};

export default VideoPreview;
