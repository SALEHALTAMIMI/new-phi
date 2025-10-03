import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Homepage } from './sections/Homepage';
import { CvSection } from './sections/CvSection';
import { SopSection } from './sections/SopSection';
import { CertificatesSection } from './sections/CertificatesSection';
import { InterviewSection } from './sections/InterviewSection';
import { ToolsSection } from './sections/ToolsSection';
import { FaqSection } from './sections/FaqSection';
import { BookingSection } from './sections/BookingSection';
import { PricingSection } from './sections/PricingSection';
import { LoginSection } from './sections/LoginSection';
import { DashboardSection } from './sections/DashboardSection';
import { AdminDashboardSection } from './sections/AdminDashboardSection';
import { Section } from './types';
import { AppContextProvider, useAppContext } from './AppContext';

const publicSections = new Set([Section.HOME, Section.PRICING, Section.FAQ, Section.LOGIN]);

const MainContent: React.FC = () => {
    const { activeSection, user } = useAppContext();

    const renderSection = () => {
        // If trying to access a private section while logged out, show Login
        if (!publicSections.has(activeSection) && !user) {
            return <LoginSection />;
        }
        
        // Admin Dashboard Route
        if (activeSection === Section.ADMIN_DASHBOARD) {
            return user?.isAdmin ? <AdminDashboardSection /> : <DashboardSection />;
        }

        switch (activeSection) {
            case Section.HOME:
                return <Homepage />;
            case Section.CV:
                return <CvSection />;
            case Section.SOP:
                return <SopSection />;
            case Section.CERTIFICATES:
                return <CertificatesSection />;
            case Section.INTERVIEW:
                return <InterviewSection />;
            case Section.TOOLS:
                return <ToolsSection />;
            case Section.FAQ:
                return <FaqSection />;
            case Section.BOOKING:
                return <BookingSection />;
            case Section.PRICING:
                return <PricingSection />;
            case Section.LOGIN:
                // If already logged in, redirect from login to dashboard
                return user ? <DashboardSection /> : <LoginSection />;
            case Section.DASHBOARD:
                // If not logged in, redirect from dashboard to login
                return user ? <DashboardSection /> : <LoginSection />;
            default:
                return <Homepage />;
        }
    };

    return (
        <main className="flex-grow">
            {renderSection()}
        </main>
    );
};


const App: React.FC = () => {
    return (
        <AppContextProvider>
            <div className="flex flex-col min-h-screen bg-night-start text-text-light phi-app-background">
                <Header />
                <MainContent />
                <Footer />
            </div>
            <style>{`
                .phi-app-background {
                    background-color: #110E24;
                    background-image: linear-gradient(135deg, #110E24 0%, #4D368A 100%);
                }
            `}</style>
        </AppContextProvider>
    );
};

export default App;