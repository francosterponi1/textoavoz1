import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Download, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AudioPlayerProps {
  audioUrl: string;
  blob: Blob;
}

export default function AudioPlayer({ audioUrl, blob }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `locucion-honduras-${new Date().getTime()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Map 1-10 slider to 0.5x-2.0x playback rate
  const updateSpeed = (val: number) => {
    const rate = 0.5 + (val - 1) * (1.5 / 9);
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-slate-900 rounded-3xl p-6 text-white premium-shadow overflow-hidden relative"
      id="audio-player-container"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 rounded-full transition-colors"
              id="play-pause-btn"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
            </button>
            <button
              onClick={stopAudio}
              className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              id="stop-btn"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all text-sm font-medium"
            id="download-btn"
          >
            <Download className="w-4 h-4" />
            Descargar .WAV
          </button>
        </div>

        {/* Progress Bar */}
        <div className="relative h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-indigo-400"
            style={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          />
        </div>

        {/* Speed Control */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 tracking-wider">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-400" />
              VELOCIDAD
            </div>
            <span>{playbackRate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.1"
            defaultValue="4" // Approx 1.0x
            onChange={(e) => updateSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            id="speed-slider"
          />
        </div>
      </div>

      {/* Decorative pulse when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-indigo-500 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
