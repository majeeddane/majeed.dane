'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import {
  Palette,
  Image,
  PenTool,
  Megaphone,
  Target,
  Brush,
  Layers,
  Sparkles,
  Brain,
  type LucideIcon,
} from 'lucide-react';

interface Course {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
}

const courses: Course[] = [
  {
    icon: Palette,
    titleAr: 'تصميم الهويات البصرية',
    titleEn: 'Visual Identity Design',
  },
  {
    icon: Image,
    titleAr: 'تصميم منشورات السوشيال ميديا',
    titleEn: 'Social Media Post Design',
  },
  {
    icon: PenTool,
    titleAr: 'كتابة المحتوى التسويقي',
    titleEn: 'Marketing Content Writing',
  },
  {
    icon: Megaphone,
    titleAr: 'إدارة الإعلانات على مواقع التواصل الاجتماعي',
    titleEn: 'Social Media Ads Management',
  },
  {
    icon: Target,
    titleAr: 'إعداد الحملات التسويقية والإعلانات الممولة',
    titleEn: 'Marketing Campaigns & Funded Ads',
  },
  {
    icon: Brush,
    titleAr: 'Canva للمحترفين',
    titleEn: 'Canva for Professionals',
  },
  {
    icon: Layers,
    titleAr: 'Adobe Photoshop & Illustrator',
    titleEn: 'Adobe Photoshop & Illustrator',
  },
  {
    icon: Sparkles,
    titleAr: 'طرق استخدام مواقع الذكاء الاصطناعي والاستفادة منها',
    titleEn: 'Using AI Websites Effectively',
  },
  {
    icon: Brain,
    titleAr: 'كيف تتعامل مع الذكاء الاصطناعي',
    titleEn: 'How to Deal with AI',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export default function CoursesSection() {
  const { isRTL, t } = useLanguage();

  return (
    <section
      id="courses"
      className="section-padding bg-background"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-navy-900 md:text-4xl">
            {t('الشهادات والدورات', 'Certifications & Courses')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gold" />
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {courses.map((course, index) => {
            const IconComponent = course.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group relative rounded-xl bg-white/60 p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg
                  border ${isRTL ? 'border-r-4 border-r-gold' : 'border-l-4 border-l-gold'} border-t-transparent border-b-transparent border-l-transparent border-r-transparent
                  ${isRTL ? 'rtl:border-r-gold' : 'ltr:border-l-gold'}
                `}
                style={{
                  borderLeftWidth: isRTL ? undefined : '4px',
                  borderLeftColor: isRTL ? undefined : '#C9A84C',
                  borderRightWidth: isRTL ? '4px' : undefined,
                  borderRightColor: isRTL ? '#C9A84C' : undefined,
                  borderTopWidth: '1px',
                  borderTopColor: 'rgba(19, 49, 92, 0.08)',
                  borderBottomWidth: '1px',
                  borderBottomColor: 'rgba(19, 49, 92, 0.08)',
                  borderLeftColor: isRTL ? 'rgba(19, 49, 92, 0.08)' : '#C9A84C',
                  borderRightColor: isRTL ? '#C9A84C' : 'rgba(19, 49, 92, 0.08)',
                  background: 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-navy-800/10 transition-colors duration-300 group-hover:bg-gold/15">
                  <IconComponent className="h-6 w-6 text-navy-800 transition-colors duration-300 group-hover:text-gold" />
                </div>
                <h3 className="text-base font-semibold leading-relaxed text-navy-900">
                  {t(course.titleAr, course.titleEn)}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
