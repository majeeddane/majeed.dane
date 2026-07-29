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
  { id: 'websites', arLabel: 'مواقع ويب',            enLabel: 'Web Projects', icon: <Globe className="h-4 w-4" /> },
];

function getCategoryGradient(category: string) {
  switch (category) {
    case 'posts':    return 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)';
    case 'profiles': return 'linear-gradient(135deg, #0d0d0d 0%, #181818 100%)';
    case 'websites': return 'linear-gradient(135deg, #0a0a0a 0%, #151515 100%)';
    default:         return 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)';
  }
}

/* ──────────────────────────────────────
   Portfolio Card
────────────────────────────────────── */
function PortfolioCard({
  item, index, onClick,
}: { item: PortfolioItem; index: number; onClick: () => void }) {
  const { t } = useLanguage();
  const hasImage = isValidImageUrl(item.imageUrl);

  const aspectClass =
    item.category === 'websites' ? 'aspect-[16/10]' :
    item.category === 'profiles' ? 'aspect-[3/4]' :
    'aspect-[4/5]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="portfolio-card break-inside-avoid mb-4 sm:mb-6"
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
          {/* Hover overlay */}
          <div className="portfolio-card-overlay">
            <div className="portfolio-card-title">
              <p className="text-white font-bold text-base leading-snug">
                {t(item.titleAr, item.titleEn)}
              </p>
              <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-medium">
                {CATEGORIES.find(c => c.id === item.category)?.arLabel || item.category}
              </p>
            </div>
          </div>

          {/* Category badge (always visible) */}
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{
                background: 'rgba(10,10,10,0.7)',
                color: '#C8A45A',
                border: '1px solid rgba(200,164,90,0.3)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {t(
                CATEGORIES.find(c => c.id === item.category)?.arLabel || item.category,
                CATEGORIES.find(c => c.id === item.category)?.enLabel || item.category,
              )}
            </span>
          </div>
        </div>
      ) : (
        /* Placeholder card */
        <div
          className={`relative rounded-xl flex flex-col items-center justify-center gap-3 ${aspectClass}`}
          style={{ background: getCategoryGradient(item.category), border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
            {item.category === 'websites' ? <Globe className="h-6 w-6 text-white/40" /> :
             item.category === 'profiles' ? <FileText className="h-6 w-6 text-white/40" /> :
             <ImageIcon className="h-6 w-6 text-white/40" />}
          </div>
          <p className="text-white/60 text-sm font-semibold text-center px-4">
            {t(item.titleAr, item.titleEn)}
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ──────────────────────────────────────
   Lightbox Modal
────────────────────────────────────── */
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

  // Keyboard navigation
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
    <motion.div
      className="fixed inset-0 z-[9990] flex items-center justify-center"
      dir={isRTL ? 'rtl' : 'ltr'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        data-cursor-hover
        className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Prev / Next */}
      {items.length > 1 && (
        <>
          <button
            onClick={isRTL ? onNext : onPrev}
            data-cursor-hover
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={isRTL ? onPrev : onNext}
            data-cursor-hover
            className="absolute right-14 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all duration-200"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Modal content */}
      <motion.div
        className="relative z-10 w-full max-w-3xl mx-6 rounded-2xl overflow-hidden"
        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        {hasImage ? (
          <div className="relative max-h-[60vh] overflow-hidden">
            <img
              src={item.imageUrl}
              alt={t(item.titleAr, item.titleEn)}
              className="w-full object-contain"
              style={{ maxHeight: '60vh' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
          </div>
        ) : (
          <div
            className="flex items-center justify-center py-20"
            style={{ background: getCategoryGradient(item.category), minHeight: '200px' }}
          >
            {item.category === 'websites' ? <Globe className="h-16 w-16 text-white/20" /> :
             item.category === 'profiles' ? <FileText className="h-16 w-16 text-white/20" /> :
             <ImageIcon className="h-16 w-16 text-white/20" />}
          </div>
        )}

        {/* Info panel */}
        <div className="p-6 md:p-8">
          {/* Counter */}
          <p className="section-eyebrow mb-3">
            {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </p>

          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {t(item.titleAr, item.titleEn)}
          </h3>

          {(item.descriptionAr || item.descriptionEn) && (
            <p className="text-white/60 text-sm md:text-base leading-relaxed mt-3">
              {t(item.descriptionAr || '', item.descriptionEn || '')}
            </p>
          )}

          {item.projectUrl && (
            <a
              href={item.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold transition-colors duration-200 hover:text-gold-light"
              style={{ color: '#C8A45A' }}
            >
              <ExternalLink className="h-4 w-4" />
              {t('عرض المشروع', 'View Project')}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────
   Main Portfolio Section
────────────────────────────────────── */
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

  // Lightbox navigation
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
        className="bg-[#0A0A0A] section-padding"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

          {/* ── Section Header ── */}
          <div className="mb-16 reveal-up">
            <p className="section-eyebrow">
              <i className="fi fi-br-layers" />
              {t('مختارات من أعمالي', 'Selected Works')}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="section-title-xl">
                {t('معرض', 'Port')}<span style={{ color: '#C8A45A' }}>{t('الأعمال', 'folio')}</span>
              </h2>
              <p className="text-white/40 text-sm max-w-xs sm:text-right leading-relaxed">
                {t(
                  'مجموعة من أبرز مشاريعي في التصميم والتسويق الرقمي',
                  'A curated selection of my design and digital marketing projects'
                )}
              </p>
            </div>
            <div className="gold-line" />
          </div>

          {/* ── Filter Buttons ── */}
          <div className="flex flex-wrap gap-2 mb-12 reveal-up delay-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                data-cursor-hover
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'border-gold bg-gold/15 text-gold shadow-[0_0_20px_rgba(200,164,90,0.15)]'
                    : 'border-white/10 text-white/50 hover:border-white/25 hover:text-white/80'
                }`}
              >
                {cat.icon}
                {t(cat.arLabel, cat.enLabel)}
              </button>
            ))}

            {/* Item count */}
            <span className="inline-flex items-center px-3 py-2 rounded-full text-xs text-white/25 border border-white/[0.05] ml-auto">
              {filteredItems.length} {t('مشروع', 'projects')}
            </span>
          </div>

          {/* ── Grid ── */}
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-6 w-6 text-white/20" />
              </div>
              <p className="text-white/30 text-base">
                {t('لا توجد أعمال في هذا القسم بعد', 'No items in this category yet')}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeCategory}
                className="columns-1 gap-5 sm:columns-2 lg:columns-3"
              >
                {filteredItems.map((item, index) => (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => setLightboxItem(item)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            item={lightboxItem}
            items={filteredItems}
            onClose={() => setLightboxItem(null)}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}
