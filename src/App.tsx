import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArchiveProvider } from './context/ArchiveContext';
import { CommunityProvider, useCommunity } from './context/CommunityContext';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { Navbar } from './components/ui/Navbar';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { CustomCursor } from './components/ui/CustomCursor';
import { ReleaseDetailModal } from './components/ui/ReleaseDetailModal';
import { MarqueeSection } from './components/ui/MarqueeSection';
import { Footer } from './components/ui/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { ArchiveSection } from './components/sections/ArchiveSection';
import { StickyReleaseStack } from './components/sections/StickyReleaseStack';
import { CommunitySection } from './components/sections/CommunitySection';
import { AboutSection } from './components/sections/AboutSection';
import { TimelineSection } from './components/sections/TimelineSection';
import { NetworkSection } from './components/sections/NetworkSection';
import { MusicPlatformsSection } from './components/sections/MusicPlatformsSection';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Code Splitting: Lazy-load heavy administrative panel and community modals on demand
const AdminPanel = lazy(() => import('./pages/AdminPanel').then(m => ({ default: m.AdminPanel })));
const AuthModal = lazy(() => import('./components/community/AuthModal').then(m => ({ default: m.AuthModal })));
const UserProfileModal = lazy(() => import('./components/community/UserProfileModal').then(m => ({ default: m.UserProfileModal })));
const TraceWallModal = lazy(() => import('./components/community/TraceWallModal').then(m => ({ default: m.TraceWallModal })));
const SignatureWallModal = lazy(() => import('./components/community/SignatureWallModal').then(m => ({ default: m.SignatureWallModal })));
const TransmissionModal = lazy(() => import('./components/community/TransmissionModal').then(m => ({ default: m.TransmissionModal })));
const CollabModal = lazy(() => import('./components/community/CollabModal').then(m => ({ default: m.CollabModal })));
const SecretNodeModal = lazy(() => import('./components/community/SecretNodeModal').then(m => ({ default: m.SecretNodeModal })));

const MainContent: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const {
    isAuthModalOpen,
    isProfileOpen,
    isTraceWallOpen,
    isSignatureWallOpen,
    isTransmissionOpen,
    isCollabOpen,
    isSecretNodeOpen,
  } = useCommunity();

  // Check URL hash or path for admin
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        path === '/admin' ||
        path.startsWith('/admin/') ||
        hash === '#admin'
      ) {
        setIsAdminOpen(true);
      } else {
        setIsAdminOpen(false);
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф')) ||
          (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A' || e.key === 'ф' || e.key === 'Ф'))) {
        e.preventDefault();
        setIsAdminOpen((prev) => {
          const next = !prev;
          if (next) {
            window.location.hash = '#admin';
          } else {
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Determine if any opaque modal is open to pause 3D WebGL rendering
  const isAnyModalOpen =
    isAdminOpen ||
    isAuthModalOpen ||
    isProfileOpen ||
    isTraceWallOpen ||
    isSignatureWallOpen ||
    isTransmissionOpen ||
    isCollabOpen ||
    isSecretNodeOpen;

  return (
    <div className="relative w-full min-h-screen bg-void-950 text-technical-light overflow-x-hidden">
      {/* 01. Fast Boot Loading Screen */}
      <LoadingScreen onComplete={() => {}} />

      {/* 02. Minimalist Desktop Cursor */}
      <CustomCursor />

      {/* 03. Primary 3D WebGL World (Persistent Background, pauses when modal covers screen) */}
      <ErrorBoundary>
        <SceneCanvas isPaused={isAnyModalOpen} />
      </ErrorBoundary>

      {/* Tactile CRT Scanline & Grain Texture Layer (GPU friendly standard compositing) */}
      <div className="fixed inset-0 z-20 pointer-events-none crt-overlay opacity-20" />

      {/* Anime Light Leak Prism & Ambient Glow Layer */}
      <div className="fixed inset-0 z-20 pointer-events-none anime-prism-overlay opacity-25" />

      {/* 04. Top Navigation Bar */}
      <Navbar />

      {/* 05. HTML Content Layer over 3D World */}
      <main className="relative z-10 w-full flex flex-col pointer-events-none">
        <HeroSection />
        <ArchiveSection />
        <StickyReleaseStack />
        <MarqueeSection />
        <CommunitySection />
        <AboutSection />
        <TimelineSection />
        <NetworkSection />
        <MusicPlatformsSection />
      </main>

      {/* 06. Footer */}
      <Footer />

      {/* 07. Integrated 3D Release Detail Modal */}
      <ReleaseDetailModal />

      {/* 08. Interactive Community Archive Modals (Mounted only when active) */}
      <Suspense fallback={null}>
        {isAuthModalOpen && <AuthModal />}
        {isProfileOpen && <UserProfileModal />}
        {isTraceWallOpen && <TraceWallModal />}
        {isSignatureWallOpen && <SignatureWallModal />}
        {isTransmissionOpen && <TransmissionModal />}
        {isCollabOpen && <CollabModal />}
        {isSecretNodeOpen && <SecretNodeModal />}

        {/* 09. Administrative System Modal (Accessible only via /admin) */}
        {isAdminOpen && (
          <AdminPanel
            onClose={() => {
              setIsAdminOpen(false);
              if (window.location.pathname.toLowerCase().startsWith('/admin')) {
                window.history.pushState(null, '', '/');
              } else if (window.location.hash.toLowerCase() === '#admin') {
                window.history.pushState(null, '', window.location.pathname);
              }
            }}
          />
        )}
      </Suspense>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ArchiveProvider>
        <CommunityProvider>
          <MainContent />
        </CommunityProvider>
      </ArchiveProvider>
    </ErrorBoundary>
  );
};

export default App;
