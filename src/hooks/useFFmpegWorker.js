import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

const useFFmpegWorker = () => {
  const ffmpegRef = useRef(new FFmpeg());
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputURL, setOutputURL] = useState(null);

  const loadFFmpeg = async () => {
    const ffmpeg = ffmpegRef.current;

    if (ffmpeg.loaded) return;

    const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.10/dist/esm";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
  };

  const startEncoding = async (videoClips = [], audioClips = []) => {
    setIsProcessing(true);
    setOutputURL(null);

    const ffmpeg = ffmpegRef.current;

    await loadFFmpeg();

    try {
      // Load and concatenate video clips
      for (let i = 0; i < videoClips.length; i++) {
        const fileData = await fetchFile(videoClips[i].src);
        await ffmpeg.writeFile(`video${i}.mp4`, fileData);
      }

      // Create a text file listing video segments to concat
      const concatList = videoClips
        .map((_, i) => `file 'video${i}.mp4'`)
        .join("\n");
      await ffmpeg.writeFile("videos.txt", concatList);

      // Concatenate all video clips into one
      await ffmpeg.exec([
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "videos.txt",
        "-c",
        "copy",
        "merged_video.mp4",
      ]);

      // If there's audio, mix it in
      if (audioClips.length > 0) {
        for (let i = 0; i < audioClips.length; i++) {
          const audioData = await fetchFile(audioClips[i].src);
          await ffmpeg.writeFile(`audio${i}.mp3`, audioData); // or .wav
        }

        // Concatenate or merge audio (basic example: using the first one)
        await ffmpeg.exec([
          "-i",
          "merged_video.mp4",
          "-i",
          "audio0.mp3",
          "-c:v",
          "copy",
          "-c:a",
          "aac",
          "-shortest",
          "final_output.mp4",
        ]);
      } else {
        await ffmpeg.rename("merged_video.mp4", "final_output.mp4");
      }

      const output = await ffmpeg.readFile("final_output.mp4");
      const blob = new Blob([output.buffer], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      setOutputURL(url);
    } catch (err) {
      console.error("FFmpeg processing failed", err);
    }

    setIsProcessing(false);
  };

  return { startEncoding, outputURL, isProcessing };
};

export default useFFmpegWorker;
