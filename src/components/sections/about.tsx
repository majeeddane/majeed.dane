'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { User, Globe, Heart, Briefcase, MapPin, GraduationCap } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cachedFetch } from '@/lib/content-cache';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

interface InfoBadgeProps {
  icon: React.ReactNode;
  text: string;
}

function InfoBadge({ icon, text }: InfoBadgeProps) {
  return (
    <motion.div
      className="group flex items-center gap-3 px-4 py-3 rounded-xl
        bg-navy-800/40 backdrop-blur-sm border border-white/5
        shadow-sm hover:shadow-md hover:-translate-y-1
        transition-all duration-300 cursor-default"
      variants={badgeVariants}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      <span className="text-sm font-medium text-white/90 group-hover:text-gold transition-colors duration-300">{text}</span>
    </motion.div>
  );
}

export default function AboutSection() {
  const { lang, isRTL, t } = useLanguage();
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(null);
  const [dynamicContent, setDynamicContent] = useState<Record<string, { valueAr: string; valueEn: string }>>({});

  useEffect(() => {
    cachedFetch<{ key: string; valueAr: string; valueEn: string }[]>('/api/content')
      .then((data) => {
        const aboutImageItem = data.find(item => item.key === 'about_image');
        if (aboutImageItem?.valueAr) setAboutImageUrl(aboutImageItem.valueAr);
        // Build a map of all content for easy access
        const map: Record<string, { valueAr: string; valueEn: string }> = {};
        data.forEach(item => { map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' }; });
        setDynamicContent(map);
      })
      .catch(() => {});
  }, []);

  const getVal = (key: string, fallbackAr: string, fallbackEn: string) => {
    const item = dynamicContent[key];
    if (!item) return t(fallbackAr, fallbackEn);
    return lang === 'ar' ? (item.valueAr || fallbackAr) : (item.valueEn || fallbackEn);
  };

  const sectionTitle = t('نبذة عني', 'About Me');
  const bioText = getVal('about_ar',
    'مصمم جرافيك ومسوّق رقمي، خريج علوم حاسوب، يمتلك خبرة عملية في العمل الحر امتدت لعدة سنوات في تصميم الهويات البصرية، وإدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة لعملاء من قطاعات متنوعة. يمزج بين الحس الإبداعي في التصميم والتخطيط التسويقي المدروس، مستعينًا بأدوات الذكاء الاصطناعي لتسريع الإنتاج ورفع جودة المخرجات.',
    'Graphic designer and digital marketer, computer science graduate, with years of freelance experience in visual identity design, social media management, and creating/managing funded advertising campaigns for clients across diverse sectors. Combines creative design sensibility with strategic marketing planning, leveraging AI tools to accelerate production and enhance output quality.'
  );
  const educationTitle = t('التعليم', 'Education');
  const educationText = getVal('education_ar',
    'بكالوريوس علوم حاسوب — الكلية الدولية، صنعاء، اليمن — 2023',
    "Bachelor of Computer Science — International College, Sana'a, Yemen — 2023"
  );
  const initials = t('ع م', 'AM');

  const infoBadges: InfoBadgeProps[] = [
    { icon: <User className="size-4" />, text: getVal('about_age', '24 سنة', '24 years') },
    { icon: <Globe className="size-4" />, text: getVal('about_nationality', 'يمنية', 'Yemeni') },
    { icon: <Heart className="size-4" />, text: getVal('about_status', 'أعزب', 'Single') },
    { icon: <Briefcase className="size-4" />, text: getVal('about_availability', 'متفرغ', 'Available') },
    { icon: <MapPin className="size-4" />, text: getVal('about_location', 'الرياض', 'Riyadh') },
  ];

  return (
    <section
      className="py-20 md:py-28 bg-background"
      dir={isRTL ? 'rtl' : 'ltr'}
      id="about"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section title with gold underline */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {sectionTitle}
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-20 rounded-full bg-gold" />
          </div>
        </motion.div>

        {/* Two-column layout: Image + Content */}
        <div className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
          {/* Profile Image Column */}
          <motion.div
            className="flex-shrink-0 relative"
            initial={{ opacity: 1, scale: 1 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0 }}
          >
            {/* Glow behind circle */}
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl scale-125" />

            {/* Gradient border circle */}
            <div
              className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full p-1.5"
              style={{ background: 'linear-gradient(135deg, #0B2545 0%, #1E5F9E 50%, #C9A84C 100%)' }}
            >
              {/* Inner circle */}
              <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center overflow-hidden">
                {aboutImageUrl ? (
                  <img
                    src={aboutImageUrl}
                    alt={sectionTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <span
                    className="text-4xl sm:text-5xl md:text-6xl font-bold select-none"
                    style={{
                      background: 'linear-gradient(135deg, #C9A84C 0%, #D4BC6A 50%, #E8D48B 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {initials}
                  </span>
                )}
              </div>
            </div>

            {/* Decorative ring */}
            <motion.div
              className="absolute -inset-4 rounded-full border border-gold/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Content Column */}
          <div className="flex-1 w-full min-w-0">
            {/* Bio card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-white/5 bg-navy-800/30 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 md:p-8">
                  <p
                    className={`text-base md:text-lg leading-relaxed text-white/80 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    {bioText}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal info badges grid */}
            <motion.div
              className="mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {infoBadges.map((badge, index) => (
                <InfoBadge
                  key={index}
                  icon={badge.icon}
                  text={badge.text}
                />
              ))}
            </motion.div>

            {/* Education section */}
            <motion.div
              className="mt-8 md:mt-10"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3
                className={`text-xl md:text-2xl font-bold text-white mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                  <GraduationCap className="size-5" />
                </div>
                {educationTitle}
              </h3>

              <Card className="border-white/5 bg-navy-800/30 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 md:p-6">
                  <p
                    className={`text-base md:text-lg font-medium text-white/90 ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    {educationText}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
