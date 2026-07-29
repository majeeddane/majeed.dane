'use client';

import { useLanguage } from '@/lib/language-context';
import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { ar: 'نبذة عني',  en: 'About',      href: '#about'      },
  { ar: 'المهارات',  en: 'Skills',     href: '#skills'     },
  { ar: 'الخبرة',   en: 'Experience', href: '#experience' },
  { ar: 'الأعمال',  en: 'Portfolio',  href: '#portfolio'  },
  { ar: 'تواصل',    en: 'Contact',    href: '#contact'    },
];

interface HeaderProps {
  initialContent?: { key: string; valueAr: string | null; valueEn: string | null; type: string; id: string }[];
}

export default function Header({ initialContent = [] }: HeaderProps) {
  const { lang, isRTL, t, toggleLanguage } = useLanguage();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [cvUrl,       setCvUrl]       = useState<string | null>(null);
  const { toast } = useToast();
  const headerRef = useRef<HTMLElement>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // CV URL
  useEffect(() => {
    const cvItem = initialContent.find(item => item.key === 'cv_file');
    if (cvItem?.valueAr) { setCvUrl(cvItem.valueAr); return; }
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const item = data.find((d: { key: string; valueAr: string | null }) => d.key === 'cv_file');
        if (item?.valueAr) setCvUrl(item.valueAr);
      })
      .catch(() => {});
  }, [initialContent]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleCvClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cvUrl) {
      e.preventDefault();
      toast({
        title: t('لم يتم رفع الملف بعد', 'File not uploaded yet'),
        description: t('سيتم إضافة الملف قريباً', 'The file will be added soon'),
      });
    }
  };

  const scrollToSection = (href: string) => {
    setMobileOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Desktop / Main Header ─────────────────────────── */}
      <header
        ref={headerRef}
        className={`fixed top-0 z-[9980] w-full transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">

          {/* Logo / Name */}
          <button
            onClick={scrollToTop}
            data-cursor-hover
            className={`font-bold tracking-tight transition-all duration-300 ${
              scrolled ? 'text-base text-white/90' : 'text-lg text-white'
            }`}
            style={{ letterSpacing: '-0.01em' }}
          >
            <span style={{ color: '#C8A45A' }}>{t('عبدالمجيد', 'Al')}</span>
            {t(' الضاعني', '-Daani')}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                data-cursor-hover
                className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group"
              >
                {t(link.ar, link.en)}
                {/* Underline on hover */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-gold group-hover:w-4/5 transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Lang toggle */}
            <button
              onClick={toggleLanguage}
              data-cursor-hover
              className="flex h-8 w-12 items-center justify-center rounded-full text-xs font-bold transition-all duration-200 border border-white/15 text-white/60 hover:border-white/30 hover:text-white"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* CV Download */}
            <a
              href={cvUrl || '#'}
              target={cvUrl ? '_blank' : undefined}
              rel={cvUrl ? 'noopener noreferrer' : undefined}
              onClick={handleCvClick}
              data-cursor-hover
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 border border-gold/50 text-gold hover:bg-gold hover:text-black hover:border-gold"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t('السيرة الذاتية', 'Download CV')}</span>
            </a>
          </div>

          {/* Mobile — lang + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLanguage}
              data-cursor-hover
              className="flex h-8 w-12 items-center justify-center rounded-full text-[10px] font-bold border border-white/15 text-white/60"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              data-cursor-hover
              className="relative w-9 h-9 flex flex-col justify-center items-center gap-1.5 z-[9999]"
              aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              <motion.span
                className="block h-px bg-white origin-center"
                style={{ width: '22px' }}
                animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block h-px bg-white"
                style={{ width: '16px' }}
                animate={mobileOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px bg-white origin-center"
                style={{ width: '22px' }}
                animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-Screen Mobile Menu Overlay ─────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[9970] flex flex-col bg-[#0A0A0A] md:hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
            initial={{ clipPath: 'circle(0% at 95% 4%)', opacity: 0 }}
            animate={{ clipPath: 'circle(150% at 95% 4%)', opacity: 1 }}
            exit={{ clipPath: 'circle(0% at 95% 4%)', opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
              <div className="absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full bg-blue-600/5 blur-3xl" />
            </div>

            {/* Nav links */}
            <div className="flex flex-1 flex-col justify-center px-8">
              <motion.p
                className="section-eyebrow mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <i className="fi fi-br-bars-sort" />
                {t('التنقل', 'Navigation')}
              </motion.p>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="group flex items-center justify-between py-4 border-b border-white/[0.06] text-white/60 hover:text-white transition-colors duration-200"
                    initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="text-2xl font-bold">{t(link.ar, link.en)}</span>
                    <span className="text-gold/0 group-hover:text-gold/80 transition-colors text-xs uppercase tracking-widest font-semibold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Bottom actions */}
              <motion.div
                className="mt-10 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <a
                  href={cvUrl || '#'}
                  target={cvUrl ? '_blank' : undefined}
                  rel={cvUrl ? 'noopener noreferrer' : undefined}
                  onClick={handleCvClick}
                  className="btn-gold justify-center text-center"
                >
                  <Download className="h-4 w-4 relative z-10" />
                  <span className="relative z-10">{t('تحميل السيرة الذاتية', 'Download CV')}</span>
                </a>

                <button
                  onClick={() => { toggleLanguage(); setMobileOpen(false); }}
                  className="btn-outline-white justify-center"
                >
                  {lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
                </button>
              </motion.div>
            </div>

            {/* Footer of overlay */}
            <motion.div
              className="px-8 pb-10 text-xs text-white/20 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              © 2026 {t('عبدالمجيد الضاعني', 'Al-Daani')}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
