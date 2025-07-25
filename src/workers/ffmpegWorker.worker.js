import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({ log: true });

self.onmessage = async (e) => {
  const { type, clips, audioClips } = e.data;

  if (type === "start") {
    try {
      await ffmpeg.load();

      for (let i = 0; i < clips.length; i++) {
        const { src, id } = clips[i];
        const res = await fetch(src);
        const blob = await res.blob();
        ffmpeg.FS("writeFile", `video${id}.mp4`, await fetchFile(blob));
      }

      for (let i = 0; i < audioClips.length; i++) {
        const { src, id } = audioClips[i];
        const res = await fetch(src);
        const blob = await res.blob();
        ffmpeg.FS("writeFile", `audio${id}.mp3`, await fetchFile(blob));
      }

      const videoList = clips
        .map(({ id }) => `file 'video${id}.mp4'`)
        .join("\n");
      ffmpeg.FS("writeFile", "videoList.txt", videoList);

      const audioList = audioClips
        .map(({ id }) => `file 'audio${id}.mp3'`)
        .join("\n");
      ffmpeg.FS("writeFile", "audioList.txt", audioList);

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
      const blob = new Blob([data.buffer], { type: "video/mp4" });

      self.postMessage({ type: "done", blob });
    } catch (error) {
      self.postMessage({ type: "error", error: error.message });
    }
  }
};
