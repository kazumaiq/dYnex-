import React, { useState, useEffect } from 'react';
import { ArchiveProvider, useArchive } from './context/ArchiveContext';
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
import { AboutSection } from './components/sections/AboutSection';
import { TimelineSection } from './components/sections/TimelineSection';
import { NetworkSection } from './components/sections/NetworkSection';
import { MusicPlatformsSection } from './components/sections/MusicPlatformsSection';
import { AdminPanel } from './pages/AdminPanel';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const MainContent: React.FC = () => {
  const { setScrollProgress } = useArchive();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Check URL hash or path for admin
  useEffect(() => {
    const checkRoute = () => {
      if (
        window.location.pathname === '/admin' ||
        window.location.hash === '#admin'
      ) {
        setIsAdminOpen(true);
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Track page scroll to drive 3D camera along Z axis
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrollProgress]);

  return (
    <div className="relative w-full min-h-screen bg-void-950 text-technical-light overflow-x-hidden">
      {/* 01. Fast Boot Loading Screen */}
      <LoadingScreen onComplete={() => {}} />

      {/* 02. Minimalist Desktop Cursor */}
      <CustomCursor />

      {/* 03. Primary 3D WebGL World (Persistent Background) wrapped in ErrorBoundary */}
      <ErrorBoundary>
        <SceneCanvas />
      </ErrorBoundary>

      {/* Tactile CRT Scanline & Grain Texture Layer */}
      <div className="fixed inset-0 z-20 pointer-events-none crt-overlay opacity-25 mix-blend-screen" />

      {/* 04. Top Navigation Bar */}
      <Navbar />

      {/* 05. HTML Content Layer over 3D World */}
      <main className="relative z-10 w-full flex flex-col pointer-events-none">
        <HeroSection />
        <ArchiveSection />
        <StickyReleaseStack />
        <MarqueeSection />
        <AboutSection />
        <TimelineSection />
        <NetworkSection />
        <MusicPlatformsSection />
      </main>

      {/* 06. Footer with Admin Gateway */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* 07. Integrated 3D Release Detail Modal */}
      <ReleaseDetailModal />

      {/* 08. Administrative System Modal / Overlay */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname);
            }
          }}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ArchiveProvider>
        <MainContent />
      </ArchiveProvider>
    </ErrorBoundary>
  );
};

export default App;
