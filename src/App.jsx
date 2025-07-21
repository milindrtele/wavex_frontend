import React, { useEffect, useState } from "react";
import AudioTimeline from "./components/AudioTimeline";
import VideoTimeline from "./components/VideoTimeline";
import VideoPreview from "./components/VideoPreview";
import TextContainer from "./components/TextContainer";

const initialAudioClips = [
  {
    id: "1",
    src: "/audios/embrace-364091.mp3",
    startTime: undefined,
    endTime: undefined,
  },
  {
    id: "2",
    src: "/audios/history-historical-background-music-371414.mp3",
    startTime: undefined,
    endTime: undefined,
  },
];

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
];

function App() {
  const [clips, setClips] = useState(initialClips);
  const [audioClips, setAudioClips] = useState(initialAudioClips);

  useEffect(() => {
    console.log(clips);
    console.log(audioClips);
  }, [clips, audioClips]);

  return (
    <div className="p-4 w-[100vw] flex flex-col h-[100vh]">
      <div className="flex flex-row flex-1">
        <TextContainer />
        <VideoPreview clips={clips} audioClips={audioClips} />
      </div>
      <AudioTimeline clips={audioClips} setClips={setAudioClips} />
      <VideoTimeline clips={clips} setClips={setClips} />
    </div>
  );
}

export default App;
