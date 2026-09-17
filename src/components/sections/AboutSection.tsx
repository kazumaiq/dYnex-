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
  const { language } = useArchive();

  const manifestoRu =
    'dYnex? — независимый артист и музыкальный продюсер, звуковой почерк которого балансирует на стыке футуристичного электронного звучания, тёмного фонка, бразильского фонка и гипнотического ритма. С 2023 года релизы dYnex? формируют самобытную звуковую архитектуру, не скованную рамками одного жанра.';

  const manifestoEn =
    'dYnex? is an independent artist and music producer whose sound moves between futuristic electronic music, dark phonk, Brazilian phonk, and hypnotic rhythmic structures. Active across verified digital platforms since 2023, dYnex? crafts an unconventional digital world unbound by single-genre constraints.';

  return (
    <section
      id="about"
      className="relative min-h-screen w-full px-6 sm:px-12 py-32 flex flex-col justify-center pointer-events-none select-none"
    >
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        {/* Zone indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-4">
          <span>// 03</span>
          <span>{language === 'ru' ? 'МАНИФЕСТ ИДЕНТИЧНОСТИ' : 'IDENTITY MANIFESTO'}</span>
        </div>

        {/* Primary Statement */}
        <h2 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter text-white uppercase mb-12">
          {language === 'ru' ? (
            <>
              БЕЗ ФИКСИРОВАННОЙ<br />
              <span className="text-signal-red">ЧАСТОТЫ.</span>
            </>
          ) : (
            <>
              NO FIXED<br />
              <span className="text-signal-red">FREQUENCY.</span>
            </>
          )}
        </h2>

        {/* Character-by-character scroll revealed paragraph */}
        <div className="mb-12 p-6 sm:p-8 bg-void-900/40 backdrop-blur-md border border-void-800/80 rounded-sm">
          <RevealText text={language === 'ru' ? manifestoRu : manifestoEn} />
        </div>

        {/* Technical Data Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs border-t border-void-800 pt-6">
          <div className="space-y-1">
            <div className="text-technical-muted uppercase">{language === 'ru' ? 'АРТИСТ:' : 'ARTIST:'}</div>
            <div className="text-white font-bold">dYnex<span className="text-signal-red">?</span></div>
          </div>
          <div className="space-y-1">
            <div className="text-technical-muted uppercase">{language === 'ru' ? 'ПЕРИОД:' : 'PERIOD:'}</div>
            <div className="text-white font-bold">2023 — 2026</div>
          </div>
          <div className="space-y-1">
            <div className="text-technical-muted uppercase">{language === 'ru' ? 'КАТАЛОГ:' : 'CATALOG:'}</div>
            <div className="text-signal-red font-bold">{language === 'ru' ? '24 РЕЛИЗА' : '24 RELEASES'}</div>
          </div>
          <div className="space-y-1">
            <div className="text-technical-muted uppercase">{language === 'ru' ? 'СТАТУС:' : 'STATUS:'}</div>
            <div className="text-technical-silver font-bold">INDEPENDENT</div>
          </div>
        </div>
      </div>
    </section>
  );
};
