import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  cameraZ: number;
  scrollVelocity: number;
  isMobile: boolean;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const Starfield: React.FC<StarfieldProps> = ({ cameraZ, scrollVelocity, isMobile }) => {
  // Adaptive particle counts: mobile is lightweight for 60fps, desktop is high density
  const counts = useMemo(() => {
    return isMobile
      ? { deep: 500, mid: 300, near: 100, fg: 30 }
      : { deep: 1400, mid: 800, near: 300, fg: 80 };
  }, [isMobile]);

  // Layer 1: Deep Stars
  const deepStars = useMemo(() => {
    const count = counts.deep;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 101;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (pseudoRandom(s++) - 0.5) * 4500;
      positions[i * 3 + 1] = (pseudoRandom(s++) - 0.5) * 3000;
      positions[i * 3 + 2] = (pseudoRandom(s++) - 0.5) * 8000 - 3000;

      const b = 0.25 + pseudoRandom(s++) * 0.35;
      colors[i * 3] = b;
      colors[i * 3 + 1] = b;
      colors[i * 3 + 2] = b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [counts.deep]);

  // Layer 2: Mid Stars
  const midStars = useMemo(() => {
    const count = counts.mid;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 505;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (pseudoRandom(s++) - 0.5) * 3000;
      positions[i * 3 + 1] = (pseudoRandom(s++) - 0.5) * 2000;
      positions[i * 3 + 2] = (pseudoRandom(s++) - 0.5) * 7500 - 3000;

      const isRed = pseudoRandom(s++) < 0.03;
      if (isRed) {
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.1;
        colors[i * 3 + 2] = 0.15;
      } else {
        const b = 0.5 + pseudoRandom(s++) * 0.4;
        colors[i * 3] = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [counts.mid]);

  // Layer 3: Near Stars
  const nearStars = useMemo(() => {
    const count = counts.near;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 909;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (pseudoRandom(s++) - 0.5) * 1600;
      positions[i * 3 + 1] = (pseudoRandom(s++) - 0.5) * 1200;
      positions[i * 3 + 2] = (pseudoRandom(s++) - 0.5) * 7000 - 3000;

      const isRed = pseudoRandom(s++) < 0.05;
      if (isRed) {
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.18;
      } else {
        const b = 0.8 + pseudoRandom(s++) * 0.2;
        colors[i * 3] = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [counts.near]);

  // Layer 4: Foreground passing particles
  const fgStars = useMemo(() => {
    const count = counts.fg;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 1337;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (pseudoRandom(s++) - 0.5) * 800;
      positions[i * 3 + 1] = (pseudoRandom(s++) - 0.5) * 600;
      positions[i * 3 + 2] = (pseudoRandom(s++) - 0.5) * 6500 - 3000;

      const isRed = pseudoRandom(s++) < 0.08;
      if (isRed) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.1;
        colors[i * 3 + 2] = 0.15;
      } else {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 0.98;
        colors[i * 3 + 2] = 0.98;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [counts.fg]);

  const deepRef = useRef<THREE.Points>(null!);
  const midRef = useRef<THREE.Points>(null!);
  const nearRef = useRef<THREE.Points>(null!);
  const fgRef = useRef<THREE.Points>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (deepRef.current) deepRef.current.rotation.y = time * 0.002;
    if (midRef.current) midRef.current.rotation.y = time * 0.005;
    if (nearRef.current) nearRef.current.rotation.y = time * 0.008;
    if (fgRef.current) fgRef.current.rotation.y = time * 0.015;
  });

  return (
    <group>
      <points ref={deepRef} geometry={deepStars}>
        <pointsMaterial size={1.2} vertexColors transparent opacity={0.5} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={midRef} geometry={midStars}>
        <pointsMaterial size={1.8} vertexColors transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={nearRef} geometry={nearStars}>
        <pointsMaterial size={2.5} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={fgRef} geometry={fgStars}>
        <pointsMaterial size={3.5} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
};
