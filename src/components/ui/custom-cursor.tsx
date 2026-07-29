'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * CustomCursor
 * - pointer-events: none is strictly enforced
 * - Fast, smooth GSAP follower
 * - Automatically hidden on touch / mobile devices
 */
export default function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable completely on touch devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    const mouse   = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let reqId: number;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.04,
        ease: 'power2.out',
        overwrite: true,
      });

      gsap.to(label, {
        x: mouse.x + 18,
        y: mouse.y + 18,
        duration: 0.04,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animateRing = () => {
      ringPos.x = lerp(ringPos.x, mouse.x, 0.15);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.15);
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      reqId = requestAnimationFrame(animateRing);
    };
    reqId = requestAnimationFrame(animateRing);

    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';
    const viewSelectors = '.portfolio-card, [data-cursor-view]';

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target) return;
      if (target.closest(viewSelectors)) {
        document.body.classList.add('cursor-hovering', 'cursor-view');
      } else if (target.closest(interactiveSelectors)) {
        document.body.classList.add('cursor-hovering');
        document.body.classList.remove('cursor-view');
      }
    };

    const onHoverEnd = () => {
      document.body.classList.remove('cursor-hovering', 'cursor-view');
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onHoverStart, { passive: true });
    document.addEventListener('mouseout',  onHoverEnd,   { passive: true });

    gsap.set([dot, ring], { opacity: 1 });

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onHoverStart);
      document.removeEventListener('mouseout',  onHoverEnd);
      document.body.classList.remove('cursor-hovering', 'cursor-view');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" style={{ pointerEvents: 'none' }} />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" style={{ pointerEvents: 'none' }} />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" style={{ pointerEvents: 'none' }}>
        View
      </div>
    </>
  );
}
