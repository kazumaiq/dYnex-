import React from 'react';
import { motion } from 'framer-motion';

export const MarqueeSection: React.FC = () => {
  return (
    <div className="w-full py-8 sm:py-12 overflow-hidden select-none pointer-events-none border-y border-void-800/80 bg-void-950/60 backdrop-blur-sm">
      {/* Track 1: Moving Left */}
      <div className="flex whitespace-nowrap mb-3">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 32 }}
          className="flex whitespace-nowrap text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight uppercase"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mr-8 flex items-center space-x-4">
              <span className="text-white">dYnex<span className="text-signal-red">?</span></span>
              <span className="text-void-700">//</span>
              <span className="text-stroke-red font-bold">軌道アーカイブ</span>
              <span className="text-void-700">//</span>
              <span className="text-technical-silver">ELECTRONIC PHONK</span>
              <span className="text-void-700">//</span>
              <span className="text-signal-red">2023—2026</span>
              <span className="barcode-pattern w-12 h-3 opacity-60 inline-block" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* Track 2: Moving Right */}
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [-1200, 0] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 36 }}
          className="flex whitespace-nowrap text-xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight text-technical-muted/80 uppercase"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mr-8 flex items-center space-x-4">
              <span className="text-stroke-ghost">NO FIXED FREQUENCY</span>
              <span className="text-void-800">•</span>
              <span className="text-cyber-purple-glow">音響周波数</span>
              <span className="text-void-800">•</span>
              <span className="text-white">ABSTRACT</span>
              <span className="text-void-800">•</span>
              <span className="text-signal-red">SYSTEM BROADCAST</span>
              <span className="barcode-pattern-silver w-10 h-2.5 opacity-40 inline-block" />
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
