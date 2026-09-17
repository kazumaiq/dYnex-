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
      className="relative min-h-screen w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 flex flex-col justify-center pointer-events-none select-none max-w-7xl mx-auto"
    >
      <div className="w-full pointer-events-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
          <span className="font-bold">// 05</span>
          <span className="font-bold">{language === 'ru' ? 'СЕТЬ КОЛЛАБОРАЦИЙ & СОАВТОРОВ' : 'COLLABORATOR NETWORK'}</span>
          <span className="text-void-700">//</span>
          <span className="text-technical-muted">提携ノード // NODES</span>
        </div>
        <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase mb-3">
          {language === 'ru' ? 'СЕТЕВЫЕ УЗЛЫ' : 'NETWORK NODES'}
        </h2>
        <p className="text-xs sm:text-sm font-mono text-technical-silver max-w-2xl mb-8 sm:mb-12 leading-relaxed">
          {language === 'ru'
            ? 'Подтверждённые саунд-продюсеры и соавторы из официальных каталогов стриминговых сервисов и дистрибьюторских баз.'
            : 'Confirmed sound producers and collaborators from verified streaming service registries and distributor catalogs.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Collaborator Nodes List */}
          <div className="lg:col-span-1 space-y-2 max-h-[460px] overflow-y-auto pr-1 sm:pr-2">
            {VERIFIED_COLLABORATORS.map((c) => {
              const isActive = activeCollaboratorId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCollaboratorId(c.id)}
                  className={`w-full p-3.5 text-left border rounded-none transition-all duration-200 flex items-center justify-between group ${
                    isActive
                      ? 'tactical-border bg-void-900 border-signal-red text-white shadow-[0_0_15px_rgba(230,25,36,0.3)]'
                      : 'bg-void-950/85 border-void-800 text-technical-silver hover:border-signal-red/50 hover:bg-void-900/60'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="text-sm font-bold font-sans truncate text-white group-hover:text-signal-red transition-colors">
                      {c.name}
                    </div>
                    <div className="text-[10px] font-mono text-technical-muted truncate mt-0.5">{c.role}</div>
                  </div>
                  <div className="text-xs font-mono text-signal-red font-bold shrink-0 ml-2">
                    {c.trackCount} {language === 'ru' ? 'ТР.' : 'TR.'}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Node Card & Related Releases */}
          <div className="tactical-border lg:col-span-2 p-5 sm:p-8 bg-void-950/90 backdrop-blur-xl border border-void-700 rounded-none flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-void-800 pb-4 mb-6">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-signal-red uppercase tracking-widest mb-1">
                    <Users size={12} className="text-signal-red" />
                    <span>{language === 'ru' ? 'ВЕРИФИЦИРОВАННЫЙ СОАВТОР' : 'VERIFIED PRODUCER'}</span>
                  </div>
                  <h3 className="text-2xl sm:text-4xl font-black font-sans text-white uppercase tracking-tight">
                    {activeCollab.name}
                  </h3>
                  <div className="text-xs font-mono text-technical-silver mt-0.5">
                    {activeCollab.role}
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono text-signal-red bg-void-950 px-3 py-1.5 border border-void-800 rounded-none">
                  <ShieldCheck size={14} className="text-signal-red animate-pulse" />
                  <span className="font-bold">VERIFIED</span>
                </div>
              </div>

              {/* Connected Releases */}
              <div>
                <div className="text-[11px] font-mono text-technical-muted uppercase tracking-widest mb-4">
                  {language === 'ru' ? 'СОВМЕСТНЫЕ РЕЛИЗЫ В КАТАЛОГЕ:' : 'COLLABORATIVE RELEASES IN CATALOG:'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {relatedReleases.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => setSelectedRelease(rel)}
                      className="flex items-center space-x-3 p-3 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red rounded-none cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-sm overflow-hidden border border-void-700 shrink-0 group-hover:border-signal-red transition-colors">
                        <img
                          src={rel.artworkUrl}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="overflow-hidden font-mono">
                        <div className="text-xs font-bold text-white group-hover:text-signal-red transition-colors truncate font-sans">
                          {rel.title}
                        </div>
                        <div className="text-[10px] text-technical-silver truncate mt-0.5">{rel.artists}</div>
                        <div className="text-[9px] text-signal-red mt-1">{rel.year} // {rel.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-void-800/80 mt-6 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-technical-muted">
              <span className="truncate">СВЯЗЬ: dYnex? ⇄ {activeCollab.name}</span>
              <div className="barcode-pattern w-20 h-2 opacity-50 hidden sm:block" />
              <span className="text-signal-red font-bold">3D NODE // LINKED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
