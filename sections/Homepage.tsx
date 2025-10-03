import React, { useState, useEffect, useMemo } from 'react';
import { Scholarship, Section } from '../types';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';
import { searchScholarships, fetchHomepageScholarships } from '../services/scholarshipService';
import { ScholarshipModal } from '../components/ScholarshipModal';
import { Flag } from '../components/Flag';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';


const ScholarshipCard: React.FC<{ scholarship: Scholarship, onSelect: (s: Scholarship) => void, t: any }> = ({ scholarship, onSelect, t }) => {
    const { language } = useAppContext();
    return (
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg hover:border-white/30 transition-all duration-300 flex flex-col group">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-text-light">{scholarship.title[language]}</h3>
                <Flag countryCode={scholarship.countryCode} />
            </div>
            <p className="text-text-muted">{scholarship.university}</p>
            <p className="text-text-light font-semibold">{scholarship.country[language]}</p>
            <div className="flex-grow mt-2">
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-accent-end bg-accent-end/10">
                    {scholarship.specialty[language]}
                </span>
                 <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-text-light bg-white/10 ms-1">
                    {scholarship.level[language]}
                </span>
            </div>
            <p className="text-sm mt-4 text-text-muted">{t.homepage.deadline}: <span className="font-medium text-red-400">{scholarship.deadline}</span></p>
            <button onClick={() => onSelect(scholarship)} className="mt-4 w-full bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-2 px-4 rounded-lg group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent-end/20 transition-all duration-300">
                {t.homepage.viewScholarship}
            </button>
        </div>
    );
};

const ScholarshipCardSkeleton: React.FC = () => (
    <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg animate-pulse">
        <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-white/20 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-white/20 rounded w-1/3 mb-4"></div>
        <div className="flex space-x-2 mb-4">
            <div className="h-5 bg-white/20 rounded-full w-24"></div>
            <div className="h-5 bg-white/20 rounded-full w-20"></div>
        </div>
        <div className="h-4 bg-white/20 rounded w-full mb-4"></div>
        <div className="h-10 bg-white/30 rounded-lg w-full"></div>
    </div>
);

const SuccessStoryCard: React.FC<{ name: string; story: string; imgSrc: string }> = ({ name, story, imgSrc }) => (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-glass-border shadow-lg p-6 flex flex-col items-center text-center">
        <img src={imgSrc} alt={name} className="w-24 h-24 rounded-full mb-4 object-cover border-2 border-accent-end" />
        <h4 className="font-bold text-lg text-accent-end">{name}</h4>
        <p className="text-text-muted mt-2">"{story}"</p>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-end"></div>
    </div>
);


export const Homepage: React.FC = () => {
    const { language, setActiveSection, user } = useAppContext();
    const t = translations[language];

    const [topScholarships, setTopScholarships] = useState<Scholarship[]>([]);
    const [isTopLoading, setIsTopLoading] = useState(true);
    const [topError, setTopError] = useState('');
    
    const [searchResults, setSearchResults] = useState<Scholarship[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [specialty, setSpecialty] = useState('all');
    const [level, setLevel] = useState('all');

    const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);

    const filterOptions = useMemo(() => ({
        specialties: ["STEM Fields", "Development-Related Fields", "All Fields", "Engineering", "Technology", "Sustainable Development", "Arts & Humanities", "Business & Economics", "Health", "Global Affairs", "Medicine"],
        levels: ["Bachelors", "Masters", "PhD", "Masters/PhD", "Bachelors/Masters"]
    }), []);


    useEffect(() => {
        const loadTopScholarships = async () => {
            const cacheKey = `topScholarships_${language}`;
            const cachedData = localStorage.getItem(cacheKey);
            const twelveHours = 12 * 60 * 60 * 1000;

            if (cachedData) {
                const { scholarships, timestamp } = JSON.parse(cachedData);
                if (Date.now() - timestamp < twelveHours) {
                    setTopScholarships(scholarships);
                    setIsTopLoading(false);
                    return; // Use cached data
                }
            }
            
            setIsTopLoading(true);
            setTopError('');
            try {
                const scholarships = await fetchHomepageScholarships(language);
                setTopScholarships(scholarships);
                localStorage.setItem(cacheKey, JSON.stringify({ scholarships, timestamp: Date.now() }));
            } catch (error) {
                console.error("Failed to fetch homepage scholarships:", error);
                setTopError(t.homepage.topScholarshipsError);
            } finally {
                setIsTopLoading(false);
            }
        };
        loadTopScholarships();
    }, [language, t.homepage.topScholarshipsError]);

    const handleHeroCtaClick = () => {
        if (user) {
            setActiveSection(Section.DASHBOARD);
        } else {
            setActiveSection(Section.PRICING);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setHasSearched(true);
        setSearchResults([]);
        
        const results = await searchScholarships({ text: searchText, specialty: specialty === 'all' ? undefined : specialty, level: level === 'all' ? undefined : level }, language);
        
        setSearchResults(results);
        setIsLoading(false);
    };
    
    const renderTopScholarships = () => {
        if (isTopLoading) {
            return Array.from({ length: 6 }).map((_, index) => <ScholarshipCardSkeleton key={index} />);
        }
        if (topError) {
            return <p className="text-center text-red-400 md:col-span-2 lg:col-span-3">{topError}</p>;
        }
        return topScholarships.map(s => (
            <ScholarshipCard key={`${s.id}-${s.title.en}`} scholarship={s} onSelect={setSelectedScholarship} t={t} />
        ));
    };

    const SearchResults = () => {
        if (!hasSearched) return null;
        if (isLoading) return <LoadingSpinner />;
        if (searchResults.length > 0) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map(s => (
                        <ScholarshipCard key={`${s.id}-${s.title.en}`} scholarship={s} onSelect={setSelectedScholarship} t={t} />
                    ))}
                </div>
            );
        }
        return <p className="text-center text-text-muted py-8">{t.homepage.noResults}</p>;
    }


    return (
        <div className="space-y-24 pb-24">
            {/* Hero Section */}
            <section className="text-white text-center pt-20 pb-10 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-night-start to-night-end opacity-50"></div>
                 <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-accent-start/10 rounded-full animate-pulse-subtle"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-end/10 rounded-full animate-pulse-subtle animation-delay-2000"></div>
                    <div className="absolute top-10 right-20 w-8 h-8 border-2 border-accent-end rounded-full animate-spin-slow"></div>
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-end">{t.hero.title}</h1>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-text-muted">{t.hero.subtitle}</p>
                    <button onClick={handleHeroCtaClick} className="bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg hover:shadow-accent-end/30 transition-all transform hover:scale-105">
                        {user ? t.hero.ctaLoggedIn : t.hero.cta}
                    </button>
                </div>
            </section>

            {/* Search Section */}
            <section className="container mx-auto px-4 -mt-12">
                 <div className="bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl border border-glass-border shadow-2xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-text-light flex items-center justify-center gap-2">
                        {t.homepage.exploreAllScholarships}
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-lg">
                            <input type="text" placeholder={t.homepage.searchPlaceholder} value={searchText} onChange={e => setSearchText(e.target.value)} className="md:col-span-4 p-3 bg-white/10 border border-glass-border rounded-lg text-text-light placeholder-text-muted focus:ring-2 focus:ring-accent-end focus:border-transparent focus:bg-white/5 transition"/>
                            
                            <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="p-3 bg-white/10 border border-glass-border rounded-lg text-text-light">
                                <option value="all">{t.homepage.filters.allSpecialties}</option>
                                {filterOptions.specialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={level} onChange={e => setLevel(e.target.value)} className="p-3 bg-white/10 border border-glass-border rounded-lg text-text-light">
                                <option value="all">{t.homepage.filters.allLevels}</option>
                                {filterOptions.levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>

                            <button onClick={handleSearch} disabled={isLoading} className="md:col-span-2 bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-6 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all transform hover:scale-105">
                                {isLoading ? t.homepage.searching : t.homepage.searchButton}
                            </button>
                        </div>
                    </div>
                    <SearchResults />
                 </div>
            </section>

            {/* Top Scholarships Section */}
            <section className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-text-light flex items-center justify-center gap-3">
                    <SparklesIcon className="w-8 h-8 text-accent-end" />
                    {t.homepage.topOpenScholarships}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderTopScholarships()}
                </div>
            </section>


            {/* Success Stories */}
            <section className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-text-light flex items-center justify-center gap-3">
                    <TrophyIcon className="w-8 h-8 text-accent-end" />
                    {t.homepage.successStories}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <SuccessStoryCard name="Ahmed Hassan" story="Phi's CV tool helped me get past the ATS filters and land my dream scholarship in Germany!" imgSrc="https://picsum.photos/seed/ahmed/200" />
                    <SuccessStoryCard name="Fatima Zahra" story="I was stuck on my SOP for weeks. The Phi Assistant gave me a fresh perspective that made all the difference." imgSrc="https://picsum.photos/seed/fatima/200" />
                    <SuccessStoryCard name="Youssef Ali" story="The interview simulator was a game-changer. I felt so confident and prepared for the real thing." imgSrc="https://picsum.photos/seed/youssef/200" />
                </div>
            </section>
            
            {selectedScholarship && (
                <ScholarshipModal 
                    scholarship={selectedScholarship}
                    onClose={() => setSelectedScholarship(null)}
                />
            )}
        </div>
    );
};