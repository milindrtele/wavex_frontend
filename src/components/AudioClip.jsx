import React, { useRef, useState, useEffect } from "react";

const AudioClip = ({ clip, onTrimChange }) => {
  const audioRef = useRef(null);

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
    const audioDuration = audioRef.current?.duration;
    if (audioDuration) {
      setDuration(audioDuration);
      if (clip.startTime === undefined || clip.endTime === undefined) {
        const fullDuration = parseFloat(audioDuration.toFixed(2));
        onTrimChange(clip.id, {
          ...clip,
          startTime: 0,
          endTime: fullDuration,
        });
        setStartTrim(0);
        setEndTrim(fullDuration);
      }
    }
  };

  const handleMouseDown = (e, side) => {
    e.preventDefault();
    setResizingSide(side);
    setStartX(e.clientX);
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
      className="relative h-16 border rounded shadow-md bg-slate-100 select-none"
      style={{
        width: `${currentWidth}px`,
        maxWidth: `${maxWidth}px`,
      }}
    >
      <audio
        ref={audioRef}
        src={clip.src}
        onLoadedMetadata={handleLoadedMetadata}
      />

      {/* Left Trim Handle */}
      <div
        className="absolute left-0 top-0 w-2 h-full bg-green-600 cursor-ew-resize z-10"
        onMouseDown={(e) => handleMouseDown(e, "left")}
        onPointerDown={(e) => e.stopPropagation()}
      />

      {/* Right Trim Handle */}
      <div
        className="absolute right-0 top-0 w-2 h-full bg-green-600 cursor-ew-resize z-10"
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

export default AudioClip;
