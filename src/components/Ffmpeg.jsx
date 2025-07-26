import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import React, { useEffect, useState, useRef } from "react";

const Exporter = ({ clips, audioClips }) => {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);
  const messageRef = useRef(null);

  const videoClipsList = clips;
  const audioClipsList = audioClips;

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("progress", ({ progress, time }) => {
      messageRef.current.innerHTML = `${(progress * 100).toFixed(2)}% (time: ${(
        time / 1e6
      ).toFixed(2)}s)`;
    });
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setLoaded(true);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;

    // Step 1: Download + Trim all video clips
    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const data = await fetchFile(clip.src);
      await ffmpeg.writeFile(`video${i}.mp4`, data);
      //   await ffmpeg.exec([
      //     "-ss",
      //     String(clip.startTime),
      //     "-t",
      //     String(clip.endTime - clip.startTime),
      //     "-i",
      //     `video${i}.mp4`,
      //     "-c",
      //     "copy",
      //     `trimmed${i}.mp4`,
      //   ]);
      await ffmpeg.exec([
        "-ss",
        String(clip.startTime),
        "-t",
        String(clip.endTime - clip.startTime),
        "-i",
        `video${i}.mp4`,
        "-vf",
        "scale=1280:720", // Or use your desired resolution
        "-r",
        "30", // Consistent framerate
        "-preset",
        "veryfast", // Faster encode
        "-c:v",
        "libx264", // Ensure consistent codec
        "-crf",
        "23", // Quality setting
        `trimmed${i}.mp4`,
      ]);

      //   const trimmedData = await ffmpeg.readFile(`trimmed${i}.mp4`);
      //   const videoBlob = new Blob([trimmedData.buffer], { type: "video/mp4" });
      //   const videoUrl = URL.createObjectURL(videoBlob);

      //   const a = document.createElement("a");
      //   a.href = videoUrl;
      //   a.download = `trimmed${i}.mp4`;
      //   a.click(); // Auto-trigger download
    }

    // Step 2: Download + Trim all audio clips
    for (let i = 0; i < audioClips.length; i++) {
      const clip = audioClips[i];
      const data = await fetchFile(clip.src);
      await ffmpeg.writeFile(`audio${i}.mp3`, data);
      await ffmpeg.exec([
        "-ss",
        String(clip.startTime),
        "-t",
        String(clip.endTime - clip.startTime),
        "-i",
        `audio${i}.mp3`,
        "-c",
        "copy",
        `atrimmed${i}.mp3`,
      ]);

      //   const trimmedData = await ffmpeg.readFile(`atrimmed${i}.mp3`);
      //   const audioBlob = new Blob([trimmedData.buffer], { type: "audio/mp3" });
      //   const audioUrl = URL.createObjectURL(audioBlob);

      //   const a = document.createElement("a");
      //   a.href = audioUrl;
      //   a.download = `trimmedAudio${i}.mp4`;
      //   a.click(); // Auto-trigger download
    }

    // Step 3: Concatenate trimmed videos
    const videoInputs = videoClipsList.flatMap((_, i) => [
      "-i",
      `trimmed${i}.mp4`,
    ]);

    const vfilter =
      videoClipsList.map((_, i) => `[${i}:v:0]`).join("") +
      `concat=n=${videoClipsList.length}:v=1:a=0[outv]`;

    await ffmpeg.exec([
      ...videoInputs,
      "-filter_complex",
      vfilter,
      "-map",
      "[outv]",
      "-c:v",
      "libx264", // Always good to re-encode here too
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "video_combined.mp4",
    ]);

    // const files = await ffmpeg.listFiles();
    // console.log(
    //   "Files in FS:",
    //   files.map((f) => f.name)
    // );

    const trimmedData = await ffmpeg.readFile(`video_combined.mp4`);
    const videoBlob = new Blob([trimmedData.buffer], { type: "video/mp4" });
    const videoUrl = URL.createObjectURL(videoBlob);

    const ab = document.createElement("a");
    ab.href = videoUrl;
    ab.download = `video_combined.mp4`;
    ab.click(); // Auto-trigger download

    // Step 4: Concatenate audio tracks (optional)
    const audioInputs = audioClips.flatMap((_, i) => [
      "-i",
      `atrimmed${i}.mp3`,
    ]);

    const afilter =
      audioClips.map((_, i) => `[${i}:a:0]`).join("") +
      `concat=n=${audioClips.length}:v=0:a=1[outa]`;

    console.log(audioInputs);
    await ffmpeg.exec([
      ...audioInputs,
      "-filter_complex",
      afilter,
      "-map",
      "[outa]",
      "audio_combined.mp3",
    ]);

    // let totalVideoDuration = clips.reduce(
    //   (acc, clip) => acc + (clip.endTime - clip.startTime),
    //   0
    // );
    // let totalAudioDuration = audioClips.reduce(
    //   (acc, clip) => acc + (clip.endTime - clip.startTime),
    //   0
    // );

    // console.log("Total Video Duration:", totalVideoDuration);
    // console.log("Total Audio Duration:", totalAudioDuration);

    // Step 5: Mux final video with audio (optional)
    await ffmpeg.exec([
      "-i",
      "video_combined.mp4",
      "-i",
      "audio_combined.mp3",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-shortest",
      "final_output.mp4",
    ]);

    const finalData = await ffmpeg.readFile("final_output.mp4");
    // Step 6: Auto-download final video
    const blob = new Blob([finalData.buffer], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);

    // Create a hidden download link and trigger it
    const a = document.createElement("a");
    a.href = url;
    a.download = "final_output.mp4"; // name of the downloaded file
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Optionally revoke the object URL after some time
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    //videoRef.current.src = url;
  };

  const handleProcess = async () => {
    if (!loaded) {
      await load(); // load FFmpeg if not already loaded
    }
    await transcode(); // then transcode video
  };

  return (
    <>
      {/* <video ref={videoRef} controls width="600" /> */}
      <button
        onClick={handleProcess}
        type="button"
        className="w-full sm:w-auto px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900 transition-all duration-200"
      >
        Export Video
      </button>
      <p ref={messageRef}></p>
    </>
  );
};

export default Exporter;
