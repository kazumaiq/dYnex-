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

export const MusicPlatformsSection: React.FC = () => {
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
      url: 'https://open.spotify.com/search/dYnex%3F',
      protocolTag: '// SPOTIFY.STREAM.NODE',
      tagRu: 'Стриминг, дискография и плейлисты',
      tagEn: 'Global streaming, discography & playlists',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.524 4.477 10 10 10s10-4.476 10-10c0-5.523-4.477-10-10-10zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.335.077-.67-.133-.746-.469-.077-.334.132-.67.467-.747 3.808-.87 7.076-.506 9.722 1.115.293.18.386.563.207.857zm1.224-2.719c-.226.367-.706.482-1.072.257-2.69-1.653-6.79-2.131-9.97-1.165-.413.125-.85-.11-1.004-.523-.125-.413.11-.85.523-.975 3.633-1.102 8.147-.568 11.266 1.349.366.226.482.705.257 1.082zm.106-2.835C14.692 8.95 9.218 8.767 6.046 9.73c-.495.15-1.022-.128-1.173-.623-.15-.495.129-1.022.624-1.173 3.673-1.114 9.715-.903 13.486 1.335.445.264.59.838.327 1.282-.264.444-.838.59-1.282.327z" />
        </svg>
      )
    },
    {
      id: 'vk',
      name: 'VK Музыка',
      url: 'https://vk.com/audio?q=dYnex',
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
      id: 'youtube',
      name: 'YouTube Music',
      url: 'https://www.youtube.com/results?search_query=dYnex%3F+phonk',
      protocolTag: '// YT.VISUAL.NETWORK',
      tagRu: 'Официальные треки, визуалы и клипы',
      tagEn: 'Official audio uploads, visuals & videos',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    },
    {
      id: 'soundcloud',
      name: 'SoundCloud',
      url: 'https://soundcloud.com/search?q=dYnex',
      protocolTag: '// SC.UNDERGROUND.CORE',
      tagRu: 'Эксклюзивные ремиксы, Slowed & VIP версии',
      tagEn: 'Exclusive remixes, bootlegs & slowed versions',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M1.175 12.225c-.053 0-.095.043-.1.096l-.234 2.378c-.006.056.036.104.092.107l.242.013c.053 0 .096-.043.1-.096l.234-2.378a.105.105 0 0 0-.092-.107l-.242-.013zm1.094-.652c-.066 0-.12.05-.125.116l-.348 3.673c-.006.069.046.128.115.132l.332.016c.066 0 .12-.05.126-.116l.347-3.673c.007-.069-.045-.128-.115-.132l-.332-.016zm1.189-.253c-.08 0-.146.063-.15.143l-.403 4.167c-.007.084.057.155.14.16l.417.017c.08 0 .146-.063.151-.143l.403-4.168a.152.152 0 0 0-.141-.16l-.417-.016zm1.258-.293c-.093 0-.17.073-.177.166l-.427 4.75a.178.178 0 0 0 .165.187l.477.019c.094 0 .17-.074.177-.167l.428-4.75a.179.179 0 0 0-.166-.187l-.477-.018zm1.298-.094c-.107 0-.195.084-.202.191l-.424 5.03c-.008.11.074.202.184.21l.525.021c.107 0 .195-.084.202-.191l.425-5.03a.204.204 0 0 0-.184-.21l-.526-.021zm1.317-.187c-.12 0-.219.095-.227.215l-.397 5.405c-.009.124.083.228.207.237l.564.022c.121 0 .22-.095.228-.216l.397-5.404a.23.23 0 0 0-.208-.237l-.564-.022zm1.32-.423c-.134 0-.244.106-.253.24l-.348 6.06c-.01.139.093.255.231.265l.593.023c.134 0 .245-.106.253-.24l.348-6.06a.256.256 0 0 0-.231-.265l-.593-.023zm1.316-.473c-.148 0-.269.117-.278.265l-.278 7.008c-.01.153.102.281.255.292l.613.024c.148 0 .269-.117.278-.265l.278-7.008a.282.282 0 0 0-.255-.292l-.613-.024zm1.323-.197c-.161 0-.293.128-.304.289l-.192 7.398c-.01.168.112.308.279.32l.624.024c.161 0 .294-.128.304-.289l.192-7.398a.309.309 0 0 0-.279-.32l-.624-.024zm1.328.05c-.175 0-.318.139-.329.314l-.089 7.334c-.01.182.122.334.303.346l.626.024c.175 0 .319-.139.33-.314l.088-7.334a.335.335 0 0 0-.303-.346l-.626-.024zm1.332-.128c-.188 0-.343.15-.355.338l.006 7.462c0 .196.132.36.327.373l.62.025c.189 0 .343-.15.355-.339l-.006-7.461a.36.36 0 0 0-.327-.373l-.62-.025zm1.339-.028c-.202 0-.368.16-.381.363l.089 7.49c.01.21.141.386.351.4l.608.024c.202 0 .368-.161.381-.363l-.089-7.49a.387.387 0 0 0-.351-.401l-.608-.023zm3.763-2.123c-.48 0-.94.11-1.35.31-.22.11-.42.24-.61.4-.23-.74-.8-1.33-1.53-1.63-.39-.16-.81-.24-1.25-.24-.04 0-.08 0-.12.01-.19.01-.35.16-.36.35l.08 10.97c.01.2.17.36.37.37l4.77.19c2.31 0 4.19-1.88 4.19-4.19 0-2.31-1.88-4.18-4.19-4.18z" />
        </svg>
      )
    },
    {
      id: 'yandex',
      name: 'Яндекс Музыка',
      url: 'https://music.yandex.ru/search?text=dYnex',
      protocolTag: '// YANDEX.WAVE.NODE',
      tagRu: '«Моя волна», персональные чарты и треки',
      tagEn: 'My Wave, Russian charts & verified audio',
      svgIcon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.8 14.7c-.4.4-1 .4-1.4 0L12 14.3l-2.4 2.4c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4l2.4-2.4-2.4-2.4c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l2.4 2.4 2.4-2.4c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4L13.4 12.9l2.4 2.4c.4.4.4 1 0 1.4z" />
        </svg>
      )
    }
  ];

  return (
    <section
      id="platforms"
      className="relative min-h-screen w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 flex flex-col justify-center pointer-events-none select-none overflow-hidden max-w-7xl mx-auto"
    >
      {/* Background Cyberpunk Accents */}
      <div className="hidden sm:block absolute -left-16 top-1/4 w-80 h-auto pointer-events-none opacity-20 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-lily-botanical.jpg"
          alt="Lily Accent"
          className="w-full h-auto object-contain"
        />
      </div>
      <div className="hidden lg:block absolute -right-16 bottom-1/4 w-80 h-auto pointer-events-none opacity-20 mix-blend-screen z-0">
        <img
          src="/assets/collage/hero-roses-bottom.jpg"
          alt="Roses Accent"
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="w-full pointer-events-auto relative z-10">
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
              {language === 'ru' ? '6 СЕТЕВЫХ КАНАЛОВ ОНЛАЙН' : '6 STREAMING HUBS ONLINE'}
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
                className="group relative p-6 bg-void-950/95 backdrop-blur-xl border border-void-700 rounded-none transition-all duration-300 flex flex-col justify-between h-56 overflow-hidden hover:border-signal-red shadow-subtle-card cursor-pointer"
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

        {/* Bottom Status Banner */}
        <div className="mt-8 p-4 bg-void-900/60 backdrop-blur-md border border-void-800 rounded-none flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-technical-muted">
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
};
