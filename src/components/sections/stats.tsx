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
      duration: 2.2,
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
    <div className="relative flex flex-col items-center text-center group px-4">
      <div className="mb-4 w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <i className={`${icon} text-2xl`} style={{ color: '#C9A84C' }} />
      </div>

      <div
        className="font-bold mb-1 tabular-nums leading-none"
        style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.25rem)',
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D48B 60%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 15px rgba(201,168,76,0.25))',
        }}
      >
        {count}{suffix}
      </div>

      <div className="text-white/60 text-sm font-medium group-hover:text-white transition-colors duration-300">
        {t(labelAr, labelEn)}
      </div>
    </div>
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
    <section ref={ref} className="bg-[#060E1A] relative overflow-hidden py-16 md:py-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <p className="section-eyebrow justify-center">
            <i className="fi fi-br-chart-line-up" />
            {isRTL ? 'إنجازاتي بالأرقام' : 'Achievements in Numbers'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <StatCard {...stat} isInView={isInView} index={index} />
              {index < stats.length - 1 && (
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-14 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent ${
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
