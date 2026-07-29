'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import { gsap } from 'gsap';

function useGsapCounter(target: number, isInView: boolean) {
  const [count, setCount] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (!isInView || animated.current) return;
    animated.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate() { setCount(Math.round(obj.val)); },
      onComplete() { setCount(target); },
    });
  }, [isInView, target]);

  return count;
}

function StatCard({
  value, suffix, labelAr, labelEn, icon, isInView, index,
}: {
  value: number; suffix: string; labelAr: string; labelEn: string;
  icon: string; isInView: boolean; index: number;
}) {
  const { t } = useLanguage();
  const count = useGsapCounter(value, isInView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center text-center group px-4"
    >
      {/* Icon bubble */}
      <div className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110"
        style={{
          background: 'rgba(200,164,90,0.06)',
          border: '1px solid rgba(200,164,90,0.12)',
        }}
      >
        <i className={`${icon} text-2xl`} style={{ color: '#C8A45A' }} />
      </div>

      {/* Number */}
      <div
        className="font-bold mb-2 tabular-nums leading-none"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          background: 'linear-gradient(135deg, #C8A45A 0%, #E8D48B 60%, #C8A45A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 20px rgba(200,164,90,0.3))',
        }}
      >
        {count}{suffix}
      </div>

      {/* Label */}
      <div className="text-white/45 text-sm font-medium group-hover:text-white/70 transition-colors duration-300 tracking-wide">
        {t(labelAr, labelEn)}
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const { isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    { value: 5,  suffix: '+', labelAr: 'سنوات الخبرة',    labelEn: 'Years Experience', icon: 'fi fi-br-time-fast' },
    { value: 10, suffix: '+', labelAr: 'عميل',             labelEn: 'Clients',          icon: 'fi fi-br-users' },
    { value: 50, suffix: '+', labelAr: 'مشروع منجز',       labelEn: 'Projects Done',    icon: 'fi fi-br-layers' },
    { value: 30, suffix: '+', labelAr: 'حملة إعلانية',    labelEn: 'Ad Campaigns',     icon: 'fi fi-br-megaphone' },
  ];

  return (
    <section ref={ref} className="bg-[#0A0A0A] relative overflow-hidden py-20 md:py-24" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Subtle divider lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Gold glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-gold/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Eyebrow */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-eyebrow justify-center">
            <i className="fi fi-br-chart-line-up" />
            {isRTL ? 'إنجازاتي بالأرقام' : 'Achievements in Numbers'}
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <StatCard {...stat} isInView={isInView} index={index} />
              {/* Vertical separator */}
              {index < stats.length - 1 && (
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
