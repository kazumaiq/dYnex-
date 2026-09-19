import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Disc3, Radio, Crosshair, Zap, Heart, Sparkles } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { PosterCutout } from '../collage/PosterCutout';

export const HeroSection: React.FC = React.memo(() => {
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
      {/* 00. Atmospheric Cyberpunk Anime City Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <img
          src="/assets/anime/city-backdrop.jpg"
          alt="Neo Tokyo Phonk City"
          decoding="async"
          className="w-full h-full object-cover object-center filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-950 via-void-950/70 to-transparent" />
      </div>

      {/* 00b. Prominent 4K Anime Character Pilot (Hidden on mobile to prevent text collision, prominent on desktop) */}
      <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-0 sm:right-6 lg:right-16 w-72 sm:w-[28rem] lg:w-[38rem] h-[34rem] sm:h-[42rem] lg:h-[50rem] pointer-events-none opacity-60 sm:opacity-85 z-0">
        <PosterCutout
          src="/assets/anime/hero-character.jpg"
          alt="dYnex Anime Pilot Character"
          maskType="radial"
          cropPosition="center 20%"
          className="w-full h-full"
        />
      </div>

      {/* Floating Anime Sparkles & Light Points */}
      <div className="absolute top-1/4 left-1/3 text-signal-red font-mono text-sm pointer-events-none select-none animate-pulse opacity-70 z-0">
        ✦
      </div>
      <div className="absolute top-1/2 right-1/4 text-white font-mono text-xs pointer-events-none select-none animate-ping opacity-50 z-0">
        ✧
      </div>
      <div className="absolute bottom-1/3 left-1/4 text-signal-red font-mono text-xs pointer-events-none select-none opacity-60 z-0">
        ★
      </div>

      {/* 01. Top Tactical HUD & Coordinate Telemetry */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex items-center justify-between font-mono text-[10px] sm:text-xs text-technical-silver pointer-events-auto border-b border-void-800 pb-3 relative z-10"
      >
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-signal-red animate-ping" />
          <span className="font-bold text-signal-red tracking-widest-tech uppercase flex items-center gap-1.5">
            <Sparkles size={11} />
            {language === 'ru' ? 'ЗОНА 01 // АНИМЕ АРХИВ' : 'ZONE 01 // ANIME ARCHIVE'}
          </span>
          <span className="text-void-700 hidden sm:inline">|</span>
          <span className="text-technical-muted hidden sm:inline tracking-wider">
            {language === 'ru' ? 'ЦИФРОВОЙ ЗВУКОВОЙ ПОРТАЛ' : 'DIGITAL SONIC PORTAL'}
          </span>
        </div>

        {/* Right HUD metrics */}
        <div className="flex items-center space-x-3 text-technical-muted text-[10px]">
          <div className="flex items-center space-x-2">
            <Radio size={11} className="text-signal-red animate-pulse" />
            <span>LOC: 55°45'N 37°37'E</span>
            <span className="text-void-700 hidden sm:inline">//</span>
            <span className="text-signal-red font-bold hidden sm:inline">BROADCAST ACTIVE</span>
          </div>
          <div className="barcode-pattern w-14 sm:w-16 h-2.5 sm:h-3 opacity-80" />
        </div>
      </motion.div>

      {/* 02. Center Main Editorial Poster & Anime Showcase */}
      <div className="w-full my-auto py-6 sm:py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 pointer-events-auto relative z-10">
        {/* Left: Expressive Layered Brand Typography & Anime Profile Info */}
        <div className="max-w-2xl relative z-10 w-full space-y-4">
          {/* Genre & Role Strip with anime badges */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[11px] sm:text-xs font-mono tracking-widest-tech uppercase flex flex-wrap items-center gap-2"
          >
            <span className="px-2 py-0.5 bg-signal-red text-white font-bold text-[10px]">
              dYnex? STUDIO
            </span>
            <span className="text-technical-silver">
              {language === 'ru'
                ? 'МУЗЫКАЛЬНЫЙ ПРОДЮСЕР & ЗВУКОВОЙ АРХИТЕКТОР'
                : 'SOUND ARCHITECT & MUSIC PRODUCER'}
            </span>
            <span className="text-signal-red flex items-center gap-1 font-bold">
              <Zap size={11} className="fill-signal-red" /> 2023—2026
            </span>
          </motion.div>

          {/* Massive Artist Wordmark with Ghost Underlay */}
          <div className="relative my-2">
            {/* Ghost Wireframe Underlay */}
            <div
              aria-hidden="true"
              className="absolute -top-3 -left-1 font-sans font-black text-6xl sm:text-8xl lg:text-[10rem] tracking-tighter text-stroke-ghost leading-none select-none pointer-events-none opacity-45"
            >
              dYnex?
            </div>

            {/* Front Solid Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative font-sans font-black text-5xl sm:text-7xl lg:text-9xl tracking-tighter text-white leading-none"
            >
              dYnex<span className="text-signal-red">?</span>
            </motion.h1>
          </div>

          {/* Anime Character Profile Telemetry Box (Desktop only to prevent mobile vertical clutter) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="hidden sm:block p-3.5 sm:p-4 bg-void-950/98 border border-signal-red/60 shadow-poster-red-offset max-w-xl"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-signal-red uppercase pb-1.5 mb-2 border-b border-void-800">
              <span className="font-bold flex items-center gap-1">
                <Heart size={10} className="fill-signal-red" /> ARCHIVE PILOT // プロデューサー
              </span>
              <span className="text-technical-silver font-bold">ATTRIBUTE: ELECTRIC ⚡</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[10px] text-technical-silver">
              <div>
                <span className="text-technical-muted block">STYLE:</span>
                <span className="text-white font-bold">DRIFT & PHONK</span>
              </div>
              <div>
                <span className="text-technical-muted block">SYNTHESIS:</span>
                <span className="text-white font-bold">DARK ELECTRONIC</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-technical-muted block">STATUS:</span>
                <span className="text-signal-red font-bold">VERIFIED MASTER</span>
              </div>
            </div>
          </motion.div>

          {/* Sound Manifesto Subhead with Japanese subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs sm:text-sm font-mono text-technical-silver tracking-widest space-y-1.5"
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
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
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

        {/* Right: Featured Release Tactical Anime Poster Showcase */}
        {featuredRelease && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="w-full sm:w-auto relative flex flex-col items-start lg:items-end mt-4 lg:mt-0 z-20"
          >
            {/* Offset Red Shadow Frame for physical poster feel */}
            <div className="relative group max-w-[310px] sm:max-w-sm w-full mx-auto">
              {/* Back Offset Red Rim (Desktop only to avoid mobile viewport overflow) */}
              <div className="hidden sm:block absolute -inset-1.5 bg-signal-red/30 border border-signal-red/60 -rotate-1 group-hover:rotate-0 transition-transform duration-300 pointer-events-none" />

              {/* Main Poster Container */}
              <div
                onClick={() => setSelectedRelease(featuredRelease)}
                className="tactical-border relative p-3 sm:p-4 bg-void-950/98 border border-void-700 group-hover:border-signal-red transition-all duration-300 rounded-none cursor-pointer w-full shadow-2xl"
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
                    <Heart size={10} className="fill-signal-red text-signal-red" />
                    <span>#{featuredRelease.year}</span>
                  </div>
                </div>

                {/* Artwork with subtle border */}
                <div className="relative aspect-square w-full rounded-none overflow-hidden border border-void-700 group-hover:border-signal-red transition-colors mb-3">
                  <img
                    src={featuredRelease.artworkUrl}
                    alt={featuredRelease.title}
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-void-950/90 border border-signal-red text-[9px] font-mono text-signal-red font-bold flex items-center gap-1">
                    <Sparkles size={9} />
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
        <div className="hidden xl:flex absolute -right-8 top-1/2 -translate-y-1/2 flex-col items-center font-mono text-[9px] text-technical-muted tracking-widest uppercase writing-vertical border-l border-void-800/80 pl-2.5 space-y-4 opacity-75">
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
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] font-mono text-technical-muted border-t border-void-800/80 pt-3 mt-8 pointer-events-auto gap-2 relative z-10"
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
          <span className="text-signal-red font-bold">Z_ORIGIN: 0000 ✦</span>
        </div>
      </motion.div>
    </section>
  );
});
