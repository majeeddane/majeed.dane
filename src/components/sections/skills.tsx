'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import { gsap } from 'gsap';

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

// Map skill icon names → Flaticon class + color
const flatIconMap: Record<string, { icon: string; color: string }> = {
  Palette:        { icon: 'fi fi-br-palette', color: '#C9A84C' },
  Megaphone:      { icon: 'fi fi-br-megaphone', color: '#2E7BC4' },
  Headphones:     { icon: 'fi fi-br-headphones', color: '#5A9FD4' },
  FileSpreadsheet:{ icon: 'fi fi-br-file-spreadsheet', color: '#C9A84C' },
  Sparkles:       { icon: 'fi fi-br-sparkles', color: '#D4BC6A' },
  Brain:          { icon: 'fi fi-br-brain', color: '#2E7BC4' },
  PenTool:        { icon: 'fi fi-br-pen-nib', color: '#C9A84C' },
  Award:          { icon: 'fi fi-br-trophy', color: '#D4BC6A' },
  BookOpen:       { icon: 'fi fi-br-book-open-cover', color: '#5A9FD4' },
  Briefcase:      { icon: 'fi fi-br-briefcase', color: '#2E7BC4' },
  Users:          { icon: 'fi fi-br-users', color: '#C9A84C' },
};

const defaultFlatIcons = [
  { icon: 'fi fi-br-palette', color: '#C9A84C' },
  { icon: 'fi fi-br-megaphone', color: '#2E7BC4' },
  { icon: 'fi fi-br-brain', color: '#5A9FD4' },
  { icon: 'fi fi-br-sparkles', color: '#D4BC6A' },
  { icon: 'fi fi-br-pen-nib', color: '#C9A84C' },
];

function CircularProgress({ level, isInView, color = '#C9A84C' }: { level: number; isInView: boolean; color?: string }) {
  const radius = 40;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-muted/30" />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
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
  const cardRef = useRef<HTMLDivElement>(null);

  const flatIcon = skill.icon && flatIconMap[skill.icon]
    ? flatIconMap[skill.icon]
    : defaultFlatIcons[index % defaultFlatIcons.length];

  // GSAP hover tilt
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const onEnter = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -12;
      gsap.to(el, { rotateX: y, rotateY: x, scale: 1.03, duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    };
    el.addEventListener('mousemove', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onEnter); el.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-navy-800/30 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/5 flex flex-col items-center text-center
        transition-colors hover:border-gold/20 hover:bg-navy-800/50"
      style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
    >
      {/* Flaticon icon bubble with colored glow */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border transition-all duration-300"
        style={{
          background: `${flatIcon.color}15`,
          borderColor: `${flatIcon.color}30`,
          boxShadow: `0 0 20px ${flatIcon.color}20`,
        }}
      >
        <i className={`${flatIcon.icon} text-3xl`} style={{ color: flatIcon.color }} />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        {t(skill.titleAr, skill.titleEn)}
      </h3>

      <p className={`text-sm text-white/70 mb-4 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
        {t(skill.descAr || '', skill.descEn || '')}
      </p>

      <div className="mt-auto">
        <CircularProgress level={skill.level} isInView={isInView} color={flatIcon.color} />
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const gridRef = useRef<HTMLDivElement>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(Array.isArray(data) ? data.filter((s: Skill) => s.visible) : []);
      })
      .catch(() => { setSkills([]); })
      .finally(() => setLoading(false));
  }, []);

  // GSAP stagger on grid children when skills load
  useEffect(() => {
    if (!gridRef.current || !isInView || skills.length === 0) return;
    gsap.fromTo(
      gridRef.current.querySelectorAll(':scope > div'),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out', delay: 0.2 }
    );
  }, [isInView, skills]);

  return (
    <section ref={ref} className="section-padding bg-background" id="skills">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
          data-gsap="fade-up"
        >
          <p className="text-gold/60 text-xs uppercase tracking-[0.3em] font-semibold mb-3">
            <i className="fi fi-br-stars mr-2 align-middle" />
            {t('ما أتقنه', 'What I Master')}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('المهارات', 'Skills')}
          </h2>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full" />
        </motion.div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold/20 border-t-gold" />
              <i className="fi fi-br-sparkles absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold text-lg" />
            </div>
          </div>
        ) : skills.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-white/50">
              {t('لا توجد مهارات بعد', 'No skills yet')}
            </p>
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            data-gsap="stagger-cards"
          >
            {skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} isInView={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
