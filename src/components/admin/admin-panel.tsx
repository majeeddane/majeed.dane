'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Lock,
  Upload,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Loader2,
  Check,
  Plus,
  Trash2,
  Save,
  Eye,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Users,
  Award,
  BookOpen,
  BarChart3,
  Phone,
  Globe,
  MapPin,
  Star,
  Palette,
  Megaphone,
  Headphones,
  Sparkles,
  Layers,
  Target,
  Brush,
  Brain,
  PenTool,
  Crop,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactCrop, { type Crop as CropType, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// ── Image Crop Dialog Component ──
function ImageCropDialog({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
  t,
}: {
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number;
  t: (ar: string, en: string) => string;
}) {
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [processing, setProcessing] = useState(false);

  const handleCropAndSave = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;
    setProcessing(true);

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        }
        setProcessing(false);
      },
      'image/jpeg',
      0.92
    );
  }, [completedCrop, onCropComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B2545] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {t('قص الصورة', 'Crop Image')}
          </h3>
          <button onClick={onCancel} className="text-white/50 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-auto rounded-lg bg-black/20 mb-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop"
              className="max-w-full"
              style={{ maxHeight: '50vh' }}
            />
          </ReactCrop>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-white/50 hover:text-white hover:bg-white/10"
          >
            {t('إلغاء', 'Cancel')}
          </Button>
          <Button
            onClick={handleCropAndSave}
            disabled={!completedCrop || processing}
            className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold"
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Crop className="h-4 w-4 mr-2 ml-2" />
            )}
            {t('قص وحفظ', 'Crop & Save')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Types ──
interface ContentItem {
  key: string;
  valueAr: string;
  valueEn: string;
  type: string;
}

interface PortfolioItemData {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  imageUrl: string;
  order: number;
  visible: boolean;
}

interface ExperienceData {
  id: string;
  companyAr: string;
  companyEn: string;
  descAr: string;
  descEn: string;
  order: number;
  visible: boolean;
}

interface ClientData {
  id: string;
  nameAr: string;
  nameEn: string;
  logoUrl: string | null;
  order: number;
  visible: boolean;
}

interface SkillData {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string | null;
  descEn: string | null;
  icon: string | null;
  level: number;
  category: string;
  order: number;
  visible: boolean;
}

interface CourseData {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string | null;
  order: number;
  visible: boolean;
}

// ── Content Key Labels ──
const contentSections = [
  {
    group: 'hero',
    labelAr: 'القسم الرئيسي (Hero)',
    labelEn: 'Hero Section',
    icon: Star,
    keys: [
      { key: 'hero_name_ar', labelAr: 'الاسم الكامل', labelEn: 'Full Name' },
      { key: 'hero_title_ar', labelAr: 'المسمى الوظيفي', labelEn: 'Job Title' },
      { key: 'hero_tagline_ar', labelAr: 'الشعار النصي', labelEn: 'Tagline' },
    ],
  },
  {
    group: 'about',
    labelAr: 'نبذة عني',
    labelEn: 'About Me',
    icon: FileText,
    keys: [
      { key: 'about_ar', labelAr: 'النبذة التعريفية', labelEn: 'Bio' },
      { key: 'about_age', labelAr: 'العمر', labelEn: 'Age' },
      { key: 'about_nationality', labelAr: 'الجنسية', labelEn: 'Nationality' },
      { key: 'about_status', labelAr: 'الحالة الاجتماعية', labelEn: 'Status' },
      { key: 'about_availability', labelAr: 'التفرغ', labelEn: 'Availability' },
      { key: 'about_license', labelAr: 'رخصة القيادة', labelEn: 'License' },
      { key: 'about_teamwork', labelAr: 'العمل ضمن فريق', labelEn: 'Teamwork' },
      { key: 'about_location', labelAr: 'الموقع', labelEn: 'Location' },
    ],
  },
  {
    group: 'education',
    labelAr: 'التعليم',
    labelEn: 'Education',
    icon: BookOpen,
    keys: [
      { key: 'education_ar', labelAr: 'الشهادة الجامعية', labelEn: 'Degree' },
    ],
  },
  {
    group: 'stats',
    labelAr: 'الإحصائيات',
    labelEn: 'Statistics',
    icon: BarChart3,
    keys: [
      { key: 'stats_experience', labelAr: 'سنوات الخبرة (رقم)', labelEn: 'Years (number)' },
      { key: 'stats_clients', labelAr: 'عدد العملاء (رقم)', labelEn: 'Clients (number)' },
      { key: 'stats_projects', labelAr: 'عدد المشاريع (رقم)', labelEn: 'Projects (number)' },
      { key: 'stats_campaigns', labelAr: 'عدد الحملات (رقم)', labelEn: 'Campaigns (number)' },
      { key: 'stats_experience_label_ar', labelAr: 'وصف سنوات الخبرة', labelEn: 'Years Label' },
      { key: 'stats_clients_label_ar', labelAr: 'وصف العملاء', labelEn: 'Clients Label' },
      { key: 'stats_projects_label_ar', labelAr: 'وصف المشاريع', labelEn: 'Projects Label' },
      { key: 'stats_campaigns_label_ar', labelAr: 'وصف الحملات', labelEn: 'Campaigns Label' },
    ],
  },
  {
    group: 'contact',
    labelAr: 'التواصل',
    labelEn: 'Contact',
    icon: Phone,
    keys: [
      { key: 'contact_phone', labelAr: 'رقم الهاتف', labelEn: 'Phone' },
      { key: 'contact_email', labelAr: 'البريد الإلكتروني', labelEn: 'Email' },
      { key: 'contact_location', labelAr: 'الموقع', labelEn: 'Location' },
    ],
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette, Megaphone, Headphones, FileText, Sparkles, Image: ImageIcon, PenTool, Target, Brush, Brain, Layers, Star, Globe,
};

// ── Sidebar Navigation Items ──
const sidebarItems = [
  { id: 'content', labelAr: 'المحتوى النصي', labelEn: 'Text Content', icon: FileText },
  { id: 'experiences', labelAr: 'الخبرات', labelEn: 'Experiences', icon: Briefcase },
  { id: 'clients', labelAr: 'العملاء', labelEn: 'Clients', icon: Users },
  { id: 'skills', labelAr: 'المهارات', labelEn: 'Skills', icon: Award },
  { id: 'courses', labelAr: 'الدورات', labelEn: 'Courses', icon: BookOpen },
  { id: 'portfolio', labelAr: 'معرض الأعمال', labelEn: 'Portfolio', icon: ImageIcon },
  { id: 'files', labelAr: 'الملفات والصور', labelEn: 'Files & Images', icon: Upload },
];

export default function AdminPanel() {
  const { lang, t } = useLanguage();
  const isRTL = lang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('content');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Data states
  const [contentData, setContentData] = useState<Record<string, { valueAr: string; valueEn: string }>>({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemData[]>([]);
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [experiencesLoaded, setExperiencesLoaded] = useState(false);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [skillsLoaded, setSkillsLoaded] = useState(false);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['hero']));
  const [editingItem, setEditingItem] = useState<string | null>(null);

  // Current file states
  const [currentProfileImg, setCurrentProfileImg] = useState<string>('');
  const [currentAboutImg, setCurrentAboutImg] = useState<string>('');
  const [currentCvFile, setCurrentCvFile] = useState<string>('');
  const [currentPortfolioFile, setCurrentPortfolioFile] = useState<string>('');

  // Pending file states (for save button)
  const [pendingProfileImg, setPendingProfileImg] = useState<File | null>(null);
  const [pendingAboutImg, setPendingAboutImg] = useState<File | null>(null);
  const [pendingCvFile, setPendingCvFile] = useState<File | null>(null);
  const [pendingPortfolioFile, setPendingPortfolioFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [aboutPreview, setAboutPreview] = useState<string>('');
  const [cvFileName, setCvFileName] = useState<string>('');
  const [portfolioFileName, setPortfolioFileName] = useState<string>('');

  // Image crop dialog state
  const [cropDialog, setCropDialog] = useState<{
    imageSrc: string;
    purpose: string;
    aspectRatio: number;
  } | null>(null);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // ── Login ──
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setContentLoaded(false);
        toast({ title: t('تم تسجيل الدخول بنجاح', 'Login successful') });
      } else {
        toast({ title: t('كلمة المرور غير صحيحة', 'Incorrect password'), variant: 'destructive' });
      }
    } catch {
      toast({ title: t('حدث خطأ', 'An error occurred'), variant: 'destructive' });
    }
    setLoginLoading(false);
  }, [password, t, toast]);

  // ── Data Loaders ──
  const loadContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      const data: ContentItem[] = await res.json();
      const map: Record<string, { valueAr: string; valueEn: string }> = {};
      data.forEach((item) => {
        map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' };
        if (item.key === 'profile_image' && item.valueAr) setCurrentProfileImg(item.valueAr);
        if (item.key === 'about_image' && item.valueAr) setCurrentAboutImg(item.valueAr);
        if (item.key === 'cv_file' && item.valueAr) setCurrentCvFile(item.valueAr);
        if (item.key === 'portfolio_file' && item.valueAr) setCurrentPortfolioFile(item.valueAr);
      });
      setContentData(map);
      setContentLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل المحتوى', 'Failed to load content'), variant: 'destructive' });
    }
  }, [t, toast]);

  const loadPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolioItems(data);
      setPortfolioLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل الأعمال', 'Failed to load portfolio'), variant: 'destructive' });
    }
  }, [t, toast]);

  const loadExperiences = useCallback(async () => {
    try {
      const res = await fetch('/api/experience');
      const data = await res.json();
      setExperiences(data);
      setExperiencesLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل الخبرات', 'Failed to load experiences'), variant: 'destructive' });
    }
  }, [t, toast]);

  const loadClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
      setClientsLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل العملاء', 'Failed to load clients'), variant: 'destructive' });
    }
  }, [t, toast]);

  const loadSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
      setSkillsLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل المهارات', 'Failed to load skills'), variant: 'destructive' });
    }
  }, [t, toast]);

  const loadCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/courses');
      const data = await res.json();
      setCourses(data);
      setCoursesLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل الدورات', 'Failed to load courses'), variant: 'destructive' });
    }
  }, [t, toast]);

  // ── Load data on section change (via click handler) ──
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
    setEditingItem(null);
    if (section === 'content' && !contentLoaded) loadContent();
    if (section === 'portfolio' && !portfolioLoaded) loadPortfolio();
    if (section === 'experiences' && !experiencesLoaded) loadExperiences();
    if (section === 'clients' && !clientsLoaded) loadClients();
    if (section === 'skills' && !skillsLoaded) loadSkills();
    if (section === 'courses' && !coursesLoaded) loadCourses();
    scrollRef.current?.scrollTo(0, 0);
  }, [contentLoaded, portfolioLoaded, experiencesLoaded, clientsLoaded, skillsLoaded, coursesLoaded, loadContent, loadPortfolio, loadExperiences, loadClients, loadSkills, loadCourses]);

  // ── Save Content ──
  const saveContent = useCallback(async (key: string) => {
    setSaving(true);
    try {
      const item = contentData[key];
      if (!item) return;
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, valueAr: item.valueAr, valueEn: item.valueEn }),
      });
      toast({ title: t('✓ تم الحفظ بنجاح', '✓ Saved successfully') });
    } catch {
      toast({ title: t('فشل الحفظ', 'Save failed'), variant: 'destructive' });
    }
    setSaving(false);
  }, [contentData, t, toast]);

  // ── Save All Content ──
  const saveAllContent = useCallback(async () => {
    setSaving(true);
    try {
      const items = Object.entries(contentData).map(([key, val]) => ({
        key,
        valueAr: val.valueAr,
        valueEn: val.valueEn,
      }));
      await fetch('/api/content/batch', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      toast({ title: t('✓ تم حفظ جميع المحتوى', '✓ All content saved') });
    } catch {
      toast({ title: t('فشل حفظ المحتوى', 'Content save failed'), variant: 'destructive' });
    }
    setSaving(false);
  }, [contentData, t, toast]);

  // ── File Upload (with explicit save) ──
  const uploadFile = useCallback(async (file: File | Blob, purpose: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file, `cropped-${purpose}.jpg`);
    formData.append('purpose', purpose);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.file?.url) {
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: purpose, valueAr: data.file.url, valueEn: data.file.url }),
        });
        if (purpose === 'profile_image') { setCurrentProfileImg(data.file.url); setPendingProfileImg(null); setProfilePreview(''); }
        if (purpose === 'about_image') { setCurrentAboutImg(data.file.url); setPendingAboutImg(null); setAboutPreview(''); }
        if (purpose === 'cv_file') { setCurrentCvFile(data.file.url); setPendingCvFile(null); setCvFileName(''); }
        if (purpose === 'portfolio_file') { setCurrentPortfolioFile(data.file.url); setPendingPortfolioFile(null); setPortfolioFileName(''); }
        toast({ title: t('✓ تم رفع الملف وحفظه بنجاح', '✓ File uploaded and saved') });
      } else {
        toast({ title: t('فشل رفع الملف', 'Upload failed'), variant: 'destructive' });
      }
    } catch {
      toast({ title: t('فشل رفع الملف', 'File upload failed'), variant: 'destructive' });
    }
    setUploading(false);
  }, [t, toast]);

  // ── CRUD: Experience ──
  const saveExperience = useCallback(async (exp: ExperienceData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/experience/${exp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exp),
      });
      if (res.ok) {
        toast({ title: t('✓ تم الحفظ', '✓ Saved') });
        setEditingItem(null);
      }
    } catch {
      toast({ title: t('فشل الحفظ', 'Save failed'), variant: 'destructive' });
    }
    setSaving(false);
  }, [t, toast]);

  const addExperience = useCallback(async () => {
    try {
      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyAr: 'شركة جديدة', companyEn: 'New Company', descAr: '', descEn: '', order: experiences.length + 1 }),
      });
      const data = await res.json();
      setExperiences(prev => [...prev, data]);
      toast({ title: t('تم إضافة خبرة', 'Experience added') });
    } catch {
      toast({ title: t('فشل الإضافة', 'Add failed'), variant: 'destructive' });
    }
  }, [experiences.length, t, toast]);

  const deleteExperience = useCallback(async (id: string) => {
    try {
      await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      setExperiences(prev => prev.filter(e => e.id !== id));
      toast({ title: t('تم الحذف', 'Deleted') });
    } catch {
      toast({ title: t('فشل الحذف', 'Delete failed'), variant: 'destructive' });
    }
  }, [t, toast]);

  // ── CRUD: Client ──
  const saveClient = useCallback(async (client: ClientData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      if (res.ok) {
        toast({ title: t('✓ تم الحفظ', '✓ Saved') });
        setEditingItem(null);
      }
    } catch {
      toast({ title: t('فشل الحفظ', 'Save failed'), variant: 'destructive' });
    }
    setSaving(false);
  }, [t, toast]);

  const addClient = useCallback(async () => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameAr: 'عميل جديد', nameEn: 'New Client', order: clients.length + 1 }),
      });
      const data = await res.json();
      setClients(prev => [...prev, data]);
      toast({ title: t('تم إضافة عميل', 'Client added') });
    } catch {
      toast({ title: t('فشل الإضافة', 'Add failed'), variant: 'destructive' });
    }
  }, [clients.length, t, toast]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      setClients(prev => prev.filter(c => c.id !== id));
      toast({ title: t('تم الحذف', 'Deleted') });
    } catch {
      toast({ title: t('فشل الحذف', 'Delete failed'), variant: 'destructive' });
    }
  }, [t, toast]);

  // ── CRUD: Skill ──
  const saveSkill = useCallback(async (skill: SkillData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/skills/${skill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skill),
      });
      if (res.ok) {
        toast({ title: t('✓ تم الحفظ', '✓ Saved') });
        setEditingItem(null);
      }
    } catch {
      toast({ title: t('فشل الحفظ', 'Save failed'), variant: 'destructive' });
    }
    setSaving(false);
  }, [t, toast]);

  const addSkill = useCallback(async () => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleAr: 'مهارة جديدة', titleEn: 'New Skill', level: 80, category: 'design', order: skills.length + 1 }),
      });
      const data = await res.json();
      setSkills(prev => [...prev, data]);
      toast({ title: t('تم إضافة مهارة', 'Skill added') });
    } catch {
      toast({ title: t('فشل الإضافة', 'Add failed'), variant: 'destructive' });
    }
  }, [skills.length, t, toast]);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      setSkills(prev => prev.filter(s => s.id !== id));
      toast({ title: t('تم الحذف', 'Deleted') });
    } catch {
      toast({ title: t('فشل الحذف', 'Delete failed'), variant: 'destructive' });
    }
  }, [t, toast]);

  // ── CRUD: Course ──
  const saveCourse = useCallback(async (course: CourseData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      if (res.ok) {
        toast({ title: t('✓ تم الحفظ', '✓ Saved') });
        setEditingItem(null);
      }
    } catch {
      toast({ title: t('فشل الحفظ', 'Save failed'), variant: 'destructive' });
    }
    setSaving(false);
  }, [t, toast]);

  const addCourse = useCallback(async () => {
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleAr: 'دورة جديدة', titleEn: 'New Course', icon: 'BookOpen', order: courses.length + 1 }),
      });
      const data = await res.json();
      setCourses(prev => [...prev, data]);
      toast({ title: t('تم إضافة دورة', 'Course added') });
    } catch {
      toast({ title: t('فشل الإضافة', 'Add failed'), variant: 'destructive' });
    }
  }, [courses.length, t, toast]);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      setCourses(prev => prev.filter(c => c.id !== id));
      toast({ title: t('تم الحذف', 'Deleted') });
    } catch {
      toast({ title: t('فشل الحذف', 'Delete failed'), variant: 'destructive' });
    }
  }, [t, toast]);

  // ── CRUD: Portfolio ──
  const savePortfolioItem = useCallback(async (item: PortfolioItemData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/portfolio/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        toast({ title: t('✓ تم الحفظ', '✓ Saved') });
        setEditingItem(null);
      }
    } catch {
      toast({ title: t('فشل الحفظ', 'Save failed'), variant: 'destructive' });
    }
    setSaving(false);
  }, [t, toast]);

  const addPortfolioItem = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleAr: 'عمل جديد', titleEn: 'New Work', category: 'posts', imageUrl: '/placeholder.jpg', order: portfolioItems.length + 1 }),
      });
      const data = await res.json();
      setPortfolioItems(prev => [...prev, data]);
      toast({ title: t('تم إضافة العمل', 'Item added') });
    } catch {
      toast({ title: t('فشل الإضافة', 'Add failed'), variant: 'destructive' });
    }
  }, [portfolioItems.length, t, toast]);

  const deletePortfolioItem = useCallback(async (id: string) => {
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      setPortfolioItems(prev => prev.filter(p => p.id !== id));
      toast({ title: t('تم الحذف', 'Deleted') });
    } catch {
      toast({ title: t('فشل الحذف', 'Delete failed'), variant: 'destructive' });
    }
  }, [t, toast]);

  // ── File selection handlers (with crop) ──
  const handleImageSelectWithCrop = (file: File, purpose: string, aspectRatio: number = 1) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setCropDialog({ imageSrc: dataUrl, purpose, aspectRatio });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = useCallback(async (croppedBlob: Blob) => {
    if (!cropDialog) return;
    const purpose = cropDialog.purpose;
    setCropDialog(null);
    const file = new File([croppedBlob], `cropped-${purpose}.jpg`, { type: 'image/jpeg' });

    if (purpose === 'profile_image') {
      setPendingProfileImg(file);
      const url = URL.createObjectURL(croppedBlob);
      setProfilePreview(url);
    } else if (purpose === 'about_image') {
      setPendingAboutImg(file);
      const url = URL.createObjectURL(croppedBlob);
      setAboutPreview(url);
    }
  }, [cropDialog]);

  const handleCvSelect = (file: File) => {
    setPendingCvFile(file);
    setCvFileName(file.name);
  };

  const handlePortfolioSelect = (file: File) => {
    setPendingPortfolioFile(file);
    setPortfolioFileName(file.name);
  };

  // ── Toggle section expand ──
  const toggleSection = (group: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  // ── Render: Admin gear button ──
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-navy-900 to-navy-800 text-gold shadow-lg shadow-navy-900/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-gold/20 border border-gold/30"
        aria-label="Admin"
        title={t('لوحة التحكم (Ctrl+Shift+A)', 'Admin Panel (Ctrl+Shift+A)')}
      >
        <Settings className="h-5 w-5" />
      </button>
    );
  }

  // ── Render: Login Screen ──
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-b from-navy-900 to-[#0A1D3A] p-8 backdrop-blur-sm text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-navy-800 border-2 border-gold/40 shadow-lg shadow-gold/10">
            <Lock className="h-9 w-9 text-gold" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{t('لوحة التحكم', 'Admin Panel')}</h3>
          <p className="text-sm text-white/50 mb-6">{t('أدخل كلمة المرور للدخول', 'Enter password to login')}</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder={t('كلمة المرور', 'Password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/30 h-11"
            />
            <Button
              type="submit"
              disabled={loginLoading}
              className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold h-11"
            >
              {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : t('دخول', 'Login')}
            </Button>
          </form>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 text-sm text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          >
            {t('إلغاء', 'Cancel')}
          </button>
        </div>
      </div>
    );
  }

  // ── Render: Dashboard ──
  return (
    <div className="fixed inset-0 z-[100] flex bg-black/70 backdrop-blur-md" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Image Crop Dialog */}
      {cropDialog && (
        <ImageCropDialog
          imageSrc={cropDialog.imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropDialog(null)}
          aspectRatio={cropDialog.aspectRatio}
          t={t}
        />
      )}

      <div className="flex h-full w-full max-w-[1400px] mx-auto my-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ background: 'linear-gradient(180deg, #0B2545 0%, #0A1D3A 100%)' }}
      >
        {/* ── Sidebar ── */}
        <div className="flex w-64 flex-col border-r border-white/10 bg-[#081B36]/50">
          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20">
              <Settings className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">{t('لوحة التحكم', 'Dashboard')}</h2>
              <p className="text-[10px] text-white/40">{t('إدارة الموقع', 'Site Manager')}</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#13315C transparent' }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setEditingItem(null); scrollRef.current?.scrollTo(0, 0); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gold/15 text-gold border border-gold/20'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-gold' : ''}`} />
                  {t(item.labelAr, item.labelEn)}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-white/10 p-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsLoggedIn(false);
                setPassword('');
                setContentLoaded(false);
                setPortfolioLoaded(false);
                setExperiencesLoaded(false);
                setClientsLoaded(false);
                setSkillsLoaded(false);
                setCoursesLoaded(false);
              }}
              className="w-full justify-start text-white/50 hover:text-white hover:bg-white/10"
            >
              <LogOut className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              {t('تسجيل الخروج', 'Logout')}
            </Button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
              {t('إغلاق', 'Close')}
            </button>
          </div>
        </div>

        {/* ── Main Content Area ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {(() => {
                const currentItem = sidebarItems.find(i => i.id === activeSection);
                const Icon = currentItem?.icon || FileText;
                return (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/15">
                      <Icon className="h-4 w-4 text-gold" />
                    </div>
                    <h3 className="text-base font-bold text-white">
                      {t(currentItem?.labelAr || '', currentItem?.labelEn || '')}
                    </h3>
                  </>
                );
              })()}
            </div>
            {activeSection === 'content' && contentLoaded && (
              <Button
                onClick={saveAllContent}
                disabled={saving}
                size="sm"
                className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />}
                {t('حفظ الكل', 'Save All')}
              </Button>
            )}
          </div>

          {/* Scrollable Content */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#13315C transparent' }}
          >
            {/* ────── CONTENT SECTION ────── */}
            {activeSection === 'content' && (
              <div className="p-6 space-y-4">
                {!contentLoaded ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    <p className="text-white/60">{t('جارٍ التحميل...', 'Loading...')}</p>
                  </div>
                ) : (
                  contentSections.map((section) => {
                    const SectionIcon = section.icon;
                    const isExpanded = expandedSections.has(section.group);
                    return (
                      <div key={section.group} className="rounded-xl border border-white/10 bg-white/[0.03]">
                        <button
                          onClick={() => toggleSection(section.group)}
                          className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <SectionIcon className="h-4 w-4 text-gold" />
                            <span className="text-sm font-semibold text-white">{t(section.labelAr, section.labelEn)}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-5 space-y-4">
                            {section.keys.map((keyObj) => (
                              <div key={keyObj.key}>
                                <label className="text-xs text-white/50 mb-1 block">{t(keyObj.labelAr, keyObj.labelEn)}</label>
                                {keyObj.key.includes('_ar') || keyObj.key === 'about_ar' || keyObj.key === 'education_ar' ? (
                                  <Textarea
                                    value={contentData[keyObj.key]?.valueAr || ''}
                                    onChange={(e) => setContentData(prev => ({ ...prev, [keyObj.key]: { ...prev[keyObj.key], valueAr: e.target.value } }))}
                                    className="border-white/15 bg-white/5 text-white text-sm min-h-[80px]"
                                    dir="rtl"
                                  />
                                ) : (
                                  <div className="grid grid-cols-2 gap-3">
                                    <Input
                                      value={contentData[keyObj.key]?.valueAr || ''}
                                      onChange={(e) => setContentData(prev => ({ ...prev, [keyObj.key]: { ...prev[keyObj.key], valueAr: e.target.value } }))}
                                      className="border-white/15 bg-white/5 text-white text-sm"
                                      dir="rtl"
                                      placeholder="عربي"
                                    />
                                    <Input
                                      value={contentData[keyObj.key]?.valueEn || ''}
                                      onChange={(e) => setContentData(prev => ({ ...prev, [keyObj.key]: { ...prev[keyObj.key], valueEn: e.target.value } }))}
                                      className="border-white/15 bg-white/5 text-white text-sm"
                                      dir="ltr"
                                      placeholder="English"
                                    />
                                  </div>
                                )}
                                <div className="flex justify-end mt-2">
                                  <Button onClick={() => saveContent(keyObj.key)} disabled={saving} size="sm" variant="ghost" className="text-gold/60 hover:text-gold text-xs">
                                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3 mr-1 ml-1" />}
                                    {t('حفظ', 'Save')}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ────── EXPERIENCES SECTION ────── */}
            {activeSection === 'experiences' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{t('إدارة الخبرات العملية', 'Manage work experiences')}</p>
                  <Button onClick={addExperience} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                    <Plus className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('إضافة خبرة', 'Add Experience')}
                  </Button>
                </div>
                {!experiencesLoaded ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    <p className="text-white/60">{t('جارٍ التحميل...', 'Loading...')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        {editingItem === exp.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">الشركة (عربي)</label>
                                <Input value={exp.companyAr} onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, companyAr: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="rtl" />
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Company (EN)</label>
                                <Input value={exp.companyEn} onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, companyEn: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="ltr" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">الوصف (عربي)</label>
                                <Textarea value={exp.descAr} onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, descAr: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm min-h-[60px]" dir="rtl" />
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Description (EN)</label>
                                <Textarea value={exp.descEn} onChange={(e) => setExperiences(prev => prev.map(x => x.id === exp.id ? { ...x, descEn: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm min-h-[60px]" dir="ltr" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <Button onClick={() => saveExperience(exp)} disabled={saving} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t('حفظ', 'Save')}
                              </Button>
                              <Button onClick={() => setEditingItem(null)} variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                                {t('إلغاء', 'Cancel')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="min-w-0">
                              <p className="font-medium text-white/90 text-sm">{exp.companyAr}</p>
                              <p className="text-xs text-white/50">{exp.companyEn}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button onClick={() => setEditingItem(exp.id)} variant="ghost" size="icon" className="text-white/40 hover:text-white h-8 w-8">
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                              <Button onClick={() => deleteExperience(exp.id)} variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400 h-8 w-8">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ────── CLIENTS SECTION ────── */}
            {activeSection === 'clients' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{t('إدارة العملاء', 'Manage clients')}</p>
                  <Button onClick={addClient} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                    <Plus className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('إضافة عميل', 'Add Client')}
                  </Button>
                </div>
                {!clientsLoaded ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    <p className="text-white/60">{t('جارٍ التحميل...', 'Loading...')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {clients.map((client) => (
                      <div key={client.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        {editingItem === client.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">الاسم (عربي)</label>
                                <Input value={client.nameAr} onChange={(e) => setClients(prev => prev.map(x => x.id === client.id ? { ...x, nameAr: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="rtl" />
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Name (EN)</label>
                                <Input value={client.nameEn} onChange={(e) => setClients(prev => prev.map(x => x.id === client.id ? { ...x, nameEn: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="ltr" />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <Button onClick={() => saveClient(client)} disabled={saving} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t('حفظ', 'Save')}
                              </Button>
                              <Button onClick={() => setEditingItem(null)} variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                                {t('إلغاء', 'Cancel')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="min-w-0">
                              <p className="font-medium text-white/90 text-sm">{client.nameAr}</p>
                              <p className="text-xs text-white/50">{client.nameEn}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button onClick={() => setEditingItem(client.id)} variant="ghost" size="icon" className="text-white/40 hover:text-white h-8 w-8">
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                              <Button onClick={() => deleteClient(client.id)} variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400 h-8 w-8">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ────── SKILLS SECTION ────── */}
            {activeSection === 'skills' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{t('إدارة المهارات', 'Manage skills')}</p>
                  <Button onClick={addSkill} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                    <Plus className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('إضافة مهارة', 'Add Skill')}
                  </Button>
                </div>
                {!skillsLoaded ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    <p className="text-white/60">{t('جارٍ التحميل...', 'Loading...')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skills.map((skill) => (
                      <div key={skill.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        {editingItem === skill.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">المهارة (عربي)</label>
                                <Input value={skill.titleAr} onChange={(e) => setSkills(prev => prev.map(x => x.id === skill.id ? { ...x, titleAr: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="rtl" />
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Skill (EN)</label>
                                <Input value={skill.titleEn} onChange={(e) => setSkills(prev => prev.map(x => x.id === skill.id ? { ...x, titleEn: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="ltr" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="text-xs text-white/50">{t('المستوى', 'Level')}:</label>
                              <input type="range" min="10" max="100" value={skill.level} onChange={(e) => setSkills(prev => prev.map(x => x.id === skill.id ? { ...x, level: Number(e.target.value) } : x))} className="flex-1 accent-[#C9A84C]" />
                              <span className="text-xs text-gold font-bold w-8">{skill.level}%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="text-xs text-white/50">{t('الفئة', 'Category')}:</label>
                              <select value={skill.category} onChange={(e) => setSkills(prev => prev.map(x => x.id === skill.id ? { ...x, category: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm rounded-md h-9 px-3">
                                <option value="design">{t('تصميم', 'Design')}</option>
                                <option value="marketing">{t('تسويق', 'Marketing')}</option>
                                <option value="tech">{t('تقنية', 'Tech')}</option>
                              </select>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <Button onClick={() => saveSkill(skill)} disabled={saving} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t('حفظ', 'Save')}
                              </Button>
                              <Button onClick={() => setEditingItem(null)} variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                                {t('إلغاء', 'Cancel')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15">
                                {(() => { const Ic = iconMap[skill.icon || ''] || Award; return <Ic className="h-4 w-4 text-gold" />; })()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-white/90 text-sm">{skill.titleAr}</p>
                                <p className="text-xs text-white/50">{skill.titleEn}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className="text-[10px] bg-white/10 text-white/60 border-0 hover:bg-white/15">
                                {skill.level}%
                              </Badge>
                              <Button onClick={() => setEditingItem(skill.id)} variant="ghost" size="icon" className="text-white/40 hover:text-white h-8 w-8">
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                              <Button onClick={() => deleteSkill(skill.id)} variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400 h-8 w-8">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ────── COURSES SECTION ────── */}
            {activeSection === 'courses' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{t('إدارة الدورات والشهادات', 'Manage courses & certificates')}</p>
                  <Button onClick={addCourse} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                    <Plus className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('إضافة دورة', 'Add Course')}
                  </Button>
                </div>
                {!coursesLoaded ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    <p className="text-white/60">{t('جارٍ التحميل...', 'Loading...')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courses.map((course) => (
                      <div key={course.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        {editingItem === course.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">الدورة (عربي)</label>
                                <Input value={course.titleAr} onChange={(e) => setCourses(prev => prev.map(x => x.id === course.id ? { ...x, titleAr: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="rtl" />
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Course (EN)</label>
                                <Input value={course.titleEn} onChange={(e) => setCourses(prev => prev.map(x => x.id === course.id ? { ...x, titleEn: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="ltr" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={course.visible} onChange={(e) => setCourses(prev => prev.map(x => x.id === course.id ? { ...x, visible: e.target.checked } : x))} className="rounded border-white/30 bg-white/10 text-gold focus:ring-gold/30" />
                                <span className="text-xs text-white/50">{t('مرئي', 'Visible')}</span>
                              </label>
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <Button onClick={() => saveCourse(course)} disabled={saving} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t('حفظ', 'Save')}
                              </Button>
                              <Button onClick={() => setEditingItem(null)} variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                                {t('إلغاء', 'Cancel')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15">
                                {(() => { const Ic = iconMap[course.icon || ''] || BookOpen; return <Ic className="h-4 w-4 text-gold" />; })()}
                              </div>
                              <div>
                                <p className="font-medium text-white/90 text-sm">{course.titleAr}</p>
                                <p className="text-xs text-white/50">{course.titleEn}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button onClick={() => setEditingItem(course.id)} variant="ghost" size="icon" className="text-white/40 hover:text-white h-8 w-8">
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                              <Button onClick={() => deleteCourse(course.id)} variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400 h-8 w-8">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ────── PORTFOLIO SECTION ────── */}
            {activeSection === 'portfolio' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/50">{t('إدارة أعمال معرض الأعمال', 'Manage portfolio items')}</p>
                  <Button onClick={addPortfolioItem} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                    <Plus className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                    {t('إضافة عمل', 'Add Item')}
                  </Button>
                </div>
                {!portfolioLoaded ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-gold" />
                    <p className="text-white/60">{t('جارٍ التحميل...', 'Loading...')}</p>
                  </div>
                ) : portfolioItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <ImageIcon className="h-12 w-12 text-white/20" />
                    <p className="text-white/40">{t('لا توجد أعمال بعد', 'No portfolio items yet')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {portfolioItems.map((item) => (
                      <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        {editingItem === item.id ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">العنوان (عربي)</label>
                                <Input value={item.titleAr} onChange={(e) => setPortfolioItems(prev => prev.map(x => x.id === item.id ? { ...x, titleAr: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="rtl" />
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Title (EN)</label>
                                <Input value={item.titleEn} onChange={(e) => setPortfolioItems(prev => prev.map(x => x.id === item.id ? { ...x, titleEn: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="ltr" />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">{t('الفئة', 'Category')}</label>
                                <select value={item.category} onChange={(e) => setPortfolioItems(prev => prev.map(x => x.id === item.id ? { ...x, category: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm rounded-md h-9 px-3">
                                  <option value="posts">{t('بوستات', 'Posts')}</option>
                                  <option value="profiles">{t('بروفايلات', 'Profiles')}</option>
                                  <option value="websites">{t('مواقع', 'Websites')}</option>
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-white/50 mb-1 block">رابط الصورة</label>
                                <Input value={item.imageUrl} onChange={(e) => setPortfolioItems(prev => prev.map(x => x.id === item.id ? { ...x, imageUrl: e.target.value } : x))} className="border-white/15 bg-white/5 text-white text-sm h-9" dir="ltr" />
                              </div>
                            </div>
                            {item.imageUrl && item.imageUrl !== '/placeholder.jpg' && (
                              <div className="mt-2">
                                <img src={item.imageUrl} alt={item.titleAr} className="h-20 w-auto rounded-lg object-cover border border-white/10" />
                              </div>
                            )}
                            <div className="flex items-center gap-2 justify-end">
                              <Button onClick={() => savePortfolioItem(item)} disabled={saving} size="sm" className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {t('حفظ', 'Save')}
                              </Button>
                              <Button onClick={() => setEditingItem(null)} variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/10">
                                {t('إلغاء', 'Cancel')}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 flex items-center justify-center">
                                {item.imageUrl && item.imageUrl !== '/placeholder.jpg' ? (
                                  <img src={item.imageUrl} alt={item.titleAr} className="h-full w-full object-cover" />
                                ) : (
                                  <ImageIcon className="h-5 w-5 text-white/30" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-white/90 text-sm truncate">{item.titleAr}</p>
                                <p className="text-xs text-white/50 truncate">{item.titleEn}</p>
                                <Badge className="mt-1 text-[10px] bg-white/10 text-white/60 border-0 hover:bg-white/15">
                                  {item.category === 'posts' ? t('بوستات', 'Posts') : item.category === 'profiles' ? t('بروفايلات', 'Profiles') : t('مواقع', 'Websites')}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button onClick={() => setEditingItem(item.id)} variant="ghost" size="icon" className="text-white/40 hover:text-white h-8 w-8">
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                              <Button onClick={() => deletePortfolioItem(item.id)} variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400 h-8 w-8">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ────── FILES SECTION ────── */}
            {activeSection === 'files' && (
              <div className="p-6 space-y-4">
                <p className="text-sm text-white/50 mb-2">{t('رفع واستبدال ملفات الموقع', 'Upload and replace site files')}</p>

                {/* Profile Image */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15">
                      <ImageIcon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{t('الصورة الشخصية', 'Profile Image')}</h4>
                      <p className="text-xs text-white/40">{t('ستظهر في قسم Hero', 'Appears in Hero section')}</p>
                    </div>
                  </div>
                  {/* Current image preview */}
                  {(profilePreview || currentProfileImg) && (
                    <div className="mb-4 flex items-center gap-3">
                      <img
                        src={profilePreview || currentProfileImg}
                        alt="profile"
                        className="h-16 w-16 rounded-full object-cover border-2 border-gold/30"
                      />
                      <span className="text-xs text-green-400/80 flex items-center gap-1">
                        <Check className="h-3 w-3" /> {t('صورة حالية', 'Current image')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageSelectWithCrop(file, 'profile_image', 1); }}
                      className="flex-1 border-white/15 bg-white/5 text-white text-sm file:text-white/60 file:border-0 file:bg-white/10 file:hover:bg-white/20 file:cursor-pointer"
                    />
                    <Button
                      onClick={() => { if (pendingProfileImg) uploadFile(pendingProfileImg, 'profile_image'); }}
                      disabled={!pendingProfileImg || uploading}
                      size="sm"
                      className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold min-w-[100px]"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />}
                      {t('حفظ الصورة', 'Save Image')}
                    </Button>
                  </div>
                </div>

                {/* About Image */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15">
                      <ImageIcon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{t('صورة قسم نبذة عني', 'About Section Image')}</h4>
                      <p className="text-xs text-white/40">{t('ستظهر في قسم نبذة عني', 'Appears in About Me section')}</p>
                    </div>
                  </div>
                  {/* Current image preview */}
                  {(aboutPreview || currentAboutImg) && (
                    <div className="mb-4 flex items-center gap-3">
                      <img
                        src={aboutPreview || currentAboutImg}
                        alt="about"
                        className="h-16 w-16 rounded-full object-cover border-2 border-gold/30"
                      />
                      <span className="text-xs text-green-400/80 flex items-center gap-1">
                        <Check className="h-3 w-3" /> {t('صورة حالية', 'Current image')}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageSelectWithCrop(file, 'about_image', 1); }}
                      className="flex-1 border-white/15 bg-white/5 text-white text-sm file:text-white/60 file:border-0 file:bg-white/10 file:hover:bg-white/20 file:cursor-pointer"
                    />
                    <Button
                      onClick={() => { if (pendingAboutImg) uploadFile(pendingAboutImg, 'about_image'); }}
                      disabled={!pendingAboutImg || uploading}
                      size="sm"
                      className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold min-w-[100px]"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />}
                      {t('حفظ الصورة', 'Save Image')}
                    </Button>
                  </div>
                </div>

                {/* CV File */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15">
                      <FileText className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{t('السيرة الذاتية (PDF)', 'CV File (PDF)')}</h4>
                      <p className="text-xs text-white/40">{t('يظهر عند الضغط على زر تحميل CV', 'Appears on Download CV click')}</p>
                    </div>
                  </div>
                  {currentCvFile && (
                    <div className="mb-3 flex items-center gap-2">
                      <a href={currentCvFile} target="_blank" className="text-xs text-blue-400/80 flex items-center gap-1 hover:text-blue-300">
                        <Eye className="h-3 w-3" /> {t('عرض الملف الحالي', 'View current file')}
                      </a>
                    </div>
                  )}
                  {cvFileName && (
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold/60" />
                      <span className="text-xs text-white/70">{cvFileName}</span>
                      <span className="text-[10px] text-gold/60 bg-gold/10 px-2 py-0.5 rounded">{t('جاهز للحفظ', 'Ready to save')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) handleCvSelect(file); }}
                      className="flex-1 border-white/15 bg-white/5 text-white text-sm file:text-white/60 file:border-0 file:bg-white/10 file:hover:bg-white/20 file:cursor-pointer"
                    />
                    <Button
                      onClick={() => { if (pendingCvFile) uploadFile(pendingCvFile, 'cv_file'); }}
                      disabled={!pendingCvFile || uploading}
                      size="sm"
                      className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold min-w-[100px]"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />}
                      {t('حفظ الملف', 'Save File')}
                    </Button>
                  </div>
                </div>

                {/* Portfolio File */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15">
                      <Upload className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{t('ملف الأعمال (PDF)', 'Portfolio File (PDF)')}</h4>
                      <p className="text-xs text-white/40">{t('ملف تعريفي لجميع الأعمال', 'Complete portfolio file')}</p>
                    </div>
                  </div>
                  {currentPortfolioFile && (
                    <div className="mb-3 flex items-center gap-2">
                      <a href={currentPortfolioFile} target="_blank" className="text-xs text-blue-400/80 flex items-center gap-1 hover:text-blue-300">
                        <Eye className="h-3 w-3" /> {t('عرض الملف الحالي', 'View current file')}
                      </a>
                    </div>
                  )}
                  {portfolioFileName && (
                    <div className="mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gold/60" />
                      <span className="text-xs text-white/70">{portfolioFileName}</span>
                      <span className="text-[10px] text-gold/60 bg-gold/10 px-2 py-0.5 rounded">{t('جاهز للحفظ', 'Ready to save')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => { const file = e.target.files?.[0]; if (file) handlePortfolioSelect(file); }}
                      className="flex-1 border-white/15 bg-white/5 text-white text-sm file:text-white/60 file:border-0 file:bg-white/10 file:hover:bg-white/20 file:cursor-pointer"
                    />
                    <Button
                      onClick={() => { if (pendingPortfolioFile) uploadFile(pendingPortfolioFile, 'portfolio_file'); }}
                      disabled={!pendingPortfolioFile || uploading}
                      size="sm"
                      className="bg-gradient-to-r from-gold to-gold-light text-navy-900 hover:opacity-90 font-bold min-w-[100px]"
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />}
                      {t('حفظ الملف', 'Save File')}
                    </Button>
                  </div>
                </div>

                {/* Supabase Info */}
                <div className="rounded-xl border border-gold/20 bg-gold/[0.05] p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15">
                      <Globe className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{t('ربط Supabase', 'Connect Supabase')}</h4>
                      <p className="text-xs text-white/40">{t('لربط حسابك في Supabase', 'To connect your Supabase account')}</p>
                    </div>
                  </div>
                  <div className="text-xs text-white/50 space-y-1">
                    <p>1. {t('اذهب إلى', 'Go to')} <a href="https://supabase.com/dashboard/project/adnqpnsyiatdohljwquz/settings/api" target="_blank" className="text-blue-400 hover:text-blue-300 underline">Supabase Dashboard → Settings → API</a></p>
                    <p>2. {t('انسخ المفاتيح وضعها في ملف .env', 'Copy the keys and add them to .env file')}</p>
                    <p>3. {t('أعد تشغيل السيرفر', 'Restart the server')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
