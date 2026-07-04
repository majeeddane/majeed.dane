'use client';

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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div id="about">
          <AboutSection />
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
      <Footer />
      <AdminPanel />
    </div>
  );
}
