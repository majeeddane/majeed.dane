'use client';

import { useLanguage } from '@/lib/language-context';
import { useState, useEffect } from 'react';
import { Menu, Download, X } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const navLinks = [
  { ar: 'نبذة عني', en: 'About', href: '#about' },
  { ar: 'المهارات', en: 'Skills', href: '#skills' },
  { ar: 'الخبرة', en: 'Experience', href: '#experience' },
  { ar: 'الأعمال', en: 'Portfolio', href: '#portfolio' },
  { ar: 'تواصل', en: 'Contact', href: '#contact' },
];

export default function Header() {
  const { lang, isRTL, t, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const cvItem = data.find((item: { key: string; valueAr: string | null }) => item.key === 'cv_file');
        if (cvItem?.valueAr) {
          setCvUrl(cvItem.valueAr);
        }
      })
      .catch(() => {});
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
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-navy-900/85 backdrop-blur-lg shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo / Name */}
        <button
          onClick={scrollToTop}
          className={`text-lg font-bold transition-colors hover:text-gold text-white`}
        >
          {t('عبدالمجيد الضاعني', 'Al-Daani')}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10`}
            >
              {t(link.ar, link.en)}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className={`flex h-9 min-w-[42px] cursor-pointer items-center justify-center rounded-full px-3 text-xs font-bold transition-all duration-200 bg-white/15 text-white hover:bg-white/25 border border-white/20`}
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* CV Download Button */}
          <a
            href={cvUrl || '#'}
            target={cvUrl ? '_blank' : undefined}
            rel={cvUrl ? 'noopener noreferrer' : undefined}
            onClick={handleCvClick}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 bg-gold text-navy-900 hover:bg-gold-light shadow-lg shadow-gold/20`}
          >
            <Download className="h-4 w-4" />
            <span className="hidden lg:inline">{t('السيرة الذاتية', 'Download CV')}</span>
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className={`flex h-8 min-w-[36px] cursor-pointer items-center justify-center rounded-full px-2 text-[10px] font-bold transition-all duration-200 bg-white/15 text-white border border-white/20`}
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={scrolled ? 'text-navy-900' : 'text-white'}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">{t('فتح القائمة', 'Open menu')}</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isRTL ? 'right' : 'left'}
              className="w-[280px] bg-white pt-12"
            >
              <div className="flex flex-col gap-2">
                {/* Mobile Nav Links */}
                {navLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-navy-900/80 transition-colors duration-200 hover:bg-navy-800/5 hover:text-navy-900"
                  >
                    {t(link.ar, link.en)}
                  </a>
                ))}

                <div className="my-4 border-t border-navy-800/10" />

                {/* Language Toggle */}
                <button
                  onClick={() => { toggleLanguage(); setMobileOpen(false); }}
                  className="flex items-center justify-center rounded-lg border border-navy-800/10 px-4 py-3 text-sm font-medium text-navy-900 transition-colors duration-200 hover:bg-navy-800/5"
                >
                  {lang === 'ar' ? 'English' : 'العربية'}
                </button>

                {/* CV Download */}
                <a
                  href={cvUrl || '#'}
                  target={cvUrl ? '_blank' : undefined}
                  rel={cvUrl ? 'noopener noreferrer' : undefined}
                  onClick={handleCvClick}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-navy-900 transition-colors duration-200 hover:bg-gold-light"
                >
                  <Download className="h-4 w-4" />
                  {t('تحميل السيرة الذاتية', 'Download CV')}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
