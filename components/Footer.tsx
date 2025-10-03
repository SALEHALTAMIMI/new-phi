import React from 'react';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';

export const Footer: React.FC = () => {
  const { language } = useAppContext();
  const t = translations[language];

  return (
    <footer className="bg-night-start/50 text-text-muted mt-auto border-t border-glass-border">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} {t.appName}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};