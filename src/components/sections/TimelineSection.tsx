import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Disc3, ArrowRight } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

interface Milestone {
  year: number;
  phaseRu: string;
  phaseEn: string;
  descRu: string;
  descEn: string;
  highlights: string[];
}

export const TimelineSection: React.FC = React.memo(() => {
  const { setSelectedRelease, releases, language } = useArchive();
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const milestones: Milestone[] = [
    {
      year: 2023,
      phaseRu: 'ЗАРОЖДЕНИЕ КАТАЛОГА',
      phaseEn: 'CATALOG GENESIS',
      descRu: 'Первые подтверждённые цифровые релизы. Эксперименты с атмосферным фонком и синтетическим звуком.',
      descEn: 'Earliest confirmed catalog entries. Establishing atmospheric phonk aesthetics and synthetic sonic signatures.',
      highlights: ['Cyber Memories', 'Doom Override', 'Bring It On', 'Lumminate', 'HYPNODANCE', 'PROLOGUE']
    },
    {
      year: 2024,
      phaseRu: 'РАСШИРЕНИЕ ЗВУЧАНИЯ',
      phaseEn: 'EXPANSION & COLLABORATIONS',
      descRu: 'Коллаборации с европейскими и независимыми саунд-продюсерами. Быстрое развитие темпа и текстур.',
      descEn: 'Collaborative singles across hip-hop, phonk, and house rhythms with rising producers.',
      highlights: ['Second Life', 'Faded Forever', 'The Beginning of a New', 'Level Up', 'Cold of Heart', 'Oper Club']
    },
    {
      year: 2025,
      phaseRu: 'ЭЛЕКТРОННЫЙ ПРОРЫВ & PHONK',
      phaseEn: 'PHONK & DRIFT BREAKTHROUGH',
      descRu: 'Крупная волна релизов: бразильский фонк, хаус-ритмы, замедленные версии и вирусные треки.',
      descEn: 'Major release momentum featuring Brazilian phonk, club cuts, and slowed anthems.',
      highlights: ['Suphire', 'Time To Jump', 'KRIDO', 'Broca', 'Fica quieto', 'MONTAGEM BATERIA', 'Exhaustion', 'K+!UN']
    },
    {
      year: 2026,
      phaseRu: 'ЭРА "ABSTRACT"',
      phaseEn: 'THE ABSTRACT ERA',
      descRu: 'Выход монументального сингла Abstract совместно с VERV!X (30 января 2026). Новый уровень продакшна.',
      descEn: 'Release of landmark collaboration Abstract with VERV!X. Pushing boundaries into progressive electronic sound.',
      highlights: ['Abstract']
    }
  ];

  const activeMilestone = milestones.find(m => m.year === selectedYear) || milestones[3];
  const yearReleases = releases.filter(r => r.year === selectedYear);

  return (
    <section
      id="timeline"
      className="relative min-h-screen w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 flex flex-col justify-center pointer-events-none select-none max-w-7xl mx-auto"
    >
      <div className="w-full pointer-events-auto">
        {/* Section Header */}
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
          <span className="font-bold">// 04</span>
          <span className="font-bold">{language === 'ru' ? 'АРХИВ ЭВОЛЮЦИИ ЗВУЧАНИЯ' : 'SONIC EVOLUTION ARCHIVE'}</span>
          <span className="text-void-700">//</span>
          <span className="text-technical-muted">CHRONICLE 2023—2026</span>
        </div>
        <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase mb-8 sm:mb-12">
          {language === 'ru' ? 'ТАЙМЛАЙН ЭР РАЗВИТИЯ' : 'CHRONOLOGICAL ERAS'}
        </h2>

        {/* Spatial Era Stepper Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 sm:mb-10">
          {milestones.map((m) => {
            const isActive = selectedYear === m.year;
            const count = releases.filter((r) => r.year === m.year).length;
            return (
              <button
                key={m.year}
                onClick={() => setSelectedYear(m.year)}
                className={`p-3.5 sm:p-4 text-left rounded-none transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? 'tactical-border bg-void-900 border-signal-red shadow-[0_0_20px_rgba(230,25,36,0.25)]'
                    : 'bg-void-950/80 border border-void-800 hover:border-void-700 hover:bg-void-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl sm:text-3xl font-black font-sans tracking-tighter ${isActive ? 'text-white' : 'text-technical-silver group-hover:text-white'}`}>
                    {m.year}
                  </span>
                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-signal-red animate-ping" />
                  ) : (
                    <span className="text-[10px] font-mono text-technical-muted">{count} rel</span>
                  )}
                </div>
                <div className={`text-[10px] font-mono uppercase tracking-widest truncate ${isActive ? 'text-signal-red font-bold' : 'text-technical-muted'}`}>
                  {language === 'ru' ? m.phaseRu : m.phaseEn}
                </div>
                {isActive && <div className="barcode-pattern w-full h-1 mt-2.5 opacity-60" />}
              </button>
            );
          })}
        </div>

        {/* Active Year Detail Box */}
        <div className="tactical-border p-5 sm:p-8 bg-void-950/98 border border-void-700 rounded-none shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-void-800/80 pb-6">
            <div>
              <div className="text-[10px] sm:text-xs font-mono text-signal-red tracking-widest uppercase mb-1 flex items-center space-x-2">
                <Calendar size={13} className="text-signal-red" />
                <span>{language === 'ru' ? 'ХАРАКТЕРИСТИКА ЭРЫ' : 'ERA SPECIFICATION'}</span>
                <span className="text-void-700">//</span>
                <span className="text-technical-muted">NODE {selectedYear}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-sans text-white uppercase tracking-tight">
                {selectedYear}: {language === 'ru' ? activeMilestone.phaseRu : activeMilestone.phaseEn}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-mono text-technical-silver max-w-xl leading-relaxed">
              {language === 'ru' ? activeMilestone.descRu : activeMilestone.descEn}
            </p>
          </div>

          {/* Releases in this year */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-technical-muted uppercase tracking-widest mb-4">
              <span className="text-signal-red font-bold">
                {language === 'ru' ? `РЕЛИЗЫ ${selectedYear} ГОДА (${yearReleases.length}):` : `CONFIRMED ${selectedYear} RELEASES (${yearReleases.length}):`}
              </span>
              <span className="text-signal-red hidden sm:inline">[ TAP TO INSPECT ]</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {yearReleases.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRelease(r)}
                  className="flex items-center space-x-3 p-3 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red rounded-none cursor-pointer transition-all group"
                >
                  <div className="w-11 h-11 rounded-sm overflow-hidden border border-void-700 shrink-0 group-hover:border-signal-red transition-colors">
                    <img
                      src={r.artworkUrl}
                      alt={r.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="overflow-hidden flex-1 font-mono">
                    <div className="text-xs font-bold text-white group-hover:text-signal-red transition-colors truncate font-sans">
                      {r.title}
                    </div>
                    <div className="text-[10px] text-technical-silver truncate mt-0.5">
                      {r.artists}
                    </div>
                    <div className="text-[9px] text-technical-muted mt-1 flex items-center justify-between">
                      <span className="text-signal-red">{r.genre}</span>
                      <span>{r.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
