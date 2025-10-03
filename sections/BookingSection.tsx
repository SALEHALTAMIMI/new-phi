import React, { useState } from 'react';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';

interface BookingSectionProps {}

export const BookingSection: React.FC<BookingSectionProps> = () => {
  const { language } = useAppContext();
  const t = translations[language];
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };
  
  const InputField: React.FC<{label: string, id: string, type?: string, required?: boolean}> = ({label, id, type = 'text', required = false}) => (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted mb-1">{label}</label>
        <input type={type} id={id} required={required} className="w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light focus:ring-2 focus:ring-accent-end" />
      </div>
  );

  if (isSubmitted) {
    return (
        <div className="container mx-auto px-4 py-16 text-center">
            <div className="bg-white/10 backdrop-blur-lg p-12 rounded-2xl border border-glass-border shadow-lg max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold text-accent-end mb-4">✅</h2>
                <p className="text-xl text-text-light">{t.booking.form.success}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-text-light mb-8">{t.booking.title}</h1>
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-glass-border shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
            <InputField id="name" label={t.booking.form.name} required />
            <InputField id="email" label={t.booking.form.email} type="email" required />
            <InputField id="phone" label={t.booking.form.phone} type="tel" />
            <div>
                <label htmlFor="consultation-type" className="block text-sm font-medium text-text-muted mb-1">{t.booking.form.type}</label>
                <select id="consultation-type" required className="w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light focus:ring-2 focus:ring-accent-end">
                    <option value="cv">{t.booking.form.cvReview}</option>
                    <option value="sop">{t.booking.form.sopGuidance}</option>
                    <option value="interview">{t.booking.form.interviewCoaching}</option>
                    <option value="general">{t.booking.form.general}</option>
                </select>
            </div>
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-text-muted mb-1">{t.booking.form.summary}</label>
              <textarea id="summary" rows={4} required className="w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light focus:ring-2 focus:ring-accent-end"></textarea>
           </div>
           <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-lg">
               {t.booking.form.submit}
           </button>
        </form>
      </div>
    </div>
  );
};