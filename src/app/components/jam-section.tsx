"use client"
import { useState, useEffect } from "react"
import YouTube from "react-youtube"
import { SkipBack, Play, Pause, SkipForward, ExternalLink } from "lucide-react"

export default function JamSection() {
  const [jams, setJams] = useState<any[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [player, setPlayer] = useState<any>(null)

  useEffect(() => {
    fetch("/api/jams")
      .then((res) => res.json())
      .then((data) => {
        setJams(data)
        if (data.length > 0) setCurrentId(data[0].id)
      })
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && player) {
      interval = setInterval(() => {
        setCurrentTime(player.getCurrentTime())
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, player])

  const currentJam = jams.find((j) => j.id === currentId)

  const onReady = (event: any) => {
    setPlayer(event.target)
    setDuration(event.target.getDuration())
  }

  const onStateChange = (event: any) => {
    const playerState = event.data
    if (playerState === 1) { // Playing
      setIsPlaying(true)
    } else if (playerState === 2) { // Paused
      setIsPlaying(false)
    } else if (playerState === 0) { // Ended
      handleNext() // Auto-play next
    }
  }

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo()
      } else {
        player.playVideo()
      }
    }
  }

  const handlePrevious = () => {
    const currentIndex = jams.findIndex((j) => j.id === currentId)
    if (currentIndex > 0) {
      setCurrentId(jams[currentIndex - 1].id)
      setIsPlaying(true)
    }
  }

  const handleNext = () => {
    const currentIndex = jams.findIndex((j) => j.id === currentId)
    if (currentIndex < jams.length - 1) {
      setCurrentId(jams[currentIndex + 1].id)
      setIsPlaying(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">My Jams</h1>
          <div className="h-px bg-gray-800 w-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Album Cover & Player Controls */}
          <div className="flex-shrink-0 w-full lg:w-80">
            {currentJam && (
              <div>
                <div className="relative rounded-xl overflow-hidden shadow-2xl mb-8 aspect-square bg-gray-900 border border-gray-800">
                  <img
                    src={currentJam.thumbnail || "/placeholder.svg"}
                    alt={currentJam.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">{currentJam.title}</h2>
                  <p className="text-gray-400">{currentJam.artist || "Unknown Artist"}</p>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-gray-800 h-1 rounded-full mb-2">
                    <div
                      className="bg-red-500 h-1 rounded-full transition-all"
                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatTime(currentTime)}</span>
                    <span>-{formatTime(duration - currentTime)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 mb-8">
                  <button onClick={handlePrevious} className="text-gray-300 hover:text-white transition">
                    <SkipBack className="w-8 h-8 fill-current" />
                  </button>
                  <button onClick={handlePlayPause} className="text-white hover:text-red-500 transition">
                    {isPlaying ? (
                      <Pause className="w-12 h-12 fill-current" />
                    ) : (
                      <Play className="w-12 h-12 fill-current" />
                    )}
                  </button>
                  <button onClick={handleNext} className="text-gray-300 hover:text-white transition">
                    <SkipForward className="w-8 h-8 fill-current" />
                  </button>
                </div>

                

                <div className="hidden">
                  <YouTube
                    videoId={currentId || ""}
                    opts={{
                      playerVars: {
                        autoplay: isPlaying ? 1 : 0,
                        controls: 0,
                        modestbranding: 1,
                        rel: 0,
                      },
                    }}
                    onReady={onReady}
                    onStateChange={onStateChange}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Song List */}
          {jams.length > 0 && (
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Top Lists</h3>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {jams.map((jam, index) => (
                <div
                  key={jam.id}
                  onClick={() => {
                    setCurrentId(jam.id)
                    setIsPlaying(true)
                  }}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition ${
                    currentId === jam.id
                      ? "bg-gray-900 border border-red-500"
                      : "hover:bg-gray-900 border border-transparent"
                  }`}
                >
                  <img
                    src={jam.thumbnail || "/placeholder.svg"}
                    alt={jam.title}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{jam.title}</p>
                    <p className="text-xs text-gray-500 truncate">{jam.artist || "Unknown Artist"}</p>
                  </div>

                  <span className="text-sm text-gray-600 flex-shrink-0">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  )
}
