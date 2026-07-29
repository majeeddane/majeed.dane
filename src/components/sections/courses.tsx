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
  Award,
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
  Award,
};

const defaultIcons: LucideIcon[] = [Palette, Image, PenTool, Megaphone, Target, Brush, Layers, Sparkles, Brain, Award];

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
      className="bg-[#0A0A0A] section-padding relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 reveal-up">
          <p className="section-eyebrow">
            <Award className="w-3.5 h-3.5" style={{ color: '#C8A45A' }} />
            {t('المؤهلات والدورات', 'Qualifications & Courses')}
          </p>
          <h2 className="section-title-xl">
            {t('الشهادات', 'Certifications')}{' '}
            <span style={{ color: '#C8A45A' }}>{t('والدورات', '& Courses')}</span>
          </h2>
          <div className="gold-line" />
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-medium text-white/30">
              {t('لا توجد دورات بعد', 'No courses yet')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const IconComponent = course.icon && iconMap[course.icon]
                ? iconMap[course.icon]
                : defaultIcons[index % defaultIcons.length];
              const number = String(index + 1).padStart(2, '0');
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="group card-glass p-6 relative overflow-hidden flex items-start gap-4"
                >
                  {/* Accent border */}
                  <div
                    className={`absolute top-0 bottom-0 w-1 ${
                      isRTL ? 'right-0 rounded-r-md' : 'left-0 rounded-l-md'
                    }`}
                    style={{ background: 'linear-gradient(to bottom, #C8A45A, rgba(200,164,90,0.2))' }}
                  />

                  {/* Number badge */}
                  <span
                    className="absolute top-3 text-[11px] font-bold text-gold/30 select-none"
                    style={{
                      [isRTL ? 'left' : 'right']: '16px',
                    }}
                  >
                    {number}
                  </span>

                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(200,164,90,0.08)', border: '1px solid rgba(200,164,90,0.18)' }}
                  >
                    <IconComponent className="h-5 w-5" style={{ color: '#C8A45A' }} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-sm md:text-base font-bold leading-relaxed text-white group-hover:text-gold transition-colors duration-300">
                      {t(course.titleAr, course.titleEn)}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
