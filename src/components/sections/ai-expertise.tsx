'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Brain, Target } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface Capability {
  icon: typeof Sparkles;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

const capabilities: Capability[] = [
  {
    icon: Sparkles,
    titleAr: 'تسريع التصميم',
    titleEn: 'Accelerated Design',
    descAr: 'استخدام أدوات الذكاء الاصطناعي لتسريع عملية التصميم وإنتاج مخرجات إبداعية بجودة أعلى وبوقت أقل',
    descEn: 'Using AI tools to accelerate design process and produce creative outputs with higher quality in less time',
  },
  {
    icon: Brain,
    titleAr: 'كتابة المحتوى الذكي',
    titleEn: 'Smart Content Writing',
    descAr: 'توظيف الذكاء الاصطناعي في إنشاء محتوى تسويقي مقنع ومبتكر يحتوي على الكلمات المفتاحية المناسبة',
    descEn: 'Leveraging AI in creating persuasive and innovative marketing content with appropriate keywords',
  },
  {
    icon: Target,
    titleAr: 'إدارة الحملات بذكاء',
    titleEn: 'Smart Campaign Management',
    descAr: 'استخدام تحليلات الذكاء الاصطناعي لتحسين استهداف الحملات الإعلانية ورفع معدلات التحويل',
    descEn: 'Using AI analytics to optimize ad campaign targeting and increase conversion rates',
  },
];

function FloatingParticle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{ left: x, top: y, background: 'rgba(200,164,90,0.3)' }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.5, 1.4, 0.5],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

function CapabilityCard({ capability, index, isInView }: { capability: Capability; index: number; isInView: boolean }) {
  const { t, isRTL } = useLanguage();
  const Icon = capability.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="card-glass p-6 md:p-8 relative group overflow-hidden"
    >
      {/* Accent bar */}
      <div
        className={`absolute top-0 bottom-0 w-1 ${
          isRTL ? 'right-0 rounded-r-md' : 'left-0 rounded-l-md'
        }`}
        style={{ background: '#C8A45A' }}
      />

      {/* Icon */}
      <div className="relative mb-5 inline-flex">
        <div className="absolute inset-0 blur-xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-500" style={{ background: 'rgba(200,164,90,0.2)' }} />
        <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(200,164,90,0.08)', border: '1px solid rgba(200,164,90,0.2)' }}>
          <Icon className="w-7 h-7" style={{ color: '#C8A45A' }} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-3">
        {t(capability.titleAr, capability.titleEn)}
      </h3>

      {/* Description */}
      <p className={`text-white/50 text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
        {t(capability.descAr, capability.descEn)}
      </p>

      {/* Hover shimmer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="animate-shimmer absolute inset-0" />
      </div>
    </motion.div>
  );
}

export default function AIExpertiseSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const particles = [
    { delay: 0, x: '10%', y: '20%' },
    { delay: 0.8, x: '25%', y: '60%' },
    { delay: 1.6, x: '45%', y: '30%' },
    { delay: 2.4, x: '65%', y: '70%' },
    { delay: 3.2, x: '80%', y: '40%' },
    { delay: 0.4, x: '90%', y: '15%' },
    { delay: 1.2, x: '55%', y: '85%' },
    { delay: 2.0, x: '15%', y: '75%' },
    { delay: 2.8, x: '70%', y: '10%' },
    { delay: 3.6, x: '35%', y: '50%' },
  ];

  return (
    <section
      ref={ref}
      className="bg-[#0A0A0A] section-padding relative overflow-hidden"
    >
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} delay={p.delay} x={p.x} y={p.y} />
      ))}

      <div className="container mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 reveal-up text-center">
          <p className="section-eyebrow justify-center">
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#C8A45A' }} />
            {t('نقطة التميز الحقيقية', 'The Real Differentiator')}
          </p>
          <h2 className="section-title-xl">
            {t('خبرة', 'AI')}{' '}
            <span style={{ color: '#C8A45A' }}>{t('الذكاء الاصطناعي', 'Expertise')}</span>
          </h2>
          <div className="gold-line mx-auto" style={{ transformOrigin: 'center center' }} />
        </div>

        {/* Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={index}
              capability={capability}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
