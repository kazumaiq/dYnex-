import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  RotateCw,
  List,
  ChevronLeft,
  ChevronRight,
  Play,
  Disc3,
  MoveHorizontal,
  Sparkles,
  Heart
} from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const ArchiveSection: React.FC = () => {
  const {
    releases,
    selectedRelease,
    setSelectedRelease,
    archiveRotation,
    setArchiveRotation,
    setIsDraggingArchive,
    autoRotate,
    setAutoRotate,
    language,
    activeYearFilter,
    setActiveYearFilter,
    searchQuery,
    setSearchQuery,
  } = useArchive();

  const [showAccessibleList, setShowAccessibleList] = useState(false);
  const [isHoveredDragZone, setIsHoveredDragZone] = useState(false);

  // Filtered releases for accessible semantic view and search
  const filteredReleases = useMemo(() => {
    return releases.filter((r) => {
      if (r.published === false) return false;
      if (activeYearFilter && r.year !== activeYearFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.artists.toLowerCase().includes(q) ||
          r.genre.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [releases, activeYearFilter, searchQuery]);

  const publishedReleases = useMemo(() => {
    return releases.filter(r => r.published !== false);
  }, [releases]);

  const totalReleases = publishedReleases.length || 1;
  const angleStep = (2 * Math.PI) / totalReleases;

  // Compute active release currently facing the camera
  const activeIndex = useMemo(() => {
    const normalized = ((-archiveRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
    return Math.min(
      totalReleases - 1,
      Math.max(0, Math.round(normalized / angleStep) % totalReleases)
    );
  }, [archiveRotation, angleStep, totalReleases]);

  const currentCenterRelease = publishedReleases[activeIndex] || publishedReleases[0];

  // Drag interaction state with inertia
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(Date.now());
  const velocity = useRef(0);
  const totalDragDist = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Inertia decay loop
  const runInertia = () => {
    if (Math.abs(velocity.current) > 0.0002) {
      setArchiveRotation((prev) => prev + velocity.current);
      velocity.current *= 0.93; // smooth friction
      animationFrameId.current = requestAnimationFrame(runInertia);
    } else {
      velocity.current = 0;
      animationFrameId.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    isPointerDown.current = true;
    startX.current = e.clientX;
    lastX.current = e.clientX;
    lastTime.current = Date.now();
    velocity.current = 0;
    totalDragDist.current = 0;
    setIsDraggingArchive(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;

    const currentX = e.clientX;
    const dx = currentX - lastX.current;
    const now = Date.now();
    const dt = Math.max(1, now - lastTime.current);

    totalDragDist.current += Math.abs(dx);
    velocity.current = (dx / dt) * 0.006;
    lastX.current = currentX;
    lastTime.current = now;

    // Direct rotation update (adapted for desktop & mobile touch)
    setArchiveRotation((prev) => prev + dx * 0.0065);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    setIsDraggingArchive(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // If tap/click with minimal movement, open the center release modal
    if (totalDragDist.current < 8 && currentCenterRelease) {
      setSelectedRelease(currentCenterRelease);
      return;
    }

    // Launch momentum inertia
    if (Math.abs(velocity.current) > 0.0005) {
      animationFrameId.current = requestAnimationFrame(runInertia);
    }
  };

  // Step rotation controls
  const handleStep = (direction: number) => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    velocity.current = 0;
    // direction > 0: next release; direction < 0: prev release
    setArchiveRotation((prev) => prev - direction * angleStep);
  };

  // Scrub bar direct change
  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setArchiveRotation(-idx * angleStep);
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const years = [2026, 2025, 2024, 2023];

  return (
    <section
      id="archive"
      className="relative w-full px-4 sm:px-8 lg:px-12 scroll-mt-20 pt-24 sm:pt-28 pb-12 flex flex-col justify-start pointer-events-none select-none max-w-7xl mx-auto space-y-4 sm:space-y-6 overflow-hidden"
    >
      {/* Background Cyberpunk Collage Elements (Consistent Across Entire Site) */}
      <div className="hidden sm:block absolute -left-12 top-20 w-72 lg:w-96 h-auto pointer-events-none opacity-30 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-lily-botanical.jpg"
          alt="Botanical Lily Backdrop"
          className="w-full h-auto object-contain filter contrast-125"
        />
      </div>

      <div className="hidden md:block absolute -right-12 top-10 w-80 lg:w-[32rem] h-auto pointer-events-none opacity-25 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-anby-character.jpg"
          alt="Anime Character Backdrop"
          className="w-full h-auto object-contain filter contrast-125"
        />
      </div>

      <div className="hidden lg:block absolute bottom-2 right-1/4 w-60 h-auto pointer-events-none opacity-30 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-roses-bottom.jpg"
          alt="Dark Roses Backdrop"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* 01. Top Section Header & Search/Filter Controls */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-3 pointer-events-auto relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-1 sm:mb-2">
            <Sparkles size={12} className="text-signal-red" />
            <span className="font-bold">// 02</span>
            <span>{language === 'ru' ? 'ОРБИТАЛЬНЫЙ АРХИВ МУЗЫКИ' : 'ORBITAL RELEASE ARCHIVE'}</span>
            <span className="text-technical-muted hidden sm:inline">✦ 軌道シリンダー</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
            {language === 'ru' ? 'КАТАЛОГ РЕЛИЗОВ' : 'RELEASE CATALOG'}
          </h2>
        </div>

        {/* Filter & Search Bar with Clean Mobile Wrapping */}
        <div className="flex flex-wrap items-center gap-2 bg-void-950/90 backdrop-blur-md p-2 border border-void-700 rounded-none w-full md:w-auto">
          {/* Year Buttons with Horizontal Scroll on small phones */}
          <div className="flex items-center space-x-1 pr-2 shrink-0 border-r border-void-800">
            <button
              onClick={() => setActiveYearFilter(null)}
              className={`px-2.5 py-1 text-[11px] sm:text-xs font-mono rounded-none transition-all shrink-0 ${
                activeYearFilter === null
                  ? 'bg-signal-red text-white shadow-signal-red-sharp font-bold'
                  : 'text-technical-muted hover:text-signal-red'
              }`}
            >
              {language === 'ru' ? 'ВСЕ' : 'ALL'}
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setActiveYearFilter(activeYearFilter === y ? null : y)}
                className={`px-2 py-1 text-[11px] sm:text-xs font-mono rounded-none transition-all shrink-0 ${
                  activeYearFilter === y
                    ? 'bg-signal-red text-white shadow-signal-red-sharp font-bold'
                    : 'text-technical-muted hover:text-signal-red'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[110px] sm:w-40 flex items-center">
            <Search size={13} className="absolute left-2 text-technical-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ru' ? 'Поиск...' : 'Search...'}
              className="w-full bg-void-900 border border-void-800 text-[11px] sm:text-xs font-mono text-technical-light pl-7 pr-2 py-1 rounded-none focus:outline-none focus:border-signal-red placeholder:text-technical-muted/60 transition-colors"
            />
          </div>

          {/* Accessible List Toggle */}
          <button
            onClick={() => setShowAccessibleList(!showAccessibleList)}
            className={`p-1.5 border rounded-none transition-colors shrink-0 ${
              showAccessibleList
                ? 'bg-signal-red text-white border-signal-red shadow-signal-red-sharp'
                : 'bg-void-900 border-void-800 text-technical-muted hover:text-signal-red'
            }`}
            title={language === 'ru' ? 'Текстовый список релизов' : 'Accessible release list'}
            aria-label="Переключить текстовый список релизов"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Accessible Semantic Release List View */}
      {showAccessibleList && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          className="tactical-border p-4 sm:p-6 bg-void-950/95 backdrop-blur-xl border border-void-700 rounded-none pointer-events-auto max-h-[55vh] overflow-y-auto shadow-2xl z-20"
        >
          <div className="text-xs font-mono text-technical-muted uppercase tracking-widest mb-4 flex justify-between items-center border-b border-void-800 pb-2">
            <span className="text-signal-red font-bold flex items-center gap-1.5">
              <Sparkles size={11} />
              {language === 'ru' ? 'ЦИФРОВАЯ БАЗА РЕЛИЗОВ // КАТАЛОГ' : 'ARCHIVED MUSIC DATABASE // CATALOG'}
            </span>
            <span className="text-white font-bold">{filteredReleases.length} {language === 'ru' ? 'РЕЛИЗОВ' : 'RELEASES'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredReleases.map((r, i) => (
              <div
                key={r.id}
                onClick={() => setSelectedRelease(r)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedRelease(r);
                  }
                }}
                tabIndex={0}
                role="button"
                className="flex items-center space-x-3 p-3 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red rounded-none cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-signal-red group"
              >
                <div className="relative w-12 h-12 rounded-none overflow-hidden border border-void-700 shrink-0 group-hover:border-signal-red transition-colors">
                  <img
                    src={r.artworkUrl}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-0 left-0 bg-void-950/90 text-[8px] font-mono text-signal-red px-1">
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="overflow-hidden font-mono flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-signal-red transition-colors truncate font-sans">
                    {r.title}
                  </div>
                  <div className="text-[10px] text-technical-silver truncate mt-0.5">{r.artists}</div>
                  <div className="text-[9px] text-technical-muted mt-1 flex items-center justify-between">
                    <span className="text-signal-red font-bold">DNX-{String(i + 1).padStart(3, '0')}</span>
                    <span>{r.year} // {r.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 02. Interactive 3D Orbit Touch & Drag Zone with Dedicated Vertical Space */}
      <div
        className="w-full h-60 sm:h-72 md:h-84 relative flex flex-col items-center justify-center pointer-events-auto touch-pan-y cursor-grab active:cursor-grabbing select-none my-2 sm:my-4"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHoveredDragZone(true)}
        onMouseLeave={() => setIsHoveredDragZone(false)}
      >
        {/* Targeting Reticle & Radar Wireframe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-void-700/60 border-dashed" />
          <div className="absolute w-36 h-36 sm:w-56 sm:h-56 rounded-full border border-signal-red/30" />
          <div className="absolute text-[8px] font-mono text-technical-muted top-2 left-2">
            [ RADIAL TRACKING // CYLINDER 360° ]
          </div>
          <div className="absolute text-[8px] font-mono text-signal-red bottom-2 right-2">
            Z-TARGET: -1150
          </div>
        </div>

        {/* Touch drag guidance overlay */}
        <div
          className={`flex items-center space-x-2 px-3 py-1 bg-void-950/85 border border-void-800 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-technical-silver transition-opacity duration-300 pointer-events-none mt-auto mb-1 z-10 ${
            isHoveredDragZone ? 'opacity-90' : 'opacity-60 sm:opacity-30'
          }`}
        >
          <MoveHorizontal size={13} className="text-signal-red animate-pulse" />
          <span>
            {language === 'ru' ? 'СМАХНИТЕ ДЛЯ ВРАЩЕНИЯ 3D АРХИВА' : 'SWIPE TO ROTATE 3D ARCHIVE'}
          </span>
        </div>
      </div>

      {/* 03. Tactical 3D Orbit Controller & Telemetry Deck (Clean Mobile Separation) */}
      <div className="w-full flex flex-col gap-2.5 pointer-events-auto">
        {/* Top bar: Active Release HUD & Quick Open Button */}
        {currentCenterRelease && (
          <div className="w-full flex items-center justify-between gap-3 p-2.5 sm:p-3 bg-void-950/95 backdrop-blur-md border border-void-700 rounded-none shadow-subtle-card">
            {/* Center release meta */}
            <div
              className="flex items-center space-x-3 overflow-hidden flex-1 cursor-pointer group"
              onClick={() => setSelectedRelease(currentCenterRelease)}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-none overflow-hidden border border-void-700 shrink-0 group-hover:border-signal-red transition-colors">
                <img
                  src={currentCenterRelease.artworkUrl}
                  alt={currentCenterRelease.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden font-mono text-xs min-w-0">
                <div className="flex items-center space-x-1.5 text-[10px] text-signal-red">
                  <Disc3 size={10} className="text-signal-red animate-spin-slow shrink-0" />
                  <span className="font-bold">#{String(activeIndex + 1).padStart(2, '0')}/{totalReleases}</span>
                  <span className="text-technical-muted">• {currentCenterRelease.year}</span>
                </div>
                <div className="font-bold text-white text-xs sm:text-sm truncate font-sans group-hover:text-signal-red transition-colors">
                  {currentCenterRelease.title}
                </div>
                <div className="text-technical-muted text-[10px] sm:text-[11px] truncate">
                  {currentCenterRelease.artists}
                </div>
              </div>
            </div>

            {/* Quick Open Modal Button */}
            <button
              onClick={() => setSelectedRelease(currentCenterRelease)}
              className="px-3.5 sm:px-4 py-2 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-[11px] sm:text-xs tracking-wider uppercase rounded-none flex items-center space-x-1.5 transition-all shrink-0 active:scale-95 shadow-signal-red-sharp"
            >
              <Play size={11} className="fill-white" />
              <span>{language === 'ru' ? 'СЛУШАТЬ' : 'PLAY'}</span>
            </button>
          </div>
        )}

        {/* Bottom bar: Tactile Next/Prev Buttons + Scrubber (Stacked cleanly on mobile) */}
        <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2.5 bg-void-950/90 backdrop-blur-md border border-void-800 rounded-none text-xs font-mono">
          {/* Controls Row */}
          <div className="flex items-center justify-between sm:justify-start space-x-2 shrink-0">
            <button
              onClick={() => handleStep(-1)}
              className="px-3 py-2 min-h-[38px] bg-void-900 hover:bg-void-850 border border-void-800 hover:border-signal-red text-technical-light hover:text-signal-red transition-all rounded-none flex items-center space-x-1 active:scale-95 flex-1 sm:flex-initial justify-center"
              title={language === 'ru' ? 'Предыдущий релиз' : 'Previous release'}
              aria-label="Previous release"
            >
              <ChevronLeft size={16} className="text-signal-red" />
              <span>{language === 'ru' ? 'НАЗАД' : 'PREV'}</span>
            </button>

            <button
              onClick={() => handleStep(1)}
              className="px-3 py-2 min-h-[38px] bg-void-900 hover:bg-void-850 border border-void-800 hover:border-signal-red text-technical-light hover:text-signal-red transition-all rounded-none flex items-center space-x-1 active:scale-95 flex-1 sm:flex-initial justify-center"
              title={language === 'ru' ? 'Следующий релиз' : 'Next release'}
              aria-label="Next release"
            >
              <span>{language === 'ru' ? 'ВПЕРЁД' : 'NEXT'}</span>
              <ChevronRight size={16} className="text-signal-red" />
            </button>

            {/* Auto-rotate button */}
            <button
              onClick={() => setAutoRotate((prev) => !prev)}
              className={`px-3 py-2 min-h-[38px] border rounded-none transition-all flex items-center space-x-1 active:scale-95 text-[10px] sm:text-xs flex-1 sm:flex-initial justify-center ${
                autoRotate
                  ? 'bg-signal-red text-white border-signal-red shadow-signal-red-sharp font-bold'
                  : 'bg-void-900 border-void-800 text-technical-silver hover:border-signal-red hover:text-white'
              }`}
              title={language === 'ru' ? 'Включить / выключить автовращение' : 'Toggle auto-rotation'}
            >
              <RotateCw size={12} className={autoRotate ? 'animate-spin' : ''} />
              <span>{autoRotate ? (language === 'ru' ? 'АВТО' : 'ON') : (language === 'ru' ? 'АВТО' : 'OFF')}</span>
            </button>
          </div>

          {/* Scrubber Slider on dedicated line on mobile */}
          <div className="flex items-center space-x-3 px-1 py-1 w-full sm:flex-1 sm:min-w-[140px]">
            <input
              type="range"
              min="0"
              max={totalReleases - 1}
              value={activeIndex}
              onChange={handleScrubberChange}
              className="w-full h-2 bg-void-800 rounded-none appearance-none cursor-pointer accent-signal-red focus:outline-none"
              aria-label="Перемотка 3D каталога"
            />
            <span className="text-[11px] text-technical-silver font-mono shrink-0 w-10 text-right">
              {activeIndex + 1}/{totalReleases}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
