'use client';

import { useLanguage } from '@/lib/language-context';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cachedFetch } from '@/lib/content-cache';
import type { ContentItem } from '@/app/page';
import { gsap } from 'gsap';

const socialLinks = [
  { icon: 'fi fi-brands-instagram', href: '#', label: 'Instagram', color: '#E1306C' },
  { icon: 'fi fi-brands-twitter',   href: '#', label: 'Twitter/X', color: '#1DA1F2' },
  { icon: 'fi fi-brands-linkedin',  href: '#', label: 'LinkedIn',  color: '#0A66C2' },
  { icon: 'fi fi-brands-behance',   href: '#', label: 'Behance',   color: '#1769FF' },
];

interface HeroSectionProps {
  initialContent?: ContentItem[];
}

export default function HeroSection({ initialContent = [] }: HeroSectionProps) {
  const { lang, isRTL, t } = useLanguage();
  const { toast } = useToast();
  const nameRef    = useRef<HTMLHeadingElement>(null);
  const badgeRef   = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const initialMap = useMemo(() => {
    const map: Record<string, { valueAr: string; valueEn: string }> = {};
    initialContent.forEach(item => {
      map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' };
    });
    return map;
  }, [initialContent]);

  const [dynamicContent, setDynamicContent] = useState<Record<string, { valueAr: string; valueEn: string }>>(initialMap);

  const initialProfileUrl   = initialContent.find(item => item.key === 'profile_image')?.valueAr || null;
  const initialPortfolioUrl = initialContent.find(item => item.key === 'portfolio_file')?.valueAr || null;

  const [profileImageUrl,  setProfileImageUrl]  = useState<string | null>(initialProfileUrl);
  const [portfolioFileUrl, setPortfolioFileUrl] = useState<string | null>(initialPortfolioUrl);

  useEffect(() => {
    if (initialContent.length > 0) return;
    cachedFetch<{ key: string; valueAr: string; valueEn: string }[]>('/api/content')
      .then((data) => {
        const profileItem   = data.find(item => item.key === 'profile_image');
        if (profileItem?.valueAr)   setProfileImageUrl(profileItem.valueAr);
        const portfolioItem = data.find(item => item.key === 'portfolio_file');
        if (portfolioItem?.valueAr) setPortfolioFileUrl(portfolioItem.valueAr);
        const map: Record<string, { valueAr: string; valueEn: string }> = {};
        data.forEach(item => { map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' }; });
        setDynamicContent(map);
      })
      .catch(() => {});
  }, [initialContent.length]);

  useEffect(() => {
    if (!badgeRef.current) return;
    gsap.fromTo(
      badgeRef.current,
      { scale: 0.8, opacity: 0, y: -15 },
      { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', delay: 1.5 }
    );
    gsap.to(badgeRef.current, {
      boxShadow: '0 0 20px rgba(201,168,76,0.35)',
      repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut', delay: 2.3,
    });
  }, []);

  useEffect(() => {
    const el = nameRef.current;
    if (!el) return;
    const words = el.querySelectorAll('.hero-word');
    if (!words.length) return;

    gsap.fromTo(
      words,
      { y: '100%', opacity: 0 },
      {
        y: '0%', opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      }
    );
  }, [lang, dynamicContent]);

  const getVal = (key: string, fallbackAr: string, fallbackEn: string) => {
    const item = dynamicContent[key];
    if (!item) return t(fallbackAr, fallbackEn);
    return lang === 'ar' ? (item.valueAr || fallbackAr) : (item.valueEn || fallbackEn);
  };

  const name    = getVal('hero_name_ar', 'عبدالمجيد الضاعني', 'Abdulmajid Al-Daani');
  const title   = getVal('hero_title_ar', 'مصمم جرافيك | أخصائي تسويق رقمي | مطوّر مواقع', 'Graphic Designer | Digital Marketing | Web Developer');
  const tagline = getVal('hero_tagline_ar', 'أبدع بالتصميم، أخطط بالتسويق، وأوظّف الذكاء الاصطناعي لصناعة مخرجات استثنائية', 'Creative in Design, Strategic in Marketing, AI-Powered Excellence');
  const initials = t('ع م', 'AM');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePortfolioFileClick = () => {
    if (!portfolioFileUrl) {
      toast({
        title: t('لم يتم رفع الملف بعد', 'File not uploaded yet'),
        description: t('سيتم إضافة الملف قريباً', 'The file will be added soon'),
      });
      return;
    }
    window.open(portfolioFileUrl, '_blank');
  };

  const nameWords = name.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-1 me-3 sm:me-4">
      <span className="hero-word inline-block opacity-0 translate-y-full">
        {word}
      </span>
    </span>
  ));

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-navy-gradient"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="hero-gradient-bg" />
      <div className="hero-grain" />
      <div className="hero-line-grid" />
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      {/* Availability badge */}
      <div
        ref={badgeRef}
        className="absolute top-24 right-6 z-20 opacity-0 hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass-gold border border-gold/30 text-xs font-semibold shadow-lg"
        style={{ color: '#C9A84C', direction: 'ltr' }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        {t('متاح للعمل', 'Available for Work')}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20">
        <motion.div
          className="section-eyebrow mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <i className="fi fi-br-star" />
          {t('بورتفوليو إبداعي احترافي', 'Creative Professional Portfolio')}
          <i className="fi fi-br-star" />
        </motion.div>

        <div className="mb-4">
          <h1
            ref={nameRef}
            className="font-bold tracking-tight leading-[1.15] flex flex-wrap items-baseline"
            style={{
              fontSize: 'clamp(2.75rem, 8vw, 7rem)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {nameWords}
          </h1>
        </div>

        <motion.p
          className="text-base sm:text-lg md:text-xl font-bold mb-4"
          style={{ color: '#C9A84C', letterSpacing: '0.01em' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {title}
        </motion.p>

        <motion.p
          className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl leading-relaxed mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          {tagline}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <button
            onClick={() => scrollToSection('contact')}
            className="btn-gold group"
            data-cursor-hover
          >
            <i className="fi fi-br-envelope text-sm relative z-10" />
            <span className="relative z-10">{t('تواصل معي', 'Contact Me')}</span>
          </button>

          <button
            onClick={() => scrollToSection('portfolio')}
            className="btn-outline-gold"
            data-cursor-hover
          >
            <i className="fi fi-br-eye text-sm" />
            {t('شاهد أعمالي', 'View Portfolio')}
          </button>

          <button
            onClick={handlePortfolioFileClick}
            className="btn-outline-white"
            data-cursor-hover
          >
            <FileText className="h-4 w-4" />
            {t('ملف أعمالي', 'Portfolio File')}
          </button>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pt-4 border-t border-white/10">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">
              {t('تابعني', 'Follow')}
            </span>
            <div className="h-px w-6 bg-white/20" />
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="hero-social-icon group relative w-9 h-9 rounded-full flex items-center justify-center border border-white/15 bg-white/5 transition-all duration-300 hover:scale-110 hover:border-white/30"
              >
                <i
                  className={`${s.icon} text-base text-white/60 group-hover:text-white transition-colors`}
                  style={{ '--hover-color': s.color } as React.CSSProperties}
                />
              </a>
            ))}
          </motion.div>

          {/* Profile photo area with spinning circular rings */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Glow behind photo */}
            <div className="absolute inset-0 rounded-full bg-blue-600/25 blur-3xl scale-125 pointer-events-none" />

            {/* 1. Fast Spinning Conic Gradient Ring */}
            <motion.div
              className="absolute -inset-5 rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, #C9A84C, #1E5F9E, #2E7BC4, #D4BC6A, #C9A84C)',
                opacity: 0.4,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            />

            {/* 2. Reverse Rotating Outer Dashed Ring */}
            <motion.div
              className="absolute -inset-3 rounded-full border border-dashed border-gold/50 pointer-events-none"
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            {/* Photo Container */}
            <div
              className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full p-[3px]"
              style={{ background: 'linear-gradient(135deg, #1E5F9E 0%, #C9A84C 100%)' }}
            >
              <div className="w-full h-full rounded-full bg-[#0A1628] flex items-center justify-center overflow-hidden">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span
                    className="text-3xl sm:text-4xl md:text-5xl font-bold select-none"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C 0%, #E8D48B 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {initials}
                  </span>
                )}
              </div>
            </div>

            {/* Floating icon badges */}
            <motion.div
              className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-[#0A1628] border border-gold/40 flex items-center justify-center shadow-lg"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <i className="fi fi-br-paint-brush" style={{ color: '#C9A84C', fontSize: '1rem' }} />
            </motion.div>

            <motion.div
              className="absolute -top-1 -left-1 w-9 h-9 rounded-full bg-[#0A1628] border border-blue-500/40 flex items-center justify-center shadow-lg"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <i className="fi fi-br-brain text-blue-400" style={{ fontSize: '0.85rem' }} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
