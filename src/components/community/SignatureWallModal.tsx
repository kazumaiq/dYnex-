import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Trash2, Edit3, Check, Radio } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

// Pseudo-Random Number Generator from seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const SignatureWallModal: React.FC = () => {
  const { language } = useArchive();
  const {
    isSignatureWallOpen,
    closeSignatureWall,
    signatures,
    userActiveSignature,
    submitSignature,
    deleteUserSignature,
    currentUser,
    isMember,
    openAuthModal,
    openLeaveSignature,
    isLeaveSignatureOpen,
    closeLeaveSignature,
  } = useCommunity();

  const [phraseInput, setPhraseInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isSignatureWallOpen) return null;

  const approvedSignatures = signatures.filter(
    (s) => s.status === 'APPROVED' || (currentUser && s.userId === currentUser.id)
  );

  const handleCreateSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    const res = await submitSignature(phraseInput);
    setIsSubmitting(false);
    if (res.success) {
      setPhraseInput('');
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
          onClick={closeSignatureWall}
        />

        {/* Modal Window */}
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
                <Edit3 size={12} />
                {language === 'ru' ? 'СЕКЦИЯ 08 // СТЕНА ЦИФРОВЫХ ПОДПИСЕЙ' : 'SECTION 08 // SIGNATURE WALL'}
              </span>
              <span className="text-void-700 hidden sm:inline">//</span>
              <span className="text-technical-muted hidden sm:inline">
                {language === 'ru' ? 'ГЕНЕРАТИВНАЯ СЕТКА ПОДПИСЕЙ' : 'GENERATIVE SIGNATURE NODES'}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (!isMember) {
                    openAuthModal('register');
                  } else {
                    openLeaveSignature();
                  }
                }}
                className="px-3.5 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center space-x-1.5 shadow-signal-red-sharp"
              >
                <Plus size={12} />
                <span>{language === 'ru' ? 'ПОСТАВИТЬ ПОДПИСЬ' : 'SIGN WALL'}</span>
              </button>

              <button
                onClick={closeSignatureWall}
                className="p-1.5 text-technical-muted hover:text-white transition-colors bg-void-950 border border-void-800"
                aria-label="Закрыть"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Subheader */}
          <div className="px-5 sm:px-8 py-2.5 bg-void-950 border-b border-void-800/80 flex items-center justify-between text-[10px] font-mono text-technical-muted shrink-0">
            <div>
              <span>TOTAL SIGNATURES: {approvedSignatures.length}</span>
              <span className="mx-2 text-void-700">•</span>
              <span>DETERMINISTIC SEED PLACEMENT</span>
            </div>
            <div className="text-technical-silver hidden sm:block">
              ONE SIGNATURE PER MEMBER
            </div>
          </div>

          {/* Signatures Canvas */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto min-h-[350px]">
            {approvedSignatures.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-none border border-void-800 flex items-center justify-center text-technical-muted">
                  <Edit3 size={20} />
                </div>
                <div className="text-white font-bold text-sm tracking-widest uppercase">
                  {language === 'ru' ? 'СТЕНА ПОДПИСЕЙ ПУСТА' : 'NO SIGNATURES RECORDED YET'}
                </div>
                <p className="text-xs text-technical-muted max-w-sm">
                  {language === 'ru'
                    ? 'Поставьте свою личную цифровую подпись в архив dYnex?.'
                    : 'Place your verified digital signature on the dYnex? archive wall.'}
                </p>
                <button
                  onClick={() => (isMember ? openLeaveSignature() : openAuthModal('register'))}
                  className="mt-2 px-4 py-2 border border-signal-red text-signal-red text-xs font-bold tracking-widest hover:bg-signal-red hover:text-white transition-all"
                >
                  {language === 'ru' ? 'ПОСТАВИТЬ ПОДПИСЬ →' : 'LEAVE FIRST SIGNATURE →'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                {approvedSignatures.map((sig, idx) => {
                  const r1 = pseudoRandom(sig.seed);
                  const r2 = pseudoRandom(sig.seed + 1);
                  const rot = ((r1 - 0.5) * 8).toFixed(1); // subtle rotation: -4deg to +4deg
                  const isOwner = currentUser?.id === sig.userId;
                  const isPending = sig.status === 'PENDING';

                  return (
                    <motion.div
                      key={sig.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                      style={{ transform: `rotate(${rot}deg)` }}
                      className={`relative p-3.5 bg-void-900 border transition-all duration-200 flex flex-col justify-between hover:scale-105 hover:z-10 hover:border-signal-red ${
                        isPending
                          ? 'border-dashed border-signal-red/60 bg-signal-red/5'
                          : 'border-void-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[8px] font-mono text-technical-muted mb-1.5">
                          <span>#{String(idx + 1).padStart(3, '0')}</span>
                          <span>SIG_{sig.seed.toString().slice(-4)}</span>
                        </div>

                        <div className="font-mono font-bold text-xs text-white group-hover:text-signal-red transition-colors truncate">
                          @{sig.username}
                        </div>

                        {sig.phrase && (
                          <div className="text-[10px] font-mono text-technical-silver italic mt-1 break-words">
                            "{sig.phrase}"
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-void-800/80 flex items-center justify-between text-[8px] font-mono text-technical-muted">
                        <span className="text-signal-red">
                          {isPending ? (language === 'ru' ? 'МОДЕРАЦИЯ' : 'PENDING') : 'VERIFIED'}
                        </span>
                        {isOwner && (
                          <button
                            onClick={deleteUserSignature}
                            className="text-technical-muted hover:text-signal-red transition-colors"
                            title="Удалить подпись"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="p-4 bg-void-900 border-t border-void-800 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            {userActiveSignature ? (
              <div className="flex items-center space-x-2 text-technical-silver">
                <Check size={13} className="text-signal-red" />
                <span>
                  {language === 'ru' ? 'ВАША ПОДПИСЬ:' : 'YOUR SIGNATURE:'}{' '}
                  <strong className="text-white font-bold">@{userActiveSignature.username}</strong>{' '}
                  <span className="text-technical-muted">
                    ({userActiveSignature.status === 'APPROVED' ? (language === 'ru' ? 'АКТИВНА' : 'ACTIVE') : (language === 'ru' ? 'МОДЕРАЦИЯ' : 'PENDING')})
                  </span>
                </span>
              </div>
            ) : (
              <div className="text-technical-muted text-[11px]">
                // {language === 'ru' ? 'Каждый участник может оставить 1 цифровую подпись.' : 'Each member can anchor 1 digital signature.'}
              </div>
            )}

            <button
              onClick={() => (isMember ? openLeaveSignature() : openAuthModal('register'))}
              className="w-full sm:w-auto px-5 py-2 bg-void-950 hover:bg-signal-red border border-void-700 hover:border-signal-red text-white text-xs font-bold tracking-widest uppercase transition-all"
            >
              {userActiveSignature
                ? (language === 'ru' ? 'ИЗМЕНИТЬ ПОДПИСЬ' : 'UPDATE SIGNATURE')
                : (language === 'ru' ? 'ПОСТАВИТЬ ПОДПИСЬ →' : 'SIGN NOW →')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Leave Signature Composer Modal */}
      {isLeaveSignatureOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void-950/80 backdrop-blur-sm"
            onClick={closeLeaveSignature}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            className="relative z-10 w-full max-w-md bg-void-950 border border-void-700 shadow-2xl p-6 tactical-border text-technical-light"
          >
            <div className="flex items-center justify-between pb-3 border-b border-void-800 mb-4 text-xs font-mono text-signal-red font-bold">
              <span>// DIGITAL SIGNATURE GENERATOR</span>
              <button onClick={closeLeaveSignature} className="text-technical-muted hover:text-white">
                <X size={16} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-3 p-2.5 bg-signal-red/10 border border-signal-red/50 text-signal-red text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateSignature} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-technical-muted uppercase mb-1.5">
                  {language === 'ru' ? 'ИДЕНТИФИКАТОР ПОДПИСИ:' : 'SIGNATURE NODE:'}
                </label>
                <div className="px-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-signal-red font-bold">
                  @{currentUser?.username}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-technical-muted uppercase mb-1.5">
                  {language === 'ru' ? 'КОРОТКАЯ ФРАЗА (ОПЦИОНАЛЬНО, ДО 64 СИМВОЛОВ):' : 'SHORT PHRASE (OPTIONAL, MAX 64):'}
                </label>
                <input
                  type="text"
                  maxLength={64}
                  value={phraseInput}
                  onChange={(e) => setPhraseInput(e.target.value)}
                  placeholder={language === 'ru' ? 'Например: "from Neo Tokyo with love"' : 'e.g. "still in orbit"'}
                  className="w-full px-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeLeaveSignature}
                  className="flex-1 py-2.5 bg-void-900 border border-void-800 text-technical-silver font-mono text-xs hover:text-white transition-colors"
                >
                  {language === 'ru' ? 'ОТМЕНА' : 'CANCEL'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs font-bold uppercase tracking-widest transition-all shadow-signal-red-sharp disabled:opacity-50"
                >
                  <span>{isSubmitting ? (language === 'ru' ? 'ГЕНЕРАЦИЯ...' : 'ANCHORING...') : (language === 'ru' ? 'ЗАКРЕПИТЬ ПОДПИСЬ' : 'ANCHOR SIGNATURE')}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
