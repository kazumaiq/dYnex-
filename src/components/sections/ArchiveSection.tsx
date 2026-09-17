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
  Sliders,
  MoveHorizontal
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
      className="relative min-h-screen w-full px-4 sm:px-8 lg:px-12 scroll-mt-20 pt-24 sm:pt-28 pb-6 sm:pb-10 flex flex-col justify-between pointer-events-none select-none max-w-7xl mx-auto"
    >
      {/* 01. Top Section Header & Search/Filter Controls */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-3 pointer-events-auto">
        <div>
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-1 sm:mb-2">
            <span className="text-cyber-purple-glow">// 02</span>
            <span>{language === 'ru' ? 'ОРБИТАЛЬНЫЙ АРХИВ МУЗЫКИ' : 'ORBITAL RELEASE ARCHIVE'}</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white uppercase">
            {language === 'ru' ? 'КАТАЛОГ РЕЛИЗОВ' : 'RELEASE CATALOG'}
          </h2>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-void-950/90 backdrop-blur-md p-1.5 sm:p-2.5 border border-void-800 rounded-sm w-full md:w-auto overflow-hidden">
          {/* Year Buttons */}
          <div className="flex items-center space-x-1 border-r border-void-800 pr-1.5 sm:pr-2.5 shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveYearFilter(null)}
              className={`px-2 py-1 text-[11px] sm:text-xs font-mono rounded-sm transition-all shrink-0 ${
                activeYearFilter === null
                  ? 'bg-gradient-to-r from-signal-red to-cyber-purple-deep text-white shadow-[0_0_10px_rgba(230,25,36,0.3)]'
                  : 'text-technical-muted hover:text-cyber-purple-glow'
              }`}
            >
              {language === 'ru' ? 'ВСЕ' : 'ALL'}
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setActiveYearFilter(activeYearFilter === y ? null : y)}
                className={`px-2 py-1 text-[11px] sm:text-xs font-mono rounded-sm transition-all shrink-0 ${
                  activeYearFilter === y
                    ? 'bg-gradient-to-r from-signal-red to-cyber-purple-deep text-white shadow-[0_0_10px_rgba(230,25,36,0.3)]'
                    : 'text-technical-muted hover:text-cyber-purple-glow'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-36 lg:w-44 flex items-center min-w-[70px]">
            <Search size={13} className="absolute left-2 text-technical-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ru' ? 'Поиск...' : 'Search...'}
              className="w-full bg-void-900 border border-void-800 text-[11px] sm:text-xs font-mono text-technical-light pl-7 pr-2 py-1 rounded-sm focus:outline-none focus:border-cyber-purple placeholder:text-technical-muted/60 transition-colors"
            />
          </div>

          {/* Accessible List Toggle */}
          <button
            onClick={() => setShowAccessibleList(!showAccessibleList)}
            className={`p-1.5 border rounded-sm transition-colors shrink-0 ${
              showAccessibleList
                ? 'bg-cyber-purple text-white border-cyber-purple shadow-cyber-purple-glow'
                : 'bg-void-900 border-void-800 text-technical-muted hover:text-cyber-purple-glow'
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="tactical-border my-6 p-5 sm:p-6 bg-void-950/95 backdrop-blur-xl border border-void-800 rounded-sm pointer-events-auto max-h-[60vh] overflow-y-auto shadow-2xl z-20"
        >
          <div className="text-xs font-mono text-technical-muted uppercase tracking-widest mb-4 flex justify-between items-center border-b border-void-800 pb-2">
            <span className="text-cyber-purple-glow font-bold">
              {language === 'ru' ? 'ЦИФРОВАЯ БАЗА РЕЛИЗОВ // КАТАЛОГ' : 'ARCHIVED MUSIC DATABASE // CATALOG'}
            </span>
            <span className="text-signal-red font-bold">{filteredReleases.length} {language === 'ru' ? 'РЕЛИЗОВ' : 'RELEASES'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                className="flex items-center space-x-3 p-3 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red/70 hover:shadow-neon-mix rounded-sm cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-signal-red group"
              >
                <div className="relative w-12 h-12 rounded-sm overflow-hidden border border-void-700 shrink-0 group-hover:border-signal-red transition-colors">
                  <img
                    src={r.artworkUrl}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-0 left-0 bg-void-950/90 text-[8px] font-mono text-signal-red px-1 rounded-br-xs">
                    #{String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div className="overflow-hidden font-mono flex-1 min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-signal-red transition-colors truncate font-sans">
                    {r.title}
                  </div>
                  <div className="text-[10px] text-technical-silver truncate mt-0.5">{r.artists}</div>
                  <div className="text-[9px] text-technical-muted mt-1 flex items-center justify-between">
                    <span className="text-signal-red">DNX-{String(i + 1).padStart(3, '0')}</span>
                    <span>{r.year} // {r.genre}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 02. Interactive 3D Orbit Touch & Drag Zone (Centered Viewport Area) */}
      <div
        className="w-full my-auto h-72 sm:h-96 relative flex flex-col items-center justify-center pointer-events-auto touch-pan-y cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHoveredDragZone(true)}
        onMouseLeave={() => setIsHoveredDragZone(false)}
      >
        {/* Subtle Targeting Reticle & Radar Wireframe (Pointer Events None) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-void-700/60 border-dashed" />
          <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border border-signal-red/30" />
          <div className="absolute text-[8px] font-mono text-technical-muted top-2 left-2">
            [ RADIAL TRACKING // CYLINDER 360° ]
          </div>
          <div className="absolute text-[8px] font-mono text-signal-red bottom-2 right-2">
            Z-TARGET: -1150
          </div>
        </div>

        {/* Subtle touch drag guidance overlay */}
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-void-950/80 border border-void-800/80 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-technical-silver transition-opacity duration-300 pointer-events-none mt-auto mb-1 z-10 ${
            isHoveredDragZone ? 'opacity-90' : 'opacity-50 sm:opacity-25'
          }`}
        >
          <MoveHorizontal size={13} className="text-signal-red animate-pulse" />
          <span>
            {language === 'ru' ? 'СМАХНИТЕ ДЛЯ ВРАЩЕНИЯ 3D АРХИВА' : 'SWIPE TO ROTATE 3D ARCHIVE'}
          </span>
        </div>
      </div>

      {/* 03. Tactical 3D Orbit Controller & Telemetry Deck */}
      <div className="w-full flex flex-col gap-2 pointer-events-auto mt-2">
        {/* Top bar: Active Release HUD & Quick Open Button */}
        {currentCenterRelease && (
          <div className="w-full flex items-center justify-between gap-2.5 p-2 sm:p-3 bg-void-950/90 backdrop-blur-md border border-void-800 rounded-sm">
            {/* Center release meta */}
            <div
              className="flex items-center space-x-2.5 overflow-hidden flex-1 cursor-pointer group"
              onClick={() => setSelectedRelease(currentCenterRelease)}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-sm overflow-hidden border border-void-700 shrink-0 group-hover:border-signal-red transition-colors">
                <img
                  src={currentCenterRelease.artworkUrl}
                  alt={currentCenterRelease.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden font-mono text-xs min-w-0">
                <div className="flex items-center space-x-1.5 text-[10px] text-cyber-purple-glow">
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
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-signal-red to-signal-red-glow hover:shadow-neon-mix text-white font-mono text-[11px] sm:text-xs tracking-wider uppercase rounded-sm flex items-center space-x-1.5 transition-all shrink-0 active:scale-95"
            >
              <Play size={11} className="fill-white" />
              <span>{language === 'ru' ? 'СЛУШАТЬ' : 'PLAY'}</span>
            </button>
          </div>
        )}

        {/* Bottom bar: Tactile Next/Prev Buttons + Scrubber + Auto-Rotate */}
        <div className="w-full flex items-center justify-between gap-2 p-2 sm:p-2.5 bg-void-950/90 backdrop-blur-md border border-void-800 rounded-sm text-xs font-mono">
          {/* Previous / Next buttons */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              onClick={() => handleStep(-1)}
              className="px-2.5 sm:px-3 py-1.5 min-h-[36px] bg-void-900 hover:bg-void-850 border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow text-technical-light hover:text-cyber-purple-glow transition-all rounded-sm flex items-center space-x-1 active:scale-95"
              title={language === 'ru' ? 'Предыдущий релиз' : 'Previous release'}
              aria-label="Previous release"
            >
              <ChevronLeft size={16} className="text-signal-red" />
              <span className="hidden md:inline">{language === 'ru' ? 'НАЗАД' : 'PREV'}</span>
            </button>

            <button
              onClick={() => handleStep(1)}
              className="px-2.5 sm:px-3 py-1.5 min-h-[36px] bg-void-900 hover:bg-void-850 border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow text-technical-light hover:text-cyber-purple-glow transition-all rounded-sm flex items-center space-x-1 active:scale-95"
              title={language === 'ru' ? 'Следующий релиз' : 'Next release'}
              aria-label="Next release"
            >
              <span className="hidden md:inline">{language === 'ru' ? 'ВПЕРЁД' : 'NEXT'}</span>
              <ChevronRight size={16} className="text-signal-red" />
            </button>

            {/* Auto-rotate button */}
            <button
              onClick={() => setAutoRotate((prev) => !prev)}
              className={`px-2 sm:px-2.5 py-1.5 min-h-[36px] border rounded-sm transition-all flex items-center space-x-1 active:scale-95 text-[10px] sm:text-xs ${
                autoRotate
                  ? 'bg-signal-red text-white border-signal-red shadow-[0_0_12px_rgba(230,25,36,0.4)]'
                  : 'bg-void-900 border-void-800 text-technical-silver hover:border-cyber-purple/70 hover:text-white'
              }`}
              title={language === 'ru' ? 'Включить / выключить автовращение' : 'Toggle auto-rotation'}
            >
              <RotateCw size={12} className={autoRotate ? 'animate-spin' : ''} />
              <span>{autoRotate ? (language === 'ru' ? 'АВТО' : 'ON') : (language === 'ru' ? 'АВТО' : 'OFF')}</span>
            </button>
          </div>

          {/* Interactive Catalog Scrubber Slider */}
          <div className="flex-1 flex items-center space-x-2 px-1 min-w-[90px]">
            <input
              type="range"
              min="0"
              max={totalReleases - 1}
              value={activeIndex}
              onChange={handleScrubberChange}
              className="w-full h-1.5 bg-void-800 rounded-lg appearance-none cursor-pointer accent-signal-red focus:outline-none"
              aria-label="Перемотка 3D каталога"
            />
            <span className="text-[10px] sm:text-[11px] text-technical-muted shrink-0 w-8 text-right font-mono">
              {activeIndex + 1}/{totalReleases}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
