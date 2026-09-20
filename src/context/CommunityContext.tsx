import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  UserIdentity,
  SignalComment,
  TraceItem,
  SignatureItem,
  TransmissionItem,
  CollabRequestItem,
  ModerationActionLog,
  SignalBoardStats,
  UnreleasedTrack,
  ModerationStatus,
} from '../types/community';
import { useArchive } from './ArchiveContext';
import { Release } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface CommunityContextType {
  // Current user & Auth
  currentUser: UserIdentity | null;
  isMember: boolean;
  login: (credentials: { usernameOrEmail: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  register: (data: { username: string; email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePrivacy: (settings: Partial<UserIdentity['privacySettings']>) => void;

  // Modals Visibility
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;

  isProfileOpen: boolean;
  profileUser: UserIdentity | null;
  openUserProfile: (user?: UserIdentity | null) => void;
  closeUserProfile: () => void;

  isTraceWallOpen: boolean;
  openTraceWall: () => void;
  closeTraceWall: () => void;

  isSignatureWallOpen: boolean;
  openSignatureWall: () => void;
  closeSignatureWall: () => void;

  isTransmissionOpen: boolean;
  openTransmission: () => void;
  closeTransmission: () => void;

  isCollabOpen: boolean;
  openCollab: () => void;
  closeCollab: () => void;

  isSecretNodeOpen: boolean;
  openSecretNode: () => void;
  closeSecretNode: () => void;

  isLeaveTraceOpen: boolean;
  openLeaveTrace: () => void;
  closeLeaveTrace: () => void;

  isLeaveSignatureOpen: boolean;
  openLeaveSignature: () => void;
  closeLeaveSignature: () => void;

  // Signals (Release Comments)
  signals: SignalComment[];
  getSignalsForRelease: (releaseId: string) => SignalComment[];
  submitSignal: (releaseId: string, content: string) => Promise<{ success: boolean; error?: string }>;
  updateSignalStatus: (id: string, status: ModerationStatus) => void;
  deleteSignal: (id: string) => void;

  // Traces
  traces: TraceItem[];
  userActiveTrace: TraceItem | null;
  submitTrace: (content: string) => Promise<{ success: boolean; error?: string; trace?: TraceItem }>;
  deleteUserTrace: () => Promise<void>;
  updateTraceStatus: (id: string, status: ModerationStatus) => Promise<void>;
  deleteTrace: (id: string) => Promise<void>;
  refreshTraces: () => Promise<void>;

  // Signatures
  signatures: SignatureItem[];
  userActiveSignature: SignatureItem | null;
  submitSignature: (phrase?: string) => Promise<{ success: boolean; error?: string }>;
  deleteUserSignature: () => Promise<void>;
  updateSignatureStatus: (id: string, status: ModerationStatus) => void;
  deleteSignature: (id: string) => void;

  // Transmissions
  transmissions: TransmissionItem[];
  submitTransmission: (data: { contact: string; subject: string; message: string }) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateTransmissionStatus: (id: string, status: 'READ' | 'ARCHIVED') => void;
  deleteTransmission: (id: string) => void;

  // Collaborations
  collabs: CollabRequestItem[];
  submitCollab: (data: { contact: string; type: 'FIT' | 'COLLAB'; message: string; audioFile: File }) => Promise<{ success: boolean; id?: string; error?: string }>;
  updateCollabStatus: (id: string, status: 'LISTENED' | 'ACCEPTED' | 'REJECTED' | 'ARCHIVED') => void;
  deleteCollab: (id: string) => void;

  // Unreleased Archive
  unreleased: UnreleasedTrack[];
  addUnreleasedTrack: (track: Omit<UnreleasedTrack, 'id' | 'createdAt'>) => void;
  updateUnreleasedTrack: (id: string, data: Partial<UnreleasedTrack>) => void;
  deleteUnreleasedTrack: (id: string) => void;

  // Users & Moderation
  users: UserIdentity[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  auditLogs: ModerationActionLog[];

  // Real Stats & Mechanics
  stats: SignalBoardStats;
  todaySignalRelease: Release;
  triggerRandomNode: () => void;
  secretUnlocked: boolean;
  unlockSecret: () => void;
  triggerMobileSecretTap: () => void;
}

const STORAGE_KEYS = {
  USER: 'dynex_community_user_v2',
  ALL_USERS: 'dynex_community_all_users_v2',
  SIGNALS: 'dynex_community_signals_v2',
  TRACES: 'dynex_community_traces_v2',
  SIGNATURES: 'dynex_community_signatures_v2',
  TRANSMISSIONS: 'dynex_community_transmissions_v2',
  COLLABS: 'dynex_community_collabs_v2',
  AUDIT: 'dynex_community_audit_v2',
  UNRELEASED: 'dynex_community_unreleased_v2',
};

const FORBIDDEN_USERNAMES = new Set([
  'dynex',
  'dynex?',
  'admin',
  'administrator',
  'moderator',
  'official',
  'system',
  'support',
  'root',
  'staff',
]);

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const CommunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { releases, setSelectedRelease, setArchiveRotation } = useArchive();

  // 1. Current user session
  const [currentUser, setCurrentUser] = useState<UserIdentity | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<UserIdentity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Interactive Archive Datasets
  const [signals, setSignals] = useState<SignalComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIGNALS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [traces, setTraces] = useState<TraceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [signatures, setSignatures] = useState<SignatureItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIGNATURES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [transmissions, setTransmissions] = useState<TransmissionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSMISSIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [collabs, setCollabs] = useState<CollabRequestItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLABS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [auditLogs, setAuditLogs] = useState<ModerationActionLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unreleased, setUnreleased] = useState<UnreleasedTrack[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UNRELEASED);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'unr-001',
        title: 'NEO-CHROMA // 180 BPM',
        artists: 'dYnex?',
        year: 2026,
        genre: 'Cyber Phonk / Speed',
        coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a9/ff/a1/a9ffa15e-6db3-b81a-be5c-c668c6b03b27/cover.jpg/1000x1000bb.jpg',
        description: 'Экспериментальный винил-мастер для ночных лайв-сессий. Доступ по ключу артиста.',
        status: 'LOCKED',
        accessCode: 'DYNEX2026',
        createdAt: '2026-03-10',
      },
      {
        id: 'unr-002',
        title: 'PROTOCOL ZERO',
        artists: 'dYnex? & GVEOR',
        year: 2026,
        genre: 'Dark Electronic / Drift',
        coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/4c/bd/09/4cbd09b3-e559-c241-6a7d-2101dc0c4157/cover.png/1000x1000bb.jpg',
        description: 'Архивный демо-исходник с аналоговыми синтезаторами.',
        status: 'PREVIEW',
        createdAt: '2026-02-18',
      },
    ];
  });

  // Persistence to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGNALS, JSON.stringify(signals));
    } catch {}
  }, [signals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACES, JSON.stringify(traces));
    } catch {}
  }, [traces]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(signatures));
    } catch {}
  }, [signatures]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSMISSIONS, JSON.stringify(transmissions));
    } catch {}
  }, [transmissions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COLLABS, JSON.stringify(collabs));
    } catch {}
  }, [collabs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UNRELEASED, JSON.stringify(unreleased));
    } catch {}
  }, [unreleased]);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<UserIdentity | null>(null);

  const [isTraceWallOpen, setIsTraceWallOpen] = useState(false);
  const [isSignatureWallOpen, setIsSignatureWallOpen] = useState(false);
  const [isTransmissionOpen, setIsTransmissionOpen] = useState(false);
  const [isCollabOpen, setIsCollabOpen] = useState(false);
  const [isSecretNodeOpen, setIsSecretNodeOpen] = useState(false);
  const [isLeaveTraceOpen, setIsLeaveTraceOpen] = useState(false);
  const [isLeaveSignatureOpen, setIsLeaveSignatureOpen] = useState(false);

  const [secretUnlocked, setSecretUnlocked] = useState(false);

  // Helper log function
  const addAuditLog = useCallback((
    targetType: ModerationActionLog['targetType'],
    targetId: string,
    action: string,
    details?: string
  ) => {
    const entry: ModerationActionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      moderatorUsername: currentUser?.username || 'SYSTEM_MOD',
      targetType,
      targetId,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [entry, ...prev]);
  }, [currentUser]);

  // Auth Handlers
  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const openUserProfile = useCallback((user?: UserIdentity | null) => {
    setProfileUser(user || currentUser);
    setIsProfileOpen(true);
  }, [currentUser]);

  const closeUserProfile = useCallback(() => {
    setIsProfileOpen(false);
    setProfileUser(null);
  }, []);

  const login = useCallback(async ({ usernameOrEmail }: { usernameOrEmail: string; password?: string }) => {
    const clean = usernameOrEmail.trim().replace(/^@/, '').toLowerCase();
    if (!clean) return { success: false, error: 'Введите имя пользователя или email' };

    const found = users.find(
      (u) => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
    );

    if (found) {
      if (found.status === 'BLOCKED') {
        return { success: false, error: 'Доступ заблокирован администрацией архива' };
      }
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // Auto-create local user session if new in local mode
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newUser: UserIdentity = {
      id: `usr-${Date.now()}`,
      username: clean,
      email: clean.includes('@') ? clean : `${clean}@archive.node`,
      nodeNumber: `NODE_${randomDigits}`,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      privacySettings: {
        publicProfile: true,
        showTraces: true,
        showSignals: true,
      },
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  }, [users]);

  const register = useCallback(async ({ username, email }: { username: string; email: string; password?: string }) => {
    const cleanName = username.trim().replace(/^@/, '').toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 3) {
      return { success: false, error: 'Имя пользователя должно содержать не менее 3 символов' };
    }
    if (!/^[a-zA-Z0-9._]+$/.test(cleanName)) {
      return { success: false, error: 'Используйте только латинские буквы, цифры, точки и подчеркивания' };
    }
    if (FORBIDDEN_USERNAMES.has(cleanName)) {
      return { success: false, error: 'Это системное имя зарезервировано dYnex? Archive' };
    }

    const existing = users.find(
      (u) => u.username.toLowerCase() === cleanName || u.email.toLowerCase() === cleanEmail
    );
    if (existing) {
      return { success: false, error: 'Пользователь с таким именем или email уже существует' };
    }

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newUser: UserIdentity = {
      id: `usr-${Date.now()}`,
      username: cleanName,
      email: cleanEmail,
      nodeNumber: `NODE_${randomDigits}`,
      role: 'USER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      privacySettings: {
        publicProfile: true,
        showTraces: true,
        showSignals: true,
      },
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsProfileOpen(false);
  }, []);

  const updatePrivacy = useCallback((settings: Partial<UserIdentity['privacySettings']>) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      privacySettings: { ...currentUser.privacySettings, ...settings },
    };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  }, [currentUser]);

  // Signals (Release Comments)
  const getSignalsForRelease = useCallback((releaseId: string) => {
    return signals.filter((s) => s.releaseId === releaseId && s.status === 'APPROVED');
  }, [signals]);

  const submitSignal = useCallback(async (releaseId: string, content: string) => {
    if (!currentUser) {
      openAuthModal('register');
      return { success: false, error: 'Требуется идентификация участника' };
    }
    if (currentUser.status === 'BLOCKED') {
      return { success: false, error: 'Ваш доступ ограничен' };
    }
    const cleanContent = content.trim();
    if (!cleanContent) return { success: false, error: 'Сообщение не может быть пустым' };
    if (cleanContent.length > 280) return { success: false, error: 'Превышен лимит (280 символов)' };

    const newSignal: SignalComment = {
      id: `sig-${Date.now()}`,
      releaseId,
      userId: currentUser.id,
      username: currentUser.username,
      content: cleanContent,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setSignals((prev) => [newSignal, ...prev]);
    return { success: true };
  }, [currentUser, openAuthModal]);

  const updateSignalStatus = useCallback((id: string, status: ModerationStatus) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, reviewedAt: new Date().toISOString() } : s))
    );
    addAuditLog('SIGNAL', id, `SIGNAL_${status}`);
  }, [addAuditLog]);

  const deleteSignal = useCallback((id: string) => {
    setSignals((prev) => prev.filter((s) => s.id !== id));
    addAuditLog('SIGNAL', id, 'SIGNAL_DELETED');
  }, [addAuditLog]);

  // Traces: Real Server-backed Fetching from Supabase
  const fetchTraces = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const { data, error } = await supabase
        .from('trace_wall')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[Supabase] Error loading trace_wall records:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        const loaded: TraceItem[] = data.map((row: any) => ({
          id: row.trace_id || row.id,
          traceId: row.trace_id,
          userId: row.user_id,
          username: row.username,
          content: row.message || row.content || '',
          status: (row.status as ModerationStatus) || 'PENDING',
          createdAt: row.created_at,
          approvedAt: row.approved_at,
          approvedBy: row.approved_by,
          rejectedAt: row.rejected_at,
          rejectedBy: row.rejected_by,
          deletedAt: row.deleted_at,
        }));
        setTraces(loaded);
      }
    } catch (err) {
      console.error('[Supabase] Unexpected exception in fetchTraces:', err);
    }
  }, []);

  // Fetch traces on startup and listen to realtime updates if Supabase is active
  useEffect(() => {
    fetchTraces();

    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel('trace_wall_realtime_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'trace_wall' },
          () => {
            fetchTraces();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [fetchTraces]);

  const userActiveTrace = useMemo(() => {
    if (!currentUser) return null;
    return traces.find((t) => t.userId === currentUser.id) || null;
  }, [currentUser, traces]);

  const submitTrace = useCallback(async (content: string): Promise<{ success: boolean; error?: string; trace?: TraceItem }> => {
    if (!currentUser) {
      openAuthModal('register');
      return { success: false, error: 'Требуется идентификация участника' };
    }
    if (currentUser.status === 'BLOCKED') {
      return { success: false, error: 'Ваш доступ ограничен' };
    }
    const cleanContent = content.trim();
    if (!cleanContent) return { success: false, error: 'След не может быть пустым' };
    if (cleanContent.length > 140) return { success: false, error: 'Превышен лимит (140 символов)' };

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: 'База данных Supabase не подключена. Настройте переменные окружения VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в панели Vercel или файле .env.',
      };
    }

    try {
      const { data, error } = await supabase
        .from('trace_wall')
        .insert({
          username: currentUser.username,
          user_id: currentUser.id,
          message: cleanContent,
          status: 'PENDING',
        })
        .select()
        .single();

      if (error) {
        console.error('[Supabase] Failed to insert into trace_wall:', error);
        return {
          success: false,
          error: `Ошибка записи в базу данных Supabase: ${error.message || 'Сбой запроса'}`,
        };
      }

      const newTrace: TraceItem = {
        id: data.trace_id || data.id,
        traceId: data.trace_id,
        userId: data.user_id || currentUser.id,
        username: data.username,
        content: data.message || cleanContent,
        status: (data.status as ModerationStatus) || 'PENDING',
        createdAt: data.created_at || new Date().toISOString(),
      };

      // Record in audit log
      try {
        await supabase.from('audit_logs').insert({
          action: 'TRACE_CREATED',
          target_type: 'TRACE',
          target_id: newTrace.id,
          admin: `@${currentUser.username}`,
          details: `След отправлен на модерацию: "${cleanContent.slice(0, 30)}..."`,
        });
      } catch {}

      // 1 active trace per user: update state
      setTraces((prev) => [newTrace, ...prev.filter((t) => t.userId !== currentUser.id && t.id !== newTrace.id)]);
      setIsLeaveTraceOpen(false);
      return { success: true, trace: newTrace };
    } catch (err: any) {
      console.error('[Supabase] Network or system error submitting trace:', err);
      return {
        success: false,
        error: `Сетевая ошибка: ${err?.message || 'Не удалось связаться с сервером базы данных'}`,
      };
    }
  }, [currentUser, openAuthModal]);

  const deleteUserTrace = useCallback(async () => {
    if (!currentUser) return;
    const existing = traces.find((t) => t.userId === currentUser.id);
    if (!existing) return;

    // Optimistic UI update
    setTraces((prev) => prev.filter((t) => t.userId !== currentUser.id));

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('trace_wall')
          .update({ deleted_at: new Date().toISOString() })
          .eq('user_id', currentUser.id);

        addAuditLog('TRACE', existing.id, 'TRACE_DELETED_BY_USER', 'След удалён автором');
      } catch (err) {
        console.error('[Supabase] Failed to delete user trace in DB:', err);
      }
    }
  }, [currentUser, traces, addAuditLog]);

  const updateTraceStatus = useCallback(async (id: string, status: ModerationStatus) => {
    const now = new Date().toISOString();
    const adminName = currentUser?.username ? `@${currentUser.username}` : '@kazumaiq';

    // Optimistic UI update
    setTraces((prev) =>
      prev.map((t) =>
        t.id === id || t.traceId === id
          ? {
              ...t,
              status,
              reviewedAt: now,
              approvedAt: status === 'APPROVED' ? now : undefined,
              approvedBy: status === 'APPROVED' ? adminName : undefined,
              rejectedAt: status === 'REJECTED' ? now : undefined,
              rejectedBy: status === 'REJECTED' ? adminName : undefined,
            }
          : t
      )
    );

    if (isSupabaseConfigured()) {
      try {
        const rpcAction = status === 'APPROVED' ? 'APPROVE' : 'REJECT';
        const { error: rpcErr } = await supabase.rpc('moderate_trace', {
          p_trace_id: id,
          p_action: rpcAction,
          p_admin: adminName,
        });

        if (rpcErr) {
          // Direct table update fallback
          const updatePayload: any = {
            status,
            approved_at: status === 'APPROVED' ? now : null,
            approved_by: status === 'APPROVED' ? adminName : null,
            rejected_at: status === 'REJECTED' ? now : null,
            rejected_by: status === 'REJECTED' ? adminName : null,
          };
          await supabase
            .from('trace_wall')
            .update(updatePayload)
            .or(`trace_id.eq.${id},id.eq.${id}`);

          await supabase.from('audit_logs').insert({
            action: `TRACE_${status}`,
            target_type: 'TRACE',
            target_id: id,
            admin: adminName,
            details: `Статус изменён на ${status}`,
          });
        }
      } catch (err) {
        console.error('[Supabase] Error moderating trace:', err);
      }
    }

    addAuditLog('TRACE', id, `TRACE_${status}`);
  }, [currentUser, addAuditLog]);

  const deleteTrace = useCallback(async (id: string) => {
    const adminName = currentUser?.username ? `@${currentUser.username}` : '@kazumaiq';

    // Optimistic UI update
    setTraces((prev) => prev.filter((t) => t.id !== id && t.traceId !== id));

    if (isSupabaseConfigured()) {
      try {
        const { error: rpcErr } = await supabase.rpc('moderate_trace', {
          p_trace_id: id,
          p_action: 'DELETE',
          p_admin: adminName,
        });

        if (rpcErr) {
          // Soft delete: sets deleted_at = NOW(), never physically deletes from table
          await supabase
            .from('trace_wall')
            .update({ deleted_at: new Date().toISOString() })
            .or(`trace_id.eq.${id},id.eq.${id}`);

          await supabase.from('audit_logs').insert({
            action: 'TRACE_DELETED',
            target_type: 'TRACE',
            target_id: id,
            admin: adminName,
            details: 'След мягко удалён администратором (soft-delete)',
          });
        }
      } catch (err) {
        console.error('[Supabase] Error soft-deleting trace:', err);
      }
    }

    addAuditLog('TRACE', id, 'TRACE_DELETED');
  }, [currentUser, addAuditLog]);

  // Signatures
  const userActiveSignature = useMemo(() => {
    if (!currentUser) return null;
    return signatures.find((s) => s.userId === currentUser.id) || null;
  }, [currentUser, signatures]);

  const submitSignature = useCallback(async (phrase?: string) => {
    if (!currentUser) {
      openAuthModal('register');
      return { success: false, error: 'Требуется идентификация участника' };
    }
    if (currentUser.status === 'BLOCKED') {
      return { success: false, error: 'Ваш доступ ограничен' };
    }

    // Deterministic seed based on username string
    let seed = 0;
    for (let i = 0; i < currentUser.username.length; i++) {
      seed = (seed * 31 + currentUser.username.charCodeAt(i)) >>> 0;
    }

    const newSig: SignatureItem = {
      id: `sig-${currentUser.id}`,
      userId: currentUser.id,
      username: currentUser.username,
      phrase: phrase?.trim() || undefined,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      seed,
    };

    setSignatures((prev) => [newSig, ...prev.filter((s) => s.userId !== currentUser.id)]);
    setIsLeaveSignatureOpen(false);
    return { success: true };
  }, [currentUser, openAuthModal]);

  const deleteUserSignature = useCallback(async () => {
    if (!currentUser) return;
    setSignatures((prev) => prev.filter((s) => s.userId !== currentUser.id));
  }, [currentUser]);

  const updateSignatureStatus = useCallback((id: string, status: ModerationStatus) => {
    setSignatures((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    addAuditLog('SIGNATURE', id, `SIGNATURE_${status}`);
  }, [addAuditLog]);

  const deleteSignature = useCallback((id: string) => {
    setSignatures((prev) => prev.filter((s) => s.id !== id));
    addAuditLog('SIGNATURE', id, 'SIGNATURE_DELETED');
  }, [addAuditLog]);

  // Transmissions
  const submitTransmission = useCallback(async (data: { contact: string; subject: string; message: string }) => {
    if (!data.contact.trim() || !data.message.trim()) {
      return { success: false, error: 'Заполните контактные данные и текст сообщения' };
    }

    const trnId = `TRN-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTrn: TransmissionItem = {
      id: trnId,
      userId: currentUser?.id,
      username: currentUser?.username || 'ANONYMOUS_TRANSMITTER',
      contact: data.contact.trim(),
      subject: data.subject.trim() || 'DIRECT_TRANSMISSION',
      message: data.message.trim(),
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    setTransmissions((prev) => [newTrn, ...prev]);
    return { success: true, id: trnId };
  }, [currentUser]);

  const updateTransmissionStatus = useCallback((id: string, status: 'READ' | 'ARCHIVED') => {
    setTransmissions((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    addAuditLog('TRANSMISSION', id, `TRANSMISSION_${status}`);
  }, [addAuditLog]);

  const deleteTransmission = useCallback((id: string) => {
    setTransmissions((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('TRANSMISSION', id, 'TRANSMISSION_DELETED');
  }, [addAuditLog]);

  // Collaborations
  const submitCollab = useCallback(async (data: {
    contact: string;
    type: 'FIT' | 'COLLAB';
    message: string;
    audioFile: File;
  }) => {
    if (!data.contact.trim()) {
      return { success: false, error: 'Укажите контакт для связи' };
    }
    if (!data.audioFile) {
      return { success: false, error: 'Пожалуйста, прикрепите аудиофайл демо' };
    }

    // Size limit: 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (data.audioFile.size > MAX_SIZE) {
      return { success: false, error: 'Размер файла превышает 50 МБ' };
    }

    // Format verification
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/x-flac'];
    const ext = data.audioFile.name.split('.').pop()?.toLowerCase() || '';
    const allowedExts = ['mp3', 'wav', 'flac'];

    if (!allowedExts.includes(ext) && !allowedTypes.includes(data.audioFile.type)) {
      return { success: false, error: 'Поддерживаются только форматы MP3, WAV, FLAC' };
    }

    const colId = `COL-${Math.floor(10000 + Math.random() * 90000)}`;

    // Create local object URL so demo can be previewed immediately in admin
    const localAudioUrl = URL.createObjectURL(data.audioFile);

    const newCollab: CollabRequestItem = {
      id: colId,
      userId: currentUser?.id,
      username: currentUser?.username || 'ANONYMOUS_PRODUCER',
      contact: data.contact.trim(),
      type: data.type,
      message: data.message.trim(),
      audioFileName: data.audioFile.name,
      audioFileSize: data.audioFile.size,
      audioFileUrl: localAudioUrl,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    setCollabs((prev) => [newCollab, ...prev]);
    return { success: true, id: colId };
  }, [currentUser]);

  const updateCollabStatus = useCallback((id: string, status: CollabRequestItem['status']) => {
    setCollabs((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    addAuditLog('COLLAB', id, `COLLAB_${status}`);
  }, [addAuditLog]);

  const deleteCollab = useCallback((id: string) => {
    setCollabs((prev) => prev.filter((c) => c.id !== id));
    addAuditLog('COLLAB', id, 'COLLAB_DELETED');
  }, [addAuditLog]);

  // Unreleased Archive CRUD
  const addUnreleasedTrack = useCallback((track: Omit<UnreleasedTrack, 'id' | 'createdAt'>) => {
    const id = `unr-${Date.now()}`;
    const newTrack: UnreleasedTrack = {
      ...track,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUnreleased((prev) => [newTrack, ...prev]);
  }, []);

  const updateUnreleasedTrack = useCallback((id: string, data: Partial<UnreleasedTrack>) => {
    setUnreleased((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const deleteUnreleasedTrack = useCallback((id: string) => {
    setUnreleased((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // User moderation
  const blockUser = useCallback((userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'BLOCKED' } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: 'BLOCKED' } : null));
    }
    addAuditLog('USER', userId, 'USER_BLOCKED');
  }, [currentUser, addAuditLog]);

  const unblockUser = useCallback((userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'ACTIVE' } : u)));
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, status: 'ACTIVE' } : null));
    }
    addAuditLog('USER', userId, 'USER_UNBLOCKED');
  }, [currentUser, addAuditLog]);

  // Real statistics (no fake data)
  const stats: SignalBoardStats = useMemo(() => {
    const activeSignals = signals.filter((s) => s.status === 'APPROVED').length;
    const archivedTraces = traces.filter((t) => t.status === 'APPROVED').length;
    const approvedSignatures = signatures.filter((s) => s.status === 'APPROVED').length;
    const totalMembers = users.length;
    const transmissionsCount = transmissions.length;

    return {
      activeSignals,
      archivedTraces,
      approvedSignatures,
      totalMembers,
      transmissionsCount,
    };
  }, [signals, traces, signatures, users.length, transmissions.length]);

  // Today's Signal: deterministic daily release
  const todaySignalRelease = useMemo(() => {
    const published = releases.filter((r) => r.published !== false);
    if (!published.length) return releases[0];

    const todayStr = new Date().toISOString().split('T')[0]; // '2026-09-19'
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash * 31 + todayStr.charCodeAt(i)) >>> 0;
    }
    const idx = hash % published.length;
    return published[idx];
  }, [releases]);

  // Random Node
  const triggerRandomNode = useCallback(() => {
    const published = releases.filter((r) => r.published !== false);
    if (!published.length) return;
    const randomIdx = Math.floor(Math.random() * published.length);
    const chosen = published[randomIdx];

    // Scroll smoothly to the archive section
    const archiveEl = document.getElementById('archive');
    if (archiveEl) {
      archiveEl.scrollIntoView({ behavior: 'smooth' });
    }

    // Align 3D rotation with chosen release
    const total = published.length;
    const angleStep = (2 * Math.PI) / total;
    const targetAngle = -randomIdx * angleStep;
    setArchiveRotation(targetAngle);

    // Open detail modal with slight cinematic delay
    setTimeout(() => {
      setSelectedRelease(chosen);
    }, 600);
  }, [releases, setSelectedRelease, setArchiveRotation]);

  // Secret Easter Egg Trigger
  const unlockSecret = useCallback(() => {
    setSecretUnlocked(true);
    setIsSecretNodeOpen(true);
  }, []);

  // Mobile Tap Easter egg (3 taps on secret touch point within 2.5 seconds)
  const tapTimes = React.useRef<number[]>([]);
  const triggerMobileSecretTap = useCallback(() => {
    const now = Date.now();
    tapTimes.current = [...tapTimes.current.filter((t) => now - t < 2500), now];
    if (tapTimes.current.length >= 3) {
      tapTimes.current = [];
      unlockSecret();
    }
  }, [unlockSecret]);

  // Keyboard secret sequence 'dynex' on desktop
  useEffect(() => {
    let buffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing inside form inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-10);
        if (buffer.endsWith('dynex')) {
          buffer = '';
          unlockSecret();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlockSecret]);

  return (
    <CommunityContext.Provider
      value={{
        currentUser,
        isMember: Boolean(currentUser),
        login,
        register,
        logout,
        updatePrivacy,

        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,

        isProfileOpen,
        profileUser,
        openUserProfile,
        closeUserProfile,

        isTraceWallOpen,
        openTraceWall: () => setIsTraceWallOpen(true),
        closeTraceWall: () => setIsTraceWallOpen(false),

        isSignatureWallOpen,
        openSignatureWall: () => setIsSignatureWallOpen(true),
        closeSignatureWall: () => setIsSignatureWallOpen(false),

        isTransmissionOpen,
        openTransmission: () => setIsTransmissionOpen(true),
        closeTransmission: () => setIsTransmissionOpen(false),

        isCollabOpen,
        openCollab: () => setIsCollabOpen(true),
        closeCollab: () => setIsCollabOpen(false),

        isSecretNodeOpen,
        openSecretNode: () => setIsSecretNodeOpen(true),
        closeSecretNode: () => setIsSecretNodeOpen(false),

        isLeaveTraceOpen,
        openLeaveTrace: () => setIsLeaveTraceOpen(true),
        closeLeaveTrace: () => setIsLeaveTraceOpen(false),

        isLeaveSignatureOpen,
        openLeaveSignature: () => setIsLeaveSignatureOpen(true),
        closeLeaveSignature: () => setIsLeaveSignatureOpen(false),

        signals,
        getSignalsForRelease,
        submitSignal,
        updateSignalStatus,
        deleteSignal,

        traces,
        userActiveTrace,
        submitTrace,
        deleteUserTrace,
        updateTraceStatus,
        deleteTrace,
        refreshTraces: fetchTraces,

        signatures,
        userActiveSignature,
        submitSignature,
        deleteUserSignature,
        updateSignatureStatus,
        deleteSignature,

        transmissions,
        submitTransmission,
        updateTransmissionStatus,
        deleteTransmission,

        collabs,
        submitCollab,
        updateCollabStatus,
        deleteCollab,

        unreleased,
        addUnreleasedTrack,
        updateUnreleasedTrack,
        deleteUnreleasedTrack,

        users,
        blockUser,
        unblockUser,
        auditLogs,

        stats,
        todaySignalRelease,
        triggerRandomNode,
        secretUnlocked,
        unlockSecret,
        triggerMobileSecretTap,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
