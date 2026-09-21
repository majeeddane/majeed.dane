'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';

interface SkillGroup {
  categoryAr: string;
  categoryEn: string;
  icon: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    categoryAr: 'التصميم',
    categoryEn: 'Design',
    icon: 'fi fi-br-palette',
    skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva', 'InDesign'],
  },
  {
    categoryAr: 'الرقمي والويب',
    categoryEn: 'Digital & Web',
    icon: 'fi fi-br-globe',
    skills: ['UI Design', 'Web Design', 'Responsive Design', 'Website Development'],
  },
  {
    categoryAr: 'التسويق',
    categoryEn: 'Marketing',
    icon: 'fi fi-br-megaphone',
    skills: ['Meta Ads', 'Google Ads', 'Social Media Content', 'Marketing Materials'],
  },
  {
    categoryAr: 'سير العمل بالذكاء الاصطناعي',
    categoryEn: 'AI-Assisted Workflow',
    icon: 'fi fi-br-brain',
    skills: ['AI Research', 'AI Ideation', 'Visual Exploration', 'Workflow Acceleration'],
  },
];

export default function SkillsSection() {
  const { isRTL, t } = useLanguage();

  return (
    <section
      id="skills"
      className="bg-[#060E1A] section-padding relative"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="container mx-auto px-6 sm:px-8 max-w-5xl">
        <div className="mb-14 reveal-up">
          <p className="section-eyebrow">
            <i className="fi fi-br-stars" />
            {t('الأدوات والمهارات', 'Tools & Skills')}
          </p>
          <h2 className="section-title-xl">
            {t('المهارات', 'Sk')}<span style={{ color: '#C9A84C' }}>{t('', 'ills')}</span>
          </h2>
          <div className="gold-line" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.categoryEn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}
                >
                  <i className={`${group.icon} text-xs`} style={{ color: '#C9A84C' }} />
                </div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                  {t(group.categoryAr, group.categoryEn)}
                </h3>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block text-sm font-medium text-white/65 border border-white/[0.1] rounded-lg px-3.5 py-2 hover:border-gold/30 hover:text-white/80 transition-colors duration-200"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 border border-white/[0.06] rounded-xl p-5 bg-white/[0.02]"
        >
          <div className="flex items-start gap-3">
            <i className="fi fi-br-brain text-sm mt-0.5 flex-shrink-0" style={{ color: '#C9A84C' }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-1">
                {t('ملاحظة حول الذكاء الاصطناعي', 'Note on AI')}
              </p>
              <p className={`text-sm text-white/40 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(
                  'أستخدم أدوات الذكاء الاصطناعي كأداة مساعدة في البحث، واستكشاف الأفكار، وتسريع سير العمل. القرارات الإبداعية والتصميمية النهائية تبقى مرتبطة بمهارات التصميم.',
                  'I use AI tools as assistants for research, ideation, and workflow acceleration. Final creative and design decisions remain grounded in core design skills.'
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
