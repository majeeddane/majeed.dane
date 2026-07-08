import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

process.env.DATABASE_URL = 'file:L:/majeed dane/db/custom.db';
const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function migrate() {
  console.log('Starting migration from SQLite to Supabase...');

  // 1. Migrate Admin
  console.log('Migrating admin...');
  const admins = await prisma.admin.findMany();
  for (const item of admins) {
    const { data, error } = await supabase
      .from('admin')
      .upsert({
        id: item.id,
        password: item.password,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      });
    if (error) console.error('Error migrating admin:', error.message);
  }

  // 2. Migrate SiteContent
  console.log('Migrating site content...');
  const siteContent = await prisma.siteContent.findMany();
  for (const item of siteContent) {
    const { data, error } = await supabase
      .from('site_content')
      .upsert({
        id: item.id,
        key: item.key,
        value_ar: item.valueAr,
        value_en: item.valueEn,
        type: item.type,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      });
    if (error) console.error(`Error migrating site_content (${item.key}):`, error.message);
  }

  // 3. Migrate Experiences
  console.log('Migrating experiences...');
  const experiences = await prisma.experience.findMany();
  for (const item of experiences) {
    const { data, error } = await supabase
      .from('experiences')
      .upsert({
        id: item.id,
        company_ar: item.companyAr,
        company_en: item.companyEn,
        desc_ar: item.descAr,
        desc_en: item.descEn,
        order: item.order,
        visible: item.visible,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      });
    if (error) console.error(`Error migrating experience (${item.companyAr}):`, error.message);
  }

  // 4. Migrate Client Logos
  console.log('Migrating client logos...');
  const clientLogos = await prisma.clientLogo.findMany();
  for (const item of clientLogos) {
    const { data, error } = await supabase
      .from('client_logos')
      .upsert({
        id: item.id,
        name_ar: item.nameAr,
        name_en: item.nameEn,
        logo_url: item.logoUrl,
        order: item.order,
        visible: item.visible,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      });
    if (error) console.error(`Error migrating client logo (${item.nameAr}):`, error.message);
  }

  // 5. Migrate Skills
  console.log('Migrating skills...');
  const skills = await prisma.skill.findMany();
  for (const item of skills) {
    const { data, error } = await supabase
      .from('skills')
      .upsert({
        id: item.id,
        title_ar: item.titleAr,
        title_en: item.titleEn,
        desc_ar: item.descAr,
        desc_en: item.descEn,
        icon: item.icon,
        level: item.level,
        category: item.category,
        order: item.order,
        visible: item.visible,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      });
    if (error) console.error(`Error migrating skill (${item.titleAr}):`, error.message);
  }

  // 6. Migrate Courses
  console.log('Migrating courses...');
  const courses = await prisma.course.findMany();
  for (const item of courses) {
    const { data, error } = await supabase
      .from('courses')
      .upsert({
        id: item.id,
        title_ar: item.titleAr,
        title_en: item.titleEn,
        icon: item.icon,
        order: item.order,
        visible: item.visible,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      });
    if (error) console.error(`Error migrating course (${item.titleAr}):`, error.message);
  }

  // 7. Migrate Portfolio Items
  console.log('Migrating portfolio items...');
  const portfolioItems = await prisma.portfolioItem.findMany();
  for (const item of portfolioItems) {
    const { data, error } = await supabase
      .from('portfolio_items')
      .upsert({
        id: item.id,
        title_ar: item.titleAr,
        title_en: item.titleEn,
        category: item.category,
        image_url: item.imageUrl,
        description_ar: item.descriptionAr,
        description_en: item.descriptionEn,
        project_url: item.projectUrl,
        order: item.order,
        visible: item.visible,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
      });
    if (error) console.error(`Error migrating portfolio item (${item.titleAr}):`, error.message);
  }

  console.log('Migration completed successfully!');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
