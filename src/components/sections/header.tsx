'use client';

import { useLanguage } from '@/lib/language-context';
import { useState, useEffect } from 'react';
import { Menu, Download } from 'lucide-react';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-navy-800/10 bg-white/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo / Name */}
        <a
          href="#"
          onClick={scrollToTop}
          className="text-lg font-bold text-navy-900 transition-colors hover:text-blue-600"
        >
          {t('عبدالمجيد الضاعني', 'Al-Daani')}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="rounded-md px-3 py-2 text-sm text-navy-900/70 transition-colors duration-200 hover:bg-navy-800/5 hover:text-navy-900"
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
            className="flex h-9 min-w-[42px] cursor-pointer items-center justify-center rounded-full bg-navy-900 px-3 text-xs font-semibold text-white transition-colors duration-200 hover:bg-navy-800"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* CV Download Button */}
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy-900 transition-colors duration-200 hover:bg-gold-light"
          >
            <Download className="h-4 w-4" />
            {t('السيرة الذاتية', 'CV')}
          </a>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Language Toggle (Mobile) */}
          <button
            onClick={toggleLanguage}
            className="flex h-8 min-w-[36px] cursor-pointer items-center justify-center rounded-full bg-navy-900 px-2 text-[10px] font-semibold text-white transition-colors duration-200 hover:bg-navy-800"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>

          {/* Hamburger Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-navy-900">
                <Menu className="h-6 w-6" />
                <span className="sr-only">
                  {t('فتح القائمة', 'Open menu')}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side={isRTL ? 'right' : 'left'}
              className="w-[280px] bg-white"
            >
              <div className="flex flex-col gap-6 pt-8">
                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="rounded-md px-4 py-3 text-base font-medium text-navy-900/80 transition-colors duration-200 hover:bg-navy-800/5 hover:text-navy-900"
                    >
                      {t(link.ar, link.en)}
                    </a>
                  ))}
                </nav>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-3 border-t border-navy-800/10 pt-4">
                  {/* Language Toggle in Sheet */}
                  <button
                    onClick={() => {
                      toggleLanguage();
                    }}
                    className="flex items-center justify-center rounded-lg border border-navy-800/10 px-4 py-3 text-sm font-medium text-navy-900 transition-colors duration-200 hover:bg-navy-800/5"
                  >
                    {lang === 'ar' ? 'English' : 'العربية'}
                  </button>

                  {/* CV Download */}
                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-4 py-3 text-sm font-semibold text-navy-900 transition-colors duration-200 hover:bg-gold-light"
                  >
                    <Download className="h-4 w-4" />
                    {t('تحميل السيرة الذاتية', 'Download CV')}
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
