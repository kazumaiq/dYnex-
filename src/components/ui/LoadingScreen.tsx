import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast 600ms progress initialization
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 250);
          return 100;
        }
        return prev + 25;
      });
    }, 60);

    // Hard fallback timeout: never stay stuck on loading screen
    const fallbackTimeout = setTimeout(() => {
      clearInterval(timer);
      setVisible(false);
      onComplete();
    }, 900);

    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void-950 text-technical-light select-none font-mono pointer-events-none"
        >
          <div className="flex flex-col items-center space-y-6 max-w-sm px-6 text-center">
            {/* Wordmark */}
            <div className="font-sans font-bold text-4xl sm:text-5xl tracking-tighter">
              dYnex<span className="text-signal-red">?</span>
            </div>

            {/* Technical Subtext */}
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest-tech text-technical-silver font-mono">
                ИНТЕРАКТИВНЫЙ 3D АРХИВ
              </div>
              <div className="text-[10px] text-technical-muted font-mono tracking-widest">
                2023 — 2026 // FAST BOOT 60 FPS
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-48 h-[2px] bg-void-800 relative overflow-hidden">
              <div
                className="h-full bg-signal-red transition-all duration-100 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
