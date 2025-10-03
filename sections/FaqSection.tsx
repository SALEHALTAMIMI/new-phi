import React, { useState } from 'react';
import { Section } from '../types';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';

interface FaqSectionProps {}

export const FaqSection: React.FC<FaqSectionProps> = () => {
  const { language, setActiveSection } = useAppContext();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  
  const faqData = {
      en: [
          { q: "How does the Phi Assistant CV evaluation work?", a: "Our assistant analyzes your CV against thousands of data points from successful applications and common Applicant Tracking Systems (ATS) to give you a score and actionable feedback." },
          { q: "Is my personal data safe?", a: "Yes, we use industry-standard encryption to protect all your data. Your documents are private and are only used to provide you with our services." },
          { q: "Can I get a refund if I'm not satisfied with a plan?", a: "We offer a 7-day money-back guarantee on all our premium plans. Please contact support for assistance." },
          { q: "How are the scholarship listings updated?", a: "Our system, powered by the Phi Assistant, continuously scans university websites and scholarship databases to provide you with the most up-to-date opportunities." }
      ],
      ar: [
          { q: "كيف يعمل تقييم السيرة الذاتية من مساعد فاي؟", a: "يقوم مساعدنا بتحليل سيرتك الذاتية مقابل آلاف النقاط البيانية من الطلبات الناجحة وأنظمة تتبع المتقدمين (ATS) الشائعة لمنحك درجة وملاحظات قابلة للتنفيذ." },
          { q: "هل بياناتي الشخصية آمنة؟", a: "نعم، نستخدم تشفيرًا متوافقًا مع معايير الصناعة لحماية جميع بياناتك. مستنداتك خاصة ولا تُستخدم إلا لتزويدك بخدماتنا." },
          { q: "هل يمكنني استرداد أموالي إذا لم أكن راضيًا عن الباقة؟", a: "نقدم ضمان استرداد الأموال لمدة 7 أيام على جميع باقاتنا المميزة. يرجى الاتصال بالدعم للمساعدة." },
          { q: "كيف يتم تحديث قوائم المنح الدراسية؟", a: "يقوم نظامنا، المدعوم بمساعد فاي، بمسح مواقع الجامعات وقواعد بيانات المنح الدراسية باستمرار لتزويدك بأحدث الفرص المتاحة." }
      ]
  };

  const filteredFaqs = faqData[language].filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-text-light mb-4">{t.faq.title}</h1>
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.faq.searchPlaceholder}
            className="w-full p-4 pe-12 bg-white/10 border border-glass-border rounded-full text-text-light placeholder-text-muted focus:ring-2 focus:ring-accent-end"
            aria-label={t.faq.searchPlaceholder}
          />
        </div>
        
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <details key={index} className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-sm group border border-glass-border" open={index === 0}>
                <summary className="font-semibold text-lg text-text-light cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <span className="group-open:rotate-180 transition-transform text-accent-end">▼</span>
                </summary>
                <p className="text-text-muted mt-2 pt-2 border-t border-glass-border">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border">
            <h3 className="font-semibold text-xl text-text-light">{t.faq.notFound}</h3>
            <button onClick={() => setActiveSection(Section.BOOKING)} className="mt-4 bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity">
                {t.faq.contactExpert}
            </button>
        </div>
      </div>
    </div>
  );
};