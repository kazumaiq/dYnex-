import React, { useMemo } from 'react';
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

  const totalReleases = publishedReleases.length;
  const radius = isMobile ? 28 : 50;

  return (
    <group>
      {publishedReleases.map((release, index) => {
        const isFeatured = release.id === featuredRelease.id;
        const isSelected = selectedRelease?.id === release.id;

        // Progress into archive zone: 0 = Hero, 1 = Full Cylindrical Archive Ring
        const archiveTransition = THREE.MathUtils.clamp(
          (-cameraZ - 150) / 550,
          0,
          1
        );

        // 1. HERO POSITIONS
        let heroPos: [number, number, number];
        let heroRot: [number, number, number];

        if (isFeatured) {
          heroPos = isMobile
            ? [0, 1.2, -38]
            : [11, 0.5, -36];
          heroRot = [0.04, -0.12, 0.02];
        } else {
          // Midground and background asymmetric distribution in Hero
          const seed = (index * 137.5) % 360;
          const rad = (seed * Math.PI) / 180;
          const dist = (isMobile ? 20 : 28) + (index % 5) * (isMobile ? 10 : 15);
          const zDepth = -80 - (index % 6) * 30;
          const xOffset = Math.sin(rad) * dist;
          const yOffset = Math.cos(rad) * (dist * 0.45) - 3;

          heroPos = [xOffset, yOffset, zDepth];
          heroRot = [0.08, Math.sin(index) * 0.35, 0.04];
        }

        // 2. ORBITAL ARCHIVE RING POSITIONS (centered around Z = -1150)
        const angleStep = (2 * Math.PI) / totalReleases;
        const currentAngle = archiveRotation + index * angleStep;

        const ringX = Math.sin(currentAngle) * radius;
        const ringZ = -1150 + Math.cos(currentAngle) * radius;
        const ringY = isMobile ? 0.8 : Math.sin(index * 1.2) * 4.5;

        const ringRotY = currentAngle;
        const ringRotX = 0;
        const ringRotZ = isMobile ? 0 : Math.sin(index * 0.5) * 0.04;

        // Smooth interpolation
        const finalX = THREE.MathUtils.lerp(heroPos[0], ringX, archiveTransition);
        const finalY = THREE.MathUtils.lerp(heroPos[1], ringY, archiveTransition);
        const finalZ = THREE.MathUtils.lerp(heroPos[2], ringZ, archiveTransition);

        const finalRotX = THREE.MathUtils.lerp(heroPos[0] ? heroRot[0] : 0, ringRotX, archiveTransition);
        const finalRotY = THREE.MathUtils.lerp(heroPos[1] ? heroRot[1] : 0, ringRotY, archiveTransition);
        const finalRotZ = THREE.MathUtils.lerp(heroPos[2] ? heroRot[2] : 0, ringRotZ, archiveTransition);

        // Distance Culling: hide cards that are too far from camera to maintain 60 FPS
        const distToCam = Math.abs(finalZ - cameraZ);
        if (distToCam > 1800 && !isSelected) {
          return null;
        }

        return (
          <ReleaseCard3D
            key={release.id}
            release={release}
            targetPos={[finalX, finalY, finalZ]}
            targetRot={[finalRotX, finalRotY, finalRotZ]}
            isFeatured={isFeatured && archiveTransition < 0.3}
            isSelected={isSelected}
            cameraZ={cameraZ}
            isMobile={isMobile}
            onSelect={(rel) => setSelectedRelease(rel)}
          />
        );
      })}
    </group>
  );
};
