import { useState } from 'react';
import { Mic, AudioLines, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateHondurasSpeech } from '../services/geminiService';
import { base64ToUint8Array, createWavBlob } from '../lib/audioUtils';
import AudioPlayer from './AudioPlayer';

export default function VoiceCard() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioResult, setAudioResult] = useState<{ url: string; blob: Blob } | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);
    setAudioResult(null);

    try {
      const base64 = await generateHondurasSpeech(text);
      const uint8Array = base64ToUint8Array(base64);
      const blob = createWavBlob(uint8Array);
      const url = URL.createObjectURL(blob);
      setAudioResult({ url, blob });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al generar el audio. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" id="main-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[3rem] p-8 md:p-12 premium-shadow overflow-hidden"
        id="voice-card"
      >
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 leading-none">
                  Honduras Voice AI
                </h1>
                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-widest">
                  Locución Premium
                </p>
              </div>
            </div>
            <div className="flex gap-1 text-indigo-200">
              <AudioLines className="w-5 h-5 animate-pulse" />
              <AudioLines className="w-5 h-5 animate-pulse delay-75" />
              <AudioLines className="w-5 h-5 animate-pulse delay-150" />
            </div>
          </div>

          <div className="h-px w-full bg-slate-100" />
        </div>

        {/* Editor Section */}
        <div className="space-y-6">
          <div className="relative group">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="¿Qué quieres que diga el locutor hondureño hoy? Escribe aquí el texto..."
              className="w-full min-h-[160px] p-6 bg-slate-50 border-none rounded-3xl text-slate-700 placeholder:text-slate-300 resize-none transition-all focus:ring-4 focus:ring-indigo-100 outline-none text-lg leading-relaxed"
              id="text-editor"
            />
            <div className="absolute bottom-4 right-6 flex items-center gap-2 text-slate-300 transition-opacity group-focus-within:opacity-0 pointer-events-none">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold">Gemini Flash AI</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !text.trim()}
            className={`w-full py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
              isLoading || !text.trim()
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'gradient-bg text-white hover:shadow-xl hover:shadow-indigo-200 cursor-pointer'
            }`}
            id="generate-button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generando locución...
              </>
            ) : (
              <>
                Generar Voz Hondureña
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 text-rose-600" id="error-alert">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Error de Generación</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Player Result */}
        <AnimatePresence>
          {audioResult && (
            <AudioPlayer audioUrl={audioResult.url} blob={audioResult.blob} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Social/Status Labels */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center justify-center gap-8 text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase"
      >
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Servicio Online
        </span>
        <span>Acento Auténtico</span>
        <span>Calidad 24kHz</span>
      </motion.div>
    </div>
  );
}
