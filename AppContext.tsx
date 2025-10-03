import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Language, Section, Plan, User, PlanDetails } from './types';

// Default initial plans, admin can override these
const initialPlans: PlanDetails[] = [
    {
        id: Plan.FREE,
        name: { en: 'Explorer', ar: 'المستكشف' },
        price: '$0',
        features: {
            en: ['3 CV Analyses', '3 SOP Analyses'],
            ar: ['3 تحليلات للسيرة الذاتية', '3 تحليلات لخطاب الدافع']
        }
    },
    {
        id: Plan.PRO,
        name: { en: 'Navigator', ar: 'الملاح' },
        price: '$20',
        features: {
            en: ['15 CV Analyses', '15 SOP Analyses', '1 Expert Consultation', '1 Full Application Review'],
            ar: ['15 تحليل للسيرة الذاتية', '15 تحليل لخطاب الدافع', '1 استشارة مع خبير', '1 تقييم كامل لملف التقديم']
        },
        isPopular: true,
    },
    {
        id: Plan.PREMIUM,
        name: { en: 'Stellar', ar: 'النجمي' },
        price: '$50',
        features: {
            en: ['100 CV Analyses', '100 SOP Analyses', '3 Expert Consultations', '3 Full Application Reviews'],
            ar: ['100 تحليل للسيرة الذاتية', '100 تحليل لخطاب الدافع', '3 استشارات مع خبير', '3 تقييمات كاملة لملفات التقديم']
        }
    }
];


// Mock user database
const initialUsers: User[] = [
    {
        id: '1',
        name: 'Ahmed',
        email: 'ahmed@example.com',
        password: 'password123',
        plan: Plan.PRO,
        usage: {
            [Section.CV]: { used: 1, total: 15 },
            [Section.SOP]: { used: 3, total: 15 },
            [Section.BOOKING]: { used: 0, total: 1 },
            [Section.APPLICATION_REVIEW]: { used: 0, total: 1 },
        }
    },
     {
        id: '2',
        name: 'Fatima',
        email: 'fatima@example.com',
        password: 'password123',
        plan: Plan.FREE,
        usage: {
            [Section.CV]: { used: 1, total: 3 },
            [Section.SOP]: { used: 1, total: 3 },
            [Section.BOOKING]: { used: 0, total: 0 },
            [Section.APPLICATION_REVIEW]: { used: 0, total: 0 },
        }
    },
    {
        id: '3',
        name: 'Admin User',
        email: 'admin@phi.com',
        password: 'admin123',
        plan: Plan.PREMIUM,
        isAdmin: true,
        usage: {
            [Section.CV]: { used: 0, total: 999 },
            [Section.SOP]: { used: 0, total: 999 },
            [Section.BOOKING]: { used: 0, total: 999 },
            [Section.APPLICATION_REVIEW]: { used: 0, total: 999 },
        }
    }
];

interface AppContextState {
    language: Language;
    user: User | null;
    users: User[];
    activeSection: Section;
    logoUrl: string;
    whiteLogoUrl: string;
    plans: PlanDetails[];
    subscriptionUrl: string;
}

interface AppContextType extends AppContextState {
    setLanguage: (language: Language) => void;
    setActiveSection: (section: Section) => void;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
    addUser: (user: Omit<User, 'id' | 'usage'>) => void;
    updateUser: (user: User) => void;
    deleteUser: (userId: string) => void;
    updateLogos: (logos: { colorLogo: string; whiteLogo: string }) => void;
    updatePlans: (newPlans: PlanDetails[]) => void;
    updateSubscriptionUrl: (newUrl: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultColorLogo = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#FFC700"/><path d="M50 30 v40 M35 50 h30" stroke="#110E24" stroke-width="8" stroke-linecap="round"/></svg>')}`;
const defaultWhiteLogo = `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#F0E8FF" stroke-width="8"/><path d="M50 30 v40 M35 50 h30" stroke="#F0E8FF" stroke-width="8" stroke-linecap="round"/></svg>')}`;

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(Language.AR);
    const [activeSection, setActiveSection] = useState<Section>(Section.HOME);
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [logoUrl, setLogoUrl] = useState<string>(defaultColorLogo);
    const [whiteLogoUrl, setWhiteLogoUrl] = useState<string>(defaultWhiteLogo);
    const [plans, setPlans] = useState<PlanDetails[]>(initialPlans);
    const [subscriptionUrl, setSubscriptionUrl] = useState<string>('https://example.com/subscribe');


    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        const body = document.body;
        if (language === 'ar') {
            body.classList.add('font-cairo');
            body.classList.remove('font-sans');
        } else {
            body.classList.add('font-sans');
            body.classList.remove('font-cairo');
        }
    }, [language]);

    const login = (email: string, pass: string): boolean => {
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
        if (foundUser) {
            setUser(foundUser);
            setActiveSection(foundUser.isAdmin ? Section.ADMIN_DASHBOARD : Section.DASHBOARD);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        setActiveSection(Section.HOME);
    };

    const addUser = (newUser: Omit<User, 'id'| 'usage'>) => {
        // This is a simplified usage assignment. A real app would have this logic server-side.
        const planUsage = {
            [Plan.FREE]: { [Section.CV]: 3, [Section.SOP]: 3, [Section.BOOKING]: 0, [Section.APPLICATION_REVIEW]: 0 },
            [Plan.PRO]: { [Section.CV]: 15, [Section.SOP]: 15, [Section.BOOKING]: 1, [Section.APPLICATION_REVIEW]: 1 },
            [Plan.PREMIUM]: { [Section.CV]: 100, [Section.SOP]: 100, [Section.BOOKING]: 3, [Section.APPLICATION_REVIEW]: 3 },
        };
        const totals = planUsage[newUser.plan];
        
        const userWithId: User = {
            ...newUser,
            id: new Date().toISOString(),
            usage: {
                [Section.CV]: { used: 0, total: totals[Section.CV] },
                [Section.SOP]: { used: 0, total: totals[Section.SOP] },
                [Section.BOOKING]: { used: 0, total: totals[Section.BOOKING] },
                [Section.APPLICATION_REVIEW]: { used: 0, total: totals[Section.APPLICATION_REVIEW] },
            }
        };
        setUsers(prev => [...prev, userWithId]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        if(user?.id === updatedUser.id) {
            setUser(updatedUser);
        }
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };
    
    const updateLogos = (logos: { colorLogo: string; whiteLogo: string }) => {
        setLogoUrl(logos.colorLogo);
        setWhiteLogoUrl(logos.whiteLogo);
    };
    
    const updatePlans = (newPlans: PlanDetails[]) => {
        setPlans(newPlans);
    };

    const updateSubscriptionUrl = (newUrl: string) => {
        setSubscriptionUrl(newUrl);
    };

    const value: AppContextType = {
        language,
        user,
        users,
        activeSection,
        logoUrl,
        whiteLogoUrl,
        plans,
        subscriptionUrl,
        setLanguage,
        setActiveSection,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        updateLogos,
        updatePlans,
        updateSubscriptionUrl,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};