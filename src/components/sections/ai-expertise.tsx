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
      className="absolute w-1 h-1 bg-gold/20 rounded-full"
      style={{ left: x, top: y }}
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.5, 1.2, 0.5],
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
      transition={{ duration: 0.6, delay: 0.3 + index * 0.15 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-effect rounded-xl p-6 md:p-8 relative group overflow-hidden"
    >
      {/* Gold border accent - right in RTL, left in LTR */}
      <div
        className={`absolute top-0 bottom-0 w-1 bg-gold ${
          isRTL ? 'right-0 rounded-r-md' : 'left-0 rounded-l-md'
        }`}
      />

      {/* Icon with glow effect */}
      <div className="relative mb-5 inline-flex">
        <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-500" />
        <div className="relative w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
          <Icon className="w-7 h-7 text-gold" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-3">
        {t(capability.titleAr, capability.titleEn)}
      </h3>

      {/* Description */}
      <p className={`text-white/70 text-sm leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
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
  const { t, isRTL } = useLanguage();
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
    { delay: 0.6, x: '5%', y: '45%' },
    { delay: 1.8, x: '95%', y: '55%' },
  ];

  return (
    <section
      ref={ref}
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0B2545 0%, #0A1D3A 60%, #08162E 100%)' }}
    >
      {/* Glowing accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-gold/20 blur-lg" />
      </div>

      {/* Subtle grid lines background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ai-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ai-grid)" />
        </svg>
      </div>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} delay={p.delay} x={p.x} y={p.y} />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-gold" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t('الذكاء الاصطناعي', 'AI Expertise')}
            </h2>
          </div>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6" />
        </motion.div>

        {/* Prominent differentiator text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-center mb-12"
        >
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gradient-gold inline-block">
            {t('نقطة التميز الحقيقية', 'The Real Differentiator')}
          </p>
        </motion.div>

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
