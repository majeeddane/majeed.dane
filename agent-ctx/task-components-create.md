# Task: Create Four Portfolio Section Components

## Summary

Created four React component files for a premium bilingual (Arabic/English) portfolio website with RTL support.

## Files Created

### 1. `/home/z/my-project/src/components/sections/courses.tsx`
- Certifications & Courses section with light background and section-padding
- Section title with gold underline: "الشهادات والدورات / Certifications & Courses"
- Responsive grid: 1 col (mobile), 2 cols (md), 3 cols (lg)
- 9 course cards with glass-effect background, gold left/right border (RTL-aware), subtle hover lift
- Icons imported from lucide-react: Palette, Image, PenTool, Megaphone, Target, Brush, Layers, Sparkles, Brain
- framer-motion staggered fade-in on scroll
- Uses `useLanguage()` from `@/lib/language-context`

### 2. `/home/z/my-project/src/components/sections/contact.tsx`
- Contact section with navy gradient background (gradient-navy)
- Section title: "تواصل معي / Get In Touch" with gold underline, white text
- Two columns: contact info (left) + contact form (right)
- Contact info: Phone (+966 55 476 7928), Email (majeed.dane@gmail.com), Location (الرياض، السعودية)
- Each item: white text, gold icon, hover effects
- Contact form with useState: Name, Email inputs + Message textarea + Submit button
- Form styling: bg-white/10, border-white/20, text-white, placeholder:text-white/50, focus:border-gold
- POST to /api/contact on submit, success toast via useToast
- framer-motion fade-in on scroll

### 3. `/home/z/my-project/src/components/sections/footer.tsx`
- Footer with very dark navy background (#0A1D3A), gold top border
- 3-column layout on desktop, stacked on mobile:
  - Name + title + tagline
  - Quick links (عني، المهارات، الخبرة، الأعمال، تواصل)
  - Download CV button + copyright
- Copyright: "© 2024 عبدالمجيد الضاعني. جميع الحقوق محفوظة / All Rights Reserved"
- Download CV: gold outline button with Download icon
- Smooth scroll on nav links
- Standard footer element (parent wrapper handles sticky bottom with min-h-screen + flex + mt-auto)

### 4. `/home/z/my-project/src/components/sections/header.tsx`
- Sticky header: fixed top, full width, z-50
- Glass-effect bg on scroll (bg-white/80 backdrop-blur-md), transparent at top
- Logo/Name: "عبدالمجيد الضاعني" (Arabic) / "Al-Daani" (English), bold navy text, scroll to top
- Desktop nav links: نبذة عني, المهارات, الخبرة, الأعمال, تواصل (hidden on mobile)
- Language toggle: round button with "EN" / "عربي", navy bg, white text
- CV Download button: gold bg, navy text, Download icon
- Mobile: hamburger menu (Sheet from shadcn/ui) with nav links + language toggle + CV button
- Uses useState for scroll position, useEffect with scroll listener (threshold: 50px)
- Smooth scroll on all anchor links

## Theme Colors
- Navy: #0B2545 (navy-900), #13315C (navy-800), #1B3A6B (navy-700), #1E5F9E (blue-600)
- Gold: #C9A84C (gold), #D4BC6A (gold-light)

## Lint Status
All four files pass ESLint with no errors or warnings.

## Dependencies Used
- framer-motion (already installed)
- lucide-react (already installed)
- @/components/ui/sheet, button, input, textarea (all available)
- @/lib/language-context (already exists)
- @/hooks/use-toast (already exists)
