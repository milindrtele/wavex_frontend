import React from "react";
import useFFmpegWorker from "../hooks/useFFmpegWorker";

const VideoExport = ({ clips, audioClips }) => {
  const { startEncoding, outputURL, isProcessing } = useFFmpegWorker();

  return (
    <div>
      <button
        onClick={() => startEncoding(clips, audioClips)}
        disabled={isProcessing}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        {isProcessing ? "Encoding..." : "Export Final Video"}
      </button>

      {outputURL && (
        <video controls src={outputURL} className="mt-4 w-full max-w-3xl" />
      )}
    </div>
  );
};

export default VideoExport;
