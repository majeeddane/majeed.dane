'use client';

import { useLanguage } from '@/lib/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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
  descAr: string;
  descEn: string;
  category: string;
  gradient: string;
  icon: React.ReactNode;
  aspectClass: string;
}

const portfolioItems: PortfolioItem[] = [
  // Posts category
  {
    id: 'post-1',
    titleAr: 'تصاميم عقارية',
    titleEn: 'Real Estate Posts',
    descAr: 'تصاميم تسويقية لشركات عقارية تبرز المشاريع والعروض المميزة.',
    descEn: 'Marketing designs for real estate companies highlighting projects and special offers.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #0B2545 0%, #1E5F9E 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[4/5]',
  },
  {
    id: 'post-2',
    titleAr: 'تصاميم مطاعم',
    titleEn: 'Restaurant Posts',
    descAr: 'تصاميم شهية للبرجر والشاورما والبيتزا تجذب العملاء.',
    descEn: 'Appetizing designs for burgers, shawarma, and pizza that attract customers.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #FF6347 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-square',
  },
  {
    id: 'post-3',
    titleAr: 'مقاهي وحلويات',
    titleEn: 'Cafe & Desserts',
    descAr: 'تصاميم ناعمة وأنيقة للمقاهي والحلويات.',
    descEn: 'Soft and elegant designs for cafes and desserts.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #1E5F9E 0%, #87CEEB 50%, #E0F0FF 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[3/4]',
  },
  {
    id: 'post-4',
    titleAr: 'بهارات ومكسرات',
    titleEn: 'Spices & Nuts',
    descAr: 'تصاميم بلمسة ذهبية لمنتجات البهارات والمكسرات.',
    descEn: 'Designs with a golden touch for spices and nuts products.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #C9A84C 0%, #8B6914 50%, #654321 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[4/5]',
  },
  {
    id: 'post-5',
    titleAr: 'دهليز لتأجير السيارات',
    titleEn: 'Dehliz Car Rental',
    descAr: 'تصاميم داكنة وعصرية لتأجير السيارات.',
    descEn: 'Dark and modern designs for car rental services.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-square',
  },
  {
    id: 'post-6',
    titleAr: 'تصاميم موسمية',
    titleEn: 'Seasonal Designs',
    descAr: 'تصاميم لرمضان والعيد ويوم الأم بروح احتفالية.',
    descEn: 'Designs for Ramadan, Eid, and Mother\'s Day with a festive spirit.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #006400 0%, #228B22 50%, #90EE90 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[3/4]',
  },
  {
    id: 'post-7',
    titleAr: 'تصاميم محاماة',
    titleEn: 'Law Firm Posts',
    descAr: 'تصاميم مهنية لشركة محاماة واستشارات قانونية.',
    descEn: 'Professional designs for a law firm and legal consultancy.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #0B2545 0%, #13315C 50%, #1E3A5F 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[4/5]',
  },
  {
    id: 'post-8',
    titleAr: 'تصاميم تقنية',
    titleEn: 'IT Company Posts',
    descAr: 'تصاميم عصرية لشركة تقنية مع هوية بصرية مميزة.',
    descEn: 'Modern designs for an IT company with a distinctive visual identity.',
    category: 'posts',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1E5F9E 50%, #48CAE4 100%)',
    icon: <ImageIcon className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-square',
  },

  // Profiles category
  {
    id: 'profile-1',
    titleAr: 'بروفايل شركة عقارية',
    titleEn: 'Real Estate Profile',
    descAr: 'بروفايل تعريفي احترافي لشركة عقارية رائدة.',
    descEn: 'Professional company profile for a leading real estate firm.',
    category: 'profiles',
    gradient: 'linear-gradient(135deg, #0B2545 0%, #13315C 100%)',
    icon: <FileText className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[3/4]',
  },
  {
    id: 'profile-2',
    titleAr: 'بروفايل شركة محاماة',
    titleEn: 'Law Firm Profile',
    descAr: 'بروفايل تعريفي أنيق لشركة اتحاد العصر للمحاماة.',
    descEn: 'Elegant company profile for ASR Law Group.',
    category: 'profiles',
    gradient: 'linear-gradient(135deg, #0B2545 0%, #1E3A5F 100%)',
    icon: <FileText className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[3/4]',
  },
  {
    id: 'profile-3',
    titleAr: 'بروفايل شركة تنظيم مؤتمرات',
    titleEn: 'Event Management Profile',
    descAr: 'بروفايل تعريفي ديناميكي لشركة تنظيم مؤتمرات وفعاليات.',
    descEn: 'Dynamic company profile for an event management company.',
    category: 'profiles',
    gradient: 'linear-gradient(135deg, #13315C 0%, #1E5F9E 100%)',
    icon: <FileText className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[3/4]',
  },

  // Websites category
  {
    id: 'web-1',
    titleAr: 'موقع شركة عقارية',
    titleEn: 'Real Estate Website',
    descAr: 'موقع ويب تفاعلي لشركة عقارية مع عرض المشاريع والخدمات.',
    descEn: 'Interactive website for a real estate company showcasing projects and services.',
    category: 'websites',
    gradient: 'linear-gradient(135deg, #0B2545 0%, #1E5F9E 100%)',
    icon: <Globe className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[16/10]',
  },
  {
    id: 'web-2',
    titleAr: 'موقع مطعم',
    titleEn: 'Restaurant Website',
    descAr: 'موقع ويب لمطعم مع قائمة طعام رقمية وحجز طاولات.',
    descEn: 'Website for a restaurant with digital menu and table reservations.',
    category: 'websites',
    gradient: 'linear-gradient(135deg, #8B4513 0%, #1a1a2e 100%)',
    icon: <Globe className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[16/10]',
  },
  {
    id: 'web-3',
    titleAr: 'موقع شركة تأجير سيارات',
    titleEn: 'Car Rental Website',
    descAr: 'موقع ويب لشركة تأجير سيارات مع نظام حجز متكامل.',
    descEn: 'Website for a car rental company with an integrated booking system.',
    category: 'websites',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #13315C 100%)',
    icon: <Globe className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[16/10]',
  },
  {
    id: 'web-4',
    titleAr: 'موقع شركة تقنية',
    titleEn: 'Tech Company Website',
    descAr: 'موقع ويب عصري لشركة تقنية مع عرض الخدمات والحلول.',
    descEn: 'Modern website for a tech company showcasing services and solutions.',
    category: 'websites',
    gradient: 'linear-gradient(135deg, #0B2545 0%, #48CAE4 100%)',
    icon: <Globe className="h-8 w-8 text-white/80" />,
    aspectClass: 'aspect-[16/10]',
  },
];

function ProfileCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  return (
    <div
      className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      {/* Browser-mockup style */}
      <div className="rounded-t-lg" style={{ background: item.gradient }}>
        <div className="flex items-center gap-1.5 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <div className="ml-3 flex-1 rounded-sm bg-white/15 px-3 py-1 text-xs text-white/50">
            profile.pdf
          </div>
        </div>
        <div className={`flex flex-col items-center justify-center px-6 pb-8 ${item.aspectClass}`}>
          {item.icon}
          <p className="mt-3 text-center text-sm font-semibold text-white/90">
            {item.titleAr}
          </p>
          <p className="mt-1 text-center text-xs text-white/60">
            {item.titleEn}
          </p>
        </div>
      </div>
    </div>
  );
}

function WebsiteCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  return (
    <div
      className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={onClick}
    >
      {/* Browser chrome */}
      <div className="rounded-t-lg" style={{ background: item.gradient }}>
        <div className="flex items-center gap-1.5 bg-black/20 px-4 py-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
          <div className="ml-3 flex-1 rounded-sm bg-white/15 px-3 py-1 text-xs text-white/60">
            https://www.example.com
          </div>
        </div>
        <div className={`flex flex-col items-center justify-center px-6 pb-8 ${item.aspectClass}`}>
          {item.icon}
          <div className="mt-3 rounded-md border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <p className="text-center text-sm font-semibold text-white/90">
              Coming Soon
            </p>
            <p className="text-center text-xs text-white/60">
              {item.titleEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  return (
    <div
      className={`break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${item.aspectClass}`}
      style={{ background: item.gradient }}
      onClick={onClick}
    >
      <div className="flex h-full flex-col items-center justify-center p-6">
        {item.icon}
        <p className="mt-3 text-center text-sm font-semibold text-white/90">
          {item.titleAr}
        </p>
        <p className="mt-1 text-center text-xs text-white/60">
          {item.titleEn}
        </p>
        <div className="mt-auto flex items-center gap-1 pt-4 text-white/40 transition-colors hover:text-white/80">
          <Maximize2 className="h-3.5 w-3.5" />
          <span className="text-xs">{item.titleEn}</span>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const { isRTL, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('posts');
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);

  const filteredItems = portfolioItems.filter(
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
              <div
                className="flex flex-col items-center justify-center px-8 py-12"
                style={{ background: lightboxItem.gradient, minHeight: '300px' }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  {lightboxItem.icon}
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">
                  {t(lightboxItem.titleAr, lightboxItem.titleEn)}
                </h3>
              </div>
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle style={{ color: '#0B2545' }}>
                    {t(lightboxItem.titleAr, lightboxItem.titleEn)}
                  </DialogTitle>
                  <DialogDescription className="text-base leading-relaxed" style={{ color: '#13315C' }}>
                    {t(lightboxItem.descAr, lightboxItem.descEn)}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex items-center gap-2" style={{ color: '#C9A84C' }}>
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {t('عرض المشروع', 'View Project')}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
