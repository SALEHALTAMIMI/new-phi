import React, { useState, useEffect } from 'react';
import { Section } from '../types';
import { translations } from '../i18n';
import { getInterviewQuestion, generateContent } from '../services/geminiService';
import { UsageCounter } from '../components/UsageCounter';
import { useAppContext } from '../AppContext';

interface InterviewSectionProps {}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2 animate-pulse" dir="ltr">
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
        <div className="w-4 h-4 bg-accent-end rounded-full"></div>
    </div>
);

export const InterviewSection: React.FC<InterviewSectionProps> = () => {
  const { language, user, setActiveSection } = useAppContext();
  const t = translations[language];
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [error, setError] = useState('');
  
  const currentUser = user!;
  const usageData = currentUser.usage[Section.INTERVIEW] || { used: 0, total: 3 };

  const fetchQuestion = async () => {
    setIsLoadingQuestion(true);
    setError('');
    setFeedback('');
    setAnswer('');
    try {
        const newQuestion = await getInterviewQuestion(language);
        setQuestion(newQuestion);
    } catch(e) {
        setError(t.common.aiError);
    } finally {
        setIsLoadingQuestion(false);
    }
  };

  useEffect(() => {
    if (isSessionActive) {
      fetchQuestion();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSessionActive]);

  const handleStartSession = () => {
    setIsSessionActive(true);
  };

  const handleGetFeedback = async () => {
    if(!answer) return;
    setIsLoadingFeedback(true);
    setError('');
    setFeedback('');
    const langInstructions = `(Provide feedback in ${language === 'ar' ? 'Arabic' : 'English'})`;
    const prompt = `Act as an interview coach for Phi. The user was asked the question: "${question}". The user provided the answer: "${answer}". Provide constructive feedback on this answer. ${langInstructions}`;
    try {
        const result = await generateContent(prompt);
        setFeedback(result);
    } catch (e) {
        setError(t.common.aiError)
    } finally {
        setIsLoadingFeedback(false);
    }
  }
  
  const isLoading = isLoadingQuestion || isLoadingFeedback;

  if (!isSessionActive) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-text-light mb-4">{t.interview.title}</h1>
        <p className="text-text-muted mb-8 max-w-xl">{t.interview.expertBooking}</p>
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-glass-border shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-text-light mb-4">{t.interview.sessionType}</h3>
            <div className="space-y-4">
                <button onClick={handleStartSession} className="w-full bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-4 px-6 rounded-lg hover:opacity-90 text-lg transition-all">
                    {t.interview.text}
                </button>
                <button disabled className="w-full bg-white/5 text-text-muted/50 font-bold py-4 px-6 rounded-lg cursor-not-allowed">{t.interview.audio}</button>
                <button disabled className="w-full bg-white/5 text-text-muted/50 font-bold py-4 px-6 rounded-lg cursor-not-allowed">{t.interview.video}</button>
            </div>
            <div className="mt-6">
                <UsageCounter used={usageData.used} total={usageData.total} featureText={t.interview.title} />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-2xl md:text-3xl font-bold text-center text-text-light mb-8">{t.interview.title}</h1>
       <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <h3 className="font-semibold text-text-light mb-2">{t.interview.aiQuestion}</h3>
            <div className="bg-black/20 p-4 rounded-lg min-h-[6rem] flex items-center justify-center">
              {isLoadingQuestion ? <LoadingSpinner /> : <p className="text-lg text-text-light">{question}</p>}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <h3 className="font-semibold text-text-light mb-2">{t.interview.yourAnswer}</h3>
            <textarea 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              className="w-full p-3 bg-white/5 border border-glass-border rounded-lg text-text-light placeholder-text-muted focus:ring-2 focus:ring-accent-end focus:border-transparent transition"
              placeholder={t.interview.yourAnswer}
              aria-label={t.interview.yourAnswer}
            />
            <button onClick={handleGetFeedback} disabled={isLoading || !answer} className="mt-2 w-full sm:w-auto bg-gradient-to-r from-accent-start to-accent-end text-night-start font-semibold py-2 px-6 rounded-lg hover:opacity-90 disabled:opacity-50">
                {isLoadingFeedback ? t.common.loading : t.interview.getFeedback}
            </button>
          </div>
           <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-glass-border shadow-lg">
            <h3 className="font-semibold text-accent-end mb-2">Feedback</h3>
            <div className="bg-accent-end/5 p-4 rounded-lg min-h-[6rem] flex items-center justify-center border border-accent-end/20">
              {isLoadingFeedback ? <LoadingSpinner /> : <p className="text-text-light">{error || feedback || 'Phi Assistant feedback will appear here.'}</p>}
            </div>
          </div>
          <div className="flex justify-center gap-4">
             <button onClick={fetchQuestion} disabled={isLoading} className="bg-white/10 text-text-light font-semibold py-3 px-8 rounded-lg hover:bg-white/20 disabled:opacity-50">
                Next Question
             </button>
             <button onClick={() => setIsSessionActive(false)} className="bg-white/5 text-text-muted font-semibold py-3 px-8 rounded-lg hover:bg-white/10">
                End Session
             </button>
          </div>
       </div>
    </div>
  );
};