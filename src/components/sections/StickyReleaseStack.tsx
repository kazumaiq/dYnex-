import React from 'react';
import { Play, Disc3, Layers, Zap } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const StickyReleaseStack: React.FC = () => {
  const { releases, setSelectedRelease, language } = useArchive();

  const stackIds = ['abstract', 'montagem-bateria', 'second-life', 'cyber-memories'];
  const stackReleases = stackIds
    .map((id) => releases.find((r) => r.id === id))
    .filter(Boolean) as typeof releases;

  const displayReleases = stackReleases.length >= 3 ? stackReleases : releases.slice(0, 4);

  return (
    <section
      id="stack"
      className="relative w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 pointer-events-none select-none max-w-7xl mx-auto overflow-hidden"
    >
      <div className="w-full pointer-events-auto mb-10 sm:mb-14">
        <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
          <Layers size={13} className="text-signal-red" />
          <span className="font-bold">
            {language === 'ru' ? '// 02.5 СТЕК ФЛАГМАНСКИХ ПОСТЕРОВ' : '// 02.5 FLAGSHIP POSTER STACK'}
          </span>
          <span className="text-void-700">//</span>
          <span className="text-technical-muted">物理ポスター // PHYSICAL STACK</span>
        </div>
        <h2 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase">
          {language === 'ru' ? 'КУЛЬТОВЫЕ СИНГЛЫ' : 'LANDMARK ANTHEMS'}
        </h2>
        <p className="text-xs sm:text-sm font-mono text-technical-silver max-w-xl mt-2">
          {language === 'ru'
            ? 'Физический стек коллекционных постеров. Прокручивайте страницу, чтобы исследовать ключевые релизы в пространстве.'
            : 'Physical stacking sheets in space. Scroll through to inspect milestone releases across the catalog horizon.'}
        </p>
      </div>

      <div className="relative w-full space-y-8 sm:space-y-12 pb-16">
        {displayReleases.map((release, index) => {
          return (
            <div
              key={release.id}
              className="sticky top-24 sm:top-28 w-full pointer-events-auto"
              style={{
                zIndex: index + 10,
              }}
            >
              <div className="relative group">
                {/* Offset red edge backdrop for physical poster feeling */}
                <div className="absolute -inset-1 bg-signal-red/25 border border-signal-red/50 pointer-events-none" />

                <div className="tactical-border relative w-full p-6 sm:p-10 bg-void-950/95 backdrop-blur-2xl border border-void-700 hover:border-signal-red rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute right-4 bottom-2 font-sans font-black text-6xl sm:text-8xl lg:text-[9rem] tracking-tighter text-stroke-ghost select-none pointer-events-none opacity-20 leading-none"
                  >
                    #{String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Artwork Container with sharp red frame */}
                    <div className="w-full md:w-72 sm:w-80 shrink-0 aspect-square rounded-none overflow-hidden border border-void-700 group-hover:border-signal-red transition-colors relative shadow-2xl">
                      <img
                        src={release.artworkUrl}
                        alt={release.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2 py-0.5 bg-void-950/90 border border-signal-red text-[10px] font-mono text-signal-red font-bold">
                        FLAGSHIP // {release.year}
                      </div>
                    </div>

                    {/* Metadata block */}
                    <div className="flex-1 w-full font-mono space-y-3">
                      <div className="flex items-center space-x-2 text-xs text-signal-red">
                        <Disc3 size={13} className="text-signal-red animate-spin-slow" />
                        <span className="font-bold uppercase tracking-widest">
                          CATALOGUE ID: DNX-{String(index + 1).padStart(3, '0')}
                        </span>
                        <span className="text-void-700">//</span>
                        <span className="text-technical-muted">{release.date}</span>
                      </div>

                      <h3 className="text-3xl sm:text-5xl font-black font-sans text-white uppercase tracking-tight group-hover:text-signal-red transition-colors">
                        {release.title}
                      </h3>

                      <div className="text-sm text-technical-silver font-bold flex items-center space-x-2">
                        <span>{release.artists}</span>
                        <Zap size={11} className="text-signal-red fill-signal-red" />
                      </div>

                      <p className="text-xs text-technical-muted leading-relaxed max-w-lg">
                        {release.description ||
                          (language === 'ru'
                            ? 'Официальный флагманский релиз, определивший вектор звучания артиста.'
                            : 'Official landmark release setting the sonic trajectory of the catalog.')}
                      </p>

                      <div className="flex items-center space-x-4 pt-2 text-xs text-technical-silver">
                        <span className="px-2.5 py-1 bg-void-900 border border-signal-red/40 text-[10px] text-signal-red font-bold">
                          {release.genre}
                        </span>
                        <span className="text-[11px] text-technical-muted">
                          TRACKS: {release.trackCount}
                        </span>
                      </div>

                      <div className="barcode-pattern w-48 h-2.5 opacity-70 pt-2" />
                    </div>

                    {/* Action button */}
                    <div className="w-full md:w-auto shrink-0 flex flex-col items-end justify-center pt-4 md:pt-0 border-t md:border-t-0 border-void-800/80">
                      <button
                        onClick={() => setSelectedRelease(release)}
                        className="w-full md:w-auto px-6 py-3.5 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs tracking-widest uppercase rounded-none flex items-center justify-center space-x-2.5 transition-all duration-200 active:scale-95 shadow-signal-red-sharp"
                      >
                        <Play size={13} className="fill-white" />
                        <span>{language === 'ru' ? 'СЛУШАТЬ ТРЕК' : 'INSPECT RELEASE'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
