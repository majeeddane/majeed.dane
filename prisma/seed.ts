import { db } from '../src/lib/db';
import { hash } from 'crypto';

async function main() {
  // Create default admin (password: admin123)
  const existingAdmin = await db.admin.findFirst();
  if (!existingAdmin) {
    const hashedPassword = hashPassword('admin123');
    await db.admin.create({
      data: { password: hashedPassword },
    });
    console.log('Admin created with password: admin123');
  }

  // Seed SiteContent
  const contents = [
    { key: 'hero_name_ar', valueAr: 'عبدالمجيد محمد يحيى الضاعني', valueEn: 'Abdulmajeed Mohammed Yahya Al-Daani', type: 'text' },
    { key: 'hero_title_ar', valueAr: 'مصمم جرافيك | أخصائي تسويق رقمي | مطوّر مواقع ويب', valueEn: 'Graphic Designer | Digital Marketing Specialist | Web Developer', type: 'text' },
    { key: 'hero_tagline_ar', valueAr: 'أبدع بالتصميم، أخطط بالتسويق، وأوظّف الذكاء الاصطناعي لصناعة مخرجات استثنائية', valueEn: 'Creative in Design, Strategic in Marketing, Leveraging AI for Exceptional Results', type: 'text' },
    { key: 'about_ar', valueAr: 'مصمم جرافيك ومسوّق رقمي، خريج علوم حاسوب، يمتلك خبرة عملية في العمل الحر امتدت لعدة سنوات في تصميم الهويات البصرية، وإدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة لعملاء من قطاعات متنوعة (عقارات، مطاعم، محاماة، تأجير سيارات، مخابز، مقاهي). يمزج بين الحس الإبداعي في التصميم والتخطيط التسويقي المدروس، مستعينًا بأدوات الذكاء الاصطناعي لتسريع الإنتاج ورفع جودة المخرجات.', valueEn: 'Graphic designer and digital marketer, computer science graduate, with years of freelance experience in visual identity design, social media management, and creating/managing funded advertising campaigns for clients across diverse sectors (real estate, restaurants, law firms, car rental, bakeries, cafes). Combines creative design sensibility with strategic marketing planning, leveraging AI tools to accelerate production and enhance output quality.', type: 'text' },
    { key: 'about_age', valueAr: '24 سنة', valueEn: '24 years old', type: 'badge' },
    { key: 'about_nationality', valueAr: 'يمنية', valueEn: 'Yemeni', type: 'badge' },
    { key: 'about_status', valueAr: 'أعزب', valueEn: 'Single', type: 'badge' },
    { key: 'about_availability', valueAr: 'متفرغ للعمل الحضوري', valueEn: 'Available for on-site work', type: 'badge' },
    { key: 'about_license', valueAr: 'رخصة قيادة سارية - السعودية', valueEn: 'Valid Saudi driving license', type: 'badge' },
    { key: 'about_teamwork', valueAr: 'قادر على العمل ضمن فريق', valueEn: 'Team player', type: 'badge' },
    { key: 'about_location', valueAr: 'الرياض، السعودية', valueEn: 'Riyadh, Saudi Arabia', type: 'badge' },
    { key: 'education_ar', valueAr: 'بكالوريوس علوم حاسوب — الكلية الدولية، صنعاء، اليمن — 2023', valueEn: 'Bachelor of Computer Science — International College, Sana\'a, Yemen — 2023', type: 'text' },
    { key: 'contact_phone', valueAr: '+966 55 476 7928', valueEn: '+966 55 476 7928', type: 'contact' },
    { key: 'contact_email', valueAr: 'majeed.dane@gmail.com', valueEn: 'majeed.dane@gmail.com', type: 'contact' },
    { key: 'contact_location', valueAr: 'الرياض، السعودية', valueEn: 'Riyadh, Saudi Arabia', type: 'contact' },
    { key: 'stats_experience', valueAr: '5', valueEn: '5', type: 'stat' },
    { key: 'stats_clients', valueAr: '10', valueEn: '10', type: 'stat' },
    { key: 'stats_projects', valueAr: '50', valueEn: '50', type: 'stat' },
    { key: 'stats_campaigns', valueAr: '30', valueEn: '30', type: 'stat' },
    { key: 'stats_experience_label_ar', valueAr: 'سنوات الخبرة', valueEn: 'Years Experience', type: 'stat_label' },
    { key: 'stats_clients_label_ar', valueAr: 'عميل', valueEn: 'Clients', type: 'stat_label' },
    { key: 'stats_projects_label_ar', valueAr: 'مشروع', valueEn: 'Projects', type: 'stat_label' },
    { key: 'stats_campaigns_label_ar', valueAr: 'حملة إعلانية', valueEn: 'Ad Campaigns', type: 'stat_label' },
    { key: 'cv_file', valueAr: '', valueEn: '', type: 'file' },
    { key: 'portfolio_file', valueAr: '', valueEn: '', type: 'file' },
    { key: 'profile_image', valueAr: '', valueEn: '', type: 'file' },
  ];

  for (const c of contents) {
    await db.siteContent.upsert({
      where: { key: c.key },
      update: { valueAr: c.valueAr, valueEn: c.valueEn, type: c.type },
      create: { key: c.key, valueAr: c.valueAr, valueEn: c.valueEn, type: c.type },
    });
  }

  // Seed Experiences
  const experiences = [
    { companyAr: 'شركة كونتكت لنظم المعلومات', companyEn: 'Contact Information Systems (CIS)', descAr: 'تصميم الهوية البصرية الكاملة للشركة، وإدارة حسابات التواصل الاجتماعي، والرد على استفسارات العملاء عبر الصفحات وخرائط جوجل.', descEn: 'Complete visual identity design, social media management, and customer inquiries response via pages and Google Maps.', order: 1 },
    { companyAr: 'شركة اتحاد العصر للمحاماة', companyEn: 'ASR Law Group', descAr: 'تصميم وإدارة صفحات التواصل الاجتماعي، وإنشاء وإدارة حملات إعلانية ممولة.', descEn: 'Social media design and management, creation and management of funded advertising campaigns.', order: 2 },
    { companyAr: 'مخابز ساساز بيكري', companyEn: 'Sasaz Bakery', descAr: 'تصميم الهوية البصرية والمحتوى التسويقي.', descEn: 'Visual identity design and marketing content creation.', order: 3 },
    { companyAr: 'عملاء متعددون', companyEn: 'Multiple Clients', descAr: 'تصميم وإدارة صفحات التواصل الاجتماعي وإطلاق حملات إعلانية ممولة لشركات عقارية، مطاعم، تأجير سيارات، مقاهي، وشركة تنظيم مؤتمرات.', descEn: 'Social media design and management, launching funded ad campaigns for real estate, restaurants, car rental, cafes, and event management companies.', order: 4 },
    { companyAr: 'مشاريع ويب وبروفايلات', companyEn: 'Web & Profile Projects', descAr: 'تصميم بروفايلات تعريفية للشركات، وتصميم وتطوير مواقع ويب.', descEn: 'Company profile design and website development.', order: 5 },
  ];

  for (const exp of experiences) {
    await db.experience.create({ data: exp });
  }

  // Seed Client Logos
  const clients = [
    { nameAr: 'سهل للصرافة', nameEn: 'Sahl for Exchange', order: 1 },
    { nameAr: 'انچ لاونج', nameEn: 'Ang Lounge', order: 2 },
    { nameAr: 'انچ للتجارة', nameEn: 'Ang Trading Co.', order: 3 },
    { nameAr: 'اتحاد العصر للمحاماة والاستشارات', nameEn: 'ASR Law Group', order: 4 },
    { nameAr: 'الموقع الأول', nameEn: 'First Location', order: 5 },
    { nameAr: 'دهليز لتأجير السيارات', nameEn: 'Dehliz', order: 6 },
    { nameAr: 'مطاعم وسّاب', nameEn: 'Wesab Restaurant', order: 7 },
    { nameAr: 'كونتكت لنظم المعلومات', nameEn: 'CIS', order: 8 },
    { nameAr: 'بهارات حدة', nameEn: 'Haddah Spices', order: 9 },
    { nameAr: 'فلافل المعلم', nameEn: 'Al-Muallim Falafel', order: 10 },
  ];

  for (const client of clients) {
    await db.clientLogo.create({ data: client });
  }

  // Seed Skills
  const skills = [
    { titleAr: 'التصميم الجرافيكي', titleEn: 'Graphic Design', descAr: 'تصميم الهويات البصرية ومحتوى بصري جذاب باستخدام Canva و Adobe Photoshop & Illustrator للمحترفين', descEn: 'Visual identity design and engaging visual content using Canva and Adobe Photoshop & Illustrator', icon: 'Palette', level: 95, category: 'design', order: 1 },
    { titleAr: 'التسويق الرقمي', titleEn: 'Digital Marketing', descAr: 'إدارة حسابات التواصل الاجتماعي، وإعداد وإدارة الحملات الإعلانية الممولة، وكتابة المحتوى التسويقي والإبداعي', descEn: 'Social media management, funded ad campaigns, and creative marketing content writing', icon: 'Megaphone', level: 90, category: 'marketing', order: 2 },
    { titleAr: 'خدمة العملاء', titleEn: 'Customer Service', descAr: 'الرد على التعليقات والاستفسارات بطريقة احترافية على صفحات الشركات', descEn: 'Professional responses to comments and inquiries on company pages', icon: 'Headphones', level: 85, category: 'soft', order: 3 },
    { titleAr: 'أدوات المكتب والعروض', titleEn: 'Office & Presentations', descAr: 'تصميم بروفايلات خاصة بالشركات، إتقان برامج الأوفيس (Word – PowerPoint) في إعداد التقارير والجداول والعروض التقديمية', descEn: 'Company profiles, proficiency in Office (Word – PowerPoint) for reports and presentations', icon: 'FileSpreadsheet', level: 88, category: 'tools', order: 4 },
    { titleAr: 'الذكاء الاصطناعي', titleEn: 'AI Tools', descAr: 'توظيف أدوات الذكاء الاصطناعي في تسريع التصميم وإدارة المحتوى', descEn: 'Leveraging AI tools to accelerate design and content management', icon: 'Sparkles', level: 92, category: 'ai', order: 5 },
  ];

  for (const skill of skills) {
    await db.skill.create({ data: skill });
  }

  // Seed Courses
  const courses = [
    { titleAr: 'تصميم الهويات البصرية', titleEn: 'Visual Identity Design', icon: 'Palette', order: 1 },
    { titleAr: 'تصميم منشورات السوشيال ميديا', titleEn: 'Social Media Post Design', icon: 'Image', order: 2 },
    { titleAr: 'كتابة المحتوى التسويقي', titleEn: 'Marketing Content Writing', icon: 'PenTool', order: 3 },
    { titleAr: 'إدارة الإعلانات على مواقع التواصل الاجتماعي', titleEn: 'Social Media Ads Management', icon: 'Megaphone', order: 4 },
    { titleAr: 'إعداد الحملات التسويقية والإعلانات الممولة', titleEn: 'Marketing Campaigns & Funded Ads', icon: 'Target', order: 5 },
    { titleAr: 'Canva للمحترفين', titleEn: 'Canva for Professionals', icon: 'Brush', order: 6 },
    { titleAr: 'Adobe Photoshop & Illustrator', titleEn: 'Adobe Photoshop & Illustrator', icon: 'Layers', order: 7 },
    { titleAr: 'طرق استخدام مواقع الذكاء الاصطناعي والاستفادة منها', titleEn: 'Using AI Websites Effectively', icon: 'Sparkles', order: 8 },
    { titleAr: 'كيف تتعامل مع الذكاء الاصطناعي', titleEn: 'How to Deal with AI', icon: 'Brain', order: 9 },
  ];

  for (const course of courses) {
    await db.course.create({ data: course });
  }

  console.log('Seed completed successfully!');
}

import crypto from 'crypto';

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
