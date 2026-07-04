'use client';

import { useLanguage } from '@/lib/language-context';
import { Download } from 'lucide-react';

const quickLinks = [
  { ar: 'عني', en: 'About', href: '#about' },
  { ar: 'المهارات', en: 'Skills', href: '#skills' },
  { ar: 'الخبرة', en: 'Experience', href: '#experience' },
  { ar: 'الأعمال', en: 'Portfolio', href: '#portfolio' },
  { ar: 'تواصل', en: 'Contact', href: '#contact' },
];

export default function Footer() {
  const { isRTL, t } = useLanguage();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="border-t border-gold/50 bg-[#0A1D3A]"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {/* Column 1: Name + Title + Tagline */}
          <div>
            <h3 className="text-xl font-bold text-white">
              {t('عبدالمجيد الضاعني', 'Al-Daani')}
            </h3>
            <p className="mt-1 text-sm text-gold">
              {t('مصمم ومسوق رقمي', 'Digital Designer & Marketer')}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {t(
                'أساعد العلامات التجارية على بناء هوية بصرية مميزة وتحقيق نمو رقمي مستدام.',
                'Helping brands build distinctive visual identities and achieve sustainable digital growth.'
              )}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              {t('روابط سريعة', 'Quick Links')}
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-white/60 transition-colors duration-200 hover:text-gold"
                >
                  {t(link.ar, link.en)}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Download CV + Copyright */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
                {t('السيرة الذاتية', 'Resume')}
              </h4>
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-gold px-5 py-2.5 text-sm font-medium text-gold transition-all duration-300 hover:bg-gold hover:text-navy-900"
              >
                <Download className="h-4 w-4" />
                {t('تحميل السيرة الذاتية', 'Download CV')}
              </a>
            </div>

            <p className="mt-8 text-xs text-white/40 md:mt-0">
              {t(
                '© 2024 عبدالمجيد الضاعني. جميع الحقوق محفوظة',
                '© 2024 Al-Daani. All Rights Reserved'
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
