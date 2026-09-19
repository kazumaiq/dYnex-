import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useArchive } from '../../context/ArchiveContext';
import { Starfield } from './Starfield';
import { DistantGeometry } from './DistantGeometry';
import { AtmosphericLights } from './AtmosphericLights';
import { ReleaseWorld } from './ReleaseWorld';
import { CollaboratorNetwork3D } from './CollaboratorNetwork3D';

interface SectionWaypoint {
  id: string;
  zDesktop: number;
  zMobile: number;
}

const SECTION_WAYPOINTS: SectionWaypoint[] = [
  { id: 'hero', zDesktop: 0, zMobile: 0 },
  { id: 'archive', zDesktop: -1060, zMobile: -1070 },
  { id: 'about', zDesktop: -2200, zMobile: -2200 },
  { id: 'timeline', zDesktop: -2800, zMobile: -2800 },
  { id: 'network', zDesktop: -3360, zMobile: -3360 },
  { id: 'platforms', zDesktop: -4200, zMobile: -4200 },
];

// Cached waypoint Y positions to completely eliminate forced layout thrashing on scroll
let cachedWaypoints: { z: number; y: number }[] = [];

function measureWaypoints(isMobile: boolean) {
  if (typeof window === 'undefined') return;
  const scrollY = window.scrollY;
  const points: { z: number; y: number }[] = [];

  for (const wp of SECTION_WAYPOINTS) {
    const el = document.getElementById(wp.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const centerY = scrollY + rect.top + rect.height * 0.5;
      const targetZ = isMobile ? wp.zMobile : wp.zDesktop;
      points.push({ z: targetZ, y: centerY });
    }
  }

  if (points.length >= 2) {
    cachedWaypoints = points;
  }
}

function computeTargetCameraZFast(isMobile: boolean, scrollY: number): number {
  if (typeof window === 'undefined') return 0;
  const viewportCenter = scrollY + window.innerHeight * 0.5;

  if (cachedWaypoints.length < 2) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(Math.max(scrollY / scrollHeight, 0), 1) : 0;
    return -progress * 5800;
  }

  // Before first waypoint
  if (viewportCenter <= cachedWaypoints[0].y) {
    return cachedWaypoints[0].z;
  }

  // Beyond last waypoint
  if (viewportCenter >= cachedWaypoints[cachedWaypoints.length - 1].y) {
    return cachedWaypoints[cachedWaypoints.length - 1].z;
  }

  // Interpolate between the two bounding waypoints in memory (no DOM read)
  for (let i = 0; i < cachedWaypoints.length - 1; i++) {
    const p1 = cachedWaypoints[i];
    const p2 = cachedWaypoints[i + 1];

    if (viewportCenter >= p1.y && viewportCenter <= p2.y) {
      const span = p2.y - p1.y;
      if (span <= 0) return p1.z;
      const rawT = (viewportCenter - p1.y) / span;
      // Cosine S-curve interpolation
      const smoothT = 0.5 * (1 - Math.cos(rawT * Math.PI));
      return p1.z + (p2.z - p1.z) * smoothT;
    }
  }

  return cachedWaypoints[0].z;
}

// Camera Rig controlling Z travel, mouse parallax, and scene elements
const CameraRig: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { camera } = useThree();
  const { autoRotate, isDraggingArchive, setArchiveRotation } = useArchive();

  const currentCamZ = useRef(0);

  useFrame((state, delta) => {
    // 1. Calculate target Z directly without React state or layout reflows
    const targetZ = computeTargetCameraZFast(isMobile, window.scrollY);
    currentCamZ.current = THREE.MathUtils.lerp(
      currentCamZ.current,
      targetZ,
      Math.min(delta * 4.5, 0.25)
    );

    // 2. Mouse parallax using R3F state.pointer (0 React state overhead)
    const pointerX = isMobile ? 0 : state.pointer.x;
    const pointerY = isMobile ? 0 : state.pointer.y;
    const parallaxFactor = isMobile ? 0 : 3.0;
    const targetX = pointerX * parallaxFactor;
    const targetY = pointerY * (parallaxFactor * 0.6);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, Math.min(delta * 3, 0.2));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, Math.min(delta * 3, 0.2));
    camera.position.z = currentCamZ.current;

    // Subtle look-at / tilt
    if (!isMobile) {
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -pointerX * 0.025, Math.min(delta * 3, 0.2));
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, pointerY * 0.018, Math.min(delta * 3, 0.2));
    }

    // Auto-rotation when enabled and not dragging
    if (autoRotate && !isDraggingArchive) {
      setArchiveRotation((prev) => prev - delta * 0.35);
    }
  });

  return (
    <Suspense fallback={null}>
      <AtmosphericLights cameraZ={currentCamZ.current} />
      <Starfield cameraZ={currentCamZ.current} scrollVelocity={0} isMobile={isMobile} />
      <DistantGeometry />
      <ReleaseWorld cameraZ={currentCamZ.current} isMobile={isMobile} />
      <CollaboratorNetwork3D cameraZ={currentCamZ.current} />
    </Suspense>
  );
};

export const SceneCanvas: React.FC<{ isPaused?: boolean }> = ({ isPaused = false }) => {
  const { setArchiveRotation, setIsDraggingArchive } = useArchive();
  const [isMobile, setIsMobile] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(
    typeof document !== 'undefined' ? !document.hidden : true
  );

  // Detect mobile & measure waypoints on resize
  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobile);
      measureWaypoints(mobile);
    };

    updateDimensions();
    // Re-measure after initial DOM settlement
    const initialTimer = setTimeout(updateDimensions, 400);

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateDimensions, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(initialTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Page Visibility API to pause rendering when tab is inactive
  useEffect(() => {
    const handleVisibility = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Drag interaction for 3D Archive Ring
  const isPointerDown = useRef(false);
  const lastPointerX = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    lastPointerX.current = e.clientX;
    setIsDraggingArchive(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const deltaX = e.clientX - lastPointerX.current;
    lastPointerX.current = e.clientX;
    setArchiveRotation((prev) => prev + deltaX * (isMobile ? 0.008 : 0.005));
  };

  const handlePointerUp = () => {
    isPointerDown.current = false;
    setIsDraggingArchive(false);
  };

  const shouldRender = isTabVisible && !isPaused;

  return (
    <div
      className="fixed inset-0 w-full h-full z-0 pointer-events-auto select-none touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        frameloop={shouldRender ? 'always' : 'never'}
        camera={{
          fov: isMobile ? 58 : 45,
          near: 0.5,
          far: 8000,
          position: [0, 0, 0],
        }}
        dpr={isMobile ? Math.min(window.devicePixelRatio || 1, 1.1) : Math.min(window.devicePixelRatio || 1, 1.5)}
        gl={{
          antialias: !isMobile,
          alpha: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020204', 1);
        }}
      >
        <CameraRig isMobile={isMobile} />
      </Canvas>
    </div>
  );
};
