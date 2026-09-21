'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cachedFetch } from '@/lib/content-cache';

interface ExperienceEntry {
  id: string;
  companyAr: string;
  companyEn: string;
  descAr: string;
  descEn: string;
  visible: boolean;
}

const FALLBACK_EXPERIENCES: ExperienceEntry[] = [
  {
    id: 'exp-1',
    companyAr: 'شركة كونتكت لنظم المعلومات (CIS)',
    companyEn: 'Contact Information Systems (CIS)',
    descAr: 'تصميم الهوية البصرية الكاملة للشركة، وتطوير المواد التسويقية والمطبوعات، وإدارة حسابات التواصل الاجتماعي.',
    descEn: 'Complete visual identity design, developing marketing materials, print assets, and social media management.',
    visible: true,
  },
  {
    id: 'exp-2',
    companyAr: 'شركة اتحاد العصر للمحاماة والاستشارات',
    companyEn: 'ASR Law Group',
    descAr: 'تصميم وإدارة الهوية الرقمية ومنصات التواصل، وتصميم البروفايل المؤسسي والمحتوى الإعلاني والحملات الترويجية.',
    descEn: 'Digital identity & social platforms management, corporate profile design, advertising campaigns, and promotional content.',
    visible: true,
  },
  {
    id: 'exp-3',
    companyAr: 'مخابز ساساز بيكري (Sasaz Bakery)',
    companyEn: 'Sasaz Bakery',
    descAr: 'تصميم الهوية البصرية المبتكرة وتطبيقات التغليف والمواد الإعلانية الرقمية والمطبوعة.',
    descEn: 'Visual identity design, packaging applications, and digital and print advertising materials.',
    visible: true,
  },
  {
    id: 'exp-4',
    companyAr: 'مشاريع وهوية بصرية لعملاء ومؤسسات متعددة',
    companyEn: 'Brand Identity & Design for Multiple Clients',
    descAr: 'تصميم بروفايلات شركات احترافية، هويات بصرية متكاملة، وحملات تسويقية ومواقع ويب لعملاء في قطاعات تجارية وخدمية متنوعة.',
    descEn: 'Professional corporate profiles, complete brand identities, marketing campaigns, and websites for clients across various sectors.',
    visible: true,
  },
];

function TimelineCard({
  exp, isRTL, t, index,
}: {
  exp: ExperienceEntry; isRTL: boolean;
  t: (ar: string, en: string) => string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-glass group p-6 sm:p-7 relative overflow-hidden transition-all duration-300 hover:border-gold/40 rounded-2xl"
    >
      {/* Gold vertical bar on the edge */}
      <div
        className="absolute top-0 h-full w-1 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.15))',
          ...(isRTL ? { right: 0 } : { left: 0 }),
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-3.5">
          <div
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
            style={{
              background: 'rgba(201,168,76,0.08)',
              border: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            <i className="fi fi-br-briefcase text-base" style={{ color: '#C9A84C' }} />
          </div>
          <div>
            <span className="inline-block text-[11px] font-semibold text-gold/80 bg-gold/10 px-2.5 py-0.5 rounded-full mb-1 border border-gold/15">
              {t('خبرة عملية', 'Professional Role')}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-gold transition-colors duration-200">
              {t(exp.companyAr, exp.companyEn)}
            </h3>
          </div>
        </div>

        <p className={`text-sm sm:text-base leading-relaxed text-white/70 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(exp.descAr, exp.descEn)}
        </p>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { isRTL, t } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceEntry[]>(FALLBACK_EXPERIENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cachedFetch<ExperienceEntry[]>('/api/experience')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const visibleOnly = data.filter((e: ExperienceEntry) => e.visible);
          if (visibleOnly.length > 0) {
            setExperiences(visibleOnly);
          }
        }
      })
      .catch(() => {
        // Fallback to FALLBACK_EXPERIENCES
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="experience"
      className="bg-[#060E1A] section-padding relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mb-14 reveal-up">
          <p className="section-eyebrow">
            <i className="fi fi-br-briefcase" />
            {t('مسيرتي المهنية', 'Professional Journey')}
          </p>
          <h2 className="section-title-xl">
            {t('الخبرة', 'Work')}{' '}
            <span style={{ color: '#C9A84C' }}>{t('العملية', 'Experience')}</span>
          </h2>
          <div className="gold-line" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div
              className={`absolute top-4 bottom-4 w-0.5 ${isRTL ? 'right-4' : 'left-4'}`}
              style={{
                background: 'linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.1))',
              }}
            />

            <div className="flex flex-col gap-6">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="relative flex gap-5 sm:gap-7">
                  <div className="flex-shrink-0 flex flex-col items-center mt-5">
                    <div
                      className="w-4 h-4 rounded-full animate-dot-pulse z-10 relative"
                      style={{
                        background: '#C9A84C',
                        border: '2px solid #060E1A',
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <TimelineCard exp={exp} isRTL={isRTL} t={t} index={idx} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
