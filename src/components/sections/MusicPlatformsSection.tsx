import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Radio, Disc3 } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

interface PlatformItem {
  id: string;
  name: string;
  url: string;
  protocolTag: string;
  tagRu: string;
  tagEn: string;
  svgIcon: React.ReactNode;
}

export const MusicPlatformsSection: React.FC = React.memo(() => {
  const { language } = useArchive();

  const platforms: PlatformItem[] = [
    {
      id: 'apple',
      name: 'Apple Music',
      url: 'https://music.apple.com/us/artist/dynex/1697850899',
      protocolTag: '// APPL.AUDIO.TERMINAL',
      tagRu: 'Официальный профиль артиста и Lossless аудио',
      tagEn: 'Official verified artist profile & lossless audio',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.03.62-2.69 1.37-.58.67-1.09 1.74-1.05 2.78 1.03.08 2.11-.55 2.73-1.3" />
        </svg>
      )
    },
    {
      id: 'spotify',
      name: 'Spotify',
      url: 'https://open.spotify.com/artist/1AnrK4s39q55gZbNkcnuDg',
      protocolTag: '// SPOTIFY.STREAM.NODE',
      tagRu: 'Официальный профиль артиста и вся дискография',
      tagEn: 'Official verified artist profile & discography',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10s10-4.476 10-10c0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.335.077-.67-.133-.746-.469-.077-.334.132-.67.467-.747 3.808-.87 7.076-.506 9.722 1.115.293.18.386.563.207.857zm1.224-2.719c-.226.367-.706.482-1.072.257-2.69-1.653-6.79-2.131-9.97-1.165-.413.125-.85-.11-1.004-.523-.125-.413.11-.85.523-.975 3.633-1.102 8.147-.568 11.266 1.349.366.226.482.705.257 1.082zm.106-2.835C14.692 8.95 9.218 8.767 6.046 9.73c-.495.15-1.022-.128-1.173-.623-.15-.495.129-1.022.624-1.173 3.673-1.114 9.715-.903 13.486 1.335.445.264.59.838.327 1.282-.264.444-.838.59-1.282.327z" />
        </svg>
      )
    },
    {
      id: 'vk',
      name: 'VK Музыка',
      url: 'https://vk.ru/artist/654356884443821665',
      protocolTag: '// VK.AUDIO.SYS.FEED',
      tagRu: 'Официальная карточка музыканта ВКонтакте',
      tagEn: 'Verified VK Music artist terminal',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M15.686 8.5c.08-.28-.15-.5-.43-.5h-1.43c-.23 0-.34.11-.4.23-.78 2.05-1.86 3.86-2.67 3.86-.14 0-.21-.07-.21-.29V8.5c0-.28-.09-.5-.4-.5h-2.22c-.17 0-.28.13-.28.25 0 .26.4.32.44 1.05v1.59c0 .35-.06.49-.2.49-.38 0-1.31-1.39-1.86-2.98-.08-.24-.2-.4-.44-.4H4.56c-.27 0-.33.13-.33.27 0 .25.33 1.51 1.54 3.23 1.25 1.77 3 2.73 4.49 2.73.9 0 1.11-.2 1.11-.55v-1.28c0-.4.18-.5.44-.5.2 0 .54.1 1.34.87.91.91 1.07 1.46 1.58 1.46h1.43c.27 0 .41-.14.33-.4-.17-.53-1.12-1.74-1.63-2.31-.22-.26-.31-.38 0-.8.01 0 1.78-2.51 1.95-3.37z" />
        </svg>
      )
    },
    {
      id: 'yandex',
      name: 'Яндекс Музыка',
      url: 'https://music.yandex.ru/artist/19034250',
      protocolTag: '// YANDEX.WAVE.NODE',
      tagRu: '«Моя волна», официальный профиль и чарты',
      tagEn: 'My Wave, verified artist profile & charts',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 14.7c-.4.4-1 .4-1.4 0L12 14.3l-2.4 2.4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l2.4-2.4-2.4-2.4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l2.4 2.4 2.4-2.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L13.4 12.9l2.4 2.4c.4.4.4 1 0 1.4z" />
        </svg>
      )
    },
    {
      id: 'youtube',
      name: 'YouTube Канал',
      url: 'http://www.youtube.com/channel/UCvfg0sozSo6rPRkQVsjqm7g',
      protocolTag: '// YT.OFFICIAL.CHANNEL',
      tagRu: 'Официальный YouTube-канал артиста и клипы',
      tagEn: 'Official YouTube channel, visuals & videos',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      id: 'youtubeMusic',
      name: 'YouTube Music',
      url: 'https://music.youtube.com/channel/UCvfg0sozSo6rPRkQVsjqm7g',
      protocolTag: '// YT.MUSIC.TERMINAL',
      tagRu: 'Стриминг и дискография в YouTube Music',
      tagEn: 'Official streaming & audio on YouTube Music',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="platforms"
      className="relative min-h-screen w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 flex flex-col justify-center pointer-events-none select-none overflow-hidden max-w-7xl mx-auto"
    >
      <div className="w-full pointer-events-auto">
        {/* Top Header Tag */}
        <div className="flex items-center space-x-3 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-red" />
          </span>
          <span className="font-bold">// 06</span>
          <span className="text-white/80 font-bold">
            {language === 'ru' ? 'ЦИФРОВАЯ ДИСТРИБУЦИЯ' : 'DIGITAL DISTRIBUTION MATRIX'}
          </span>
          <span className="text-void-700">//</span>
          <span className="text-technical-muted">配信プラットフォーム // TERMINALS</span>
        </div>

        {/* Section Headline */}
        <h2 className="font-sans font-black text-4xl sm:text-6xl lg:text-8xl tracking-tighter text-white uppercase mb-4 leading-none">
          {language === 'ru' ? (
            <>
              СЛУШАТЬ <br />
              <span className="text-signal-red">
                ВЕЗДЕ.
              </span>
            </>
          ) : (
            <>
              LISTEN <br />
              <span className="text-signal-red">
                ANYWHERE.
              </span>
            </>
          )}
        </h2>

        {/* Description & Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 border-b border-void-800/80 pb-6">
          <p className="text-xs sm:text-sm font-mono text-technical-silver max-w-xl leading-relaxed">
            {language === 'ru'
              ? 'Прямой доступ к официальным релизам dYnex? в глобальных аудиосетях. Нажмите на карточку для перехода в каталог.'
              : 'Instant access to official dYnex? discography across verified streaming nodes. Select a service to enter.'}
          </p>
          <div className="flex items-center space-x-2 font-mono text-[11px] text-technical-muted shrink-0">
            <Radio size={12} className="text-signal-red animate-pulse" />
            <span className="text-signal-red font-bold">
              {language === 'ru' ? '6 ПЛАТФОРМ • 2 КАНАЛА СВЯЗИ ОНЛАЙН' : '6 HUBS • 2 DIRECT NODES ONLINE'}
            </span>
          </div>
        </div>

        {/* High-Tech Grid with Sharp Red-Black Editorial Styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map((p, idx) => {
            return (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="group relative p-6 bg-void-950/98 border border-void-700 rounded-none transition-all duration-300 flex flex-col justify-between h-56 overflow-hidden hover:border-signal-red shadow-subtle-card cursor-pointer"
              >
                {/* Top Row: Icon + Protocol Tag + External Link Arrow */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    {/* Platform Brand Icon Container */}
                    <div className="w-11 h-11 rounded-none bg-void-900 border border-void-700 text-signal-red group-hover:border-signal-red transition-all duration-300 flex items-center justify-center">
                      {p.svgIcon}
                    </div>

                    {/* Protocol Tag */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono tracking-wider text-technical-muted group-hover:text-signal-red transition-colors">
                        {p.protocolTag}
                      </span>
                      <div className="flex items-center space-x-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-signal-red" />
                        <span className="text-[9px] font-mono uppercase text-technical-muted/70 tracking-widest">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corner Arrow with smooth slide */}
                  <div className="w-8 h-8 rounded-none bg-void-950 border border-void-700 flex items-center justify-center text-technical-muted group-hover:text-white group-hover:border-signal-red group-hover:bg-signal-red/20 transition-all">
                    <ArrowUpRight
                      size={15}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-red transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Middle: Equalizer soundwave simulation that dances on hover */}
                <div className="flex items-end space-x-1 my-2 py-1 opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="w-1 h-2 group-hover:h-4 bg-signal-red rounded-none transition-all duration-300" />
                  <span className="w-1 h-4 group-hover:h-2 bg-technical-silver rounded-none transition-all duration-200" />
                  <span className="w-1 h-3 group-hover:h-5 bg-signal-red rounded-none transition-all duration-400" />
                  <span className="w-1 h-5 group-hover:h-3 bg-white rounded-none transition-all duration-250" />
                  <span className="w-1 h-2 group-hover:h-4 bg-signal-red rounded-none transition-all duration-350" />
                </div>

                {/* Bottom Row: Platform Name + Description + Stream CTA */}
                <div className="relative z-10 border-t border-void-800/80 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold font-sans text-white group-hover:text-signal-red transition-colors">
                      {p.name}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-signal-red uppercase font-semibold group-hover:text-white transition-colors">
                      {language === 'ru' ? 'ПЕРЕЙТИ →' : 'STREAM →'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-technical-muted mt-1 truncate">
                    {language === 'ru' ? p.tagRu : p.tagEn}
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Official Channels & Direct Comms (VK & Telegram) */}
        <div className="mt-10 pt-8 border-t border-void-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div className="flex items-center space-x-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest-tech">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-red" />
              </span>
              <span className="text-signal-red font-bold">// 06.B</span>
              <span className="text-white font-bold">
                {language === 'ru' ? 'СООБЩЕСТВО ВК & ЛИЧНЫЙ ЛС' : 'VK COMMUNITY & DIRECT PM'}
              </span>
              <span className="text-void-700">//</span>
              <span className="text-technical-muted">DIRECT FEED</span>
            </div>
            <div className="text-[10px] font-mono text-technical-muted">
              {language === 'ru' ? '// ПАБЛИК ВКОНТАКТЕ И ЛИЧНЫЙ КОНТАКТ' : '// VK PUBLIC & PERSONAL CONTACT'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* VKontakte Official Hub */}
            <motion.a
              href="https://vk.ru/artist/654356884443821665"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="group relative p-6 bg-gradient-to-br from-void-950 via-void-900/90 to-void-950 border border-void-700 rounded-none transition-all duration-300 flex flex-col justify-between h-56 overflow-hidden hover:border-[#0077FF] hover:shadow-[0_0_30px_rgba(0,119,255,0.18)] cursor-pointer"
            >
              {/* Corner tech accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-void-700 group-hover:border-[#0077FF] transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-void-700 group-hover:border-[#0077FF] transition-colors" />

              {/* Top Row */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-none bg-void-900/90 border border-void-700 text-[#0077FF] group-hover:border-[#0077FF] group-hover:bg-[#0077FF]/10 transition-all duration-300 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M15.686 8.5c.08-.28-.15-.5-.43-.5h-1.43c-.23 0-.34.11-.4.23-.78 2.05-1.86 3.86-2.67 3.86-.14 0-.21-.07-.21-.29V8.5c0-.28-.09-.5-.4-.5h-2.22c-.17 0-.28.13-.28.25 0 .26.4.32.44 1.05v1.59c0 .35-.06.49-.2.49-.38 0-1.31-1.39-1.86-2.98-.08-.24-.2-.4-.44-.4H4.56c-.27 0-.33.13-.33.27 0 .25.33 1.51 1.54 3.23 1.25 1.77 3 2.73 4.49 2.73.9 0 1.11-.2 1.11-.55v-1.28c0-.4.18-.5.44-.5.2 0 .54.1 1.34.87.91.91 1.07 1.46 1.58 1.46h1.43c.27 0 .41-.14.33-.4-.17-.53-1.12-1.74-1.63-2.31-.22-.26-.31-.38 0-.8.01 0 1.78-2.51 1.95-3.37z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-wider text-technical-muted group-hover:text-[#0077FF] transition-colors">
                      // VK.ARTIST.HUB
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0077FF] animate-pulse" />
                      <span className="text-[9px] font-mono uppercase text-[#0077FF] tracking-widest font-semibold">
                        {language === 'ru' ? 'КАРТОЧКА АРТИСТА // ПАБЛИК' : 'ARTIST CARD // HUB'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-none bg-void-950 border border-void-700 flex items-center justify-center text-technical-muted group-hover:text-white group-hover:border-[#0077FF] group-hover:bg-[#0077FF]/20 transition-all">
                  <ArrowUpRight
                    size={15}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0077FF] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Middle: Content */}
              <div className="relative z-10 my-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold font-sans text-white group-hover:text-[#0077FF] transition-colors">
                    ВКонтакте
                  </span>
                  <span className="text-xs font-mono text-technical-silver px-2 py-0.5 bg-void-900 border border-void-800 rounded-none group-hover:border-[#0077FF]/40">
                    vk.ru/artist/654356884443821665
                  </span>
                </div>
                <p className="text-[11px] font-mono text-technical-muted mt-1">
                  {language === 'ru'
                    ? 'Официальная карточка музыканта dYnex? ВКонтакте и паблик сообщества (vk.ru/dynexxx).'
                    : 'Official dYnex? VK Music artist card and listener community page (vk.ru/dynexxx).'}
                </p>
              </div>

              {/* Bottom: CTA */}
              <div className="relative z-10 border-t border-void-800/80 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-technical-muted">
                  ID: 654356884443821665 // VERIFIED
                </span>
                <span className="text-[11px] font-mono tracking-widest text-[#0077FF] uppercase font-bold group-hover:underline flex items-center space-x-1">
                  <span>{language === 'ru' ? 'ОТКРЫТЬ КАРТОЧКУ АРТИСТА' : 'OPEN ARTIST CARD'}</span>
                  <span>→</span>
                </span>
              </div>
            </motion.a>

            {/* Telegram Personal Direct PM */}
            <motion.a
              href="https://t.me/dYnexM"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="group relative p-6 bg-gradient-to-br from-void-950 via-void-900/90 to-void-950 border border-void-700 rounded-none transition-all duration-300 flex flex-col justify-between h-56 overflow-hidden hover:border-[#229ED9] hover:shadow-[0_0_30px_rgba(34,158,217,0.18)] cursor-pointer"
            >
              {/* Corner tech accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-void-700 group-hover:border-[#229ED9] transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-void-700 group-hover:border-[#229ED9] transition-colors" />

              {/* Top Row */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-none bg-void-900/90 border border-void-700 text-[#229ED9] group-hover:border-[#229ED9] group-hover:bg-[#229ED9]/10 transition-all duration-300 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.672c.46 0 .664-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.411z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-wider text-technical-muted group-hover:text-[#229ED9] transition-colors">
                      // TG.DIRECT.PM
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#229ED9] animate-pulse" />
                      <span className="text-[9px] font-mono uppercase text-[#229ED9] tracking-widest font-semibold">
                        {language === 'ru' ? 'ЛИЧНЫЙ ЛС АРТИСТА' : 'PERSONAL PM // DIRECT'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-none bg-void-950 border border-void-700 flex items-center justify-center text-technical-muted group-hover:text-white group-hover:border-[#229ED9] group-hover:bg-[#229ED9]/20 transition-all">
                  <ArrowUpRight
                    size={15}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#229ED9] transition-all duration-200"
                  />
                </div>
              </div>

              {/* Middle: Content */}
              <div className="relative z-10 my-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold font-sans text-white group-hover:text-[#229ED9] transition-colors">
                    Telegram ЛС
                  </span>
                  <span className="text-xs font-mono text-signal-red font-bold px-2 py-0.5 bg-void-900 border border-void-800 rounded-none group-hover:border-signal-red/60">
                    @dYnexM
                  </span>
                </div>
                <p className="text-[11px] font-mono text-technical-muted mt-1">
                  {language === 'ru'
                    ? 'Личные сообщения dYnex?: вопросы, фиты, сотрудничество и прямой контакт.'
                    : 'Personal direct contact of dYnex?: collabs, questions, and direct messages.'}
                </p>
              </div>

              {/* Bottom: CTA */}
              <div className="relative z-10 border-t border-void-800/80 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-technical-muted">
                  CONTACT: @dYnexM // PM
                </span>
                <span className="text-[11px] font-mono tracking-widest text-[#229ED9] uppercase font-bold group-hover:underline flex items-center space-x-1">
                  <span>{language === 'ru' ? 'НАПИСАТЬ В ЛС TELEGRAM' : 'SEND DIRECT MESSAGE'}</span>
                  <span>→</span>
                </span>
              </div>
            </motion.a>
          </div>
        </div>

        {/* Bottom Status Banner */}
        <div className="mt-8 p-4 bg-void-900/90 border border-void-800 rounded-none flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-technical-muted">
          <div className="flex items-center space-x-2">
            <Disc3 size={13} className="text-signal-red animate-spin-slow" />
            <span className="text-technical-silver">
              {language === 'ru'
                ? 'КАТАЛОГ dYnex? СИНХРОНИЗИРОВАН СО ВСЕМИ ЦИФРОВЫМИ СЕРВИСАМИ'
                : 'dYnex? MASTER CATALOG SYNCED WITH ALL MAJOR STREAMING NETWORKS'}
            </span>
          </div>
          <div className="text-[11px] text-signal-red font-bold">
            VERIFIED_ID: 1697850899 // 2023—2026
          </div>
        </div>
      </div>
    </section>
  );
});
