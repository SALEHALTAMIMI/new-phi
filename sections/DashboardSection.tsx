import React from 'react';
import { Section } from '../types';
import { translations } from '../i18n';
import { UsageCounter } from '../components/UsageCounter';
import { useAppContext } from '../AppContext';

interface DashboardSectionProps {}

export const DashboardSection: React.FC<DashboardSectionProps> = () => {
  const { language, user, setActiveSection } = useAppContext();
  const t = translations[language];
  const { nav } = t;

  const currentUser = user!;

  const usageSections = [
    { section: Section.CV, title: nav.cv },
    { section: Section.SOP, title: nav.sop },
    { section: Section.CERTIFICATES, title: nav.certificates },
    { section: Section.INTERVIEW, title: nav.interview },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-text-light mb-4">
        {t.dashboard.welcome}, {currentUser.name}!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <h2 className="text-xl font-bold text-text-light mb-3">{t.dashboard.myPlan}</h2>
            <div className="bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold text-center py-3 px-4 rounded-lg text-lg">
              {currentUser.plan} Plan
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <h2 className="text-xl font-bold text-text-light mb-4">{t.dashboard.myUsage}</h2>
            <div className="space-y-4">
              {usageSections.map(({ section, title }) => {
                const usage = currentUser.usage[section] ?? { used: 0, total: 0 };
                return <UsageCounter key={section} used={usage.used} total={usage.total} featureText={title} />;
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
          <h2 className="text-2xl font-bold text-text-light mb-6">{t.dashboard.quickActions}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setActiveSection(Section.CV)} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl text-start transition-colors border border-glass-border">
              <h3 className="text-xl font-bold text-accent-end">{nav.cv}</h3>
              <p className="text-text-muted mt-1">Evaluate or rewrite your CV to pass ATS scans.</p>
            </button>
            <button onClick={() => setActiveSection(Section.SOP)} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl text-start transition-colors border border-glass-border">
              <h3 className="text-xl font-bold text-accent-end">{nav.sop}</h3>
              <p className="text-text-muted mt-1">Craft a compelling Statement of Purpose.</p>
            </button>
            <button onClick={() => setActiveSection(Section.INTERVIEW)} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl text-start transition-colors border border-glass-border">
              <h3 className="text-xl font-bold text-accent-end">{nav.interview}</h3>
              <p className="text-text-muted mt-1">Practice with our interview simulator.</p>
            </button>
            <button onClick={() => setActiveSection(Section.CERTIFICATES)} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl text-start transition-colors border border-glass-border">
              <h3 className="text-xl font-bold text-accent-end">{nav.certificates}</h3>
              <p className="text-text-muted mt-1">Generate professional descriptions for your courses.</p>
            </button>
            <button onClick={() => setActiveSection(Section.BOOKING)} className="p-6 bg-white/5 hover:bg-accent-end/10 rounded-xl text-start transition-colors border border-transparent hover:border-accent-end/30">
              <h3 className="text-xl font-bold text-accent-start">{nav.booking}</h3>
              <p className="text-text-muted mt-1">Get 1-on-1 help from a scholarship expert.</p>
            </button>
             <button onClick={() => setActiveSection(Section.PRICING)} className="p-6 bg-white/5 hover:bg-white/10 rounded-xl text-start transition-colors border border-glass-border">
              <h3 className="text-xl font-bold text-accent-end">{nav.pricing}</h3>
              <p className="text-text-muted mt-1">View or upgrade your current plan.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};