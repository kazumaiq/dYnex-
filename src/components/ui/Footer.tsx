import React from 'react';
import { Lock, Radio, ExternalLink } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const Footer: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  const { language } = useArchive();

  return (
    <footer className="relative z-10 w-full py-16 px-6 border-t border-void-800/80 bg-void-950/60 backdrop-blur-md select-none font-mono text-xs text-technical-muted">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Concept */}
        <div className="flex flex-col space-y-2 text-center md:text-left">
          <div className="text-2xl font-bold font-sans tracking-tight text-white">
            dYnex<span className="text-signal-red">?</span>
          </div>
          <p className="text-technical-muted tracking-widest text-[11px]">
            {language === 'ru'
              ? 'ОФИЦИАЛЬНЫЙ ЦИФРОВОЙ ИНТЕРАКТИВНЫЙ 3D АРХИВ // 2023—2026'
              : 'OFFICIAL DIGITAL INTERACTIVE 3D ARCHIVE // 2023—2026'}
          </p>
          <div className="text-[10px] text-technical-muted/70">
            ELECTRONIC • PHONK • BRAZILIAN PHONK • EXPERIMENTAL
          </div>
        </div>

        {/* Platform Links */}
        <div className="flex flex-wrap justify-center gap-4 text-[11px]">
          <a
            href="https://music.apple.com/us/artist/dynex/1697850899"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-signal-red transition-colors"
          >
            <span>Apple Music</span>
            <ExternalLink size={10} />
          </a>
          <a
            href="https://open.spotify.com/search/dYnex%3F"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-signal-red transition-colors"
          >
            <span>Spotify</span>
            <ExternalLink size={10} />
          </a>
          <a
            href="https://vk.com/audio?q=dYnex"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-signal-red transition-colors"
          >
            <span>VK Музыка</span>
            <ExternalLink size={10} />
          </a>
          <a
            href="https://www.youtube.com/results?search_query=dYnex%3F+phonk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-signal-red transition-colors"
          >
            <span>YouTube</span>
            <ExternalLink size={10} />
          </a>
        </div>

        {/* System telemetry & Admin Gateway */}
        <div className="flex flex-col items-center md:items-end space-y-2">
          <div className="flex items-center space-x-2 text-[10px] text-technical-silver">
            <Radio size={12} className="text-signal-red animate-pulse" />
            <span>{language === 'ru' ? 'СЕРВЕР: VERCEL EDGE // АКТИВЕН' : 'HOST: VERCEL EDGE // ACTIVE'}</span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-void-900 hover:bg-void-850 border border-void-800 hover:border-signal-red/60 text-[10px] text-technical-muted hover:text-white rounded-sm transition-colors"
          >
            <Lock size={10} className="text-signal-red" />
            <span>{language === 'ru' ? 'ПАНЕЛЬ УПРАВЛЕНИЯ /ADMIN' : 'CONTROL TERMINAL /ADMIN'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
