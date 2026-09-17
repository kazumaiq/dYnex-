import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Radio, Headphones, Play } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

interface PlatformItem {
  name: string;
  url: string;
  tagRu: string;
  tagEn: string;
  iconText: string;
}

export const MusicPlatformsSection: React.FC = () => {
  const { language } = useArchive();

  const platforms: PlatformItem[] = [
    {
      name: 'Apple Music',
      url: 'https://music.apple.com/us/artist/dynex/1697850899',
      tagRu: 'Официальный профиль артиста',
      tagEn: 'Official verified artist profile',
      iconText: 'AP'
    },
    {
      name: 'Spotify',
      url: 'https://open.spotify.com/search/dYnex%3F',
      tagRu: 'Стриминг и плейлисты',
      tagEn: 'Streaming and curated playlists',
      iconText: 'SP'
    },
    {
      name: 'VK Музыка',
      url: 'https://vk.com/audio?q=dYnex',
      tagRu: 'Карточка музыканта ВКонтакте',
      tagEn: 'VK Music verified artist terminal',
      iconText: 'VK'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/results?search_query=dYnex%3F+phonk',
      tagRu: 'Официальные треки и визуалы',
      tagEn: 'Official audio uploads and visuals',
      iconText: 'YT'
    },
    {
      name: 'SoundCloud',
      url: 'https://soundcloud.com/search?q=dYnex',
      tagRu: 'Ремиксы и эксклюзивные версии',
      tagEn: 'Remixes and slowed bootlegs',
      iconText: 'SC'
    }
  ];

  return (
    <section
      id="platforms"
      className="relative min-h-screen w-full px-6 sm:px-12 py-32 flex flex-col justify-center pointer-events-none select-none"
    >
      <div className="max-w-5xl mx-auto w-full pointer-events-auto">
        {/* Header */}
        <div className="flex items-center space-x-2 text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-2">
          <span>// 06</span>
          <span>{language === 'ru' ? 'ЦИФРОВЫЕ СИГНАЛЫ' : 'DIGITAL SIGNAL DISTRIBUTION'}</span>
        </div>

        <h2 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter text-white uppercase mb-4">
          {language === 'ru' ? (
            <>
              СЛУШАТЬ<br />
              <span className="text-signal-red">ВЕЗДЕ.</span>
            </>
          ) : (
            <>
              LISTEN<br />
              <span className="text-signal-red">ANYWHERE.</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm font-mono text-technical-muted max-w-xl mb-12">
          {language === 'ru'
            ? 'Прямой доступ к официальным каталогам dYnex? на ведущих музыкальных платформах мира.'
            : 'Direct links to official dYnex? discography across verified global music streaming hubs.'}
        </p>

        {/* Platform Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 bg-void-900/60 hover:bg-void-850 backdrop-blur-md border border-void-800 hover:border-signal-red/60 rounded-sm transition-all duration-200 flex flex-col justify-between h-40"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-sm bg-void-950 border border-void-800 text-xs font-mono font-bold text-signal-red flex items-center justify-center">
                  {p.iconText}
                </div>
                <ExternalLink size={16} className="text-technical-muted group-hover:text-signal-red transition-colors" />
              </div>

              <div>
                <div className="text-lg font-bold font-sans text-white group-hover:text-signal-red transition-colors">
                  {p.name}
                </div>
                <div className="text-[11px] font-mono text-technical-muted mt-1">
                  {language === 'ru' ? p.tagRu : p.tagEn}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
