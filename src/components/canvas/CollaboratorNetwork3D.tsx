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
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.06;
  });

  // Only render when camera is within visible range of Zone 4
  const isNearZone = cameraZ < -2400 && cameraZ > -4400;
  if (!isNearZone) return null;

  return (
    <group ref={groupRef}>
      {/* Central Hub: dYnex? */}
      <group position={[0, 0, -3420]}>
        <mesh>
          <sphereGeometry args={[2.2, 16, 16]} />
          <meshBasicMaterial color="#E61924" />
        </mesh>
        <lineSegments>
          <ringGeometry args={[3.2, 3.4, 32]} />
          <lineBasicMaterial color="#E61924" />
        </lineSegments>
        <Text
          position={[0, 4.2, 0]}
          fontSize={2.2}
          color="#F2F2EE"
          anchorX="center"
          anchorY="middle"
        >
          dYnex?
        </Text>
      </group>

      {/* Network Lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#E61924" transparent opacity={0.22} />
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
            }}
            onPointerOut={() => {
              setHoveredNode(null);
            }}
          >
            {/* Node Sphere */}
            <mesh>
              <sphereGeometry args={[isHovered ? 1.4 : 1.0, 12, 12]} />
              <meshBasicMaterial color={isHovered ? '#E61924' : '#D8D8D5'} />
            </mesh>

            {/* Orbit ring around node */}
            <lineSegments>
              <ringGeometry args={[1.6, 1.7, 16]} />
              <lineBasicMaterial
                color={isHovered ? '#E61924' : '#77777D'}
                transparent
                opacity={isHovered ? 0.8 : 0.35}
              />
            </lineSegments>

            {/* Collaborator Name (no external font URL to avoid network stalls) */}
            <Text
              position={[0, 2.3, 0]}
              fontSize={1.3}
              color={isHovered ? '#E61924' : '#D8D8D5'}
              anchorX="center"
              anchorY="middle"
            >
              {c.name}
            </Text>
          </group>
        );
      })}
    </group>
  );
};
