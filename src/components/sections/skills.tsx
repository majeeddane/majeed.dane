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

const flatIconMap: Record<string, { icon: string; color: string }> = {
  Palette:         { icon: 'fi fi-br-palette',         color: '#C8A45A' },
  Megaphone:       { icon: 'fi fi-br-megaphone',       color: '#2E7BC4' },
  Headphones:      { icon: 'fi fi-br-headphones',      color: '#5A9FD4' },
  FileSpreadsheet: { icon: 'fi fi-br-file-spreadsheet',color: '#C8A45A' },
  Sparkles:        { icon: 'fi fi-br-sparkles',        color: '#D4BC6A' },
  Brain:           { icon: 'fi fi-br-brain',           color: '#2E7BC4' },
  PenTool:         { icon: 'fi fi-br-pen-nib',         color: '#C8A45A' },
  Award:           { icon: 'fi fi-br-trophy',          color: '#D4BC6A' },
  BookOpen:        { icon: 'fi fi-br-book-open-cover', color: '#5A9FD4' },
  Briefcase:       { icon: 'fi fi-br-briefcase',       color: '#2E7BC4' },
  Users:           { icon: 'fi fi-br-users',           color: '#C8A45A' },
};

const defaultFlatIcons = [
  { icon: 'fi fi-br-palette',   color: '#C8A45A' },
  { icon: 'fi fi-br-megaphone', color: '#2E7BC4' },
  { icon: 'fi fi-br-brain',     color: '#5A9FD4' },
  { icon: 'fi fi-br-sparkles',  color: '#D4BC6A' },
  { icon: 'fi fi-br-pen-nib',   color: '#C8A45A' },
];

/* ── Circular progress ring ── */
function CircularProgress({
  level, isInView, color = '#C8A45A',
}: { level: number; isInView: boolean; color?: string }) {
  const radius = 38;
  const stroke = 3.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} fill="none" />
        {/* Progress */}
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.4 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}50)` }}
        />
      </svg>
      {/* Percentage label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className="text-xs font-bold text-white/80"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          {level}%
        </motion.span>
      </div>
    </div>
  );
}

/* ── Skill Card — Glassmorphism ── */
function SkillCard({
  skill, index, isInView,
}: { skill: Skill; index: number; isInView: boolean }) {
  const { t, isRTL } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);

  const flatIcon = skill.icon && flatIconMap[skill.icon]
    ? flatIconMap[skill.icon]
    : defaultFlatIcons[index % defaultFlatIcons.length];

  /* GSAP 3D tilt on hover */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onEnter = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 14;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -14;
      gsap.to(el, { rotateX: y, rotateY: x, scale: 1.04, duration: 0.35, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.45, ease: 'power2.out' });
    };

    el.addEventListener('mousemove', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="card-glass p-6 flex flex-col items-center text-center group"
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Icon bubble */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${flatIcon.color}12`,
          border: `1px solid ${flatIcon.color}25`,
          boxShadow: `0 0 20px ${flatIcon.color}15`,
        }}
      >
        <i className={`${flatIcon.icon} text-2xl`} style={{ color: flatIcon.color }} />
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-white mb-2 leading-snug">
        {t(skill.titleAr, skill.titleEn)}
      </h3>

      {/* Description */}
      {(skill.descAr || skill.descEn) && (
        <p className={`text-xs text-white/45 mb-5 leading-relaxed line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(skill.descAr || '', skill.descEn || '')}
        </p>
      )}

      {/* Circular progress */}
      <div className="mt-auto pt-2">
        <CircularProgress level={skill.level} isInView={isInView} color={flatIcon.color} />
      </div>

      {/* Bottom glow line on hover */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 transition-all duration-500 rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${flatIcon.color}, transparent)` }}
      />
    </motion.div>
  );
}

/* ── Main Section ── */
export default function SkillsSection() {
  const { t } = useLanguage();
  const ref  = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [skills,  setSkills]  = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(Array.isArray(data) ? data.filter((s: Skill) => s.visible) : []);
      })
      .catch(() => setSkills([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section ref={ref} className="bg-[#0A0A0A] section-padding" id="skills">
      <div className="container mx-auto px-6 sm:px-8">

        {/* Header */}
        <div className="text-center mb-16 reveal-up">
          <p className="section-eyebrow justify-center">
            <i className="fi fi-br-stars" />
            {t('ما أتقنه', 'What I Master')}
          </p>
          <h2 className="section-title-xl">
            {t('الم', 'Sk')}<span style={{ color: '#C8A45A' }}>{t('هارات', 'ills')}</span>
          </h2>
          <div className="gold-line mx-auto" style={{ transformOrigin: 'center center' }} />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
          </div>
        ) : skills.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-white/30 text-base">{t('لا توجد مهارات بعد', 'No skills yet')}</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
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
