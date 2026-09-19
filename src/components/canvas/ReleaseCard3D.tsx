import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Release } from '../../types';

// Global texture cache to prevent duplicate fetches across re-renders
const textureCache = new Map<string, THREE.Texture>();
const loader = new THREE.TextureLoader();

// Shared procedural fallback canvas texture (generated once in memory)
let sharedFallbackTexture: THREE.CanvasTexture | null = null;
function getSharedFallbackTexture(): THREE.CanvasTexture {
  if (!sharedFallbackTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#1A1B20';
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, 240, 240);
      ctx.fillStyle = '#E61924';
      ctx.fillRect(8, 8, 16, 4);
      ctx.fillRect(8, 8, 4, 16);
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#F2F2EE';
      ctx.fillText('dYnex?', 20, 50);
      ctx.font = '16px monospace';
      ctx.fillStyle = '#77777D';
      ctx.fillText('ARCHIVE', 20, 90);
    }
    sharedFallbackTexture = new THREE.CanvasTexture(canvas);
  }
  return sharedFallbackTexture;
}

// Pre-allocated shared geometries to eliminate garbage collection & memory leaks
const geometryCache = new Map<string, { box: THREE.BoxGeometry; edges: THREE.EdgesGeometry }>();

function getSharedCardGeometries(width: number, height: number, depth: number) {
  const key = `${width}_${height}_${depth}`;
  let cached = geometryCache.get(key);
  if (!cached) {
    const box = new THREE.BoxGeometry(width, height, depth);
    const edgesBox = new THREE.BoxGeometry(width + 0.04, height + 0.04, depth + 0.04);
    const edges = new THREE.EdgesGeometry(edgesBox);
    edgesBox.dispose(); // clean up temporary box
    cached = { box, edges };
    geometryCache.set(key, cached);
  }
  return cached;
}

// Shared dark materials for card sides and back
const sharedSideMaterial = new THREE.MeshStandardMaterial({
  color: '#08090C',
  roughness: 0.8,
  metalness: 0.2,
});

interface ReleaseCard3DProps {
  release: Release;
  targetPos: [number, number, number];
  targetRot: [number, number, number];
  isFeatured?: boolean;
  isSelected?: boolean;
  cameraZ?: number;
  isMobile?: boolean;
  onSelect: (release: Release) => void;
}

export const ReleaseCard3D: React.FC<ReleaseCard3DProps> = ({
  release,
  targetPos,
  targetRot,
  isFeatured = false,
  isSelected = false,
  isMobile = false,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(() => {
    return release.artworkUrl ? textureCache.get(release.artworkUrl) || null : null;
  });

  // Asynchronous non-suspending texture loading
  useEffect(() => {
    if (!release.artworkUrl) return;

    if (textureCache.has(release.artworkUrl)) {
      setTexture(textureCache.get(release.artworkUrl)!);
      return;
    }

    let isMounted = true;
    loader.load(
      release.artworkUrl,
      (loadedTex) => {
        if (!isMounted) return;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        textureCache.set(release.artworkUrl, loadedTex);
        setTexture(loadedTex);
      },
      undefined,
      (err) => {
        console.warn(`Could not load artwork for ${release.title}`, err);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [release.artworkUrl, release.title]);

  // Current interpolated position and rotation vectors
  const currentPos = useRef(new THREE.Vector3(...targetPos));

  // Front cover material: loaded texture or instant procedural fallback
  const frontMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: texture || getSharedFallbackTexture(),
      roughness: 0.35,
      metalness: 0.15,
    });
  }, [texture]);

  // Materials array for BoxGeometry: [+X, -X, +Y, -Y, +Z (cover), -Z (back)]
  const boxMaterials = useMemo(() => [
    sharedSideMaterial,
    sharedSideMaterial,
    sharedSideMaterial,
    sharedSideMaterial,
    frontMaterial,
    sharedSideMaterial,
  ], [frontMaterial]);

  const cardWidth = isFeatured ? (isMobile ? 11.5 : 13) : (isMobile ? 9.6 : 10);
  const cardHeight = cardWidth;
  const cardDepth = 0.35;

  const { box: cardBoxGeo, edges: cardEdgesGeo } = useMemo(
    () => getSharedCardGeometries(cardWidth, cardHeight, cardDepth),
    [cardWidth, cardHeight, cardDepth]
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const camZ = state.camera.position.z;

    let destPos = new THREE.Vector3(...targetPos);
    let destRot = new THREE.Euler(...targetRot);

    // If selected, fly directly in front of the camera
    if (isSelected) {
      destPos.set(0, isMobile ? 0.8 : 0, camZ - (isMobile ? 22 : 26));
      destRot.set(0, 0, 0);
    } else if (hovered && !isMobile) {
      destPos.z += 3;
    }

    // High performance lerp
    const lerpSpeed = isSelected ? 4.5 : 3.5;
    currentPos.current.lerp(destPos, delta * lerpSpeed);
    meshRef.current.position.copy(currentPos.current);

    // Smooth rotation slerp
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, destRot.x, delta * lerpSpeed);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, destRot.y, delta * lerpSpeed);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, destRot.z, delta * lerpSpeed);

    // Micro-bobbing only when close to viewport to save mobile CPU
    const distToCam = Math.abs(meshRef.current.position.z - camZ);
    if (!isSelected && distToCam < 200) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y += Math.sin(t * 1.5 + targetPos[0]) * (isMobile ? 0.006 : 0.012);
    }
  });

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(release);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => {
        setHovered(false);
      }}
    >
      {/* 3D Physical Release Box using shared cached geometry */}
      <mesh geometry={cardBoxGeo} material={boxMaterials} />

      {/* Glowing Edge Border using shared cached edges */}
      <lineSegments geometry={cardEdgesGeo}>
        <lineBasicMaterial
          color={isSelected || hovered ? '#E61924' : isFeatured ? '#E61924' : '#1A1B20'}
          transparent
          opacity={isSelected || hovered ? 0.9 : isFeatured ? 0.6 : 0.25}
        />
      </lineSegments>
    </group>
  );
};
