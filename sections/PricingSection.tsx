import React from 'react';
import { PlanDetails } from '../types';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';

interface PricingSectionProps {}

const TickIcon = () => (
  <svg className="w-6 h-6 text-accent-end me-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

const PlanCard: React.FC<{plan: PlanDetails, subscriptionUrl: string, t: any}> = ({ plan, subscriptionUrl, t }) => {
    const { language } = useAppContext();
    return (
        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 flex flex-col border transition-all duration-300 ${plan.isPopular ? 'border-accent-end shadow-2xl relative scale-105' : 'border-glass-border hover:border-white/30'}`}>
            {plan.isPopular && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent-start to-accent-end text-night-start px-4 py-1 rounded-full font-semibold text-sm">{t.pricing.mostPopular}</div>}
            <h3 className="text-2xl font-bold text-text-light">{plan.name[language]}</h3>
            <p className="mt-4">
                <span className="text-4xl font-extrabold text-text-light">{plan.price}</span>
                <span className="text-text-muted"> / {t.pricing.monthly}</span>
            </p>
            <ul className="mt-6 space-y-4 text-text-muted flex-grow">
                {plan.features[language].map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <TickIcon />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <a href={subscriptionUrl} target="_blank" rel="noopener noreferrer" className={`w-full text-center block mt-8 py-3 px-6 font-semibold rounded-lg transition-all transform hover:scale-105 ${plan.isPopular ? 'bg-gradient-to-r from-accent-start to-accent-end text-night-start' : 'bg-white/10 text-text-light hover:bg-white/20'}`}>
                {t.pricing.getStarted}
            </a>
        </div>
    );
};


export const PricingSection: React.FC<PricingSectionProps> = () => {
  const { language, plans, subscriptionUrl } = useAppContext();
  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-text-light mb-2">{t.pricing.title}</h1>
      <p className="text-center text-text-muted mb-16 max-w-2xl mx-auto">{t.pricing.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
        {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} subscriptionUrl={subscriptionUrl} t={t} />
        ))}
      </div>
    </div>
  );
};