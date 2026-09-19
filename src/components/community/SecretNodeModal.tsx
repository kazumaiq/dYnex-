import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Radio, Lock, Unlock, Eye, Disc3 } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

export const SecretNodeModal: React.FC = () => {
  const { language } = useArchive();
  const { isSecretNodeOpen, closeSecretNode, unreleased } = useCommunity();
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [unlockedTrackId, setUnlockedTrackId] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isSecretNodeOpen) return null;

  const handleUnlockCode = (e: React.FormEvent, trackId: string, expectedCode?: string) => {
    e.preventDefault();
    if (!expectedCode) {
      setUnlockedTrackId(trackId);
      return;
    }
    if (accessCodeInput.trim().toUpperCase() === expectedCode.toUpperCase()) {
      setUnlockedTrackId(trackId);
      setErrorNotice(null);
    } else {
      setErrorNotice(language === 'ru' ? 'НЕВЕРНЫЙ КОД ДОСТУПА' : 'INVALID ACCESS CODE');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-void-950/92 backdrop-blur-xl"
          onClick={closeSecretNode}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl bg-void-950/98 border border-signal-red shadow-[0_0_80px_rgba(230,25,36,0.35)] rounded-none overflow-hidden text-technical-light tactical-border"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-void-900 border-b border-void-800">
            <div className="flex items-center space-x-2 text-xs font-mono text-signal-red tracking-widest uppercase font-bold">
              <Sparkles size={14} className="animate-spin-slow" />
              <span>// HIDDEN ARCHIVE NODE // CLASSIFIED SECTOR</span>
            </div>
            <button
              onClick={closeSecretNode}
              className="p-1.5 text-technical-muted hover:text-white transition-colors bg-void-950 border border-void-800"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Decrypted Transmission Card */}
            <div className="p-5 bg-gradient-to-br from-void-900 via-void-950 to-void-900 border border-void-800 relative">
              <div className="flex items-center space-x-2 text-[10px] font-mono text-signal-red mb-2">
                <Radio size={12} className="animate-pulse" />
                <span className="font-bold">TRANSMISSION DECRYPTED // FREQ: 142.85 MHz</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-white uppercase tracking-tight">
                {language === 'ru' ? 'СЕКРЕТНЫЙ СЕКТОР АРХИВА НАЙДЕН' : 'SECRET SECTOR DISCOVERED'}
              </h2>
              <p className="text-xs font-mono text-technical-silver leading-relaxed mt-2">
                {language === 'ru'
                  ? 'Вы разблокировали закрытый уровень dYnex?. Здесь хранятся концептуальные арты, невышедшие наброски и архивные звуковые паттерны.'
                  : 'You have accessed the classified tier of dYnex?. Unreleased concept drafts, raw stems and encrypted archives reside here.'}
              </p>
              <div className="barcode-pattern w-full h-2 mt-4 opacity-70" />
            </div>

            {/* Unreleased Items list */}
            <div className="space-y-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-technical-muted flex items-center justify-between">
                <span>{language === 'ru' ? 'НЕВЫШЕДШИЕ МАТЕРИАЛЫ АРТИСТА:' : 'UNRELEASED ARCHIVE FILES:'}</span>
                <span className="text-signal-red font-bold">// 02 DETECTED</span>
              </div>

              {unreleased.map((track) => {
                const isUnlocked = unlockedTrackId === track.id || track.status === 'UNLOCKED';

                return (
                  <div
                    key={track.id}
                    className="p-4 bg-void-900/90 border border-void-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-14 h-14 rounded-none overflow-hidden border border-void-700 shrink-0 relative">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover filter contrast-125"
                        />
                        <div className="absolute inset-0 bg-signal-red/10 mix-blend-screen" />
                      </div>

                      <div className="font-mono">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{track.title}</span>
                          <span className="px-1.5 py-0.2 bg-void-950 border border-void-700 text-[9px] text-signal-red font-bold">
                            {track.year}
                          </span>
                        </div>
                        <div className="text-[11px] text-technical-silver mt-0.5">{track.artists}</div>
                        <div className="text-[9px] text-technical-muted mt-1">{track.description}</div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto shrink-0">
                      {isUnlocked ? (
                        <div className="px-3 py-1.5 bg-signal-red/20 border border-signal-red text-signal-red text-xs font-mono font-bold flex items-center space-x-1.5">
                          <Unlock size={12} />
                          <span>{language === 'ru' ? 'РАЗБЛОКИРОВАНО' : 'UNLOCKED'}</span>
                        </div>
                      ) : (
                        <form
                          onSubmit={(e) => handleUnlockCode(e, track.id, track.accessCode)}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            placeholder="ACCESS CODE"
                            value={accessCodeInput}
                            onChange={(e) => setAccessCodeInput(e.target.value)}
                            className="px-2.5 py-1.5 bg-void-950 border border-void-700 text-xs font-mono text-white placeholder:text-technical-muted/50 w-28 uppercase focus:outline-none focus:border-signal-red"
                          />
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white text-xs font-mono font-bold uppercase transition-all"
                          >
                            <Lock size={12} />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })}

              {errorNotice && (
                <div className="text-xs font-mono text-signal-red text-right">
                  // {errorNotice} (HINT: DYNEX2026)
                </div>
              )}
            </div>

            {/* Lore message */}
            <div className="pt-2 border-t border-void-800 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-technical-muted gap-2">
              <span>EASTER EGG KEY: 'dynex' (DESKTOP) // TRIPLE-TAP LOGO (MOBILE)</span>
              <span className="text-signal-red font-bold">ALL DATA PROPERTY OF dYnex?</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
