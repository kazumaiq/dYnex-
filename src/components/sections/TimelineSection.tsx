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

export const TimelineSection: React.FC = () => {
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
      className="relative min-h-screen w-full px-6 sm:px-12 py-32 flex flex-col justify-center pointer-events-none select-none"
    >
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
          <span>// 04</span>
          <span>{language === 'ru' ? 'ХРОНОЛОГИЯ РАЗВИТИЯ' : 'SPATIAL TIMELINE'}</span>
        </div>
        <h2 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white mb-12">
          {language === 'ru' ? 'ТАЙМЛАЙН 2023—2026' : 'CHRONICLE 2023—2026'}
        </h2>

        {/* Spatial Year Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {milestones.map((m) => {
            const isActive = selectedYear === m.year;
            return (
              <button
                key={m.year}
                onClick={() => setSelectedYear(m.year)}
                className={`p-4 border text-left rounded-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-void-900 border-cyber-purple shadow-cyber-purple-glow'
                    : 'bg-void-950/70 border-void-800 hover:border-void-700 hover:bg-void-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-2xl font-black font-sans ${isActive ? 'text-cyber-purple-glow' : 'text-technical-silver'}`}>
                    {m.year}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-signal-red animate-pulse" />}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-widest text-technical-muted truncate">
                  {language === 'ru' ? m.phaseRu : m.phaseEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Year Detail Box */}
        <div className="p-6 sm:p-8 bg-void-950/80 backdrop-blur-md border border-void-800 rounded-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 border-b border-void-800 pb-6">
            <div>
              <div className="text-xs font-mono text-signal-red tracking-widest uppercase mb-1 flex items-center space-x-2">
                <Calendar size={13} className="text-cyber-purple-glow" />
                <span>{language === 'ru' ? 'ЭТАП РАЗВИТИЯ' : 'PHASE MILESTONE'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-sans text-white">
                {selectedYear}: {language === 'ru' ? activeMilestone.phaseRu : activeMilestone.phaseEn}
              </h3>
            </div>
            <p className="text-xs sm:text-sm font-mono text-technical-silver max-w-lg leading-relaxed">
              {language === 'ru' ? activeMilestone.descRu : activeMilestone.descEn}
            </p>
          </div>

          {/* Releases in this year */}
          <div>
            <div className="text-[11px] font-mono text-technical-muted uppercase tracking-widest mb-4">
              {language === 'ru' ? `РЕЛИЗЫ ${selectedYear} ГОДА В АРХИВЕ (${yearReleases.length}):` : `CONFIRMED ${selectedYear} RELEASES (${yearReleases.length}):`}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {yearReleases.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setSelectedRelease(r)}
                  className="flex items-center space-x-3 p-2.5 bg-void-900/80 hover:bg-void-850 border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow rounded-sm cursor-pointer transition-all group"
                >
                  <img
                    src={r.artworkUrl}
                    alt={r.title}
                    className="w-10 h-10 rounded-sm object-cover border border-void-700 shrink-0 group-hover:border-cyber-purple transition-colors"
                  />
                  <div className="overflow-hidden flex-1">
                    <div className="text-xs font-bold text-white group-hover:text-cyber-purple-glow transition-colors truncate">
                      {r.title}
                    </div>
                    <div className="text-[10px] font-mono text-technical-muted truncate">
                      {r.artists}
                    </div>
                  </div>
                  <ArrowRight size={12} className="text-technical-muted group-hover:text-cyber-purple-glow transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
