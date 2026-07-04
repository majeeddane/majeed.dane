'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';

interface ClientEntry {
  nameAr: string;
  nameEn: string;
}

const clients: ClientEntry[] = [
  { nameAr: 'سهل للصرافة', nameEn: 'Sahl for Exchange' },
  { nameAr: 'انچ لاونج', nameEn: 'Ang Lounge' },
  { nameAr: 'انچ للتجارة', nameEn: 'Ang Trading Co.' },
  {
    nameAr: 'اتحاد العصر للمحاماة والاستشارات',
    nameEn: 'ASR Law Group',
  },
  { nameAr: 'الموقع الأول', nameEn: 'First Location' },
  { nameAr: 'دهليز لتأجير السيارات', nameEn: 'Dehliz' },
  { nameAr: 'مطاعم وسّاب', nameEn: 'Wesab Restaurant' },
  { nameAr: 'كونتكت لنظم المعلومات', nameEn: 'CIS' },
  { nameAr: 'بهارات حدة', nameEn: 'Haddah Spices' },
  { nameAr: 'فلافل المعلم', nameEn: 'Al-Muallim Falafel' },
];

export default function ClientsSection() {
  const { isRTL, t } = useLanguage();

  return (
    <section
      id="clients"
      className="py-16 md:py-24"
      style={{ backgroundColor: '#F0F4F8' }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ color: '#0B2545' }}
          >
            {t('شركاء النجاح', 'Trusted By')}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-24 rounded-full"
            style={{ backgroundColor: '#C9A84C' }}
          />
        </motion.div>

        {/* Client Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: 'easeOut',
              }}
              className="group flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-white p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                filter: 'grayscale(100%)',
                borderColor: '#E2E8F0',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.filter = 'grayscale(0%)';
                (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.filter = 'grayscale(100%)';
                (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0';
              }}
            >
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300"
                style={{ backgroundColor: '#F0F4F8' }}
              >
                <Building2
                  className="h-6 w-6 transition-colors duration-300"
                  style={{ color: '#8A9BB5' }}
                />
              </div>
              <span
                className="text-center text-sm font-medium leading-tight transition-colors duration-300 group-hover:text-[#0B2545]"
                style={{ color: '#64748B' }}
                dir="rtl"
              >
                {client.nameAr}
              </span>
              <span
                className="mt-1 text-center text-xs leading-tight transition-colors duration-300 group-hover:text-[#C9A84C]"
                style={{ color: '#94A3B8' }}
                dir="ltr"
              >
                {client.nameEn}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
