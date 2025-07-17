import React, { useState } from "react";
import VideoTimeline from "./components/VideoTimeline";
import VideoPreview from "./components/VideoPreview";
import TextContainer from "./components/TextContainer";

const initialClips = [
  {
    id: "1",
    src: "/videos/clip1.mp4",
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: "2",
    src: "/videos/clip2.mp4",
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: "3",
    src: "/videos/clip3.mp4",
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: "4",
    src: "/videos/clip4.mp4",
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: "5",
    src: "/videos/clip5.mp4",
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: "6",
    src: "/videos/clip5.mp4",
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: "7",
    src: "/videos/clip5.mp4",
    startTime: undefined,
    endTime: undefined,
  },
];

function App() {
  const [clips, setClips] = useState(initialClips);

  return (
    <div className="p-4 w-[100vw] flex flex-col h-[100vh]">
      <div className="flex flex-row flex-1">
        <TextContainer />
        <VideoPreview clips={clips} />
      </div>
      <VideoTimeline clips={clips} setClips={setClips} />
    </div>
  );
}

export default App;
