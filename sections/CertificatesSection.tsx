import React, { useState } from 'react';
import { Section } from '../types';
import { translations } from '../i18n';
import { getCertificateDescription } from '../services/geminiService';
import { UsageCounter } from '../components/UsageCounter';
import { useAppContext } from '../AppContext';

interface CertificatesSectionProps {}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2 animate-pulse" dir="ltr">
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
    </div>
);

export const CertificatesSection: React.FC<CertificatesSectionProps> = () => {
  const { language, user } = useAppContext();
  const t = translations[language];
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [certName, setCertName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDuration, setCertDuration] = useState('');
  const [certDesc, setCertDesc] = useState('');
  
  const currentUser = user!;
  const usageData = currentUser.usage[Section.CERTIFICATES] || { used: 0, total: 10 };

  const handleGenerate = async () => {
    if(!certName || !certIssuer) return;
    setIsLoading(true);
    setIsGenerated(false);
    setError('');

    try {
        const result = await getCertificateDescription(certName, certIssuer, certDuration, certDesc, language);
        setShortDesc(result.short);
        setLongDesc(result.long);
        setIsGenerated(true);
    } catch(e) {
        setError(t.common.aiError);
        setIsGenerated(true);
    } finally {
        setIsLoading(false);
    }
  };
  
  const InputField: React.FC<{label: string, id: string, value: string, onChange: (val: string) => void, placeholder?: string}> = ({label, id, value, onChange, placeholder}) => (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-muted mb-1">{label}</label>
        <input type="text" id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light placeholder-text-muted/50 focus:ring-2 focus:ring-accent-end" placeholder={placeholder} />
      </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-text-light mb-2">{t.certificates.title}</h1>
      <p className="text-center text-text-muted mb-8 max-w-2xl mx-auto">{t.certificates.prompt}</p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg space-y-4 h-fit">
          <InputField id="cert-name" label={t.certificates.name} value={certName} onChange={setCertName} placeholder="e.g., Google Project Management" />
          <InputField id="cert-issuer" label={t.certificates.issuer} value={certIssuer} onChange={setCertIssuer} placeholder="e.g., Coursera / Google" />
          <InputField id="cert-duration" label={t.certificates.duration} value={certDuration} onChange={setCertDuration} placeholder={t.certificates.duration} />
          
           <div>
              <label htmlFor="cert-desc" className="block text-sm font-medium text-text-muted mb-1">{t.certificates.description}</label>
              <textarea id="cert-desc" rows={3} value={certDesc} onChange={(e) => setCertDesc(e.target.value)} className="w-full p-2 bg-white/5 border border-glass-border rounded-lg text-text-light focus:ring-2 focus:ring-accent-end"></textarea>
           </div>
           
           <button onClick={handleGenerate} disabled={isLoading || !certName || !certIssuer} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-4 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all">
            {isLoading ? t.common.loading : t.certificates.generate}
           </button>
           <UsageCounter used={usageData.used} total={usageData.total} featureText={t.certificates.generate} />
        </div>

        <div className="lg:col-span-3 space-y-6">
            {isLoading && (
                 <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg flex flex-col items-center justify-center min-h-[300px]">
                    <LoadingSpinner />
                    <p className="mt-4 text-text-muted">{t.common.loading}</p>
                 </div>
            )}
            {isGenerated && !isLoading && (
              <>
                {error ? (
                     <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/30">
                        <p className="text-red-300 text-center">{error}</p>
                    </div>
                ) : (
                    <>
                    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
                        <h3 className="text-xl font-bold text-accent-end mb-3">{t.certificates.shortVersion}</h3>
                        <p className="bg-black/20 p-4 rounded-lg text-text-light border border-glass-border">{shortDesc}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
                        <h3 className="text-xl font-bold text-accent-end mb-3">{t.certificates.longVersion}</h3>
                        <p className="bg-black/20 p-4 rounded-lg text-text-light border border-glass-border">{longDesc}</p>
                    </div>
                    </>
                )}
              </>
            )}
            {!isGenerated && !isLoading && (
                 <div className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-glass-border">
                    <p className="text-text-muted">Phi Assistant's descriptions will appear here.</p>
                 </div>
            )}
        </div>

      </div>
    </div>
  );
};