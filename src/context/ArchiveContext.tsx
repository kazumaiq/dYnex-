import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Release, Language } from '../types';
import { VERIFIED_RELEASES, INITIAL_FEATURED_ID } from '../data/releases';

interface ArchiveContextType {
  releases: Release[];
  featuredRelease: Release;
  selectedRelease: Release | null;
  setSelectedRelease: (release: Release | null) => void;
  scrollProgress: number;
  setScrollProgress: (p: number) => void;
  cameraZ: number;
  setCameraZ: (z: number) => void;
  mouseParallax: { x: number; y: number };
  setMouseParallax: (pos: { x: number; y: number }) => void;
  archiveRotation: number;
  setArchiveRotation: React.Dispatch<React.SetStateAction<number>>;
  isDraggingArchive: boolean;
  setIsDraggingArchive: (dragging: boolean) => void;
  autoRotate: boolean;
  setAutoRotate: React.Dispatch<React.SetStateAction<boolean>>;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeYearFilter: number | null;
  setActiveYearFilter: (year: number | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Admin Actions
  addRelease: (release: Omit<Release, 'id'>) => void;
  updateRelease: (id: string, data: Partial<Release>) => void;
  deleteRelease: (id: string) => void;
  toggleFeatured: (id: string) => void;
  togglePublish: (id: string) => void;
  reorderReleases: (startIndex: number, endIndex: number) => void;
  importJSON: (jsonStr: string) => boolean;
  exportJSON: () => string;
  resetToVerified: () => void;
}

const STORAGE_KEY = 'dynex_archive_releases_v1';
const LANG_KEY = 'dynex_archive_language';

const ArchiveContext = createContext<ArchiveContextType | undefined>(undefined);

export const ArchiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load releases from localStorage or default to verified catalog
  const [releases, setReleases] = useState<Release[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved releases, using defaults', e);
    }
    return VERIFIED_RELEASES;
  });

  // Language state (default Russian)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang === 'ru' || savedLang === 'en') return savedLang;
    } catch {
      // ignore
    }
    return 'ru';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  // Save releases to localStorage when modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(releases));
    } catch (e) {
      console.error('Failed to persist releases to localStorage', e);
    }
  }, [releases]);

  // Active featured release
  const featuredRelease = useMemo(() => {
    const featured = releases.find(r => r.featured && r.published !== false);
    if (featured) return featured;
    const initial = releases.find(r => r.id === INITIAL_FEATURED_ID && r.published !== false);
    return initial || releases[0] || VERIFIED_RELEASES[0];
  }, [releases]);

  // Selected release for 3D cinematic focus modal
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  // 3D camera / scroll states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cameraZ, setCameraZ] = useState(0);
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 });
  const [archiveRotation, setArchiveRotation] = useState(0);
  const [isDraggingArchive, setIsDraggingArchive] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  // Filters
  const [activeYearFilter, setActiveYearFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin CRUD
  const addRelease = useCallback((newRelease: Omit<Release, 'id'>) => {
    const id = `dynex-custom-${Date.now()}`;
    const fullRelease: Release = {
      ...newRelease,
      id,
      published: true,
      verified: true,
      verificationStatus: 'MANUAL',
    };
    setReleases(prev => [fullRelease, ...prev]);
  }, []);

  const updateRelease = useCallback((id: string, data: Partial<Release>) => {
    setReleases(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
    if (selectedRelease && selectedRelease.id === id) {
      setSelectedRelease(prev => prev ? { ...prev, ...data } : null);
    }
  }, [selectedRelease]);

  const deleteRelease = useCallback((id: string) => {
    setReleases(prev => prev.filter(r => r.id !== id));
    if (selectedRelease && selectedRelease.id === id) {
      setSelectedRelease(null);
    }
  }, [selectedRelease]);

  const toggleFeatured = useCallback((id: string) => {
    setReleases(prev => prev.map(r => ({
      ...r,
      featured: r.id === id
    })));
  }, []);

  const togglePublish = useCallback((id: string) => {
    setReleases(prev => prev.map(r => r.id === id ? { ...r, published: !r.published } : r));
  }, []);

  const reorderReleases = useCallback((startIndex: number, endIndex: number) => {
    setReleases(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const importJSON = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title) {
        setReleases(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const exportJSON = useCallback(() => {
    return JSON.stringify(releases, null, 2);
  }, [releases]);

  const resetToVerified = useCallback(() => {
    setReleases(VERIFIED_RELEASES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ArchiveContext.Provider
      value={{
        releases,
        featuredRelease,
        selectedRelease,
        setSelectedRelease,
        scrollProgress,
        setScrollProgress,
        cameraZ,
        setCameraZ,
        mouseParallax,
        setMouseParallax,
        archiveRotation,
        setArchiveRotation,
        isDraggingArchive,
        setIsDraggingArchive,
        autoRotate,
        setAutoRotate,
        language,
        setLanguage,
        activeYearFilter,
        setActiveYearFilter,
        searchQuery,
        setSearchQuery,
        addRelease,
        updateRelease,
        deleteRelease,
        toggleFeatured,
        togglePublish,
        reorderReleases,
        importJSON,
        exportJSON,
        resetToVerified,
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

export const useArchive = () => {
  const context = useContext(ArchiveContext);
  if (!context) {
    throw new Error('useArchive must be used within an ArchiveProvider');
  }
  return context;
};
