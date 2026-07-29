'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * CustomCursor — Agency-level custom cursor.
 * - Dot: fast, precise
 * - Ring: lagging follower
 * - Hides on touch devices automatically (CSS handles it)
 * - Adds cursor-hovering class to body on interactive elements
 * - Adds cursor-view class + label on portfolio cards
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch / mobile devices
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const dot   = dotRef.current;
    const ring  = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Mouse position state
    const mouse  = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    let reqId: number;

    // ── GSAP Dot — instant follow ──────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(dot, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.08,
        ease: 'power3.out',
        overwrite: true,
      });

      // Label follows dot
      gsap.to(label, {
        x: mouse.x + 20,
        y: mouse.y + 20,
        duration: 0.08,
        ease: 'power3.out',
        overwrite: true,
      });
    };

    // ── Ring — lagging follower via RAF ─────────────────
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animateRing = () => {
      ringPos.x = lerp(ringPos.x, mouse.x, 0.1);
      ringPos.y = lerp(ringPos.y, mouse.y, 0.1);
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
      reqId = requestAnimationFrame(animateRing);
    };
    reqId = requestAnimationFrame(animateRing);

    // ── Hover detection ─────────────────────────────────
    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]';
    const viewSelectors = '.portfolio-card, [data-cursor-view]';

    const onHoverStart = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(viewSelectors)) {
        document.body.classList.add('cursor-hovering', 'cursor-view');
        document.body.classList.remove('cursor-clicking');
      } else if (target.closest(interactiveSelectors)) {
        document.body.classList.add('cursor-hovering');
        document.body.classList.remove('cursor-view', 'cursor-clicking');
      }
    };

    const onHoverEnd = () => {
      document.body.classList.remove('cursor-hovering', 'cursor-view');
    };

    const onMouseDown = () => document.body.classList.add('cursor-clicking');
    const onMouseUp   = () => document.body.classList.remove('cursor-clicking');

    // Visibility
    const onEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };
    const onLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onHoverStart);
    document.addEventListener('mouseout',  onHoverEnd);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup',   onMouseUp);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    // Initial hidden state
    gsap.set([dot, ring], { opacity: 0 });

    return () => {
      cancelAnimationFrame(reqId);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onHoverStart);
      document.removeEventListener('mouseout',  onHoverEnd);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup',   onMouseUp);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('cursor-hovering', 'cursor-view', 'cursor-clicking');
    };
  }, []);

  return (
    <>
      {/* Inner dot — fast */}
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />

      {/* Outer ring — lagging */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />

      {/* Label */}
      <div ref={labelRef} className="cursor-label" aria-hidden="true">
        View
      </div>
    </>
  );
}
