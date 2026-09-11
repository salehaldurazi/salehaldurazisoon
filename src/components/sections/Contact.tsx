
"use client";

import React, { useState } from "react";
import { FadeInSection } from "../FadeInSection";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase-js";
import { toast } from "@/hooks/use-toast";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import {
  Instagram,
  Youtube,
  MessageCircle,
  Mail,
  Send,
  Loader2
} from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com/aldurazi_production" },
  { icon: Youtube, href: "https://www.youtube.com/@salehaldurazi" },
  { icon: MessageCircle, href: "https://wa.me/973XXXXXXXXX" }, // رابط الواتساب برقمك
];

const stats = [
  { label: "إجمالي الزوار", value: "0" },
  { label: "إجمالي التحميلات", value: "0" },
  { label: "إجمالي الاستماع", value: "0" },
  { label: "إجمالي المشاركة", value: "0" },
];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast({
        title: "تنبيه",
        description: "يرجى ملء كافة الحقول لإرسال الرسالة.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("messages").insert([
        {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "تم إرسال الرسالة بنجاح",
        description: "شكراً لتواصلك. تم تسجيل رسالتك وسنقوم بمراجعتها قريباً.",
      });

      // Clear the form fields
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      console.error("Contact submit error:", err);
      toast({
        title: "فشل إرسال الرسالة",
        description: err.message || "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-24 scroll-mt-nav relative overflow-hidden bg-background">
      {/* Background Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-[400px] bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      <div className="container max-w-6xl px-6 mx-auto relative z-10">

        {/* Content Container - Expanded unified width for all boxes */}
        <div className="flex flex-col gap-8 items-center max-w-4xl mx-auto">

          <FadeInSection className="space-y-8 w-full">
            <div className="space-y-3 text-center mb-4">
              <h2 className="text-4xl md:text-5xl font-light text-primary">مركز التواصل</h2>
              <p className="text-primary uppercase text-xs">للاستفسارات والطلبات الرسمية</p>
            </div>

            {/* Main Info Box - Increased Padding */}
            <div className="w-full space-y-5 bg-card/80 dark:bg-card/30 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-border dark:border-primary/10 text-center relative overflow-hidden group">
              <p className="text-xs md:text-sm text-foreground/60 leading-relaxed font-light max-w-2xl mx-auto">
                سواء كانت لديك استفسارات حول القصائد، أو طلبات لإقامة الفعاليات، أو رغبت فقط في إرسال دعواتكم، فنحن نرحب برسالتكم.
              </p>

              <div className="flex flex-col items-center gap-3">
                <a href="mailto:info@salehaldirazi.com" className="flex flex-col items-center gap-3 text-primary hover:text-primary/80 transition-all group/mail">
                  <div className="relative group overflow-hidden flex items-center justify-center w-9 h-9 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:bg-primary/10 cursor-pointer text-primary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs md:text-sm tracking-wider font-bold">info@salehaldirazi.com</span>
                </a>
              </div>
            </div>

            {/* Social Media Box - Increased Padding */}
            <div className="w-full space-y-5 bg-card/80 dark:bg-card/30 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-border dark:border-primary/10 text-center relative overflow-hidden group">
              <p className="text-xs md:text-sm text-foreground/60 leading-relaxed font-light max-w-2xl mx-auto">
                تواصل عبر الشبكات الإجتماعية
              </p>
              <div className="flex items-center justify-center space-x-4 space-x-reverse">
                {socialLinks.map((item, i) => (
                  <a
                    key={i}
                    href={item.href} // الآن سيتعرف على الرابط الموجود في الكائن
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group overflow-hidden flex items-center justify-center w-9 h-9 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:bg-primary/10 cursor-pointer text-primary"
                  >
                    <item.icon className="w-4 h-4" /> {/* استدعاء الأيقونة من الكائن */}
                  </a>
                ))}
              </div>
            </div>
          </FadeInSection>

          {/* Contact Form - Increased Padding and Spacing */}
          <FadeInSection delay={200} className="w-full">
            <form onSubmit={handleSubmit} className="w-full space-y-4 md:space-y-5 bg-card/80 dark:bg-card/30 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-border dark:border-primary/10 text-right relative overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl transition-all duration-700 pointer-events-none" />

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="h-12 md:h-14 px-6 rounded-full bg-card/40 dark:bg-card/20 backdrop-blur-md border border-border/40 dark:border-white/10 focus:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-2 placeholder:text-muted-foreground/50 placeholder:font-light text-sm md:text-base text-right transition-all outline-none text-foreground"
                  dir="rtl"
                />
                <Input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="h-12 md:h-14 px-6 rounded-full bg-card/40 dark:bg-card/20 backdrop-blur-md border border-border/40 dark:border-white/10 focus:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-2 placeholder:text-muted-foreground/50 placeholder:font-light text-sm md:text-base text-right transition-all outline-none text-foreground"
                  dir="rtl"
                />
              </div>

              <Input
                placeholder="موضوع الرسالة"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
                className="h-12 md:h-14 px-6 rounded-full bg-card/40 dark:bg-card/20 backdrop-blur-md border border-border/40 dark:border-white/10 focus:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-2 placeholder:text-muted-foreground/50 placeholder:font-light text-sm md:text-base text-right transition-all outline-none text-foreground"
                dir="rtl"
              />

              <Textarea
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className="min-h-[140px] md:min-h-[160px] p-5 md:p-6 rounded-[28px] bg-card/40 dark:bg-card/20 backdrop-blur-md border border-border/40 dark:border-white/10 focus:border-primary/50 focus-visible:ring-primary/20 focus-visible:ring-2 placeholder:text-muted-foreground/50 placeholder:font-light text-sm md:text-base text-right transition-all resize-none outline-none text-foreground"
                dir="rtl"
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] h-12 md:h-14 rounded-full font-bold transition-all duration-300 text-xs md:text-sm mt-2 flex items-center justify-center gap-2 group/submit shadow-lg shadow-primary/10 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover/submit:-translate-x-1 transition-transform duration-300" />
                    <span>إرسال الرسالة</span>
                  </>
                )}
              </Button>
            </form>
          </FadeInSection>

          {/* Separator before Statistics */}
          <div className="w-full pt-10 border-t border-primary/5" />

          {/* Statistics Section - Proportional scaling with boxes */}
          <FadeInSection delay={300} className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-card/20 backdrop-blur-3xl border border-primary/10 hover:border-primary/40 rounded-[2rem] p-6 md:p-8 text-center transition-all duration-500 hover:-translate-y-1">
                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-1">{stat.value}</h3>
                  <p className="text-xs md:text-sm text-foreground/60 leading-relaxed font-light max-w-2xl mx-auto">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </div>

        <footer className="mt-16 pt-10 border-t border-primary/5 px-6">
          <div className="flex items-center justify-center gap-3 py-6">
            <p className="text-foreground/30 text-[0.65rem] tracking-widest font-light">
              جميع الحقوق محفوظة © {new Date().getFullYear()} | صالح الدرازي
            </p>
            <ThemeSwitcher />
          </div>
        </footer>
      </div>
    </section>
  );
}
