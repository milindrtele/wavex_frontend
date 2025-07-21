import React, { useEffect, useState, useRef } from "react";

const VideoClip = ({ clip, onTrimChange }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const [resizingSide, setResizingSide] = useState(null);
  const [startX, setStartX] = useState(0);
  const [startTrim, setStartTrim] = useState(clip.startTime);
  const [endTrim, setEndTrim] = useState(clip.endTime);
  const [duration, setDuration] = useState(null);

  const pixelsPerSecond = 10;
  const visibleDuration = endTrim - startTrim;
  const maxWidth = duration ? duration * pixelsPerSecond : 100;
  const currentWidth = visibleDuration * pixelsPerSecond;

  const handleLoadedMetadata = () => {
    const videoDuration = videoRef.current?.duration;
    if (videoDuration) {
      setDuration(videoDuration);
      // If clip has no initial trim values, set them
      if (clip.startTime === undefined || clip.endTime === undefined) {
        onTrimChange(clip.id, {
          ...clip,
          startTime: 0,
          endTime: parseFloat(videoDuration.toFixed(2)),
        });
        setStartTrim(0);
        setEndTrim(parseFloat(videoDuration.toFixed(2)));
      }
    }
  };

  const handleMouseDown = (e, side) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingSide(side);
    setStartX(e.clientX);
    setStartTrim(startTrim);
    setEndTrim(endTrim);
  };

  const handleMouseMove = (e) => {
    if (!resizingSide || duration === null) return;

    const deltaX = e.clientX - startX;
    const deltaTime = deltaX / pixelsPerSecond;

    let newStart = startTrim;
    let newEnd = endTrim;

    if (resizingSide === "left") {
      newStart = Math.min(newEnd - 0.1, Math.max(0, startTrim + deltaTime));
    } else if (resizingSide === "right") {
      newEnd = Math.max(
        newStart + 0.1,
        Math.min(duration, endTrim + deltaTime)
      );
    }

    onTrimChange(clip.id, {
      ...clip,
      startTime: parseFloat(newStart.toFixed(2)),
      endTime: parseFloat(newEnd.toFixed(2)),
    });

    setStartTrim(newStart);
    setEndTrim(newEnd);
  };

  const handleMouseUp = () => {
    setResizingSide(null);
  };

  useEffect(() => {
    if (resizingSide) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingSide]);

  return (
    <div
      ref={containerRef}
      className="relative h-20 border rounded shadow-md bg-white select-none"
      style={{
        width: `${currentWidth}px`,
        maxWidth: `${maxWidth}px`,
      }}
    >
      <video
        ref={videoRef}
        src={clip.src}
        preload="metadata"
        width="100%"
        className="h-full object-cover pointer-events-none"
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Left Trim Handle */}
      <div
        className="absolute left-0 top-0 w-2 h-full bg-blue-500 cursor-ew-resize z-10"
        onMouseDown={(e) => handleMouseDown(e, "left")}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* Right Trim Handle */}
      <div
        className="absolute right-0 top-0 w-2 h-full bg-blue-500 cursor-ew-resize z-10"
        onMouseDown={(e) => handleMouseDown(e, "right")}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* Duration Label */}
      <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-black/30 text-white">
        {`Start: ${startTrim?.toFixed(2)}s | End: ${endTrim?.toFixed(2)}s`}
      </div>
    </div>
  );
};

export default VideoClip;
