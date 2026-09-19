import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, Edit2, Trash2, Star, Eye, EyeOff, Download,
  Upload, RotateCcw, Save, X, Disc3, ShieldCheck, Check,
  MessageSquare, Edit3, Send, Music2, Users, FileText, Settings,
  Play, Pause, Volume2, ShieldAlert, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';
import { useCommunity } from '../context/CommunityContext';
import { Release } from '../types';
import { SignalComment, TraceItem, SignatureItem, TransmissionItem, CollabRequestItem } from '../types/community';

type AdminTab =
  | 'releases'
  | 'signals'
  | 'traces'
  | 'signatures'
  | 'transmissions'
  | 'collabs'
  | 'members'
  | 'audit'
  | 'settings';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    releases,
    addRelease,
    updateRelease,
    deleteRelease,
    toggleFeatured,
    togglePublish,
    importJSON,
    exportJSON,
    resetToVerified,
    language,
  } = useArchive();

  const {
    signals,
    updateSignalStatus,
    deleteSignal,
    traces,
    updateTraceStatus,
    deleteTrace,
    signatures,
    updateSignatureStatus,
    deleteSignature,
    transmissions,
    updateTransmissionStatus,
    deleteTransmission,
    collabs,
    updateCollabStatus,
    deleteCollab,
    users,
    blockUser,
    unblockUser,
    auditLogs,
    stats,
  } = useCommunity();

  const [currentTab, setCurrentTab] = useState<AdminTab>('releases');

  // Filter state for community tabs
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [traceFilter, setTraceFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [sigFilter, setSigFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [transFilter, setTransFilter] = useState<'ALL' | 'NEW' | 'READ' | 'ARCHIVED'>('NEW');
  const [collabFilter, setCollabFilter] = useState<'ALL' | 'NEW' | 'LISTENED' | 'ACCEPTED' | 'REJECTED'>('NEW');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Audio player state for Collabs
  const [playingCollabId, setPlayingCollabId] = useState<string | null>(null);

  // Release Form State (original features preserved 100%)
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    artists: 'dYnex?',
    year: 2026,
    date: new Date().toISOString().split('T')[0],
    type: 'SINGLE' as 'SINGLE' | 'EP' | 'ALBUM',
    genre: 'Electronic / Phonk',
    artworkUrl: '',
    description: '',
    trackCount: 1,
    appleMusic: '',
    spotify: '',
    youtube: '',
    vk: '',
    yandexMusic: '',
    label: '',
    isrc: '',
  });

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingRelease(null);
    setFormData({
      title: '',
      artists: 'dYnex?',
      year: 2026,
      date: new Date().toISOString().split('T')[0],
      type: 'SINGLE',
      genre: 'Electronic / Phonk',
      artworkUrl: '',
      description: '',
      trackCount: 1,
      appleMusic: '',
      spotify: '',
      youtube: '',
      vk: '',
      yandexMusic: '',
      label: '',
      isrc: '',
    });
  };

  const handleStartEdit = (r: Release) => {
    setEditingRelease(r);
    setIsAddingNew(false);
    setFormData({
      title: r.title,
      artists: r.artists,
      year: r.year,
      date: r.date,
      type: r.type,
      genre: r.genre,
      artworkUrl: r.artworkUrl,
      description: r.description || '',
      trackCount: r.trackCount,
      appleMusic: r.platforms.appleMusic || '',
      spotify: r.platforms.spotify || '',
      youtube: r.platforms.youtube || '',
      vk: r.platforms.vk || '',
      yandexMusic: r.platforms.yandexMusic || '',
      label: r.label || '',
      isrc: r.isrc || '',
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title,
      artists: formData.artists,
      year: Number(formData.year),
      date: formData.date,
      type: formData.type,
      genre: formData.genre,
      artworkUrl: formData.artworkUrl || 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4c/bd/09/4cbd09b3-e559-c241-6a7d-2101dc0c4157/cover.png/1000x1000bb.jpg',
      description: formData.description,
      trackCount: Number(formData.trackCount),
      verified: true,
      verificationStatus: 'MANUAL' as const,
      platforms: {
        appleMusic: formData.appleMusic || undefined,
        spotify: formData.spotify || undefined,
        youtube: formData.youtube || undefined,
        vk: formData.vk || undefined,
        yandexMusic: formData.yandexMusic || undefined,
      },
      label: formData.label || undefined,
      isrc: formData.isrc || undefined,
    };

    if (isAddingNew) {
      addRelease(payload);
      setIsAddingNew(false);
    } else if (editingRelease) {
      updateRelease(editingRelease.id, payload);
      setEditingRelease(null);
    }
  };

  const handleExport = () => {
    const jsonStr = exportJSON();
    navigator.clipboard.writeText(jsonStr);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        const success = importJSON(content);
        if (success) {
          setImportStatus('Каталог успешно импортирован!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Ошибка валидации JSON каталога');
          setTimeout(() => setImportStatus(null), 4000);
        }
      }
    };
    reader.readAsText(file);
  };

  // Pending count calculations
  const pendingSignalsCount = signals.filter((s) => s.status === 'PENDING').length;
  const pendingTracesCount = traces.filter((t) => t.status === 'PENDING').length;
  const pendingSigsCount = signatures.filter((s) => s.status === 'PENDING').length;
  const newTransCount = transmissions.filter((t) => t.status === 'NEW').length;
  const newCollabsCount = collabs.filter((c) => c.status === 'NEW').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-void-950/98 backdrop-blur-2xl flex flex-col font-mono text-technical-light overflow-y-auto select-none"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-void-950/95 border-b border-void-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 bg-void-900 border border-void-800 hover:border-signal-red text-white flex items-center space-x-1.5 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-xs uppercase font-bold tracking-wider">
              {language === 'ru' ? 'ВЫХОД' : 'EXIT'}
            </span>
          </button>
          <div>
            <div className="text-base sm:text-lg font-bold font-sans text-white flex items-center space-x-2">
              <span>dYnex? ADMIN MATRIX</span>
              <span className="text-signal-red font-mono text-xs">// 2026</span>
            </div>
            <div className="text-[10px] text-technical-muted tracking-widest uppercase">
              MODERATION & RELEASE CONTROL SYSTEM
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2 bg-void-900 border border-void-800 px-3 py-1.5 text-xs text-technical-silver">
          <span className="w-2 h-2 rounded-full bg-signal-red animate-pulse" />
          <span>RLS PROTECTED // OPERATIONAL</span>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="sticky top-[73px] z-10 bg-void-900 border-b border-void-800 px-6 flex items-center space-x-1 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('releases')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'releases'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <Disc3 size={13} className="text-signal-red" />
          <span>RELEASES [{releases.length}]</span>
        </button>

        <button
          onClick={() => setCurrentTab('signals')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'signals'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <MessageSquare size={13} />
          <span>SIGNALS</span>
          {pendingSignalsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
              {pendingSignalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('traces')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'traces'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <span>TRACES</span>
          {pendingTracesCount > 0 && (
            <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
              {pendingTracesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('signatures')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'signatures'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <Edit3 size={13} />
          <span>SIGNATURES</span>
          {pendingSigsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
              {pendingSigsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('transmissions')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'transmissions'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <Send size={13} />
          <span>TRANSMISSIONS</span>
          {newTransCount > 0 && (
            <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
              {newTransCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('collabs')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'collabs'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <Music2 size={13} />
          <span>COLLABS</span>
          {newCollabsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
              {newCollabsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentTab('members')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'members'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <Users size={13} />
          <span>MEMBERS [{users.length}]</span>
        </button>

        <button
          onClick={() => setCurrentTab('audit')}
          className={`px-4 py-3 text-xs tracking-wider transition-all flex items-center space-x-1.5 whitespace-nowrap ${
            currentTab === 'audit'
              ? 'border-b-2 border-signal-red text-white font-bold bg-void-950'
              : 'text-technical-muted hover:text-white'
          }`}
        >
          <FileText size={13} />
          <span>AUDIT LOG</span>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* ========================================================= */}
        {/* 01. TAB: RELEASES (Existing 100% Intact) */}
        {/* ========================================================= */}
        {currentTab === 'releases' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleStartAdd}
                  className="px-4 py-2 bg-signal-red hover:bg-signal-red-glow text-white text-xs rounded-none flex items-center space-x-1.5 transition-all shadow-signal-red-sharp"
                >
                  <Plus size={14} />
                  <span>ДОБАВИТЬ РЕЛИЗ</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExport}
                  className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-silver text-xs rounded-none flex items-center space-x-1.5 transition-colors"
                >
                  {copiedStatus ? <Check size={14} className="text-signal-red" /> : <Download size={14} />}
                  <span>{copiedStatus ? 'СКОПИРОВАНО!' : 'EXPORT JSON'}</span>
                </button>

                <label className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-silver text-xs rounded-none flex items-center space-x-1.5 transition-colors cursor-pointer">
                  <Upload size={14} />
                  <span>IMPORT JSON</span>
                  <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                </label>

                <button
                  onClick={resetToVerified}
                  className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-muted hover:text-white text-xs rounded-none flex items-center space-x-1.5 transition-colors"
                  title="Сбросить к исходному верифицированному каталогу"
                >
                  <RotateCcw size={14} />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {importStatus && (
              <div className="p-3 bg-void-900 border border-signal-red text-signal-red text-xs">
                {importStatus}
              </div>
            )}

            {/* Modal Editor / Add Form */}
            {(isAddingNew || editingRelease) && (
              <form
                onSubmit={handleSaveForm}
                className="p-6 bg-void-900 border border-signal-red/60 rounded-none space-y-6"
              >
                <div className="flex justify-between items-center border-b border-void-800 pb-3">
                  <div className="text-sm font-bold text-white flex items-center space-x-2">
                    <Disc3 size={16} className="text-signal-red" />
                    <span>
                      {isAddingNew
                        ? (language === 'ru' ? 'НОВЫЙ РЕЛИЗ В 3D АРХИВЕ' : 'NEW 3D RELEASE')
                        : (language === 'ru' ? `РЕДАКТИРОВАНИЕ: ${editingRelease?.title}` : `EDIT: ${editingRelease?.title}`)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingRelease(null); }}
                    className="text-technical-muted hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-technical-muted mb-1">НАЗВАНИЕ РЕЛИЗА / TITLE</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">АРТИСТЫ / ARTISTS</label>
                    <input
                      type="text"
                      required
                      value={formData.artists}
                      onChange={(e) => setFormData({ ...formData, artists: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">ГОД / YEAR</label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">ДАТА РЕЛИЗА / DATE</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">ТИП / TYPE</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    >
                      <option value="SINGLE">SINGLE</option>
                      <option value="EP">EP</option>
                      <option value="ALBUM">ALBUM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">ЖАНР / GENRE</label>
                    <input
                      type="text"
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-technical-muted mb-1">URL ОБЛОЖКИ / ARTWORK URL</label>
                    <input
                      type="url"
                      value={formData.artworkUrl}
                      onChange={(e) => setFormData({ ...formData, artworkUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">КОЛИЧЕСТВО ТРЕКОВ</label>
                    <input
                      type="number"
                      value={formData.trackCount}
                      onChange={(e) => setFormData({ ...formData, trackCount: Number(e.target.value) })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">APPLE MUSIC URL</label>
                    <input
                      type="url"
                      value={formData.appleMusic}
                      onChange={(e) => setFormData({ ...formData, appleMusic: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">SPOTIFY URL</label>
                    <input
                      type="url"
                      value={formData.spotify}
                      onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div>
                    <label className="block text-technical-muted mb-1">VK MUSIC URL</label>
                    <input
                      type="url"
                      value={formData.vk}
                      onChange={(e) => setFormData({ ...formData, vk: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-technical-muted mb-1">ОПИСАНИЕ / DESCRIPTION</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingRelease(null); }}
                    className="px-4 py-2 bg-void-950 border border-void-800 text-technical-muted hover:text-white rounded-none"
                  >
                    ОТМЕНА
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-signal-red hover:bg-signal-red-glow text-white tracking-widest uppercase rounded-none flex items-center space-x-2"
                  >
                    <Save size={14} />
                    <span>СОХРАНИТЬ В 3D МИР</span>
                  </button>
                </div>
              </form>
            )}

            {/* Catalog Table */}
            <div className="bg-void-900/80 border border-void-800 rounded-none overflow-hidden">
              <div className="p-4 border-b border-void-800 flex justify-between items-center text-xs text-technical-muted uppercase">
                <span>ВСЕГО В КАТАЛОГЕ: {releases.length} РЕЛИЗОВ</span>
                <span className="text-signal-red">3D SYNC // ОНЛАЙН</span>
              </div>

              <div className="divide-y divide-void-800 max-h-[600px] overflow-y-auto">
                {releases.map((release) => (
                  <div
                    key={release.id}
                    className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                      release.featured ? 'bg-signal-red/10 border-l-4 border-signal-red' : 'hover:bg-void-850'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <img
                        src={release.artworkUrl}
                        alt={release.title}
                        className="w-12 h-12 rounded-none object-cover border border-void-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-white truncate">{release.title}</span>
                          {release.featured && (
                            <span className="bg-signal-red text-white text-[9px] px-1.5 py-0.2">FEATURED</span>
                          )}
                          {release.published === false && (
                            <span className="bg-void-800 text-technical-muted text-[9px] px-1.5 py-0.2">СКРЫТ</span>
                          )}
                        </div>
                        <div className="text-xs text-technical-muted truncate">
                          {release.artists} // {release.year} // {release.genre}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => toggleFeatured(release.id)}
                        className={`p-2 border transition-colors ${
                          release.featured
                            ? 'bg-signal-red border-signal-red text-white'
                            : 'bg-void-950 border-void-800 text-technical-muted hover:text-white'
                        }`}
                        title="Сделать главным релизом в Hero"
                      >
                        <Star size={14} />
                      </button>

                      <button
                        onClick={() => togglePublish(release.id)}
                        className="p-2 bg-void-950 border border-void-800 text-technical-silver hover:text-white"
                        title={release.published !== false ? 'Скрыть из 3D мира' : 'Показать в 3D'}
                      >
                        {release.published !== false ? <Eye size={14} /> : <EyeOff size={14} className="text-signal-red" />}
                      </button>

                      <button
                        onClick={() => handleStartEdit(release)}
                        className="p-2 bg-void-950 border border-void-800 text-technical-silver hover:text-white"
                        title="Редактировать"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Удалить "${release.title}" из архива?`)) {
                            deleteRelease(release.id);
                          }
                        }}
                        className="p-2 bg-void-950 border border-void-800 text-technical-muted hover:text-signal-red"
                        title="Удалить"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 02. TAB: SIGNALS (AUDIENCE COMMENTS) */}
        {/* ========================================================= */}
        {currentTab === 'signals' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-void-800">
              <div className="flex items-center space-x-2 text-xs">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSignalFilter(st)}
                    className={`px-3 py-1.5 border transition-all ${
                      signalFilter === st
                        ? 'border-signal-red bg-signal-red text-white font-bold'
                        : 'border-void-800 bg-void-900 text-technical-muted hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-technical-muted">
                ВСЕГО В БАЗЕ: {signals.length}
              </div>
            </div>

            {signals
              .filter((s) => signalFilter === 'ALL' || s.status === signalFilter)
              .length === 0 ? (
              <div className="p-8 text-center text-xs text-technical-muted border border-void-800 bg-void-900/40">
                НЕТ СИГНАЛОВ ПО ВЫБРАННОМУ ФИЛЬТРУ
              </div>
            ) : (
              <div className="space-y-3">
                {signals
                  .filter((s) => signalFilter === 'ALL' || s.status === signalFilter)
                  .map((sig) => {
                    const relatedRel = releases.find((r) => r.id === sig.releaseId);

                    return (
                      <div
                        key={sig.id}
                        className="p-4 bg-void-900 border border-void-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2 text-[10px]">
                            <span className="text-signal-red font-bold">@{sig.username}</span>
                            <span className="text-void-700">•</span>
                            <span className="text-white font-bold">
                              РЕЛИЗ: {relatedRel?.title || sig.releaseId}
                            </span>
                            <span className="text-void-700">•</span>
                            <span className="text-technical-muted">{sig.createdAt}</span>
                            <span className="px-1.5 py-0.2 bg-void-950 border border-void-700 text-technical-silver font-bold">
                              {sig.status}
                            </span>
                          </div>
                          <p className="text-xs text-technical-silver">"{sig.content}"</p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          {sig.status !== 'APPROVED' && (
                            <button
                              onClick={() => updateSignalStatus(sig.id, 'APPROVED')}
                              className="px-3 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white text-[10px] font-bold uppercase transition-all"
                            >
                              APPROVE
                            </button>
                          )}
                          {sig.status !== 'REJECTED' && (
                            <button
                              onClick={() => updateSignalStatus(sig.id, 'REJECTED')}
                              className="px-3 py-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-[10px] uppercase transition-all"
                            >
                              REJECT
                            </button>
                          )}
                          <button
                            onClick={() => deleteSignal(sig.id)}
                            className="p-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-muted hover:text-signal-red"
                            title="Удалить"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 03. TAB: TRACES (THE TRACE WALL) */}
        {/* ========================================================= */}
        {currentTab === 'traces' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-void-800">
              <div className="flex items-center space-x-2 text-xs">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setTraceFilter(st)}
                    className={`px-3 py-1.5 border transition-all ${
                      traceFilter === st
                        ? 'border-signal-red bg-signal-red text-white font-bold'
                        : 'border-void-800 bg-void-900 text-technical-muted hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-technical-muted">
                ВСЕГО СЛЕДОВ: {traces.length}
              </div>
            </div>

            {traces
              .filter((t) => traceFilter === 'ALL' || t.status === traceFilter)
              .length === 0 ? (
              <div className="p-8 text-center text-xs text-technical-muted border border-void-800 bg-void-900/40">
                НЕТ СЛЕДОВ ПО ВЫБРАННОМУ ФИЛЬТРУ
              </div>
            ) : (
              <div className="space-y-3">
                {traces
                  .filter((t) => traceFilter === 'ALL' || t.status === traceFilter)
                  .map((trace) => (
                    <div
                      key={trace.id}
                      className="p-4 bg-void-900 border border-void-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="text-signal-red font-bold">{trace.id}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-white font-bold">@{trace.username}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-technical-muted">{trace.createdAt}</span>
                          <span className="px-1.5 py-0.2 bg-void-950 border border-void-700 text-technical-silver font-bold">
                            {trace.status}
                          </span>
                        </div>
                        <p className="text-xs text-technical-silver">"{trace.content}"</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {trace.status !== 'APPROVED' && (
                          <button
                            onClick={() => updateTraceStatus(trace.id, 'APPROVED')}
                            className="px-3 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white text-[10px] font-bold uppercase transition-all"
                          >
                            APPROVE
                          </button>
                        )}
                        {trace.status !== 'REJECTED' && (
                          <button
                            onClick={() => updateTraceStatus(trace.id, 'REJECTED')}
                            className="px-3 py-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-[10px] uppercase transition-all"
                          >
                            REJECT
                          </button>
                        )}
                        <button
                          onClick={() => deleteTrace(trace.id)}
                          className="p-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-muted hover:text-signal-red"
                          title="Удалить"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 04. TAB: SIGNATURES */}
        {/* ========================================================= */}
        {currentTab === 'signatures' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-void-800">
              <div className="flex items-center space-x-2 text-xs">
                {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSigFilter(st)}
                    className={`px-3 py-1.5 border transition-all ${
                      sigFilter === st
                        ? 'border-signal-red bg-signal-red text-white font-bold'
                        : 'border-void-800 bg-void-900 text-technical-muted hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-technical-muted">
                ВСЕГО ПОДПИСЕЙ: {signatures.length}
              </div>
            </div>

            {signatures
              .filter((s) => sigFilter === 'ALL' || s.status === sigFilter)
              .length === 0 ? (
              <div className="p-8 text-center text-xs text-technical-muted border border-void-800 bg-void-900/40">
                НЕТ ПОДПИСЕЙ ПО ВЫБРАННОМУ ФИЛЬТРУ
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {signatures
                  .filter((s) => sigFilter === 'ALL' || s.status === sigFilter)
                  .map((sig) => (
                    <div
                      key={sig.id}
                      className="p-4 bg-void-900 border border-void-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 font-mono">
                        <div className="text-xs font-bold text-white">@{sig.username}</div>
                        {sig.phrase && <div className="text-[11px] text-technical-silver italic">"{sig.phrase}"</div>}
                        <div className="text-[9px] text-technical-muted">
                          SEED: {sig.seed} // STATUS: {sig.status}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {sig.status !== 'APPROVED' && (
                          <button
                            onClick={() => updateSignatureStatus(sig.id, 'APPROVED')}
                            className="px-2.5 py-1 bg-signal-red text-white text-[10px] font-bold"
                          >
                            APPROVE
                          </button>
                        )}
                        {sig.status !== 'REJECTED' && (
                          <button
                            onClick={() => updateSignatureStatus(sig.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-void-950 border border-void-800 text-technical-silver text-[10px]"
                          >
                            REJECT
                          </button>
                        )}
                        <button
                          onClick={() => deleteSignature(sig.id)}
                          className="p-1 text-technical-muted hover:text-signal-red"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 05. TAB: TRANSMISSIONS */}
        {/* ========================================================= */}
        {currentTab === 'transmissions' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-void-800">
              <div className="flex items-center space-x-2 text-xs">
                {(['ALL', 'NEW', 'READ', 'ARCHIVED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setTransFilter(st)}
                    className={`px-3 py-1.5 border transition-all ${
                      transFilter === st
                        ? 'border-signal-red bg-signal-red text-white font-bold'
                        : 'border-void-800 bg-void-900 text-technical-muted hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-technical-muted">
                ВСЕГО ПЕРЕДАЧ: {transmissions.length}
              </div>
            </div>

            {transmissions
              .filter((t) => transFilter === 'ALL' || t.status === transFilter)
              .length === 0 ? (
              <div className="p-8 text-center text-xs text-technical-muted border border-void-800 bg-void-900/40">
                НЕТ ПЕРЕДАЧ В ЭТОЙ КАТЕГОРИИ
              </div>
            ) : (
              <div className="space-y-3">
                {transmissions
                  .filter((t) => transFilter === 'ALL' || t.status === transFilter)
                  .map((trn) => (
                    <div
                      key={trn.id}
                      className="p-4 bg-void-900 border border-void-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="text-signal-red font-bold">{trn.id}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-white font-bold">{trn.username}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-[#229ED9] font-mono">{trn.contact}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-technical-muted">{trn.createdAt}</span>
                        </div>
                        <div className="text-xs text-white font-bold">ТЕМА: {trn.subject}</div>
                        <p className="text-xs text-technical-silver leading-relaxed">
                          "{trn.message}"
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {trn.status === 'NEW' && (
                          <button
                            onClick={() => updateTransmissionStatus(trn.id, 'READ')}
                            className="px-3 py-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-[10px] font-bold"
                          >
                            MARK READ
                          </button>
                        )}
                        {trn.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => updateTransmissionStatus(trn.id, 'ARCHIVED')}
                            className="px-3 py-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-muted text-[10px]"
                          >
                            ARCHIVE
                          </button>
                        )}
                        <button
                          onClick={() => deleteTransmission(trn.id)}
                          className="p-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-muted hover:text-signal-red"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 06. TAB: COLLABORATIONS & AUDIO PLAYER */}
        {/* ========================================================= */}
        {currentTab === 'collabs' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-void-800">
              <div className="flex items-center space-x-2 text-xs">
                {(['ALL', 'NEW', 'LISTENED', 'ACCEPTED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setCollabFilter(st)}
                    className={`px-3 py-1.5 border transition-all ${
                      collabFilter === st
                        ? 'border-signal-red bg-signal-red text-white font-bold'
                        : 'border-void-800 bg-void-900 text-technical-muted hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="text-xs text-technical-muted">
                ВСЕГО ДЕМО-ЗАЯВОК: {collabs.length}
              </div>
            </div>

            {collabs
              .filter((c) => collabFilter === 'ALL' || c.status === collabFilter)
              .length === 0 ? (
              <div className="p-8 text-center text-xs text-technical-muted border border-void-800 bg-void-900/40">
                НЕТ ДЕМО-ЗАЯВОК В ЭТОЙ КАТЕГОРИИ
              </div>
            ) : (
              <div className="space-y-4">
                {collabs
                  .filter((c) => collabFilter === 'ALL' || c.status === collabFilter)
                  .map((collab) => (
                    <div
                      key={collab.id}
                      className="p-5 bg-void-900 border border-void-800 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-void-800 pb-2.5">
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="text-signal-red font-bold">{collab.id}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-white font-bold uppercase">[{collab.type}]</span>
                          <span className="text-void-700">•</span>
                          <span className="text-technical-silver font-bold">@{collab.username}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-[#229ED9]">{collab.contact}</span>
                          <span className="text-void-700">•</span>
                          <span className="text-technical-muted">{collab.createdAt}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-void-950 border border-void-700 text-[9px] text-signal-red font-bold">
                          {collab.status}
                        </span>
                      </div>

                      <div className="text-xs text-technical-silver">
                        <strong>КОНЦЕПТ:</strong> {collab.message}
                      </div>

                      {/* Built-in Audio Player preview */}
                      <div className="p-3 bg-void-950 border border-void-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-2 text-xs font-mono text-white">
                          <Music2 size={15} className="text-signal-red" />
                          <span>{collab.audioFileName}</span>
                          <span className="text-[10px] text-technical-muted">
                            ({(collab.audioFileSize / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>

                        {collab.audioFileUrl && (
                          <audio
                            controls
                            src={collab.audioFileUrl}
                            className="w-full sm:w-80 h-9"
                            onPlay={() => {
                              if (collab.status === 'NEW') {
                                updateCollabStatus(collab.id, 'LISTENED');
                              }
                            }}
                          />
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          onClick={() => updateCollabStatus(collab.id, 'ACCEPTED')}
                          className="px-3 py-1 bg-signal-red hover:bg-signal-red-glow text-white text-[10px] font-bold uppercase"
                        >
                          ACCEPT
                        </button>
                        <button
                          onClick={() => updateCollabStatus(collab.id, 'REJECTED')}
                          className="px-3 py-1 bg-void-950 border border-void-800 text-technical-muted text-[10px] uppercase"
                        >
                          REJECT
                        </button>
                        <button
                          onClick={() => deleteCollab(collab.id)}
                          className="p-1 text-technical-muted hover:text-signal-red"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 07. TAB: MEMBERS / USERS */}
        {/* ========================================================= */}
        {currentTab === 'members' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-void-800">
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Поиск по имени @username или email..."
                className="px-3 py-2 bg-void-900 border border-void-800 text-xs w-72 text-white placeholder:text-technical-muted/50"
              />
              <div className="text-xs text-technical-muted">
                ВСЕГО УЧАСТНИКОВ: {users.length}
              </div>
            </div>

            <div className="space-y-2">
              {users
                .filter(
                  (u) =>
                    !userSearchQuery.trim() ||
                    u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                )
                .map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 bg-void-900 border border-void-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">
                        @{u.username}{' '}
                        <span className="text-signal-red text-[10px] font-mono">[{u.nodeNumber}]</span>
                      </div>
                      <div className="text-[10px] text-technical-muted">
                        EMAIL: {u.email} // ROLE: {u.role} // SINCE: {u.createdAt}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[9px] font-bold ${
                        u.status === 'ACTIVE' ? 'bg-signal-red/20 text-signal-red' : 'bg-void-950 text-technical-muted'
                      }`}>
                        {u.status}
                      </span>
                      {u.status === 'ACTIVE' ? (
                        <button
                          onClick={() => blockUser(u.id)}
                          className="px-2.5 py-1 bg-void-950 border border-void-800 hover:border-signal-red text-signal-red text-[10px] font-bold"
                        >
                          BLOCK
                        </button>
                      ) : (
                        <button
                          onClick={() => unblockUser(u.id)}
                          className="px-2.5 py-1 bg-void-950 border border-void-800 hover:border-white text-white text-[10px] font-bold"
                        >
                          UNBLOCK
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 08. TAB: AUDIT LOG */}
        {/* ========================================================= */}
        {currentTab === 'audit' && (
          <div className="space-y-4">
            <div className="text-xs text-technical-muted pb-2 border-b border-void-800 flex justify-between">
              <span>ХРОНОЛОГИЯ МОДЕРАЦИИ // AUDIT TRAIL</span>
              <span>{auditLogs.length} ЗАПИСЕЙ</span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-technical-muted border border-void-800 bg-void-900/40">
                ЖУРНАЛ АУДИТА ПУСТ
              </div>
            ) : (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-void-900 border border-void-800/80 text-[11px] font-mono flex items-center justify-between"
                  >
                    <div>
                      <span className="text-signal-red font-bold">{log.action}</span>
                      <span className="text-void-700 mx-2">•</span>
                      <span className="text-white">TARGET: {log.targetId}</span>
                      {log.details && <span className="text-technical-muted ml-2">({log.details})</span>}
                    </div>
                    <div className="text-[10px] text-technical-muted">
                      {log.moderatorUsername} // {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
