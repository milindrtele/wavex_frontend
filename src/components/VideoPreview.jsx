import React, { useRef, useState, useEffect } from "react";

const VideoPreview = ({ clips }) => {
  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [readyToPlay, setReadyToPlay] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
  }, [clips]);

  useEffect(() => {
    setReadyToPlay(false); // force waiting for loadedmetadata
  }, [currentIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const currentClip = clips[currentIndex];

    const handleLoadedMetadata = () => {
      video.currentTime = currentClip.startTime;
      video.play();
      setReadyToPlay(true);
    };

    const handleTimeUpdate = () => {
      if (video.currentTime >= currentClip.endTime) {
        video.pause();
        setReadyToPlay(false);
        setTimeout(() => {
          setCurrentIndex((i) => (i + 1 < clips.length ? i + 1 : i));
        }, 200);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentIndex, clips]);

  const currentClip = clips[currentIndex];

  return (
    <div className="flex-1 justify-items-center mt-8 top-10 right-0 p-5 pl-0">
      <h2 className="text-lg font-semibold mb-2">Video Preview</h2>
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
