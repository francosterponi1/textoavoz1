import VoiceCard from './components/VoiceCard';
import { motion } from 'motion/react';

export default function App() {
  return (
    <main className="min-h-screen py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full"
      >
        <VoiceCard />
      </motion.div>

      <footer className="mt-12 text-slate-400 text-xs font-medium tracking-wider">
        PODERADO POR GEMINI FLASH TTS &bull; HONDURAS VOICE AI
      </footer>
    </main>
  );
}
