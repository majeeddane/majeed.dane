import Header from '@/components/sections/header';
import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import StatsSection from '@/components/sections/stats';
import SkillsSection from '@/components/sections/skills';
import AIExpertiseSection from '@/components/sections/ai-expertise';
import ExperienceSection from '@/components/sections/experience';
import ClientsSection from '@/components/sections/clients';
import PortfolioSection from '@/components/sections/portfolio';
import CoursesSection from '@/components/sections/courses';
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
        <HeroSection initialContent={initialContent} />
        <div id="about">
          <AboutSection initialContent={initialContent} />
        </div>
        <StatsSection />
        <div id="skills">
          <SkillsSection />
        </div>
        <AIExpertiseSection />
        <div id="experience">
          <ExperienceSection />
        </div>
        <ClientsSection />
        <div id="portfolio">
          <PortfolioSection />
        </div>
        <CoursesSection />
        <div id="contact">
          <ContactSection />
        </div>
      </main>
      <Footer initialContent={initialContent} />
      <AdminPanel />
      <WhatsAppButton />
    </div>
  );
}
