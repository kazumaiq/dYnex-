import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Trash2, ShieldCheck, Clock, Send, MessageSquare } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

export const TraceWallModal: React.FC = () => {
  const { language } = useArchive();
  const {
    isTraceWallOpen,
    closeTraceWall,
    traces,
    userActiveTrace,
    submitTrace,
    deleteUserTrace,
    currentUser,
    isMember,
    openAuthModal,
    openLeaveTrace,
    isLeaveTraceOpen,
    closeLeaveTrace,
  } = useCommunity();

  const [traceInput, setTraceInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isTraceWallOpen) return null;

  // Filter approved traces for public display + current user's own trace if pending
  const approvedTraces = traces.filter(
    (t) => t.status === 'APPROVED' || (currentUser && t.userId === currentUser.id)
  );

  const handleCreateTrace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!traceInput.trim()) return;
    setErrorMsg(null);
    setIsSubmitting(true);
    const res = await submitTrace(traceInput);
    setIsSubmitting(false);
    if (res.success) {
      setTraceInput('');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-void-950/90 backdrop-blur-md"
          onClick={closeTraceWall}
        />

        {/* Modal Full Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl bg-void-950/98 border border-void-700 shadow-[0_30px_90px_rgba(0,0,0,0.98)] rounded-none overflow-hidden text-technical-light flex flex-col max-h-[92vh] tactical-border"
        >
          {/* Top HUD Header */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-void-900 border-b border-void-800 shrink-0">
            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-signal-red animate-ping" />
              <span className="font-bold text-signal-red tracking-widest uppercase flex items-center gap-1.5">
                <Sparkles size={12} />
                {language === 'ru' ? 'СЕКЦИЯ 07 // СТЕНА ЦИФРОВЫХ СЛЕДОВ' : 'SECTION 07 // THE TRACE WALL'}
              </span>
              <span className="text-void-700 hidden sm:inline">//</span>
              <span className="text-technical-muted hidden sm:inline">
                {language === 'ru' ? 'ЖИВОЙ АРХИВ ПОСЕТИТЕЛЕЙ' : 'AUDIENCE DIGITAL LOG'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (!isMember) {
                    openAuthModal('register');
                  } else {
                    openLeaveTrace();
                  }
                }}
                className="px-3.5 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center space-x-1.5 shadow-signal-red-sharp"
              >
                <Plus size={12} />
                <span>{language === 'ru' ? 'ОСТАВИТЬ СЛЕД' : 'LEAVE TRACE'}</span>
              </button>

              <button
                onClick={closeTraceWall}
                className="p-1.5 text-technical-muted hover:text-white transition-colors bg-void-950 border border-void-800"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Subheader info */}
          <div className="px-5 sm:px-8 py-2.5 bg-void-950 border-b border-void-800/80 flex flex-wrap items-center justify-between text-[10px] font-mono text-technical-muted shrink-0">
            <div className="flex items-center space-x-2">
              <span>ACTIVE TRACES: {approvedTraces.length}</span>
              <span className="text-void-700">•</span>
              <span>RULE: 1 ACTIVE TRACE PER NODE</span>
            </div>
            <div className="hidden sm:block text-technical-silver">
              GRID ARCHITECTURE // DETERMINISTIC COORDINATES
            </div>
          </div>

          {/* Main Wall Canvas */}
          <div className="flex-1 p-5 sm:p-8 overflow-y-auto min-h-[350px]">
            {approvedTraces.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-none border border-void-800 flex items-center justify-center text-technical-muted">
                  <MessageSquare size={20} />
                </div>
                <div className="text-white font-bold text-sm tracking-widest uppercase">
                  {language === 'ru' ? 'В АРХИВЕ ПОКА НЕТ СЛЕДОВ' : 'NO TRACES IN ARCHIVE YET'}
                </div>
                <p className="text-xs text-technical-muted max-w-sm">
                  {language === 'ru'
                    ? 'Станьте первым, кто оставит свой след в цифровом пространстве dYnex?.'
                    : 'Be the first to transmit your digital presence into the dYnex? archive.'}
                </p>
                <button
                  onClick={() => (isMember ? openLeaveTrace() : openAuthModal('register'))}
                  className="mt-2 px-4 py-2 border border-signal-red text-signal-red text-xs font-bold tracking-widest hover:bg-signal-red hover:text-white transition-all"
                >
                  {language === 'ru' ? 'ОСТАВИТЬ ПЕРВЫЙ СЛЕД →' : 'TRANSMIT FIRST TRACE →'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedTraces.map((trace, idx) => {
                  const isOwner = currentUser?.id === trace.userId;
                  const isPending = trace.status === 'PENDING';

                  return (
                    <motion.div
                      key={trace.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                      className={`group relative p-4 bg-void-900/90 border transition-all duration-200 flex flex-col justify-between ${
                        isPending
                          ? 'border-dashed border-signal-red/60 bg-signal-red/5'
                          : 'border-void-800 hover:border-signal-red hover:bg-void-850'
                      }`}
                    >
                      {/* Top HUD inside card */}
                      <div>
                        <div className="flex items-center justify-between text-[9px] font-mono text-technical-muted mb-2">
                          <span className="text-signal-red font-bold tracking-widest">{trace.id}</span>
                          <span className="text-technical-silver">
                            {new Date(trace.createdAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                          </span>
                        </div>

                        {/* Author */}
                        <div className="flex items-center space-x-1.5 mb-2">
                          <span className="font-mono font-bold text-xs text-white group-hover:text-signal-red transition-colors">
                            @{trace.username}
                          </span>
                          {isPending && (
                            <span className="px-1.5 py-0.2 bg-signal-red/20 border border-signal-red/40 text-signal-red text-[8px] font-mono uppercase">
                              {language === 'ru' ? 'МОДЕРАЦИЯ' : 'PENDING'}
                            </span>
                          )}
                        </div>

                        {/* Content text */}
                        <p className="text-xs font-mono text-technical-silver leading-relaxed break-words">
                          "{trace.content}"
                        </p>
                      </div>

                      {/* Bottom Footer inside card */}
                      <div className="mt-4 pt-2.5 border-t border-void-800/80 flex items-center justify-between text-[9px] font-mono text-technical-muted">
                        <div className="flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-signal-red opacity-80" />
                          <span>NODE LOGGED</span>
                        </div>

                        {isOwner && (
                          <button
                            onClick={deleteUserTrace}
                            className="text-technical-muted hover:text-signal-red transition-colors flex items-center space-x-1"
                            title="Удалить свой след"
                          >
                            <Trash2 size={11} />
                            <span>{language === 'ru' ? 'УДАЛИТЬ' : 'DELETE'}</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Bar: Quick Active Trace Status or Compose Trigger */}
          <div className="p-4 bg-void-900 border-t border-void-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            {userActiveTrace ? (
              <div className="flex items-center space-x-2 text-technical-silver">
                <Clock size={13} className="text-signal-red" />
                <span>
                  {language === 'ru' ? 'ВАШ АКТИВНЫЙ СЛЕД:' : 'YOUR ACTIVE TRACE:'}{' '}
                  <strong className="text-white font-bold">{userActiveTrace.id}</strong>{' '}
                  <span className="text-technical-muted">
                    ({userActiveTrace.status === 'APPROVED' ? (language === 'ru' ? 'В АРХИВЕ' : 'APPROVED') : (language === 'ru' ? 'НА МОДЕРАЦИИ' : 'PENDING')})
                  </span>
                </span>
              </div>
            ) : (
              <div className="text-technical-muted text-[11px]">
                {language === 'ru'
                  ? '// Оставьте след, который увидят другие слушатели архива.'
                  : '// Leave your digital imprint for other visitors of the archive.'}
              </div>
            )}

            <button
              onClick={() => (isMember ? openLeaveTrace() : openAuthModal('register'))}
              className="w-full sm:w-auto px-5 py-2 bg-void-950 hover:bg-signal-red border border-void-700 hover:border-signal-red text-white text-xs font-bold tracking-widest uppercase transition-all"
            >
              {userActiveTrace
                ? (language === 'ru' ? 'ИЗМЕНИТЬ СВОЙ СЛЕД' : 'UPDATE MY TRACE')
                : (language === 'ru' ? 'НАПИСАТЬ ЦИФРОВОЙ СЛЕД →' : 'WRITE TRACE →')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Leave Trace Composer Overlay / Bottom Sheet */}
      {isLeaveTraceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void-950/80 backdrop-blur-sm"
            onClick={closeLeaveTrace}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative z-10 w-full max-w-lg bg-void-950 border border-void-700 shadow-2xl p-6 tactical-border text-technical-light"
          >
            <div className="flex items-center justify-between pb-3 border-b border-void-800 mb-4 text-xs font-mono text-signal-red font-bold">
              <span>// LEAVE YOUR TRACE (MAX 140 CHARACTERS)</span>
              <button onClick={closeLeaveTrace} className="text-technical-muted hover:text-white">
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-3 p-2.5 bg-signal-red/10 border border-signal-red/50 text-signal-red text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTrace} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-technical-muted uppercase mb-1.5">
                  {language === 'ru' ? 'ВАШ ЦИФРОВОЙ СЛЕД:' : 'YOUR DIGITAL IMPRINT:'}
                </label>
                <textarea
                  rows={3}
                  maxLength={140}
                  required
                  value={traceInput}
                  onChange={(e) => setTraceInput(e.target.value)}
                  placeholder={language === 'ru' ? 'Например: "found this archive at 03:17"' : 'e.g. "ABSTRACT on repeat."'}
                  className="w-full p-3 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red resize-none"
                />
                <div className="flex justify-between items-center text-[10px] font-mono text-technical-muted mt-1">
                  <span>{language === 'ru' ? '// Проходит быструю модерацию' : '// Undergoes moderation'}</span>
                  <span>{traceInput.length} / 140</span>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeLeaveTrace}
                  className="flex-1 py-2.5 bg-void-900 border border-void-800 text-technical-silver font-mono text-xs hover:text-white transition-colors"
                >
                  {language === 'ru' ? 'ОТМЕНА' : 'CANCEL'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !traceInput.trim()}
                  className="flex-1 py-2.5 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-signal-red-sharp disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Send size={12} />
                  <span>{isSubmitting ? (language === 'ru' ? 'ОТПРАВКА...' : 'SENDING...') : (language === 'ru' ? 'ЗАФИКСИРОВАТЬ' : 'TRANSMIT TRACE')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
