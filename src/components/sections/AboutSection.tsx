import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useArchive } from '../../context/ArchiveContext';

// Character reveal element
const RevealText: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.4'],
  });

  const words = text.split(' ');

  return (
    <p ref={containerRef} className="flex flex-wrap text-lg sm:text-2xl lg:text-3xl font-sans font-medium text-white leading-relaxed">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} word={word} progress={scrollYProgress} range={[start, end]} />
        );
      })}
    </p>
  );
};

const Word: React.FC<{ word: string; progress: any; range: [number, number] }> = ({
  word,
  progress,
  range,
}) => {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="mr-2 mb-1">
      {word}
    </motion.span>
  );
};

export const AboutSection: React.FC = () => {
  const { language, releases } = useArchive();

  const publishedCount = releases.filter((r) => r.published !== false).length;

  const manifestoRu =
    'dYnex? — независимый артист и музыкальный продюсер, звуковой почерк которого балансирует на стыке футуристичного электронного звучания, тёмного фонка, бразильского фонка и гипнотического ритма. С 2023 года релизы dYnex? формируют самобытную звуковую архитектуру, не скованную рамками одного жанра.';

  const manifestoEn =
    'dYnex? is an independent artist and music producer whose sound moves between futuristic electronic music, dark phonk, Brazilian phonk, and hypnotic rhythmic structures. Active across verified digital platforms since 2023, dYnex? crafts an unconventional digital world unbound by single-genre constraints.';

  return (
    <section
      id="about"
      className="relative min-h-screen w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 flex flex-col justify-center pointer-events-none select-none overflow-hidden"
    >
      {/* Ghost Background Typographic Watermark */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-1/3 -translate-y-1/2 select-none pointer-events-none text-stroke-ghost text-6xl sm:text-8xl lg:text-[13rem] font-black leading-none opacity-20 -z-10 tracking-tighter"
      >
        MANIFESTO
      </div>

      <div className="max-w-5xl mx-auto w-full pointer-events-auto relative z-10 flex flex-col lg:flex-row items-start">
        {/* Japanese Vertical Editorial Side Strip */}
        <div className="hidden lg:flex flex-col items-center font-mono text-[9px] text-technical-muted tracking-widest uppercase writing-vertical border-r border-void-800/80 pr-4 mr-8 space-y-6 opacity-60">
          <span>周波数固定なし // 音響マニフェスト</span>
          <div className="barcode-pattern w-2 h-16 opacity-70" />
          <span>ARCHIVE NODE // ZERO CONSTRAINT</span>
        </div>

        {/* Content Body */}
        <div className="flex-1 w-full">
          {/* Zone indicator */}
          <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-4">
            <span className="text-cyber-purple-glow">// 03</span>
            <span className="font-bold">{language === 'ru' ? 'МАНИФЕСТ ИДЕНТИЧНОСТИ' : 'IDENTITY MANIFESTO'}</span>
            <span className="text-void-700">//</span>
            <span className="text-technical-muted font-mono">NODE 0X-DYNEX</span>
          </div>

          {/* Primary Statement */}
          <h2 className="font-sans font-black text-4xl sm:text-6xl lg:text-8xl tracking-tighter text-white uppercase mb-8 sm:mb-12 leading-none">
            {language === 'ru' ? (
              <>
                БЕЗ ФИКСИРОВАННОЙ<br />
                <span className="text-signal-red">
                  ЧАСТОТЫ.
                </span>
              </>
            ) : (
              <>
                NO FIXED<br />
                <span className="text-signal-red">
                  FREQUENCY.
                </span>
              </>
            )}
          </h2>

          {/* Character-by-character scroll revealed paragraph in tactical frame */}
          <div className="tactical-border mb-10 p-6 sm:p-8 bg-void-950/90 backdrop-blur-xl border border-void-800 rounded-sm hover:border-cyber-purple/50 transition-colors shadow-2xl">
            <RevealText text={language === 'ru' ? manifestoRu : manifestoEn} />
            <div className="barcode-pattern-silver w-24 h-2 mt-6 opacity-40" />
          </div>

          {/* Technical Data Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs border-t border-void-800/80 pt-6">
            <div className="space-y-1">
              <div className="text-technical-muted text-[10px] uppercase">{language === 'ru' ? 'АРТИСТ:' : 'ARTIST:'}</div>
              <div className="text-white font-bold text-sm">dYnex<span className="text-signal-red">?</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-technical-muted text-[10px] uppercase">{language === 'ru' ? 'ПЕРИОД:' : 'TIMELINE:'}</div>
              <div className="text-white font-bold text-sm">2023 — 2026</div>
            </div>
            <div className="space-y-1">
              <div className="text-technical-muted text-[10px] uppercase">{language === 'ru' ? 'РЕЛИЗЫ:' : 'RELEASES:'}</div>
              <div className="text-signal-red font-bold text-sm">
                {publishedCount} {language === 'ru' ? 'АКТИВНЫХ' : 'VERIFIED'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-technical-muted text-[10px] uppercase">{language === 'ru' ? 'СТАТУС:' : 'STATUS:'}</div>
              <div className="text-cyber-purple-glow font-bold text-sm">INDEPENDENT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
