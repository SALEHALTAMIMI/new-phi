import React, { useState } from 'react';
import { Section } from '../types';
import { translations } from '../i18n';
import { generateContent } from '../services/geminiService';
import { UsageCounter } from '../components/UsageCounter';
import { useAppContext } from '../AppContext';

interface CvSectionProps {}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2 animate-pulse" dir="ltr">
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full animation-delay-200"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full animation-delay-400"></div>
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


export const CvSection: React.FC<CvSectionProps> = () => {
  const { language, user } = useAppContext();
  const t = translations[language];
  const [cvText, setCvText] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentUser = user!;
  
  const handleAiAction = async (action: 'evaluate' | 'rewrite') => {
    if (!cvText) return;
    setIsLoading(true);
    setAiResult('');
    setError('');
    
    const actionText = t.cv[action];
    const langInstructions = `(Respond in ${language === 'ar' ? 'Arabic' : 'English'})`;
    const prompt = `Act as an expert career coach for the Phi platform. ${actionText} the following CV: \n\n---\n\n${cvText}\n\n---\n\n${langInstructions}`;

    try {
        const result = await generateContent(prompt);
        setAiResult(result);
    } catch (e) {
        setError(t.common.aiError);
    } finally {
        setIsLoading(false);
    }
  };
  
  const usageData = currentUser.usage[Section.CV] || { used: 0, total: 5 };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-text-light mb-8">{t.cv.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <TipsSection tips={t.cv.tips} />
            <p className="text-text-light mb-4">{t.cv.uploadPrompt}</p>
            <input type="file" className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-end/10 file:text-accent-end hover:file:bg-accent-end/20"/>
            <textarea
              className="w-full mt-4 p-3 bg-white/5 border border-glass-border rounded-xl h-64 text-text-light placeholder-text-muted focus:ring-2 focus:ring-accent-end focus:border-transparent transition"
              placeholder={t.cv.pastePlaceholder}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              aria-label={t.cv.pastePlaceholder}
            ></textarea>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
             <h3 className="text-xl font-bold text-text-light mb-4">{t.cv.actions}</h3>
             <div className="grid grid-cols-1 gap-4">
                <UsageCounter used={usageData.used} total={usageData.total} featureText={t.cv.evaluate} />
                <button onClick={() => handleAiAction('evaluate')} disabled={isLoading || !cvText} className="w-full bg-white/10 border border-glass-border text-text-light font-semibold py-3 px-4 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors">
                  {t.cv.evaluate}
                </button>
                 <button onClick={() => handleAiAction('rewrite')} disabled={isLoading || !cvText} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all">
                  {t.cv.rewrite}
                </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div>
                    <h3 className="text-xl font-bold text-text-light mb-2">{t.cv.before}</h3>
                    <div className="bg-black/20 p-4 rounded-xl h-[calc(100%-2.5rem)] overflow-y-auto border border-glass-border">
                        <p className="text-text-muted whitespace-pre-wrap">{cvText || "Your CV content will appear here."}</p>
                    </div>
                </div>
                 <div>
                    <h3 className="text-xl font-bold text-accent-end mb-2">{t.cv.after}</h3>
                    <div className="bg-accent-end/5 p-4 rounded-xl h-[calc(100%-2.5rem)] overflow-y-auto border border-accent-end/20">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <LoadingSpinner />
                                <p className="mt-4 text-text-muted">{t.common.loading}</p>
                            </div>
                        ) : (
                             <p className="text-text-light whitespace-pre-wrap">{error || aiResult || "Phi Assistant's improvements will be shown here."}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};