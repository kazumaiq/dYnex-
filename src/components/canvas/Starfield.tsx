import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface StarfieldProps {
  cameraZ: number;
  scrollVelocity: number;
}

// Deterministic pseudo-random generator
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const Starfield: React.FC<StarfieldProps> = ({ cameraZ, scrollVelocity }) => {
  // Layer 1: Deep Stars (tiny, dim, vast depth)
  const deepStars = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 101;

    for (let i = 0; i < count; i++) {
      const x = (pseudoRandom(s++) - 0.5) * 5000;
      const y = (pseudoRandom(s++) - 0.5) * 3500;
      const z = (pseudoRandom(s++) - 0.5) * 8000 - 3000; // Z: -7000 to +1000

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Off-white to subtle cold gray
      const brightness = 0.2 + pseudoRandom(s++) * 0.35;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness * 0.98;
      colors[i * 3 + 2] = brightness;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Layer 2: Mid Stars (visible, medium brightness, responsive)
  const midStars = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 505;

    for (let i = 0; i < count; i++) {
      const x = (pseudoRandom(s++) - 0.5) * 3200;
      const y = (pseudoRandom(s++) - 0.5) * 2400;
      const z = (pseudoRandom(s++) - 0.5) * 7500 - 3000;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Occasional rare faint red telemetry star (1 in 50)
      const isRed = pseudoRandom(s++) < 0.02;
      if (isRed) {
        colors[i * 3] = 0.9;
        colors[i * 3 + 1] = 0.1;
        colors[i * 3 + 2] = 0.15;
      } else {
        const b = 0.45 + pseudoRandom(s++) * 0.45;
        colors[i * 3] = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Layer 3: Near Stars (brighter, sharper, stronger parallax)
  const nearStars = useMemo(() => {
    const count = 450;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 909;

    for (let i = 0; i < count; i++) {
      const x = (pseudoRandom(s++) - 0.5) * 1800;
      const y = (pseudoRandom(s++) - 0.5) * 1400;
      const z = (pseudoRandom(s++) - 0.5) * 7000 - 3000;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const isRed = pseudoRandom(s++) < 0.04;
      if (isRed) {
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.15;
        colors[i * 3 + 2] = 0.18;
      } else {
        const b = 0.75 + pseudoRandom(s++) * 0.25;
        colors[i * 3] = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // Layer 4: Foreground particles (streaking on scroll, largest, pass close to lens)
  const fgStars = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let s = 1337;

    for (let i = 0; i < count; i++) {
      const x = (pseudoRandom(s++) - 0.5) * 900;
      const y = (pseudoRandom(s++) - 0.5) * 700;
      const z = (pseudoRandom(s++) - 0.5) * 6500 - 3000;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Pure crisp white / occasional bright red
      const isRed = pseudoRandom(s++) < 0.08;
      if (isRed) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.12;
        colors[i * 3 + 2] = 0.18;
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
  }, []);

  const deepRef = useRef<THREE.Points>(null!);
  const midRef = useRef<THREE.Points>(null!);
  const nearRef = useRef<THREE.Points>(null!);
  const fgRef = useRef<THREE.Points>(null!);

  // Per-frame subtle idle drift & scroll-velocity responsiveness
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (deepRef.current) {
      deepRef.current.rotation.y = time * 0.003;
      deepRef.current.rotation.z = time * 0.001;
    }
    if (midRef.current) {
      midRef.current.rotation.y = time * 0.006;
    }
    if (nearRef.current) {
      nearRef.current.rotation.y = time * 0.012;
      nearRef.current.rotation.x = Math.sin(time * 0.15) * 0.02;
    }
    if (fgRef.current) {
      fgRef.current.rotation.y = time * 0.02;
      // Dynamically adjust point scale based on scroll velocity for streak feel
      const fgMat = fgRef.current.material as THREE.PointsMaterial;
      if (fgMat) {
        const vel = Math.min(Math.abs(scrollVelocity), 25);
        fgMat.size = 3.5 + vel * 0.35;
      }
    }
  });

  return (
    <group>
      {/* 01. DEEP STARS */}
      <points ref={deepRef} geometry={deepStars}>
        <pointsMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* 02. MID STARS */}
      <points ref={midRef} geometry={midStars}>
        <pointsMaterial
          size={1.8}
          vertexColors
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* 03. NEAR STARS */}
      <points ref={nearRef} geometry={nearStars}>
        <pointsMaterial
          size={2.6}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* 04. FOREGROUND PASSING PARTICLES */}
      <points ref={fgRef} geometry={fgStars}>
        <pointsMaterial
          size={3.8}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};
