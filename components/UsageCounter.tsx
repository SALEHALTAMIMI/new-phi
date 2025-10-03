import React from 'react';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';

interface UsageCounterProps {
  used: number;
  total: number;
  featureText: string;
}

export const UsageCounter: React.FC<UsageCounterProps> = ({ used, total, featureText }) => {
  const { language } = useAppContext();
  const remaining = total - used;
  const t = translations[language];

  return (
    <div className="bg-white/5 p-3 rounded-lg text-center border border-glass-border">
      <p className="text-text-muted font-semibold">{featureText}</p>
      <p className="text-2xl font-bold text-text-light">
        {remaining} / {total}
      </p>
      <p className="text-sm text-text-muted">{t.cv.usage}</p>
    </div>
  );
};