'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Palette, Megaphone, Headphones, FileSpreadsheet, Sparkles, type LucideIcon } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface Skill {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  level: number;
}

const skills: Skill[] = [
  {
    icon: Palette,
    titleAr: 'التصميم الجرافيكي',
    titleEn: 'Graphic Design',
    descAr: 'تصميم الهويات البصرية ومحتوى بصري جذاب باستخدام Canva و Adobe Photoshop & Illustrator للمحترفين',
    descEn: 'Visual identity design and engaging visual content using Canva and Adobe Photoshop & Illustrator',
    level: 95,
  },
  {
    icon: Megaphone,
    titleAr: 'التسويق الرقمي',
    titleEn: 'Digital Marketing',
    descAr: 'إدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة، وكتابة المحتوى التسويقي والإبداعي',
    descEn: 'Social media management, funded ad campaigns, and creative marketing content writing',
    level: 90,
  },
  {
    icon: Headphones,
    titleAr: 'خدمة العملاء',
    titleEn: 'Customer Service',
    descAr: 'الرد على التعليقات والاستفسارات بطريقة احترافية على صفحات الشركات',
    descEn: 'Professional responses to comments and inquiries on company pages',
    level: 85,
  },
  {
    icon: FileSpreadsheet,
    titleAr: 'أدوات المكتب والعروض',
    titleEn: 'Office & Presentations',
    descAr: 'تصميم بروفايلات خاصة بالشركات، إتقان برامج الأوفيس (Word – PowerPoint)',
    descEn: 'Company profiles, proficiency in Office (Word – PowerPoint)',
    level: 88,
  },
  {
    icon: Sparkles,
    titleAr: 'الذكاء الاصطناعي',
    titleEn: 'AI Tools',
    descAr: 'توظيف أدوات الذكاء الاصطناعي في تسريع التصميم وإدارة المحتوى',
    descEn: 'Leveraging AI tools to accelerate design and content management',
    level: 92,
  },
];

function CircularProgress({ level, isInView }: { level: number; isInView: boolean }) {
  const radius = 40;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#C9A84C"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-sm font-bold text-navy-900"
        >
          {level}%
        </motion.span>
      </div>
    </div>
  );
}

function SkillCard({ skill, index, isInView }: { skill: Skill; index: number; isInView: boolean }) {
  const { t, isRTL } = useLanguage();
  const Icon = skill.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(11, 37, 69, 0.12)' }}
      className="bg-white rounded-xl p-6 shadow-sm border border-border/50 flex flex-col items-center text-center transition-colors"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy-800 to-blue-600 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gold" />
      </div>

      <h3 className="text-lg font-bold text-navy-900 mb-2">
        {t(skill.titleAr, skill.titleEn)}
      </h3>

      <p className={`text-sm text-muted-foreground mb-4 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
        {t(skill.descAr, skill.descEn)}
      </p>

      <div className="mt-auto">
        <CircularProgress level={skill.level} isInView={isInView} />
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            {t('المهارات', 'Skills')}
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        {/* Skills Grid - last 2 centered on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
