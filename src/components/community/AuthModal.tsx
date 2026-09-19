import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, KeyRound, UserCheck, Sparkles, Terminal } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

export const AuthModal: React.FC = () => {
  const { language } = useArchive();
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register } = useCommunity();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
  }, [authModalTab, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    const res = await login({ usernameOrEmail, password });
    setIsSubmitting(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    const res = await register({
      username: registerUsername,
      email: registerEmail,
      password,
    });
    setIsSubmitting(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
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
          className="fixed inset-0 bg-void-950/85 backdrop-blur-md"
          onClick={closeAuthModal}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md bg-void-950/95 border border-void-700 shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-none overflow-hidden text-technical-light tactical-border"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-void-900 border-b border-void-800">
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-signal-red">
              <Terminal size={13} />
              <span className="font-bold">
                {language === 'ru' ? 'MEMBER ACCESS // ИДЕНТИФИКАЦИЯ' : 'MEMBER ACCESS // IDENTITY'}
              </span>
            </div>
            <button
              onClick={closeAuthModal}
              className="p-1 text-technical-muted hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 border-b border-void-800 font-mono text-xs">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`py-3 text-center tracking-widest transition-all ${
                authModalTab === 'login'
                  ? 'bg-void-950 text-white font-bold border-b-2 border-signal-red'
                  : 'bg-void-900/60 text-technical-muted hover:text-white'
              }`}
            >
              {language === 'ru' ? 'ВХОД В АРХИВ' : 'SIGN IN'}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('register')}
              className={`py-3 text-center tracking-widest transition-all ${
                authModalTab === 'register'
                  ? 'bg-void-950 text-white font-bold border-b-2 border-signal-red'
                  : 'bg-void-900/60 text-technical-muted hover:text-white'
              }`}
            >
              {language === 'ru' ? 'СОЗДАТЬ IDENTITY' : 'CREATE IDENTITY'}
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-signal-red/10 border border-signal-red/50 text-signal-red text-xs font-mono flex items-start space-x-2 rounded-none"
              >
                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {authModalTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <p className="text-[11px] font-mono text-technical-muted">
                  {language === 'ru'
                    ? 'Войдите под своим @username или email, чтобы взаимодействовать с архивом.'
                    : 'Sign in with your @username or email to interact with the archive.'}
                </p>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ИМЯ ПОЛЬЗОВАТЕЛЯ ИЛИ EMAIL:' : 'USERNAME OR EMAIL:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    placeholder="@username / email@archive.io"
                    className="w-full px-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ПАРОЛЬ (ОПЦИОНАЛЬНО ДЛЯ LOCAL):' : 'PASSWORD (OPTIONAL):'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs font-bold uppercase tracking-widest rounded-none transition-all shadow-signal-red-sharp disabled:opacity-50 mt-2 flex items-center justify-center space-x-2"
                >
                  <KeyRound size={13} />
                  <span>
                    {isSubmitting
                      ? (language === 'ru' ? 'ПРОВЕРКА ДОСТУПА...' : 'VERIFYING...')
                      : (language === 'ru' ? 'ПОЛУЧИТЬ ДОСТУП' : 'AUTHORIZE NODE')}
                  </span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <p className="text-[11px] font-mono text-technical-muted">
                  {language === 'ru'
                    ? 'Зарегистрируйте свой цифровой идентификатор в архиве dYnex?. Никаких длинных анкет.'
                    : 'Create your digital identity node in dYnex? archive. Fast and minimal.'}
                </p>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'УНИКАЛЬНЫЙ USERNAME (@):' : 'UNIQUE USERNAME (@):'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-signal-red font-mono text-xs">@</span>
                    <input
                      type="text"
                      required
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))}
                      placeholder="neonvoid"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'EMAIL АДРЕС:' : 'EMAIL ADDRESS:'}
                  </label>
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="user@domain.com"
                    className="w-full px-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red transition-colors"
                  />
                  <span className="block text-[9px] font-mono text-technical-muted mt-1">
                    {language === 'ru' ? '// Email никогда не публикуется публично' : '// Email is strictly private'}
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ПАРОЛЬ ДЛЯ ЗАЩИТЫ КЛЮЧА:' : 'PASSWORD:'}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs font-bold uppercase tracking-widest rounded-none transition-all shadow-signal-red-sharp disabled:opacity-50 mt-2 flex items-center justify-center space-x-2"
                >
                  <UserCheck size={13} />
                  <span>
                    {isSubmitting
                      ? (language === 'ru' ? 'ГЕНЕРАЦИЯ IDENTITY...' : 'GENERATING IDENTITY...')
                      : (language === 'ru' ? 'СОЗДАТЬ ЦИФРОВОЙ СЛЕД' : 'GENERATE IDENTITY')}
                  </span>
                </button>
              </form>
            )}

            {/* Bottom Barcode */}
            <div className="mt-6 pt-4 border-t border-void-900 flex items-center justify-between text-[9px] font-mono text-technical-muted">
              <span>SECURITY: RLS PROTECTED</span>
              <div className="barcode-pattern-silver w-16 h-2 opacity-40" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
