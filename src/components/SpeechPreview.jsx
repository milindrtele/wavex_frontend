import React, { useRef, useState, useEffect } from "react";

const SpeechPreview = ({ clips }) => {
  const audioRef = useRef(null);
  const clip = clips[0];

  useEffect(() => {
    // if (audioRef.current) {
    //   audioRef.current.play().catch((e) => {
    //     // Autoplay might fail; optionally handle
    //     console.log("Autoplay failed:", e);
    //   });
    // }
  }, [clip]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center mt-8 p-5">
      <h2 className="text-lg font-semibold mb-4">Speech Preview</h2>
      {clip ? (
        <audio
          ref={audioRef}
          src={clip.src}
          controls
          className="w-full max-w-md"
          autoPlay="false"
        />
      ) : (
        <p>No audio available</p>
      )}
    </div>
  );
};

export default SpeechPreview;
