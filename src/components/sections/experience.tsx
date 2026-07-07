'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ExperienceEntry {
  id: string;
  companyAr: string;
  companyEn: string;
  descAr: string;
  descEn: string;
  visible: boolean;
}

function TimelineCard({ exp, isRTL, t, index }: { exp: ExperienceEntry; isRTL: boolean; t: (ar: string, en: string) => string; index: number }) {
  return (
    <div
      className="group w-full rounded-xl bg-white p-5 shadow-sm border border-border/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 md:p-6 relative overflow-hidden"
      style={{
        borderRightWidth: isRTL ? '4px' : undefined,
        borderRightColor: isRTL ? '#C9A84C' : undefined,
        borderLeftWidth: isRTL ? undefined : '4px',
        borderLeftColor: isRTL ? undefined : '#C9A84C',
      }}
    >
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900">
            <Briefcase className="h-5 w-5 text-gold" />
          </div>
          <h3 className="text-lg font-semibold text-navy-900">
            {t(exp.companyAr, exp.companyEn)}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
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
    fetch('/api/experience')
      .then(res => res.json())
      .then(data => {
        setExperiences(Array.isArray(data) ? data.filter((e: ExperienceEntry) => e.visible) : []);
      })
      .catch(() => {
        setExperiences([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="experience"
      className="bg-background section-padding"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-navy-900 md:text-4xl">
            {t('الخبرة العملية', 'Work Experience')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gold" />
        </motion.div>

        {/* Timeline Container */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-navy-900/50">
              {t('لا توجد خبرات بعد', 'No experiences yet')}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute top-0 h-full w-0.5"
              style={{
                background: 'linear-gradient(to bottom, #C9A84C, #13315C, #C9A84C)',
                ...(isRTL ? { right: '1rem' } : { left: '1rem' }),
              }}
            />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.12,
                  ease: 'easeOut',
                }}
                className="relative mb-10 last:mb-0"
              >
                {/* Timeline dot with gold gradient and pulse */}
                <div
                  className="absolute top-3 z-10 flex h-5 w-5 items-center justify-center rounded-full animate-dot-pulse"
                  style={{
                    background: 'linear-gradient(135deg, #C9A84C 0%, #D4BC6A 100%)',
                    border: '3px solid #0B2545',
                    ...(isRTL ? { right: '0.625rem' } : { left: '0.625rem' }),
                  }}
                />

                {/* Card with offset */}
                <div className={isRTL ? 'mr-12' : 'ml-12'}>
                  <TimelineCard exp={exp} isRTL={isRTL} t={t} index={index} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
