'use client';

import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { ChevronDown, FileText } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cachedFetch } from '@/lib/content-cache';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 1, scale: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0 },
  },
};

const particles = [
  { size: 6, top: '15%', left: '10%', delay: 0, duration: 6 },
  { size: 4, top: '70%', left: '85%', delay: 1, duration: 8 },
  { size: 8, top: '40%', left: '5%', delay: 2, duration: 7 },
  { size: 5, top: '80%', left: '20%', delay: 0.5, duration: 9 },
  { size: 3, top: '25%', left: '75%', delay: 1.5, duration: 6.5 },
];

export default function HeroSection() {
  const { lang, isRTL, t } = useLanguage();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [portfolioFileUrl, setPortfolioFileUrl] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState<Record<string, { valueAr: string; valueEn: string }>>({});
  const { toast } = useToast();

  useEffect(() => {
    cachedFetch<{ key: string; valueAr: string; valueEn: string }[]>('/api/content')
      .then((data) => {
        const profileItem = data.find(item => item.key === 'profile_image');
        if (profileItem?.valueAr) setProfileImageUrl(profileItem.valueAr);
        const portfolioItem = data.find(item => item.key === 'portfolio_file');
        if (portfolioItem?.valueAr) setPortfolioFileUrl(portfolioItem.valueAr);
        const map: Record<string, { valueAr: string; valueEn: string }> = {};
        data.forEach(item => { map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' }; });
        setDynamicContent(map);
      })
      .catch(() => {});
  }, []);

  const getVal = (key: string, fallbackAr: string, fallbackEn: string) => {
    const item = dynamicContent[key];
    if (!item) return t(fallbackAr, fallbackEn);
    return lang === 'ar' ? (item.valueAr || fallbackAr) : (item.valueEn || fallbackEn);
  };

  const name = getVal('hero_name_ar', 'عبدالمجيد محمد يحيى الضاعني', 'Abdulmajeed Mohammed Yahya Al-Daani');
  const title = getVal('hero_title_ar', 'مصمم جرافيك | أخصائي تسويق رقمي | مطوّر مواقع ويب', 'Graphic Designer | Digital Marketing Specialist | Web Developer');
  const tagline = getVal('hero_tagline_ar', 'أبدع بالتصميم، أخطط بالتسويق، وأوظّف الذكاء الاصطناعي لصناعة مخرجات استثنائية', 'Creative in Design, Strategic in Marketing, Leveraging AI for Exceptional Results');
  const cta1 = t('تواصل معي', 'Contact Me');
  const cta2 = t('شاهد أعمالي', 'View Portfolio');
  const cta3 = t('ملف أعمالي الإبداعية', 'Creative Portfolio File');
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

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Geometric dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Hexagonal subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/20"
          style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
          animate={{ y: [0, -20, 0], x: [0, 10, -10, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Content container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Text content */}
          <motion.div
            className={`flex-1 text-center lg:text-start ${isRTL ? 'lg:text-right' : 'lg:text-left'}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
              variants={itemVariants}
            >
              {name}
            </motion.h1>

            <motion.p
              className="mt-3 md:mt-5 text-lg md:text-xl lg:text-2xl font-semibold text-gold"
              variants={itemVariants}
            >
              {title}
            </motion.p>

            <motion.p
              className="mt-3 md:mt-4 text-base md:text-lg text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              variants={itemVariants}
            >
              {tagline}
            </motion.p>

            <motion.div
              className={`mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start`}
              variants={itemVariants}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('contact')}
                className="bg-gold text-navy-900 hover:bg-gold-light font-bold text-base px-6 md:px-8 py-5 md:py-6 rounded-lg shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 hover:-translate-y-0.5"
              >
                {cta1}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('portfolio')}
                className="border-2 border-gold/60 text-gold bg-navy-900/30 backdrop-blur-sm hover:bg-gold/10 hover:border-gold font-semibold text-base px-6 md:px-8 py-5 md:py-6 rounded-lg transition-all hover:-translate-y-0.5"
              >
                {cta2}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handlePortfolioFileClick}
                className="border-2 border-white/30 text-white bg-navy-900/20 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 font-semibold text-base px-6 md:px-8 py-5 md:py-6 rounded-lg transition-all hover:-translate-y-0.5"
              >
                <FileText className="h-5 w-5 mr-2 ml-2" />
                {cta3}
              </Button>
            </motion.div>
          </motion.div>

          {/* Profile photo area */}
          <motion.div
            className="flex-shrink-0 relative"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Blue glow behind circle */}
            <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-3xl scale-125" />

            {/* Gradient border circle */}
            <div
              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full p-1"
              style={{ background: 'linear-gradient(135deg, #0B2545 0%, #1E5F9E 50%, #C9A84C 100%)' }}
            >
              {/* Inner circle */}
              <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center overflow-hidden">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold select-none"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C 0%, #D4BC6A 50%, #E8D48B 100%)',
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

            {/* Decorative ring */}
            <motion.div
              className="absolute -inset-4 rounded-full border border-gold/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="size-6 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
