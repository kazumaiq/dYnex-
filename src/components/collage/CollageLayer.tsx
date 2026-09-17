import React from 'react';

interface CollageLayerProps {
  children?: React.ReactNode;
  className?: string;
  showCrosshairs?: boolean;
  showCoordinates?: boolean;
  coordinates?: string;
  specLabel?: string;
  hasSplitBg?: boolean;
}

export const CollageLayer: React.FC<CollageLayerProps> = ({
  children,
  className = '',
  showCrosshairs = true,
  showCoordinates = true,
  coordinates = "55°45'N 37°37'E",
  specLabel = "SYS_COLLAGE // 2026",
  hasSplitBg = false,
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden ${
        hasSplitBg ? 'split-bg-diagonal' : ''
      } ${className}`}
    >
      {/* 4 Corner Crosshairs */}
      {showCrosshairs && (
        <>
          <span className="absolute top-2 left-2 text-signal-red font-mono text-[10px] select-none pointer-events-none opacity-70">
            +
          </span>
          <span className="absolute top-2 right-2 text-signal-red font-mono text-[10px] select-none pointer-events-none opacity-70">
            +
          </span>
          <span className="absolute bottom-2 left-2 text-signal-red font-mono text-[10px] select-none pointer-events-none opacity-70">
            +
          </span>
          <span className="absolute bottom-2 right-2 text-signal-red font-mono text-[10px] select-none pointer-events-none opacity-70">
            +
          </span>
        </>
      )}

      {/* Technical Microtext Header */}
      {showCoordinates && (
        <div className="absolute top-2 right-6 font-mono text-[9px] text-technical-muted tracking-widest hidden sm:flex items-center space-x-2 pointer-events-none select-none opacity-60">
          <span>LOC: {coordinates}</span>
          <span>//</span>
          <span>{specLabel}</span>
        </div>
      )}

      {/* Risograph Texture Grain Base */}
      <div className="absolute inset-0 pointer-events-none risograph-texture opacity-20" />

      {/* Children content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
