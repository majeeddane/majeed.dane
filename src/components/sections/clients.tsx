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
      className="flex-shrink-0 group flex cursor-pointer flex-col items-center justify-center rounded-2xl card-glass p-5 transition-all duration-300 hover:border-gold/40 hover:scale-105 mx-2 sm:mx-3"
      style={{
        width: '180px',
        minHeight: '120px',
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
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <Building2
            className="h-5 w-5 transition-colors duration-300 text-white/40 group-hover:text-gold"
          />
        </div>
      )}
      <span
        className="text-center text-sm font-semibold leading-tight transition-colors duration-300 text-white/80 group-hover:text-white"
        dir="rtl"
      >
        {client.nameAr}
      </span>
      <span
        className="mt-1 text-center text-xs leading-tight transition-colors duration-300 text-white/40 group-hover:text-gold"
        dir="ltr"
      >
        {client.nameEn}
      </span>
    </div>
  );
}

export default function ClientsSection() {
  const { t } = useLanguage();
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

  const midpoint = Math.ceil(clients.length / 2);
  const firstRow = clients.slice(0, midpoint);
  const secondRow = clients.slice(midpoint);

  const dupFirstRow = [...firstRow, ...firstRow, ...firstRow, ...firstRow];
  const dupSecondRow = [...secondRow, ...secondRow, ...secondRow, ...secondRow];

  return (
    <section
      id="clients"
      className="bg-[#0A0A0A] py-20 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 reveal-up text-center">
          <p className="section-eyebrow justify-center">
            <i className="fi fi-br-handshake" />
            {t('ثقة متبادلة', 'Mutual Trust')}
          </p>
          <h2 className="section-title-xl">
            {t('شركاء', 'Trusted')}{' '}
            <span style={{ color: '#C8A45A' }}>{t('النجاح', 'By')}</span>
          </h2>
          <div className="gold-line mx-auto" style={{ transformOrigin: 'center center' }} />
        </div>
      </div>

      {/* Marquee Container */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-gold" />
        </div>
      ) : clients.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-white/30">
            {t('لا يوجد شركاء بعد', 'No clients yet')}
          </p>
        </div>
      ) : (
        <div dir="ltr" className="w-full space-y-6">
          {firstRow.length > 0 && (
            <div className="overflow-hidden w-full">
              <div
                className="flex w-max hover:[animation-play-state:paused]"
                style={{ animation: 'marquee-scroll 35s linear infinite' }}
              >
                {dupFirstRow.map((client, index) => (
                  <ClientCard key={`row1-${index}`} client={client} />
                ))}
              </div>
            </div>
          )}

          {secondRow.length > 0 && (
            <div className="overflow-hidden w-full">
              <div
                className="flex w-max hover:[animation-play-state:paused]"
                style={{ animation: 'marquee-scroll-reverse 40s linear infinite' }}
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
