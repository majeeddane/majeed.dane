'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * GsapProvider
 * - Initializes Lenis smooth scroll and hooks it into GSAP ticker
 * - Sets up global scroll-reveal animations
 * - Handles parallax on [data-gsap="parallax"] elements
 */
export default function GsapProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ── Lenis Smooth Scroll ───────────────────────────────
    let lenis: any = null;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default;

        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.9,
          touchMultiplier: 2,
        });

        // Hook Lenis into GSAP ticker for perfect sync
        gsap.ticker.add((time) => {
          lenis?.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        // Refresh ScrollTrigger when Lenis scrolls
        lenis.on('scroll', () => {
          ScrollTrigger.update();
        });

        // Refresh ScrollTrigger once ready
        ScrollTrigger.refresh();
      } catch {
        // Lenis unavailable — fall back silently
      }
    };

    initLenis();

    // ── GSAP Global Defaults ────────────────────────────
    gsap.defaults({ ease: 'power3.out' });

    // ── Scroll Reveal — CSS class approach ───────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            entry.target.classList.add('is-visible'); // for reveal-up CSS transition
            revealObserver.unobserve(entry.target);   // fire once
          }
        });
      },
      { threshold: 0.1, rootMargin: '-30px' }
    );

    // Run observer on initial elements and re-check after dynamic content loads
    const observeAll = () => {
      document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
        revealObserver.observe(el);
      });
    };
    observeAll();
    // Re-scan after 500ms for dynamically rendered sections
    const rescanTimer = setTimeout(observeAll, 500);

    // ── GSAP ScrollTrigger — section slide-in ───────────
    gsap.utils.toArray<Element>('[data-gsap="slide-left"]').forEach((el) => {
      gsap.fromTo(el,
        { x: -80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9,
          scrollTrigger: {
            trigger: el, start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray<Element>('[data-gsap="slide-right"]').forEach((el) => {
      gsap.fromTo(el,
        { x: 80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9,
          scrollTrigger: {
            trigger: el, start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray<Element>('[data-gsap="fade-up"]').forEach((el, i) => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, delay: (i % 4) * 0.1,
          scrollTrigger: {
            trigger: el, start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray<Element>('[data-gsap="stagger-cards"]').forEach((container) => {
      const cards = container.querySelectorAll(':scope > *');
      gsap.fromTo(cards,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1,
          scrollTrigger: {
            trigger: container, start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    gsap.utils.toArray<Element>('[data-gsap="scale-in"]').forEach((el) => {
      gsap.fromTo(el,
        { scale: 0.6, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: el, start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    // ── Parallax ────────────────────────────────────────
    gsap.utils.toArray<Element>('[data-gsap="parallax"]').forEach((el) => {
      gsap.to(el, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: el, start: 'top top',
          end: 'bottom top', scrub: true,
        },
      });
    });

    // ── Gold line grow animation ─────────────────────────
    gsap.utils.toArray<Element>('.gold-line').forEach((el) => {
      gsap.fromTo(el,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: el, start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      revealObserver.disconnect();
      clearTimeout(rescanTimer);
    };
  }, []);

  return <>{children}</>;
}
