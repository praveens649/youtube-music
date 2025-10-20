"use client";

import YouTube from "react-youtube";
import { useState } from "react";

interface YouTubePlayerProps {
  videoId: string;
}

export default function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const [player, setPlayer] = useState<any>(null);

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const onPlay = () => {
    if (player) player.playVideo();
  };

  const onPause = () => {
    if (player) player.pauseVideo();
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <YouTube
        videoId={videoId}
        opts={{
          width: "100%",
          height: "250",
          playerVars: {
            autoplay: 1,
            modestbranding: 1,
            rel: 0,
          },
        }}
        onReady={onReady}
      />

      <div className="flex gap-4 mt-2">
        <button
          onClick={onPlay}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          ▶ Play
        </button>
        <button
          onClick={onPause}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          ❚❚ Pause
        </button>
      </div>
    </div>
  );
}
