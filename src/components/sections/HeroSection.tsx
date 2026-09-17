import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowDown, Disc3, Radio, Crosshair, Zap, Heart, Sparkles } from 'lucide-react';
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
      className="relative min-h-screen w-full flex flex-col justify-between px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-6 pointer-events-none select-none max-w-7xl mx-auto overflow-hidden"
    >
      {/* 00. Master Cyberpunk Collage Backdrop (Matches User Mockup Exactly) */}
      <div className="absolute inset-0 pointer-events-none opacity-80 sm:opacity-90 mix-blend-screen z-0 overflow-hidden">
        <img
          src="/assets/collage/hero-master-bg-empty.jpg"
          alt="dYnex? Cyberpunk Collage Backdrop"
          className="w-full h-full object-cover object-center filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void-950/60 via-transparent to-void-950/90" />
      </div>

      {/* 00a. High-Resolution Left Botanical Lily Layer */}
      <div className="hidden sm:block absolute -left-4 top-12 w-64 sm:w-80 lg:w-96 h-auto pointer-events-none opacity-85 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-lily-botanical.jpg"
          alt="Botanical Lily"
          className="w-full h-auto object-contain filter contrast-125 drop-shadow-[0_0_25px_rgba(230,25,36,0.3)]"
        />
      </div>

      {/* 00b. High-Resolution Right Anime Character Layer (Anby Demara Style) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-72 sm:w-[28rem] lg:w-[38rem] h-[34rem] sm:h-[44rem] lg:h-[50rem] pointer-events-none opacity-75 sm:opacity-90 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-anby-character.jpg"
          alt="Anime Tactical Character"
          className="w-full h-full object-contain object-right filter contrast-125"
        />
      </div>

      {/* 00c. Bottom Center Roses Layer */}
      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-12 w-64 lg:w-80 h-auto pointer-events-none opacity-80 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-roses-bottom.jpg"
          alt="Dark Roses"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Floating Sparkles & Accents */}
      <div className="absolute top-1/4 left-1/3 text-signal-red font-mono text-sm pointer-events-none select-none animate-pulse opacity-70 z-0">
        ✦
      </div>
      <div className="absolute top-1/2 right-1/4 text-white font-mono text-xs pointer-events-none select-none animate-ping opacity-50 z-0">
        ✧
      </div>

      {/* 01. Top Tactical HUD */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex items-center justify-between font-mono text-[10px] sm:text-xs text-technical-silver pointer-events-auto border-b border-void-800/80 pb-2.5 relative z-10"
      >
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-signal-red animate-ping" />
          <span className="font-bold text-signal-red tracking-widest-tech uppercase flex items-center gap-1.5">
            <Sparkles size={11} />
            {language === 'ru' ? 'ЗОНА 01 // 3D АРХИВ' : 'ZONE 01 // 3D ARCHIVE'}
          </span>
          <span className="text-void-700 hidden sm:inline">|</span>
          <span className="text-technical-muted hidden sm:inline tracking-wider">
            {language === 'ru' ? 'ЗВУКОВОЙ ПОРТАЛ' : 'SONIC PORTAL'}
          </span>
        </div>

        {/* Right HUD metrics */}
        <div className="flex items-center space-x-3 text-technical-muted text-[10px]">
          <div className="flex items-center space-x-2">
            <Radio size={11} className="text-signal-red animate-pulse" />
            <span>LOC: 34°41'N 73°56'E</span>
            <span className="text-void-700 hidden sm:inline">//</span>
            <span className="text-signal-red font-bold hidden sm:inline">ONLINE // 10</span>
          </div>
          <div className="barcode-pattern w-14 sm:w-16 h-2.5 sm:h-3 opacity-80" />
        </div>
      </motion.div>

      {/* 02. Center Main Editorial Poster & Anime Showcase */}
      <div className="w-full my-auto py-4 sm:py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pointer-events-auto relative z-10">
        {/* Left: Expressive Layered Brand Typography */}
        <div className="max-w-2xl relative z-10 w-full space-y-3.5">
          {/* Header Subtitle Badge: [■ МУЗЫКАЛЬНЫЙ ПРОДЮСЕР & ЗВУКОВОЙ АРХИТЕКТОР 2023 ->] */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest text-technical-silver"
          >
            <span className="w-2.5 h-2.5 bg-white inline-block shrink-0" />
            <span className="font-bold tracking-widest text-white">
              {language === 'ru'
                ? 'МУЗЫКАЛЬНЫЙ ПРОДЮСЕР & ЗВУКОВОЙ АРХИТЕКТОР'
                : 'MUSIC PRODUCER & SOUND ARCHITECT'}
            </span>
            <span className="text-signal-red font-bold ml-1">2023 →</span>
          </motion.div>

          {/* Massive Artist Wordmark: dYnex? */}
          <div className="relative py-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-sans font-black text-6xl sm:text-8xl lg:text-[7.5rem] tracking-tighter text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
            >
              dYnex<span className="text-signal-red">?</span>
            </motion.h1>
          </div>

          {/* Genre Line: [● PHONK • EXPERIMENTAL ELECTRONIC • BRAZILIAN FUNK] */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono tracking-widest text-technical-silver uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-signal-red inline-block shrink-0" />
            <span className="font-bold tracking-wider text-technical-light">
              PHONK • EXPERIMENTAL ELECTRONIC • BRAZILIAN FUNK
            </span>
          </motion.div>

          {/* Sound Manifesto Paragraph */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xs sm:text-sm font-mono text-technical-muted leading-relaxed max-w-lg"
          >
            {language === 'ru'
              ? 'Самобытная пространственная вселенная, балансирующая между футуристичным электронным саундом и гипнотической ритмикой.'
              : 'A spatial sonic universe navigating between futuristic electronic soundscapes, dark phonk, and hypnotic rhythmic pressure.'}
          </motion.p>

          {/* Action CTAs: Matches User Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2"
          >
            {/* Primary CTA: Solid Signal Red Button */}
            <button
              onClick={() => setSelectedRelease(featuredRelease)}
              className="group px-6 py-3.5 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs font-bold tracking-widest uppercase rounded-none flex items-center space-x-2.5 transition-all duration-200 active:scale-95 shadow-signal-red-sharp"
            >
              <Play size={13} className="fill-white" />
              <span>{language === 'ru' ? 'СЛУШАТЬ РЕЛИЗ' : 'LISTEN NOW'}</span>
            </button>

            {/* Secondary CTA: Border Button */}
            <button
              onClick={handleEnterArchive}
              className="group px-5 py-3.5 bg-void-950/90 hover:bg-void-900 border border-void-700 hover:border-signal-red text-technical-light hover:text-white font-mono text-xs tracking-widest uppercase rounded-none flex items-center space-x-2 transition-all duration-200 active:scale-95"
            >
              <span>{language === 'ru' ? 'ВОЙТИ В 3D АРХИВ' : 'ENTER 3D ARCHIVE'}</span>
              <ArrowDown size={14} className="text-signal-red group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Bottom Catalog Scroll Hint: [ СКРОЛЛ ДЛЯ ДЕТАЛЕЙ / КАТАЛОГ ] */}
          <div className="pt-2 text-[10px] font-mono text-technical-muted tracking-widest uppercase flex items-center gap-1.5">
            <span className="text-signal-red font-bold">[</span>
            <span>{language === 'ru' ? 'СКРОЛЛ ДЛЯ ДЕТАЛЕЙ / КАТАЛОГ' : 'SCROLL FOR DETAILS / CATALOG'}</span>
            <span className="text-signal-red font-bold">]</span>
          </div>

          {/* Bottom Left Technical Telemetry Box (ZONA 01, Barcode, Coordinates) */}
          <div className="pt-3 hidden sm:flex items-center space-x-4 text-[9px] font-mono text-technical-muted">
            <div className="flex items-center space-x-2">
              <span className="text-signal-red font-black text-sm">Z</span>
              <div>
                <div className="text-signal-red font-bold">ZONA 01 // ORBITAL ENTRY</div>
                <div>34° 41' N / 73° 56' E • CXR 2024-2026</div>
              </div>
            </div>
            <div className="barcode-pattern w-20 h-4 opacity-70" />
          </div>
        </div>

        {/* Right: Featured Release Card Styled Exactly Like User Mockup */}
        {featuredRelease && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="w-full sm:w-auto relative flex flex-col items-start lg:items-end mt-4 lg:mt-0 z-20"
          >
            <div className="relative group max-w-sm w-full">
              {/* Back Offset Red Rim for Tactical Feeling */}
              <div className="absolute -inset-1 bg-signal-red/25 border border-signal-red/50 pointer-events-none" />

              {/* Main Card Container */}
              <div
                onClick={() => setSelectedRelease(featuredRelease)}
                className="tactical-border relative p-3.5 sm:p-4 bg-void-950/95 backdrop-blur-2xl border border-void-700 group-hover:border-signal-red transition-all duration-300 rounded-none cursor-pointer w-full shadow-2xl"
              >
                {/* Header Row: АКТУАЛЬНЫЙ РЕЛИЗ #2026 FEATURED */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-3 border-b border-void-800 pb-2">
                  <span className="text-technical-muted uppercase tracking-wider font-bold">
                    {language === 'ru' ? 'АКТУАЛЬНЫЙ РЕЛИЗ' : 'ACTIVE RELEASE'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-technical-silver font-mono">#2026</span>
                    <span className="px-1.5 py-0.5 bg-signal-red text-white text-[9px] font-bold uppercase">
                      FEATURED
                    </span>
                  </div>
                </div>

                {/* Release Artwork Container */}
                <div className="relative aspect-square w-full rounded-none overflow-hidden border border-void-700 group-hover:border-signal-red transition-colors mb-3">
                  <img
                    src={featuredRelease.artworkUrl}
                    alt={featuredRelease.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Release Metadata Block */}
                <div className="font-mono space-y-1.5">
                  <div className="font-sans font-black text-white text-xl group-hover:text-signal-red transition-colors truncate">
                    {featuredRelease.title}
                  </div>
                  <div className="text-technical-silver text-xs truncate">
                    {featuredRelease.artists}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-technical-muted pt-2 border-t border-void-800/80">
                    <span className="uppercase">GENRE: {featuredRelease.genre}</span>
                    <span className="text-signal-red font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                      <span>{language === 'ru' ? 'ОТКРЫТЬ' : 'OPEN'}</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>

                {/* Red Audio Waveform Equalizer Bar at Card Bottom (From Mockup) */}
                <div className="w-full flex items-center space-x-0.5 mt-3 pt-2 border-t border-void-800/80">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-signal-red"
                      style={{
                        height: `${Math.max(3, (Math.sin(i * 0.45) * 0.5 + 0.5) * 14)}px`,
                        opacity: 0.6 + (i % 3) * 0.15,
                      }}
                    />
                  ))}
                </div>
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
          <span className="text-signal-red font-bold">Z_ORIGIN: 0000 ✦</span>
        </div>
      </motion.div>
    </section>
  );
};
