import  { useEffect, useRef, useState } from 'react'

export default function MoodSongs({ Songs, nowPlaying, onPlay, onPause }) {
  const [playingIndex, setPlayingIndex] = useState(null)
  const audioRef = useRef(new Audio())
  const previewRef = useRef(new Audio())
  const previewTimeoutRef = useRef(null)

  useEffect(() => {
    const a = audioRef.current
    const p = previewRef.current
    p.volume = 0.4
    return () => {
      a.pause()
      p.pause()
      if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current)
    }
  }, [])

  const handlePlayPause = (song, index) => {
    const a = audioRef.current
    const p = previewRef.current
    p.pause()
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current)

    if (playingIndex === index) {
      a.pause()
      setPlayingIndex(null)
      onPause?.()
    } else {
      a.src = song.audio
      a.play()
      setPlayingIndex(index)
      onPlay?.(song)
    }
  }

  const handleHoverStart = (song, index) => {
    if (playingIndex === index) return
    const p = previewRef.current
    try { p.currentTime = 0 } catch {}
    p.src = song.preview || song.audio
    p.play().catch(() => {})
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current)
    previewTimeoutRef.current = setTimeout(() => { p.pause() }, 5000)
  }

  const handleHoverEnd = () => {
    const p = previewRef.current
    p.pause()
    if (previewTimeoutRef.current) clearTimeout(previewTimeoutRef.current)
  }

  if (!Songs || Songs.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-6">
        <h2 className="text-lg font-semibold mb-4">Recommended Songs</h2>
        <div className="space-y-3">
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
          <div className="skeleton h-16 w-full" />
        </div>
        <p className="text-sm text-gray-400 mt-4">
          Mood will be detected, and the list will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h2 className="text-lg font-semibold mb-4">Recommended Songs</h2>
      <ul className="space-y-3">
        {Songs.map((song, index) => (
          <li
            key={`${song.title}-${index}`}
            className="group flex items-center justify-between gap-4 p-3 rounded-xl border border-white/10 bg-[#1e293b] hover:bg-[#334155] transition"
            onMouseEnter={() => handleHoverStart(song, index)}
            onMouseLeave={handleHoverEnd}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-[#0f172a] flex items-center justify-center text-lg overflow-hidden">
                {playingIndex === index ? (
                  <div className="flex items-end gap-[3px] h-5">
                    <span className="w-[3px] bg-[#38bdf8] animate-[equalize_1s_ease-in-out_infinite] shadow-[0_0_8px_#38bdf8,0_0_12px_#38bdf8]" />
                    <span className="w-[3px] bg-[#38bdf8] animate-[equalize_1s_ease-in-out_infinite_200ms] shadow-[0_0_8px_#38bdf8,0_0_12px_#38bdf8]" />
                    <span className="w-[3px] bg-[#38bdf8] animate-[equalize_1s_ease-in-out_infinite_400ms] shadow-[0_0_8px_#38bdf8,0_0_12px_#38bdf8]" />
                  </div>
                ) : (
                  <span>🎼</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">
                  {song.title}
                  <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-400 opacity-0 group-hover:opacity-100 transition">Preview</span>
                </p>
                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
              </div>
            </div>

            <button
              onClick={() => handlePlayPause(song, index)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white font-medium shadow-lg backdrop-blur-md hover:shadow-[0_0_15px_#38bdf8] transition"
            >
              {playingIndex === index ? 'Pause' : 'Play'}
            </button>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes equalize {
          0% { height: 20%; }
          50% { height: 100%; }
          100% { height: 20%; }
        }
        .animate-[equalize_1s_ease-in-out_infinite] {
          animation: equalize 1s ease-in-out infinite;
        }
        .animate-[equalize_1s_ease-in-out_infinite_200ms] {
          animation: equalize 1s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        .animate-[equalize_1s_ease-in-out_infinite_400ms] {
          animation: equalize 1s ease-in-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  )
}
