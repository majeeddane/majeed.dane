import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'portfolio_salt_2024').digest('hex');
}

const DEFAULT_CONTENT = [
  { key: 'hero_name_ar', value_ar: 'عبدالمجيد محمد يحيى الضاعني', value_en: 'Abdulmajeed Mohammed Yahya Al-Daani', type: 'text' },
  { key: 'hero_title_ar', value_ar: 'مصمم جرافيك | أخصائي تسويق رقمي | مطوّر مواقع ويب', value_en: 'Graphic Designer | Digital Marketing Specialist | Web Developer', type: 'text' },
  { key: 'hero_tagline_ar', value_ar: 'أبدع بالتصميم، أخطط بالتسويق، وأوظّف الذكاء الاصطناعي لصناعة مخرجات استثنائية', value_en: 'Creative in Design, Strategic in Marketing, Leveraging AI for Exceptional Results', type: 'text' },
  { key: 'about_ar', value_ar: 'مصمم جرافيك ومسوّق رقمي، خريج علوم حاسوب، يمتلك خبرة عملية في العمل الحر امتدت لعدة سنوات في تصميم الهويات البصرية، وإدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة لعملاء من قطاعات متنوعة. يمزج بين الحس الإبداعي في التصميم والتخطيط التسويقي المدروس، مستعينًا بأدوات الذكاء الاصطناعي لتسريع الإنتاج ورفع جودة المخرجات.', value_en: 'Graphic designer and digital marketer, computer science graduate, with years of freelance experience in visual identity design, social media management, and creating/managing funded advertising campaigns for clients across diverse sectors. Combines creative design sensibility with strategic marketing planning, leveraging AI tools to accelerate production and enhance output quality.', type: 'text' },
  { key: 'about_age', value_ar: '24 سنة', value_en: '24 years old', type: 'badge' },
  { key: 'about_nationality', value_ar: 'يمنية', value_en: 'Yemeni', type: 'badge' },
  { key: 'about_status', value_ar: 'أعزب', value_en: 'Single', type: 'badge' },
  { key: 'about_availability', value_ar: 'متفرغ للعمل الحضوري', value_en: 'Available for on-site work', type: 'badge' },
  { key: 'about_license', value_ar: 'رخصة قيادة سارية - السعودية', value_en: 'Valid Saudi driving license', type: 'badge' },
  { key: 'about_teamwork', value_ar: 'قادر على العمل ضمن فريق', value_en: 'Team player', type: 'badge' },
  { key: 'about_location', value_ar: 'الرياض، السعودية', value_en: 'Riyadh, Saudi Arabia', type: 'badge' },
  { key: 'education_ar', value_ar: 'بكالوريوس علوم حاسوب — الكلية الدولية، صنعاء، اليمن — 2023', value_en: "Bachelor of Computer Science — International College, Sana'a, Yemen — 2023", type: 'text' },
  { key: 'contact_phone', value_ar: '+966 55 476 7928', value_en: '+966 55 476 7928', type: 'contact' },
  { key: 'contact_email', value_ar: 'majeed.dane@gmail.com', value_en: 'majeed.dane@gmail.com', type: 'contact' },
  { key: 'contact_location', value_ar: 'الرياض، السعودية', value_en: 'Riyadh, Saudi Arabia', type: 'contact' },
  { key: 'stats_experience', value_ar: '5', value_en: '5', type: 'stat' },
  { key: 'stats_clients', value_ar: '10', value_en: '10', type: 'stat' },
  { key: 'stats_projects', value_ar: '50', value_en: '50', type: 'stat' },
  { key: 'stats_campaigns', value_ar: '30', value_en: '30', type: 'stat' },
  { key: 'stats_experience_label_ar', value_ar: 'سنوات الخبرة', value_en: 'Years Experience', type: 'stat_label' },
  { key: 'stats_clients_label_ar', value_ar: 'عميل', value_en: 'Clients', type: 'stat_label' },
  { key: 'stats_projects_label_ar', value_ar: 'مشروع', value_en: 'Projects', type: 'stat_label' },
  { key: 'stats_campaigns_label_ar', value_ar: 'حملة إعلانية', value_en: 'Ad Campaigns', type: 'stat_label' },
  { key: 'cv_file', value_ar: '', value_en: '', type: 'file' },
  { key: 'portfolio_file', value_ar: '', value_en: '', type: 'file' },
  { key: 'profile_image', value_ar: '', value_en: '', type: 'file' },
  { key: 'about_image', value_ar: '', value_en: '', type: 'file' },
];

const DEFAULT_EXPERIENCES = [
  { company_ar: 'شركة كونتكت لنظم المعلومات', company_en: 'Contact Information Systems (CIS)', desc_ar: 'تصميم الهوية البصرية الكاملة للشركة، وإدارة حسابات التواصل الاجتماعي، والرد على استفسارات العملاء.', desc_en: 'Complete visual identity design, social media management, and customer inquiries response.', order: 1, visible: true },
  { company_ar: 'شركة اتحاد العصر للمحاماة', company_en: 'ASR Law Group', desc_ar: 'تصميم وإدارة صفحات التواصل الاجتماعي، وإنشاء وإدارة حملات إعلانية ممولة.', desc_en: 'Social media design and management, creation and management of funded advertising campaigns.', order: 2, visible: true },
  { company_ar: 'مخابز ساساز بيكري', company_en: 'Sasaz Bakery', desc_ar: 'تصميم الهوية البصرية والمحتوى التسويقي.', desc_en: 'Visual identity design and marketing content creation.', order: 3, visible: true },
  { company_ar: 'عملاء متعددون', company_en: 'Multiple Clients', desc_ar: 'تصميم وإدارة صفحات التواصل الاجتماعي وإطلاق حملات إعلانية ممولة.', desc_en: 'Social media design and management, launching funded ad campaigns.', order: 4, visible: true },
  { company_ar: 'مشاريع ويب وبروفايلات', company_en: 'Web & Profile Projects', desc_ar: 'تصميم بروفايلات تعريفية للشركات، وتصميم وتطوير مواقع ويب.', desc_en: 'Company profile design and website development.', order: 5, visible: true },
];

const DEFAULT_CLIENTS = [
  { name_ar: 'سهل للصرافة', name_en: 'Sahl for Exchange', order: 1, visible: true },
  { name_ar: 'انچ لاونج', name_en: 'Ang Lounge', order: 2, visible: true },
  { name_ar: 'انچ للتجارة', name_en: 'Ang Trading Co.', order: 3, visible: true },
  { name_ar: 'اتحاد العصر للمحاماة والاستشارات', name_en: 'ASR Law Group', order: 4, visible: true },
  { name_ar: 'الموقع الأول', name_en: 'First Location', order: 5, visible: true },
  { name_ar: 'دهليز لتأجير السيارات', name_en: 'Dehliz', order: 6, visible: true },
  { name_ar: 'مطاعم وسّاب', name_en: 'Wesab Restaurant', order: 7, visible: true },
  { name_ar: 'كونتكت لنظم المعلومات', name_en: 'CIS', order: 8, visible: true },
  { name_ar: 'بهارات حدة', name_en: 'Haddah Spices', order: 9, visible: true },
  { name_ar: 'فلافل المعلم', name_en: 'Al-Muallim Falafel', order: 10, visible: true },
];

const DEFAULT_SKILLS = [
  { title_ar: 'التصميم الجرافيكي', title_en: 'Graphic Design', desc_ar: 'تصميم الهويات البصرية ومحتوى بصري جذاب باستخدام Canva و Adobe Photoshop & Illustrator', desc_en: 'Visual identity design and engaging visual content using Canva and Adobe Photoshop & Illustrator', icon: 'Palette', level: 95, category: 'design', order: 1, visible: true },
  { title_ar: 'التسويق الرقمي', title_en: 'Digital Marketing', desc_ar: 'إدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة', desc_en: 'Social media management, funded ad campaigns, and creative marketing content writing', icon: 'Megaphone', level: 90, category: 'marketing', order: 2, visible: true },
  { title_ar: 'خدمة العملاء', title_en: 'Customer Service', desc_ar: 'الرد على التعليقات والاستفسارات بطريقة احترافية على صفحات الشركات', desc_en: 'Professional responses to comments and inquiries on company pages', icon: 'Headphones', level: 85, category: 'soft', order: 3, visible: true },
  { title_ar: 'أدوات المكتب والعروض', title_en: 'Office & Presentations', desc_ar: 'تصميم بروفايلات خاصة بالشركات، إتقان برامج الأوفيس (Word – PowerPoint)', desc_en: 'Company profiles, proficiency in Office (Word – PowerPoint) for reports and presentations', icon: 'FileSpreadsheet', level: 88, category: 'tools', order: 4, visible: true },
  { title_ar: 'الذكاء الاصطناعي', title_en: 'AI Tools', desc_ar: 'توظيف أدوات الذكاء الاصطناعي في تسريع التصميم وإدارة المحتوى', desc_en: 'Leveraging AI tools to accelerate design and content management', icon: 'Sparkles', level: 92, category: 'ai', order: 5, visible: true },
];

const DEFAULT_COURSES = [
  { title_ar: 'تصميم الهويات البصرية', title_en: 'Visual Identity Design', icon: 'Palette', order: 1, visible: true },
  { title_ar: 'تصميم منشورات السوشيال ميديا', title_en: 'Social Media Post Design', icon: 'Image', order: 2, visible: true },
  { title_ar: 'كتابة المحتوى التسويقي', title_en: 'Marketing Content Writing', icon: 'PenTool', order: 3, visible: true },
  { title_ar: 'إدارة الإعلانات على مواقع التواصل الاجتماعي', title_en: 'Social Media Ads Management', icon: 'Megaphone', order: 4, visible: true },
  { title_ar: 'إعداد الحملات التسويقية والإعلانات الممولة', title_en: 'Marketing Campaigns & Funded Ads', icon: 'Target', order: 5, visible: true },
  { title_ar: 'Canva للمحترفين', title_en: 'Canva for Professionals', icon: 'Brush', order: 6, visible: true },
  { title_ar: 'Adobe Photoshop & Illustrator', title_en: 'Adobe Photoshop & Illustrator', icon: 'Layers', order: 7, visible: true },
  { title_ar: 'طرق استخدام مواقع الذكاء الاصطناعي والاستفادة منها', title_en: 'Using AI Websites Effectively', icon: 'Sparkles', order: 8, visible: true },
  { title_ar: 'كيف تتعامل مع الذكاء الاصطناعي', title_en: 'How to Deal with AI', icon: 'Brain', order: 9, visible: true },
];

// GET - Seed the Supabase database with default data
export async function GET() {
  try {
    const supabase = getServerSupabase();

    const results: Record<string, number | boolean | string> = {};

    // 1. Admin
    const { data: admins } = await supabase.from('admin').select('id').limit(1);
    if (!admins || admins.length === 0) {
      const hashedPassword = hashPassword('admin123');
      const { error } = await supabase.from('admin').insert({ password: hashedPassword });
      if (error) {
        results.admin = `Error: ${error.message}`;
      } else {
        results.admin = true;
      }
    } else {
      results.admin = 'already exists';
    }

    // 2. Site content
    let contentCount = 0;
    for (const c of DEFAULT_CONTENT) {
      const { error } = await supabase.from('site_content').upsert(c, { onConflict: 'key' });
      if (!error) contentCount++;
    }
    results.content = contentCount;

    // 3. Experiences
    const { data: existingExp } = await supabase.from('experiences').select('id').limit(1);
    if (!existingExp || existingExp.length === 0) {
      const { error } = await supabase.from('experiences').insert(DEFAULT_EXPERIENCES);
      results.experiences = error ? `Error: ${error.message}` : DEFAULT_EXPERIENCES.length;
    } else {
      results.experiences = 'already seeded';
    }

    // 4. Clients
    const { data: existingClients } = await supabase.from('client_logos').select('id').limit(1);
    if (!existingClients || existingClients.length === 0) {
      const { error } = await supabase.from('client_logos').insert(DEFAULT_CLIENTS);
      results.clients = error ? `Error: ${error.message}` : DEFAULT_CLIENTS.length;
    } else {
      results.clients = 'already seeded';
    }

    // 5. Skills
    const { data: existingSkills } = await supabase.from('skills').select('id').limit(1);
    if (!existingSkills || existingSkills.length === 0) {
      const { error } = await supabase.from('skills').insert(DEFAULT_SKILLS);
      results.skills = error ? `Error: ${error.message}` : DEFAULT_SKILLS.length;
    } else {
      results.skills = 'already seeded';
    }

    // 6. Courses
    const { data: existingCourses } = await supabase.from('courses').select('id').limit(1);
    if (!existingCourses || existingCourses.length === 0) {
      const { error } = await supabase.from('courses').insert(DEFAULT_COURSES);
      results.courses = error ? `Error: ${error.message}` : DEFAULT_COURSES.length;
    } else {
      results.courses = 'already seeded';
    }

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      results,
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Setup failed', details: String(error) }, { status: 500 });
  }
}
