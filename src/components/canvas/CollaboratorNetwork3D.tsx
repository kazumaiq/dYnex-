import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { VERIFIED_COLLABORATORS } from '../../data/collaborators';

interface CollaboratorNetwork3DProps {
  cameraZ: number;
}

export const CollaboratorNetwork3D: React.FC<CollaboratorNetwork3DProps> = ({ cameraZ }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Center node: dYnex? at [0, 0, -3420]
  const centerPos = useMemo(() => new THREE.Vector3(0, 0, -3420), []);

  // Connection lines geometry
  const linesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (const c of VERIFIED_COLLABORATORS) {
      points.push(centerPos);
      points.push(new THREE.Vector3(...c.pos));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [centerPos]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.08;
  });

  // Only render when camera is within visible range of Zone 4 (-2600 to -4200)
  const isNearZone = cameraZ < -2400 && cameraZ > -4400;
  if (!isNearZone) return null;

  return (
    <group ref={groupRef}>
      {/* Central Hub: dYnex? */}
      <group position={[0, 0, -3420]}>
        <mesh>
          <sphereGeometry args={[2.2, 24, 24]} />
          <meshBasicMaterial color="#E61924" />
        </mesh>
        <lineSegments>
          <ringGeometry args={[3.2, 3.4, 32]} />
          <lineBasicMaterial color="#E61924" />
        </lineSegments>
        <Text
          position={[0, 4.2, 0]}
          fontSize={2.4}
          color="#F2F2EE"
          font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-g.woff"
          anchorX="center"
          anchorY="middle"
        >
          dYnex?
        </Text>
      </group>

      {/* Network Lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#E61924" transparent opacity={0.25} />
      </lineSegments>

      {/* Collaborator Nodes */}
      {VERIFIED_COLLABORATORS.map((c) => {
        const isHovered = hoveredNode === c.id;
        return (
          <group
            key={c.id}
            position={c.pos}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredNode(c.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHoveredNode(null);
              document.body.style.cursor = 'auto';
            }}
          >
            {/* Node Sphere */}
            <mesh>
              <sphereGeometry args={[isHovered ? 1.5 : 1.1, 16, 16]} />
              <meshBasicMaterial color={isHovered ? '#E61924' : '#D8D8D5'} />
            </mesh>

            {/* Orbit ring around node */}
            <lineSegments>
              <ringGeometry args={[1.8, 1.9, 24]} />
              <lineBasicMaterial
                color={isHovered ? '#E61924' : '#77777D'}
                transparent
                opacity={isHovered ? 0.8 : 0.4}
              />
            </lineSegments>

            {/* Collaborator Name */}
            <Text
              position={[0, 2.5, 0]}
              fontSize={1.4}
              color={isHovered ? '#E61924' : '#D8D8D5'}
              anchorX="center"
              anchorY="middle"
            >
              {c.name}
            </Text>

            {/* Tracks count */}
            <Text
              position={[0, 1.2, 0]}
              fontSize={0.8}
              color="#77777D"
              anchorX="center"
              anchorY="middle"
            >
              {`${c.trackCount} TRK`}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
