'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

interface ExperienceEntry {
  companyAr: string;
  companyEn: string;
  descAr: string;
  descEn: string;
}

const experiences: ExperienceEntry[] = [
  {
    companyAr: 'شركة كونتكت لنظم المعلومات',
    companyEn: 'Contact Information Systems (CIS)',
    descAr:
      'تصميم الهوية البصرية الكاملة للشركة، وإدارة حسابات التواصل الاجتماعي، والرد على استفسارات العملاء عبر الصفحات وخرائط جوجل.',
    descEn:
      'Complete visual identity design, social media management, and customer inquiries response via pages and Google Maps.',
  },
  {
    companyAr: 'شركة اتحاد العصر للمحاماة',
    companyEn: 'ASR Law Group',
    descAr:
      'تصميم وإدارة صفحات التواصل الاجتماعي، وإنشاء وإدارة حملات إعلانية ممولة.',
    descEn:
      'Social media design and management, creation and management of funded advertising campaigns.',
  },
  {
    companyAr: 'مخابز ساساز بيكري',
    companyEn: 'Sasaz Bakery',
    descAr: 'تصميم الهوية البصرية والمحتوى التسويقي.',
    descEn: 'Visual identity design and marketing content creation.',
  },
  {
    companyAr: 'عملاء متعددون',
    companyEn: 'Multiple Clients',
    descAr:
      'تصميم وإدارة صفحات التواصل الاجتماعي وإطلاق حملات إعلانية ممولة لشركات عقارية، مطاعم، تأجير سيارات، مقاهي، وشركة تنظيم مؤتمرات.',
    descEn:
      'Social media design and management, launching funded ad campaigns for real estate, restaurants, car rental, cafes, and event management companies.',
  },
  {
    companyAr: 'مشاريع ويب وبروفايلات',
    companyEn: 'Web & Profile Projects',
    descAr: 'تصميم بروفايلات تعريفية للشركات، وتصميم وتطوير مواقع ويب.',
    descEn: 'Company profile design and website development.',
  },
];

export default function ExperienceSection() {
  const { isRTL, t } = useLanguage();

  return (
    <section
      id="experience"
      className="bg-white py-16 md:py-24"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ color: '#0B2545' }}
          >
            {t('الخبرة العملية', 'Work Experience')}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-24 rounded-full"
            style={{ backgroundColor: '#C9A84C' }}
          />
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical line - visible on desktop, centered */}
          <div
            className="absolute top-0 hidden h-full w-0.5 md:block"
            style={{
              backgroundColor: '#13315C',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          {/* Vertical line - visible on mobile, left aligned (or right in RTL) */}
          <div
            className="absolute top-0 h-full w-0.5 md:hidden"
            style={{
              backgroundColor: '#13315C',
              left: isRTL ? undefined : '1.25rem',
              right: isRTL ? '1.25rem' : undefined,
            }}
          />

          {experiences.map((exp, index) => {
            const isEven = index % 2 === 0;
            // On desktop: even items go to the right side, odd to the left side
            const desktopSide = isEven ? 'right' : 'left';

            return (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x:
                    typeof window !== 'undefined' && window.innerWidth >= 768
                      ? desktopSide === 'left'
                        ? isRTL
                          ? 60
                          : -60
                        : isRTL
                          ? -60
                          : 60
                      : isRTL
                        ? 40
                        : -40,
                }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: 'easeOut',
                }}
                className="relative mb-12 md:mb-16"
              >
                {/* Timeline dot - mobile */}
                <div
                  className="absolute top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-[3px] md:hidden"
                  style={{
                    borderColor: '#13315C',
                    backgroundColor: '#C9A84C',
                    left: isRTL ? undefined : '0.5rem',
                    right: isRTL ? '0.5rem' : undefined,
                  }}
                />
                {/* Timeline dot - desktop */}
                <div
                  className="absolute top-2 z-10 hidden h-6 w-6 items-center justify-center rounded-full border-[3px] md:flex"
                  style={{
                    borderColor: '#13315C',
                    backgroundColor: '#C9A84C',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />

                {/* Card - mobile: full width with offset */}
                <div
                  className={`md:hidden ${
                    isRTL ? 'mr-10' : 'ml-10'
                  }`}
                >
                  <CardContent exp={exp} isRTL={isRTL} t={t} />
                </div>

                {/* Card - desktop: alternating sides */}
                <div
                  className={`hidden md:block ${
                    desktopSide === 'right'
                      ? isRTL
                        ? 'mr-[calc(50%+1.5rem)]'
                        : 'ml-[calc(50%+1.5rem)]'
                      : isRTL
                        ? 'ml-[calc(50%+1.5rem)]'
                        : 'mr-[calc(50%+1.5rem)]'
                  }`}
                  style={{
                    width: 'calc(50% - 1.5rem)',
                    ...(desktopSide === 'left'
                      ? isRTL
                        ? { marginRight: 'calc(50% + 1.5rem)' }
                        : { marginLeft: 0, marginRight: 'auto' }
                      : {}),
                  }}
                >
                  <CardContent exp={exp} isRTL={isRTL} t={t} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CardContent({
  exp,
  isRTL,
  t,
}: {
  exp: ExperienceEntry;
  isRTL: boolean;
  t: (ar: string, en: string) => string;
}) {
  return (
    <div
      className={`w-full rounded-lg border bg-white p-5 shadow-md transition-shadow hover:shadow-lg md:p-6 ${
        isRTL ? 'border-r-4' : 'border-l-4'
      }`}
      style={{
        [isRTL ? 'borderRightColor' : 'borderLeftColor']: '#C9A84C',
      }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: '#0B2545' }}
        >
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        <h3
          className="text-lg font-semibold"
          style={{ color: '#0B2545' }}
        >
          {t(exp.companyAr, exp.companyEn)}
        </h3>
      </div>
      <p
        className="text-sm leading-relaxed md:text-base"
        style={{ color: '#13315C', opacity: 0.85 }}
      >
        {t(exp.descAr, exp.descEn)}
      </p>
    </div>
  );
}
