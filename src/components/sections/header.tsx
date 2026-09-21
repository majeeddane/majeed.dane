'use client';

import { useLanguage } from '@/lib/language-context';
import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { ar: 'الأعمال',   en: 'Work',       href: '#portfolio'  },
  { ar: 'الخدمات',   en: 'Services',   href: '#services'   },
  { ar: 'الخبرة',    en: 'Experience', href: '#experience' },
  { ar: 'عني',       en: 'About',      href: '#about'      },
  { ar: 'تواصل',     en: 'Contact',    href: '#contact'    },
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    }, 250);
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 z-[9980] w-full transition-all duration-400 ${
          scrolled
            ? 'bg-[#060E1A]/92 backdrop-blur-md border-b border-white/[0.07] shadow-lg shadow-black/25'
            : 'bg-transparent'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">

          {/* Logo / Name */}
          <button
            onClick={scrollToTop}
            data-cursor-hover
            className="font-bold tracking-tight transition-all duration-300 text-base text-white flex items-center gap-0"
          >
            <span style={{ color: '#C9A84C' }}>{t('عبدالمجيد', 'Aldhanei')}</span>
            {t(' الضاعني', '')}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 md:flex" role="navigation" aria-label={t('التنقل الرئيسي', 'Main Navigation')}>
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                data-cursor-hover
                className="relative px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 group"
              >
                {t(link.ar, link.en)}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-gold group-hover:w-3/4 transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={toggleLanguage}
              data-cursor-hover
              className="flex h-7 w-11 items-center justify-center rounded-full text-[11px] font-semibold transition-all duration-200 border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            <a
              href={cvUrl || '#'}
              target={cvUrl ? '_blank' : undefined}
              rel={cvUrl ? 'noopener noreferrer' : undefined}
              onClick={handleCvClick}
              data-cursor-hover
              className="btn-outline-gold text-xs py-1.5 px-4"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t('السيرة الذاتية', 'Download CV')}</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLanguage}
              data-cursor-hover
              className="flex h-7 w-11 items-center justify-center rounded-full text-[10px] font-semibold border border-white/15 text-white/50"
              aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              data-cursor-hover
              className="relative w-9 h-9 flex flex-col justify-center items-center gap-1.5 z-[9999]"
              aria-label={mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              aria-expanded={mobileOpen}
            >
              <motion.span
                className="block h-0.5 bg-white origin-center rounded-full"
                style={{ width: '22px' }}
                animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="block h-0.5 bg-white rounded-full"
                style={{ width: '16px' }}
                animate={mobileOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 bg-white origin-center rounded-full"
                style={{ width: '22px' }}
                animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[9970] flex flex-col bg-[#060E1A] md:hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={t('القائمة الرئيسية', 'Main Menu')}
          >
            <div className="flex flex-1 flex-col justify-center px-8">
              <p className="text-xs text-white/30 font-semibold uppercase tracking-widest mb-8">
                {t('التنقل', 'Navigation')}
              </p>

              <nav className="flex flex-col gap-0" role="navigation">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className="flex items-center justify-between py-4 border-b border-white/[0.07] text-white/60 hover:text-white transition-colors"
                  >
                    <span className="text-2xl font-bold">{t(link.ar, link.en)}</span>
                    <span className="text-gold/40 text-xs font-semibold tabular-nums">0{i + 1}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-10 flex flex-col gap-3">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
