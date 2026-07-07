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

function ClientCard({ client }: { client: ClientEntry }) {
  return (
    <div
      className="flex-shrink-0 group flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-white p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg mx-2 sm:mx-3"
      style={{
        borderColor: '#E2E8F0',
        width: '180px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C';
      }}
      onMouseLeave={(e) => {
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
    </div>
  );
}

export default function ClientsSection() {
  const { isRTL, t } = useLanguage();

  // Split clients into two rows
  const firstRow = clients.slice(0, 5);
  const secondRow = clients.slice(5, 10);

  // Duplicate items 4 times for seamless looping
  const dupFirstRow = [...firstRow, ...firstRow, ...firstRow, ...firstRow];
  const dupSecondRow = [...secondRow, ...secondRow, ...secondRow, ...secondRow];

  return (
    <section
      id="clients"
      className="py-16 md:py-24 overflow-hidden"
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
          className="mb-12 md:mb-16 text-center"
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
      </div>

      {/* Marquee Container */}
      <div className="w-full space-y-6">
        {/* First row - scrolls left */}
        <div className="overflow-hidden w-full">
          <div
            className="flex w-max hover:[animation-play-state:paused]"
            style={{ animation: 'marquee-scroll 30s linear infinite' }}
          >
            {dupFirstRow.map((client, index) => (
              <ClientCard key={`row1-${index}`} client={client} />
            ))}
          </div>
        </div>

        {/* Second row - scrolls right (reverse) */}
        <div className="overflow-hidden w-full">
          <div
            className="flex w-max hover:[animation-play-state:paused]"
            style={{ animation: 'marquee-scroll-reverse 35s linear infinite' }}
          >
            {dupSecondRow.map((client, index) => (
              <ClientCard key={`row2-${index}`} client={client} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
