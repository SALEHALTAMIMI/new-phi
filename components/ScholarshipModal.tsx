import React, { useEffect } from 'react';
import { Scholarship } from '../types';
import { translations } from '../i18n';
import { useAppContext } from '../AppContext';
import { CloseIcon } from './icons/CloseIcon';
import { Flag } from './Flag';

interface ScholarshipModalProps {
  scholarship: Scholarship;
  onClose: () => void;
}

export const ScholarshipModal: React.FC<ScholarshipModalProps> = ({ scholarship, onClose }) => {
  const { language } = useAppContext();
  const t = translations[language].scholarshipModal;

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-night-end/80 backdrop-blur-2xl rounded-2xl border border-glass-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col text-text-light"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-glass-border sticky top-0 bg-night-end/80 z-10">
          <div>
              <h2 id="modal-title" className="text-xl sm:text-2xl font-bold">
                {scholarship.title[language]}
              </h2>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Flag countryCode={scholarship.countryCode} />
                <span>{scholarship.university} - {scholarship.country[language]}</span>
              </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-light"
            aria-label={t.close}
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-accent-end mb-2">{t.summary}</h3>
            <p className="text-text-muted">{scholarship.summary[language]}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent-end mb-2">{t.requirements}</h3>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              {scholarship.requirements[language].map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-accent-end mb-2">{t.benefits}</h3>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              {scholarship.benefits[language].map((ben, index) => (
                <li key={index}>{ben}</li>
              ))}
            </ul>
          </div>
        </div>
        
         <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-t border-glass-border mt-auto sticky bottom-0 bg-night-end/80 z-10">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
                <p className="text-sm text-text-muted">{t.deadline}:</p>
                <p className="font-bold text-red-400">{scholarship.deadline}</p>
            </div>
            <a
              href={scholarship.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-accent-start to-accent-end text-night-start font-bold py-3 px-8 rounded-full text-lg hover:opacity-90 transition-all transform hover:scale-105"
            >
              {t.applyNow}
            </a>
         </div>
      </div>
    </div>
  );
};