import Header from '@/components/sections/header';
import HeroSection from '@/components/sections/hero';
import PortfolioSection from '@/components/sections/portfolio';
import ServicesSection from '@/components/sections/services';
import ExperienceSection from '@/components/sections/experience';
import AboutSection from '@/components/sections/about';
import SkillsSection from '@/components/sections/skills';
import ClientsSection from '@/components/sections/clients';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/sections/footer';
import AdminPanel from '@/components/admin/admin-panel';
import WhatsAppButton from '@/components/ui/whatsapp-button';
import { getServerSupabase } from '@/lib/supabase';

// Force dynamic so admin panel changes reflect immediately (no stale cache)
export const dynamic = 'force-dynamic';

export interface ContentItem {
  id: string;
  key: string;
  valueAr: string | null;
  valueEn: string | null;
  type: string;
}

async function getInitialContent(): Promise<ContentItem[]> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('site_content')
      .select('id, key, value_ar, value_en, type');
    if (error) throw error;
    return (data || []).map((item) => ({
      id: item.id,
      key: item.key,
      valueAr: item.value_ar,
      valueEn: item.value_en,
      type: item.type,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const initialContent = await getInitialContent();

  return (
    <div className="flex min-h-screen flex-col">
      <Header initialContent={initialContent} />
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection initialContent={initialContent} />

        {/* 2. Selected Work */}
        <PortfolioSection />

        {/* 3. Services */}
        <ServicesSection />

        {/* 4. Work Experience */}
        <ExperienceSection />

        {/* 5. About Me */}
        <AboutSection initialContent={initialContent} />

        {/* 6. Skills */}
        <SkillsSection />

        {/* 7. Selected Clients */}
        <ClientsSection />

        {/* 8. Contact */}
        <ContactSection />
      </main>
      <Footer initialContent={initialContent} />
      <AdminPanel />
      <WhatsAppButton />
    </div>
  );
}
