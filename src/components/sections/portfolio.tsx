'use client';

import { useLanguage } from '@/lib/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, X, Globe, FileText, ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react';

interface PortfolioItem {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  imageUrl: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  projectUrl: string | null;
  order: number;
  visible: boolean;
}

function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url) return false;
  if (url.startsWith('/placeholder')) return false;
  if (url.trim() === '') return false;
  return true;
}

const CATEGORIES = [
  { id: 'all',      arLabel: 'الكل',                enLabel: 'All',          icon: <i className="fi fi-br-apps text-base" /> },
  { id: 'posts',    arLabel: 'بوستات ومحتوى',        enLabel: 'Marketing Posts', icon: <ImageIcon className="h-4 w-4" /> },
  { id: 'profiles', arLabel: 'بروفايلات تعريفية',    enLabel: 'Company Profiles', icon: <FileText className="h-4 w-4" /> },
  { id: 'websites', arLabel: 'م مواقع ويب',            enLabel: 'Web Projects', icon: <Globe className="h-4 w-4" /> },
];

function PortfolioCard({
  item, onClick,
}: { item: PortfolioItem; onClick: () => void }) {
  const { t } = useLanguage();
  const hasImage = isValidImageUrl(item.imageUrl);

  const aspectClass =
    item.category === 'websites' ? 'aspect-[16/10]' :
    item.category === 'profiles' ? 'aspect-[3/4]' :
    'aspect-[4/5]';

  return (
    <div
      className="portfolio-card break-inside-avoid mb-4 sm:mb-6 card-glass p-1 border border-white/10"
      onClick={onClick}
      data-cursor-view
    >
      {hasImage ? (
        <div className={`relative overflow-hidden rounded-xl ${aspectClass}`}>
          <img
            src={item.imageUrl}
            alt={t(item.titleAr, item.titleEn)}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="portfolio-card-overlay">
            <p className="text-white font-bold text-base leading-snug">
              {t(item.titleAr, item.titleEn)}
            </p>
            <p className="text-gold text-xs mt-1 font-semibold">
              {CATEGORIES.find(c => c.id === item.category)?.arLabel || item.category}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`relative rounded-xl flex flex-col items-center justify-center gap-3 ${aspectClass} bg-[#10243E]`}
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
            {item.category === 'websites' ? <Globe className="h-6 w-6 text-gold" /> :
             item.category === 'profiles' ? <FileText className="h-6 w-6 text-gold" /> :
             <ImageIcon className="h-6 w-6 text-gold" />}
          </div>
          <p className="text-white/80 text-sm font-semibold text-center px-4">
            {t(item.titleAr, item.titleEn)}
          </p>
        </div>
      )}
    </div>
  );
}

function Lightbox({
  item, items, onClose, onPrev, onNext,
}: {
  item: PortfolioItem;
  items: PortfolioItem[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { t, isRTL } = useLanguage();
  const hasImage = isValidImageUrl(item.imageUrl);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  isRTL ? onNext() : onPrev();
      if (e.key === 'ArrowRight') isRTL ? onPrev() : onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext, isRTL]);

  const currentIndex = items.findIndex(i => i.id === item.id);

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className="absolute inset-0 bg-[#060E1A]/95 backdrop-blur-md"
        onClick={onClose}
      />

      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-gold transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      {items.length > 1 && (
        <>
          <button
            onClick={isRTL ? onNext : onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={isRTL ? onPrev : onNext}
            className="absolute right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-gold transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}

      <div
        className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden bg-[#10243E] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {hasImage ? (
          <div className="relative max-h-[60vh] overflow-hidden bg-[#0A1628]">
            <img
              src={item.imageUrl}
              alt={t(item.titleAr, item.titleEn)}
              className="w-full object-contain max-h-[60vh]"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-16 bg-[#0A1628]">
            <Globe className="h-16 w-16 text-gold/40" />
          </div>
        )}

        <div className="p-6 md:p-8">
          <p className="section-eyebrow mb-2">
            0{currentIndex + 1} / 0{items.length}
          </p>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {t(item.titleAr, item.titleEn)}
          </h3>

          {(item.descriptionAr || item.descriptionEn) && (
            <p className="text-white/70 text-sm md:text-base leading-relaxed mt-2">
              {t(item.descriptionAr || '', item.descriptionEn || '')}
            </p>
          )}

          {item.projectUrl && (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-gold hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              {t('عرض المشروع', 'View Project')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const { isRTL, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxItem,   setLightboxItem]   = useState<PortfolioItem | null>(null);
  const [items,          setItems]          = useState<PortfolioItem[]>([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data.filter((item: PortfolioItem) => item.visible) : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  const lightboxIndex = lightboxItem ? filteredItems.findIndex(i => i.id === lightboxItem.id) : -1;

  const goPrev = useCallback(() => {
    if (lightboxIndex <= 0) return;
    setLightboxItem(filteredItems[lightboxIndex - 1]);
  }, [lightboxIndex, filteredItems]);

  const goNext = useCallback(() => {
    if (lightboxIndex >= filteredItems.length - 1) return;
    setLightboxItem(filteredItems[lightboxIndex + 1]);
  }, [lightboxIndex, filteredItems]);

  return (
    <>
      <section
        id="portfolio"
        className="bg-[#0A1628] section-padding relative"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="mb-14 reveal-up">
            <p className="section-eyebrow">
              <i className="fi fi-br-layers" />
              {t('مختارات من أعمالي', 'Selected Works')}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="section-title-xl">
                {t('معرض', 'Port')}<span style={{ color: '#C9A84C' }}>{t('الأعمال', 'folio')}</span>
              </h2>
              <p className="text-white/60 text-sm max-w-xs sm:text-right leading-relaxed">
                {t(
                  'مجموعة من أبرز مشاريعي في التصميم والتسويق الرقمي',
                  'A curated selection of my design and digital marketing projects'
                )}
              </p>
            </div>
            <div className="gold-line" />
          </div>

          <div className="flex flex-wrap gap-2 mb-10 reveal-up">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.icon}
                {t(cat.arLabel, cat.enLabel)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-white/40 text-base">
                {t('لا توجد أعمال في هذا القسم بعد', 'No items in this category yet')}
              </p>
            </div>
          ) : (
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {filteredItems.map((item) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  onClick={() => setLightboxItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          items={filteredItems}
          onClose={() => setLightboxItem(null)}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
