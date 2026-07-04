'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

function AnimatedCounter({ value, suffix = '', isInView }: { value: number; suffix?: string; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let start = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    { value: 5, suffix: '+', labelAr: 'سنوات الخبرة', labelEn: 'Years Experience' },
    { value: 10, suffix: '+', labelAr: 'عميل', labelEn: 'Clients' },
    { value: 50, suffix: '+', labelAr: 'مشروع', labelEn: 'Projects' },
    { value: 30, suffix: '+', labelAr: 'حملة إعلانية', labelEn: 'Ad Campaigns' },
  ];

  return (
    <section ref={ref} className="gradient-navy section-padding relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
              </div>
              <div className="text-white/70 text-sm md:text-base font-medium">
                {t(stat.labelAr, stat.labelEn)}
              </div>
              {/* Separator lines between stats on desktop */}
              {index < stats.length - 1 && (
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-16 w-px bg-white/10 ${
                    isRTL ? 'left-0' : 'right-0'
                  }`}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
