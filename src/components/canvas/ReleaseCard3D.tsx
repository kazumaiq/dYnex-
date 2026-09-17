import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Release } from '../../types';

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
  const [textureError, setTextureError] = useState(false);

  // Load official artwork texture with procedural fallback on failure
  let texture: THREE.Texture | null = null;
  try {
    if (release.artworkUrl && !textureError) {
      texture = useTexture(release.artworkUrl);
      if (texture) {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
      }
    }
  } catch {
    // fallback
  }

  // Current interpolated position/rotation
  const currentPos = useRef(new THREE.Vector3(...targetPos));
  const currentRot = useRef(new THREE.Euler(...targetRot));

  // Front material: Artwork texture or Procedural Fallback
  const frontMaterial = useMemo(() => {
    if (texture && !textureError) {
      return new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.25,
        metalness: 0.1,
      });
    }

    // Procedural Fallback Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#08090C';
      ctx.fillRect(0, 0, 512, 512);
      // Technical borders
      ctx.strokeStyle = '#1A1B20';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 480, 480);
      // Red corner markers
      ctx.fillStyle = '#E61924';
      ctx.fillRect(16, 16, 24, 6);
      ctx.fillRect(16, 16, 6, 24);
      // Text
      ctx.font = 'bold 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#F2F2EE';
      ctx.fillText('dYnex?', 36, 80);
      ctx.font = '24px monospace';
      ctx.fillStyle = '#77777D';
      ctx.fillText(release.title.substring(0, 20), 36, 140);
      ctx.fillText(String(release.year), 36, 180);
    }
    const canvasTex = new THREE.CanvasTexture(canvas);
    return new THREE.MeshStandardMaterial({
      map: canvasTex,
      roughness: 0.3,
      metalness: 0.1,
    });
  }, [texture, textureError, release.title, release.year]);

  // Dark industrial materials for sides and back
  const sideMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0D0E12',
    roughness: 0.7,
    metalness: 0.3,
  }), []);

  const edgeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: isFeatured || hovered ? '#E61924' : '#1A1B20',
    wireframe: true,
  }), [isFeatured, hovered]);

  // Materials array for BoxGeometry: [right, left, top, bottom, front, back]
  const boxMaterials = useMemo(() => [
    sideMaterial, // +X
    sideMaterial, // -X
    sideMaterial, // +Y
    sideMaterial, // -Y
    frontMaterial,// +Z (front cover)
    sideMaterial, // -Z (back)
  ], [frontMaterial, sideMaterial]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    let destPos = new THREE.Vector3(...targetPos);
    let destRot = new THREE.Euler(...targetRot);

    // If selected, fly directly in front of camera lens for cinematic focus
    if (isSelected) {
      destPos.set(0, 0, cameraZ - 28);
      destRot.set(0, 0, 0);
    } else if (hovered) {
      // Approach cursor slightly
      destPos.z += 3.5;
    }

    // Smooth interpolation with delta damping
    const lerpSpeed = isSelected ? 4.5 : 3.5;
    currentPos.current.lerp(destPos, delta * lerpSpeed);
    meshRef.current.position.copy(currentPos.current);

    // Smooth rotation slerp
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, destRot.x, delta * lerpSpeed);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, destRot.y, delta * lerpSpeed);
    meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, destRot.z, delta * lerpSpeed);

    // Idle floating micro-bobbing when not selected
    if (!isSelected) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y += Math.sin(t * 1.5 + targetPos[0]) * 0.015;
    }
  });

  const cardWidth = isFeatured ? 14 : 11;
  const cardHeight = isFeatured ? 14 : 11;
  const cardDepth = 0.35;

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
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Physical Release Card Box */}
      <mesh material={boxMaterials} castShadow receiveShadow>
        <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
      </mesh>

      {/* Subtle glowing edge reticle */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(cardWidth + 0.05, cardHeight + 0.05, cardDepth + 0.05)]} />
        <lineBasicMaterial
          color={isSelected || hovered ? '#E61924' : isFeatured ? '#E61924' : '#2A2B33'}
          transparent
          opacity={isSelected || hovered ? 0.9 : isFeatured ? 0.65 : 0.25}
        />
      </lineSegments>

      {/* Small technical indicator when hovered */}
      {hovered && !isSelected && (
        <group position={[0, -cardHeight / 2 - 1.5, 0.5]}>
          <mesh>
            <planeGeometry args={[5, 1]} />
            <meshBasicMaterial color="#050507" transparent opacity={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
};
