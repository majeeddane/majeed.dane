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

function TimelineCard({
  exp, isRTL, t,
}: {
  exp: ExperienceEntry; isRTL: boolean;
  t: (ar: string, en: string) => string;
}) {
  return (
    <div
      className="card-glass group p-6 relative overflow-hidden transition-all duration-300 hover:border-gold/40"
    >
      <div
        className="absolute top-0 h-full w-1"
        style={{
          background: 'linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.2))',
          ...(isRTL ? { right: 0 } : { left: 0 }),
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start gap-3.5 mb-3">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}
          >
            <i className="fi fi-br-briefcase text-sm" style={{ color: '#C9A84C' }} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white leading-snug pt-1">
            {t(exp.companyAr, exp.companyEn)}
          </h3>
        </div>

        <p className={`text-sm md:text-base leading-relaxed text-white/70 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(exp.descAr, exp.descEn)}
        </p>
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  const { isRTL, t } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cachedFetch<ExperienceEntry[]>('/api/experience')
      .then(data => {
        setExperiences(Array.isArray(data) ? data.filter((e: ExperienceEntry) => e.visible) : []);
      })
      .catch(() => setExperiences([]))
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
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/40 text-base">{t('لا توجد خبرات بعد', 'No experiences yet')}</p>
          </div>
        ) : (
          <div className="relative">
            <div
              className={`absolute top-0 h-full w-0.5 ${isRTL ? 'right-4' : 'left-4'}`}
              style={{
                background: 'linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.1))',
              }}
            />

            <div className="flex flex-col gap-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative flex gap-6 md:gap-8">
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
                    <TimelineCard exp={exp} isRTL={isRTL} t={t} />
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
