'use client';

import { useLanguage } from '@/lib/language-context';
import { Download, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const quickLinks = [
  { ar: 'نبذة عني', en: 'About',      href: '#about' },
  { ar: 'المهارات', en: 'Skills',     href: '#skills' },
  { ar: 'الخبرة',   en: 'Experience', href: '#experience' },
  { ar: 'الأعمال',  en: 'Portfolio',  href: '#portfolio' },
  { ar: 'تواصل',    en: 'Contact',    href: '#contact' },
];

interface FooterProps {
  initialContent?: { key: string; valueAr: string | null; valueEn: string | null; type: string; id: string }[];
}

export default function Footer({ initialContent = [] }: FooterProps) {
  const { isRTL, t } = useLanguage();
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const cvItem = data.find((item: { key: string; valueAr: string | null }) => item.key === 'cv_file');
        if (cvItem?.valueAr) {
          setCvUrl(cvItem.valueAr);
        }
      })
      .catch(() => { });
  }, []);

  const handleCvClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cvUrl) {
      e.preventDefault();
      toast({
        title: t('لم يتم رفع الملف بعد', 'File not uploaded yet'),
        description: t('سيتم إضافة الملف قريباً', 'The file will be added soon'),
      });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      className="bg-[#0A0A0A] border-t border-white/[0.06] relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Subtle top gold glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 items-start">
          {/* Column 1: Name + Role + Description */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
              <span style={{ color: '#C8A45A' }}>{t('عبدالمجيد', 'Al')}</span>
              {t(' الضاعني', '-Daani')}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold/80 mb-4">
              {t('مصمم جرافيك ومسوّق رقمي ومطوّر', 'Graphic Designer & Digital Marketer & Developer')}
            </p>
            <p className="text-sm leading-relaxed text-white/40 max-w-sm">
              {t(
                'أساعد العلامات التجارية والأنشطة التجارية على بناء هوية بصرية مميزة وتحقيق نمو رقمي مستدام من خلال مزج الإبداع بالتسويق والتكنولوجيا.',
                'Helping brands and businesses build distinctive visual identities and achieve sustainable digital growth through creative design, strategic marketing, and technology.'
              )}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:mx-auto">
            <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gold/80">
              {t('روابط سريعة', 'Quick Navigation')}
            </h4>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  data-cursor-hover
                  className="text-sm text-white/50 transition-colors duration-200 hover:text-white flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gold/30 group-hover:bg-gold transition-colors" />
                  {t(link.ar, link.en)}
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: CV + Admin Trigger + Rights */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-widest text-gold/80">
                {t('السيرة الذاتية وإدارة', 'Resume & Admin')}
              </h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href={cvUrl || '#'}
                  target={cvUrl ? '_blank' : undefined}
                  rel={cvUrl ? 'noopener noreferrer' : undefined}
                  onClick={handleCvClick}
                  data-cursor-hover
                  className="btn-outline-gold text-xs py-2 px-4"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t('تحميل السيرة الذاتية', 'Download CV')}
                </a>

                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-admin-panel'));
                  }}
                  data-cursor-hover
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/50 transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.08] hover:text-white"
                  aria-label={t('لوحة الإدارة', 'Admin Panel')}
                >
                  <Settings className="h-3.5 w-3.5 text-white/40" />
                  <span>{t('لوحة التحكم', 'Admin Panel')}</span>
                </button>
              </div>
            </div>

            <div className="mt-12 md:mt-16 pt-6 border-t border-white/[0.05]">
              <p className="text-xs text-white/30">
                {t(
                  '© 2026 عبدالمجيد الضاعني. جميع الحقوق محفوظة.',
                  '© 2026 Al-Daani. All Rights Reserved.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
