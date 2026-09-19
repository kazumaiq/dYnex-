import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, ExternalLink, Disc3, ShieldCheck } from 'lucide-react';
import { useArchive } from '../../context/ArchiveContext';
import { useCommunity } from '../../context/CommunityContext';

export const ReleaseDetailModal: React.FC = () => {
  const { selectedRelease, setSelectedRelease, language } = useArchive();
  const { signals, submitSignal, isMember, openAuthModal, currentUser } = useCommunity();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Audience signals for current release
  const releaseSignals = useMemo(() => {
    if (!selectedRelease) return [];
    return signals.filter(
      (s) => s.releaseId === selectedRelease.id && (s.status === 'APPROVED' || (currentUser && s.userId === currentUser.id))
    );
  }, [signals, selectedRelease, currentUser]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRelease || !commentText.trim()) return;
    setIsSubmittingComment(true);
    const res = await submitSignal(selectedRelease.id, commentText);
    setIsSubmittingComment(false);
    if (res.success) {
      setCommentText('');
    }
  };

  // Stop audio on close or switch
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedRelease]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.warn('Audio playback restricted', err));
    }
  };

  if (!selectedRelease) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-void-950/90"
          onClick={() => setSelectedRelease(null)}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.92, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl bg-void-950 border border-void-700 shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-none overflow-hidden flex flex-col md:flex-row text-technical-light max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedRelease(null)}
            className="absolute top-4 right-4 z-20 p-2 text-technical-muted hover:text-white bg-void-950 border border-void-800 hover:border-signal-red rounded-none transition-colors"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>

          {/* Left: Artwork Cover */}
          <div className="w-full md:w-1/2 relative bg-void-950 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-void-800">
            <div className="relative group aspect-square w-full max-w-[280px] shadow-2xl overflow-hidden rounded-sm border border-void-700">
              <img
                src={selectedRelease.artworkUrl}
                alt={selectedRelease.title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />

              {/* Verified Badge */}
              <div className="absolute top-2 left-2 bg-void-950 border border-void-800 text-[10px] font-mono text-signal-red px-2 py-0.5 rounded-sm flex items-center space-x-1">
                <ShieldCheck size={11} />
                <span>{language === 'ru' ? 'ВЕРИФИЦИРОВАНО' : 'VERIFIED'}</span>
              </div>
            </div>
          </div>

          {/* Right: Metadata & Streaming Links */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Type & Year */}
              <div className="flex items-center space-x-2 text-[11px] font-mono text-signal-red uppercase tracking-widest mb-1">
                <Disc3 size={13} className="animate-spin-slow" />
                <span>{selectedRelease.type} // {selectedRelease.year}</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold font-sans tracking-tight text-white mb-1">
                {selectedRelease.title}
              </h2>

              {/* Artists */}
              <p className="text-sm font-mono text-technical-silver mb-4">
                {selectedRelease.artists}
              </p>

              {/* Technical Metadata Table */}
              <div className="space-y-1.5 text-xs font-mono text-technical-muted border-t border-b border-void-800 py-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-technical-muted">CATALOGUE ID:</span>
                  <span className="text-signal-red font-bold">DNX-{selectedRelease.id.padStart ? selectedRelease.id.padStart(3, '0') : selectedRelease.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-technical-muted">{language === 'ru' ? 'ДАТА РЕЛИЗА:' : 'RELEASE DATE:'}</span>
                  <span className="text-technical-light">{selectedRelease.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-technical-muted">{language === 'ru' ? 'ЖАНР:' : 'GENRE:'}</span>
                  <span className="text-technical-light">{selectedRelease.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-technical-muted">{language === 'ru' ? 'ТРЕКОВ:' : 'TRACKS:'}</span>
                  <span className="text-technical-light">{selectedRelease.trackCount}</span>
                </div>
                {selectedRelease.label && (
                  <div className="flex justify-between">
                    <span className="text-technical-muted">LABEL:</span>
                    <span className="text-signal-red font-bold">{selectedRelease.label}</span>
                  </div>
                )}
                {selectedRelease.isrc && (
                  <div className="flex justify-between">
                    <span className="text-technical-muted">ISRC:</span>
                    <span className="text-technical-silver font-mono">{selectedRelease.isrc}</span>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-void-900">
                  <span className="text-technical-muted">STATUS:</span>
                  <span className="text-signal-red font-bold">VERIFIED MASTER</span>
                </div>
              </div>

              {/* Barcode Accent */}
              <div className="barcode-pattern w-full h-2 mb-4 opacity-50" />

              {/* Description */}
              {selectedRelease.description && (
                <p className="text-xs text-technical-silver leading-relaxed mb-4">
                  {selectedRelease.description}
                </p>
              )}
            </div>

            {/* Platform Buttons */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-2 flex items-center justify-between">
                <span>{language === 'ru' ? 'СЛУШАТЬ НА ПЛОЩАДКАХ:' : 'STREAMING PLATFORMS:'}</span>
                <span className="text-signal-red text-[9px]">// DIRECT DSP LINKS</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={selectedRelease.platforms.appleMusic || "https://music.apple.com/us/artist/dynex/1697850899"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                >
                  <span>Apple Music</span>
                  <ExternalLink size={12} className="text-signal-red" />
                </a>

                <a
                  href={selectedRelease.platforms.spotify || "https://open.spotify.com/artist/1AnrK4s39q55gZbNkcnuDg"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                >
                  <span>Spotify</span>
                  <ExternalLink size={12} className="text-signal-red" />
                </a>

                <a
                  href={selectedRelease.platforms.vk || "https://vk.ru/artist/654356884443821665"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                >
                  <span>VK Музыка</span>
                  <ExternalLink size={12} className="text-signal-red" />
                </a>

                <a
                  href={selectedRelease.platforms.yandexMusic || "https://music.yandex.ru/artist/19034250"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                >
                  <span>Яндекс Музыка</span>
                  <ExternalLink size={12} className="text-signal-red" />
                </a>

                <a
                  href={selectedRelease.platforms.youtube || "http://www.youtube.com/channel/UCvfg0sozSo6rPRkQVsjqm7g"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                >
                  <span>YouTube</span>
                  <ExternalLink size={12} className="text-signal-red" />
                </a>

                <a
                  href={selectedRelease.platforms.youtubeMusic || "https://music.youtube.com/channel/UCvfg0sozSo6rPRkQVsjqm7g"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2 bg-void-900/90 hover:bg-void-850 border border-void-800 hover:border-signal-red hover:shadow-signal-red-glow text-xs font-mono text-technical-light hover:text-white transition-all rounded-none"
                >
                  <span>YouTube Music</span>
                  <ExternalLink size={12} className="text-signal-red" />
                </a>
              </div>
            </div>

            {/* Audience Signals (Release Comments Layer) */}
            <div className="pt-4 border-t border-void-800">
              <div className="text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-2 flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-white font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal-red animate-pulse" />
                  <span>{language === 'ru' ? 'СИГНАЛЫ АУДИТОРИИ // REVIEWS' : 'AUDIENCE SIGNALS'}</span>
                </span>
                <span className="text-signal-red text-[9px] font-mono">
                  [{releaseSignals.length}] {language === 'ru' ? 'ОТЗЫВОВ' : 'SIGNALS'}
                </span>
              </div>

              {/* Signals List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1 mb-3">
                {releaseSignals.length === 0 ? (
                  <div className="p-3 bg-void-900/60 border border-void-850 text-center text-[10px] font-mono text-technical-muted">
                    {language === 'ru'
                      ? 'В архиве пока нет сигналов к этому релизу. Будьте первым.'
                      : 'No audience signals for this release yet. Be the first.'}
                  </div>
                ) : (
                  releaseSignals.map((sig) => (
                    <div
                      key={sig.id}
                      className={`p-2.5 bg-void-900 border text-xs font-mono transition-all ${
                        sig.status === 'PENDING'
                          ? 'border-dashed border-signal-red/60 bg-signal-red/5'
                          : 'border-void-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[9px] text-technical-muted mb-1">
                        <span className="font-bold text-white">@{sig.username}</span>
                        {sig.status === 'PENDING' ? (
                          <span className="text-signal-red uppercase font-bold">
                            {language === 'ru' ? '// НА МОДЕРАЦИИ' : '// PENDING MOD'}
                          </span>
                        ) : (
                          <span className="text-technical-silver">
                            {new Date(sig.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                          </span>
                        )}
                      </div>
                      <p className="text-technical-silver text-[11px] leading-relaxed">
                        "{sig.content}"
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Leave Signal Form */}
              {isMember ? (
                <form onSubmit={handleCommentSubmit} className="space-y-2">
                  <div className="relative">
                    <textarea
                      rows={2}
                      maxLength={280}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={language === 'ru' ? 'Оставить сигнал о релизе...' : 'Leave an opinion on this release...'}
                      className="w-full p-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red resize-none"
                    />
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono text-technical-muted">
                    <span>{commentText.length} / 280</span>
                    <button
                      type="submit"
                      disabled={isSubmittingComment || !commentText.trim()}
                      className="px-3 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white font-bold uppercase tracking-widest transition-all shadow-signal-red-sharp disabled:opacity-40"
                    >
                      {isSubmittingComment
                        ? (language === 'ru' ? 'ПЕРЕДАЧА...' : 'SENDING...')
                        : (language === 'ru' ? 'ОТПРАВИТЬ СИГНАЛ' : 'TRANSMIT SIGNAL')}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-3 bg-void-900 border border-void-800 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="text-[10px] font-mono text-technical-muted text-center sm:text-left">
                    {language === 'ru'
                      ? 'Чтобы оставить отзыв, создайте цифровой идентификатор участника.'
                      : 'Create a member identity to leave your audience signal.'}
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('register')}
                    className="px-3 py-1.5 bg-void-950 hover:bg-signal-red border border-void-700 hover:border-signal-red text-white text-[10px] font-mono font-bold tracking-widest uppercase transition-all shrink-0"
                  >
                    {language === 'ru' ? 'MEMBER ACCESS' : 'JOIN MEMBER'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
