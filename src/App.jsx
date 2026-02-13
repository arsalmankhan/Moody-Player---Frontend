import { useState } from 'react'
import FacialExpression from './components/FacialExpression'
import MoodSongs from './components/MoodSongs'


export default function App() {
  const [songs, setSongs] = useState([])
  const [nowPlaying, setNowPlaying] = useState(null) 


  return (
    <div className="container-page flex flex-col">
      <nav className="sticky top-0 z-10 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎵</span>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">Moody Player</h1>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl w-full flex-1 px-4 md:px-6 py-6 grid gap-6 md:grid-cols-2">
        <section className="card p-5 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Face Mood Detection</h2>
          <FacialExpression setSongs={setSongs} />
          <p className="text-sm text-white/60 mt-4">Tip: After pressing "Detect Mood", the camera will read your mood and the recommended songs will appear below.</p>
        </section>


        <section className="card p-5 md:p-6">
          <MoodSongs
            Songs={songs}
            nowPlaying={nowPlaying}
            onPlay={(song) => setNowPlaying(song)}
            onPause={() => setNowPlaying(null)}
          />
        </section>
      </main>

      <footer className="sticky bottom-0 z-10 bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">🎶</div>
            <div className="min-w-0">
              <p className="font-medium truncate">{nowPlaying ? nowPlaying.title : 'Nothing playing'}</p>
              <p className="text-xs text-white/60 truncate">{nowPlaying ? nowPlaying.artist : '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn !px-3" title="Prev">⏮️</button>
            <button className="btn !px-4 !text-lg" title="Play/Pause">
              {nowPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="btn !px-3" title="Next">⏭️</button>
          </div>
        </div>
      </footer>
    </div>
  )
}