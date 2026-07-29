'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ExperienceEntry {
  id: string;
  companyAr: string;
  companyEn: string;
  descAr: string;
  descEn: string;
  visible: boolean;
}

function TimelineCard({
  exp, isRTL, t, index,
}: {
  exp: ExperienceEntry; isRTL: boolean;
  t: (ar: string, en: string) => string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="card-glass group p-6 md:p-7 relative overflow-hidden transition-all duration-400"
    >
      {/* Gold accent line */}
      <div
        className="absolute top-0 h-full w-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to bottom, #C8A45A, rgba(200,164,90,0.1))',
          ...(isRTL ? { right: 0 } : { left: 0 }),
        }}
      />

      {/* Hover background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(200,164,90,0.08)', border: '1px solid rgba(200,164,90,0.18)' }}
          >
            <i className="fi fi-br-briefcase text-sm" style={{ color: '#C8A45A' }} />
          </div>
          <h3 className="text-base md:text-lg font-bold text-white leading-snug pt-1">
            {t(exp.companyAr, exp.companyEn)}
          </h3>
        </div>

        {/* Description */}
        <p className={`text-sm md:text-base leading-relaxed text-white/50 group-hover:text-white/65 transition-colors duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(exp.descAr, exp.descEn)}
        </p>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const { isRTL, t } = useLanguage();
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => {
        setExperiences(Array.isArray(data) ? data.filter((e: ExperienceEntry) => e.visible) : []);
      })
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="experience"
      className="bg-[#0A0A0A] section-padding"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-4xl px-6 sm:px-8">

        {/* Header */}
        <div className="mb-16 reveal-up">
          <p className="section-eyebrow">
            <i className="fi fi-br-briefcase" />
            {t('مسيرتي المهنية', 'Professional Journey')}
          </p>
          <h2 className="section-title-xl">
            {t('الخبرة', 'Work')}{' '}
            <span style={{ color: '#C8A45A' }}>{t('العملية', 'Experience')}</span>
          </h2>
          <div className="gold-line" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-white/30 text-base">{t('لا توجد خبرات بعد', 'No experiences yet')}</p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div
              className={`timeline-line absolute top-0 h-full ${isRTL ? 'right-[1.625rem]' : 'left-[1.625rem]'}`}
              style={{
                background: 'linear-gradient(to bottom, rgba(200,164,90,0.6), rgba(200,164,90,0.05))',
              }}
            />
            {/* Trigger in-view for timeline line */}
            <motion.div
              className={`timeline-line-animated absolute top-0 w-px ${isRTL ? 'right-[1.625rem]' : 'left-[1.625rem]'}`}
              style={{
                background: 'linear-gradient(to bottom, #C8A45A, rgba(200,164,90,0))',
              }}
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />

            <div className="flex flex-col gap-8">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="relative flex gap-6 md:gap-8">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 flex flex-col items-center mt-6">
                    <motion.div
                      className="w-5 h-5 rounded-full animate-dot-pulse z-10 relative"
                      style={{
                        background: 'linear-gradient(135deg, #C8A45A 0%, #D4BC6A 100%)',
                        border: '3px solid #0A0A0A',
                        boxShadow: '0 0 12px rgba(200,164,90,0.5)',
                      }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.12 + 0.3 }}
                    />
                  </div>

                  {/* Card */}
                  <div className="flex-1 pb-2">
                    <TimelineCard exp={exp} isRTL={isRTL} t={t} index={index} />
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
