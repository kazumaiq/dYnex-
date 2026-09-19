import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Radio,
  Shuffle,
  Send,
  Music2,
  Edit3,
  MessageSquare,
  ArrowUpRight,
  Disc3,
  Calendar,
  Activity,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import { useArchive } from '../../context/ArchiveContext';

export const CommunitySection: React.FC = () => {
  const { language, setSelectedRelease } = useArchive();
  const {
    stats,
    todaySignalRelease,
    triggerRandomNode,
    openTraceWall,
    openSignatureWall,
    openTransmission,
    openCollab,
    traces,
    signatures,
  } = useCommunity();

  const handleOpenTodayRelease = () => {
    const archiveElem = document.querySelector('#archive');
    if (archiveElem) {
      archiveElem.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      setSelectedRelease(todaySignalRelease);
    }, 450);
  };

  const latestTrace = traces.find((t) => t.status === 'APPROVED');

  return (
    <section
      id="community"
      className="relative min-h-screen w-full px-4 sm:px-8 lg:px-12 py-24 sm:py-32 flex flex-col justify-center pointer-events-none select-none max-w-7xl mx-auto overflow-hidden"
    >
      <div className="w-full pointer-events-auto">
        {/* Top Header HUD */}
        <div className="flex items-center space-x-3 text-[10px] sm:text-xs font-mono text-signal-red uppercase tracking-widest-tech mb-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-red opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-red" />
          </span>
          <span className="font-bold">// 07</span>
          <span className="text-white/80 font-bold">
            {language === 'ru' ? 'ИНТЕРАКТИВНЫЙ АРХИВ СООБЩЕСТВА' : 'INTERACTIVE COMMUNITY ARCHIVE'}
          </span>
          <span className="text-void-700">//</span>
          <span className="text-technical-muted">AUDIENCE SIGNALS & TRACES</span>
        </div>

        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-sans font-black text-4xl sm:text-6xl lg:text-7xl tracking-tighter text-white uppercase leading-none">
              SIGNAL <span className="text-signal-red">NETWORK</span>
            </h2>
            <p className="text-xs sm:text-sm font-mono text-technical-muted mt-3 max-w-xl">
              {language === 'ru'
                ? 'Обычный посетитель смотрит dYnex?. Зарегистрированный участник оставляет свой цифровой след, подпись и становится частью живого архива.'
                : 'A guest explores dYnex?. A member leaves a digital trace, signature, and becomes an intrinsic part of the archive universe.'}
            </p>
          </div>

          {/* Random Node Quick Trigger */}
          <button
            onClick={triggerRandomNode}
            className="group px-4 py-3 bg-void-950 hover:bg-signal-red border border-void-700 hover:border-signal-red text-white text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center space-x-2 shadow-signal-red-sharp self-start md:self-auto shrink-0"
          >
            <Shuffle size={13} className="text-signal-red group-hover:text-white group-hover:rotate-180 transition-all duration-300" />
            <span>{language === 'ru' ? 'RANDOM NODE // 3D' : 'RANDOM NODE // 3D'}</span>
          </button>
        </div>

        {/* Primary 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Today's Signal + Signal Board (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Today's Signal Card */}
            {todaySignalRelease && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="tactical-border p-5 bg-gradient-to-br from-void-900 via-void-950 to-void-900 border border-void-700 rounded-none relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-technical-muted mb-3 border-b border-void-800 pb-2">
                  <div className="flex items-center space-x-1.5 text-signal-red font-bold">
                    <Calendar size={11} />
                    <span>{language === 'ru' ? "СИГНАЛ ДНЯ // TODAY'S SIGNAL" : "TODAY'S SIGNAL"}</span>
                  </div>
                  <span className="text-technical-silver">DETERMINISTIC // 24H</span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-none overflow-hidden border border-void-700 shrink-0 relative group">
                    <img
                      src={todaySignalRelease.artworkUrl}
                      alt={todaySignalRelease.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 left-1 bg-void-950/80 text-[8px] font-mono text-signal-red px-1">
                      #{todaySignalRelease.year}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 font-mono">
                    <div className="text-xs text-signal-red font-bold uppercase tracking-wider">
                      {todaySignalRelease.genre}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold font-sans text-white truncate">
                      {todaySignalRelease.title}
                    </h3>
                    <div className="text-[11px] text-technical-silver truncate mt-0.5">
                      {todaySignalRelease.artists}
                    </div>

                    <button
                      onClick={handleOpenTodayRelease}
                      className="mt-2.5 px-3 py-1.5 bg-void-950 hover:bg-signal-red border border-void-700 hover:border-signal-red text-white text-[10px] font-bold tracking-widest uppercase transition-all flex items-center space-x-1"
                    >
                      <Disc3 size={11} className="text-signal-red group-hover:text-white" />
                      <span>{language === 'ru' ? 'ВОЙТИ В РЕЛИЗ' : 'ENTER ARCHIVE'}</span>
                      <ArrowUpRight size={10} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Signal Board (Live Telemetry) */}
            <div className="p-5 bg-void-950/90 border border-void-800 rounded-none font-mono">
              <div className="text-[10px] uppercase tracking-widest text-technical-muted mb-3 flex items-center justify-between border-b border-void-800/80 pb-2">
                <span className="flex items-center space-x-1.5 text-white font-bold">
                  <Activity size={12} className="text-signal-red" />
                  <span>{language === 'ru' ? 'SIGNAL BOARD // ТЕЛЕМЕТРИЯ' : 'SIGNAL BOARD // TELEMETRY'}</span>
                </span>
                <span className="text-[9px] text-signal-red font-bold animate-pulse">LIVE 100%</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-void-900 border border-void-800/80">
                  <div className="text-2xl font-bold font-mono text-white tracking-tight">
                    {String(stats.activeSignals).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'АКТИВНЫХ СИГНАЛОВ' : 'ACTIVE SIGNALS'}
                  </div>
                </div>

                <div className="p-3 bg-void-900 border border-void-800/80">
                  <div className="text-2xl font-bold font-mono text-signal-red tracking-tight">
                    {String(stats.archivedTraces).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'ЦИФРОВЫХ СЛЕДОВ' : 'ARCHIVED TRACES'}
                  </div>
                </div>

                <div className="p-3 bg-void-900 border border-void-800/80">
                  <div className="text-2xl font-bold font-mono text-white tracking-tight">
                    {String(stats.approvedSignatures).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'ПОДПИСЕЙ НА СТЕНЕ' : 'SIGNATURE NODES'}
                  </div>
                </div>

                <div className="p-3 bg-void-900 border border-void-800/80">
                  <div className="text-2xl font-bold font-mono text-white tracking-tight">
                    {String(stats.totalMembers).padStart(2, '0')}
                  </div>
                  <div className="text-[9px] text-technical-muted uppercase mt-0.5">
                    {language === 'ru' ? 'УЧАСТНИКОВ АРХИВА' : 'TOTAL MEMBERS'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mechanics (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* 01. The Trace Wall Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={openTraceWall}
              className="group p-6 bg-gradient-to-br from-void-950 via-void-900 to-void-950 border border-void-700 hover:border-signal-red transition-all cursor-pointer flex flex-col justify-between h-56 tactical-border shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-technical-muted mb-2">
                  <span className="text-signal-red font-bold">// 07.A TRACE WALL</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-red transition-all" />
                </div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-signal-red transition-colors">
                  {language === 'ru' ? 'СТЕНА СЛЕДОВ' : 'THE TRACE WALL'}
                </h3>
                <p className="text-[11px] font-mono text-technical-muted mt-1.5">
                  {language === 'ru'
                    ? 'Оставьте свой короткий след в цифровом архиве. Просматривайте следы других слушателей.'
                    : 'Anchor your digital imprint in the archive. Explore timestamps left by listeners.'}
                </p>
              </div>

              <div className="pt-3 border-t border-void-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-technical-silver truncate max-w-[170px]">
                  {latestTrace ? `@${latestTrace.username}: "${latestTrace.content.slice(0, 20)}..."` : 'BE THE FIRST'}
                </span>
                <span className="text-signal-red font-bold uppercase group-hover:underline">
                  {language === 'ru' ? 'ОТКРЫТЬ →' : 'ENTER →'}
                </span>
              </div>
            </motion.div>

            {/* 02. Signature Wall Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              onClick={openSignatureWall}
              className="group p-6 bg-gradient-to-br from-void-950 via-void-900 to-void-950 border border-void-700 hover:border-signal-red transition-all cursor-pointer flex flex-col justify-between h-56 tactical-border shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-technical-muted mb-2">
                  <span className="text-signal-red font-bold">// 07.B SIGNATURE WALL</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-red transition-all" />
                </div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-signal-red transition-colors">
                  {language === 'ru' ? 'СТЕНА ПОДПИСЕЙ' : 'SIGNATURE WALL'}
                </h3>
                <p className="text-[11px] font-mono text-technical-muted mt-1.5">
                  {language === 'ru'
                    ? 'Генеративная сетка личных подписей. Закрепите свою уникальную метку в созвездии архива.'
                    : 'Generative constellation of verified member signatures. Pin your signature.'}
                </p>
              </div>

              <div className="pt-3 border-t border-void-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-technical-silver">
                  {signatures.length} {language === 'ru' ? 'ПОДПИСЕЙ' : 'SIGNATURES'}
                </span>
                <span className="text-signal-red font-bold uppercase group-hover:underline">
                  {language === 'ru' ? 'ПОДПИСАТЬ →' : 'SIGN →'}
                </span>
              </div>
            </motion.div>

            {/* 03. Transmission to dYnex? Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onClick={openTransmission}
              className="group p-6 bg-gradient-to-br from-void-950 via-void-900 to-void-950 border border-void-700 hover:border-[#229ED9] transition-all cursor-pointer flex flex-col justify-between h-56 tactical-border shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-technical-muted mb-2">
                  <span className="text-[#229ED9] font-bold">// 07.C DIRECT TRANSMISSION</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#229ED9] transition-all" />
                </div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-[#229ED9] transition-colors">
                  {language === 'ru' ? 'НАПИСАТЬ dYnex?' : 'TRANSMIT MESSAGE'}
                </h3>
                <p className="text-[11px] font-mono text-technical-muted mt-1.5">
                  {language === 'ru'
                    ? 'Асинхронная передача личного сообщения артисту. Никаких публичных чатов.'
                    : 'Direct asynchronous channel to dYnex?. Questions, proposals, feedback.'}
                </p>
              </div>

              <div className="pt-3 border-t border-void-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-technical-silver">ASYNC NODE // ENCRYPTED</span>
                <span className="text-[#229ED9] font-bold uppercase group-hover:underline">
                  {language === 'ru' ? 'НАПИСАТЬ →' : 'TRANSMIT →'}
                </span>
              </div>
            </motion.div>

            {/* 04. FIT / Collab Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              onClick={openCollab}
              className="group p-6 bg-gradient-to-br from-void-950 via-void-900 to-void-950 border border-void-700 hover:border-signal-red transition-all cursor-pointer flex flex-col justify-between h-56 tactical-border shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-technical-muted mb-2">
                  <span className="text-signal-red font-bold">// 07.D FIT / COLLAB</span>
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal-red transition-all" />
                </div>
                <h3 className="text-xl font-bold font-sans text-white group-hover:text-signal-red transition-colors">
                  {language === 'ru' ? 'ФИТ / КОЛЛАБОРАЦИЯ' : 'FIT / COLLAB PROTOCOL'}
                </h3>
                <p className="text-[11px] font-mono text-technical-muted mt-1.5">
                  {language === 'ru'
                    ? 'Отправьте демо-аудиофайл (MP3/WAV/FLAC) для рассмотрения совместного релиза.'
                    : 'Submit an audio demo for official collaboration or guest vocal part.'}
                </p>
              </div>

              <div className="pt-3 border-t border-void-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-technical-silver">DEMO GATEWAY // UP TO 50MB</span>
                <span className="text-signal-red font-bold uppercase group-hover:underline">
                  {language === 'ru' ? 'ОТПРАВИТЬ ДЕМО →' : 'SUBMIT DEMO →'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
