import React, { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useArchive } from '../../context/ArchiveContext';
import { Starfield } from './Starfield';
import { DistantGeometry } from './DistantGeometry';
import { AtmosphericLights } from './AtmosphericLights';
import { ReleaseWorld } from './ReleaseWorld';
import { CollaboratorNetwork3D } from './CollaboratorNetwork3D';

// Camera Rig controlling Z travel, mouse parallax, and drag inertia
const CameraRig: React.FC<{
  scrollZ: number;
  scrollVelocity: number;
  isMobile: boolean;
}> = ({ scrollZ, scrollVelocity, isMobile }) => {
  const { camera } = useThree();
  const { mouseParallax, setCameraZ, setArchiveRotation, isDraggingArchive, autoRotate } = useArchive();

  // Inertia state for archive rotation
  const dragVelocity = useRef(0);
  const targetCamZ = useRef(scrollZ);
  const currentCamZ = useRef(0);

  useEffect(() => {
    targetCamZ.current = scrollZ;
  }, [scrollZ]);

  useFrame((state, delta) => {
    // Smooth camera Z interpolation
    currentCamZ.current = THREE.MathUtils.lerp(
      currentCamZ.current,
      targetCamZ.current,
      Math.min(delta * 4, 0.2)
    );
    setCameraZ(currentCamZ.current);

    // Mouse parallax offsets (heavy, cinematic)
    const parallaxFactor = isMobile ? 0.8 : 3.0;
    const targetX = mouseParallax.x * parallaxFactor;
    const targetY = mouseParallax.y * (parallaxFactor * 0.6);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, Math.min(delta * 3, 0.2));
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, Math.min(delta * 3, 0.2));
    camera.position.z = currentCamZ.current;

    // Subtle look-at / tilt
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      -mouseParallax.x * 0.025,
      Math.min(delta * 3, 0.2)
    );
    camera.rotation.x = THREE.MathUtils.lerp(
      camera.rotation.x,
      mouseParallax.y * 0.018,
      Math.min(delta * 3, 0.2)
    );

    // Auto-rotation when enabled and not dragging
    if (autoRotate && !isDraggingArchive) {
      setArchiveRotation((prev) => prev - delta * 0.35);
    }

    // Inertial deceleration for archive rotation
    if (!isDraggingArchive && Math.abs(dragVelocity.current) > 0.0001) {
      setArchiveRotation((prev) => prev + dragVelocity.current);
      dragVelocity.current *= 0.94; // friction damping
    }
  });

  return (
    <Suspense fallback={null}>
      <AtmosphericLights cameraZ={currentCamZ.current} />
      <Starfield cameraZ={currentCamZ.current} scrollVelocity={scrollVelocity} isMobile={isMobile} />
      <DistantGeometry />
      <ReleaseWorld cameraZ={currentCamZ.current} isMobile={isMobile} />
      <CollaboratorNetwork3D cameraZ={currentCamZ.current} />
    </Suspense>
  );
};

interface SectionWaypoint {
  id: string;
  zDesktop: number;
  zMobile: number;
}

const SECTION_WAYPOINTS: SectionWaypoint[] = [
  { id: 'hero', zDesktop: 0, zMobile: 0 },
  { id: 'archive', zDesktop: -1060, zMobile: -1095 },
  { id: 'about', zDesktop: -2200, zMobile: -2200 },
  { id: 'timeline', zDesktop: -2800, zMobile: -2800 },
  { id: 'network', zDesktop: -3360, zMobile: -3360 },
  { id: 'platforms', zDesktop: -4200, zMobile: -4200 },
];

function computeTargetCameraZ(isMobile: boolean): number {
  if (typeof window === 'undefined') return 0;

  const scrollY = window.scrollY;
  const viewportCenter = scrollY + window.innerHeight * 0.5;

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

  // Fallback if sections are not yet rendered in DOM
  if (points.length < 2) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? Math.min(Math.max(scrollY / scrollHeight, 0), 1) : 0;
    return -progress * 5800;
  }

  // Before first waypoint
  if (viewportCenter <= points[0].y) {
    return points[0].z;
  }

  // Beyond last waypoint
  if (viewportCenter >= points[points.length - 1].y) {
    return points[points.length - 1].z;
  }

  // Interpolate between the two bounding waypoints
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    if (viewportCenter >= p1.y && viewportCenter <= p2.y) {
      const span = p2.y - p1.y;
      if (span <= 0) return p1.z;
      const rawT = (viewportCenter - p1.y) / span;
      // Cosine S-curve interpolation for smooth cinematic acceleration & deceleration
      const smoothT = 0.5 * (1 - Math.cos(rawT * Math.PI));
      return p1.z + (p2.z - p1.z) * smoothT;
    }
  }

  return points[0].z;
}

export const SceneCanvas: React.FC = () => {
  const {
    setMouseParallax,
    setArchiveRotation,
    setIsDraggingArchive,
  } = useArchive();

  const [isMobile, setIsMobile] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [targetCamZ, setTargetCamZ] = useState(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute waypoint-based camera Z dynamically
  useEffect(() => {
    const updateCamZ = () => {
      setTargetCamZ(computeTargetCameraZ(isMobile));
    };

    updateCamZ();
    window.addEventListener('scroll', updateCamZ, { passive: true });
    window.addEventListener('resize', updateCamZ);

    const timer = setTimeout(updateCamZ, 120);
    return () => {
      window.removeEventListener('scroll', updateCamZ);
      window.removeEventListener('resize', updateCamZ);
      clearTimeout(timer);
    };
  }, [isMobile]);

  // Compute scroll velocity
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const dt = Math.max(1, now - lastScrollTime.current);
      const dy = window.scrollY - lastScrollY.current;
      const vel = (dy / dt) * 10;
      setScrollVelocity(vel);
      lastScrollY.current = window.scrollY;
      lastScrollTime.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse Parallax Listener
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouseParallax({ x, y });
    },
    [isMobile, setMouseParallax]
  );

  // Drag Interaction with Inertia for 3D Archive Ring
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

  return (
    <div
      className="fixed inset-0 w-full h-full z-0 pointer-events-auto select-none touch-pan-y"
      onMouseMove={handleMouseMove}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Canvas
        camera={{
          fov: isMobile ? 58 : 45,
          near: 0.5,
          far: 9000,
          position: [0, 0, 0],
        }}
        dpr={isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 1.75)}
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
        <CameraRig
          scrollZ={targetCamZ}
          scrollVelocity={scrollVelocity}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
};
