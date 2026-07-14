'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * GsapProvider — registers GSAP plugins once and sets up
 * global scroll-triggered section reveal animations.
 * Drop this inside RootLayout (client boundary).
 */
export default function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ── Global defaults ──────────────────────────────────────────
    gsap.defaults({ ease: 'power3.out' });

    // ── Section slide-in from sides ───────────────────────────────
    // Every [data-gsap="slide-left"] enters from the left
    gsap.utils.toArray<Element>('[data-gsap="slide-left"]').forEach((el) => {
      gsap.fromTo(
        el,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray<Element>('[data-gsap="slide-right"]').forEach((el) => {
      gsap.fromTo(
        el,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // [data-gsap="fade-up"] — generic fade up
    gsap.utils.toArray<Element>('[data-gsap="fade-up"]').forEach((el, i) => {
      gsap.fromTo(
        el,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: (i % 4) * 0.1,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // [data-gsap="stagger-cards"] — animate children with stagger
    gsap.utils.toArray<Element>('[data-gsap="stagger-cards"]').forEach((container) => {
      const cards = container.querySelectorAll(':scope > *');
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // [data-gsap="scale-in"] — zoom in from tiny
    gsap.utils.toArray<Element>('[data-gsap="scale-in"]').forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // Parallax on hero image
    gsap.utils.toArray<Element>('[data-gsap="parallax"]').forEach((el) => {
      gsap.to(el, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
