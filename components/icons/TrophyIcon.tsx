import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}
  >
    <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3.375a.75.75 0 01.75 0v3.375h3.375a.75.75 0 010 1.5h-3.375v3.375a.75.75 0 01-1.5 0v-3.375H4.5a.75.75 0 010-1.5h3.375V7.125a.75.75 0 01.75-.75zM15 11.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" clipRule="evenodd" />
    <path d="M15 12.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
  </svg>
);
