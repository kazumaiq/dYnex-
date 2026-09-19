import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Radio, User, Fingerprint, Sparkles, MessageSquare, Edit3, Send, Music2 } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { useCommunity } from '../../context/CommunityContext';

export const Navbar: React.FC = () => {
  const { language, setLanguage } = useArchive();
  const {
    currentUser,
    isMember,
    openAuthModal,
    openUserProfile,
    openTraceWall,
    openSignatureWall,
    openTransmission,
    openCollab,
    triggerMobileSecretTap,
  } = useCommunity();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { labelRu: 'ГЛАВНАЯ', labelEn: 'HOME', href: '#hero' },
    { labelRu: 'РЕЛИЗЫ', labelEn: 'RELEASES', href: '#archive' },
    { labelRu: 'СООБЩЕСТВО', labelEn: 'COMMUNITY', href: '#community' },
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
        {/* Logo (with secret tap detector) */}
        <div
          onClick={triggerMobileSecretTap}
          className="pointer-events-auto flex items-center space-x-2 group cursor-pointer"
        >
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center space-x-2"
          >
            <span className="font-sans font-bold text-2xl tracking-tighter text-technical-light group-hover:text-white transition-colors">
              dYnex<span className="text-signal-red">?</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-technical-muted uppercase border border-void-700 px-1.5 py-0.5 rounded-none">
              3D ARCHIVE
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 pointer-events-auto bg-void-950/95 px-6 py-2 border border-void-700 rounded-none hover:border-signal-red transition-colors">
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

        {/* Right side: Member Identity, Language & Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-3 pointer-events-auto">
          {/* Member Identity / Auth Button */}
          {isMember && currentUser ? (
            <button
              onClick={() => openUserProfile()}
              className="px-2.5 sm:px-3 py-1.5 bg-void-950/90 hover:bg-void-900 border border-void-700 hover:border-signal-red text-technical-light text-[11px] font-mono flex items-center space-x-2 transition-all"
              title="Ваш цифровой идентификатор"
            >
              <Fingerprint size={12} className="text-signal-red" />
              <span className="font-bold">@{currentUser.username}</span>
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="px-2.5 sm:px-3 py-1.5 bg-void-950/90 hover:bg-signal-red border border-void-700 hover:border-signal-red text-white text-[10px] sm:text-[11px] font-mono tracking-wider transition-all"
            >
              {language === 'ru' ? 'ВХОД' : 'MEMBER'}
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
            className="text-[11px] font-mono tracking-widest text-technical-silver hover:text-signal-red transition-colors px-2 py-1 bg-void-950/90 border border-void-700 rounded-none"
            aria-label="Сменить язык"
          >
            {language === 'ru' ? 'RU / EN' : 'EN / RU'}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-technical-light hover:text-signal-red transition-colors bg-void-950/90 border border-void-700 rounded-none"
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-void-950/98 flex flex-col justify-between p-6 sm:p-8 lg:hidden select-none font-sans overflow-y-auto"
          >
            {/* Top Close Row */}
            <div className="flex justify-between items-center border-b border-void-800 pb-4">
              <div className="flex items-center space-x-2 text-xs font-mono text-signal-red font-bold">
                <Radio size={13} className="animate-pulse" />
                <span>// SYSTEM NAVIGATION MATRIX</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 border border-void-700 text-technical-muted hover:text-white"
                aria-label="Закрыть меню"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="flex flex-col space-y-3.5 my-6">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * idx }}
                  className="text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-signal-red transition-colors font-mono flex items-center space-x-3 group"
                >
                  <span className="text-xs font-normal text-signal-red font-mono">0{idx + 1}</span>
                  <span>{language === 'ru' ? item.labelRu : item.labelEn}</span>
                </motion.a>
              ))}
            </div>

            {/* Quick Community Nodes on Mobile */}
            <div className="p-4 bg-void-900 border border-void-800 space-y-2.5 font-mono text-xs mb-4">
              <div className="text-[10px] text-technical-muted tracking-widest uppercase">
                {language === 'ru' ? '// БЫСТРЫЙ ДОСТУП СООБЩЕСТВА:' : '// COMMUNITY NODES:'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openTraceWall();
                  }}
                  className="p-2 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-[11px] text-left flex items-center space-x-1.5"
                >
                  <MessageSquare size={11} className="text-signal-red" />
                  <span>{language === 'ru' ? 'СТЕНА СЛЕДОВ' : 'TRACE WALL'}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openSignatureWall();
                  }}
                  className="p-2 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-[11px] text-left flex items-center space-x-1.5"
                >
                  <Edit3 size={11} className="text-signal-red" />
                  <span>{language === 'ru' ? 'ПОДПИСИ' : 'SIGNATURES'}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openTransmission();
                  }}
                  className="p-2 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-[11px] text-left flex items-center space-x-1.5"
                >
                  <Send size={11} className="text-signal-red" />
                  <span>{language === 'ru' ? 'НАПИСАТЬ' : 'TRANSMIT'}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCollab();
                  }}
                  className="p-2 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-[11px] text-left flex items-center space-x-1.5"
                >
                  <Music2 size={11} className="text-signal-red" />
                  <span>{language === 'ru' ? 'ФИТ / ДЕМО' : 'COLLAB'}</span>
                </button>
              </div>
            </div>

            {/* Member Card or Login */}
            <div className="pt-4 border-t border-void-800 flex justify-between items-center text-xs font-mono">
              {isMember && currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openUserProfile();
                  }}
                  className="flex items-center space-x-2 text-white hover:text-signal-red"
                >
                  <Fingerprint size={14} className="text-signal-red" />
                  <span className="font-bold">@{currentUser.username} (IDENTITY)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  className="flex items-center space-x-2 text-signal-red font-bold"
                >
                  <User size={14} />
                  <span>{language === 'ru' ? 'ВХОД / РЕГИСТРАЦИЯ' : 'MEMBER ACCESS'}</span>
                </button>
              )}

              <span className="text-[10px] text-technical-muted">NODE 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
