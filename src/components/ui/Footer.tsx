import React from 'react';
import { Radio, ExternalLink } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { useCommunity } from '../../context/CommunityContext';

export const Footer: React.FC<{ onOpenAdmin?: () => void }> = React.memo(() => {
  const { language } = useArchive();
  const { openTraceWall, openTransmission, openCollab } = useCommunity();

  return (
    <footer className="relative z-10 w-full py-16 px-6 border-t border-void-800/80 bg-void-950/98 select-none font-mono text-xs text-technical-muted">
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

        {/* Platform & Direct Social Links */}
        <div className="flex flex-col items-center space-y-3">
          {/* Direct Social Nodes */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://vk.ru/artist/654356884443821665"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-1.5 bg-void-900/90 border border-void-700 hover:border-[#0077FF] hover:bg-[#0077FF]/10 text-white rounded-none text-[11px] transition-all duration-200 group"
              title="ВКонтакте: Карточка артиста dYnex?"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#0077FF] group-hover:scale-110 transition-transform">
                <path d="M15.686 8.5c.08-.28-.15-.5-.43-.5h-1.43c-.23 0-.34.11-.4.23-.78 2.05-1.86 3.86-2.67 3.86-.14 0-.21-.07-.21-.29V8.5c0-.28-.09-.5-.4-.5h-2.22c-.17 0-.28.13-.28.25 0 .26.4.32.44 1.05v1.59c0 .35-.06.49-.2.49-.38 0-1.31-1.39-1.86-2.98-.08-.24-.2-.4-.44-.4H4.56c-.27 0-.33.13-.33.27 0 .25.33 1.51 1.54 3.23 1.25 1.77 3 2.73 4.49 2.73.9 0 1.11-.2 1.11-.55v-1.28c0-.4.18-.5.44-.5.2 0 .54.1 1.34.87.91.91 1.07 1.46 1.58 1.46h1.43c.27 0 .41-.14.33-.4-.17-.53-1.12-1.74-1.63-2.31-.22-.26-.31-.38 0-.8.01 0 1.78-2.51 1.95-3.37z" />
              </svg>
              <span className="font-bold tracking-wider text-technical-light group-hover:text-white">ВК // Карточка артиста</span>
              <ExternalLink size={10} className="text-technical-muted group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://vk.ru/dynexxx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-1.5 bg-void-900/90 border border-void-700 hover:border-[#0077FF] hover:bg-[#0077FF]/10 text-white rounded-none text-[11px] transition-all duration-200 group"
              title="ВКонтакте: Паблик https://vk.ru/dynexxx"
            >
              <span className="font-bold tracking-wider text-technical-light group-hover:text-white">ВК // dynexxx</span>
              <ExternalLink size={10} className="text-technical-muted group-hover:text-white transition-colors" />
            </a>

            <a
              href="https://t.me/dYnexM"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-3 py-1.5 bg-void-900/90 border border-void-700 hover:border-[#229ED9] hover:bg-[#229ED9]/10 text-white rounded-none text-[11px] transition-all duration-200 group"
              title="Telegram (Личный контакт / ЛС артиста): @dYnexM"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#229ED9] group-hover:scale-110 transition-transform">
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.672c.46 0 .664-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.411z" />
              </svg>
              <span className="font-bold tracking-wider text-technical-light group-hover:text-white">ТГ ЛС // @dYnexM</span>
              <ExternalLink size={10} className="text-technical-muted group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Community Nodes Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-mono text-technical-muted pt-1">
            <a href="#community" className="text-technical-silver hover:text-signal-red transition-colors">
              // {language === 'ru' ? 'СООБЩЕСТВО' : 'COMMUNITY'}
            </a>
            <span className="text-void-700">•</span>
            <button onClick={openTraceWall} className="text-technical-silver hover:text-signal-red transition-colors">
              {language === 'ru' ? 'СТЕНА СЛЕДОВ' : 'TRACE WALL'}
            </button>
            <span className="text-void-700">•</span>
            <button onClick={openTransmission} className="text-technical-silver hover:text-[#229ED9] transition-colors">
              {language === 'ru' ? 'НАПИСАТЬ dYnex?' : 'TRANSMIT'}
            </button>
            <span className="text-void-700">•</span>
            <button onClick={openCollab} className="text-technical-silver hover:text-signal-red transition-colors">
              {language === 'ru' ? 'ФИТ / COLLAB' : 'FIT / COLLAB'}
            </button>
          </div>

          {/* Streaming Platforms */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-technical-muted">
            <a
              href="https://music.apple.com/us/artist/dynex/1697850899"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>Apple Music</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-void-700 hidden sm:inline">•</span>
            <a
              href="https://open.spotify.com/artist/1AnrK4s39q55gZbNkcnuDg"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-signal-red transition-colors"
            >
              <span>Spotify</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-void-700 hidden sm:inline">•</span>
            <a
              href="https://vk.ru/artist/654356884443821665"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>VK Музыка</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-void-700 hidden sm:inline">•</span>
            <a
              href="https://music.yandex.ru/artist/19034250"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-signal-red transition-colors"
            >
              <span>Яндекс Музыка</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-void-700 hidden sm:inline">•</span>
            <a
              href="http://www.youtube.com/channel/UCvfg0sozSo6rPRkQVsjqm7g"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-signal-red transition-colors"
            >
              <span>YouTube</span>
              <ExternalLink size={10} />
            </a>
            <span className="text-void-700 hidden sm:inline">•</span>
            <a
              href="https://music.youtube.com/channel/UCvfg0sozSo6rPRkQVsjqm7g"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>YouTube Music</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* System telemetry & Admin Gateway */}
        <div className="flex flex-col items-center md:items-end space-y-2.5">
          <div className="flex items-center space-x-2 text-[10px] text-technical-silver">
            <Radio size={12} className="text-signal-red animate-pulse" />
            <span className="text-signal-red font-bold">{language === 'ru' ? 'СИГНАЛ: 100% // ОНЛАЙН' : 'SIGNAL: 100% // ONLINE'}</span>
            <span className="text-void-700">//</span>
            <button
              onClick={() => { window.location.hash = '#admin'; }}
              className="text-technical-muted hover:text-signal-red transition-colors flex items-center space-x-1 cursor-pointer"
              title="Открыть панель администратора dYnex?"
            >
              <span>SYS_VER: 2026.4.1</span>
              <span className="text-signal-red font-bold">[ADMIN]</span>
            </button>
          </div>

          <div className="text-[9px] text-technical-muted tracking-widest uppercase">
            // END OF SIGNAL • ARCHIVE SESSION CLOSED • 信号終了
          </div>

          <div className="flex items-center space-x-3 text-[10px] text-technical-muted">
            <div className="barcode-pattern w-16 h-2 opacity-50 hidden sm:block" />
            <span>© 2023—2026 dYnex? // ALL RIGHTS RESERVED</span>
          </div>
        </div>
      </div>
    </footer>
  );
});
