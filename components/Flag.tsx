import React from 'react';

interface FlagProps {
  countryCode: string;
  className?: string;
}

export const Flag: React.FC<FlagProps> = ({ countryCode, className }) => {
  if (!countryCode || countryCode.length !== 2) {
    // Return a placeholder or null if country code is invalid
    return <div className={`w-6 h-4 bg-gray-500 rounded-sm ${className}`}></div>;
  }

  return (
    <img
      src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
      width="20"
      alt={`${countryCode} flag`}
      className={`rounded-sm ${className}`}
      loading="lazy"
    />
  );
};