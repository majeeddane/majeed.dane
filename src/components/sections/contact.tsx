'use client';

import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
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
      className="gradient-navy section-padding"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Title */}
        <motion.div
          className="mb-12 text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t('تواصل معي', 'Get In Touch')}
          </h2>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gold" />
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Contact Info */}
          <motion.div
            className="flex flex-col justify-center gap-8"
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg leading-relaxed text-white/80">
              {t(
                'أنا دائماً مستعد للتعاون والعمل على مشاريع جديدة. لا تتردد في التواصل معي!',
                'I am always ready to collaborate and work on new projects. Feel free to reach out!'
              )}
            </p>

            <div className="flex flex-col gap-6">
              {contactInfo.map((item, index) => {
                const IconComponent = item.icon;
                const content = (
                  <div className="group flex items-center gap-4" key={index}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/20 transition-colors duration-300 group-hover:bg-gold/30">
                      <IconComponent className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{item.label}</p>
                      <p className="font-medium text-white transition-all duration-300 group-hover:text-gold-light">
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
                      className="block"
                    >
                      {content}
                    </a>
                  );
                }
                return <div key={index}>{content}</div>;
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:p-8"
            >
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  {t('الاسم', 'Name')}
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('أدخل اسمك', 'Enter your name')}
                  className="bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:border-gold focus:ring-gold/30"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  {t('البريد الإلكتروني', 'Email')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email')}
                  className="bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:border-gold focus:ring-gold/30"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  {t('الرسالة', 'Message')}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('اكتب رسالتك هنا...', 'Write your message here...')}
                  className="bg-white/10 text-white placeholder:text-white/50 border-white/20 focus:border-gold focus:ring-gold/30 min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-11 cursor-pointer bg-gold text-navy-900 font-semibold hover:bg-gold-light transition-colors duration-300 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {t('جاري الإرسال...', 'Sending...')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {t('إرسال الرسالة', 'Send Message')}
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
