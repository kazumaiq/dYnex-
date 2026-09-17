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
      className="relative min-h-screen w-full px-4 sm:px-12 py-20 flex flex-col justify-between pointer-events-none select-none"
    >
      {/* 01. Top Section Header & Search/Filter Controls */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-auto">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
            <span className="text-cyber-purple-glow">// 02</span>
            <span>{language === 'ru' ? 'ОРБИТАЛЬНЫЙ АРХИВ МУЗЫКИ' : 'ORBITAL RELEASE ARCHIVE'}</span>
          </div>
          <h2 className="font-sans font-black text-4xl sm:text-6xl tracking-tight text-white uppercase">
            {language === 'ru' ? 'КАТАЛОГ РЕЛИЗОВ' : 'RELEASE CATALOG'}
          </h2>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-void-950/85 backdrop-blur-md p-2 sm:p-3 border border-void-800 rounded-sm">
          {/* Year Buttons */}
          <div className="flex items-center space-x-1 border-r border-void-800 pr-2 sm:pr-3">
            <button
              onClick={() => setActiveYearFilter(null)}
              className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-all ${
                activeYearFilter === null
                  ? 'bg-gradient-to-r from-signal-red to-cyber-purple-deep text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                  : 'text-technical-muted hover:text-cyber-purple-glow'
              }`}
            >
              {language === 'ru' ? 'ВСЕ' : 'ALL'}
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setActiveYearFilter(activeYearFilter === y ? null : y)}
                className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-all ${
                  activeYearFilter === y
                    ? 'bg-gradient-to-r from-signal-red to-cyber-purple-deep text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'text-technical-muted hover:text-cyber-purple-glow'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-2.5 text-technical-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ru' ? 'Поиск...' : 'Search...'}
              className="bg-void-950 border border-void-800 text-xs font-mono text-technical-light pl-8 pr-3 py-1 rounded-sm focus:outline-none focus:border-cyber-purple w-32 sm:w-44 placeholder:text-technical-muted/60 transition-colors"
            />
          </div>

          {/* Accessible List Toggle */}
          <button
            onClick={() => setShowAccessibleList(!showAccessibleList)}
            className={`p-1.5 border rounded-sm transition-colors ${
              showAccessibleList
                ? 'bg-cyber-purple text-white border-cyber-purple shadow-cyber-purple-glow'
                : 'bg-void-950 border-void-800 text-technical-muted hover:text-cyber-purple-glow'
            }`}
            title={language === 'ru' ? 'Текстовый список релизов' : 'Accessible release list'}
            aria-label="Переключить текстовый список релизов"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Accessible Semantic Release List View */}
      {showAccessibleList && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="my-6 p-6 bg-void-950/95 backdrop-blur-xl border border-void-800 rounded-sm pointer-events-auto max-h-[60vh] overflow-y-auto shadow-2xl z-20"
        >
          <div className="text-xs font-mono text-technical-muted uppercase tracking-widest mb-4 flex justify-between items-center border-b border-void-800 pb-2">
            <span className="text-cyber-purple-glow">{language === 'ru' ? 'СЕМАНТИЧЕСКИЙ СПИСОК РЕЛИЗОВ' : 'ACCESSIBLE RELEASE ARCHIVE'}</span>
            <span className="text-signal-red">{filteredReleases.length} {language === 'ru' ? 'НАЙДЕНО' : 'FOUND'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReleases.map((r) => (
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
                className="flex items-center space-x-3 p-3 bg-void-900/80 hover:bg-void-850 border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow rounded-sm cursor-pointer transition-all focus:outline-none focus:ring-1 focus:ring-cyber-purple"
              >
                <img
                  src={r.artworkUrl}
                  alt={r.title}
                  className="w-12 h-12 rounded-sm object-cover border border-void-700 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">{r.title}</div>
                  <div className="text-[11px] font-mono text-technical-muted truncate">{r.artists}</div>
                  <div className="text-[10px] font-mono text-signal-red mt-0.5">{r.year} // {r.genre}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 02. Interactive 3D Orbit Touch & Drag Zone (Centered Viewport Area) */}
      <div
        className="w-full my-auto h-72 sm:h-96 relative flex flex-col items-center justify-center pointer-events-auto touch-none cursor-grab active:cursor-grabbing select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setIsHoveredDragZone(true)}
        onMouseLeave={() => setIsHoveredDragZone(false)}
      >
        {/* Subtle touch drag guidance overlay */}
        <div
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-void-950/70 border border-void-800/80 backdrop-blur-md text-[11px] font-mono text-technical-silver transition-opacity duration-300 pointer-events-none ${
            isHoveredDragZone ? 'opacity-80' : 'opacity-40 sm:opacity-20'
          }`}
        >
          <MoveHorizontal size={14} className="text-signal-red animate-pulse" />
          <span>
            {language === 'ru' ? 'ТЯНИТЕ ВЛЕВО / ВПРАВО ДЛЯ ВРАЩЕНИЯ' : 'SWIPE / DRAG LEFT & RIGHT TO ROTATE'}
          </span>
        </div>
      </div>

      {/* 03. Tactical 3D Orbit Controller & Telemetry Deck */}
      <div className="w-full flex flex-col gap-3 pointer-events-auto">
        {/* Top bar: Active Release HUD & Quick Open Button */}
        {currentCenterRelease && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-void-950/85 backdrop-blur-md border border-void-800 rounded-sm">
            {/* Center release meta */}
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-sm overflow-hidden border border-void-700 shrink-0">
                <img
                  src={currentCenterRelease.artworkUrl}
                  alt={currentCenterRelease.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden font-mono text-xs">
                <div className="flex items-center space-x-2 text-[10px] text-cyber-purple-glow">
                  <Disc3 size={11} className="text-signal-red animate-spin-slow" />
                  <span className="font-bold">#{String(activeIndex + 1).padStart(2, '0')} / {totalReleases}</span>
                  <span className="text-technical-muted">• {currentCenterRelease.year}</span>
                </div>
                <div className="font-bold text-white text-sm truncate font-sans">
                  {currentCenterRelease.title}
                </div>
                <div className="text-technical-muted text-[11px] truncate">
                  {currentCenterRelease.artists}
                </div>
              </div>
            </div>

            {/* Quick Open Modal Button */}
            <button
              onClick={() => setSelectedRelease(currentCenterRelease)}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-signal-red to-signal-red-glow hover:shadow-neon-mix text-white font-mono text-xs tracking-widest uppercase rounded-sm flex items-center justify-center space-x-2 transition-all shrink-0"
            >
              <Play size={12} className="fill-white" />
              <span>{language === 'ru' ? 'СЛУШАТЬ РЕЛИЗ' : 'OPEN RELEASE'}</span>
            </button>
          </div>
        )}

        {/* Bottom bar: Tactile Next/Prev Buttons + Scrubber + Auto-Rotate */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 bg-void-950/90 backdrop-blur-md border border-void-800 rounded-sm text-xs font-mono">
          {/* Previous / Next buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStep(-1)}
              className="px-3.5 py-2 min-h-[40px] bg-void-900 hover:bg-void-850 border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow text-technical-light hover:text-cyber-purple-glow transition-all rounded-sm flex items-center space-x-1.5 active:scale-95"
              title={language === 'ru' ? 'Предыдущий релиз' : 'Previous release'}
            >
              <ChevronLeft size={16} className="text-signal-red" />
              <span className="hidden xs:inline">{language === 'ru' ? 'НАЗАД' : 'PREV'}</span>
            </button>

            <button
              onClick={() => handleStep(1)}
              className="px-3.5 py-2 min-h-[40px] bg-void-900 hover:bg-void-850 border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow text-technical-light hover:text-cyber-purple-glow transition-all rounded-sm flex items-center space-x-1.5 active:scale-95"
              title={language === 'ru' ? 'Следующий релиз' : 'Next release'}
            >
              <span className="hidden xs:inline">{language === 'ru' ? 'ВПЕРЁД' : 'NEXT'}</span>
              <ChevronRight size={16} className="text-signal-red" />
            </button>

            {/* Auto-rotate button */}
            <button
              onClick={() => setAutoRotate((prev) => !prev)}
              className={`px-3 py-2 min-h-[40px] border rounded-sm transition-all flex items-center space-x-1.5 active:scale-95 ${
                autoRotate
                  ? 'bg-signal-red text-white border-signal-red shadow-[0_0_12px_rgba(230,25,36,0.4)]'
                  : 'bg-void-900 border-void-800 text-technical-silver hover:border-cyber-purple/70 hover:text-white'
              }`}
              title={language === 'ru' ? 'Включить / выключить автовращение' : 'Toggle auto-rotation'}
            >
              <RotateCw size={13} className={autoRotate ? 'animate-spin' : ''} />
              <span>{autoRotate ? (language === 'ru' ? 'АВТО: ВКЛ' : 'AUTO: ON') : (language === 'ru' ? 'АВТО' : 'AUTO')}</span>
            </button>
          </div>

          {/* Interactive Catalog Scrubber Slider */}
          <div className="flex-1 min-w-[180px] max-w-xs flex items-center space-x-3 px-2">
            <Sliders size={13} className="text-cyber-purple-glow shrink-0 hidden sm:inline" />
            <input
              type="range"
              min="0"
              max={totalReleases - 1}
              value={activeIndex}
              onChange={handleScrubberChange}
              className="w-full h-1.5 bg-void-800 rounded-lg appearance-none cursor-pointer accent-signal-red focus:outline-none"
              aria-label="Перемотка 3D каталога"
            />
            <span className="text-[11px] text-technical-muted shrink-0 w-8 text-right font-mono">
              {activeIndex + 1}/{totalReleases}
            </span>
          </div>

          {/* Catalog Count */}
          <div className="text-[11px] text-technical-silver shrink-0 hidden lg:block">
            {language === 'ru' ? 'КАТАЛОГ: ' : 'CATALOG: '}
            <span className="text-signal-red font-bold">{publishedReleases.length} {language === 'ru' ? 'РЕЛИЗОВ' : 'RELEASES'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
