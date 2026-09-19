import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Music2, CheckCircle2, AlertCircle, FileAudio, Trash2 } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

export const CollabModal: React.FC = () => {
  const { language } = useArchive();
  const { isCollabOpen, closeCollab, submitCollab, currentUser } = useCommunity();

  const [contact, setContact] = useState('');
  const [collabType, setCollabType] = useState<'FIT' | 'COLLAB'>('COLLAB');
  const [message, setMessage] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [receivedId, setReceivedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isCollabOpen) return null;

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setErrorMsg(null);

    // 50MB check
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg(language === 'ru' ? 'Размер файла превышает 50 МБ' : 'File exceeds 50 MB limit');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!['mp3', 'wav', 'flac'].includes(ext)) {
      setErrorMsg(language === 'ru' ? 'Формат не поддерживается. Только MP3, WAV или FLAC' : 'Unsupported format. Only MP3, WAV or FLAC');
      return;
    }

    setAudioFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      setErrorMsg(language === 'ru' ? 'Прикрепите аудиофайл демо' : 'Please attach an audio demo file');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await submitCollab({
      contact,
      type: collabType,
      message,
      audioFile,
    });

    setIsSubmitting(false);

    if (res.success && res.id) {
      setReceivedId(res.id);
      setContact('');
      setMessage('');
      setAudioFile(null);
    } else if (res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleReset = () => {
    setReceivedId(null);
    closeCollab();
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
              <Music2 size={13} />
              <span className="font-bold">
                {language === 'ru' ? 'FIT / COLLABORATION REQUEST' : 'FIT / COLLAB PROTOCOL'}
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
                    {language === 'ru' ? 'ДЕМО-ЗАЯВКА ЗАФИКСИРОВАНА' : 'DEMO RECEIVED // COLLAB NODE CREATED'}
                  </h3>
                  <p className="text-xs text-technical-muted mt-1">
                    {language === 'ru'
                      ? 'Аудиофайл проверен и направлен на прослушивание артисту.'
                      : 'Audio demo anchored and submitted to artist moderation.'}
                  </p>
                </div>

                <div className="inline-block px-4 py-2 bg-void-900 border border-void-700 text-xs text-signal-red font-bold tracking-widest">
                  COLLAB ID: {receivedId}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-signal-red hover:bg-signal-red-glow text-white text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    {language === 'ru' ? 'ЗАКРЫТЬ ТЕРМИНАЛ' : 'CLOSE PROTOCOL'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-[11px] font-mono text-technical-muted">
                  {language === 'ru'
                    ? 'Заявка на фит или совместный релиз с dYnex?. Прикрепите демо (MP3/WAV/FLAC, до 50 МБ).'
                    : 'Submit a collaboration or fit request with dYnex?. Upload your demo (MP3/WAV/FLAC up to 50MB).'}
                </p>

                {errorMsg && (
                  <div className="p-2.5 bg-signal-red/10 border border-signal-red/50 text-signal-red text-xs font-mono flex items-center space-x-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Type Selection */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ТИП ВЗАИМОДЕЙСТВИЯ:' : 'INTERACTION TYPE:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCollabType('COLLAB')}
                      className={`py-2 text-center text-xs font-mono tracking-wider border transition-all ${
                        collabType === 'COLLAB'
                          ? 'border-signal-red bg-signal-red text-white font-bold'
                          : 'border-void-800 bg-void-900 text-technical-muted hover:text-white'
                      }`}
                    >
                      // COLLAB (СОВМЕСТНЫЙ ТРЕК)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollabType('FIT')}
                      className={`py-2 text-center text-xs font-mono tracking-wider border transition-all ${
                        collabType === 'FIT'
                          ? 'border-signal-red bg-signal-red text-white font-bold'
                          : 'border-void-800 bg-void-900 text-technical-muted hover:text-white'
                      }`}
                    >
                      // FIT (ГОСТЕВОЙ ПАРТ / ВОКАЛ)
                    </button>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ВАШ КОНТАКТ ДЛЯ СВЯЗИ (TG / EMAIL / ВК):' : 'YOUR CONTACT (TG / EMAIL / VK):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="@telegram / email / vk.ru/profile"
                    className="w-full px-3.5 py-2.5 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'ОПИСАНИЕ И ИДЕЯ ТРЕКА:' : 'CONCEPT & DESCRIPTION:'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'ru' ? 'Жанр, идея, ссылки на ваши предыдущие работы...' : 'Genre, BPM, concept, reference links...'}
                    className="w-full p-3 bg-void-900 border border-void-800 text-xs font-mono text-white placeholder:text-technical-muted/50 rounded-none focus:outline-none focus:border-signal-red resize-none"
                  />
                </div>

                {/* Audio Upload Area */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-technical-muted mb-1.5">
                    {language === 'ru' ? 'АУДИОФАЙЛ ДЕМО (MP3, WAV, FLAC ДО 50 МБ):' : 'AUDIO DEMO FILE (MP3, WAV, FLAC MAX 50MB):'}
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp3,.wav,.flac,audio/mpeg,audio/wav,audio/flac"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                  />

                  {audioFile ? (
                    <div className="p-3.5 bg-void-900 border border-signal-red flex items-center justify-between">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <FileAudio size={20} className="text-signal-red shrink-0" />
                        <div className="truncate font-mono">
                          <div className="text-xs text-white truncate font-bold">{audioFile.name}</div>
                          <div className="text-[10px] text-technical-muted">
                            {(audioFile.size / (1024 * 1024)).toFixed(2)} MB // READY
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setAudioFile(null)}
                        className="p-1.5 text-technical-muted hover:text-signal-red transition-colors shrink-0"
                        title="Удалить файл"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 border-2 border-dashed border-void-800 hover:border-signal-red bg-void-900/50 hover:bg-void-900 text-center cursor-pointer transition-all"
                    >
                      <Upload size={22} className="mx-auto text-technical-muted mb-2" />
                      <div className="text-xs font-mono text-white font-bold">
                        {language === 'ru' ? 'ВЫБЕРИТЕ ИЛИ ПЕРЕТАЩИТЕ АУДИОФАЙЛ' : 'CLICK OR DRAG AUDIO DEMO'}
                      </div>
                      <div className="text-[10px] font-mono text-technical-muted mt-1">
                        MP3 • WAV • FLAC // MAX 50 MB
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !audioFile}
                    className="w-full py-3 bg-signal-red hover:bg-signal-red-glow text-white font-mono text-xs font-bold uppercase tracking-widest rounded-none transition-all shadow-signal-red-sharp disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Music2 size={13} />
                    <span>
                      {isSubmitting
                        ? (language === 'ru' ? 'ЗАГРУЗКА ДЕМО...' : 'UPLOADING DEMO...')
                        : (language === 'ru' ? 'ОТПРАВИТЬ ДЕМО В АРХИВ' : 'TRANSMIT DEMO NODE')}
                    </span>
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-void-900 flex justify-between items-center text-[9px] font-mono text-technical-muted">
              <span>SECURITY: SAFE STORAGE</span>
              <span>NO PUBLIC DISTRIBUTION</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
