import React from 'react';
import { motion } from 'framer-motion';

export const MarqueeSection: React.FC = () => {
  const content = 'dYnex? — ELECTRONIC — PHONK — EXPERIMENTAL — 2023 — 2024 — 2025 — 2026 — ';

  return (
    <div className="w-full py-12 overflow-hidden select-none pointer-events-none opacity-30 hover:opacity-75 transition-opacity">
      {/* Track 1: Moving Left */}
      <div className="flex whitespace-nowrap mb-2">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
          className="flex whitespace-nowrap text-3xl sm:text-5xl font-black font-sans tracking-tight text-void-700 uppercase"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mr-6">
              dYnex<span className="text-signal-red">?</span> // <span className="text-cyber-purple/50">ЭЛЕКТРОННЫЙ АРХИВ</span> // 2023—2026 // <span className="text-signal-red/60">PHONK</span> //
            </span>
          ))}
        </motion.div>
      </div>

      {/* Track 2: Moving Right */}
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [-1000, 0] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 28 }}
          className="flex whitespace-nowrap text-3xl sm:text-5xl font-black font-sans tracking-tight text-void-800 uppercase"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mr-6">
              NO FIXED FREQUENCY // <span className="text-cyber-purple/60">ABSTRACT</span> // CYBER MEMORIES // <span className="text-signal-red/60">MONTAGEM BATERIA</span> //
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
