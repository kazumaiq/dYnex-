import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Radio } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';

export const Navbar: React.FC = () => {
  const { language, setLanguage } = useArchive();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { labelRu: 'ГЛАВНАЯ', labelEn: 'HOME', href: '#hero' },
    { labelRu: 'РЕЛИЗЫ', labelEn: 'RELEASES', href: '#archive' },
    { labelRu: 'О ПРОЕКТЕ', labelEn: 'ABOUT', href: '#about' },
    { labelRu: 'ТАЙМЛАЙН', labelEn: 'TIMELINE', href: '#timeline' },
    { labelRu: 'СЕТЬ', labelEn: 'NETWORK', href: '#network' },
    { labelRu: 'ПЛАТФОРМЫ', labelEn: 'MUSIC', href: '#platforms' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none select-none">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="pointer-events-auto flex items-center space-x-2 group"
        >
          <span className="font-sans font-bold text-2xl tracking-tighter text-technical-light group-hover:text-white transition-colors">
            dYnex<span className="text-signal-red">?</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-technical-muted uppercase border border-void-700 px-1.5 py-0.5 rounded-none">
            3D ARCHIVE
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-7 pointer-events-auto bg-void-950/85 backdrop-blur-md px-6 py-2 border border-void-700 rounded-none hover:border-signal-red transition-colors">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="text-xs font-mono tracking-widest text-technical-muted hover:text-signal-red transition-colors duration-200"
            >
              {language === 'ru' ? item.labelRu : item.labelEn}
            </a>
          ))}
        </nav>

        {/* Right side: Language & Status indicator */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          {/* Status badge */}
          <div className="hidden lg:flex items-center space-x-2 bg-void-950/80 backdrop-blur-sm border border-void-800 px-3 py-1 rounded-none text-[11px] font-mono text-technical-silver">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-red animate-pulse" />
            <span className="tracking-widest">
              {language === 'ru' ? 'АРХИВ // ОНЛАЙН' : 'ARCHIVE // ONLINE'}
            </span>
            <span className="text-signal-red text-[9px] font-bold">// 3D</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
            className="flex items-center space-x-1.5 bg-void-950/80 hover:bg-void-900 border border-void-800 hover:border-signal-red text-xs font-mono px-2.5 py-1 rounded-none text-technical-silver hover:text-white transition-colors"
            title="Сменить язык / Switch language"
          >
            <Globe size={12} className="text-signal-red" />
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-technical-light hover:text-signal-red transition-colors bg-void-950/90 border border-void-700 rounded-none"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Fullscreen Menu with clip reveal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 90% 10%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 90% 10%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 90% 10%)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-void-950/98 backdrop-blur-2xl flex flex-col justify-center px-8 md:hidden select-none font-sans"
          >
            <div className="flex flex-col space-y-6">
              <div className="text-xs font-mono tracking-widest text-technical-muted uppercase mb-4 border-b border-void-800 pb-2 flex items-center justify-between">
                <span className="text-signal-red font-bold">{language === 'ru' ? 'СИСТЕМНОЕ МЕНЮ' : 'SYSTEM NAVIGATION'}</span>
                <span className="text-signal-red flex items-center gap-1">
                  <Radio size={12} /> 2023—2026
                </span>
              </div>

              {navItems.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="text-2xl font-bold tracking-tight text-technical-light hover:text-signal-red transition-colors font-mono flex items-center space-x-4 group"
                >
                  <span className="text-xs font-normal text-signal-red">0{idx + 1}</span>
                  <span>{language === 'ru' ? item.labelRu : item.labelEn}</span>
                </motion.a>
              ))}

              <div className="pt-6 border-t border-void-800 flex justify-between items-center text-xs font-mono text-technical-muted">
                <span>STATUS: ARCHIVE ACTIVE</span>
                <span className="text-signal-red">LOC: 55°45'N 37°37'E</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
