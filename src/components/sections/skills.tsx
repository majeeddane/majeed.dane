'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Palette,
  Megaphone,
  Headphones,
  FileSpreadsheet,
  Sparkles,
  Brain,
  PenTool,
  Award,
  BookOpen,
  Briefcase,
  Users,
  type LucideIcon
} from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface Skill {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string | null;
  descEn: string | null;
  icon: string | null;
  level: number;
  category: string;
  visible: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Palette,
  Megaphone,
  Headphones,
  FileSpreadsheet,
  Sparkles,
  Brain,
  PenTool,
  Award,
  BookOpen,
  Briefcase,
  Users
};

const defaultIcons: LucideIcon[] = [Palette, Megaphone, Headphones, FileSpreadsheet, Sparkles];

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
          className="text-sm font-bold text-white"
        >
          {level}%
        </motion.span>
      </div>
    </div>
  );
}

function SkillCard({ skill, index, isInView }: { skill: Skill; index: number; isInView: boolean }) {
  const { t, isRTL } = useLanguage();
  
  const Icon = skill.icon && iconMap[skill.icon]
    ? iconMap[skill.icon]
    : defaultIcons[index % defaultIcons.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
      className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/5 flex flex-col items-center text-center transition-colors"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-navy-800 to-blue-600 flex items-center justify-center mb-4 border border-white/5">
        <Icon className="w-7 h-7 text-gold" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        {t(skill.titleAr, skill.titleEn)}
      </h3>

      <p className={`text-sm text-white/70 mb-4 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
        {t(skill.descAr || '', skill.descEn || '')}
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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(Array.isArray(data) ? data.filter((s: Skill) => s.visible) : []);
      })
      .catch(() => {
        setSkills([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="section-padding bg-background" id="skills">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('المهارات', 'Skills')}
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
          </div>
        ) : skills.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-white/50">
              {t('لا توجد مهارات بعد', 'No skills yet')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} isInView={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
