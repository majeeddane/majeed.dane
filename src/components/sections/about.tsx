'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { cachedFetch } from '@/lib/content-cache';
import type { ContentItem } from '@/app/page';
import { User, Globe, Heart, Briefcase, MapPin, GraduationCap } from 'lucide-react';

interface AboutSectionProps {
  initialContent?: ContentItem[];
}

function InfoBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="group flex items-center gap-3 px-4 py-3 rounded-xl card-glass cursor-default transition-all duration-300 hover:-translate-y-1">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}
      >
        <span style={{ color: '#C9A84C' }}>{icon}</span>
      </div>
      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">
        {text}
      </span>
    </div>
  );
}

export default function AboutSection({ initialContent = [] }: AboutSectionProps) {
  const { lang, isRTL, t } = useLanguage();

  const initialMap = useMemo(() => {
    const map: Record<string, { valueAr: string; valueEn: string }> = {};
    initialContent.forEach(item => {
      map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' };
    });
    return map;
  }, [initialContent]);

  const [dynamicContent, setDynamicContent] = useState<Record<string, { valueAr: string; valueEn: string }>>(initialMap);
  const initialAboutUrl = initialContent.find(item => item.key === 'about_image')?.valueAr || null;
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(initialAboutUrl);

  useEffect(() => {
    if (initialContent.length > 0) return;
    cachedFetch<{ key: string; valueAr: string; valueEn: string }[]>('/api/content')
      .then(data => {
        const aboutImageItem = data.find(item => item.key === 'about_image');
        if (aboutImageItem?.valueAr) setAboutImageUrl(aboutImageItem.valueAr);
        const map: Record<string, { valueAr: string; valueEn: string }> = {};
        data.forEach(item => { map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' }; });
        setDynamicContent(map);
      })
      .catch(() => {});
  }, [initialContent.length]);

  const getVal = (key: string, fallbackAr: string, fallbackEn: string) => {
    const item = dynamicContent[key];
    if (!item) return t(fallbackAr, fallbackEn);
    return lang === 'ar' ? (item.valueAr || fallbackAr) : (item.valueEn || fallbackEn);
  };

  const bioText = getVal(
    'about_ar',
    'مصمم جرافيك ومسوّق رقمي، خريج علوم حاسوب، يمتلك خبرة عملية في العمل الحر امتدت لعدة سنوات في تصميم الهويات البصرية، وإدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة لعملاء من قطاعات متنوعة. يمزج بين الحس الإبداعي في التصميم والتخطيط التسويقي المدروس، مستعينًا بأدوات الذكاء الاصطناعي لتسريع الإنتاج ورفع جودة المخرجات.',
    'Graphic designer and digital marketer, computer science graduate, with years of freelance experience in visual identity design, social media management, and creating/managing funded advertising campaigns for clients across diverse sectors. Combines creative design sensibility with strategic marketing planning, leveraging AI tools to accelerate production and enhance output quality.'
  );
  const educationText = getVal(
    'education_ar',
    'بكالوريوس علوم حاسوب — الكلية الدولية، صنعاء، اليمن — 2023',
    "Bachelor of Computer Science — International College, Sana'a, Yemen — 2023"
  );
  const initials = t('ع م', 'AM');

  const infoBadges = [
    { icon: <User className="size-3.5" />,     text: getVal('about_age',          '24 سنة',  '24 years')   },
    { icon: <Globe className="size-3.5" />,    text: getVal('about_nationality',  'يمنية',    'Yemeni')     },
    { icon: <Heart className="size-3.5" />,    text: getVal('about_status',       'أعزب',     'Single')     },
    { icon: <Briefcase className="size-3.5" />,text: getVal('about_availability', 'متفرغ',    'Available')  },
    { icon: <MapPin className="size-3.5" />,   text: getVal('about_location',     'الرياض',   'Riyadh')     },
  ];

  return (
    <section
      className="bg-[#0A1628] section-padding relative"
      dir={isRTL ? 'rtl' : 'ltr'}
      id="about"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-14 reveal-up">
          <p className="section-eyebrow">
            <i className="fi fi-br-user" />
            {t('من أنا', 'Who I Am')}
          </p>
          <h2 className="section-title-xl">
            {t('نبذة', 'About')}{' '}
            <span style={{ color: '#C9A84C' }}>{t('عني', 'Me')}</span>
          </h2>
          <div className="gold-line" />
        </div>

        <div className={`flex flex-col lg:flex-row items-start gap-12 lg:gap-16 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0 relative mx-auto lg:mx-0">
            <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-3xl scale-125 pointer-events-none" />

            {/* Spinning Conic Gradient Ring */}
            <motion.div
              className="absolute -inset-4 rounded-full pointer-events-none"
              style={{
                background: 'conic-gradient(from 0deg, #C9A84C, #1E5F9E, #2E7BC4, #D4BC6A, #C9A84C)',
                opacity: 0.35,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            />

            <div
              className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full p-[3px]"
              style={{ background: 'linear-gradient(135deg, #1E5F9E 0%, #C9A84C 100%)' }}
            >
              <div className="w-full h-full rounded-full bg-[#10243E] flex items-center justify-center overflow-hidden">
                {aboutImageUrl ? (
                  <img
                    src={aboutImageUrl}
                    alt={t('عبدالمجيد الضاعني', 'Abdulmajid Al-Daani')}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span
                    className="text-5xl font-bold select-none"
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
          </div>

          <div className="flex-1 w-full min-w-0">
            <div className="card-glass p-6 md:p-8 mb-6">
              <p className={`text-base md:text-lg leading-[1.85] text-white/80 ${isRTL ? 'text-right' : 'text-left'}`}>
                {bioText}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {infoBadges.map((badge, i) => (
                <InfoBadge key={i} icon={badge.icon} text={badge.text} />
              ))}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}
                >
                  <GraduationCap className="size-4" style={{ color: '#C9A84C' }} />
                </div>
                <h3 className="text-base font-bold text-white">{t('التعليم', 'Education')}</h3>
              </div>
              <div className="card-glass p-5">
                <p className={`text-sm md:text-base text-white/80 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {educationText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
