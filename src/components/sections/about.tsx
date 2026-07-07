'use client';

import { useLanguage } from '@/lib/language-context';
import { Card, CardContent } from '@/components/ui/card';
import { User, Globe, Heart, Briefcase, MapPin, GraduationCap } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useState, useEffect } from 'react';

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
  delay?: number;
}

function InfoBadge({ icon, text, delay = 0 }: InfoBadgeProps) {
  return (
    <motion.div
      className="group flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white/60 backdrop-blur-sm border border-navy-800/5
        shadow-sm hover:shadow-md hover:-translate-y-1
        transition-all duration-300 cursor-default"
      variants={badgeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay }}
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-navy-800/10 flex items-center justify-center text-navy-800 group-hover:bg-gold/15 group-hover:text-gold transition-colors duration-300">
        {icon}
      </div>
      <span className="text-sm font-medium text-navy-900">{text}</span>
    </motion.div>
  );
}

export default function AboutSection() {
  const { lang, isRTL, t } = useLanguage();
  const [aboutImageUrl, setAboutImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const aboutImageItem = data.find((item: { key: string; valueAr: string | null }) => item.key === 'about_image');
        if (aboutImageItem?.valueAr) {
          setAboutImageUrl(aboutImageItem.valueAr);
        }
      })
      .catch(() => {});
  }, []);

  const sectionTitle = t('نبذة عني', 'About Me');
  const bioText = t(
    'مصمم جرافيك ومسوّق رقمي، خريج علوم حاسوب، يمتلك خبرة عملية في العمل الحر امتدت لعدة سنوات في تصميم الهويات البصرية، وإدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة لعملاء من قطاعات متنوعة (عقارات، مطاعم، محاماة، تأجير سيارات، مخابز، مقاهي). يمزج بين الحس الإبداعي في التصميم والتخطيط التسويقي المدروس، مستعينًا بأدوات الذكاء الاصطناعي لتسريع الإنتاج ورفع جودة المخرجات.',
    'Graphic designer and digital marketer, computer science graduate, with years of freelance experience in visual identity design, social media management, and creating/managing funded advertising campaigns for clients across diverse sectors (real estate, restaurants, law firms, car rental, bakeries, cafes). Combines creative design sensibility with strategic marketing planning, leveraging AI tools to accelerate production and enhance output quality.'
  );
  const educationTitle = t('التعليم', 'Education');
  const educationText = t(
    'بكالوريوس علوم حاسوب — الكلية الدولية، صنعاء، اليمن — 2023',
    "Bachelor of Computer Science — International College, Sana'a, Yemen — 2023"
  );
  const initials = t('ع م', 'AM');

  const infoBadges: InfoBadgeProps[] = [
    {
      icon: <User className="size-4" />,
      text: t('24 سنة', '24 years'),
    },
    {
      icon: <Globe className="size-4" />,
      text: t('يمنية', 'Yemeni'),
    },
    {
      icon: <Heart className="size-4" />,
      text: t('أعزب', 'Single'),
    },
    {
      icon: <Briefcase className="size-4" />,
      text: t('متفرغ', 'Available'),
    },
    {
      icon: <MapPin className="size-4" />,
      text: t('الرياض', 'Riyadh'),
    },
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-900">
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
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
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
              <Card className="border-navy-800/8 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 md:p-8">
                  <p
                    className={`text-base md:text-lg leading-relaxed text-foreground/80 ${isRTL ? 'text-right' : 'text-left'}`}
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
                  delay={index * 0.08}
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
                className={`text-xl md:text-2xl font-bold text-navy-900 mb-4 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                  <GraduationCap className="size-5" />
                </div>
                {educationTitle}
              </h3>

              <Card className="border-navy-800/8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5 md:p-6">
                  <p
                    className={`text-base md:text-lg font-medium text-foreground/90 ${isRTL ? 'text-right' : 'text-left'}`}
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
