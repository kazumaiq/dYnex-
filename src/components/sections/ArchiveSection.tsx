import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, RotateCw, Filter, List, Grid3X3, Disc3, ExternalLink } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const ArchiveSection: React.FC = () => {
  const {
    releases,
    selectedRelease,
    setSelectedRelease,
    language,
    activeYearFilter,
    setActiveYearFilter,
    searchQuery,
    setSearchQuery,
  } = useArchive();

  const [showAccessibleList, setShowAccessibleList] = useState(false);

  // Filtered releases for accessible semantic view and search
  const filteredReleases = releases.filter((r) => {
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

  const years = [2026, 2025, 2024, 2023];

  return (
    <section
      id="archive"
      className="relative min-h-screen w-full px-6 sm:px-12 py-24 flex flex-col justify-between pointer-events-none select-none"
    >
      {/* Top Section Header & Telemetry */}
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-auto">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
            <span>// 02</span>
            <span>{language === 'ru' ? 'ОРБИТАЛЬНЫЙ АРХИВ МУЗЫКИ' : 'ORBITAL RELEASE ARCHIVE'}</span>
          </div>
          <h2 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white">
            {language === 'ru' ? 'КАТАЛОГ РЕЛИЗОВ' : 'RELEASE CATALOG'}
          </h2>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 bg-void-900/70 backdrop-blur-md p-3 border border-void-800 rounded-sm">
          {/* Year Buttons */}
          <div className="flex items-center space-x-1 border-r border-void-800 pr-3">
            <button
              onClick={() => setActiveYearFilter(null)}
              className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-colors ${
                activeYearFilter === null
                  ? 'bg-signal-red text-white'
                  : 'text-technical-muted hover:text-white'
              }`}
            >
              {language === 'ru' ? 'ВСЕ' : 'ALL'}
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setActiveYearFilter(activeYearFilter === y ? null : y)}
                className={`px-2.5 py-1 text-xs font-mono rounded-sm transition-colors ${
                  activeYearFilter === y
                    ? 'bg-signal-red text-white'
                    : 'text-technical-muted hover:text-white'
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
              placeholder={language === 'ru' ? 'Поиск релиза...' : 'Search release...'}
              className="bg-void-950 border border-void-800 text-xs font-mono text-technical-light pl-8 pr-3 py-1 rounded-sm focus:outline-none focus:border-signal-red w-36 sm:w-44 placeholder:text-technical-muted/60"
            />
          </div>

          {/* Accessible List Toggle */}
          <button
            onClick={() => setShowAccessibleList(!showAccessibleList)}
            className={`p-1.5 border rounded-sm transition-colors ${
              showAccessibleList
                ? 'bg-signal-red text-white border-signal-red'
                : 'bg-void-950 border-void-800 text-technical-muted hover:text-white'
            }`}
            title={language === 'ru' ? 'Текстовый список релизов' : 'Accessible release list'}
            aria-label="Переключить текстовый список релизов"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Accessible Semantic Release List View (Section 60 requirement) */}
      {showAccessibleList && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="my-8 p-6 bg-void-950/95 backdrop-blur-xl border border-void-800 rounded-sm pointer-events-auto max-h-[60vh] overflow-y-auto"
        >
          <div className="text-xs font-mono text-technical-muted uppercase tracking-widest mb-4 flex justify-between items-center border-b border-void-800 pb-2">
            <span>{language === 'ru' ? 'СЕМАНТИЧЕСКИЙ СПИСОК РЕЛИЗОВ' : 'ACCESSIBLE RELEASE ARCHIVE'}</span>
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
                className="flex items-center space-x-3 p-3 bg-void-900/80 hover:bg-void-850 border border-void-800 hover:border-signal-red/60 rounded-sm cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-signal-red"
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

      {/* Bottom Orbital Drag Hint & Telemetry */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto text-xs font-mono text-technical-muted">
        <div className="flex items-center space-x-2 bg-void-900/60 backdrop-blur-sm border border-void-800 px-3 py-1.5 rounded-sm">
          <RotateCw size={13} className="text-signal-red animate-spin-slow" />
          <span>
            {language === 'ru'
              ? 'ЗАЖМИТЕ И ТЯНИТЕ МЫШЬЮ / ПАЛЬЦЕМ ДЛЯ ВРАЩЕНИЯ 3D КОЛЬЦА'
              : 'DRAG MOUSE OR SWIPE TO ROTATE 3D ARCHIVE RING'}
          </span>
        </div>

        <div className="text-technical-silver">
          {language === 'ru' ? 'ВЕРИФИЦИРОВАНО В КАТАЛОГЕ: ' : 'VERIFIED IN CATALOG: '}
          <span className="text-signal-red font-bold">{releases.length}</span>
        </div>
      </div>
    </section>
  );
};
