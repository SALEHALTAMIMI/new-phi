export enum Language {
  EN = 'en',
  AR = 'ar',
}

export enum Section {
  HOME = 'home',
  CV = 'cv',
  SOP = 'sop',
  CERTIFICATES = 'certificates',
  INTERVIEW = 'interview',
  TOOLS = 'tools',
  FAQ = 'faq',
  BOOKING = 'booking',
  PRICING = 'pricing',
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  ADMIN_DASHBOARD = 'admin_dashboard',
  APPLICATION_REVIEW = 'application_review',
}

export enum Plan {
    FREE = 'FREE',
    PRO = 'PRO',
    PREMIUM = 'PREMIUM'
}

export interface PlanDetails {
    id: Plan;
    name: { [key in Language]: string };
    price: string;
    features: { [key in Language]: string[] };
    isPopular?: boolean;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Only for mock data
    plan: Plan;
    isAdmin?: boolean;
    usage: {
        [key in Section]?: {
            used: number;
            total: number;
        }
    };
}

export interface Scholarship {
    id: number;
    title: { [key in Language]: string };
    university: string;
    country: { [key in Language]: string };
    countryCode: string; // e.g., "US", "CA", "DE"
    deadline: string;
    level: { [key in Language]: string };
    specialty: { [key in Language]: string };
    isOpen: boolean;
    isOpeningSoon: boolean;
    summary: { [key in Language]: string };
    requirements: { [key in Language]: string[] };
    benefits: { [key in Language]: string[] };
    applyLink: string;
}