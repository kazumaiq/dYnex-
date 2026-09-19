import React from 'react';

interface PosterCutoutProps {
  src: string;
  alt: string;
  maskType?: 'radial' | 'bottom' | 'left' | 'none';
  blendMode?: 'mix-blend-screen' | 'mix-blend-lighten' | 'mix-blend-luminosity' | 'normal';
  className?: string;
  cropPosition?: string;
  hasRedBorder?: boolean;
}

export const PosterCutout: React.FC<PosterCutoutProps> = ({
  src,
  alt,
  maskType = 'radial',
  blendMode = 'normal',
  className = '',
  cropPosition = 'center',
  hasRedBorder = false,
}) => {
  const maskClass =
    maskType === 'radial'
      ? 'cutout-mask-radial'
      : maskType === 'bottom'
      ? 'cutout-mask-bottom'
      : maskType === 'left'
      ? 'cutout-mask-left'
      : '';

  return (
    <div
      className={`relative overflow-hidden pointer-events-none select-none ${
        hasRedBorder ? 'poster-frame-red' : ''
      } ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover ${maskClass} ${blendMode}`}
        style={{ objectPosition: cropPosition }}
      />
      {hasRedBorder && (
        <div className="absolute top-1 left-1.5 font-mono text-[8px] text-signal-red uppercase tracking-widest bg-void-950/80 px-1 border border-signal-red/40">
          REF.IMG // ART_SPEC
        </div>
      )}
    </div>
  );
};
