import React, { useRef, useEffect, useState } from 'react';

export const MarqueeSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '100px 0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full py-8 sm:py-12 overflow-hidden select-none pointer-events-none border-y border-void-800/80 bg-void-950/90"
    >
      {/* Track 1: Moving Left */}
      <div className="flex whitespace-nowrap mb-3 overflow-hidden">
        <div
          className="animate-marquee-left text-2xl sm:text-4xl lg:text-5xl font-black font-sans tracking-tight uppercase"
          style={{ animationPlayState: isInView ? 'running' : 'paused' }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mr-8 flex items-center space-x-4 shrink-0">
              <span className="text-white">dYnex<span className="text-signal-red">?</span></span>
              <span className="text-void-700">//</span>
              <span className="text-stroke-red font-bold">軌道アーカイブ</span>
              <span className="text-void-700">//</span>
              <span className="text-technical-silver">ELECTRONIC PHONK</span>
              <span className="text-void-700">//</span>
              <span className="text-signal-red">2023—2026</span>
              <span className="barcode-pattern w-12 h-3 opacity-60 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* Track 2: Moving Right */}
      <div className="flex whitespace-nowrap overflow-hidden">
        <div
          className="animate-marquee-right text-xl sm:text-3xl lg:text-4xl font-black font-sans tracking-tight text-technical-muted/80 uppercase"
          style={{ animationPlayState: isInView ? 'running' : 'paused' }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="mr-8 flex items-center space-x-4 shrink-0">
              <span className="text-stroke-ghost">NO FIXED FREQUENCY</span>
              <span className="text-void-800">•</span>
              <span className="text-signal-red font-mono">音響周波数</span>
              <span className="text-void-800">•</span>
              <span className="text-white">ABSTRACT</span>
              <span className="text-void-800">•</span>
              <span className="text-signal-red">SYSTEM BROADCAST</span>
              <span className="barcode-pattern-silver w-10 h-2.5 opacity-40 inline-block" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
