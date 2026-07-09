'use client';

import { useState, useCallback, useRef } from 'react';
import { uploadFileDirect } from '@/lib/upload-client';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  X,
  Lock,
  Upload,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Loader2,
  Plus,
  Trash2,
  Save,
  Briefcase,
  Users,
  BookOpen,
  BarChart3,
  FolderOpen,
  Crop,
  Camera,
  FileUp,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReactCrop, { type Crop as CropType, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// ─── Color Constants ───
const NAVY_900 = '#0B2545';
const NAVY_800 = '#13315C';
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#D4BC6A';

// ─── Image Crop Dialog ───
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
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setProcessing(false); return; }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    canvas.toBlob(
      (blob) => {
        if (blob) onCropComplete(blob);
        setProcessing(false);
      },
      'image/jpeg',
      0.92
    );
  }, [completedCrop, onCropComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl" style={{ background: NAVY_900 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">{t('قص الصورة', 'Crop Image')}</h3>
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
            <img ref={imgRef} src={imageSrc} alt="Crop" className="max-w-full" style={{ maxHeight: '50vh' }} />
          </ReactCrop>
        </div>
        <div className="flex items-center justify-end gap-3">
          <Button onClick={onCancel} variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 cursor-pointer">
            {t('إلغاء', 'Cancel')}
          </Button>
          <Button
            onClick={handleCropAndSave}
            disabled={!completedCrop || processing}
            className="font-bold text-white cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
          >
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crop className="h-4 w-4 mr-2" />}
            {t('قص وحفظ', 'Crop & Save')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Types ───
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
  descriptionAr?: string;
  descriptionEn?: string;
  projectUrl?: string;
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

// ─── Sidebar Navigation Items ───
type SectionKey = 'files' | 'content' | 'experience' | 'clients' | 'skills' | 'courses' | 'portfolio' | 'settings';

interface NavItem {
  key: SectionKey;
  labelAr: string;
  labelEn: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'files', labelAr: 'الملفات', labelEn: 'Files', icon: <FileUp className="h-5 w-5" /> },
  { key: 'content', labelAr: 'المحتوى', labelEn: 'Content', icon: <Edit3 className="h-5 w-5" /> },
  { key: 'experience', labelAr: 'الخبرات', labelEn: 'Experience', icon: <Briefcase className="h-5 w-5" /> },
  { key: 'clients', labelAr: 'العملاء', labelEn: 'Clients', icon: <Users className="h-5 w-5" /> },
  { key: 'skills', labelAr: 'المهارات', labelEn: 'Skills', icon: <BarChart3 className="h-5 w-5" /> },
  { key: 'courses', labelAr: 'الدورات', labelEn: 'Courses', icon: <BookOpen className="h-5 w-5" /> },
  { key: 'portfolio', labelAr: 'المعرض', labelEn: 'Portfolio', icon: <FolderOpen className="h-5 w-5" /> },
  { key: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

// ─── Save Button Component ───
function GoldSaveButton({
  onClick,
  loading,
  labelAr = 'حفظ',
  labelEn = 'Save',
  t,
}: {
  onClick: () => void;
  loading?: boolean;
  labelAr?: string;
  labelEn?: string;
  t: (ar: string, en: string) => string;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className="font-bold px-6 py-2 rounded-lg shadow-lg transition-all hover:scale-105 cursor-pointer"
      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
      {t(labelAr, labelEn)}
    </Button>
  );
}

// ─── Section Card Wrapper ───
function SectionCard({
  title,
  children,
  t,
  titleAr,
  titleEn,
}: {
  title?: string;
  titleAr: string;
  titleEn: string;
  children: React.ReactNode;
  t: (ar: string, en: string) => string;
}) {
  return (
    <Card className="border-white/10 mb-6" style={{ background: NAVY_800 }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg">{t(titleAr, titleEn)}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

// ─── Main Admin Panel ───
export default function AdminPanel() {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();

  // ── Panel State ──
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('files');

  // ── Data State ──
  const [content, setContent] = useState<ContentItem[]>([]);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemData[]>([]);

  // ── Loading States ──
  const [contentLoaded, setContentLoaded] = useState(false);
  const [experiencesLoaded, setExperiencesLoaded] = useState(false);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [skillsLoaded, setSkillsLoaded] = useState(false);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);

  // ── Saving States ──
  const [savingContentKey, setSavingContentKey] = useState<string | null>(null);
  const [savingExperience, setSavingExperience] = useState<string | null>(null);
  const [savingClient, setSavingClient] = useState<string | null>(null);
  const [savingSkill, setSavingSkill] = useState<string | null>(null);
  const [savingCourse, setSavingCourse] = useState<string | null>(null);
  const [savingPortfolio, setSavingPortfolio] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  // ── Crop State ──
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropCallback, setCropCallback] = useState<((blob: Blob) => void) | null>(null);

  // ── Edit State for collections ──
  const [editingExperience, setEditingExperience] = useState<ExperienceData | null>(null);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<PortfolioItemData | null>(null);

  // ── Portfolio Sub-tab ──
  const [portfolioSubTab, setPortfolioSubTab] = useState<'posts' | 'profiles' | 'websites'>('posts');

  // ── Settings / Password Change State ──
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changingPwd, setChangingPwd] = useState(false);

  // ── File Input Refs ──
  const profileImageRef = useRef<HTMLInputElement>(null);
  const aboutImageRef = useRef<HTMLInputElement>(null);
  const cvFileRef = useRef<HTMLInputElement>(null);
  const portfolioFileRef = useRef<HTMLInputElement>(null);
  const clientLogoRef = useRef<HTMLInputElement>(null);
  const portfolioImageRef = useRef<HTMLInputElement>(null);

  // ── Content edit state ──
  const [contentEdits, setContentEdits] = useState<Record<string, { valueAr: string; valueEn: string }>>({});

  // ─── Helper: Get content value ───
  const getContentValue = useCallback((key: string, lang: 'ar' | 'en') => {
    const edit = contentEdits[key];
    if (edit) return lang === 'ar' ? edit.valueAr : edit.valueEn;
    const item = content.find((c) => c.key === key);
    return item ? (lang === 'ar' ? (item.valueAr || '') : (item.valueEn || '')) : '';
  }, [content, contentEdits]);

  // ─── Helper: Set content edit ───
  const setContentEdit = useCallback((key: string, lang: 'ar' | 'en', value: string) => {
    setContentEdits((prev) => ({
      ...prev,
      [key]: {
        valueAr: lang === 'ar' ? value : (prev[key]?.valueAr ?? getContentValue(key, 'ar')),
        valueEn: lang === 'en' ? value : (prev[key]?.valueEn ?? getContentValue(key, 'en')),
      },
    }));
  }, [getContentValue]);

  // ─── API Helpers ───
  // Upload directly from browser → Supabase Storage (bypasses Vercel 4.5 MB body limit)
  const uploadFile = useCallback(async (file: File | Blob, purpose: string, originalName?: string): Promise<string | null> => {
    try {
      const result = await uploadFileDirect(file, purpose, originalName);
      return result.url;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown upload error';
      console.error('[uploadFile] error:', errorMsg);
      toast({
        title: t('خطأ في الرفع', 'Upload Error'),
        description: errorMsg,
        variant: 'destructive',
      });
      return null;
    }
  }, [toast, t]);

  const saveContent = useCallback(async (key: string, valueAr: string, valueEn: string, type: string = 'text') => {
    setSavingContentKey(key);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, valueAr, valueEn, type }),
      });
      if (!res.ok) throw new Error('Save failed');
      // Re-fetch to verify
      const contentRes = await fetch('/api/content');
      if (contentRes.ok) {
        const fresh = await contentRes.json();
        setContent(fresh);
      }
      // Clear edit state for this key
      setContentEdits((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      toast({ title: t('تم الحفظ', 'Saved'), description: t('تم حفظ المحتوى بنجاح', 'Content saved successfully') });
    } catch (err) {
      console.error('Save content error:', err);
      toast({ title: t('خطأ', 'Error'), description: t('فشل حفظ المحتوى', 'Failed to save content'), variant: 'destructive' });
    } finally {
      setSavingContentKey(null);
    }
  }, [toast, t]);

  // ─── Data Fetching ───
  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error('Fetch content error:', err);
    } finally {
      setContentLoaded(true);
    }
  }, []);

  const fetchExperiences = useCallback(async () => {
    try {
      const res = await fetch('/api/experience');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error('Fetch experiences error:', err);
    } finally {
      setExperiencesLoaded(true);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error('Fetch clients error:', err);
    } finally {
      setClientsLoaded(true);
    }
  }, []);

  const fetchSkills = useCallback(async () => {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Fetch skills error:', err);
    } finally {
      setSkillsLoaded(true);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (err) {
      console.error('Fetch courses error:', err);
    } finally {
      setCoursesLoaded(true);
    }
  }, []);

  const fetchPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolioItems(data);
      }
    } catch (err) {
      console.error('Fetch portfolio error:', err);
    } finally {
      setPortfolioLoaded(true);
    }
  }, []);

  // ─── Auth ───
  const handleLogin = async () => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        // Fetch all data
        await Promise.all([fetchContent(), fetchExperiences(), fetchClients(), fetchSkills(), fetchCourses(), fetchPortfolio()]);
      } else {
        toast({ title: t('خطأ', 'Error'), description: t('كلمة المرور غير صحيحة', 'Incorrect password'), variant: 'destructive' });
      }
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل تسجيل الدخول', 'Login failed'), variant: 'destructive' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setContentLoaded(false);
    setExperiencesLoaded(false);
    setClientsLoaded(false);
    setSkillsLoaded(false);
    setCoursesLoaded(false);
    setPortfolioLoaded(false);
  };

  // ─── File Upload with Crop ───
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, contentKey: string, purpose: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropCallback(() => async (blob: Blob) => {
        setCropImageSrc(null);
        setCropCallback(null);
        setUploadingFile(contentKey);
        // Pass original file name so the extension is correct after crop
        const url = await uploadFile(blob, purpose, `crop_${contentKey}.jpg`);
        if (url) {
          await saveContent(contentKey, url, url, 'file');
        }
        setUploadingFile(null);
      });
    };
    reader.readAsDataURL(file);
  };

  // ─── File Upload without Crop ───
  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, contentKey: string, purpose: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingFile(contentKey);
    const url = await uploadFile(file, purpose);
    if (url) {
      await saveContent(contentKey, url, url, 'file');
    }
    setUploadingFile(null);
  };

  // ─── Experience CRUD ───
  const saveExperience = async (data: Omit<ExperienceData, 'id'> & { id?: string }) => {
    const isEdit = !!data.id;
    setSavingExperience(data.id || 'new');
    try {
      const url = isEdit ? `/api/experience/${data.id}` : '/api/experience';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyAr: data.companyAr,
          companyEn: data.companyEn,
          descAr: data.descAr,
          descEn: data.descEn,
          visible: data.visible,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchExperiences();
      setEditingExperience(null);
      toast({ title: t('تم الحفظ', 'Saved'), description: t('تم حفظ الخبرة بنجاح', 'Experience saved successfully') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل حفظ الخبرة', 'Failed to save experience'), variant: 'destructive' });
    } finally {
      setSavingExperience(null);
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?'))) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchExperiences();
      toast({ title: t('تم الحذف', 'Deleted'), description: t('تم حذف الخبرة', 'Experience deleted') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل الحذف', 'Failed to delete'), variant: 'destructive' });
    }
  };

  // ─── Client CRUD ───
  const saveClient = async (data: Omit<ClientData, 'id'> & { id?: string }) => {
    const isEdit = !!data.id;
    setSavingClient(data.id || 'new');
    try {
      const url = isEdit ? `/api/clients/${data.id}` : '/api/clients';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: data.nameAr,
          nameEn: data.nameEn,
          logoUrl: data.logoUrl,
          visible: data.visible,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchClients();
      setEditingClient(null);
      toast({ title: t('تم الحفظ', 'Saved'), description: t('تم حفظ العميل بنجاح', 'Client saved successfully') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل حفظ العميل', 'Failed to save client'), variant: 'destructive' });
    } finally {
      setSavingClient(null);
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?'))) return;
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchClients();
      toast({ title: t('تم الحذف', 'Deleted'), description: t('تم حذف العميل', 'Client deleted') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل الحذف', 'Failed to delete'), variant: 'destructive' });
    }
  };

  // ─── Skill CRUD ───
  const saveSkill = async (data: Omit<SkillData, 'id'> & { id?: string }) => {
    const isEdit = !!data.id;
    setSavingSkill(data.id || 'new');
    try {
      const url = isEdit ? `/api/skills/${data.id}` : '/api/skills';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          descAr: data.descAr,
          descEn: data.descEn,
          icon: data.icon,
          level: data.level,
          category: data.category,
          visible: data.visible,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchSkills();
      setEditingSkill(null);
      toast({ title: t('تم الحفظ', 'Saved'), description: t('تم حفظ المهارة بنجاح', 'Skill saved successfully') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل حفظ المهارة', 'Failed to save skill'), variant: 'destructive' });
    } finally {
      setSavingSkill(null);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?'))) return;
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchSkills();
      toast({ title: t('تم الحذف', 'Deleted'), description: t('تم حذف المهارة', 'Skill deleted') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل الحذف', 'Failed to delete'), variant: 'destructive' });
    }
  };

  // ─── Course CRUD ───
  const saveCourse = async (data: Omit<CourseData, 'id'> & { id?: string }) => {
    const isEdit = !!data.id;
    setSavingCourse(data.id || 'new');
    try {
      const url = isEdit ? `/api/courses/${data.id}` : '/api/courses';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          icon: data.icon,
          visible: data.visible,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      await fetchCourses();
      setEditingCourse(null);
      toast({ title: t('تم الحفظ', 'Saved'), description: t('تم حفظ الدورة بنجاح', 'Course saved successfully') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل حفظ الدورة', 'Failed to save course'), variant: 'destructive' });
    } finally {
      setSavingCourse(null);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?'))) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchCourses();
      toast({ title: t('تم الحذف', 'Deleted'), description: t('تم حذف الدورة', 'Course deleted') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل الحذف', 'Failed to delete'), variant: 'destructive' });
    }
  };

  // ─── Portfolio CRUD ───
  const savePortfolio = async (data: Omit<PortfolioItemData, 'id'> & { id?: string }) => {
    // Client-side validation
    if (!data.titleAr || data.titleAr.trim() === '') {
      toast({ title: t('خطأ', 'Error'), description: t('العنوان بالعربية مطلوب', 'Arabic title is required'), variant: 'destructive' });
      return;
    }
    if (!data.titleEn || data.titleEn.trim() === '') {
      toast({ title: t('خطأ', 'Error'), description: t('العنوان بالإنجليزية مطلوب', 'English title is required'), variant: 'destructive' });
      return;
    }

    const isEdit = !!data.id;
    setSavingPortfolio(data.id || 'new');
    try {
      const url = isEdit ? `/api/portfolio/${data.id}` : '/api/portfolio';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: data.titleAr.trim(),
          titleEn: data.titleEn.trim(),
          category: data.category,
          imageUrl: data.imageUrl || '',
          descriptionAr: data.descriptionAr || '',
          descriptionEn: data.descriptionEn || '',
          projectUrl: data.projectUrl || '',
          order: data.order ?? 0,
          visible: data.visible,
        }),
      });
      if (!res.ok) {
        let errorMsg = t('فشل حفظ عنصر المعرض', 'Failed to save portfolio item');
        try {
          const errData = await res.json();
          errorMsg = errData.error || errData.detail || `HTTP ${res.status}`;
        } catch { /* ignore json parse error */ }
        throw new Error(errorMsg);
      }
      await fetchPortfolio();
      setEditingPortfolio(null);
      toast({ title: t('تم الحفظ', 'Saved'), description: t('تم حفظ عنصر المعرض بنجاح', 'Portfolio item saved successfully') });
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('فشل حفظ عنصر المعرض', 'Failed to save portfolio item');
      toast({ title: t('خطأ', 'Error'), description: msg, variant: 'destructive' });
    } finally {
      setSavingPortfolio(null);
    }
  };

  const deletePortfolio = async (id: string) => {
    if (!confirm(t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete?'))) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      await fetchPortfolio();
      toast({ title: t('تم الحذف', 'Deleted'), description: t('تم حذف عنصر المعرض', 'Portfolio item deleted') });
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('فشل الحذف', 'Failed to delete'), variant: 'destructive' });
    }
  };

  // ─── Client Logo Upload ───
  const handleClientLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, clientId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const url = await uploadFile(file, 'client_logo');
    if (url && editingClient) {
      setEditingClient({ ...editingClient, logoUrl: url });
    } else if (url) {
      // Direct update
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        await fetch(`/api/clients/${clientId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...client, logoUrl: url }),
        });
        await fetchClients();
      }
    }
  };

  // ─── Portfolio Image Upload ───
  const handlePortfolioImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const url = await uploadFile(file, 'portfolio_image', file.name);
    if (url && editingPortfolio) {
      setEditingPortfolio({ ...editingPortfolio, imageUrl: url });
    }
  };

  // ─── Content fields configuration ───
  const CONTENT_FIELDS = [
    { key: 'hero_name_ar', labelAr: 'الاسم الكامل', labelEn: 'Full Name', type: 'text' },
    { key: 'hero_title_ar', labelAr: 'المسمى الوظيفي', labelEn: 'Job Title', type: 'text' },
    { key: 'hero_tagline_ar', labelAr: 'الشعار / التاقلاين', labelEn: 'Tagline', type: 'textarea' },
    { key: 'about_ar', labelAr: 'نص نبذة عني', labelEn: 'About Text', type: 'textarea' },
    { key: 'education_ar', labelAr: 'المؤهل العلمي', labelEn: 'Education', type: 'text' },
    { key: 'about_age', labelAr: 'العمر', labelEn: 'Age', type: 'text' },
    { key: 'about_nationality', labelAr: 'الجنسية', labelEn: 'Nationality', type: 'text' },
    { key: 'about_status', labelAr: 'الحالة الاجتماعية', labelEn: 'Status', type: 'text' },
    { key: 'about_availability', labelAr: 'التوفر للعمل', labelEn: 'Availability', type: 'text' },
    { key: 'about_location', labelAr: 'الموقع الجغرافي', labelEn: 'Location', type: 'text' },
    { key: 'contact_phone', labelAr: 'رقم الهاتف', labelEn: 'Contact Phone', type: 'text' },
    { key: 'contact_email', labelAr: 'البريد الإلكتروني', labelEn: 'Contact Email', type: 'text' },
    { key: 'contact_location', labelAr: 'الموقع (تواصل)', labelEn: 'Location (Contact)', type: 'text' },
    { key: 'stats_experience', labelAr: 'سنوات الخبرة', labelEn: 'Years Experience', type: 'text' },
    { key: 'stats_projects', labelAr: 'عدد المشاريع', labelEn: 'Projects Count', type: 'text' },
    { key: 'stats_clients', labelAr: 'عدد العملاء', labelEn: 'Clients Count', type: 'text' },
    { key: 'stats_campaigns', labelAr: 'الحملات الإعلانية', labelEn: 'Ad Campaigns', type: 'text' },
  ];

  // ─── Get current file URL from content ───
  const getFileUrl = (key: string) => {
    const item = content.find((c) => c.key === key);
    return item?.valueAr || '';
  };

  // ─── Render: Login Screen ───
  const renderLogin = () => (
    <div className="flex items-center justify-center h-full p-6">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
          <Lock className="h-8 w-8" style={{ color: NAVY_900 }} />
        </div>
        <h2 className="text-2xl font-bold text-white">{t('لوحة الإدارة', 'Admin Panel')}</h2>
        <p className="text-white/50 text-sm">{t('أدخل كلمة المرور للدخول', 'Enter password to login')}</p>
        <div className="space-y-3">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder={t('كلمة المرور', 'Password')}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-center"
          />
          <Button
            onClick={handleLogin}
            disabled={authLoading}
            className="w-full font-bold cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
          >
            {authLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : t('دخول', 'Login')}
          </Button>
        </div>
      </div>
    </div>
  );

  // ─── Render: Sidebar ───
  const renderSidebar = () => (
    <div
      className="w-56 flex-shrink-0 flex flex-col h-full border-e border-white/10"
      style={{ background: NAVY_900 }}
    >
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold" style={{ color: GOLD }}>{t('لوحة الإدارة', 'Admin Panel')}</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all cursor-pointer ${
              activeSection === item.key
                ? 'text-white border-e-2'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
            style={activeSection === item.key ? { borderColor: GOLD, background: 'rgba(201, 168, 76, 0.1)' } : {}}
          >
            {item.icon}
            <span>{t(item.labelAr, item.labelEn)}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
        >
          <LogOut className="h-4 w-4 me-2" />
          {t('تسجيل الخروج', 'Logout')}
        </Button>
      </div>
    </div>
  );

  // ─── Render: Files Section ───
  const renderFilesSection = () => {
    const files = [
      {
        key: 'profile_image',
        labelAr: 'صورة الملف الشخصي (البطل)',
        labelEn: 'Profile Image (Hero)',
        purpose: 'profile_image',
        ref: profileImageRef,
        isImage: true,
        hasCrop: true,
        icon: <Camera className="h-5 w-5" style={{ color: GOLD }} />,
      },
      {
        key: 'about_image',
        labelAr: 'صورة قسم نبذة عني',
        labelEn: 'About Section Image',
        purpose: 'about_image',
        ref: aboutImageRef,
        isImage: true,
        hasCrop: true,
        icon: <ImageIcon className="h-5 w-5" style={{ color: GOLD }} />,
      },
      {
        key: 'cv_file',
        labelAr: 'ملف السيرة الذاتية (PDF)',
        labelEn: 'CV File (PDF)',
        purpose: 'cv_file',
        ref: cvFileRef,
        isImage: false,
        hasCrop: false,
        icon: <FileText className="h-5 w-5" style={{ color: GOLD }} />,
      },
      {
        key: 'portfolio_file',
        labelAr: 'ملف أعمالي (PDF)',
        labelEn: 'Portfolio File (PDF)',
        purpose: 'portfolio_file',
        ref: portfolioFileRef,
        isImage: false,
        hasCrop: false,
        icon: <FileText className="h-5 w-5" style={{ color: GOLD }} />,
      },
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-6">{t('إدارة الملفات', 'File Management')}</h3>
        {files.map((file) => {
          const currentUrl = getFileUrl(file.key);
          const isUploading = uploadingFile === file.key;
          return (
            <Card key={file.key} className="border-white/10" style={{ background: NAVY_800 }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}15` }}>
                    {file.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <Label className="text-white font-medium">{t(file.labelAr, file.labelEn)}</Label>
                      <p className="text-white/40 text-xs mt-1">
                        {file.hasCrop ? t('سيتم قص الصورة بنسبة 1:1', 'Image will be cropped at 1:1 ratio') : file.isImage ? t('ارفع صورة', 'Upload an image') : t('ارفع ملف PDF', 'Upload a PDF file')}
                      </p>
                    </div>

                    {/* Current file preview */}
                    {currentUrl && (
                      <div className="rounded-lg overflow-hidden border border-white/10">
                        {file.isImage ? (
                          <img src={currentUrl} alt={file.key} className="w-24 h-24 object-cover" />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-white/5">
                            <FileText className="h-5 w-5" style={{ color: GOLD }} />
                            <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:underline truncate">
                              {t('عرض الملف', 'View File')}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload button - using HTML label for reliable cross-browser file dialog */}
                    <div className="flex items-center gap-3">
                      <input
                        ref={file.ref}
                        id={`file-input-${file.key}`}
                        type="file"
                        className="hidden"
                        accept={file.isImage ? 'image/*' : '.pdf'}
                        onChange={(e) => {
                          if (file.hasCrop) {
                            handleImageSelect(e, file.key, file.purpose);
                          } else {
                            handleDirectUpload(e, file.key, file.purpose);
                          }
                        }}
                      />
                      <label
                        htmlFor={`file-input-${file.key}`}
                        className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors hover:bg-white/5 ${isUploading || savingContentKey === file.key ? 'opacity-50 pointer-events-none' : ''}`}
                        style={{ borderColor: GOLD, color: GOLD }}
                      >
                        {isUploading || savingContentKey === file.key ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {t('اختيار ملف', 'Choose File')}
                      </label>
                      {currentUrl && (
                        <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                          {t('ملف محفوظ', 'File Saved')}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // ─── Render: Content Section ───
  const renderContentSection = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6">{t('تحرير المحتوى', 'Edit Content')}</h3>
      {CONTENT_FIELDS.map((field) => {
        const currentAr = getContentValue(field.key, 'ar');
        const currentEn = getContentValue(field.key, 'en');
        const hasEdits = contentEdits[field.key] !== undefined;
        const isSaving = savingContentKey === field.key;
        return (
          <Card key={field.key} className="border-white/10" style={{ background: NAVY_800 }}>
            <CardContent className="p-5 space-y-3">
              <Label className="text-white font-medium">{t(field.labelAr, field.labelEn)}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-white/40">{t('عربي', 'Arabic')}</span>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={currentAr}
                      onChange={(e) => setContentEdit(field.key, 'ar', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]"
                      dir="rtl"
                    />
                  ) : (
                    <Input
                      value={currentAr}
                      onChange={(e) => setContentEdit(field.key, 'ar', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      dir="rtl"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-white/40">{t('إنجليزي', 'English')}</span>
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={currentEn}
                      onChange={(e) => setContentEdit(field.key, 'en', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px]"
                      dir="ltr"
                    />
                  ) : (
                    <Input
                      value={currentEn}
                      onChange={(e) => setContentEdit(field.key, 'en', e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20"
                      dir="ltr"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <GoldSaveButton
                  onClick={() => saveContent(field.key, currentAr, currentEn, field.type)}
                  loading={isSaving}
                  t={t}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // ─── Render: Experience Section ───
  const renderExperienceSection = () => {
    if (!experiencesLoaded) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} /></div>;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{t('إدارة الخبرات', 'Experience Management')}</h3>
          <Button
            onClick={() => setEditingExperience({ id: '', companyAr: '', companyEn: '', descAr: '', descEn: '', order: 0, visible: true })}
            className="cursor-pointer font-bold"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
          >
            <Plus className="h-4 w-4 me-2" />
            {t('إضافة خبرة', 'Add Experience')}
          </Button>
        </div>

        {/* Edit Form */}
        {editingExperience && (
          <Card className="border-white/20" style={{ background: NAVY_800 }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white">{editingExperience.id ? t('تعديل خبرة', 'Edit Experience') : t('إضافة خبرة جديدة', 'Add New Experience')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('اسم الشركة (عربي)', 'Company Name (Arabic)')}</Label>
                  <Input
                    value={editingExperience.companyAr}
                    onChange={(e) => setEditingExperience({ ...editingExperience, companyAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('اسم الشركة (إنجليزي)', 'Company Name (English)')}</Label>
                  <Input
                    value={editingExperience.companyEn}
                    onChange={(e) => setEditingExperience({ ...editingExperience, companyEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الوصف (عربي)', 'Description (Arabic)')}</Label>
                  <Textarea
                    value={editingExperience.descAr}
                    onChange={(e) => setEditingExperience({ ...editingExperience, descAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الوصف (إنجليزي)', 'Description (English)')}</Label>
                  <Textarea
                    value={editingExperience.descEn}
                    onChange={(e) => setEditingExperience({ ...editingExperience, descEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingExperience.visible}
                  onCheckedChange={(v) => setEditingExperience({ ...editingExperience, visible: v })}
                />
                <Label className="text-white/70">{t('مرئي', 'Visible')}</Label>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button onClick={() => setEditingExperience(null)} variant="ghost" className="text-white/50 hover:text-white cursor-pointer">
                  {t('إلغاء', 'Cancel')}
                </Button>
                <GoldSaveButton
                  onClick={() => saveExperience(editingExperience)}
                  loading={savingExperience === (editingExperience.id || 'new')}
                  t={t}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {experiences.length === 0 && (
            <p className="text-white/40 text-center py-8">{t('لا توجد خبرات', 'No experiences yet')}</p>
          )}
          {experiences.map((exp) => (
            <Card key={exp.id} className="border-white/10" style={{ background: NAVY_800 }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium truncate">{isRTL ? exp.companyAr : exp.companyEn}</span>
                    {!exp.visible && <EyeOff className="h-3 w-3 text-white/30" />}
                  </div>
                  <p className="text-white/40 text-sm truncate">{isRTL ? exp.descAr : exp.descEn}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ms-3">
                  <Button
                    onClick={() => setEditingExperience({ ...exp })}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteExperience(exp.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ─── Render: Clients Section ───
  const renderClientsSection = () => {
    if (!clientsLoaded) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} /></div>;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{t('إدارة العملاء', 'Clients Management')}</h3>
          <Button
            onClick={() => setEditingClient({ id: '', nameAr: '', nameEn: '', logoUrl: null, order: 0, visible: true })}
            className="cursor-pointer font-bold"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
          >
            <Plus className="h-4 w-4 me-2" />
            {t('إضافة عميل', 'Add Client')}
          </Button>
        </div>

        {/* Edit Form */}
        {editingClient && (
          <Card className="border-white/20" style={{ background: NAVY_800 }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white">{editingClient.id ? t('تعديل عميل', 'Edit Client') : t('إضافة عميل جديد', 'Add New Client')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الاسم (عربي)', 'Name (Arabic)')}</Label>
                  <Input
                    value={editingClient.nameAr}
                    onChange={(e) => setEditingClient({ ...editingClient, nameAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الاسم (إنجليزي)', 'Name (English)')}</Label>
                  <Input
                    value={editingClient.nameEn}
                    onChange={(e) => setEditingClient({ ...editingClient, nameEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Logo upload */}
              <div className="space-y-2">
                <Label className="text-white/70">{t('شعار العميل', 'Client Logo')}</Label>
                <div className="flex items-center gap-3">
                  <input
                    ref={clientLogoRef}
                    id="client-logo-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleClientLogoUpload(e, editingClient.id || '')}
                  />
                  {editingClient.logoUrl && (
                    <img src={editingClient.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded border border-white/10" />
                  )}
                  <label
                    htmlFor="client-logo-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: GOLD, color: GOLD }}
                  >
                    <Upload className="h-4 w-4" />
                    {t('رفع شعار', 'Upload Logo')}
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={editingClient.visible}
                  onCheckedChange={(v) => setEditingClient({ ...editingClient, visible: v })}
                />
                <Label className="text-white/70">{t('مرئي', 'Visible')}</Label>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button onClick={() => setEditingClient(null)} variant="ghost" className="text-white/50 hover:text-white cursor-pointer">
                  {t('إلغاء', 'Cancel')}
                </Button>
                <GoldSaveButton
                  onClick={() => saveClient(editingClient)}
                  loading={savingClient === (editingClient.id || 'new')}
                  t={t}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {clients.length === 0 && (
            <p className="text-white/40 text-center py-8">{t('لا يوجد عملاء', 'No clients yet')}</p>
          )}
          {clients.map((client) => (
            <Card key={client.id} className="border-white/10" style={{ background: NAVY_800 }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {client.logoUrl ? (
                    <img src={client.logoUrl} alt="" className="w-8 h-8 object-contain rounded" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                      <Users className="h-4 w-4 text-white/30" />
                    </div>
                  )}
                  <span className="text-white truncate">{isRTL ? client.nameAr : client.nameEn}</span>
                  {!client.visible && <EyeOff className="h-3 w-3 text-white/30" />}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ms-3">
                  <Button
                    onClick={() => setEditingClient({ ...client })}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteClient(client.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ─── Render: Skills Section ───
  const renderSkillsSection = () => {
    if (!skillsLoaded) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} /></div>;

    const categories = [
      { value: 'design', labelAr: 'تصميم', labelEn: 'Design' },
      { value: 'marketing', labelAr: 'تسويق', labelEn: 'Marketing' },
      { value: 'development', labelAr: 'تطوير', labelEn: 'Development' },
      { value: 'ai', labelAr: 'ذكاء اصطناعي', labelEn: 'AI' },
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{t('إدارة المهارات', 'Skills Management')}</h3>
          <Button
            onClick={() => setEditingSkill({ id: '', titleAr: '', titleEn: '', descAr: '', descEn: '', icon: '', level: 80, category: 'design', order: 0, visible: true })}
            className="cursor-pointer font-bold"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
          >
            <Plus className="h-4 w-4 me-2" />
            {t('إضافة مهارة', 'Add Skill')}
          </Button>
        </div>

        {/* Edit Form */}
        {editingSkill && (
          <Card className="border-white/20" style={{ background: NAVY_800 }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white">{editingSkill.id ? t('تعديل مهارة', 'Edit Skill') : t('إضافة مهارة جديدة', 'Add New Skill')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('العنوان (عربي)', 'Title (Arabic)')}</Label>
                  <Input
                    value={editingSkill.titleAr}
                    onChange={(e) => setEditingSkill({ ...editingSkill, titleAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('العنوان (إنجليزي)', 'Title (English)')}</Label>
                  <Input
                    value={editingSkill.titleEn}
                    onChange={(e) => setEditingSkill({ ...editingSkill, titleEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الوصف (عربي)', 'Description (Arabic)')}</Label>
                  <Textarea
                    value={editingSkill.descAr || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, descAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الوصف (إنجليزي)', 'Description (English)')}</Label>
                  <Textarea
                    value={editingSkill.descEn || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, descEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الأيقونة', 'Icon')}</Label>
                  <Input
                    value={editingSkill.icon || ''}
                    onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="e.g. Palette"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('المستوى', 'Level')}</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={editingSkill.level}
                    onChange={(e) => setEditingSkill({ ...editingSkill, level: parseInt(e.target.value) || 0 })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الفئة', 'Category')}</Label>
                  <select
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-white/5 text-white px-3 py-2 text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-[#13315C]">
                        {t(cat.labelAr, cat.labelEn)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingSkill.visible}
                  onCheckedChange={(v) => setEditingSkill({ ...editingSkill, visible: v })}
                />
                <Label className="text-white/70">{t('مرئي', 'Visible')}</Label>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button onClick={() => setEditingSkill(null)} variant="ghost" className="text-white/50 hover:text-white cursor-pointer">
                  {t('إلغاء', 'Cancel')}
                </Button>
                <GoldSaveButton
                  onClick={() => saveSkill(editingSkill)}
                  loading={savingSkill === (editingSkill.id || 'new')}
                  t={t}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {skills.length === 0 && (
            <p className="text-white/40 text-center py-8">{t('لا توجد مهارات', 'No skills yet')}</p>
          )}
          {skills.map((skill) => (
            <Card key={skill.id} className="border-white/10" style={{ background: NAVY_800 }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{isRTL ? skill.titleAr : skill.titleEn}</span>
                    <Badge variant="outline" className="border-white/20 text-white/50 text-xs">{skill.category}</Badge>
                    <Badge variant="outline" className="border-white/20 text-white/50 text-xs">{skill.level}%</Badge>
                    {!skill.visible && <EyeOff className="h-3 w-3 text-white/30" />}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ms-3">
                  <Button
                    onClick={() => setEditingSkill({ ...skill })}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteSkill(skill.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ─── Render: Courses Section ───
  const renderCoursesSection = () => {
    if (!coursesLoaded) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} /></div>;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{t('إدارة الدورات', 'Courses Management')}</h3>
          <Button
            onClick={() => setEditingCourse({ id: '', titleAr: '', titleEn: '', icon: '', order: 0, visible: true })}
            className="cursor-pointer font-bold"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
          >
            <Plus className="h-4 w-4 me-2" />
            {t('إضافة دورة', 'Add Course')}
          </Button>
        </div>

        {/* Edit Form */}
        {editingCourse && (
          <Card className="border-white/20" style={{ background: NAVY_800 }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white">{editingCourse.id ? t('تعديل دورة', 'Edit Course') : t('إضافة دورة جديدة', 'Add New Course')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('العنوان (عربي)', 'Title (Arabic)')}</Label>
                  <Input
                    value={editingCourse.titleAr}
                    onChange={(e) => setEditingCourse({ ...editingCourse, titleAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('العنوان (إنجليزي)', 'Title (English)')}</Label>
                  <Input
                    value={editingCourse.titleEn}
                    onChange={(e) => setEditingCourse({ ...editingCourse, titleEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">{t('الأيقونة', 'Icon')}</Label>
                <Input
                  value={editingCourse.icon || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, icon: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="e.g. BookOpen"
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingCourse.visible}
                  onCheckedChange={(v) => setEditingCourse({ ...editingCourse, visible: v })}
                />
                <Label className="text-white/70">{t('مرئي', 'Visible')}</Label>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button onClick={() => setEditingCourse(null)} variant="ghost" className="text-white/50 hover:text-white cursor-pointer">
                  {t('إلغاء', 'Cancel')}
                </Button>
                <GoldSaveButton
                  onClick={() => saveCourse(editingCourse)}
                  loading={savingCourse === (editingCourse.id || 'new')}
                  t={t}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {courses.length === 0 && (
            <p className="text-white/40 text-center py-8">{t('لا توجد دورات', 'No courses yet')}</p>
          )}
          {courses.map((course) => (
            <Card key={course.id} className="border-white/10" style={{ background: NAVY_800 }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{isRTL ? course.titleAr : course.titleEn}</span>
                    {!course.visible && <EyeOff className="h-3 w-3 text-white/30" />}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ms-3">
                  <Button
                    onClick={() => setEditingCourse({ ...course })}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deleteCourse(course.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ─── Render: Portfolio Section ───
  const renderPortfolioSection = () => {
    if (!portfolioLoaded) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} /></div>;

    const subTabs = [
      { key: 'posts' as const, labelAr: 'منشورات', labelEn: 'Posts' },
      { key: 'profiles' as const, labelAr: 'ملفات شخصية', labelEn: 'Profiles' },
      { key: 'websites' as const, labelAr: 'مواقع', labelEn: 'Websites' },
    ];

    const filteredItems = portfolioItems.filter((item) => item.category === portfolioSubTab);

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-6">{t('إدارة المعرض', 'Portfolio Management')}</h3>

        {/* Sub-tabs */}
        <div className="flex gap-2 mb-4">
          {subTabs.map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setPortfolioSubTab(tab.key)}
              variant={portfolioSubTab === tab.key ? 'default' : 'ghost'}
              className={`cursor-pointer ${portfolioSubTab === tab.key ? 'font-bold' : 'text-white/50 hover:text-white'}`}
              style={portfolioSubTab === tab.key ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 } : {}}
            >
              {t(tab.labelAr, tab.labelEn)}
            </Button>
          ))}
        </div>

        <Button
          onClick={() => setEditingPortfolio({
            id: '',
            titleAr: '',
            titleEn: '',
            category: portfolioSubTab,
            imageUrl: '',
            order: 0,
            visible: true,
          })}
          className="cursor-pointer font-bold mb-4"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
        >
          <Plus className="h-4 w-4 me-2" />
          {t('إضافة عنصر', 'Add Item')}
        </Button>

        {/* Edit Form */}
        {editingPortfolio && editingPortfolio.category === portfolioSubTab && (
          <Card className="border-white/20" style={{ background: NAVY_800 }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white">{editingPortfolio.id ? t('تعديل عنصر', 'Edit Item') : t('إضافة عنصر جديد', 'Add New Item')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('العنوان (عربي)', 'Title (Arabic)')}</Label>
                  <Input
                    value={editingPortfolio.titleAr}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, titleAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('العنوان (إنجليزي)', 'Title (English)')}</Label>
                  <Input
                    value={editingPortfolio.titleEn}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, titleEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Image Upload - using label for reliable file dialog */}
              <div className="space-y-2">
                <Label className="text-white/70">{t('صورة العنصر', 'Item Image')}</Label>
                <div className="flex items-center gap-3">
                  <input
                    ref={portfolioImageRef}
                    id="portfolio-img-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePortfolioImageUpload}
                  />
                  {editingPortfolio.imageUrl && (
                    <img src={editingPortfolio.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded border border-white/10" />
                  )}
                  <label
                    htmlFor="portfolio-img-upload"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors hover:bg-white/5"
                    style={{ borderColor: GOLD, color: GOLD }}
                  >
                    <Upload className="h-4 w-4" />
                    {t('رفع صورة', 'Upload Image')}
                  </label>
                </div>
              </div>

              {/* Description fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الوصف (عربي)', 'Description (Arabic)')}</Label>
                  <Textarea
                    value={editingPortfolio.descriptionAr || ''}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, descriptionAr: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[70px]"
                    dir="rtl"
                    placeholder={t('وصف اختياري', 'Optional description')}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-white/70">{t('الوصف (إنجليزي)', 'Description (English)')}</Label>
                  <Textarea
                    value={editingPortfolio.descriptionEn || ''}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, descriptionEn: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[70px]"
                    dir="ltr"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              {/* Project URL - show for websites and profiles */}
              {(portfolioSubTab === 'websites' || portfolioSubTab === 'profiles') && (
                <div className="space-y-1">
                  <Label className="text-white/70">{t('رابط المشروع', 'Project URL')}</Label>
                  <Input
                    value={editingPortfolio.projectUrl || ''}
                    onChange={(e) => setEditingPortfolio({ ...editingPortfolio, projectUrl: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    dir="ltr"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Switch
                  checked={editingPortfolio.visible}
                  onCheckedChange={(v) => setEditingPortfolio({ ...editingPortfolio, visible: v })}
                />
                <Label className="text-white/70">{t('مرئي', 'Visible')}</Label>
              </div>
              <div className="flex items-center gap-3 justify-end">
                <Button onClick={() => setEditingPortfolio(null)} variant="ghost" className="text-white/50 hover:text-white cursor-pointer">
                  {t('إلغاء', 'Cancel')}
                </Button>
                <GoldSaveButton
                  onClick={() => savePortfolio(editingPortfolio)}
                  loading={savingPortfolio === (editingPortfolio.id || 'new')}
                  t={t}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredItems.length === 0 && (
            <p className="text-white/40 text-center py-8">{t('لا توجد عناصر', 'No items yet')}</p>
          )}
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-white/10" style={{ background: NAVY_800 }}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-white/30" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{isRTL ? item.titleAr : item.titleEn}</span>
                      {!item.visible && <EyeOff className="h-3 w-3 text-white/30" />}
                    </div>
                    <Badge variant="outline" className="border-white/20 text-white/40 text-xs mt-1">{item.category}</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ms-3">
                  <Button
                    onClick={() => setEditingPortfolio({ ...item })}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white hover:bg-white/10 cursor-pointer"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => deletePortfolio(item.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ─── Handler: Change Password ───
  const handleChangePassword = async () => {
    if (!newPwd || newPwd !== confirmPwd) {
      toast({ title: t('خطأ', 'Error'), description: t('كلمتا المرور الجديدة غير متطابقتين', 'New passwords do not match'), variant: 'destructive' });
      return;
    }
    if (newPwd.length < 6) {
      toast({ title: t('خطأ', 'Error'), description: t('يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'Password must be at least 6 characters'), variant: 'destructive' });
      return;
    }
    setChangingPwd(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: currentPwd, newPassword: newPwd }),
      });
      if (res.ok) {
        toast({ title: t('تم الحفظ', 'Saved'), description: t('تم تغيير كلمة المرور بنجاح', 'Password changed successfully') });
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      } else {
        const err = await res.json();
        toast({ title: t('خطأ', 'Error'), description: err.error || t('فشل تغيير كلمة المرور', 'Failed to change password'), variant: 'destructive' });
      }
    } catch {
      toast({ title: t('خطأ', 'Error'), description: t('حدث خطأ غير متوقع', 'An unexpected error occurred'), variant: 'destructive' });
    } finally {
      setChangingPwd(false);
    }
  };

  // ─── Render: Settings Section (Inline) ───
  const renderSettingsInline = () => (
    <div className="space-y-6 max-w-lg">
      <h3 className="text-xl font-bold text-white mb-6">{t('إدارة كلمة المرور', 'Password Management')}</h3>
      <Card className="border-white/10" style={{ background: NAVY_800 }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" style={{ color: GOLD }} />
            {t('تغيير كلمة المرور', 'Change Password')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label className="text-white/70">{t('كلمة المرور الحالية', 'Current Password')}</Label>
            <Input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white/70">{t('كلمة المرور الجديدة', 'New Password')}</Label>
            <Input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-white/70">{t('تأكيد كلمة المرور الجديدة', 'Confirm New Password')}</Label>
            <Input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={changingPwd || !currentPwd || !newPwd || !confirmPwd}
              className="font-bold cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY_900 }}
            >
              {changingPwd ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {t('تغيير كلمة المرور', 'Change Password')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Site Info */}
      <Card className="border-white/10" style={{ background: NAVY_800 }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">{t('معلومات الموقع', 'Site Information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/60 text-sm">{t('نظام قاعدة البيانات', 'Database')}</span>
            <Badge variant="outline" className="border-green-500/30 text-green-400">Supabase ✓</Badge>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-white/60 text-sm">{t('إطار العمل', 'Framework')}</span>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">Next.js ✓</Badge>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-white/60 text-sm">{t('حالة الموقع', 'Status')}</span>
            <Badge variant="outline" className="border-green-500/30 text-green-400">{t('يعمل بشكل طبيعي', 'Running normally')}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ─── Render: Active Section Content ───
  const renderSection = () => {
    switch (activeSection) {
      case 'files': return renderFilesSection();
      case 'content': return renderContentSection();
      case 'experience': return renderExperienceSection();
      case 'clients': return renderClientsSection();
      case 'skills': return renderSkillsSection();
      case 'courses': return renderCoursesSection();
      case 'portfolio': return renderPortfolioSection();
      case 'settings': return renderSettingsInline();
      default: return null;
    }
  };

  // ─── Main Render ───
  return (
    <>
      {/* Floating Admin Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 z-[100] w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, right: isRTL ? '1.5rem' : undefined, left: isRTL ? undefined : '1.5rem' }}
          aria-label={t('لوحة الإدارة', 'Admin Panel')}
        >
          <Settings className="h-6 w-6" style={{ color: NAVY_900 }} />
        </button>
      )}

      {/* Full Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex h-screen w-screen overflow-hidden" style={{ background: NAVY_900 }}>
          {/* Sidebar */}
          {isAuthenticated && renderSidebar()}

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0" style={{ background: NAVY_900 }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/50 hover:text-white cursor-pointer p-1"
                >
                  {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </button>
                <h2 className="text-white font-bold">
                  {isAuthenticated
                    ? t(
                        NAV_ITEMS.find((n) => n.key === activeSection)?.labelAr || '',
                        NAV_ITEMS.find((n) => n.key === activeSection)?.labelEn || ''
                      )
                    : t('تسجيل الدخول', 'Login')}
                </h2>
              </div>
              {isAuthenticated && (
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white/50 hover:text-white cursor-pointer">
                  <LogOut className="h-4 w-4 me-2" />
                  {t('خروج', 'Logout')}
                </Button>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {!isAuthenticated ? renderLogin() : renderSection()}
            </div>
          </div>
        </div>
      )}

      {/* Image Crop Dialog */}
      {cropImageSrc && cropCallback && (
        <ImageCropDialog
          imageSrc={cropImageSrc}
          onCropComplete={cropCallback}
          onCancel={() => { setCropImageSrc(null); setCropCallback(null); }}
          aspectRatio={1}
          t={t}
        />
      )}

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(201, 168, 76, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(201, 168, 76, 0.5);
        }
      `}</style>
    </>
  );
}
