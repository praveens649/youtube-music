"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Pause, Play } from "lucide-react";
import YouTube from "react-youtube";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  channel: string;
};

export default function YoutubeMusicPlayer() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [current, setCurrent] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await fetch("/api/youtube");
      const data = await res.json();
      const formatted = data.map((v: any) => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
        url: v.url,
        channel: v.channelTitle || "Unknown Artist",
      }));
      setVideos(formatted);
      setCurrent(formatted[0]);
    };
    fetchVideos();
  }, []);

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
    setIsPlaying(!isPlaying);
  };

  if (!current) return null;

  return (
    <section className="py-12 px-6">
      <h2 className="text-3xl font-bold mb-6">My Jams</h2>

      <div className="flex flex-col md:flex-row bg-neutral-900 text-white rounded-2xl overflow-hidden shadow-lg">
        {/* Left: Now Playing */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="w-60 h-60 rounded-xl overflow-hidden shadow-md mb-4 relative">
            <YouTube
              videoId={current.id}
              opts={{
                width: "240",
                height: "180",
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                },
              }}
              onReady={onReady}
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-center line-clamp-2">
            {current.title}
          </h3>
          <p className="text-sm text-gray-400 mb-4">{current.channel}</p>

          <Progress value={35} className="w-3/4 bg-gray-700 mb-4" />

          <div className="flex items-center gap-4">
            <button
              onClick={() => window.open(current.url, "_blank")}
              className="text-xs text-blue-400 hover:underline"
            >
              Open in YouTube
            </button>
            <button
              onClick={handlePlayPause}
              className="rounded-full bg-white text-black p-2 hover:scale-105 transition"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>

        {/* Right: Playlist */}
        <div className="flex-1 bg-neutral-800 overflow-y-auto max-h-[420px] p-4">
          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => {
                setCurrent(v);
                setIsPlaying(true); // Start playing when selected
              }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-neutral-700 transition ${
                v.id === current.id ? "bg-neutral-700" : ""
              }`}
            >
              <img
                src={v.thumbnail}
                alt={v.title}
                className="w-14 h-14 rounded-md object-cover"
              />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{v.title}</span>
                <span className="text-xs text-gray-400 truncate">
                  {v.channel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
