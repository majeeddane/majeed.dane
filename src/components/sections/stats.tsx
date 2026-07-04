'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

interface StatItemProps {
  value: number;
  suffix?: string;
  labelAr: string;
  labelEn: string;
  isInView: boolean;
  index: number;
}

function AnimatedCounter({ value, suffix = '', isInView }: { value: number; suffix?: string; isInView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

function StatItem({ value, suffix, labelAr, labelEn, isInView, index }: StatItemProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="flex flex-col items-center text-center px-4"
    >
      <div className="text-4xl md:text-5xl font-bold text-gold mb-2">
        <AnimatedCounter value={value} suffix={suffix} isInView={isInView} />
      </div>
      <div className="text-white/80 text-sm md:text-base font-medium">
        {t(labelAr, labelEn)}
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: 5, suffix: '+', labelAr: 'سنوات الخبرة', labelEn: 'Years Experience' },
    { value: 10, suffix: '+', labelAr: 'عميل', labelEn: 'Clients' },
    { value: 50, suffix: '+', labelAr: 'مشروع', labelEn: 'Projects' },
    { value: 30, suffix: '+', labelAr: 'حملة إعلانية', labelEn: 'Ad Campaigns' },
  ];

  return (
    <section ref={ref} className="gradient-navy section-padding relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
          {stats.map((stat, index) => (
            <div key={index} className="relative">
              <StatItem
                value={stat.value}
                suffix={stat.suffix}
                labelAr={stat.labelAr}
                labelEn={stat.labelEn}
                isInView={isInView}
                index={index}
              />
              {/* Separator lines between stats on desktop */}
              {index < stats.length - 1 && (
                <div
                  className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-16 w-px bg-white/15 ${
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
