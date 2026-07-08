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
import { useState, useEffect } from 'react';

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string | null;
  visible: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Image,
  PenTool,
  Megaphone,
  Target,
  Brush,
  Layers,
  Sparkles,
  Brain,
};

const defaultIcons: LucideIcon[] = [Palette, Image, PenTool, Megaphone, Target, Brush, Layers, Sparkles, Brain];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function CoursesSection() {
  const { isRTL, t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(Array.isArray(data) ? data.filter((c: Course) => c.visible) : []);
      })
      .catch(() => {
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section
      id="courses"
      className="section-padding bg-muted/30"
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
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t('الشهادات والدورات', 'Certifications & Courses')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gold" />
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-white/50">
              {t('لا توجد دورات بعد', 'No courses yet')}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {courses.map((course, index) => {
              const IconComponent = course.icon && iconMap[course.icon]
                ? iconMap[course.icon]
                : defaultIcons[index % defaultIcons.length];
              const number = String(index + 1).padStart(2, '0');
              return (
                <motion.div
                  key={course.id}
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group relative rounded-xl bg-navy-800/30 backdrop-blur-sm p-5 shadow-sm border border-white/5 transition-shadow duration-300 hover:shadow-md overflow-hidden"
                >
                  {/* Gradient accent bar on left (LTR) or right (RTL) */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-light"
                    style={{
                      [isRTL ? 'right' : 'left']: 0,
                    }}
                  />

                  {/* Numbered badge in top-right */}
                  <span
                    className="absolute top-3 text-xs font-bold text-gold/30 select-none"
                    style={{
                      [isRTL ? 'left' : 'right']: '12px',
                    }}
                  >
                    {number}
                  </span>

                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 border border-white/5 transition-colors duration-300 group-hover:bg-gold/15">
                    <IconComponent className="h-5 w-5 text-gold transition-colors duration-300 group-hover:text-gold" />
                  </div>
                  <h3 className="text-sm font-semibold leading-relaxed text-white">
                    {t(course.titleAr, course.titleEn)}
                  </h3>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}
