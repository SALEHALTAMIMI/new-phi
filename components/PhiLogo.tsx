import React from 'react';

// This file is for the default Phi Logo SVG, it's not currently used as we are using base64 strings in context
// but it is good practice to have it as a component.

interface PhiLogoProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
}

export const PhiLogo: React.FC<PhiLogoProps> = ({ color = '#F0E8FF', ...props }) => {
  return (
    <svg 
        {...props}
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
    >
      <circle 
        cx="50" 
        cy="50" 
        r="40" 
        fill="none" 
        stroke={color} 
        strokeWidth="8"
      />
      <line 
        x1="50" 
        y1="10" 
        x2="50" 
        y2="90" 
        stroke={color} 
        strokeWidth="8" 
        strokeLinecap="round"
      />
    </svg>
  );
};