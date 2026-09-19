import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  const isPointerRef = useRef(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    let rafId: number | null = null;
    let latestX = -100;
    let latestY = -100;

    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`;
      }
      rafId = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updateCursor);
      }

      // Check if target is clickable
      const target = e.target as HTMLElement | null;
      const isClickable = !!(
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button')
      );

      if (isClickable !== isPointerRef.current) {
        isPointerRef.current = isClickable;
        if (ringRef.current) {
          if (isClickable) {
            ringRef.current.className =
              'w-6 h-6 rounded-full border transition-all duration-150 flex items-center justify-center scale-125 border-cyber-purple bg-signal-red/10 shadow-[0_0_12px_rgba(139,92,246,0.6)]';
          } else {
            ringRef.current.className =
              'w-6 h-6 rounded-full border transition-all duration-150 flex items-center justify-center scale-100 border-technical-muted/60';
          }
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block will-change-transform"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      {/* Outer crosshair ring */}
      <div
        ref={ringRef}
        className="w-6 h-6 rounded-full border transition-all duration-150 flex items-center justify-center scale-100 border-technical-muted/60"
      >
        {/* Center dot */}
        <div className="w-1 h-1 rounded-full bg-signal-red" />
      </div>
    </div>
  );
};
