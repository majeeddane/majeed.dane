'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ClientEntry {
  id: string;
  nameAr: string;
  nameEn: string;
  logoUrl: string | null;
  visible: boolean;
}

function ClientCard({ client }: { client: ClientEntry }) {
  const { t } = useLanguage();
  return (
    <div
      className="flex-shrink-0 group flex cursor-pointer flex-col items-center justify-center rounded-lg border bg-navy-800/30 backdrop-blur-sm p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg mx-2 sm:mx-3"
      style={{
        borderColor: 'rgba(255, 255, 255, 0.08)',
        width: '180px',
        minHeight: '120px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#C9A84C';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }}
    >
      {client.logoUrl ? (
        <img
          src={client.logoUrl}
          alt={t(client.nameAr, client.nameEn)}
          className="mb-3 h-12 w-12 rounded-full object-cover border border-white/10"
        />
      ) : (
        <div
          className="mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        >
          <Building2
            className="h-6 w-6 transition-colors duration-300"
            style={{ color: '#8A9BB5' }}
          />
        </div>
      )}
      <span
        className="text-center text-sm font-semibold leading-tight transition-colors duration-300 text-white/90 group-hover:text-white"
        dir="rtl"
      >
        {client.nameAr}
      </span>
      <span
        className="mt-1 text-center text-xs leading-tight transition-colors duration-300 text-white/50 group-hover:text-[#C9A84C]"
        dir="ltr"
      >
        {client.nameEn}
      </span>
    </div>
  );
}

export default function ClientsSection() {
  const { isRTL, t } = useLanguage();
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then(data => {
        setClients(Array.isArray(data) ? data.filter((c: ClientEntry) => c.visible) : []);
      })
      .catch(() => {
        setClients([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Split clients into two rows
  const midpoint = Math.ceil(clients.length / 2);
  const firstRow = clients.slice(0, midpoint);
  const secondRow = clients.slice(midpoint);

  // Duplicate items 4 times for seamless looping
  const dupFirstRow = [...firstRow, ...firstRow, ...firstRow, ...firstRow];
  const dupSecondRow = [...secondRow, ...secondRow, ...secondRow, ...secondRow];

  return (
    <section
      id="clients"
      className="py-16 md:py-24 overflow-hidden border-y border-white/5 bg-navy-950/45"
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
            className="text-3xl font-bold md:text-4xl text-white"
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
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
        </div>
      ) : clients.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-lg font-medium" style={{ color: '#64748B' }}>
            {t('لا يوجد شركاء بعد', 'No clients yet')}
          </p>
        </div>
      ) : (
        <div className="w-full space-y-6">
          {/* First row - scrolls left */}
          {firstRow.length > 0 && (
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
          )}

          {/* Second row - scrolls right (reverse) */}
          {secondRow.length > 0 && (
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
          )}
        </div>
      )}
    </section>
  );
}
