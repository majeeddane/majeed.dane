'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

// Map content keys to readable labels
const keyLabels: Record<string, { ar: string; en: string; icon: string }> = {
  hero_name_ar: { ar: 'الاسم الكامل', en: 'Full Name', icon: 'user' },
  hero_title_ar: { ar: 'المسمى الوظيفي', en: 'Job Title', icon: 'briefcase' },
  hero_tagline_ar: { ar: 'الشعار النصي', en: 'Tagline', icon: 'quote' },
  about_ar: { ar: 'النبذة التعريفية', en: 'About Bio', icon: 'filetext' },
  about_age: { ar: 'العمر', en: 'Age', icon: 'user' },
  about_nationality: { ar: 'الجنسية', en: 'Nationality', icon: 'globe' },
  about_status: { ar: 'الحالة الاجتماعية', en: 'Status', icon: 'heart' },
  about_availability: { ar: 'التفرغ', en: 'Availability', icon: 'briefcase' },
  about_license: { ar: 'رخصة القيادة', en: 'License', icon: 'car' },
  about_teamwork: { ar: 'العمل ضمن فريق', en: 'Teamwork', icon: 'users' },
  about_location: { ar: 'الموقع', en: 'Location', icon: 'map' },
  education_ar: { ar: 'التعليم', en: 'Education', icon: 'grad' },
  contact_phone: { ar: 'الهاتف', en: 'Phone', icon: 'phone' },
  contact_email: { ar: 'البريد الإلكتروني', en: 'Email', icon: 'mail' },
  contact_location: { ar: 'موقع التواصل', en: 'Contact Location', icon: 'map' },
  stats_experience: { ar: 'سنوات الخبرة', en: 'Years Experience', icon: 'chart' },
  stats_clients: { ar: 'عدد العملاء', en: 'Clients Count', icon: 'chart' },
  stats_projects: { ar: 'عدد المشاريع', en: 'Projects Count', icon: 'chart' },
  stats_campaigns: { ar: 'عدد الحملات', en: 'Campaigns Count', icon: 'chart' },
  stats_experience_label_ar: { ar: 'وصف الخبرة', en: 'Experience Label', icon: 'text' },
  stats_clients_label_ar: { ar: 'وصف العملاء', en: 'Clients Label', icon: 'text' },
  stats_projects_label_ar: { ar: 'وصف المشاريع', en: 'Projects Label', icon: 'text' },
  stats_campaigns_label_ar: { ar: 'وصف الحملات', en: 'Campaigns Label', icon: 'text' },
};

export default function AdminPanel() {
  const { lang, t } = useLanguage();
  const isRTL = lang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [contentData, setContentData] = useState<Record<string, { valueAr: string; valueEn: string }>>({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItemData[]>([]);
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  // Current file states
  const [currentProfileImg, setCurrentProfileImg] = useState<string>('');
  const [currentCvFile, setCurrentCvFile] = useState<string>('');
  const [currentPortfolioFile, setCurrentPortfolioFile] = useState<string>('');

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
        toast({ title: t('تم تسجيل الدخول بنجاح', 'Login successful') });
      } else {
        toast({ title: t('كلمة المرور غير صحيحة', 'Incorrect password'), variant: 'destructive' });
      }
    } catch {
      toast({ title: t('حدث خطأ', 'An error occurred'), variant: 'destructive' });
    }
    setLoginLoading(false);
  }, [password, t, toast]);

  const loadContent = useCallback(async () => {
    if (contentLoaded) return;
    try {
      const res = await fetch('/api/content');
      const data: ContentItem[] = await res.json();
      const map: Record<string, { valueAr: string; valueEn: string }> = {};
      data.forEach((item) => {
        map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' };
        if (item.key === 'profile_image' && item.valueAr) setCurrentProfileImg(item.valueAr);
        if (item.key === 'cv_file' && item.valueAr) setCurrentCvFile(item.valueAr);
        if (item.key === 'portfolio_file' && item.valueAr) setCurrentPortfolioFile(item.valueAr);
      });
      setContentData(map);
      setContentLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل المحتوى', 'Failed to load content'), variant: 'destructive' });
    }
  }, [contentLoaded, t, toast]);

  const loadPortfolio = useCallback(async () => {
    if (portfolioLoaded) return;
    try {
      const res = await fetch('/api/portfolio');
      const data: PortfolioItemData[] = await res.json();
      setPortfolioItems(data);
      setPortfolioLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل الأعمال', 'Failed to load portfolio'), variant: 'destructive' });
    }
  }, [portfolioLoaded, t, toast]);

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

  const handleFileUpload = useCallback(async (file: File, purpose: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: purpose, valueAr: data.url, valueEn: data.url }),
        });
        if (purpose === 'profile_image') setCurrentProfileImg(data.url);
        if (purpose === 'cv_file') setCurrentCvFile(data.url);
        if (purpose === 'portfolio_file') setCurrentPortfolioFile(data.url);
        toast({ title: t('✓ تم رفع الملف بنجاح', '✓ File uploaded successfully') });
      }
    } catch {
      toast({ title: t('فشل رفع الملف', 'File upload failed'), variant: 'destructive' });
    }
    setUploading(false);
  }, [t, toast]);

  const addPortfolioItem = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titleAr: 'عمل جديد', titleEn: 'New Work', category: 'posts', imageUrl: '/placeholder.jpg' }),
      });
      const data = await res.json();
      setPortfolioItems((prev) => [...prev, data]);
      toast({ title: t('تم إضافة العمل', 'Item added') });
    } catch {
      toast({ title: t('فشل الإضافة', 'Add failed'), variant: 'destructive' });
    }
  }, [t, toast]);

  const deletePortfolioItem = useCallback(async (id: string) => {
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
      toast({ title: t('تم الحذف', 'Item deleted') });
    } catch {
      toast({ title: t('فشل الحذف', 'Delete failed'), variant: 'destructive' });
    }
  }, [t, toast]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-navy-900 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        aria-label="Admin"
        title={t('لوحة التحكم (Ctrl+Shift+A)', 'Admin Panel (Ctrl+Shift+A)')}
      >
        <Settings className="h-5 w-5" />
      </button>
    );
  }

  const contentKeys = Object.keys(contentData).filter(
    (key) => !['cv_file', 'portfolio_file', 'profile_image'].includes(key)
  );

  const getKeyLabel = (key: string) => {
    const label = keyLabels[key];
    return label ? t(label.ar, label.en) : key;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: 'linear-gradient(180deg, #0B2545 0%, #0A1D3A 100%)' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/20">
              <Settings className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t('لوحة التحكم', 'Admin Dashboard')}</h2>
              <p className="text-xs text-white/50">{t('إدارة محتوى الموقع', 'Manage site content')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setIsLoggedIn(false); setPassword(''); setContentLoaded(false); setPortfolioLoaded(false); }}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <LogOut className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              {t('خروج', 'Logout')}
            </Button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!isLoggedIn ? (
          /* Login Screen */
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-navy-800 border-2 border-gold/30">
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
                  className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-gold focus:ring-gold/30"
                />
                <Button
                  type="submit"
                  disabled={loginLoading}
                  className="bg-gold text-navy-900 hover:bg-gold-light font-bold"
                >
                  {loginLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('دخول', 'Login')}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* Dashboard */
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex flex-1 flex-col overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10 px-6">
              <TabsList className="h-11 gap-1 rounded-none border-0 bg-transparent p-0">
                <TabsTrigger
                  value="content"
                  className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white/60 transition-all data-[state=active]:border-gold/30 data-[state=active]:bg-gold/10 data-[state=active]:text-gold data-[state=active]:shadow-none"
                >
                  <FileText className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t('المحتوى', 'Content')}
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white/60 transition-all data-[state=active]:border-gold/30 data-[state=active]:bg-gold/10 data-[state=active]:text-gold data-[state=active]:shadow-none"
                >
                  <ImageIcon className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t('معرض الأعمال', 'Portfolio')}
                </TabsTrigger>
                <TabsTrigger
                  value="files"
                  className="rounded-lg border border-transparent px-4 py-2 text-sm font-medium text-white/60 transition-all data-[state=active]:border-gold/30 data-[state=active]:bg-gold/10 data-[state=active]:text-gold data-[state=active]:shadow-none"
                >
                  <Upload className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                  {t('الملفات', 'Files')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#13315C transparent' }}>
              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="p-6 space-y-3">
                  {!contentLoaded ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-gold" />
                      <p className="text-white/60">{t('جارٍ تحميل المحتوى...', 'Loading content...')}</p>
                    </div>
                  ) : (
                    contentKeys.map((key) => (
                      <div
                        key={key}
                        className="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all duration-200 hover:border-white/20"
                      >
                        {/* Collapsible Header */}
                        <button
                          onClick={() => setExpandedKey(expandedKey === key ? null : key)}
                          className="w-full flex items-center justify-between px-5 py-3.5 cursor-pointer text-left"
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gold/60" />
                            <span className="text-sm font-medium text-white/90">{getKeyLabel(key)}</span>
                            <span className="text-xs text-white/30 font-mono">{key}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 text-white/40 transition-transform duration-200 ${expandedKey === key ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Expandable Content */}
                        {expandedKey === key && (
                          <div className="border-t border-white/10 px-5 py-4 space-y-3">
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-white/50">عربي</label>
                              <Textarea
                                value={contentData[key]?.valueAr || ''}
                                onChange={(e) =>
                                  setContentData({ ...contentData, [key]: { ...contentData[key], valueAr: e.target.value } })
                                }
                                className="min-h-[60px] border-white/15 bg-white/5 text-white text-sm placeholder:text-white/30 focus:border-gold focus:ring-gold/20"
                                dir="rtl"
                              />
                            </div>
                            <div>
                              <label className="mb-1.5 block text-xs font-medium text-white/50">English</label>
                              <Textarea
                                value={contentData[key]?.valueEn || ''}
                                onChange={(e) =>
                                  setContentData({ ...contentData, [key]: { ...contentData[key], valueEn: e.target.value } })
                                }
                                className="min-h-[60px] border-white/15 bg-white/5 text-white text-sm placeholder:text-white/30 focus:border-gold focus:ring-gold/20"
                                dir="ltr"
                              />
                            </div>
                            <div className="flex justify-end pt-1">
                              <Button
                                onClick={() => saveContent(key)}
                                disabled={saving}
                                size="sm"
                                className="bg-gold text-navy-900 hover:bg-gold-light font-semibold"
                              >
                                {saving ? (
                                  <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-3.5 w-3.5 animate-spin`} />
                                ) : (
                                  <Save className={`${isRTL ? 'ml-2' : 'mr-2'} h-3.5 w-3.5`} />
                                )}
                                {t('حفظ', 'Save')}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Portfolio Tab */}
              {activeTab === 'portfolio' && (
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/50">{t('إدارة أعمال معرض الأعمال', 'Manage portfolio items')}</p>
                    <Button onClick={addPortfolioItem} size="sm" className="bg-gold text-navy-900 hover:bg-gold-light font-semibold">
                      <Plus className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                      {t('إضافة عمل', 'Add Item')}
                    </Button>
                  </div>

                  {!portfolioLoaded ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-gold" />
                      <p className="text-white/60">{t('جارٍ تحميل الأعمال...', 'Loading portfolio...')}</p>
                    </div>
                  ) : portfolioItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <ImageIcon className="h-12 w-12 text-white/20" />
                      <p className="text-white/40">{t('لا توجد أعمال بعد', 'No portfolio items yet')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {portfolioItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/10 flex items-center justify-center">
                              {item.imageUrl && item.imageUrl !== '/placeholder.jpg' ? (
                                <img src={item.imageUrl} alt={item.titleAr} className="h-full w-full object-cover" />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-white/30" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-white/90 truncate">{item.titleAr}</p>
                              <p className="text-xs text-white/50 truncate">{item.titleEn}</p>
                              <Badge className="mt-1 text-[10px] bg-white/10 text-white/60 border-0 hover:bg-white/15">
                                {item.category === 'posts' ? t('بوستات', 'Posts') : item.category === 'profiles' ? t('بروفايلات', 'Profiles') : t('مواقع', 'Websites')}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePortfolioItem(item.id)}
                            className="flex-shrink-0 text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Files Tab */}
              {activeTab === 'files' && (
                <div className="p-6 space-y-4">
                  <p className="text-sm text-white/50 mb-2">{t('رفع واستبدال ملفات الموقع', 'Upload and replace site files')}</p>

                  {/* Profile Image */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15">
                        <ImageIcon className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{t('الصورة الشخصية', 'Profile Image')}</h4>
                        <p className="text-xs text-white/40">{t('ستظهر في قسم Hero', 'Will appear in Hero section')}</p>
                      </div>
                    </div>
                    {currentProfileImg && (
                      <div className="mb-3 flex items-center gap-2">
                        <img src={currentProfileImg} alt="profile" className="h-10 w-10 rounded-full object-cover border border-white/20" />
                        <span className="text-xs text-green-400/80 flex items-center gap-1">
                          <Check className="h-3 w-3" /> {t('مرفوعة', 'Uploaded')}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'profile_image'); }}
                        disabled={uploading}
                        className="flex-1 border-white/15 bg-white/5 text-white text-sm file:text-white/60 file:border-0 file:bg-white/10 file:hover:bg-white/20 file:cursor-pointer"
                      />
                      {uploading && <Loader2 className="h-5 w-5 animate-spin text-gold" />}
                    </div>
                  </div>

                  {/* CV File */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15">
                        <FileText className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{t('السيرة الذاتية (PDF)', 'CV File (PDF)')}</h4>
                        <p className="text-xs text-white/40">{t('يظهر عند الضغط على زر تحميل CV', 'Appears when clicking Download CV')}</p>
                      </div>
                    </div>
                    {currentCvFile && (
                      <div className="mb-3 flex items-center gap-2">
                        <a href={currentCvFile} target="_blank" className="text-xs text-blue-400/80 flex items-center gap-1 hover:text-blue-300">
                          <Eye className="h-3 w-3" /> {t('عرض الملف الحالي', 'View current file')}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'cv_file'); }}
                        disabled={uploading}
                        className="flex-1 border-white/15 bg-white/5 text-white text-sm file:text-white/60 file:border-0 file:bg-white/10 file:hover:bg-white/20 file:cursor-pointer"
                      />
                      {uploading && <Loader2 className="h-5 w-5 animate-spin text-gold" />}
                    </div>
                  </div>

                  {/* Portfolio File */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
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
                    <div className="flex items-center gap-3">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, 'portfolio_file'); }}
                        disabled={uploading}
                        className="flex-1 border-white/15 bg-white/5 text-white text-sm file:text-white/60 file:border-0 file:bg-white/10 file:hover:bg-white/20 file:cursor-pointer"
                      />
                      {uploading && <Loader2 className="h-5 w-5 animate-spin text-gold" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}
