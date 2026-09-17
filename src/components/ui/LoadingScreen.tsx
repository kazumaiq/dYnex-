import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setVisible(false);
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 90);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void-950 text-technical-light select-none font-mono"
        >
          <div className="flex flex-col items-center space-y-6 max-w-sm px-6 text-center">
            {/* Wordmark */}
            <div className="font-sans font-bold text-4xl tracking-tighter">
              dYnex<span className="text-signal-red">?</span>
            </div>

            {/* Technical Subtext */}
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest-tech text-technical-silver font-mono">
                ИНТЕРАКТИВНЫЙ 3D МУЗЫКАЛЬНЫЙ АРХИВ
              </div>
              <div className="text-[11px] text-technical-muted font-mono tracking-widest">
                2023 — 2026 // СИСТЕМА ИНИЦИАЛИЗАЦИИ
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-56 h-[2px] bg-void-800 relative overflow-hidden">
              <motion.div
                className="h-full bg-signal-red"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Status Code */}
            <div className="text-[10px] text-technical-muted tracking-widest-tech">
              ЗАГРУЗКА ЗВЁЗДНОГО ПРОСТРАНСТВА [{progress}%]
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
