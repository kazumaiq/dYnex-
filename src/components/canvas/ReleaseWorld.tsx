import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArchive } from '../../context/ArchiveContext';
import { ReleaseCard3D } from './ReleaseCard3D';

interface ReleaseWorldProps {
  cameraZ: number;
  isMobile: boolean;
}

export const ReleaseWorld: React.FC<ReleaseWorldProps> = ({ cameraZ, isMobile }) => {
  const {
    releases,
    featuredRelease,
    selectedRelease,
    setSelectedRelease,
    archiveRotation,
  } = useArchive();

  // Filter published releases
  const publishedReleases = useMemo(() => {
    return releases.filter(r => r.published !== false);
  }, [releases]);

  // Number of releases in the orbital archive
  const totalReleases = publishedReleases.length;
  const radius = isMobile ? 38 : 56;

  return (
    <group>
      {publishedReleases.map((release, index) => {
        const isFeatured = release.id === featuredRelease.id;
        const isSelected = selectedRelease?.id === release.id;

        // Calculate positions dynamically based on zone & cameraZ:
        // When camera is in Hero zone (cameraZ > -500), featured release is front and center
        // and other releases flank subtly.
        // When camera travels into Archive zone (cameraZ <= -500), releases expand into the cylindrical ring!
        
        // Progress into archive zone: 0 = Hero, 1 = Full Cylindrical Archive Ring
        const archiveTransition = THREE.MathUtils.clamp(
          (-cameraZ - 200) / 600,
          0,
          1
        );

        // 1. HERO POSITIONS
        let heroPos: [number, number, number];
        let heroRot: [number, number, number];

        if (isFeatured) {
          heroPos = isMobile
            ? [0, 1.5, -42]
            : [12, 1, -38];
          heroRot = [0.05, -0.15, 0.02];
        } else {
          // Midground and background asymmetric distribution in Hero
          const seed = (index * 137.5) % 360;
          const rad = (seed * Math.PI) / 180;
          const dist = 30 + (index % 5) * 16;
          const zDepth = -90 - (index % 6) * 35;
          const xOffset = Math.sin(rad) * dist;
          const yOffset = Math.cos(rad) * (dist * 0.5) - 4;

          heroPos = [xOffset, yOffset, zDepth];
          heroRot = [0.1, Math.sin(index) * 0.4, 0.05];
        }

        // 2. ORBITAL ARCHIVE RING POSITIONS (centered around Z = -1150)
        const angleStep = (2 * Math.PI) / totalReleases;
        const currentAngle = archiveRotation + index * angleStep;

        const ringX = Math.sin(currentAngle) * radius;
        const ringZ = -1150 + Math.cos(currentAngle) * radius;
        const ringY = Math.sin(index * 1.2) * 5.5; // gentle organic wave

        // Rotation facing outward from circle center
        const ringRotY = currentAngle;
        const ringRotX = 0;
        const ringRotZ = Math.sin(index * 0.5) * 0.05;

        // Interpolate smoothly between Hero placement and Orbital Archive placement!
        const finalX = THREE.MathUtils.lerp(heroPos[0], ringX, archiveTransition);
        const finalY = THREE.MathUtils.lerp(heroPos[1], ringY, archiveTransition);
        const finalZ = THREE.MathUtils.lerp(heroPos[2], ringZ, archiveTransition);

        const finalRotX = THREE.MathUtils.lerp(heroPos[0] ? heroRot[0] : 0, ringRotX, archiveTransition);
        const finalRotY = THREE.MathUtils.lerp(heroPos[1] ? heroRot[1] : 0, ringRotY, archiveTransition);
        const finalRotZ = THREE.MathUtils.lerp(heroPos[2] ? heroRot[2] : 0, ringRotZ, archiveTransition);

        return (
          <ReleaseCard3D
            key={release.id}
            release={release}
            targetPos={[finalX, finalY, finalZ]}
            targetRot={[finalRotX, finalRotY, finalRotZ]}
            isFeatured={isFeatured && archiveTransition < 0.3}
            isSelected={isSelected}
            cameraZ={cameraZ}
            onSelect={(rel) => setSelectedRelease(rel)}
          />
        );
      })}
    </group>
  );
};
