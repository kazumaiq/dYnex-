import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Disc3, ShieldAlert } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const HeroSection: React.FC = () => {
  const { featuredRelease, setSelectedRelease, language } = useArchive();

  const handleEnterArchive = () => {
    const archiveElem = document.querySelector('#archive');
    if (archiveElem) {
      archiveElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 pt-28 pb-12 pointer-events-none select-none"
    >
      {/* Top Metadata Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-center space-x-3 font-mono text-xs text-technical-silver pointer-events-auto"
      >
        <span className="w-2 h-2 rounded-full bg-signal-red animate-ping" />
        <span className="tracking-widest uppercase">
          {language === 'ru' ? 'ЗОНА 01 // ПРИБЫТИЕ' : 'ZONE 01 // ARRIVAL'}
        </span>
        <span className="text-void-700">/</span>
        <span className="text-technical-muted hidden sm:inline">
          {language === 'ru' ? '3D ПРОСТРАНСТВО РЕЛИЗОВ' : 'SPATIAL MUSIC DIMENSION'}
        </span>
      </motion.div>

      {/* Main Hero Editorial Typography & CTAs (Asymmetrical Left Layout) */}
      <div className="max-w-xl my-auto py-12 pointer-events-auto">
        {/* Monospace Producer Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs font-mono tracking-widest-tech text-technical-muted uppercase mb-4 flex items-center space-x-2"
        >
          <span className="text-signal-red">//</span>
          <span>
            {language === 'ru'
              ? 'НЕЗАВИСИМЫЙ АРТИСТ & ПРОДЮСЕР'
              : 'INDEPENDENT ARTIST & PRODUCER'}
          </span>
        </motion.div>

        {/* Massive Artist Wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-sans font-black text-5xl sm:text-7xl lg:text-9xl tracking-tighter text-white leading-none mb-6"
        >
          dYnex<span className="text-signal-red">?</span>
        </motion.h1>


        {/* Style & Catalog Metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs sm:text-sm font-mono text-technical-silver tracking-widest space-y-1 mb-8"
        >
          <p>ELECTRONIC • PHONK • BRAZILIAN PHONK • EXPERIMENTAL</p>
          <p className="text-technical-muted text-xs">
            {language === 'ru'
              ? 'ЦИФРОВАЯ ВСЕЛЕННАЯ КАТАЛОГА 2023—2026'
              : 'DIGITAL CATALOG HORIZON 2023—2026'}
          </p>
        </motion.div>

        {/* Featured Release Information Card */}
        {featuredRelease && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8 p-4 bg-void-950/80 backdrop-blur-md border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow transition-all duration-300 rounded-sm inline-flex items-center space-x-4 max-w-md cursor-pointer group"
            onClick={() => setSelectedRelease(featuredRelease)}
          >
            <div className="w-12 h-12 rounded-sm overflow-hidden border border-void-700 shrink-0 group-hover:border-cyber-purple transition-colors">
              <img
                src={featuredRelease.artworkUrl}
                alt={featuredRelease.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs font-mono">
              <div className="text-signal-red group-hover:text-cyber-purple-glow transition-colors text-[10px] tracking-widest flex items-center space-x-1">
                <Disc3 size={11} className="animate-spin-slow" />
                <span>{language === 'ru' ? 'АКТИВНЫЙ РЕЛИЗ' : 'FEATURED RELEASE'}</span>
              </div>
              <div className="font-bold text-white text-sm tracking-tight group-hover:text-cyber-purple-glow transition-colors">
                {featuredRelease.title}
              </div>
              <div className="text-technical-muted text-[11px]">
                {featuredRelease.artists} // {featuredRelease.year}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap items-center gap-4"
        >
          {/* Primary CTA: Listen Now */}
          <button
            onClick={() => setSelectedRelease(featuredRelease)}
            className="group relative px-6 py-3.5 bg-gradient-to-r from-signal-red to-signal-red-glow hover:shadow-neon-mix text-white font-mono text-xs tracking-widest uppercase rounded-sm flex items-center space-x-3 transition-all duration-200"
          >
            <Play size={14} className="fill-white" />
            <span>{language === 'ru' ? 'СЛУШАТЬ РЕЛИЗ' : 'LISTEN NOW'}</span>
          </button>

          {/* Secondary CTA: Enter Archive */}
          <button
            onClick={handleEnterArchive}
            className="group px-6 py-3.5 bg-void-950/80 hover:bg-void-900 border border-void-800 hover:border-cyber-purple/70 text-technical-light hover:text-cyber-purple-glow font-mono text-xs tracking-widest uppercase rounded-sm flex items-center space-x-3 transition-all duration-200"
          >
            <span>{language === 'ru' ? 'ВОЙТИ В АРХИВ' : 'ENTER ARCHIVE'}</span>
            <ArrowDown size={14} className="text-signal-red group-hover:text-cyber-purple group-hover:translate-y-0.5 transition-all" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Technical Telemetry */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-technical-muted border-t border-void-800/60 pt-4 pointer-events-auto"
      >
        <div>
          {language === 'ru'
            ? 'СКРОЛЛ ДЛЯ ПОГРУЖЕНИЯ В 3D ПРОСТРАНСТВО'
            : 'SCROLL TO TRAVEL THROUGH SPATIAL 3D ARCHIVE'}
        </div>
        <div className="flex items-center space-x-2 text-technical-silver mt-2 sm:mt-0">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-red" />
          <span>COORDINATES: X: 00 // Y: 00 // Z: -0000</span>
        </div>
      </motion.div>
    </section>
  );
};
