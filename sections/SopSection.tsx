import React, { useState } from 'react';
import { Section } from '../types';
import { translations } from '../i18n';
import { generateContent } from '../services/geminiService';
import { UsageCounter } from '../components/UsageCounter';
import { useAppContext } from '../AppContext';

interface SopSectionProps {}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2 animate-pulse" dir="ltr">
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
    </div>
);

const TipsSection: React.FC<{tips: {title: string, tip1: string, tip2: string, tip3: string, tip4: string, tip5: string}}> = ({ tips }) => (
    <div className="bg-white/5 border border-glass-border p-4 rounded-xl mb-6">
        <h4 className="font-bold text-accent-end mb-2">{tips.title}</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-text-muted">
             {Object.values(tips).slice(1).map((tip, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: (tip as string).replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-light">$1</strong>') }} />
            ))}
        </ul>
    </div>
);

export const SopSection: React.FC<SopSectionProps> = () => {
  const { language, user } = useAppContext();
  const t = translations[language];
  const [sopText, setSopText] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [style, setStyle] = useState('academic');
  const [error, setError] = useState('');

  const currentUser = user!;
  
  const usageData = currentUser.usage[Section.SOP] || { used: 0, total: 5 };

  const handleAiAction = async (action: 'evaluate' | 'rewrite') => {
    if (!sopText) return;
    setIsLoading(true);
    setAiResult('');
    setError('');
    
    const actionText = t.sop[action];
    const langInstructions = `(Respond in ${language === 'ar' ? 'Arabic' : 'English'})`;
    const styleInstructions = `The writing style should be ${style}.`;
    const prompt = `Act as an expert academic advisor for Phi. ${actionText} the following Statement of Purpose (SOP). ${styleInstructions}\n\n---\n\n${sopText}\n\n---\n\n${langInstructions}`;

    try {
        const result = await generateContent(prompt);
        setAiResult(result);
    } catch(e) {
        setError(t.common.aiError);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-text-light mb-8">{t.sop.title}</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="lg:w-1/2 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <TipsSection tips={t.sop.tips} />
           <p className="text-text-light mb-4">{t.sop.uploadPrompt}</p>
           <textarea
              className="w-full mt-2 p-3 bg-white/5 border border-glass-border rounded-xl h-96 text-text-light placeholder-text-muted focus:ring-2 focus:ring-accent-end focus:border-transparent transition"
              placeholder={t.sop.pastePlaceholder}
              value={sopText}
              onChange={(e) => setSopText(e.target.value)}
              aria-label={t.sop.pastePlaceholder}
            ></textarea>
        </div>

        <div className="lg:w-1/2 space-y-6">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
                <h3 className="text-xl font-bold text-text-light mb-4">{t.sop.actions}</h3>
                <div className="mb-4">
                    <label htmlFor="sop-style-select" className="block text-sm font-medium text-text-muted mb-2">{t.sop.style}</label>
                    <select id="sop-style-select" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light">
                        <option value="academic">{t.sop.academic}</option>
                        <option value="formal">{t.sop.formal}</option>
                        <option value="personal">{t.sop.personal}</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => handleAiAction('evaluate')} disabled={isLoading || !sopText} className="w-full bg-white/10 border border-glass-border text-text-light font-semibold py-3 px-4 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors">
                        {t.sop.evaluate}
                    </button>
                    <button onClick={() => handleAiAction('rewrite')} disabled={isLoading || !sopText} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all">
                        {t.sop.rewrite}
                    </button>
                </div>
                 <div className="mt-4">
                    <UsageCounter used={usageData.used} total={usageData.total} featureText={t.sop.actions} />
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg h-64 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <LoadingSpinner />
                        <p className="mt-4 text-text-muted">{t.common.loading}</p>
                    </div>
                ) : (
                    <p className="text-text-light whitespace-pre-wrap">{error || aiResult || "Phi Assistant's generated content will appear here."}</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};