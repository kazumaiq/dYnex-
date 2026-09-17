import React from 'react';

export const AtmosphericLights: React.FC<{ cameraZ: number }> = ({ cameraZ }) => {
  return (
    <group>
      {/* Neutral low ambient light */}
      <ambientLight intensity={0.45} color="#D8D8D5" />

      {/* Cinematic directional key light */}
      <directionalLight
        position={[25, 35, cameraZ + 50]}
        intensity={0.85}
        color="#F2F2EE"
      />

      {/* Subtle signal red point light illuminating release edges */}
      <pointLight
        position={[-18, -12, cameraZ - 20]}
        intensity={1.2}
        distance={180}
        color="#E61924"
      />

      {/* Cool fill light */}
      <pointLight
        position={[20, 15, cameraZ - 80]}
        intensity={0.4}
        distance={220}
        color="#77777D"
      />
    </group>
  );
};
