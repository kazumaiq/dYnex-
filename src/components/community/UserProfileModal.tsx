import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, LogOut, Radio, Eye, EyeOff, Activity, Fingerprint } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

export const UserProfileModal: React.FC = () => {
  const { language } = useArchive();
  const {
    isProfileOpen,
    closeUserProfile,
    profileUser,
    currentUser,
    logout,
    updatePrivacy,
    signals,
    traces,
    signatures,
    transmissions,
  } = useCommunity();

  if (!isProfileOpen || !profileUser) return null;

  const isOwnProfile = currentUser?.id === profileUser.id;

  // Counts
  const userSignalsCount = signals.filter((s) => s.userId === profileUser.id).length;
  const userTracesCount = traces.filter((t) => t.userId === profileUser.id).length;
  const userSigCount = signatures.filter((s) => s.userId === profileUser.id).length;
  const userTransCount = transmissions.filter((t) => t.userId === profileUser.id).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-void-950/85 backdrop-blur-md"
          onClick={closeUserProfile}
        />

        {/* Card Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg bg-void-950/95 border border-void-700 shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-none overflow-hidden text-technical-light tactical-border"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-void-900 border-b border-void-800">
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-signal-red">
              <Fingerprint size={13} />
              <span className="font-bold">
                {language === 'ru' ? 'DIGITAL IDENTITY CARD' : 'DIGITAL IDENTITY CARD'}
              </span>
            </div>
            <button
              onClick={closeUserProfile}
              className="p-1 text-technical-muted hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Identity Card Presentation */}
            <div className="p-5 bg-gradient-to-br from-void-900 via-void-950 to-void-900 border border-void-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-signal-red/5 blur-xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono text-technical-muted tracking-widest">
                    // ARCHIVE IDENTITY
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white tracking-tight mt-0.5">
                    @{profileUser.username}
                  </h2>
                </div>
                <span className="px-2.5 py-1 bg-void-950 border border-void-700 text-signal-red font-mono text-[10px] font-bold tracking-widest">
                  {profileUser.nodeNumber}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-technical-silver">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-signal-red animate-pulse" />
                  <span>
                    STATUS:{' '}
                    <strong className="text-white">
                      {profileUser.status === 'ACTIVE' ? 'ACTIVE // VERIFIED' : profileUser.status}
                    </strong>
                  </span>
                </div>
                <span className="text-void-700">•</span>
                <span>
                  ROLE: <strong className="text-signal-red">{profileUser.role}</strong>
                </span>
                <span className="text-void-700">•</span>
                <span>SINCE {profileUser.createdAt.slice(0, 4)}</span>
              </div>

              <div className="barcode-pattern w-full h-2 mt-4 opacity-50" />
            </div>

            {/* Metrics Counters */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-2.5 flex items-center justify-between">
                <span>{language === 'ru' ? 'АКТИВНОСТЬ В АРХИВЕ:' : 'ARCHIVE ACTIVITY TELEMETRY:'}</span>
                <Activity size={12} className="text-signal-red" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-3 bg-void-900 border border-void-800 text-center">
                  <div className="text-xl font-bold font-mono text-white">{userSignalsCount}</div>
                  <div className="text-[9px] font-mono text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'СИГНАЛЫ' : 'SIGNALS'}
                  </div>
                </div>
                <div className="p-3 bg-void-900 border border-void-800 text-center">
                  <div className="text-xl font-bold font-mono text-signal-red">{userTracesCount}</div>
                  <div className="text-[9px] font-mono text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'СЛЕДЫ' : 'TRACES'}
                  </div>
                </div>
                <div className="p-3 bg-void-900 border border-void-800 text-center">
                  <div className="text-xl font-bold font-mono text-white">{userSigCount}</div>
                  <div className="text-[9px] font-mono text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'ПОДПИСИ' : 'SIGNATURES'}
                  </div>
                </div>
                <div className="p-3 bg-void-900 border border-void-800 text-center">
                  <div className="text-xl font-bold font-mono text-white">{userTransCount}</div>
                  <div className="text-[9px] font-mono text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'МЕССЕДЖИ' : 'TRANSMISSIONS'}
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Controls (Only for own profile) */}
            {isOwnProfile && (
              <div className="border-t border-void-800 pt-4 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-technical-muted">
                  {language === 'ru' ? 'НАСТРОЙКИ ПРИВАТНОСТИ IDENTITY:' : 'PRIVACY SETTINGS:'}
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <label className="flex items-center justify-between p-2.5 bg-void-900 border border-void-800 cursor-pointer hover:border-void-700">
                    <span className="text-technical-silver">
                      {language === 'ru' ? 'Публичный профиль в архиве' : 'Public Profile'}
                    </span>
                    <input
                      type="checkbox"
                      checked={profileUser.privacySettings.publicProfile}
                      onChange={(e) => updatePrivacy({ publicProfile: e.target.checked })}
                      className="accent-signal-red w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-void-900 border border-void-800 cursor-pointer hover:border-void-700">
                    <span className="text-technical-silver">
                      {language === 'ru' ? 'Показывать мои следы на стене' : 'Show Traces on Wall'}
                    </span>
                    <input
                      type="checkbox"
                      checked={profileUser.privacySettings.showTraces}
                      onChange={(e) => updatePrivacy({ showTraces: e.target.checked })}
                      className="accent-signal-red w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 bg-void-900 border border-void-800 cursor-pointer hover:border-void-700">
                    <span className="text-technical-silver">
                      {language === 'ru' ? 'Показывать мои мнения под релизами' : 'Show Signals under Releases'}
                    </span>
                    <input
                      type="checkbox"
                      checked={profileUser.privacySettings.showSignals}
                      onChange={(e) => updatePrivacy({ showSignals: e.target.checked })}
                      className="accent-signal-red w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="text-[9px] font-mono text-technical-muted">
                  // {language === 'ru' ? 'Email скрыт и никогда не публикуется.' : 'Email is strictly private.'}
                </div>
              </div>
            )}

            {/* Logout / Actions */}
            {isOwnProfile && (
              <div className="pt-2 flex justify-between items-center border-t border-void-800">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 bg-void-900 hover:bg-signal-red/20 border border-void-800 hover:border-signal-red text-technical-silver hover:text-signal-red text-xs font-mono tracking-wider flex items-center space-x-2 transition-all"
                >
                  <LogOut size={13} />
                  <span>{language === 'ru' ? 'ВЫЙТИ ИЗ IDENTITY' : 'DISCONNECT NODE'}</span>
                </button>

                <div className="text-[9px] font-mono text-technical-muted">
                  SECURE SESSION ACTIVE
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
