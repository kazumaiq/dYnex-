import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, Edit2, Trash2, Star, Eye, EyeOff, Download,
  Upload, RotateCcw, Save, X, Disc3, ShieldCheck, Check
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';
import { Release } from '../types';

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

  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Form State
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
    soundCloud: '',
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
      soundCloud: '',
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
      soundCloud: r.platforms.soundCloud || '',
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
        soundCloud: formData.soundCloud || undefined,
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
      const ok = importJSON(content);
      if (ok) {
        setImportStatus('Импорт успешно выполнен!');
      } else {
        setImportStatus('Ошибка валидации JSON файла');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-void-950/98 backdrop-blur-2xl overflow-y-auto p-4 sm:p-8 font-mono select-none"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-void-800 pb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2.5 bg-void-900 hover:bg-void-850 border border-void-800 rounded-sm text-technical-light hover:text-signal-red transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="text-xs text-signal-red tracking-widest uppercase mb-0.5">
                // SYSTEM CONTROL TERMINAL
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-sans text-white">
                {language === 'ru' ? 'УПРАВЛЕНИЕ АРХИВОМ 3D' : '3D ARCHIVE MANAGEMENT'}
              </h1>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleStartAdd}
              className="px-4 py-2 bg-signal-red hover:bg-signal-red-glow text-white text-xs tracking-widest uppercase rounded-sm flex items-center space-x-2 transition-colors"
            >
              <Plus size={14} />
              <span>{language === 'ru' ? 'ДОБАВИТЬ РЕЛИЗ' : 'ADD RELEASE'}</span>
            </button>

            <button
              onClick={handleExport}
              className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-silver text-xs rounded-sm flex items-center space-x-1.5 transition-colors"
            >
              {copiedStatus ? <Check size={14} className="text-signal-red" /> : <Download size={14} />}
              <span>{copiedStatus ? 'СКОПИРОВАНО' : 'EXPORT JSON'}</span>
            </button>

            <label className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-silver text-xs rounded-sm flex items-center space-x-1.5 transition-colors cursor-pointer">
              <Upload size={14} />
              <span>IMPORT JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              onClick={resetToVerified}
              className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-muted hover:text-white text-xs rounded-sm flex items-center space-x-1.5 transition-colors"
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
            className="p-6 bg-void-900 border border-signal-red/60 rounded-sm space-y-6"
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
                <label className="block text-technical-muted mb-1">ДАТА РЕЛИЗА / DATE (YYYY-MM-DD)</label>
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
                <label className="block text-technical-muted mb-1">URL ОБЛОЖКИ / ARTWORK URL (HTTPS)</label>
                <input
                  type="url"
                  value={formData.artworkUrl}
                  onChange={(e) => setFormData({ ...formData, artworkUrl: e.target.value })}
                  placeholder="https://is1-ssl.mzstatic.com/..."
                  className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                />
              </div>

              <div>
                <label className="block text-technical-muted mb-1">КОЛ-ВО ТРЕКОВ / TRACK COUNT</label>
                <input
                  type="number"
                  min="1"
                  value={formData.trackCount}
                  onChange={(e) => setFormData({ ...formData, trackCount: Number(e.target.value) })}
                  className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                />
              </div>

              <div>
                <label className="block text-technical-muted mb-1">APPLE MUSIC LINK</label>
                <input
                  type="url"
                  value={formData.appleMusic}
                  onChange={(e) => setFormData({ ...formData, appleMusic: e.target.value })}
                  className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                />
              </div>

              <div>
                <label className="block text-technical-muted mb-1">SPOTIFY LINK</label>
                <input
                  type="url"
                  value={formData.spotify}
                  onChange={(e) => setFormData({ ...formData, spotify: e.target.value })}
                  className="w-full bg-void-950 border border-void-800 p-2.5 text-white focus:outline-none focus:border-signal-red"
                />
              </div>

              <div>
                <label className="block text-technical-muted mb-1">VK MUSIC LINK</label>
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
                className="px-4 py-2 bg-void-950 border border-void-800 text-technical-muted hover:text-white rounded-sm"
              >
                ОТМЕНА
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-signal-red hover:bg-signal-red-glow text-white tracking-widest uppercase rounded-sm flex items-center space-x-2"
              >
                <Save size={14} />
                <span>СОХРАНИТЬ В 3D МИР</span>
              </button>
            </div>
          </form>
        )}

        {/* Catalog Table */}
        <div className="bg-void-900/80 border border-void-800 rounded-sm overflow-hidden">
          <div className="p-4 border-b border-void-800 flex justify-between items-center text-xs text-technical-muted uppercase">
            <span>ВСЕГО В КАТАЛОГЕ: {releases.length} РЕЛИЗОВ</span>
            <span className="text-signal-red">3D SYNC // ОНЛАЙН</span>
          </div>

          <div className="divide-y divide-void-800 max-h-[650px] overflow-y-auto">
            {releases.map((release) => (
              <div
                key={release.id}
                className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                  release.featured
                    ? 'bg-signal-red/10 border-l-4 border-signal-red'
                    : 'hover:bg-void-850'
                }`}
              >
                {/* Artwork & Info */}
                <div className="flex items-center space-x-4 min-w-0">
                  <img
                    src={release.artworkUrl}
                    alt={release.title}
                    className="w-12 h-12 rounded-sm object-cover border border-void-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white truncate">
                        {release.title}
                      </span>
                      {release.featured && (
                        <span className="bg-signal-red text-white text-[9px] px-1.5 py-0.2 rounded-sm">
                          FEATURED
                        </span>
                      )}
                      {release.published === false && (
                        <span className="bg-void-800 text-technical-muted text-[9px] px-1.5 py-0.2 rounded-sm">
                          СКРЫТ
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-technical-muted truncate">
                      {release.artists} // {release.year} // {release.genre}
                    </div>
                  </div>
                </div>

                {/* Operations */}
                <div className="flex items-center space-x-2 shrink-0">
                  {/* Feature toggle */}
                  <button
                    onClick={() => toggleFeatured(release.id)}
                    className={`p-2 rounded-sm border transition-colors ${
                      release.featured
                        ? 'bg-signal-red border-signal-red text-white'
                        : 'bg-void-950 border-void-800 text-technical-muted hover:text-white'
                    }`}
                    title="Сделать главным релизом в Hero"
                  >
                    <Star size={14} />
                  </button>

                  {/* Publish/Unpublish toggle */}
                  <button
                    onClick={() => togglePublish(release.id)}
                    className={`p-2 rounded-sm border transition-colors ${
                      release.published !== false
                        ? 'bg-void-950 border-void-800 text-technical-silver hover:text-white'
                        : 'bg-void-950 border-void-800 text-technical-muted'
                    }`}
                    title={release.published !== false ? 'Скрыть из 3D мира' : 'Показать в 3D мире'}
                  >
                    {release.published !== false ? <Eye size={14} /> : <EyeOff size={14} className="text-signal-red" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleStartEdit(release)}
                    className="p-2 bg-void-950 border border-void-800 text-technical-silver hover:text-white rounded-sm transition-colors"
                    title="Редактировать релиз"
                  >
                    <Edit2 size={14} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => {
                      if (confirm(`Удалить "${release.title}" из архива?`)) {
                        deleteRelease(release.id);
                      }
                    }}
                    className="p-2 bg-void-950 border border-void-800 text-technical-muted hover:text-signal-red rounded-sm transition-colors"
                    title="Удалить релиз"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
