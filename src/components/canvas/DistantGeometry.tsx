import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DistantGeometry: React.FC = () => {
  const ring1Ref = useRef<THREE.Group>(null!);
  const ring2Ref = useRef<THREE.Group>(null!);
  const ring3Ref = useRef<THREE.Group>(null!);
  const ring4Ref = useRef<THREE.Group>(null!);
  const techGridRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.02;
      ring1Ref.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -t * 0.015;
      ring2Ref.current.rotation.y = t * 0.01;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.01;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.z = -t * 0.008;
    }
    if (techGridRef.current) {
      techGridRef.current.rotation.z = t * 0.004;
    }
  });

  return (
    <group>
      {/* ZONE 1 (ARRIVAL): Distant giant technical coordinate circle */}
      <group ref={ring1Ref} position={[0, 0, -250]}>
        <lineSegments>
          <ringGeometry args={[55, 55.2, 96]} />
          <lineBasicMaterial color="#77777D" transparent opacity={0.18} />
        </lineSegments>
        <lineSegments>
          <ringGeometry args={[78, 78.15, 128]} />
          <lineBasicMaterial color="#E61924" transparent opacity={0.12} />
        </lineSegments>
      </group>

      {/* ZONE 2 (ARCHIVE): Orbital archive guide rings */}
      <group ref={ring2Ref} position={[0, 0, -1100]}>
        <lineSegments>
          <ringGeometry args={[110, 110.3, 128]} />
          <lineBasicMaterial color="#D8D8D5" transparent opacity={0.12} />
        </lineSegments>
        <lineSegments>
          <ringGeometry args={[145, 145.2, 128]} />
          <lineBasicMaterial color="#77777D" transparent opacity={0.08} />
        </lineSegments>
      </group>

      {/* ZONE 3 (DEEP SPACE): Technical grid planes */}
      <group ref={techGridRef} position={[0, 0, -2300]}>
        <gridHelper
          args={[300, 24, '#E61924', '#1A1B20']}
          rotation={[Math.PI / 2.2, 0, 0]}
          position={[0, -40, 0]}
        />

      </group>

      {/* ZONE 4 (NETWORK): Collaborator celestial circles */}
      <group ref={ring3Ref} position={[0, 0, -3450]}>
        <lineSegments>
          <ringGeometry args={[80, 80.2, 96]} />
          <lineBasicMaterial color="#E61924" transparent opacity={0.18} />
        </lineSegments>
        <lineSegments>
          <ringGeometry args={[120, 120.2, 128]} />
          <lineBasicMaterial color="#77777D" transparent opacity={0.1} />
        </lineSegments>
      </group>

      {/* ZONE 5 & 6 (SIGNAL / TERMINAL): Giant deep cosmos horizon rings */}
      <group ref={ring4Ref} position={[0, 0, -5600]}>
        <lineSegments>
          <ringGeometry args={[200, 200.5, 128]} />
          <lineBasicMaterial color="#D8D8D5" transparent opacity={0.1} />
        </lineSegments>
        <lineSegments>
          <ringGeometry args={[280, 280.4, 128]} />
          <lineBasicMaterial color="#E61924" transparent opacity={0.08} />
        </lineSegments>
      </group>
    </group>
  );
};
