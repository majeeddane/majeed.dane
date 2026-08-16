'use client';

import { useLanguage } from '@/lib/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { cachedFetch } from '@/lib/content-cache';
import { ExternalLink, X, Globe, FileText, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

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
  { id: 'all',      arLabel: 'جميع الأعمال',        enLabel: 'All Works',        icon: 'fi fi-br-apps' },
  { id: 'posts',    arLabel: 'بوستات ومحتوى',        enLabel: 'Marketing Posts',   icon: 'fi fi-br-picture' },
  { id: 'profiles', arLabel: 'بروفايلات تعريفية',   enLabel: 'Company Profiles',  icon: 'fi fi-br-file-pdf' },
  { id: 'websites', arLabel: 'مواقع ويب',            enLabel: 'Web Projects',      icon: 'fi fi-br-globe' },
];

const CATEGORY_META: Record<string, { badge: string; badgeEn: string; color: string; borderClass: string }> = {
  posts:    { badge: 'تصميم',      badgeEn: 'Design',   color: '#5A9FD4', borderClass: 'badge-posts'    },
  profiles: { badge: 'بروفايل',   badgeEn: 'Profile',  color: '#C9A84C', borderClass: 'badge-profiles' },
  websites: { badge: 'موقع ويب',  badgeEn: 'Website',  color: '#34D399', borderClass: 'badge-websites' },
};

/* ─── Category Badge ─── */
function CategoryBadge({ category }: { category: string }) {
  const { t } = useLanguage();
  const meta = CATEGORY_META[category];
  if (!meta) return null;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.borderClass}`}>
      {t(meta.badge, meta.badgeEn)}
    </span>
  );
}

/* ─── Standard Portfolio Card (posts + profiles) ─── */
function PortfolioCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const { t } = useLanguage();
  const hasImage = isValidImageUrl(item.imageUrl);

  const aspectClass =
    item.category === 'profiles' ? 'aspect-[3/4]' : 'aspect-[4/5]';

  return (
    <div
      className="portfolio-card break-inside-avoid mb-4 sm:mb-5 card-glass p-1 border border-white/10"
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
            <CategoryBadge category={item.category} />
            <p className="text-white font-bold text-sm leading-snug mt-1">
              {t(item.titleAr, item.titleEn)}
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`relative rounded-xl flex flex-col items-center justify-center gap-3 ${aspectClass} bg-[#10243E]`}
        >
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
            {item.category === 'profiles'
              ? <FileText className="h-6 w-6 text-gold" />
              : <ImageIcon className="h-6 w-6 text-gold" />}
          </div>
          <p className="text-white/80 text-sm font-semibold text-center px-4">
            {t(item.titleAr, item.titleEn)}
          </p>
          <CategoryBadge category={item.category} />
        </div>
      )}
    </div>
  );
}

/* ─── Website Card (horizontal) ─── */
function WebsiteCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const { t } = useLanguage();
  const hasImage = isValidImageUrl(item.imageUrl);

  return (
    <div className="website-card group" onClick={onClick} data-cursor-view>
      {/* Image side */}
      <div className="website-card-img">
        {hasImage ? (
          <img
            src={item.imageUrl}
            alt={t(item.titleAr, item.titleEn)}
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0A1628]">
            <Globe className="h-10 w-10 text-emerald-400/30" />
          </div>
        )}
        {/* green overlay badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060E1A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-xs text-emerald-300 font-semibold">{t('عرض المشروع', 'View Project')}</span>
        </div>
      </div>

      {/* Info side */}
      <div className="p-5 flex flex-col justify-between gap-3">
        <div>
          <span className="badge-websites inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2">
            <Globe className="h-2.5 w-2.5" />
            {t('موقع ويب', 'Website')}
          </span>
          <h3 className="text-base font-bold text-white leading-snug mb-1">
            {t(item.titleAr, item.titleEn)}
          </h3>
          {(item.descriptionAr || item.descriptionEn) && (
            <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
              {t(item.descriptionAr || '', item.descriptionEn || '')}
            </p>
          )}
        </div>
        {item.projectUrl && (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors mt-auto"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {t('زيارة الموقع', 'Visit Website')}
          </a>
        )}
      </div>
    </div>
  );
}

/* ─── Lightbox ─── */
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
  const currentIndex = items.findIndex(i => i.id === item.id);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  isRTL ? onNext() : onPrev();
      if (e.key === 'ArrowRight') isRTL ? onPrev() : onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext, isRTL]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
        dir={isRTL ? 'rtl' : 'ltr'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="absolute inset-0 bg-[#060E1A]/96 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-gold hover:text-gold transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Counter */}
        {items.length > 1 && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            <span className="text-xs font-semibold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {currentIndex + 1} / {items.length}
            </span>
          </div>
        )}

        {/* Prev/Next buttons */}
        {items.length > 1 && (
          <>
            <button
              onClick={isRTL ? onNext : onPrev}
              disabled={isRTL ? currentIndex >= items.length - 1 : currentIndex <= 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={isRTL ? onPrev : onNext}
              disabled={isRTL ? currentIndex <= 0 : currentIndex >= items.length - 1}
              className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 text-white hover:border-gold hover:text-gold transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Card */}
        <motion.div
          className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden bg-[#10243E] border border-white/10"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {hasImage ? (
            <div className="relative bg-[#0A1628] max-h-[55vh] overflow-hidden">
              <img
                src={item.imageUrl}
                alt={t(item.titleAr, item.titleEn)}
                className="w-full object-contain max-h-[55vh]"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center py-14 bg-[#0A1628]">
              <Globe className="h-14 w-14 text-gold/30" />
            </div>
          )}

          <div className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <CategoryBadge category={item.category} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              {t(item.titleAr, item.titleEn)}
            </h3>
            {(item.descriptionAr || item.descriptionEn) && (
              <p className="text-white/60 text-sm leading-relaxed">
                {t(item.descriptionAr || '', item.descriptionEn || '')}
              </p>
            )}
            {item.projectUrl && (
              <a
                href={item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-gold hover:text-gold-light transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {t('عرض المشروع', 'View Project')}
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Empty State ─── */
function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <ImageIcon className="h-8 w-8 text-white/20" />
      </div>
      <p className="text-white/40 text-sm">{label}</p>
    </div>
  );
}

/* ─── Section Divider for sub-categories ─── */
function SectionDivider({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 mt-10 first:mt-0">
      <div className="flex items-center gap-2 text-white/40 text-xs font-semibold uppercase tracking-widest">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 h-px bg-white/[0.07]" />
    </div>
  );
}

/* ─── Main Section ─── */
export default function PortfolioSection() {
  const { isRTL, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxItem,   setLightboxItem]   = useState<PortfolioItem | null>(null);
  const [items,          setItems]          = useState<PortfolioItem[]>([]);
  const [loading,        setLoading]        = useState(true);

  useEffect(() => {
    cachedFetch<PortfolioItem[]>('/api/portfolio')
      .then(data => {
        setItems(Array.isArray(data) ? data.filter((item: PortfolioItem) => item.visible) : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  /* Counts per category */
  const counts: Record<string, number> = {};
  CATEGORIES.forEach(c => {
    counts[c.id] = c.id === 'all' ? items.length : items.filter(i => i.category === c.id).length;
  });

  /* For "all" view — split by category */
  const postItems    = filteredItems.filter(i => i.category === 'posts');
  const profileItems = filteredItems.filter(i => i.category === 'profiles');
  const websiteItems = filteredItems.filter(i => i.category === 'websites');

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

          {/* Header */}
          <div className="mb-12 reveal-up">
            <p className="section-eyebrow">
              <i className="fi fi-br-layers" />
              {t('مختارات من أعمالي', 'Selected Works')}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="section-title-xl">
                {t('معرض', 'Port')}<span style={{ color: '#C9A84C' }}>{t('الأعمال', 'folio')}</span>
              </h2>
              <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                {t(
                  'مجموعة من أبرز مشاريعي في التصميم والتسويق الرقمي',
                  'A curated selection of my design and digital marketing projects'
                )}
              </p>
            </div>
            <div className="gold-line" />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 reveal-up" style={{ transitionDelay: '0.1s' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`portfolio-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                <i className={`${cat.icon} text-sm`} />
                {t(cat.arLabel, cat.enLabel)}
                {counts[cat.id] > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeCategory === cat.id
                      ? 'bg-gold/20 text-gold'
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {counts[cat.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState label={t('لا توجد أعمال في هذا القسم بعد', 'No items in this category yet')} />
          ) : (
            <div>
              {/* === "ALL" view — show each category with its own section heading === */}
              {activeCategory === 'all' ? (
                <>
                  {/* Posts */}
                  {postItems.length > 0 && (
                    <>
                      <SectionDivider
                        icon={<i className="fi fi-br-picture text-xs" />}
                        label={t('بوستات ومحتوى تسويقي', 'Marketing Posts & Content')}
                      />
                      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 mb-6">
                        {postItems.map((item) => (
                          <PortfolioCard key={item.id} item={item} onClick={() => setLightboxItem(item)} />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Profiles */}
                  {profileItems.length > 0 && (
                    <>
                      <SectionDivider
                        icon={<i className="fi fi-br-file-pdf text-xs" />}
                        label={t('البروفايلات التعريفية', 'Company Profiles')}
                      />
                      <div className="columns-2 gap-4 sm:columns-3 mb-6">
                        {profileItems.map((item) => (
                          <PortfolioCard key={item.id} item={item} onClick={() => setLightboxItem(item)} />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Websites */}
                  {websiteItems.length > 0 && (
                    <>
                      <SectionDivider
                        icon={<i className="fi fi-br-globe text-xs" />}
                        label={t('مواقع الويب', 'Web Projects')}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {websiteItems.map((item) => (
                          <WebsiteCard key={item.id} item={item} onClick={() => setLightboxItem(item)} />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : activeCategory === 'websites' ? (
                /* === WEBSITES only view === */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredItems.map((item) => (
                    <WebsiteCard key={item.id} item={item} onClick={() => setLightboxItem(item)} />
                  ))}
                </div>
              ) : (
                /* === POSTS or PROFILES view === */
                <div className={`columns-2 gap-4 ${activeCategory === 'profiles' ? 'sm:columns-3' : 'sm:columns-3 lg:columns-4'}`}>
                  {filteredItems.map((item) => (
                    <PortfolioCard key={item.id} item={item} onClick={() => setLightboxItem(item)} />
                  ))}
                </div>
              )}
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
