import React, { useState } from 'react';
import { Language, Section } from '../types';
import { translations } from '../i18n';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';
import { useAppContext } from '../AppContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, activeSection, setActiveSection, user, logout, whiteLogoUrl } = useAppContext();
  const t = translations[language];

  const toggleLanguage = () => {
    const newLang = language === Language.EN ? Language.AR : Language.EN;
    setLanguage(newLang);
  };

  const publicLinks = [
    { section: Section.HOME, label: t.nav.home },
    { section: Section.PRICING, label: t.nav.pricing },
    { section: Section.FAQ, label: t.nav.faq },
  ];

  const privateLinks = [
    { section: Section.DASHBOARD, label: t.nav.dashboard },
    { section: Section.TOOLS, label: t.nav.tools },
    { section: Section.BOOKING, label: t.nav.booking },
  ];
  
  const navLinks = user ? privateLinks : publicLinks;

  const handleNavClick = (section: Section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <button
          key={link.section}
          onClick={() => handleNavClick(link.section)}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
            activeSection === link.section
              ? 'text-accent-end bg-white/10'
              : 'text-text-light hover:bg-white/5'
          } whitespace-nowrap`}
        >
          {link.label}
        </button>
      ))}
      {user?.isAdmin && (
         <button
          onClick={() => handleNavClick(Section.ADMIN_DASHBOARD)}
          className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
            activeSection === Section.ADMIN_DASHBOARD
              ? 'text-accent-end bg-white/10'
              : 'text-text-light hover:bg-white/5'
          } whitespace-nowrap border-l border-glass-border`}
        >
          {t.nav.adminDashboard}
        </button>
      )}
    </>
  );

  return (
    <header className="bg-white/5 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-glass-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => setActiveSection(Section.HOME)} className="flex items-center gap-2 text-text-light text-2xl font-bold font-cairo">
              <img src={whiteLogoUrl} alt="Phi Logo" className="h-8 w-auto" />
            </button>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
            <NavItems />
             {user ? (
                <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-text-light bg-red-600/50 rounded-md hover:bg-red-600/80 transition-colors">
                    {t.nav.logout}
                </button>
            ) : (
                <button onClick={() => setActiveSection(Section.LOGIN)} className="px-4 py-2 text-sm font-semibold text-night-start bg-gradient-to-r from-accent-start to-accent-end rounded-md hover:opacity-90 transition-opacity">
                    {t.nav.login}
                </button>
            )}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 text-sm font-semibold text-text-light bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              {t.langSwitcher}
            </button>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 me-2 text-sm font-semibold text-text-light bg-white/10 rounded-md hover:bg-white/20 transition-colors"
            >
              {t.langSwitcher}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-light">
              {isMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-night-start/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <NavItems />
             {user ? (
                <button onClick={logout} className="w-full mt-2 px-4 py-2 text-sm font-semibold text-text-light bg-red-600/50 rounded-md hover:bg-red-600/80 transition-colors">
                    {t.nav.logout}
                </button>
            ) : (
                <button onClick={() => { setActiveSection(Section.LOGIN); setIsMenuOpen(false); }} className="w-full mt-2 px-4 py-2 text-sm font-semibold text-night-start bg-gradient-to-r from-accent-start to-accent-end rounded-md hover:opacity-90 transition-opacity">
                    {t.nav.login}
                </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};