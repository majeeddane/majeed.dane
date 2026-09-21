'use client';

import { useLanguage } from '@/lib/language-context';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cachedFetch } from '@/lib/content-cache';
import type { ContentItem } from '@/app/page';
import { gsap } from 'gsap';

interface HeroSectionProps {
  initialContent?: ContentItem[];
}

export default function HeroSection({ initialContent = [] }: HeroSectionProps) {
  const { lang, isRTL, t } = useLanguage();
  const { toast } = useToast();
  const nameRef    = useRef<HTMLHeadingElement>(null);
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
  const initialCvUrl        = initialContent.find(item => item.key === 'cv_file')?.valueAr || null;

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(initialProfileUrl);
  const [cvUrl,           setCvUrl]           = useState<string | null>(initialCvUrl);

  useEffect(() => {
    if (initialContent.length > 0) return;
    cachedFetch<{ key: string; valueAr: string; valueEn: string }[]>('/api/content')
      .then((data) => {
        const profileItem = data.find(item => item.key === 'profile_image');
        if (profileItem?.valueAr) setProfileImageUrl(profileItem.valueAr);
        const cvItem = data.find(item => item.key === 'cv_file');
        if (cvItem?.valueAr) setCvUrl(cvItem.valueAr);
        const map: Record<string, { valueAr: string; valueEn: string }> = {};
        data.forEach(item => { map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' }; });
        setDynamicContent(map);
      })
      .catch(() => {});
  }, [initialContent.length]);

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
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.3,
      }
    );
  }, [lang, dynamicContent]);

  const handleCvClick = () => {
    if (!cvUrl) {
      toast({
        title: t('لم يتم رفع الملف بعد', 'File not uploaded yet'),
        description: t('سيتم إضافة الملف قريباً', 'The file will be added soon'),
      });
      return;
    }
    window.open(cvUrl, '_blank');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Name words for animated reveal
  const nameAr = 'عبدالمجيد الضاعني';
  const nameEn = 'Abdulmajeed Aldhanei';
  const displayName = lang === 'ar' ? nameAr : nameEn;

  const nameWords = displayName.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-1 me-3" style={{ maxWidth: '100%' }}>
      <span className="hero-word inline-block opacity-0 translate-y-full" style={{ wordBreak: 'keep-all' }}>
        {word}
      </span>
    </span>
  ));

  // Specializations tagline
  const taglineItems = [
    t('تصميم جرافيك', 'Graphic Design'),
    t('هوية بصرية', 'Brand Identity'),
    t('تصميم معارض', 'Exhibition Design'),
    t('تصميم رقمي', 'Digital Design'),
  ];

  const initials = t('ع م', 'AM');

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-navy-gradient"
      dir={isRTL ? 'rtl' : 'ltr'}
      id="home"
    >
      {/* Background layers */}
      <div className="hero-gradient-bg" />
      <div className="hero-grain" />
      <div className="hero-line-grid" />
      <div className="hero-orb-1" />
      <div className="hero-orb-2" />

      {/* Availability badge */}
      <motion.div
        className="absolute top-24 end-6 z-20 hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs font-medium"
        style={{ color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        {t('متاح للفرص الوظيفية في الرياض', 'Available for Opportunities in Riyadh')}
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 pb-20">

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-16">
          {/* Left: Text Content */}
          <div className="flex-1 min-w-0">

            {/* Eyebrow */}
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Portfolio — {new Date().getFullYear()}
            </motion.p>

            {/* Name */}
            <div className="mb-2 overflow-hidden">
              <h1
                ref={nameRef}
                className="font-bold tracking-tight leading-[1.15] flex flex-wrap items-baseline"
                style={{
                  fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                  color: '#FFFFFF',
                  wordBreak: 'keep-all',
                }}
              >
                {nameWords}
              </h1>
            </div>

            {/* Title */}
            <motion.p
              className="text-base sm:text-lg md:text-xl font-semibold mb-6 tracking-wide"
              style={{ color: '#C9A84C' }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              Graphic Designer
            </motion.p>

            {/* Bio */}
            <motion.p
              className="text-sm sm:text-base text-white/55 max-w-xl leading-relaxed mb-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75 }}
            >
              {t(
                'مصمم جرافيك متخصص في الهوية البصرية والتصميم التجاري والمحتوى الإبداعي، مع خبرة في تصميم المعارض والبروفايلات التجارية والمشاريع الرقمية.',
                'Graphic designer specializing in visual identity and commercial design, with experience in exhibition design, corporate profiles, and digital projects.'
              )}
            </motion.p>

            {/* Specializations Tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {taglineItems.map((item, i) => (
                <span
                  key={i}
                  className="inline-block text-xs font-medium text-white/40 border border-white/[0.08] rounded-full px-3 py-1"
                >
                  {item}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.0 }}
            >
              <button
                onClick={() => scrollToSection('portfolio')}
                className="btn-gold group"
                data-cursor-hover
              >
                <i className="fi fi-br-layers text-sm relative z-10" />
                <span className="relative z-10">{t('استكشف أعمالي', 'Explore My Work')}</span>
              </button>

              <button
                onClick={handleCvClick}
                className="btn-outline-gold"
                data-cursor-hover
              >
                <FileText className="h-4 w-4" />
                {t('تحميل السيرة الذاتية', 'Download CV')}
              </button>

              <a
                href="mailto:majeed.dane@gmail.com"
                className="btn-outline-white"
                data-cursor-hover
              >
                <i className="fi fi-br-envelope text-sm" />
                {t('تواصل معي', 'Contact Me')}
              </a>
            </motion.div>
          </div>

          {/* Right: Profile Photo */}
          <motion.div
            className="relative flex-shrink-0 mx-auto lg:mx-0"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Subtle glow */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
                transform: 'scale(1.4)',
              }}
            />

            {/* Outer rotating ring */}
            <motion.div
              className="absolute -inset-4 rounded-full pointer-events-none border border-dashed border-white/[0.08]"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />

            {/* Photo Container */}
            <div
              className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.25) 0%, rgba(10,22,40,0) 60%)',
                padding: '2px',
              }}
            >
              <div className="w-full h-full rounded-full bg-[#0A1628] flex items-center justify-center overflow-hidden border border-white/[0.06]">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={t('عبدالمجيد الضاعني', 'Abdulmajeed Aldhanei')}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span
                    className="text-4xl sm:text-5xl font-bold select-none"
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

            {/* Design icon badge */}
            <motion.div
              className="absolute -bottom-2 -end-2 w-10 h-10 rounded-full bg-[#0A1628] border border-gold/25 flex items-center justify-center shadow-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <i className="fi fi-br-paint-brush" style={{ color: '#C9A84C', fontSize: '0.95rem' }} />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom bar — location + scroll hint */}
        <motion.div
          className="flex items-center justify-between mt-16 pt-6 border-t border-white/[0.06]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <i className="fi fi-br-marker text-xs" style={{ color: '#C9A84C' }} />
            <span>{t('الرياض، المملكة العربية السعودية', 'Riyadh, Saudi Arabia')}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-white/20 text-xs">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <i className="fi fi-br-angle-double-small-down text-xs" />
            </motion.div>
            <span>{t('اسحب للأسفل', 'Scroll down')}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
