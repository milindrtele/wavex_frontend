import React, { useEffect, useState } from "react";
import AudioTimeline from "./components/AudioTimeline";
import VideoTimeline from "./components/VideoTimeline";
import VideoPreview from "./components/VideoPreview";
import TextContainerForVideo from "./components/TextContainerForVideo";
import TextContainerForGraphics from "./components/TextContainerForGraphics";
import TextContainerForSpeech from "./components/TextContainerForSpeech";
import GraphicsPreview from "./components/GraphicsPreview";
import SpeechPreview from "./components/SpeechPreview";

const initialGraphics = [
  { id: "1", src: "/graphics/scene1.png" },
  { id: "2", src: "/graphics/scene2.png" },
];

const initialSpeechClips = [
  {
    id: "1",
    src: "/audios/embrace-364091.mp3",
    startTime: undefined,
    endTime: undefined,
  },
];

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
  const [activeTab, setActiveTab] = useState("video"); // "video" | "graphics" | "speech"
  const [graphicsClips, setGraphicsClips] = useState(initialGraphics);

  useEffect(() => {
    console.log(clips);
    console.log(audioClips);
  }, [clips, audioClips]);

  return (
    <div className="p-4 w-[100vw] h-[100vh] flex flex-col">
      {/* Nav Bar */}
      <div className="flex space-x-4 mb-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("video")}
          className={`px-4 py-2 rounded ${
            activeTab === "video" ? "bg-blue-500 text-white" : "bg-gray-600"
          }`}
        >
          Text to Video
        </button>
        <button
          onClick={() => setActiveTab("graphics")}
          className={`px-4 py-2 rounded ${
            activeTab === "graphics" ? "bg-blue-500 text-white" : "bg-gray-600"
          }`}
        >
          Text to Graphics
        </button>
        <button
          onClick={() => setActiveTab("speech")}
          className={`px-4 py-2 rounded ${
            activeTab === "speech" ? "bg-blue-500 text-white" : "bg-gray-600"
          }`}
        >
          Text to Speech
        </button>
      </div>

      {/* Conditionally Render Based on Tab */}
      {activeTab === "video" && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-row flex-1">
            <TextContainerForVideo clips={clips} audioClips={audioClips} />
            <VideoPreview clips={clips} audioClips={audioClips} />
          </div>
          <AudioTimeline clips={audioClips} setClips={setAudioClips} />
          <VideoTimeline clips={clips} setClips={setClips} />
        </div>
      )}

      {activeTab === "graphics" && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-row flex-1">
            <TextContainerForGraphics />
            <GraphicsPreview clips={graphicsClips} />
          </div>
        </div>
      )}

      {activeTab === "speech" && (
        <div className="flex-1 flex flex-col">
          <div className="flex flex-row flex-1">
            <TextContainerForSpeech clips={initialSpeechClips} />
            <SpeechPreview clips={initialSpeechClips} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
