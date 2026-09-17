import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Disc3, Radio, Crosshair, Zap, Heart } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { PosterCutout } from '../collage/PosterCutout';

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
      className="relative min-h-screen w-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-28 sm:pt-32 pb-8 pointer-events-none select-none max-w-7xl mx-auto overflow-hidden"
    >
      {/* 00. Background Collage Atmosphere: Botanical & Tactical Artwork Cutouts */}
      <div className="absolute top-1/4 -right-12 sm:right-4 w-72 sm:w-96 lg:w-[32rem] h-72 sm:h-96 lg:h-[32rem] pointer-events-none opacity-25 lg:opacity-35 mix-blend-screen z-0">
        <PosterCutout
          src="/assets/collage/botanical-cyber.jpg"
          alt="dYnex Botanical Cyber Composition"
          maskType="radial"
          cropPosition="center"
          className="w-full h-full"
        />
      </div>

      <div className="hidden 2xl:block absolute top-12 right-0 w-64 h-80 pointer-events-none opacity-15 mix-blend-screen z-0">
        <PosterCutout
          src="/assets/collage/anime-tactical.jpg"
          alt="dYnex Tactical Anime Layer"
          maskType="radial"
          cropPosition="top"
          className="w-full h-full"
        />
      </div>

      {/* 01. Top Tactical HUD & Coordinate Telemetry */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex items-center justify-between font-mono text-[10px] sm:text-xs text-technical-silver pointer-events-auto border-b border-void-800/80 pb-3 relative z-10"
      >
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-signal-red animate-ping" />
          <span className="font-bold text-signal-red tracking-widest-tech uppercase">
            {language === 'ru' ? 'ЗОНА 01 // ОРБИТАЛЬНЫЙ ВХОД' : 'ZONE 01 // ORBITAL ENTRY'}
          </span>
          <span className="text-void-700 hidden sm:inline">|</span>
          <span className="text-technical-muted hidden sm:inline tracking-wider">
            {language === 'ru' ? 'ЦИФРОВОЙ ЗВУКОВОЙ АРХИВ' : 'DIGITAL SOUND ARCHIVE'}
          </span>
        </div>

        {/* Right HUD metrics */}
        <div className="flex items-center space-x-3 text-technical-muted text-[10px]">
          <div className="hidden md:flex items-center space-x-2">
            <Radio size={11} className="text-signal-red animate-pulse" />
            <span>LOC: 55°45'N 37°37'E</span>
            <span className="text-void-700">//</span>
            <span className="text-signal-red font-bold">SIGNAL ACTIVE</span>
          </div>
          <div className="barcode-pattern w-16 h-3 opacity-70 hidden sm:block" />
        </div>
      </motion.div>

      {/* 02. Center Main Editorial Poster & Artwork Showcase */}
      <div className="w-full my-auto py-8 sm:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pointer-events-auto relative z-10">
        {/* Left: Expressive Layered Brand Typography & Editorial Text */}
        <div className="max-w-2xl relative z-10 w-full">
          {/* Genre & Role Strip with Y2K tactical icons */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[11px] sm:text-xs font-mono tracking-widest-tech text-technical-muted uppercase mb-3 flex flex-wrap items-center gap-2"
          >
            <span className="text-signal-red font-bold">[ + ]</span>
            <span className="text-technical-silver">
              {language === 'ru'
                ? 'МУЗЫКАЛЬНЫЙ ПРОДЮСЕР & ЗВУКОВОЙ АРХИТЕКТОР'
                : 'SOUND ARCHITECT & MUSIC PRODUCER'}
            </span>
            <span className="text-void-700 hidden sm:inline">//</span>
            <span className="text-signal-red hidden sm:inline">2023—2026</span>
            <Zap size={11} className="text-signal-red fill-signal-red hidden sm:inline" />
          </motion.div>

          {/* Massive Artist Wordmark with Ghost Underlay */}
          <div className="relative">
            {/* Ghost Wireframe Underlay */}
            <div
              aria-hidden="true"
              className="absolute -top-3 -left-1 font-sans font-black text-6xl sm:text-8xl lg:text-[10rem] tracking-tighter text-stroke-ghost leading-none select-none pointer-events-none opacity-40"
            >
              dYnex?
            </div>

            {/* Front Solid Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative font-sans font-black text-5xl sm:text-7xl lg:text-9xl tracking-tighter text-white leading-none mb-4"
            >
              dYnex<span className="text-signal-red">?</span>
            </motion.h1>
          </div>

          {/* Sound Manifesto Subhead with Japanese subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs sm:text-sm font-mono text-technical-silver tracking-widest space-y-2 mb-8"
          >
            <div className="flex items-center space-x-2 text-signal-red text-[11px] font-bold">
              <span>●</span>
              <span>PHONK • EXPERIMENTAL ELECTRONIC • BRAZILIAN DRIFT</span>
              <span className="text-technical-muted font-normal hidden sm:inline">// 音響宇宙</span>
            </div>
            <p className="text-technical-muted text-xs leading-relaxed max-w-lg">
              {language === 'ru'
                ? 'Самобытная пространственная вселенная, балансирующая между футуристичным электронным саундом и гипнотическим ритмом.'
                : 'A spatial sonic universe navigating between futuristic electronic soundscapes, dark phonk, and hypnotic rhythmic pressure.'}
            </p>
          </motion.div>

          {/* Action CTAs: Sharp Technical Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            {/* Primary CTA: Listen Featured */}
            <button
              onClick={() => setSelectedRelease(featuredRelease)}
              className="group relative px-6 py-3.5 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs tracking-widest uppercase rounded-none flex items-center space-x-3 transition-all duration-200 active:scale-95 shadow-signal-red-sharp"
            >
              <Play size={13} className="fill-white" />
              <span>{language === 'ru' ? 'СЛУШАТЬ РЕЛИЗ' : 'LISTEN NOW'}</span>
            </button>

            {/* Secondary CTA: Enter Archive */}
            <button
              onClick={handleEnterArchive}
              className="group px-5 py-3.5 bg-void-950/90 hover:bg-void-900 border border-void-800 hover:border-signal-red text-technical-light hover:text-signal-red font-mono text-xs tracking-widest uppercase rounded-none flex items-center space-x-2.5 transition-all duration-200 active:scale-95"
            >
              <span>{language === 'ru' ? 'ВОЙТИ В 3D АРХИВ' : 'ENTER 3D ARCHIVE'}</span>
              <ArrowDown size={14} className="text-signal-red group-hover:translate-y-0.5 transition-all" />
            </button>
          </motion.div>
        </div>

        {/* Right: Featured Release Tactical Poster Showcase (Layered Collage Card) */}
        {featuredRelease && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="w-full sm:w-auto relative flex flex-col items-start lg:items-end mt-4 lg:mt-0 z-20"
          >
            {/* Offset Red Shadow Frame for physical poster feel */}
            <div className="relative group max-w-sm w-full">
              {/* Back Offset Red Rim */}
              <div className="absolute -inset-1.5 bg-signal-red/30 border border-signal-red/60 -rotate-1 group-hover:rotate-0 transition-transform duration-300 pointer-events-none" />

              {/* Main Poster Container */}
              <div
                onClick={() => setSelectedRelease(featuredRelease)}
                className="tactical-border relative p-4 bg-void-950/95 backdrop-blur-xl border border-void-700 group-hover:border-signal-red transition-all duration-300 rounded-none cursor-pointer w-full"
              >
                {/* Header inside frame */}
                <div className="flex items-center justify-between text-[10px] font-mono text-technical-muted mb-3 border-b border-void-800 pb-2">
                  <div className="flex items-center space-x-1.5 text-signal-red">
                    <Disc3 size={11} className="animate-spin-slow" />
                    <span className="font-bold tracking-widest">
                      {language === 'ru' ? 'АКТУАЛЬНЫЙ РЕЛИЗ' : 'ACTIVE RELEASE'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-signal-red font-mono">
                    <Heart size={10} className="fill-signal-red/40 text-signal-red" />
                    <span>#{featuredRelease.year}</span>
                  </div>
                </div>

                {/* Artwork with subtle border */}
                <div className="relative aspect-square w-full rounded-none overflow-hidden border border-void-700 group-hover:border-signal-red transition-colors mb-3">
                  <img
                    src={featuredRelease.artworkUrl}
                    alt={featuredRelease.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-void-950/90 backdrop-blur-sm border border-signal-red text-[9px] font-mono text-signal-red font-bold">
                    VERIFIED
                  </div>
                  <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-void-950/80 text-[8px] font-mono text-technical-silver">
                    ISRC: {featuredRelease.isrc || 'DNX-2026-01'}
                  </div>
                </div>

                {/* Release Metadata Block */}
                <div className="font-mono text-xs space-y-1">
                  <div className="font-sans font-bold text-white text-lg group-hover:text-signal-red transition-colors truncate">
                    {featuredRelease.title}
                  </div>
                  <div className="text-technical-silver text-[11px] truncate">
                    {featuredRelease.artists}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-technical-muted pt-2 border-t border-void-800/80">
                    <span>GENRE: {featuredRelease.genre}</span>
                    <span className="text-signal-red font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                      <span>{language === 'ru' ? 'ОТКРЫТЬ' : 'OPEN'}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>

                {/* Barcode Accent */}
                <div className="barcode-pattern w-full h-2.5 mt-3 opacity-80" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Japanese Vertical Typography Strip (Desktop Decorator) */}
        <div className="hidden xl:flex absolute -right-8 top-1/2 -translate-y-1/2 flex-col items-center font-mono text-[9px] text-technical-muted tracking-widest uppercase writing-vertical border-l border-void-800/80 pl-2.5 space-y-4 opacity-60">
          <span>ダイネクス // 音響アーカイブ</span>
          <div className="barcode-pattern-silver w-2 h-16 opacity-50" />
          <span className="text-signal-red">ORBITAL FREQUENCY // 2026</span>
        </div>
      </div>

      {/* 03. Bottom Technical Telemetry & Spatial Guidance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] font-mono text-technical-muted border-t border-void-800/80 pt-3 pointer-events-auto gap-2 relative z-10"
      >
        <div className="flex items-center space-x-2">
          <Crosshair size={12} className="text-signal-red animate-pulse" />
          <span>
            {language === 'ru'
              ? 'СКРОЛЛ ДЛЯ ПЕРЕМЕЩЕНИЯ В 3D КАТАЛОГ'
              : 'SCROLL TO NAVIGATE THROUGH 3D ARCHIVE'}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-technical-silver">
          <span>SYS_STATUS: ACTIVE</span>
          <span className="text-void-700">//</span>
          <span className="text-signal-red">Z_ORIGIN: 0000</span>
        </div>
      </motion.div>
    </section>
  );
};
