'use client';

import { useLanguage } from '@/lib/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ExternalLink, Maximize2, Globe, FileText, ImageIcon } from 'lucide-react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

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

function getCategoryIcon(category: string) {
  switch (category) {
    case 'posts':
      return <ImageIcon className="h-8 w-8 text-white/80" />;
    case 'profiles':
      return <FileText className="h-8 w-8 text-white/80" />;
    case 'websites':
      return <Globe className="h-8 w-8 text-white/80" />;
    default:
      return <ImageIcon className="h-8 w-8 text-white/80" />;
  }
}

function getCategoryGradient(category: string) {
  switch (category) {
    case 'posts':
      return 'linear-gradient(135deg, #0B2545 0%, #1E5F9E 100%)';
    case 'profiles':
      return 'linear-gradient(135deg, #0B2545 0%, #13315C 100%)';
    case 'websites':
      return 'linear-gradient(135deg, #0d1b2a 0%, #13315C 100%)';
    default:
      return 'linear-gradient(135deg, #0B2545 0%, #1E5F9E 100%)';
  }
}

function getAspectClass(category: string) {
  switch (category) {
    case 'posts':
      return 'aspect-[4/5]';
    case 'profiles':
      return 'aspect-[3/4]';
    case 'websites':
      return 'aspect-[16/10]';
    default:
      return 'aspect-square';
  }
}

function PostCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <div
      className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      {item.imageUrl ? (
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
          <img
            src={item.imageUrl}
            alt={t(item.titleAr, item.titleEn)}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-semibold text-white">
              {t(item.titleAr, item.titleEn)}
            </p>
            <div className="mt-1 flex items-center gap-1 text-white/60">
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="text-xs">{t('عرض', 'View')}</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex h-full flex-col items-center justify-center p-6 aspect-[4/5]"
          style={{ background: getCategoryGradient(item.category) }}
        >
          {getCategoryIcon(item.category)}
          <p className="mt-3 text-center text-sm font-semibold text-white/90">
            {t(item.titleAr, item.titleEn)}
          </p>
          <div className="mt-auto flex items-center gap-1 pt-4 text-white/40 transition-colors hover:text-white/80">
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="text-xs">{t('عرض', 'View')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <div
      className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      {item.imageUrl ? (
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
          <img
            src={item.imageUrl}
            alt={t(item.titleAr, item.titleEn)}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-semibold text-white">
              {t(item.titleAr, item.titleEn)}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-t-lg" style={{ background: getCategoryGradient(item.category) }}>
          <div className="flex items-center gap-1.5 px-4 py-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            <div className="ml-3 flex-1 rounded-sm bg-white/15 px-3 py-1 text-xs text-white/50">
              profile.pdf
            </div>
          </div>
          <div className={`flex flex-col items-center justify-center px-6 pb-8 ${getAspectClass(item.category)}`}>
            {getCategoryIcon(item.category)}
            <p className="mt-3 text-center text-sm font-semibold text-white/90">
              {t(item.titleAr, item.titleEn)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function WebsiteCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const { t } = useLanguage();
  return (
    <div
      className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      {item.imageUrl ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-lg">
          <img
            src={item.imageUrl}
            alt={t(item.titleAr, item.titleEn)}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-semibold text-white">
              {t(item.titleAr, item.titleEn)}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-t-lg" style={{ background: getCategoryGradient(item.category) }}>
          <div className="flex items-center gap-1.5 bg-black/20 px-4 py-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            <div className="ml-3 flex-1 rounded-sm bg-white/15 px-3 py-1 text-xs text-white/60">
              https://www.example.com
            </div>
          </div>
          <div className={`flex flex-col items-center justify-center px-6 pb-8 ${getAspectClass(item.category)}`}>
            {getCategoryIcon(item.category)}
            <div className="mt-3 rounded-md border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-center text-sm font-semibold text-white/90">
                {t(item.titleAr, item.titleEn)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioSection() {
  const { isRTL, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('posts');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data) ? data.filter((item: PortfolioItem) => item.visible) : []);
      })
      .catch(() => {
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter(
    (item) => item.category === activeTab
  );

  return (
    <section
      id="portfolio"
      className="bg-white py-16 md:py-24"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ color: '#0B2545' }}
          >
            {t('معرض الأعمال', 'Portfolio')}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-24 rounded-full"
            style={{ backgroundColor: '#C9A84C' }}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-12"
        >
          <TabsList className="mx-auto flex w-full max-w-xl flex-wrap justify-center gap-2 bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="rounded-lg border px-4 py-2.5 text-sm font-medium data-[state=active]:border-[#C9A84C] data-[state=active]:bg-[#0B2545] data-[state=active]:text-white"
              style={{ color: '#0B2545' }}
            >
              {t('بوستات ومحتوى تسويقي', 'Marketing Posts')}
            </TabsTrigger>
            <TabsTrigger
              value="profiles"
              className="rounded-lg border px-4 py-2.5 text-sm font-medium data-[state=active]:border-[#C9A84C] data-[state=active]:bg-[#0B2545] data-[state=active]:text-white"
              style={{ color: '#0B2545' }}
            >
              {t('بروفايلات تعريفية', 'Company Profiles')}
            </TabsTrigger>
            <TabsTrigger
              value="websites"
              className="rounded-lg border px-4 py-2.5 text-sm font-medium data-[state=active]:border-[#C9A84C] data-[state=active]:bg-[#0B2545] data-[state=active]:text-white"
              style={{ color: '#0B2545' }}
            >
              {t('مواقع ويب', 'Web Projects')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
                </div>
              ) : filteredItems.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-800/10">
                    {getCategoryIcon(activeTab)}
                  </div>
                  <p className="text-lg font-medium text-navy-900/50">
                    {t('لا توجد أعمال في هذا القسم بعد', 'No items in this category yet')}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="columns-1 gap-4 sm:columns-2 sm:gap-6 lg:columns-3"
                >
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.08,
                      }}
                      className="mb-4 sm:mb-6"
                    >
                      {item.category === 'posts' && (
                        <PostCard
                          item={item}
                          onClick={() => setLightboxItem(item)}
                        />
                      )}
                      {item.category === 'profiles' && (
                        <ProfileCard
                          item={item}
                          onClick={() => setLightboxItem(item)}
                        />
                      )}
                      {item.category === 'websites' && (
                        <WebsiteCard
                          item={item}
                          onClick={() => setLightboxItem(item)}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lightbox Dialog */}
      <Dialog
        open={!!lightboxItem}
        onOpenChange={(open) => !open && setLightboxItem(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {lightboxItem && (
            <>
              {lightboxItem.imageUrl ? (
                <div className="relative">
                  <img
                    src={lightboxItem.imageUrl}
                    alt={t(lightboxItem.titleAr, lightboxItem.titleEn)}
                    className="w-full max-h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white">
                      {t(lightboxItem.titleAr, lightboxItem.titleEn)}
                    </h3>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center px-8 py-12"
                  style={{ background: getCategoryGradient(lightboxItem.category), minHeight: '300px' }}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                    {getCategoryIcon(lightboxItem.category)}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-white">
                    {t(lightboxItem.titleAr, lightboxItem.titleEn)}
                  </h3>
                </div>
              )}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle style={{ color: '#0B2545' }}>
                    {t(lightboxItem.titleAr, lightboxItem.titleEn)}
                  </DialogTitle>
                  {(lightboxItem.descriptionAr || lightboxItem.descriptionEn) && (
                    <DialogDescription className="text-base leading-relaxed" style={{ color: '#13315C' }}>
                      {t(lightboxItem.descriptionAr || '', lightboxItem.descriptionEn || '')}
                    </DialogDescription>
                  )}
                </DialogHeader>
                {lightboxItem.projectUrl && (
                  <a
                    href={lightboxItem.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 transition-colors hover:text-gold-light"
                    style={{ color: '#C9A84C' }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {t('عرض المشروع', 'View Project')}
                    </span>
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
