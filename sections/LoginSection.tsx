import React, { useState } from 'react';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';
import { Section } from '../types';

interface LoginSectionProps {}

export const LoginSection: React.FC<LoginSectionProps> = () => {
  const { language, login, setActiveSection } = useAppContext();
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (!success) {
      setError(t.login.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-glass-border shadow-lg">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-text-light mb-2">{t.login.title}</h1>
            <p className="text-text-muted">{t.login.subtitle}</p>
        </div>
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-1">{t.login.email}</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-white/5 border border-glass-border rounded-lg text-text-light focus:ring-2 focus:ring-accent-end" 
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-text-muted mb-1">{t.login.password}</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="current-password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-white/5 border border-glass-border rounded-lg text-text-light focus:ring-2 focus:ring-accent-end" 
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" className="w-full bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity text-lg">
              {t.login.button}
            </button>
          </div>
        </form>
         <div className="mt-6 text-center">
            <button
              onClick={() => setActiveSection(Section.PRICING)}
              className="w-full bg-white/10 text-text-light font-semibold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors"
            >
              {t.login.getSubscription}
            </button>
        </div>
      </div>
    </div>
  );
};