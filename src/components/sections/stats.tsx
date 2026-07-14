'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import { gsap } from 'gsap';

// GSAP-powered counter hook
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
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Icon bubble */}
      <div className="mb-4 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center
        group-hover:bg-gold/15 group-hover:border-gold/30 transition-all duration-300 group-hover:scale-110">
        <i className={`${icon} text-2xl text-gold`} />
      </div>

      {/* Number */}
      <div
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tabular-nums"
        style={{
          background: 'linear-gradient(135deg, #C9A84C 0%, #E8D48B 50%, #C9A84C 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.35))',
        }}
      >
        {count}{suffix}
      </div>

      <div className="text-white/70 text-sm md:text-base font-medium group-hover:text-white/90 transition-colors">
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
    { value: 5,  suffix: '+', labelAr: 'سنوات الخبرة',    labelEn: 'Years Experience', icon: 'fi fi-br-time-fast'     },
    { value: 10, suffix: '+', labelAr: 'عميل',             labelEn: 'Clients',          icon: 'fi fi-br-users'         },
    { value: 50, suffix: '+', labelAr: 'مشروع',            labelEn: 'Projects',         icon: 'fi fi-br-layers'        },
    { value: 30, suffix: '+', labelAr: 'حملة إعلانية',    labelEn: 'Ad Campaigns',     icon: 'fi fi-br-megaphone'     },
  ];

  return (
    <section ref={ref} className="gradient-navy section-padding relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glowing gold orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Animate.css section tag */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] font-semibold">
            <i className="fi fi-br-chart-line-up mr-2 align-middle" />
            {isRTL ? 'إنجازاتي بالأرقام' : 'My Achievements in Numbers'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <StatCard {...stat} isInView={isInView} index={index} />
              {/* Separator */}
              {index < stats.length - 1 && (
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-16 w-px bg-white/10 ${
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
