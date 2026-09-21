'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';

interface Service {
  number: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
}

const services: Service[] = [
  {
    number: '01',
    titleAr: 'تصميم الجرافيك',
    titleEn: 'Graphic Design',
    descAr: 'تصميم المواد الإعلانية والتسويقية والمحتوى البصري للمطبوعات والمنصات الرقمية.',
    descEn: 'Designing advertising and marketing materials, print, and digital visual content.',
    icon: 'fi fi-br-paint-brush',
  },
  {
    number: '02',
    titleAr: 'الهوية البصرية',
    titleEn: 'Brand Identity',
    descAr: 'تصميم وتطوير الهوية البصرية الكاملة وتطبيقاتها على المواد المختلفة.',
    descEn: 'Designing and developing complete visual identities with brand guidelines and applications.',
    icon: 'fi fi-br-pen-nib',
  },
  {
    number: '03',
    titleAr: 'تصميم المعارض والفعاليات',
    titleEn: 'Exhibition & Event Design',
    descAr: 'تصميم الهوية والمواد البصرية للمعارض والمؤتمرات والفعاليات التجارية والحكومية.',
    descEn: 'Designing visual identity and materials for exhibitions, conferences, and corporate events.',
    icon: 'fi fi-br-flag',
  },
  {
    number: '04',
    titleAr: 'البروفايلات التجارية',
    titleEn: 'Corporate Profiles',
    descAr: 'تصميم بروفايلات الشركات والعروض التجارية بمستوى تصميمي يعكس احترافية المؤسسة.',
    descEn: 'Designing company profiles and corporate presentations that reflect institutional professionalism.',
    icon: 'fi fi-br-file-pdf',
  },
  {
    number: '05',
    titleAr: 'التصميم الرقمي',
    titleEn: 'Digital Design',
    descAr: 'تصميم المواد الرقمية وواجهات المستخدم والمحتوى البصري للمنصات الإلكترونية.',
    descEn: 'Designing digital materials, UI layouts, and visual content for digital platforms.',
    icon: 'fi fi-br-computer',
  },
  {
    number: '06',
    titleAr: 'تصميم وتطوير المواقع',
    titleEn: 'Web Design & Development',
    descAr: 'تصميم وتطوير المواقع الإلكترونية بواجهات عصرية واستجابة كاملة للأجهزة المختلفة.',
    descEn: 'Designing and developing websites with modern interfaces and full device responsiveness.',
    icon: 'fi fi-br-globe',
  },
];

export default function ServicesSection() {
  const { isRTL, t } = useLanguage();

  return (
    <section
      id="services"
      className="bg-[#060E1A] section-padding relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-16 reveal-up">
          <p className="section-eyebrow">
            <i className="fi fi-br-settings" />
            {t('ماذا أقدم', 'What I Do')}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="section-title-xl">
              {t('الخدمات', 'Ser')}<span style={{ color: '#C9A84C' }}>{t('', 'vices')}</span>
            </h2>
            <p className="text-white/40 text-sm max-w-xs leading-relaxed">
              {t(
                'مجال عملي كمصمم جرافيك محترف',
                'My scope of work as a professional graphic designer'
              )}
            </p>
          </div>
          <div className="gold-line" />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06]">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="service-card group bg-[#060E1A] p-8 relative overflow-hidden hover:bg-[#0A1628] transition-colors duration-300"
            >
              {/* Number */}
              <span className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} text-[11px] font-bold text-white/10 select-none tabular-nums`}>
                {service.number}
              </span>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.15)',
                }}
              >
                <i className={`${service.icon} text-xl`} style={{ color: '#C9A84C' }} />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
                {t(service.titleAr, service.titleEn)}
              </h3>

              {/* Description */}
              <p className={`text-sm text-white/40 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(service.descAr, service.descEn)}
              </p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
