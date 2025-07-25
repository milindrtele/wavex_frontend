// public/ffmpegWorker.js
self.importScripts(
  "https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js"
);

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });

self.onmessage = async (e) => {
  const { type, clips, audioClips } = e.data;

  if (type === "start") {
    try {
      await ffmpeg.load();

      // Write all video files
      for (let i = 0; i < clips.length; i++) {
        const { src, id } = clips[i];
        const res = await fetch(src);
        const blob = await res.blob();
        ffmpeg.FS("writeFile", `video${id}.mp4`, await fetchFile(blob));
      }

      // Write all audio files
      for (let i = 0; i < audioClips.length; i++) {
        const { src, id } = audioClips[i];
        const res = await fetch(src);
        const blob = await res.blob();
        ffmpeg.FS("writeFile", `audio${id}.mp3`, await fetchFile(blob));
      }

      // Create concat files
      const videoList = clips
        .map(({ id }) => `file 'video${id}.mp4'`)
        .join("\n");
      ffmpeg.FS("writeFile", "videoList.txt", videoList);

      const audioList = audioClips
        .map(({ id }) => `file 'audio${id}.mp3'`)
        .join("\n");
      ffmpeg.FS("writeFile", "audioList.txt", audioList);

      // Concatenate video
      await ffmpeg.run(
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "videoList.txt",
        "-c",
        "copy",
        "output_video.mp4"
      );

      // Concatenate audio
      await ffmpeg.run(
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        "audioList.txt",
        "-c",
        "copy",
        "output_audio.mp3"
      );

      // Combine video + audio
      await ffmpeg.run(
        "-i",
        "output_video.mp4",
        "-i",
        "output_audio.mp3",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-shortest",
        "final_output.mp4"
      );

      const data = ffmpeg.FS("readFile", "final_output.mp4");
      const result = new Blob([data.buffer], { type: "video/mp4" });

      self.postMessage({ type: "done", blob: result });
    } catch (error) {
      self.postMessage({ type: "error", error: error.message });
    }
  }
};
