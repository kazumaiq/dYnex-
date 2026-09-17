import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ExternalLink, Disc3, ShieldCheck } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const ReleaseDetailModal: React.FC = () => {
  const { selectedRelease, setSelectedRelease, language } = useArchive();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio on close or switch
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedRelease]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.warn('Audio playback restricted', err));
    }
  };

  if (!selectedRelease) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-void-950/80 backdrop-blur-md"
          onClick={() => setSelectedRelease(null)}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl bg-void-950/95 border border-void-700 shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-none overflow-hidden flex flex-col md:flex-row text-technical-light max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedRelease(null)}
            className="absolute top-4 right-4 z-20 p-2 text-technical-muted hover:text-white bg-void-950/80 border border-void-800 hover:border-signal-red rounded-none transition-colors"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>

          {/* Left: Artwork Cover */}
          <div className="w-full md:w-1/2 relative bg-void-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-void-800">
            <div className="relative group aspect-square w-full max-w-[280px] shadow-2xl overflow-hidden rounded-sm border border-void-700">
              <img
                src={selectedRelease.artworkUrl}
                alt={selectedRelease.title}
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Verified Badge */}
              <div className="absolute top-2 left-2 bg-void-950/80 backdrop-blur-sm border border-void-800 text-[10px] font-mono text-signal-red px-2 py-0.5 rounded-sm flex items-center space-x-1">
                <ShieldCheck size={11} />
                <span>{language === 'ru' ? 'ВЕРИФИЦИРОВАНО' : 'VERIFIED'}</span>
              </div>
            </div>
          </div>

          {/* Right: Metadata & Streaming Links */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Type & Year */}
              <div className="flex items-center space-x-2 text-[11px] font-mono text-signal-red uppercase tracking-widest mb-1">
                <Disc3 size={13} className="animate-spin-slow" />
                <span>{selectedRelease.type} // {selectedRelease.year}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold font-sans tracking-tight text-white mb-1">
                {selectedRelease.title}
              </h2>

              {/* Artists */}
              <p className="text-sm font-mono text-technical-silver mb-4">
                {selectedRelease.artists}
              </p>

              {/* Technical Metadata Table */}
              <div className="space-y-1.5 text-xs font-mono text-technical-muted border-t border-b border-void-800 py-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-technical-muted">CATALOGUE ID:</span>
                  <span className="text-signal-red font-bold">DNX-{selectedRelease.id.padStart ? selectedRelease.id.padStart(3, '0') : selectedRelease.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-technical-muted">{language === 'ru' ? 'ДАТА РЕЛИЗА:' : 'RELEASE DATE:'}</span>
                  <span className="text-technical-light">{selectedRelease.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-technical-muted">{language === 'ru' ? 'ЖАНР:' : 'GENRE:'}</span>
                  <span className="text-technical-light">{selectedRelease.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-technical-muted">{language === 'ru' ? 'ТРЕКОВ:' : 'TRACKS:'}</span>
                  <span className="text-technical-light">{selectedRelease.trackCount}</span>
                </div>
                {selectedRelease.label && (
                  <div className="flex justify-between">
                    <span className="text-technical-muted">LABEL:</span>
                    <span className="text-signal-red font-bold">{selectedRelease.label}</span>
                  </div>
                )}
                {selectedRelease.isrc && (
                  <div className="flex justify-between">
                    <span className="text-technical-muted">ISRC:</span>
                    <span className="text-technical-silver font-mono">{selectedRelease.isrc}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-void-900">
                  <span className="text-technical-muted">STATUS:</span>
                  <span className="text-signal-red font-bold">VERIFIED MASTER</span>
                </div>
              </div>

              {/* Barcode Accent */}
              <div className="barcode-pattern w-full h-2 mb-4 opacity-50" />

              {/* Description */}
              {selectedRelease.description && (
                <p className="text-xs text-technical-silver leading-relaxed mb-4">
                  {selectedRelease.description}
                </p>
              )}
            </div>

            {/* Platform Buttons */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-2 flex items-center justify-between">
                <span>{language === 'ru' ? 'СЛУШАТЬ НА ПЛОЩАДКАХ:' : 'STREAMING PLATFORMS:'}</span>
                <span className="text-signal-red text-[9px]">// DIRECT DSP LINKS</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {selectedRelease.platforms.appleMusic && (
                  <a
                    href={selectedRelease.platforms.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                  >
                    <span>Apple Music</span>
                    <ExternalLink size={12} className="text-signal-red" />
                  </a>
                )}
                {selectedRelease.platforms.spotify && (
                  <a
                    href={selectedRelease.platforms.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                  >
                    <span>Spotify</span>
                    <ExternalLink size={12} className="text-signal-red" />
                  </a>
                )}
                {selectedRelease.platforms.vk && (
                  <a
                    href={selectedRelease.platforms.vk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                  >
                    <span>VK Музыка</span>
                    <ExternalLink size={12} className="text-signal-red" />
                  </a>
                )}
                {selectedRelease.platforms.youtube && (
                  <a
                    href={selectedRelease.platforms.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                  >
                    <span>YouTube</span>
                    <ExternalLink size={12} className="text-signal-red" />
                  </a>
                )}
                {selectedRelease.platforms.soundCloud && (
                  <a
                    href={selectedRelease.platforms.soundCloud}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red text-xs font-mono text-technical-light hover:text-signal-red transition-all rounded-none"
                  >
                    <span>SoundCloud</span>
                    <ExternalLink size={12} className="text-signal-red" />
                  </a>
                )}
                {selectedRelease.platforms.yandexMusic && (
                  <a
                    href={selectedRelease.platforms.yandexMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                  >
                    <span>Яндекс Музыка</span>
                    <ExternalLink size={12} className="text-signal-red" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
