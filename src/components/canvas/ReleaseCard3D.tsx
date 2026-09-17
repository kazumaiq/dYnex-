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
  cameraZ: number;
  onSelect: (release: Release) => void;
}

export const ReleaseCard3D: React.FC<ReleaseCard3DProps> = ({
  release,
  targetPos,
  targetRot,
  isFeatured = false,
  isSelected = false,
  cameraZ,
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
        // Silently use procedural fallback without crashing
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

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    let destPos = new THREE.Vector3(...targetPos);
    let destRot = new THREE.Euler(...targetRot);

    // If selected, fly directly in front of the camera
    if (isSelected) {
      destPos.set(0, 0, cameraZ - 28);
      destRot.set(0, 0, 0);
    } else if (hovered) {
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
    const distToCam = Math.abs(meshRef.current.position.z - cameraZ);
    if (!isSelected && distToCam < 200) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y += Math.sin(t * 1.5 + targetPos[0]) * 0.012;
    }
  });

  const cardWidth = isFeatured ? 13 : 10;
  const cardHeight = isFeatured ? 13 : 10;
  const cardDepth = 0.3;

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
      {/* 3D Physical Release Box */}
      <mesh material={boxMaterials}>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      </mesh>

      {/* Glowing Edge Border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(cardWidth + 0.04, cardHeight + 0.04, cardDepth + 0.04)]} />
        <lineBasicMaterial
          color={isSelected || hovered ? '#E61924' : isFeatured ? '#E61924' : '#1A1B20'}
          transparent
          opacity={isSelected || hovered ? 0.9 : isFeatured ? 0.6 : 0.25}
        />
      </lineSegments>
    </group>
  );
};
