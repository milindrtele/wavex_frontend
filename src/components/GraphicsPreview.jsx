import React from "react";

const GraphicsPreview = ({ clips }) => {
  const clip = clips[0];

  return (
    <div className="flex-1 flex flex-col justify-center items-center mt-8 p-5">
      <h2 className="text-lg font-semibold mb-4">Graphics Preview</h2>
      {clip ? (
        <img
          src={clip.src}
          alt="graphic"
          className="max-w-[600px] max-h-[400px] rounded shadow"
        />
      ) : (
        <p>No graphic available</p>
      )}
    </div>
  );
};

export default GraphicsPreview;
