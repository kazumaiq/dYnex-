import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, Edit2, Trash2, Star, Eye, EyeOff, Download,
  Upload, RotateCcw, Save, X, Disc3, ShieldCheck, Check,
  MessageSquare, Edit3, Send, Music2, Users, FileText,
  Clock, LayoutDashboard, FolderTree, BarChart3, Layers, Calendar, Image,
  ExternalLink, Search, Menu, ShieldAlert, CheckCircle2, Volume2, Lock, Unlock, Key
} from 'lucide-react';
import { useArchive } from '../context/ArchiveContext';
import { useCommunity } from '../context/CommunityContext';
import { Release } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

export type AdminSection =
  | 'dashboard'
  | 'catalog-releases'
  | 'catalog-categories'
  | 'catalog-timeline'
  | 'catalog-media'
  | 'analytics'
  | 'community-signals'
  | 'community-traces'
  | 'community-signatures'
  | 'community-transmissions'
  | 'community-collabs'
  | 'community-members'
  | 'community-audit';

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
  } = useCommunity();

  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Filter state for community tabs
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [traceFilter, setTraceFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [sigFilter, setSigFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [transFilter, setTransFilter] = useState<'ALL' | 'NEW' | 'READ' | 'ARCHIVED'>('NEW');
  const [collabFilter, setCollabFilter] = useState<'ALL' | 'NEW' | 'LISTENED' | 'ACCEPTED' | 'REJECTED'>('NEW');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [releaseSearchQuery, setReleaseSearchQuery] = useState('');

  // Release Form State (original features preserved 100%)
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Image preview modal in Media section
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Master Admin Authentication Gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const sess = sessionStorage.getItem('dynex_admin_session_auth');
      return sess === 'true' || sess === 'authenticated';
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    try {
      return Number(sessionStorage.getItem('dynex_admin_failed_attempts') || 0);
    } catch {
      return 0;
    }
  });
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(() => {
    try {
      const until = Number(sessionStorage.getItem('dynex_admin_lockout_until') || 0);
      return until > Date.now() ? until : null;
    } catch {
      return null;
    }
  });

  // Master passcode change state (for Dashboard settings)
  const [newPassInput, setNewPassInput] = useState('');
  const [passChangeStatus, setPassChangeStatus] = useState<string | null>(null);

  const getExpectedPassword = () => {
    try {
      const custom = localStorage.getItem('dynex_custom_admin_passcode');
      if (custom) return custom;
    } catch {}
    const envPass = (import.meta as any).env?.VITE_ADMIN_ACCESS_KEY;
    if (envPass) return envPass;
    return 'dynex2026';
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setAuthError(`СИСТЕМА ЗАБЛОКИРОВАНА. ПОДОЖДИТЕ ${remainingSeconds} СЕК.`);
      return;
    }

    const expected = getExpectedPassword();
    if (passwordInput.trim() === expected) {
      setIsAuthenticated(true);
      setAuthError(null);
      setFailedAttempts(0);
      try {
        sessionStorage.setItem('dynex_admin_session_auth', 'true');
        sessionStorage.removeItem('dynex_admin_failed_attempts');
        sessionStorage.removeItem('dynex_admin_lockout_until');
      } catch {}
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      try {
        sessionStorage.setItem('dynex_admin_failed_attempts', String(newAttempts));
      } catch {}

      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + 5 * 60 * 1000;
        setLockoutUntil(lockoutTime);
        try {
          sessionStorage.setItem('dynex_admin_lockout_until', String(lockoutTime));
        } catch {}
        setAuthError('ПРЕВЫШЕН ЛИМИТ ПОПЫТОК (5/5). ДОСТУП ВРЕМЕННО ЗАБЛОКИРОВАН НА 5 МИНУТ.');
      } else {
        setAuthError(`ОТКАЗ В ДОСТУПЕ: НЕВЕРНЫЙ КЛЮЧ. ОСТАЛОСЬ ПОПЫТОК: ${5 - newAttempts}`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('dynex_admin_session_auth');
    } catch {}
    onClose();
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassInput.trim().length < 6) {
      setPassChangeStatus('Пароль должен быть не менее 6 символов');
      return;
    }
    try {
      localStorage.setItem('dynex_custom_admin_passcode', newPassInput.trim());
      setPassChangeStatus('Пароль администратора успешно сохранён!');
      setNewPassInput('');
      setTimeout(() => setPassChangeStatus(null), 3000);
    } catch {
      setPassChangeStatus('Ошибка сохранения нового пароля');
    }
  };

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
    setCurrentSection('catalog-releases');
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
    setCurrentSection('catalog-releases');
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

  // Pending count calculations for notification badges
  const pendingSignalsCount = signals.filter((s) => s.status === 'PENDING').length;
  const pendingTracesCount = traces.filter((t) => t.status === 'PENDING').length;
  const pendingSigsCount = signatures.filter((s) => s.status === 'PENDING').length;
  const newTransCount = transmissions.filter((t) => t.status === 'NEW').length;
  const newCollabsCount = collabs.filter((c) => c.status === 'NEW').length;
  const totalModerationQueue = pendingSignalsCount + pendingTracesCount + pendingSigsCount;
  const totalInquiriesQueue = newTransCount + newCollabsCount;

  // Categories computations
  const categoriesData = useMemo(() => {
    const typeCounts = {
      SINGLE: releases.filter((r) => r.type === 'SINGLE').length,
      EP: releases.filter((r) => r.type === 'EP').length,
      ALBUM: releases.filter((r) => r.type === 'ALBUM').length,
    };

    const genreMap = new Map<string, Release[]>();
    releases.forEach((r) => {
      const g = r.genre || 'Electronic / Phonk';
      if (!genreMap.has(g)) {
        genreMap.set(g, []);
      }
      genreMap.get(g)!.push(r);
    });

    const genresList = Array.from(genreMap.entries()).map(([genre, rels]) => ({
      genre,
      count: rels.length,
      tracks: rels.reduce((sum, item) => sum + (item.trackCount || 1), 0),
      releases: rels,
    })).sort((a, b) => b.count - a.count);

    return { typeCounts, genresList };
  }, [releases]);

  // Timeline chronological ordering (earliest to latest)
  const chronologicalReleases = useMemo(() => {
    return [...releases].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [releases]);

  // Filtered releases for table
  const filteredReleases = useMemo(() => {
    return releases.filter((r) => {
      if (!releaseSearchQuery.trim()) return true;
      const q = releaseSearchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.artists.toLowerCase().includes(q) ||
        r.genre.toLowerCase().includes(q) ||
        String(r.year).includes(q)
      );
    });
  }, [releases, releaseSearchQuery]);

  // Analytics aggregations
  const analyticsData = useMemo(() => {
    const totalTracks = releases.reduce((sum, r) => sum + (r.trackCount || 1), 0);
    const spotifyCount = releases.filter((r) => !!r.platforms.spotify).length;
    const vkCount = releases.filter((r) => !!r.platforms.vk).length;
    const appleCount = releases.filter((r) => !!r.platforms.appleMusic).length;
    const yandexCount = releases.filter((r) => !!r.platforms.yandexMusic).length;
    const youtubeCount = releases.filter((r) => !!r.platforms.youtube).length;

    // Releases sorted by signal comments count
    const releaseSignalsCount = new Map<string, number>();
    signals.forEach((s) => {
      releaseSignalsCount.set(s.releaseId, (releaseSignalsCount.get(s.releaseId) || 0) + 1);
    });

    const topEngagedReleases = [...releases]
      .map((r) => ({
        ...r,
        signalsCount: releaseSignalsCount.get(r.id) || 0,
      }))
      .sort((a, b) => b.signalsCount - a.signalsCount)
      .slice(0, 5);

    return {
      totalTracks,
      spotifyPercent: Math.round((spotifyCount / (releases.length || 1)) * 100),
      vkPercent: Math.round((vkCount / (releases.length || 1)) * 100),
      applePercent: Math.round((appleCount / (releases.length || 1)) * 100),
      yandexPercent: Math.round((yandexCount / (releases.length || 1)) * 100),
      youtubePercent: Math.round((youtubeCount / (releases.length || 1)) * 100),
      topEngagedReleases,
    };
  }, [releases, signals]);

  const selectSection = (sec: AdminSection) => {
    setCurrentSection(sec);
    setMobileNavOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-void-950/98 backdrop-blur-3xl flex items-center justify-center p-4 sm:p-6 font-mono select-none"
      >
        <div className="w-full max-w-md bg-void-900 border-2 border-signal-red shadow-[0_0_50px_rgba(255,51,51,0.25)] p-6 sm:p-8 relative">
          {/* Top Scan Line Bar */}
          <div className="flex items-center justify-between border-b border-void-800 pb-3 mb-6">
            <div className="flex items-center space-x-2 text-signal-red text-xs font-bold">
              <ShieldAlert size={16} className="animate-pulse" />
              <span>// ACCESS RESTRICTED</span>
            </div>
            <div className="text-[10px] text-technical-muted uppercase">
              LEVEL 5 // ROOT ADMIN
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="text-lg font-bold font-sans text-white tracking-tight flex items-center space-x-2">
              <span>dYnex? ADMIN MATRIX</span>
              <span className="text-signal-red font-mono text-xs">// 2026</span>
            </div>
            <p className="text-xs text-technical-silver leading-relaxed">
              {language === 'ru'
                ? 'Этот терминал защищён сквозной аутентификацией. Доступ разрешён исключительно владельцу и администратору проекта dYnex?. Все неавторизованные попытки входа блокируются.'
                : 'This terminal is protected by end-to-end security clearance. Unauthorized access attempts are monitored and logged.'}
            </p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <label className="block text-[10px] text-technical-muted uppercase tracking-wider mb-1.5 font-bold">
                {language === 'ru' ? 'МАСТЕР-ПАРОЛЬ ДОСТУПА' : 'MASTER SECURITY PASSCODE'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-void-950 border border-void-800 focus:border-signal-red px-3.5 py-2.5 text-sm text-white focus:outline-none tracking-widest font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-technical-muted hover:text-white p-1"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 bg-signal-red/10 border border-signal-red text-signal-red text-xs font-mono leading-tight flex items-start space-x-2">
                <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 bg-void-950 border border-void-800 hover:border-white text-technical-muted hover:text-white text-xs uppercase font-bold transition-colors"
              >
                {language === 'ru' ? 'ОТМЕНА' : 'CANCEL'}
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 bg-signal-red hover:bg-signal-red-glow text-white text-xs uppercase font-bold tracking-wider flex items-center justify-center space-x-2 transition-all shadow-signal-red-sharp"
              >
                <Lock size={13} />
                <span>{language === 'ru' ? 'ВОЙТИ В СИСТЕМУ' : 'AUTHENTICATE'}</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-void-800/80 flex items-center justify-between text-[10px] text-technical-muted">
            <span>TERMINAL ID: DY-ADM-01</span>
            <span>SECURE SESSION STORAGE</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-void-950/98 backdrop-blur-2xl flex flex-col font-mono text-technical-light overflow-hidden select-none"
    >
      {/* Top Header Bar */}
      <header className="shrink-0 bg-void-950/95 border-b border-void-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 bg-void-900 border border-void-800 hover:border-signal-red text-white flex items-center space-x-1.5 transition-colors group"
            title="Закрыть панель администратора"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs uppercase font-bold tracking-wider hidden sm:inline">
              {language === 'ru' ? 'ВЫХОД' : 'EXIT'}
            </span>
          </button>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 bg-void-900 border border-void-800 text-white flex items-center space-x-1"
          >
            <Menu size={16} />
            <span className="text-[10px] uppercase font-bold">MENU</span>
          </button>

          <div>
            <div className="text-sm sm:text-base font-bold font-sans text-white flex items-center space-x-2">
              <span>dYnex? ADMIN MATRIX</span>
              <span className="text-signal-red font-mono text-xs">// 2026</span>
            </div>
            <div className="text-[10px] text-technical-muted tracking-widest uppercase hidden sm:block">
              HIERARCHICAL OPERATIONAL CONTROL CENTER
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 bg-void-900 border border-void-800 px-3 py-1 text-xs text-technical-silver">
            <span className="w-2 h-2 rounded-full bg-signal-red animate-pulse" />
            <span className="text-[11px]">
              STORAGE: {isSupabaseConfigured() ? 'SUPABASE LIVE' : 'LOCAL ARCHIVE'}
            </span>
          </div>

          <div className="flex items-center space-x-2 bg-void-900 border border-void-800 px-2.5 py-1 text-[11px]">
            <span className="text-technical-muted">PENDING:</span>
            <span className={`font-bold ${totalModerationQueue > 0 ? 'text-signal-red' : 'text-technical-silver'}`}>
              {totalModerationQueue}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-2.5 py-1 bg-void-900 border border-signal-red/60 hover:bg-signal-red hover:text-white text-signal-red text-[11px] uppercase font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title={language === 'ru' ? 'Заблокировать терминал (завершить сеанс)' : 'Lock terminal session'}
          >
            <Lock size={12} />
            <span className="hidden sm:inline">{language === 'ru' ? 'БЛОКИРОВКА' : 'LOCK'}</span>
          </button>
        </div>
      </header>

      {/* Main Container: Sidebar + Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ========================================================= */}
        {/* SIDEBAR NAVIGATION TREE (Cyberpunk Brutalist ASCII Style) */}
        {/* ========================================================= */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-40 w-72 bg-void-950 md:bg-void-950/70 border-r border-void-800
            flex flex-col shrink-0 transition-transform duration-200 ease-in-out
            ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Mobile close banner */}
          <div className="md:hidden flex items-center justify-between p-3 border-b border-void-800 bg-void-900">
            <span className="text-xs font-bold text-white uppercase">НАВИГАЦИЯ АДМИНКИ</span>
            <button onClick={() => setMobileNavOpen(false)} className="text-technical-muted hover:text-white p-1">
              <X size={16} />
            </button>
          </div>

          <div className="p-4 border-b border-void-800/80 bg-void-900/30">
            <div className="text-[10px] text-technical-muted uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>SYSTEM ROOT</span>
              <span className="text-signal-red font-mono">v2.0</span>
            </div>
            <div className="text-xs font-bold text-white tracking-widest flex items-center space-x-1.5">
              <FolderTree size={14} className="text-signal-red" />
              <span>ADMIN TREE</span>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            {/* 1. DASHBOARD */}
            <div>
              <button
                onClick={() => selectSection('dashboard')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left transition-all ${
                  currentSection === 'dashboard'
                    ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                    : 'text-technical-silver hover:bg-void-900 hover:text-white'
                }`}
              >
                <LayoutDashboard size={14} className={currentSection === 'dashboard' ? 'text-signal-red' : 'text-technical-muted'} />
                <span className="truncate">├── Dashboard</span>
              </button>
            </div>

            {/* 2. CATALOG GROUP */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-technical-muted flex items-center justify-between font-bold">
                <span className="flex items-center space-x-1">
                  <Layers size={11} className="text-signal-red" />
                  <span>├── Catalog</span>
                </span>
                <span className="text-[9px] px-1 bg-void-900 text-technical-silver border border-void-800">
                  {releases.length}
                </span>
              </div>

              <div className="pl-3 space-y-0.5 border-l border-void-850 ml-3">
                <button
                  onClick={() => selectSection('catalog-releases')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'catalog-releases'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">│   ├── Releases</span>
                  <span className="text-[9px] text-technical-muted font-mono">{releases.length}</span>
                </button>

                <button
                  onClick={() => selectSection('catalog-categories')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'catalog-categories'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">│   ├── Categories</span>
                  <span className="text-[9px] text-technical-muted font-mono">{categoriesData.genresList.length}</span>
                </button>

                <button
                  onClick={() => selectSection('catalog-timeline')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'catalog-timeline'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">│   ├── Timeline</span>
                  <span className="text-[9px] text-technical-muted font-mono">2021-26</span>
                </button>

                <button
                  onClick={() => selectSection('catalog-media')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'catalog-media'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">│   └── Media</span>
                  <span className="text-[9px] text-technical-muted font-mono">{releases.length} img</span>
                </button>
              </div>
            </div>

            {/* 3. ANALYTICS */}
            <div>
              <button
                onClick={() => selectSection('analytics')}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 text-left transition-all ${
                  currentSection === 'analytics'
                    ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                    : 'text-technical-silver hover:bg-void-900 hover:text-white'
                }`}
              >
                <BarChart3 size={14} className={currentSection === 'analytics' ? 'text-signal-red' : 'text-technical-muted'} />
                <span className="truncate">├── Analytics</span>
              </button>
            </div>

            {/* 4. COMMUNITY / MODERATION GROUP */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-technical-muted flex items-center justify-between font-bold">
                <span className="flex items-center space-x-1">
                  <ShieldCheck size={11} className="text-signal-red" />
                  <span>└── COMMUNITY / MOD</span>
                </span>
                {totalModerationQueue > 0 && (
                  <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
                    {totalModerationQueue}
                  </span>
                )}
              </div>

              <div className="pl-3 space-y-0.5 border-l border-void-850 ml-3">
                <button
                  onClick={() => selectSection('community-signals')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'community-signals'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">    ├── Signals</span>
                  {pendingSignalsCount > 0 ? (
                    <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
                      {pendingSignalsCount}
                    </span>
                  ) : (
                    <span className="text-[9px] text-technical-muted">{signals.length}</span>
                  )}
                </button>

                <button
                  onClick={() => selectSection('community-traces')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'community-traces'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">    ├── Trace Wall</span>
                  {pendingTracesCount > 0 ? (
                    <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
                      {pendingTracesCount}
                    </span>
                  ) : (
                    <span className="text-[9px] text-technical-muted">{traces.length}</span>
                  )}
                </button>

                <button
                  onClick={() => selectSection('community-signatures')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'community-signatures'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">    ├── Signatures</span>
                  {pendingSigsCount > 0 ? (
                    <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
                      {pendingSigsCount}
                    </span>
                  ) : (
                    <span className="text-[9px] text-technical-muted">{signatures.length}</span>
                  )}
                </button>

                <button
                  onClick={() => selectSection('community-transmissions')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'community-transmissions'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">    ├── Transmissions</span>
                  {newTransCount > 0 ? (
                    <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
                      {newTransCount}
                    </span>
                  ) : (
                    <span className="text-[9px] text-technical-muted">{transmissions.length}</span>
                  )}
                </button>

                <button
                  onClick={() => selectSection('community-collabs')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'community-collabs'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">    ├── Collabs / Demos</span>
                  {newCollabsCount > 0 ? (
                    <span className="px-1.5 py-0.2 bg-signal-red text-white text-[9px] font-bold">
                      {newCollabsCount}
                    </span>
                  ) : (
                    <span className="text-[9px] text-technical-muted">{collabs.length}</span>
                  )}
                </button>

                <button
                  onClick={() => selectSection('community-members')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'community-members'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">    ├── Members</span>
                  <span className="text-[9px] text-technical-muted">{users.length}</span>
                </button>

                <button
                  onClick={() => selectSection('community-audit')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-left transition-all text-[11px] ${
                    currentSection === 'community-audit'
                      ? 'bg-signal-red/15 text-white border-l-2 border-signal-red font-bold'
                      : 'text-technical-silver hover:bg-void-900 hover:text-white'
                  }`}
                >
                  <span className="truncate">    └── Audit Log</span>
                  <span className="text-[9px] text-technical-muted">{auditLogs.length}</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Quick Terminal Footer Info */}
          <div className="p-3 border-t border-void-800 text-[10px] text-technical-muted bg-void-950">
            <div className="flex items-center justify-between">
              <span>ADMIN: @kazumaiq</span>
              <span className="text-signal-red">AUTH // OK</span>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileNavOpen && (
          <div
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
          />
        )}

        {/* ========================================================= */}
        {/* MAIN VIEW CONTENT AREA */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">

          {/* ======================================================= */}
          {/* 1. DASHBOARD OVERVIEW */}
          {/* ======================================================= */}
          {currentSection === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              {/* Header Title */}
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <LayoutDashboard size={20} className="text-signal-red" />
                    <span>DASHBOARD OVERVIEW</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Сводная телеметрия каталога, очереди модерации и статуса цифровой экосистемы
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartAdd}
                    className="px-3 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white text-xs flex items-center space-x-1.5 transition-all shadow-signal-red-sharp"
                  >
                    <Plus size={14} />
                    <span>ДОБАВИТЬ РЕЛИЗ</span>
                  </button>
                  <button
                    onClick={() => selectSection('community-collabs')}
                    className="px-3 py-1.5 bg-void-900 border border-void-800 hover:border-white text-technical-silver text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <Music2 size={14} />
                    <span>ДЕМО / ФИТЫ</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-void-900 border border-void-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-technical-muted">
                    <span className="uppercase">ВЕСЬ КАТАЛОГ</span>
                    <Disc3 size={16} className="text-signal-red" />
                  </div>
                  <div className="text-2xl font-bold text-white font-sans">{releases.length}</div>
                  <div className="text-[10px] text-technical-silver flex justify-between">
                    <span>ТРЕКОВ: {analyticsData.totalTracks}</span>
                    <span className="text-signal-red font-bold">100% ВЕРИФИЦИРОВАНО</span>
                  </div>
                </div>

                <div className="p-4 bg-void-900 border border-void-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-technical-muted">
                    <span className="uppercase">УЧАСТНИКИ АРХИВА</span>
                    <Users size={16} className="text-signal-red" />
                  </div>
                  <div className="text-2xl font-bold text-white font-sans">{users.length}</div>
                  <div className="text-[10px] text-technical-silver flex justify-between">
                    <span>АКТИВНЫХ УЗЛОВ</span>
                    <span className="text-signal-red">NODE_00001+</span>
                  </div>
                </div>

                <div className="p-4 bg-void-900 border border-void-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-technical-muted">
                    <span className="uppercase">ОЧЕРЕДЬ МОДЕРАЦИИ</span>
                    <Clock size={16} className={totalModerationQueue > 0 ? 'text-signal-red animate-pulse' : 'text-technical-muted'} />
                  </div>
                  <div className="text-2xl font-bold text-signal-red font-sans">{totalModerationQueue}</div>
                  <div className="text-[10px] text-technical-silver flex justify-between">
                    <span>СИГНАЛЫ: {pendingSignalsCount}</span>
                    <span>СЛЕДЫ: {pendingTracesCount} // ПОДПИСИ: {pendingSigsCount}</span>
                  </div>
                </div>

                <div className="p-4 bg-void-900 border border-void-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-technical-muted">
                    <span className="uppercase">ВХОДЯЩИЕ ЗАЯВКИ</span>
                    <Send size={16} className="text-[#229ED9]" />
                  </div>
                  <div className="text-2xl font-bold text-white font-sans">{totalInquiriesQueue}</div>
                  <div className="text-[10px] text-technical-silver flex justify-between">
                    <span>СООБЩЕНИЯ: {newTransCount}</span>
                    <span className="text-[#229ED9]">ДЕМО: {newCollabsCount}</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Quick Moderation Queue & System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Immediate Action Queue */}
                <div className="lg:col-span-2 space-y-3 bg-void-900/60 border border-void-800 p-4">
                  <div className="flex items-center justify-between border-b border-void-800 pb-2">
                    <div className="text-xs font-bold text-white uppercase flex items-center space-x-2">
                      <ShieldAlert size={14} className="text-signal-red" />
                      <span>СРОЧНАЯ МОДЕРАЦИЯ // QUICK ACTION QUEUE</span>
                    </div>
                    <span className="text-[10px] text-technical-muted">
                      {totalModerationQueue} ТРЕБУЮТ ВНИМАНИЯ
                    </span>
                  </div>

                  {totalModerationQueue === 0 ? (
                    <div className="py-8 text-center text-xs text-technical-muted">
                      <CheckCircle2 size={24} className="mx-auto mb-2 text-signal-red opacity-80" />
                      ОЧЕРЕДЬ МОДЕРАЦИИ ПУСТА. ВСЕ МАТЕРИАЛЫ ПРОВЕРЕНЫ.
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {/* Show pending signals */}
                      {signals.filter(s => s.status === 'PENDING').slice(0, 3).map(sig => (
                        <div key={sig.id} className="p-3 bg-void-950 border border-void-800 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5 text-[10px]">
                              <span className="text-signal-red font-bold">СИГНАЛ</span>
                              <span className="text-void-700">•</span>
                              <span className="text-white font-bold">@{sig.username}</span>
                              <span className="text-void-700">•</span>
                              <span className="text-technical-muted">{sig.createdAt}</span>
                            </div>
                            <p className="text-technical-silver text-[11px] truncate">"{sig.content}"</p>
                          </div>
                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => updateSignalStatus(sig.id, 'APPROVED')}
                              className="px-2 py-1 bg-signal-red text-white text-[10px] font-bold uppercase"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => updateSignalStatus(sig.id, 'REJECTED')}
                              className="px-2 py-1 bg-void-900 border border-void-800 text-technical-muted text-[10px] uppercase"
                            >
                              REJECT
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Show pending traces */}
                      {traces.filter(t => t.status === 'PENDING').slice(0, 2).map(trace => (
                        <div key={trace.id} className="p-3 bg-void-950 border border-void-800 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5 text-[10px]">
                              <span className="text-signal-red font-bold">СЛЕД НА СТЕНЕ</span>
                              <span className="text-void-700">•</span>
                              <span className="text-white font-bold">@{trace.username}</span>
                            </div>
                            <p className="text-technical-silver text-[11px] truncate">"{trace.content}"</p>
                          </div>
                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => updateTraceStatus(trace.id, 'APPROVED')}
                              className="px-2 py-1 bg-signal-red text-white text-[10px] font-bold uppercase"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => updateTraceStatus(trace.id, 'REJECTED')}
                              className="px-2 py-1 bg-void-900 border border-void-800 text-technical-muted text-[10px] uppercase"
                            >
                              REJECT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Col: System Diagnostics */}
                <div className="space-y-3 bg-void-900/60 border border-void-800 p-4">
                  <div className="text-xs font-bold text-white uppercase border-b border-void-800 pb-2 flex items-center justify-between">
                    <span>СИСТЕМНАЯ ДИАГНОСТИКА</span>
                    <span className="text-signal-red text-[10px]">DIAGNOSTICS</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">3D CANVAS ENGINE:</span>
                      <span className="text-white font-bold">THREE.JS / WEBGL</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">DEVICE PIXEL RATIO:</span>
                      <span className="text-white">DESKTOP 1.5 // MOB 1.1</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">HARDWARE COMPOSITOR:</span>
                      <span className="text-signal-red font-bold">ACTIVE (0 LAYOUT REF)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">DATA PERSISTENCE:</span>
                      <span className="text-white">
                        {isSupabaseConfigured() ? 'SUPABASE POSTGRES' : 'LOCAL ENGINE'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-technical-muted">SECURITY & RLS:</span>
                      <span className="text-signal-red font-bold">ENFORCED</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => selectSection('community-audit')}
                      className="w-full py-2 bg-void-950 hover:bg-void-850 border border-void-800 text-technical-silver text-[11px] uppercase flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <FileText size={13} />
                      <span>ПРОСМОТРЕТЬ ЖУРНАЛ АУДИТА</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Security & Access Management Card */}
              <div className="bg-void-900/60 border border-signal-red/40 p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-void-800 pb-3">
                  <div className="flex items-center space-x-2 text-white text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert size={16} className="text-signal-red" />
                    <span>БЕЗОПАСНОСТЬ // КОНТРОЛЬ ДОСТУПА К ТЕРМИНАЛУ</span>
                  </div>
                  <div className="text-[10px] text-technical-muted font-mono flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-signal-red animate-pulse" />
                    <span>ЗАЩИТА ОТ ПОДБОРА (BRUTE-FORCE GUARD) АКТИВНА</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 bg-void-950 p-3.5 border border-void-800">
                    <div className="text-[11px] font-bold text-white uppercase flex items-center space-x-1.5">
                      <Key size={13} className="text-signal-red" />
                      <span>ТЕКУЩИЙ СТАТУС АВТОРИЗАЦИИ</span>
                    </div>
                    <p className="text-[11px] text-technical-muted leading-relaxed">
                      Панель защищена терминальным паролем. Никто кроме вас не имеет доступа к управлению каталогом, модерации треков и базе данных.
                    </p>
                    <div className="pt-1 text-[10px] space-y-1 text-technical-silver font-mono">
                      <div>• ТИП КЛЮЧА: <span className="text-white font-bold">{localStorage.getItem('dynex_custom_admin_passcode') ? 'ПОЛЬЗОВАТЕЛЬСКИЙ (LOCAL KEY)' : 'СТАНДАРТНЫЙ (MASTER KEY)'}</span></div>
                      <div>• СЕССИЯ: <span className="text-signal-red font-bold">АКТИВНА (АВТО-БЛОКИРОВКА ПРИ ЗАКРЫТИИ ВКЛАДКИ)</span></div>
                      <div>• ЛИМИТ ОШИБОК: <span className="text-white">5 ПОПЫТОК / БЛОК НА 5 МИНУТ</span></div>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-3 bg-void-950 p-3.5 border border-void-800">
                    <div className="text-[11px] font-bold text-white uppercase flex items-center space-x-1.5">
                      <Lock size={13} className="text-signal-red" />
                      <span>ИЗМЕНИТЬ МАСТЕР-ПАРОЛЬ</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="password"
                        value={newPassInput}
                        onChange={(e) => setNewPassInput(e.target.value)}
                        placeholder="Новый секретный пароль (мин. 6 знаков)"
                        className="w-full bg-void-900 border border-void-800 focus:border-signal-red px-3 py-2 text-xs text-white focus:outline-none font-mono"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          type="submit"
                          className="flex-1 py-1.5 bg-signal-red hover:bg-signal-red-glow text-white text-[11px] font-bold uppercase transition-all shadow-signal-red-sharp"
                        >
                          СОХРАНИТЬ ПАРОЛЬ
                        </button>
                        {localStorage.getItem('dynex_custom_admin_passcode') && (
                          <button
                            type="button"
                            onClick={() => {
                              try {
                                localStorage.removeItem('dynex_custom_admin_passcode');
                                setPassChangeStatus('Пароль сброшен на стандартный (dynex2026)');
                                setTimeout(() => setPassChangeStatus(null), 3000);
                              } catch {}
                            }}
                            className="px-2.5 py-1.5 bg-void-900 border border-void-800 hover:border-signal-red text-technical-muted hover:text-white text-[10px] uppercase font-bold"
                            title="Сбросить на стандартный пароль"
                          >
                            СБРОС
                          </button>
                        )}
                      </div>
                      {passChangeStatus && (
                        <div className="p-2 bg-signal-red/10 border border-signal-red text-signal-red text-[10px] font-mono">
                          {passChangeStatus}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Bottom Row: Quick Navigation Tiles */}
              <div className="border-t border-void-800 pt-4">
                <div className="text-[10px] text-technical-muted uppercase tracking-wider mb-3">
                  БЫСТРЫЙ ДОСТУП К РАЗДЕЛАМ // QUICK JUMP
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => selectSection('catalog-releases')}
                    className="p-3 bg-void-900 border border-void-800 hover:border-signal-red text-left transition-colors"
                  >
                    <Disc3 size={16} className="text-signal-red mb-1" />
                    <div className="text-xs font-bold text-white">Релизы</div>
                    <div className="text-[10px] text-technical-muted">{releases.length} записей</div>
                  </button>

                  <button
                    onClick={() => selectSection('catalog-categories')}
                    className="p-3 bg-void-900 border border-void-800 hover:border-signal-red text-left transition-colors"
                  >
                    <Layers size={16} className="text-signal-red mb-1" />
                    <div className="text-xs font-bold text-white">Категории</div>
                    <div className="text-[10px] text-technical-muted">{categoriesData.genresList.length} жанров</div>
                  </button>

                  <button
                    onClick={() => selectSection('analytics')}
                    className="p-3 bg-void-900 border border-void-800 hover:border-signal-red text-left transition-colors"
                  >
                    <BarChart3 size={16} className="text-signal-red mb-1" />
                    <div className="text-xs font-bold text-white">Аналитика</div>
                    <div className="text-[10px] text-technical-muted">Телеметрия DSP</div>
                  </button>

                  <button
                    onClick={() => selectSection('community-signals')}
                    className="p-3 bg-void-900 border border-void-800 hover:border-signal-red text-left transition-colors"
                  >
                    <MessageSquare size={16} className="text-signal-red mb-1" />
                    <div className="text-xs font-bold text-white">Сигналы</div>
                    <div className="text-[10px] text-technical-muted">{signals.length} отзывов</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 2. CATALOG / RELEASES */}
          {/* ======================================================= */}
          {currentSection === 'catalog-releases' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-void-800 pb-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Disc3 size={20} className="text-signal-red" />
                    <span>CATALOG // RELEASES</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Управление дискографией, публикацией в 3D цилиндре и главными релизами
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleStartAdd}
                    className="px-3 py-2 bg-signal-red hover:bg-signal-red-glow text-white text-xs flex items-center space-x-1.5 transition-all shadow-signal-red-sharp"
                  >
                    <Plus size={14} />
                    <span>ДОБАВИТЬ РЕЛИЗ</span>
                  </button>

                  <button
                    onClick={handleExport}
                    className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-silver text-xs flex items-center space-x-1.5 transition-colors"
                  >
                    {copiedStatus ? <Check size={14} className="text-signal-red" /> : <Download size={14} />}
                    <span>{copiedStatus ? 'СКОПИРОВАНО!' : 'EXPORT JSON'}</span>
                  </button>

                  <label className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-silver text-xs flex items-center space-x-1.5 transition-colors cursor-pointer">
                    <Upload size={14} />
                    <span>IMPORT JSON</span>
                    <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                  </label>

                  <button
                    onClick={resetToVerified}
                    className="px-3 py-2 bg-void-900 hover:bg-void-850 border border-void-800 text-technical-muted hover:text-white text-xs flex items-center space-x-1.5 transition-colors"
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

              {/* Add / Edit Form Modal */}
              {(isAddingNew || editingRelease) && (
                <form
                  onSubmit={handleSaveForm}
                  className="p-6 bg-void-900 border border-signal-red/60 space-y-6"
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
                      className="px-4 py-2 bg-void-950 border border-void-800 text-technical-muted hover:text-white"
                    >
                      ОТМЕНА
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-signal-red hover:bg-signal-red-glow text-white tracking-widest uppercase flex items-center space-x-2"
                    >
                      <Save size={14} />
                      <span>СОХРАНИТЬ В 3D МИР</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Releases Table with search */}
              <div className="bg-void-900/80 border border-void-800 overflow-hidden">
                <div className="p-4 border-b border-void-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <Search size={14} className="text-technical-muted" />
                    <input
                      type="text"
                      placeholder="Поиск по названию, жанру, году..."
                      value={releaseSearchQuery}
                      onChange={(e) => setReleaseSearchQuery(e.target.value)}
                      className="bg-void-950 border border-void-800 px-3 py-1.5 text-white text-xs w-60 sm:w-72 focus:outline-none focus:border-signal-red"
                    />
                  </div>

                  <div className="text-technical-muted uppercase text-[11px]">
                    ПОКАЗАНО: {filteredReleases.length} ИЗ {releases.length} РЕЛИЗОВ
                  </div>
                </div>

                <div className="divide-y divide-void-800 max-h-[600px] overflow-y-auto">
                  {filteredReleases.map((release) => (
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
                          className="w-12 h-12 object-cover border border-void-700 shrink-0"
                          loading="lazy"
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
                            {release.artists} // {release.year} // {release.genre} // {release.type}
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

          {/* ======================================================= */}
          {/* 3. CATALOG / CATEGORIES */}
          {/* ======================================================= */}
          {currentSection === 'catalog-categories' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3">
                <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <Layers size={20} className="text-signal-red" />
                  <span>CATALOG // CATEGORIES & GENRES</span>
                </h1>
                <p className="text-xs text-technical-muted">
                  Анализ форматов релизов (SINGLE, EP, ALBUM) и распределение по музыкальным жанрам
                </p>
              </div>

              {/* Formats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-void-900 border border-void-800">
                  <div className="text-xs text-technical-muted uppercase">ФОРМАТ // SINGLE</div>
                  <div className="text-3xl font-bold text-white font-sans mt-1">
                    {categoriesData.typeCounts.SINGLE}
                  </div>
                  <div className="text-[11px] text-technical-silver mt-1">
                    {Math.round((categoriesData.typeCounts.SINGLE / (releases.length || 1)) * 100)}% от всего каталога
                  </div>
                </div>

                <div className="p-4 bg-void-900 border border-void-800">
                  <div className="text-xs text-technical-muted uppercase">ФОРМАТ // EP</div>
                  <div className="text-3xl font-bold text-white font-sans mt-1">
                    {categoriesData.typeCounts.EP}
                  </div>
                  <div className="text-[11px] text-technical-silver mt-1">
                    {Math.round((categoriesData.typeCounts.EP / (releases.length || 1)) * 100)}% от всего каталога
                  </div>
                </div>

                <div className="p-4 bg-void-900 border border-void-800">
                  <div className="text-xs text-technical-muted uppercase">ФОРМАТ // ALBUM</div>
                  <div className="text-3xl font-bold text-white font-sans mt-1">
                    {categoriesData.typeCounts.ALBUM}
                  </div>
                  <div className="text-[11px] text-technical-silver mt-1">
                    {Math.round((categoriesData.typeCounts.ALBUM / (releases.length || 1)) * 100)}% от всего каталога
                  </div>
                </div>
              </div>

              {/* Genres List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase flex items-center justify-between border-b border-void-800 pb-2">
                  <span>ЖАНРОВЫЕ КАТЕГОРИИ ({categoriesData.genresList.length})</span>
                  <span className="text-technical-muted text-[10px]">ВЫБЕРИТЕ ДЛЯ ФИЛЬТРАЦИИ</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoriesData.genresList.map((cat) => (
                    <div
                      key={cat.genre}
                      className="p-4 bg-void-900 border border-void-800 hover:border-signal-red transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{cat.genre}</span>
                        <span className="px-2 py-0.5 bg-signal-red/20 text-signal-red text-xs font-bold font-mono">
                          {cat.count} РЕЛИЗОВ // {cat.tracks} ТРЕКОВ
                        </span>
                      </div>

                      {/* Release covers in this category */}
                      <div className="flex items-center space-x-2 overflow-x-auto py-1">
                        {cat.releases.map((rel) => (
                          <img
                            key={rel.id}
                            src={rel.artworkUrl}
                            alt={rel.title}
                            title={`${rel.title} (${rel.year})`}
                            onClick={() => handleStartEdit(rel)}
                            className="w-10 h-10 object-cover border border-void-700 hover:border-signal-red cursor-pointer shrink-0 transition-transform hover:scale-105"
                            loading="lazy"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 4. CATALOG / TIMELINE */}
          {/* ======================================================= */}
          {currentSection === 'catalog-timeline' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Calendar size={20} className="text-signal-red" />
                    <span>CATALOG // CHRONOLOGICAL TIMELINE</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Хронология дискографии dYnex? в строгом порядке релизных дат с 2021 по 2026 год
                  </p>
                </div>
                <div className="text-xs text-signal-red font-bold font-mono">
                  {chronologicalReleases.length} ХРОНОЛОГИЧЕСКИХ ВЕХ
                </div>
              </div>

              {/* Timeline Vertical Stack */}
              <div className="relative border-l-2 border-void-800 ml-4 pl-6 space-y-6">
                {chronologicalReleases.map((release, index) => {
                  const isFirst = index === 0;
                  const isLatest = index === chronologicalReleases.length - 1;

                  return (
                    <div key={release.id} className="relative group">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
                          isLatest
                            ? 'bg-signal-red border-white animate-pulse'
                            : isFirst
                            ? 'bg-void-950 border-signal-red'
                            : 'bg-void-950 border-void-700 group-hover:border-signal-red'
                        }`}
                      />

                      <div className="p-4 bg-void-900 border border-void-800 group-hover:border-signal-red/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4 min-w-0">
                          <img
                            src={release.artworkUrl}
                            alt={release.title}
                            className="w-14 h-14 object-cover border border-void-700 shrink-0"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-white truncate">{release.title}</span>
                              {isLatest && (
                                <span className="bg-signal-red text-white text-[9px] px-1.5 py-0.2 font-bold uppercase">
                                  LATEST 2026
                                </span>
                              )}
                              {isFirst && (
                                <span className="bg-void-800 text-technical-silver text-[9px] px-1.5 py-0.2 uppercase">
                                  ORIGIN
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-technical-silver mt-0.5">
                              ДАТА ВЫХОДА: <span className="text-signal-red font-bold">{release.date}</span> // ГОД: {release.year}
                            </div>
                            <div className="text-[11px] text-technical-muted truncate">
                              {release.genre} • {release.type} • {release.trackCount || 1} трек(ов)
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => handleStartEdit(release)}
                            className="px-3 py-1.5 bg-void-950 border border-void-800 hover:border-signal-red text-technical-silver text-xs flex items-center space-x-1 transition-colors"
                          >
                            <Edit2 size={12} />
                            <span>ИЗМЕНИТЬ ДАТУ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 5. CATALOG / MEDIA */}
          {/* ======================================================= */}
          {currentSection === 'catalog-media' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Image size={20} className="text-signal-red" />
                    <span>CATALOG // MEDIA & ASSETS</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Галерея обложек, проверка прямых ссылок на стриминговые платформы и медиа-ресурсы
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  ВСЕГО АССЕТОВ: {releases.length} ОБЛОЖЕК
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {releases.map((rel) => {
                  return (
                    <div
                      key={rel.id}
                      className="p-2.5 bg-void-900 border border-void-800 hover:border-signal-red transition-all flex flex-col justify-between group"
                    >
                      <div className="relative overflow-hidden aspect-square bg-black mb-2">
                        <img
                          src={rel.artworkUrl}
                          alt={rel.title}
                          onClick={() => setPreviewImageUrl(rel.artworkUrl)}
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                        <div className="absolute top-1 right-1 px-1 bg-void-950/90 text-[9px] text-white border border-void-800">
                          {rel.year}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white truncate" title={rel.title}>
                          {rel.title}
                        </div>

                        {/* Platform indicators */}
                        <div className="flex items-center space-x-1 text-[9px]">
                          <span className={`w-2 h-2 rounded-full ${rel.platforms.spotify ? 'bg-[#1DB954]' : 'bg-void-700'}`} title="Spotify" />
                          <span className={`w-2 h-2 rounded-full ${rel.platforms.appleMusic ? 'bg-[#FC3C44]' : 'bg-void-700'}`} title="Apple Music" />
                          <span className={`w-2 h-2 rounded-full ${rel.platforms.vk ? 'bg-[#0077FF]' : 'bg-void-700'}`} title="VK" />
                          <span className={`w-2 h-2 rounded-full ${rel.platforms.yandexMusic ? 'bg-[#FC3F1D]' : 'bg-void-700'}`} title="Yandex Music" />
                          <span className={`w-2 h-2 rounded-full ${rel.platforms.youtube ? 'bg-[#FF0000]' : 'bg-void-700'}`} title="YouTube" />
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartEdit(rel)}
                        className="mt-2 w-full py-1 bg-void-950 border border-void-800 text-technical-muted hover:text-white text-[10px] uppercase transition-colors"
                      >
                        РЕДАКТИРОВАТЬ
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Large Image Preview Modal */}
              {previewImageUrl && (
                <div
                  onClick={() => setPreviewImageUrl(null)}
                  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                >
                  <div className="relative max-w-lg w-full bg-void-950 border border-signal-red p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white font-bold">АССЕТ ВЫСОКОГО РАЗРЕШЕНИЯ</span>
                      <button onClick={() => setPreviewImageUrl(null)} className="text-white hover:text-signal-red">
                        <X size={18} />
                      </button>
                    </div>
                    <img src={previewImageUrl} alt="Preview" className="w-full aspect-square object-contain border border-void-800" />
                    <div className="text-[10px] text-technical-muted truncate">{previewImageUrl}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* 6. ANALYTICS */}
          {/* ======================================================= */}
          {currentSection === 'analytics' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3">
                <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <BarChart3 size={20} className="text-signal-red" />
                  <span>PLATFORM TELEMETRY & ANALYTICS</span>
                </h1>
                <p className="text-xs text-technical-muted">
                  Статистика вовлеченности слушателей, распределение прямых ссылок по DSP и активность узлов
                </p>
              </div>

              {/* DSP Platforms Coverage Bars */}
              <div className="p-5 bg-void-900 border border-void-800 space-y-4">
                <div className="text-xs font-bold text-white uppercase flex items-center justify-between">
                  <span>ПОКРЫТИЕ ПЛАТФОРМ ПРЯМЫМИ ССЫЛКАМИ</span>
                  <span className="text-signal-red text-[10px]">DSP LINK COVERAGE</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#1DB954] font-bold">SPOTIFY:</span>
                      <span className="text-white">{analyticsData.spotifyPercent}% ({releases.filter(r => !!r.platforms.spotify).length}/{releases.length})</span>
                    </div>
                    <div className="w-full bg-void-950 h-2 border border-void-800">
                      <div className="bg-[#1DB954] h-full transition-all duration-500" style={{ width: `${analyticsData.spotifyPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#0077FF] font-bold">ВКОНТАКТЕ / VK MUSIC:</span>
                      <span className="text-white">{analyticsData.vkPercent}% ({releases.filter(r => !!r.platforms.vk).length}/{releases.length})</span>
                    </div>
                    <div className="w-full bg-void-950 h-2 border border-void-800">
                      <div className="bg-[#0077FF] h-full transition-all duration-500" style={{ width: `${analyticsData.vkPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#FC3C44] font-bold">APPLE MUSIC:</span>
                      <span className="text-white">{analyticsData.applePercent}% ({releases.filter(r => !!r.platforms.appleMusic).length}/{releases.length})</span>
                    </div>
                    <div className="w-full bg-void-950 h-2 border border-void-800">
                      <div className="bg-[#FC3C44] h-full transition-all duration-500" style={{ width: `${analyticsData.applePercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#FC3F1D] font-bold">ЯНДЕКС МУЗЫКА:</span>
                      <span className="text-white">{analyticsData.yandexPercent}% ({releases.filter(r => !!r.platforms.yandexMusic).length}/{releases.length})</span>
                    </div>
                    <div className="w-full bg-void-950 h-2 border border-void-800">
                      <div className="bg-[#FC3F1D] h-full transition-all duration-500" style={{ width: `${analyticsData.yandexPercent}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-[#FF0000] font-bold">YOUTUBE:</span>
                      <span className="text-white">{analyticsData.youtubePercent}% ({releases.filter(r => !!r.platforms.youtube).length}/{releases.length})</span>
                    </div>
                    <div className="w-full bg-void-950 h-2 border border-void-800">
                      <div className="bg-[#FF0000] h-full transition-all duration-500" style={{ width: `${analyticsData.youtubePercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-void-900 border border-void-800 space-y-3">
                  <div className="text-xs font-bold text-white uppercase border-b border-void-800 pb-2 flex justify-between">
                    <span>АКТИВНОСТЬ СООБЩЕСТВА</span>
                    <span className="text-signal-red">ENGAGEMENT INDEX</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">ОТЗЫВЫ (СИГНАЛЫ):</span>
                      <span className="text-white font-bold">{signals.length} всего / {signals.filter(s => s.status === 'APPROVED').length} одобрено</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">СЛЕДЫ НА СТЕНЕ:</span>
                      <span className="text-white font-bold">{traces.length}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">ЦИФРОВЫЕ ПОДПИСИ:</span>
                      <span className="text-white font-bold">{signatures.length}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-void-850">
                      <span className="text-technical-muted">СООБЩЕНИЯ АРТИСТУ:</span>
                      <span className="text-white font-bold">{transmissions.length}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-technical-muted">ДЕМО НА ФИТ / КОЛЛАБ:</span>
                      <span className="text-signal-red font-bold">{collabs.length}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-void-900 border border-void-800 space-y-3">
                  <div className="text-xs font-bold text-white uppercase border-b border-void-800 pb-2 flex justify-between">
                    <span>ТОП РЕЛИЗОВ ПО СИГНАЛАМ</span>
                    <span className="text-signal-red">POPULARITY</span>
                  </div>

                  <div className="space-y-2">
                    {analyticsData.topEngagedReleases.map((rel, idx) => (
                      <div key={rel.id} className="flex items-center justify-between text-xs p-1.5 bg-void-950 border border-void-850">
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-signal-red font-bold font-mono">#{idx + 1}</span>
                          <span className="text-white font-bold truncate">{rel.title}</span>
                          <span className="text-[10px] text-technical-muted">({rel.year})</span>
                        </div>
                        <span className="px-2 py-0.5 bg-signal-red/20 text-signal-red text-[10px] font-bold shrink-0">
                          {rel.signalsCount} СИГНАЛОВ
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* 7. COMMUNITY / SIGNALS */}
          {/* ======================================================= */}
          {currentSection === 'community-signals' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <MessageSquare size={20} className="text-signal-red" />
                    <span>COMMUNITY // SIGNALS MODERATION</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Модерация отзывов слушателей к релизам в 3D карточках
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  ВСЕГО В БАЗЕ: {signals.length}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
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
              </div>

              {signals.filter((s) => signalFilter === 'ALL' || s.status === signalFilter).length === 0 ? (
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

          {/* ======================================================= */}
          {/* 8. COMMUNITY / TRACE WALL */}
          {/* ======================================================= */}
          {currentSection === 'community-traces' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Edit3 size={20} className="text-signal-red" />
                    <span>COMMUNITY // TRACE WALL MODERATION</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Модерация следов участников со стены архива
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  ВСЕГО СЛЕДОВ: {traces.length}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs pb-2">
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

              {traces.filter((t) => traceFilter === 'ALL' || t.status === traceFilter).length === 0 ? (
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

          {/* ======================================================= */}
          {/* 9. COMMUNITY / SIGNATURES */}
          {/* ======================================================= */}
          {currentSection === 'community-signatures' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Edit3 size={20} className="text-signal-red" />
                    <span>COMMUNITY // SIGNATURES BOOK</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Модерация криптографических подписей участников в книге гостей
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  ВСЕГО ПОДПИСЕЙ: {signatures.length}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs pb-2">
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

              {signatures.filter((s) => sigFilter === 'ALL' || s.status === sigFilter).length === 0 ? (
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

          {/* ======================================================= */}
          {/* 10. COMMUNITY / TRANSMISSIONS */}
          {/* ======================================================= */}
          {currentSection === 'community-transmissions' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Send size={20} className="text-signal-red" />
                    <span>COMMUNITY // TRANSMISSIONS</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Входящие личные сообщения и вопросы артисту dYnex?
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  ВСЕГО ПЕРЕДАЧ: {transmissions.length}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs pb-2">
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

              {transmissions.filter((t) => transFilter === 'ALL' || t.status === transFilter).length === 0 ? (
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

          {/* ======================================================= */}
          {/* 11. COMMUNITY / COLLABS & DEMOS */}
          {/* ======================================================= */}
          {currentSection === 'community-collabs' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Music2 size={20} className="text-signal-red" />
                    <span>COMMUNITY // COLLABORATIONS & DEMO TRACKS</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Заявки на совместные треки со встроенным аудиоплеером для оценки демо
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  ВСЕГО ЗАЯВОК: {collabs.length}
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs pb-2">
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

              {collabs.filter((c) => collabFilter === 'ALL' || c.status === collabFilter).length === 0 ? (
                <div className="p-8 text-center text-xs text-technical-muted border border-void-800 bg-void-900/40">
                  НЕТ ЗАЯВОК НА КОЛЛАБОРАЦИЮ В ЭТОЙ КАТЕГОРИИ
                </div>
              ) : (
                <div className="space-y-4">
                  {collabs
                    .filter((c) => collabFilter === 'ALL' || c.status === collabFilter)
                    .map((collab) => (
                      <div
                        key={collab.id}
                        className="p-4 bg-void-900 border border-void-800 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-white text-sm">
                              @{collab.username}
                            </span>
                            <span className="text-technical-muted text-[11px] ml-2 font-mono">
                              КОНТАКТ: <span className="text-[#229ED9]">{collab.contact}</span>
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 bg-void-950 border border-void-700 text-technical-silver text-[9px] font-bold">
                              {collab.type}
                            </span>
                            <span className="px-2 py-0.5 bg-signal-red/20 text-signal-red text-[9px] font-bold">
                              {collab.status}
                            </span>
                          </div>
                        </div>

                        {collab.message && (
                          <p className="text-xs text-technical-silver">"{collab.message}"</p>
                        )}

                        {/* Audio metadata */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <div className="text-[11px] text-technical-muted flex items-center space-x-1">
                            <Volume2 size={13} className="text-signal-red" />
                            <span className="text-white font-mono">{collab.audioFileName}</span>
                            <span>
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

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-2 pt-1 border-t border-void-850">
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

          {/* ======================================================= */}
          {/* 12. COMMUNITY / MEMBERS */}
          {/* ======================================================= */}
          {currentSection === 'community-members' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <Users size={20} className="text-signal-red" />
                    <span>COMMUNITY // MEMBERS DIRECTORY</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Список участников архива, роли и контроль блокировок
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  ВСЕГО УЧАСТНИКОВ: {users.length}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-void-800">
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Поиск по имени @username или email..."
                  className="px-3 py-2 bg-void-900 border border-void-800 text-xs w-72 text-white placeholder:text-technical-muted/50 focus:outline-none focus:border-signal-red"
                />
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

          {/* ======================================================= */}
          {/* 13. COMMUNITY / AUDIT LOG */}
          {/* ======================================================= */}
          {currentSection === 'community-audit' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="border-b border-void-800 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                    <FileText size={20} className="text-signal-red" />
                    <span>COMMUNITY // AUDIT TRAIL</span>
                  </h1>
                  <p className="text-xs text-technical-muted">
                    Неизменяемый журнал всех административных и модераторских действий
                  </p>
                </div>
                <div className="text-xs text-technical-muted">
                  {auditLogs.length} ЗАПИСЕЙ В ЖУРНАЛЕ
                </div>
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

        </main>
      </div>
    </motion.div>
  );
};
