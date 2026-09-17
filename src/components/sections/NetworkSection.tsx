import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Users, Disc3, ShieldCheck } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { VERIFIED_COLLABORATORS } from '../../data/collaborators';

export const NetworkSection: React.FC = () => {
  const { setSelectedRelease, releases, language } = useArchive();
  const [activeCollaboratorId, setActiveCollaboratorId] = useState<string>('vervix');

  const activeCollab = VERIFIED_COLLABORATORS.find(c => c.id === activeCollaboratorId) || VERIFIED_COLLABORATORS[0];
  const relatedReleases = releases.filter(r => activeCollab.releaseIds.includes(r.id));

  return (
    <section
      id="network"
      className="relative min-h-screen w-full px-6 sm:px-12 py-32 flex flex-col justify-center pointer-events-none select-none"
    >
      <div className="max-w-6xl mx-auto w-full pointer-events-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
          <span>// 05</span>
          <span>{language === 'ru' ? 'СЕТЬ КОЛЛАБОРАЦИЙ' : 'COLLABORATOR NETWORK'}</span>
        </div>
        <h2 className="font-sans font-extrabold text-4xl sm:text-6xl tracking-tight text-white mb-4">
          {language === 'ru' ? 'УЗЛЫ И СОАВТОРЫ' : 'NETWORK NODES'}
        </h2>
        <p className="text-xs sm:text-sm font-mono text-technical-muted max-w-xl mb-12">
          {language === 'ru'
            ? 'Только подтверждённые продюсеры и соавторы из официальных каталогов Apple Music и дистрибьюторских реестров.'
            : 'Exclusively verified co-producers and vocalists from official Apple Music and distributor metadata.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Collaborator Nodes List */}
          <div className="lg:col-span-1 space-y-2 max-h-[460px] overflow-y-auto pr-2">
            {VERIFIED_COLLABORATORS.map((c) => {
              const isActive = activeCollaboratorId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCollaboratorId(c.id)}
                  className={`w-full p-3 text-left border rounded-sm transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? 'bg-void-900 border-cyber-purple text-white shadow-cyber-purple-glow'
                      : 'bg-void-950/80 border-void-800 text-technical-silver hover:border-cyber-purple/50 hover:bg-void-900/60'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold font-sans truncate">{c.name}</div>
                    <div className="text-[10px] font-mono text-technical-muted truncate">{c.role}</div>
                  </div>
                  <div className="text-xs font-mono text-cyber-purple-glow shrink-0 ml-2">
                    {c.trackCount} {language === 'ru' ? 'ТР.' : 'TR.'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Node Card & Related Releases */}
          <div className="lg:col-span-2 p-6 sm:p-8 bg-void-950/80 backdrop-blur-md border border-void-800 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-void-800 pb-4 mb-6">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-signal-red uppercase tracking-widest mb-1">
                    <Users size={12} className="text-cyber-purple-glow" />
                    <span>{language === 'ru' ? 'ВЕРИФИЦИРОВАННЫЙ СОАВТОР' : 'VERIFIED COLLABORATOR'}</span>
                  </div>
                  <h3 className="text-3xl font-black font-sans text-white">
                    {activeCollab.name}
                  </h3>
                  <div className="text-xs font-mono text-technical-silver mt-0.5">
                    {activeCollab.role}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono text-cyber-purple-glow bg-void-950 px-3 py-1.5 border border-void-800 rounded-sm">
                  <ShieldCheck size={14} className="text-signal-red" />
                  <span>VERIFIED</span>
                </div>
              </div>

              {/* Connected Releases */}
              <div>
                <div className="text-xs font-mono text-technical-muted uppercase tracking-widest mb-4">
                  {language === 'ru' ? 'СОВМЕСТНЫЕ РЕЛИЗЫ В КАТАЛОГЕ:' : 'COLLABORATIVE RELEASES IN CATALOG:'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedReleases.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedRelease(rel)}
                      className="flex items-center space-x-3 p-3 bg-void-900/80 hover:bg-void-850 border border-void-800 hover:border-cyber-purple/70 hover:shadow-cyber-purple-glow rounded-sm cursor-pointer transition-all group"
                    >
                      <img
                        src={rel.artworkUrl}
                        alt={rel.title}
                        className="w-12 h-12 rounded-sm object-cover border border-void-700 shrink-0 group-hover:border-cyber-purple transition-colors"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white group-hover:text-cyber-purple-glow transition-colors truncate">{rel.title}</div>
                        <div className="text-[10px] font-mono text-technical-muted truncate">{rel.artists}</div>
                        <div className="text-[10px] font-mono text-signal-red mt-0.5">{rel.year} // {rel.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-void-800/80 mt-6 flex items-center justify-between text-[11px] font-mono text-technical-muted">
              <span>СВЯЗЬ: dYnex? → {activeCollab.name}</span>
              <span className="text-signal-red">3D NODE // ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
