import React from 'react';
import { Section } from '../types';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';
import { CvIcon } from '../components/icons/CvIcon';
import { SopIcon } from '../components/icons/SopIcon';
import { CertificateIcon } from '../components/icons/CertificateIcon';
import { InterviewIcon } from '../components/icons/InterviewIcon';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaText: string;
  onClick: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, ctaText, onClick }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg hover:border-white/30 transition-all duration-300 flex flex-col group text-center items-center">
      <div className="w-16 h-16 bg-gradient-to-br from-accent-start to-accent-end rounded-full flex items-center justify-center mb-4 text-night-start">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-text-light mb-2">{title}</h3>
      <p className="text-text-muted flex-grow">{description}</p>
      <button 
        onClick={onClick} 
        className="mt-6 w-full bg-white/10 text-text-light font-bold py-3 px-4 rounded-lg group-hover:bg-gradient-to-r group-hover:from-accent-start group-hover:to-accent-end group-hover:text-night-start group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent-end/20 transition-all duration-300"
      >
        {ctaText}
      </button>
    </div>
  );
};

export const ToolsSection: React.FC = () => {
  const { language, setActiveSection } = useAppContext();
  const t = translations[language].tools;

  const tools = [
    {
      id: 'cv',
      icon: <CvIcon className="w-8 h-8" />,
      title: t.cv.title,
      description: t.cv.description,
      cta: t.cv.cta,
      section: Section.CV,
    },
    {
      id: 'sop',
      icon: <SopIcon className="w-8 h-8" />,
      title: t.sop.title,
      description: t.sop.description,
      cta: t.sop.cta,
      section: Section.SOP,
    },
    {
      id: 'certificates',
      icon: <CertificateIcon className="w-8 h-8" />,
      title: t.certificates.title,
      description: t.certificates.description,
      cta: t.certificates.cta,
      section: Section.CERTIFICATES,
    },
    {
      id: 'interview',
      icon: <InterviewIcon className="w-8 h-8" />,
      title: t.interview.title,
      description: t.interview.description,
      cta: t.interview.cta,
      section: Section.INTERVIEW,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-text-light mb-2">{t.title}</h1>
      <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">{t.subtitle}</p>
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            ctaText={tool.cta}
            onClick={() => setActiveSection(tool.section)}
          />
        ))}
      </div>
    </div>
  );
};