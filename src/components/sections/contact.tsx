'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const { isRTL, t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: t('تم إرسال الرسالة بنجاح!', 'Message sent successfully!'),
          description: t(
            'شكراً لتواصلك معي. سأرد عليك في أقرب وقت.',
            'Thank you for reaching out. I will get back to you soon.'
          ),
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast({
          title: t('حدث خطأ', 'An error occurred'),
          description: t(
            'يرجى المحاولة مرة أخرى لاحقاً.',
            'Please try again later.'
          ),
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: t('حدث خطأ', 'An error occurred'),
        description: t(
          'يرجى المحاولة مرة أخرى لاحقاً.',
          'Please try again later.'
        ),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const WHATSAPP_NUMBER = '966554767928';
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('مرحباً، أود التواصل معك بخصوص...', 'Hello, I would like to get in touch with you regarding...'))}`;

  const contactInfo = [
    {
      icon: Phone,
      label: t('الهاتف', 'Phone'),
      value: '+966 55 476 7928',
      href: 'tel:+966554767928',
    },
    {
      icon: Mail,
      label: t('البريد الإلكتروني', 'Email'),
      value: 'majeed.dane@gmail.com',
      href: 'mailto:majeed.dane@gmail.com',
    },
    {
      icon: MapPin,
      label: t('الموقع', 'Location'),
      value: t('الرياض، السعودية', 'Riyadh, Saudi Arabia'),
      href: undefined,
    },
  ];

  return (
    <section
      id="contact"
      className="contact-bg section-padding relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 reveal-up">
          <p className="section-eyebrow">
            <i className="fi fi-br-envelope" />
            {t('دعنا نتحدث', 'Let’s Connect')}
          </p>
          <h2 className="section-title-xl">
            {t('تواصل', 'Get In')}{' '}
            <span style={{ color: '#C8A45A' }}>{t('معي', 'Touch')}</span>
          </h2>
          <div className="gold-line" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-start">
          {/* Contact Info Column */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-base md:text-lg leading-relaxed text-white/60">
              {t(
                'أنا دائماً مستعد للتعاون والعمل على مشاريع جديدة وإبداعية. لا تتردد في التواصل معي لمناقشة فكرتك القادمة!',
                'I am always ready to collaborate and work on exciting new projects. Feel free to reach out and let’s create something extraordinary together!'
              )}
            </p>

            {/* Info Cards */}
            <div className="flex flex-col gap-4">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                const content = (
                  <div className="group card-glass p-5 flex items-center gap-4 transition-all duration-300 hover:border-gold/30">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ background: 'rgba(200,164,90,0.08)', border: '1px solid rgba(200,164,90,0.18)' }}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: '#C8A45A' }} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">{item.label}</p>
                      <p className="font-semibold text-white group-hover:text-gold transition-colors duration-300">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <a
                      key={index}
                      href={item.href}
                      data-cursor-hover
                      className="block"
                    >
                      {content}
                    </a>
                  );
                }
                return <div key={index}>{content}</div>;
              })}
            </div>

            {/* WhatsApp CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              className="group flex items-center gap-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/[0.06] p-5 backdrop-blur-md transition-all duration-300 hover:border-[#25D366]/60 hover:bg-[#25D366]/15 hover:shadow-[0_0_30px_rgba(37,211,102,0.15)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="h-6 w-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs text-white/40">{t('تواصل مباشر وسريع', 'Direct instant chat')}</p>
                <p className="font-bold text-[#25D366] group-hover:text-[#4de887] transition-colors">
                  {t('تواصل عبر واتساب', 'Chat on WhatsApp')}
                </p>
              </div>
              <div className={`${isRTL ? 'mr-auto' : 'ml-auto'} text-[#25D366]/60 transition-transform duration-300 group-hover:translate-x-1`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </div>
            </a>
          </motion.div>

          {/* Minimal Form Column */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <form
              onSubmit={handleSubmit}
              className="card-glass p-8 md:p-10 flex flex-col gap-8"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {t('أرسل لي رسالة', 'Send Me a Message')}
              </h3>

              {/* Minimal Underline Input: Name */}
              <div className="input-minimal-wrapper">
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2"
                >
                  {t('الاسم الكامل', 'Full Name')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('أدخل اسمك الكريم...', 'Enter your name...')}
                  className="input-minimal"
                />
              </div>

              {/* Minimal Underline Input: Email */}
              <div className="input-minimal-wrapper">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2"
                >
                  {t('البريد الإلكتروني', 'Email Address')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('example@domain.com', 'example@domain.com')}
                  className="input-minimal"
                />
              </div>

              {/* Minimal Underline Input: Message */}
              <div className="input-minimal-wrapper">
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2"
                >
                  {t('تفاصيل الرسالة أو المشروع', 'Message Details')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('اكتب تفاصيل مشروعك أو استفسارك هنا...', 'Write your project details or inquiry here...')}
                  className="input-minimal resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                data-cursor-hover
                className="btn-gold justify-center mt-4 text-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('جاري الإرسال...', 'Sending...')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <Send className="h-4 w-4" />
                    {t('إرسال الرسالة', 'Send Message')}
                  </span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
