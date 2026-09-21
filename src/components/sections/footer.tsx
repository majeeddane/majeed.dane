'use client';

import { useLanguage } from '@/lib/language-context';
import { Download, Mail, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const quickLinks = [
  { ar: 'الأعمال',  en: 'Work',       href: '#portfolio' },
  { ar: 'الخدمات', en: 'Services',   href: '#services'  },
  { ar: 'الخبرة',  en: 'Experience', href: '#experience'},
  { ar: 'عني',     en: 'About',      href: '#about'     },
  { ar: 'تواصل',   en: 'Contact',    href: '#contact'   },
];

interface FooterProps {
  initialContent?: { key: string; valueAr: string | null; valueEn: string | null; type: string; id: string }[];
}

export default function Footer({ initialContent = [] }: FooterProps) {
  const { isRTL, t } = useLanguage();
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const cvItem = initialContent.find(item => item.key === 'cv_file');
    if (cvItem?.valueAr) { setCvUrl(cvItem.valueAr); return; }
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const item = data.find((d: { key: string; valueAr: string | null }) => d.key === 'cv_file');
        if (item?.valueAr) setCvUrl(item.valueAr);
      })
      .catch(() => { });
  }, [initialContent]);

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

  const WHATSAPP_NUMBER = '966554767928';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer
      className="bg-[#060E1A] border-t border-white/[0.06] relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 items-start">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white mb-1">
              <span style={{ color: '#C9A84C' }}>{t('عبدالمجيد', 'Abdulmajeed')}</span>
              {t(' الضاعني', ' Aldhanei')}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
              {t('مصمم جرافيك', 'Graphic Designer')}
            </p>
            <p className="text-sm leading-relaxed text-white/40 max-w-xs">
              {t(
                'الرياض، المملكة العربية السعودية',
                'Riyadh, Saudi Arabia'
              )}
            </p>

            {/* Contact links */}
            <div className="mt-5 flex flex-col gap-2">
              <a
                href="mailto:majeed.dane@gmail.com"
                className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" style={{ color: '#C9A84C' }} />
                majeed.dane@gmail.com
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <i className="fi fi-brands-whatsapp text-sm" style={{ color: '#25D366' }} />
                +966 55 476 7928
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:mx-auto">
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/25">
              {t('روابط سريعة', 'Quick Links')}
            </h4>
            <nav className="flex flex-col gap-2.5" role="navigation" aria-label={t('روابط التنقل', 'Navigation Links')}>
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  data-cursor-hover
                  className="text-sm text-white/40 transition-colors duration-200 hover:text-white/70 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-white/15 group-hover:bg-gold/60 transition-colors" />
                  {t(link.ar, link.en)}
                </a>
              ))}
            </nav>
          </div>

          {/* CV & Admin Actions */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-white/25">
              {t('السيرة الذاتية والإدارة', 'Resume & Admin')}
            </h4>

            <div className="flex flex-col gap-3">
              <a
                href={cvUrl || '#'}
                target={cvUrl ? '_blank' : undefined}
                rel={cvUrl ? 'noopener noreferrer' : undefined}
                onClick={handleCvClick}
                data-cursor-hover
                className="btn-outline-gold text-xs py-2.5 px-5 w-fit"
              >
                <Download className="h-3.5 w-3.5" />
                {t('تحميل السيرة الذاتية', 'Download CV')}
              </a>

              {/* Admin Panel Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-admin-panel'));
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-white/40 transition-all duration-300 hover:border-gold/40 hover:bg-gold/[0.08] hover:text-gold cursor-pointer w-fit"
                aria-label={t('لوحة التحكم', 'Admin Panel')}
              >
                <Settings className="h-3.5 w-3.5 text-white/40 group-hover:text-gold" />
                <span>{t('لوحة التحكم', 'Admin Panel')}</span>
              </button>
            </div>

            {/* Copyright */}
            <div className="mt-10 pt-6 border-t border-white/[0.06]">
              <p className="text-xs text-white/25">
                © {new Date().getFullYear()} {t('عبدالمجيد الضاعني', 'Abdulmajeed Aldhanei')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
