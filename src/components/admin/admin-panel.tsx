'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  Lock,
  Upload,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Save,
  Loader2,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminPanel() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Content editing state
  const [contentData, setContentData] = useState<Record<string, { valueAr: string; valueEn: string }>>({});
  const [contentLoaded, setContentLoaded] = useState(false);

  // Portfolio state
  const [portfolioItems, setPortfolioItems] = useState<Array<{ id: string; titleAr: string; titleEn: string; category: string; imageUrl: string }>>([]);
  const [portfolioLoaded, setPortfolioLoaded] = useState(false);

  // File upload state
  const [uploading, setUploading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
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
  };

  const loadContent = async () => {
    if (contentLoaded) return;
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      const map: Record<string, { valueAr: string; valueEn: string }> = {};
      data.forEach((item: { key: string; valueAr: string | null; valueEn: string | null }) => {
        map[item.key] = { valueAr: item.valueAr || '', valueEn: item.valueEn || '' };
      });
      setContentData(map);
      setContentLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل المحتوى', 'Failed to load content'), variant: 'destructive' });
    }
  };

  const loadPortfolio = async () => {
    if (portfolioLoaded) return;
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolioItems(data);
      setPortfolioLoaded(true);
    } catch {
      toast({ title: t('فشل تحميل الأعمال', 'Failed to load portfolio'), variant: 'destructive' });
    }
  };

  const saveContent = async (key: string) => {
    setSaving(true);
    try {
      const item = contentData[key];
      if (!item) return;
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, valueAr: item.valueAr, valueEn: item.valueEn }),
      });
      toast({ title: t('تم الحفظ بنجاح', 'Saved successfully') });
    } catch {
      toast({ title: t('فشل الحفظ', 'Save failed'), variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleFileUpload = async (file: File, purpose: string) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        // Update content key for the purpose
        await fetch('/api/content', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: purpose, valueAr: data.url, valueEn: data.url }),
        });
        toast({ title: t('تم رفع الملف بنجاح', 'File uploaded successfully') });
      }
    } catch {
      toast({ title: t('فشل رفع الملف', 'File upload failed'), variant: 'destructive' });
    }
    setUploading(false);
  };

  const addPortfolioItem = async () => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr: 'عمل جديد',
          titleEn: 'New Work',
          category: 'posts',
          imageUrl: '/placeholder.jpg',
        }),
      });
      const data = await res.json();
      setPortfolioItems([...portfolioItems, data]);
      toast({ title: t('تم إضافة العمل', 'Item added') });
    } catch {
      toast({ title: t('فشل الإضافة', 'Add failed'), variant: 'destructive' });
    }
  };

  const deletePortfolioItem = async (id: string) => {
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      setPortfolioItems(portfolioItems.filter((item) => item.id !== id));
      toast({ title: t('تم الحذف', 'Item deleted') });
    } catch {
      toast({ title: t('فشل الحذف', 'Delete failed'), variant: 'destructive' });
    }
  };

  // Keyboard shortcut to open admin: Ctrl+Shift+A
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsOpen(true);
      }
    });
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-navy-900/80 text-white opacity-30 transition-opacity hover:opacity-100"
        aria-label="Admin"
        title={t('لوحة التحكم (Ctrl+Shift+A)', 'Admin Panel (Ctrl+Shift+A)')}
      >
        <Settings className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative flex h-[90vh] w-[95vw] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" dir="rtl">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute left-4 top-4 z-10 cursor-pointer rounded-full p-2 text-navy-900/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
        >
          <X className="h-5 w-5" />
        </button>

        {!isLoggedIn ? (
          /* Login Form */
          <div className="flex flex-1 items-center justify-center p-8">
            <Card className="w-full max-w-sm border-navy-800/10">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-900">
                  <Lock className="h-8 w-8 text-gold" />
                </div>
                <CardTitle className="text-navy-900">
                  {t('لوحة التحكم', 'Admin Panel')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <Input
                    type="password"
                    placeholder={t('كلمة المرور', 'Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-navy-800/20 focus:border-navy-800"
                  />
                  <Button
                    type="submit"
                    disabled={loginLoading}
                    className="bg-navy-900 text-white hover:bg-navy-800"
                  >
                    {loginLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t('دخول', 'Login')
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-navy-800/10 px-6 py-4">
              <h2 className="text-lg font-bold text-navy-900">
                {t('لوحة التحكم', 'Admin Dashboard')}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsLoggedIn(false);
                  setPassword('');
                }}
                className="text-navy-900/60"
              >
                <LogOut className="ml-2 h-4 w-4" />
                {t('خروج', 'Logout')}
              </Button>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v);
                if (v === 'content') loadContent();
                if (v === 'portfolio') loadPortfolio();
              }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              <div className="border-b border-navy-800/10 px-6">
                <TabsList className="h-12 w-full justify-start rounded-none border-0 bg-transparent p-0">
                  <TabsTrigger
                    value="content"
                    className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-navy-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <FileText className="ml-2 h-4 w-4" />
                    {t('المحتوى', 'Content')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="portfolio"
                    className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-navy-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <ImageIcon className="ml-2 h-4 w-4" />
                    {t('معرض الأعمال', 'Portfolio')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="files"
                    className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-navy-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    {t('الملفات', 'Files')}
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                {/* Content Tab */}
                <TabsContent value="content" className="p-6">
                  <div className="flex flex-col gap-6">
                    {!contentLoaded ? (
                      <Button onClick={loadContent} variant="outline">
                        {t('تحميل المحتوى', 'Load Content')}
                      </Button>
                    ) : (
                      Object.entries(contentData)
                        .filter(([key]) => !['cv_file', 'portfolio_file', 'profile_image'].includes(key))
                        .map(([key, val]) => (
                          <Card key={key} className="border-navy-800/10">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-medium text-navy-900">
                                {key}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                              <div>
                                <label className="mb-1 text-xs text-navy-900/60">عربي</label>
                                <Textarea
                                  value={val.valueAr}
                                  onChange={(e) =>
                                    setContentData({
                                      ...contentData,
                                      [key]: { ...val, valueAr: e.target.value },
                                    })
                                  }
                                  className="min-h-[60px] border-navy-800/20 focus:border-navy-800"
                                  dir="rtl"
                                />
                              </div>
                              <div>
                                <label className="mb-1 text-xs text-navy-900/60">English</label>
                                <Textarea
                                  value={val.valueEn}
                                  onChange={(e) =>
                                    setContentData({
                                      ...contentData,
                                      [key]: { ...val, valueEn: e.target.value },
                                    })
                                  }
                                  className="min-h-[60px] border-navy-800/20 focus:border-navy-800"
                                  dir="ltr"
                                />
                              </div>
                              <Button
                                onClick={() => saveContent(key)}
                                disabled={saving}
                                size="sm"
                                className="w-fit bg-navy-900 text-white hover:bg-navy-800"
                              >
                                {saving ? (
                                  <Loader2 className="ml-2 h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="ml-2 h-3 w-3" />
                                )}
                                {t('حفظ', 'Save')}
                              </Button>
                            </CardContent>
                          </Card>
                        ))
                    )}
                  </div>
                </TabsContent>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="p-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={addPortfolioItem}
                      className="w-fit bg-navy-900 text-white hover:bg-navy-800"
                    >
                      {t('إضافة عمل جديد', 'Add New Item')}
                    </Button>

                    {!portfolioLoaded ? (
                      <Button onClick={loadPortfolio} variant="outline">
                        {t('تحميل الأعمال', 'Load Portfolio')}
                      </Button>
                    ) : (
                      portfolioItems.map((item) => (
                        <Card key={item.id} className="border-navy-800/10">
                          <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                              {item.imageUrl && (
                                <div className="h-12 w-12 overflow-hidden rounded bg-navy-800/5">
                                  <img
                                    src={item.imageUrl}
                                    alt={item.titleAr}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-navy-900">{item.titleAr}</p>
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePortfolioItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                {/* Files Tab */}
                <TabsContent value="files" className="p-6">
                  <div className="flex flex-col gap-6">
                    {/* Profile Image Upload */}
                    <Card className="border-navy-800/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-navy-900">
                          <ImageIcon className="h-4 w-4 text-gold" />
                          {t('الصورة الشخصية', 'Profile Image')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'profile_image');
                          }}
                          disabled={uploading}
                          className="border-navy-800/20"
                        />
                      </CardContent>
                    </Card>

                    {/* CV Upload */}
                    <Card className="border-navy-800/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-navy-900">
                          <FileText className="h-4 w-4 text-gold" />
                          {t('ملف السيرة الذاتية (PDF)', 'CV File (PDF)')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'cv_file');
                          }}
                          disabled={uploading}
                          className="border-navy-800/20"
                        />
                      </CardContent>
                    </Card>

                    {/* Portfolio PDF Upload */}
                    <Card className="border-navy-800/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-navy-900">
                          <Upload className="h-4 w-4 text-gold" />
                          {t('ملف الأعمال (PDF)', 'Portfolio File (PDF)')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, 'portfolio_file');
                          }}
                          disabled={uploading}
                          className="border-navy-800/20"
                        />
                      </CardContent>
                    </Card>

                    {uploading && (
                      <div className="flex items-center gap-2 text-sm text-navy-900/60">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t('جارٍ الرفع...', 'Uploading...')}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
