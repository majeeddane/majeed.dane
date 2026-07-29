'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
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

const flatIconMap: Record<string, { icon: string; color: string }> = {
  Palette:         { icon: 'fi fi-br-palette',         color: '#C9A84C' },
  Megaphone:       { icon: 'fi fi-br-megaphone',       color: '#2E7BC4' },
  Headphones:      { icon: 'fi fi-br-headphones',      color: '#5A9FD4' },
  FileSpreadsheet: { icon: 'fi fi-br-file-spreadsheet',color: '#C9A84C' },
  Sparkles:        { icon: 'fi fi-br-sparkles',        color: '#D4BC6A' },
  Brain:           { icon: 'fi fi-br-brain',           color: '#2E7BC4' },
  PenTool:         { icon: 'fi fi-br-pen-nib',         color: '#C9A84C' },
  Award:           { icon: 'fi fi-br-trophy',          color: '#D4BC6A' },
  BookOpen:        { icon: 'fi fi-br-book-open-cover', color: '#5A9FD4' },
  Briefcase:       { icon: 'fi fi-br-briefcase',       color: '#2E7BC4' },
  Users:           { icon: 'fi fi-br-users',           color: '#C9A84C' },
};

const defaultFlatIcons = [
  { icon: 'fi fi-br-palette',   color: '#C9A84C' },
  { icon: 'fi fi-br-megaphone', color: '#2E7BC4' },
  { icon: 'fi fi-br-brain',     color: '#5A9FD4' },
  { icon: 'fi fi-br-sparkles',  color: '#D4BC6A' },
  { icon: 'fi fi-br-pen-nib',   color: '#C9A84C' },
];

function CircularProgress({
  level, isInView, color = '#C9A84C',
}: { level: number; isInView: boolean; color?: string }) {
  const radius = 36;
  const stroke = 3.5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (level / 100) * circumference;

  return (
    <div className="relative w-18 h-18 mx-auto">
      <svg className="w-18 h-18 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx="50" cy="50" r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white">
          {level}%
        </span>
      </div>
    </div>
  );
}

function SkillCard({
  skill, index, isInView,
}: { skill: Skill; index: number; isInView: boolean }) {
  const { t, isRTL } = useLanguage();

  const flatIcon = skill.icon && flatIconMap[skill.icon]
    ? flatIconMap[skill.icon]
    : defaultFlatIcons[index % defaultFlatIcons.length];

  return (
    <div
      className="card-glass p-6 flex flex-col items-center text-center group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `${flatIcon.color}15`,
          border: `1px solid ${flatIcon.color}30`,
        }}
      >
        <i className={`${flatIcon.icon} text-2xl`} style={{ color: flatIcon.color }} />
      </div>

      <h3 className="text-base font-bold text-white mb-2 leading-snug">
        {t(skill.titleAr, skill.titleEn)}
      </h3>

      {(skill.descAr || skill.descEn) && (
        <p className={`text-xs text-white/60 mb-4 leading-relaxed line-clamp-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(skill.descAr || '', skill.descEn || '')}
        </p>
      )}

      <div className="mt-auto pt-2">
        <CircularProgress level={skill.level} isInView={isInView} color={flatIcon.color} />
      </div>
    </div>
  );
}

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
    <section ref={ref} className="bg-[#0A1628] section-padding" id="skills">
      <div className="container mx-auto px-6 sm:px-8">
        <div className="text-center mb-14 reveal-up">
          <p className="section-eyebrow justify-center">
            <i className="fi fi-br-stars" />
            {t('ما أتقنه', 'What I Master')}
          </p>
          <h2 className="section-title-xl">
            {t('الم', 'Sk')}<span style={{ color: '#C9A84C' }}>{t('هارات', 'ills')}</span>
          </h2>
          <div className="gold-line mx-auto" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
          </div>
        ) : skills.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/40 text-base">{t('لا توجد مهارات بعد', 'No skills yet')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {skills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} isInView={isInView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
