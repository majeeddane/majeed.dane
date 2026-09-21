'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { cachedFetch } from '@/lib/content-cache';
import type { ContentItem } from '@/app/page';
import { MapPin, Briefcase, GraduationCap } from 'lucide-react';

interface AboutSectionProps {
  initialContent?: ContentItem[];
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
    'مصمم جرافيك يعمل في الرياض، يتخصص في الهوية البصرية والتصميم التجاري. أعمل على مواد الهوية البصرية للمعارض والمؤتمرات، وتصميم البروفايلات التجارية، والمواد التسويقية الإعلانية، إضافة إلى مشاريع التصميم الرقمي. أهتم بالتفاصيل والاتساق البصري، وأسعى دائمًا لتحقيق نتيجة تصميمية تعكس الاحترافية وتخدم الهدف التجاري.',
    'Graphic designer based in Riyadh, specializing in visual identity and commercial design. I work on exhibition and event branding, corporate profiles, advertising materials, and digital design projects. I pay close attention to visual consistency and design detail, always aiming for results that serve the commercial purpose.'
  );

  const educationText = getVal(
    'education_ar',
    'دبلوم علوم حاسوب',
    'Diploma in Computer Science'
  );

  const initials = t('ع م', 'AM');

  return (
    <section
      className="bg-[#0A1628] section-padding relative"
      dir={isRTL ? 'rtl' : 'ltr'}
      id="about"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-14 reveal-up">
          <p className="section-eyebrow">
            <i className="fi fi-br-user" />
            {t('من أنا', 'About Me')}
          </p>
          <h2 className="section-title-xl">
            {t('نبذة', 'About')}<span style={{ color: '#C9A84C' }}>{t(' عني', '')}</span>
          </h2>
          <div className="gold-line" />
        </div>

        <div className={`flex flex-col lg:flex-row items-start gap-12 lg:gap-20 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Photo */}
          <div className="flex-shrink-0 relative mx-auto lg:mx-0">
            <div
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(201,168,76,0.1) 0%, rgba(10,22,40,0.8) 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {aboutImageUrl ? (
                <img
                  src={aboutImageUrl}
                  alt={t('عبدالمجيد الضاعني', 'Abdulmajeed Aldhanei')}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
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
                </div>
              )}
            </div>

            {/* Quick info cards */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <span>{t('الرياض، السعودية', 'Riyadh, Saudi Arabia')}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Briefcase className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <span>{t('متاح للفرص الوظيفية', 'Available for Opportunities')}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
                <span>{educationText}</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 w-full min-w-0">
            <p
              className={`text-base md:text-lg leading-[1.9] text-white/65 mb-10 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {bioText}
            </p>

            {/* Design Philosophy */}
            <div
              className="border-s-2 ps-6 mb-10"
              style={{ borderColor: 'rgba(201,168,76,0.3)' }}
            >
              <p className={`text-sm md:text-base text-white/50 leading-relaxed italic ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(
                  '"التصميم الجيد لا يُلاحَظ، يُشعَر به."',
                  '"Good design is not noticed — it is felt."'
                )}
              </p>
            </div>

            {/* Skills Preview — Tags */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-4">
                {t('أدوات وتقنيات', 'Tools & Technologies')}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Adobe Photoshop',
                  'Adobe Illustrator',
                  'Canva',
                  'UI Design',
                  'Web Development',
                  'Meta Ads',
                  'Google Ads',
                  'AI Workflow',
                ].map((tool) => (
                  <span
                    key={tool}
                    className="inline-block text-xs font-medium text-white/45 border border-white/[0.08] rounded-full px-3 py-1"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
