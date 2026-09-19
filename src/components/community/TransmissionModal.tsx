import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Radio, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

export const TransmissionModal: React.FC = () => {
  const { language } = useArchive();
  const { isTransmissionOpen, closeTransmission, submitTransmission, currentUser } = useCommunity();

  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receivedId, setReceivedId] = useState<string | null>(null);

  if (!isTransmissionOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await submitTransmission({
      contact,
      subject,
      message,
    });

    setIsSubmitting(false);

    if (res.success && res.id) {
      setReceivedId(res.id);
      setContact('');
      setSubject('');
      setMessage('');
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleReset = () => {
    setReceivedId(null);
    closeTransmission();
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
          onClick={handleReset}
        />

        {/* Modal Window */}
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
              <Radio size={13} className="animate-pulse" />
              <span className="font-bold">
                {language === 'ru' ? 'TRANSMISSION // АСИНХРОННЫЙ ПЕРЕДАТЧИК' : 'TRANSMIT TO dYnex?'}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="p-1 text-technical-muted hover:text-white transition-colors"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6">
            {receivedId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-4 font-mono"
              >
                <div className="w-12 h-12 mx-auto rounded-none border border-signal-red/60 bg-signal-red/10 flex items-center justify-center text-signal-red">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-white text-base font-bold tracking-widest uppercase">
                    {language === 'ru' ? 'СИГНАЛ ПРИНЯТ АРХИВОМ' : 'TRANSMISSION RECEIVED'}
                  </h3>
                  <p className="text-xs text-technical-muted mt-1">
                    {language === 'ru'
                      ? 'Ваше сообщение зафиксировано в защищенном узле артиста.'
                      : 'Your message has been anchored in the secure artist node.'}
                  </p>
                </div>

                <div className="inline-block px-4 py-2 bg-void-900 border border-void-700 text-xs text-signal-red font-bold tracking-widest">
                  TRANSMISSION ID: {receivedId}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-signal-red hover:bg-signal-red-glow text-white text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    {language === 'ru' ? 'ЗАКРЫТЬ ТЕРМИНАЛ' : 'CLOSE TERMINAL'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSend} className="space-y-4">
                <p className="text-[11px] font-mono text-technical-muted">
                  {language === 'ru'
                    ? 'Прямое асинхронное обращение к артисту dYnex?: сотрудничество, предложения, личные отзывы.'
                    : 'Direct asynchronous message to dYnex?: collaboration inquiries, propositions, feedback.'}
                </p>

                {errorMsg && (
                  <div className="p-2.5 bg-signal-red/10 border border-signal-red/50 text-signal-red text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                      {language === 'ru' ? 'ОТПРАВИТЕЛЬ:' : 'SENDER:'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentUser ? `@${currentUser.username}` : 'GUEST // ANONYMOUS'}
                      className="w-full px-3 py-2 bg-void-900/60 border border-void-800 text-xs font-mono text-technical-silver rounded-none opacity-80"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                      {language === 'ru' ? 'КОНТАКТ (TG / EMAIL):' : 'CONTACT (TG / EMAIL):'}
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="@telegram / email"
                      className="w-full px-3 py-2 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ТЕМА ПЕРЕДАЧИ:' : 'SUBJECT:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={language === 'ru' ? 'Сотрудничество / Фидбек' : 'Collaboration / Feedback'}
                    className="w-full px-3 py-2 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ТЕКСТ СООБЩЕНИЯ:' : 'MESSAGE:'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'ru' ? 'Ваш текст...' : 'Your message...'}
                    className="w-full p-3 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs font-bold uppercase tracking-widest rounded-none transition-all shadow-signal-red-sharp disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Send size={13} />
                    <span>
                      {isSubmitting
                        ? (language === 'ru' ? 'ОТПРАВКА СИГНАЛА...' : 'TRANSMITTING...')
                        : (language === 'ru' ? 'ОТПРАВИТЬ TRANSMISSION' : 'TRANSMIT MESSAGE')}
                    </span>
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-void-900 flex justify-between items-center text-[9px] font-mono text-technical-muted">
              <span>ASYNCHRONOUS NODE GATEWAY</span>
              <span>NO LIVE CHAT // QUEUE SYSTEM</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
