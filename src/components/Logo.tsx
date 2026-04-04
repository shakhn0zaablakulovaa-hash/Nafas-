import React from 'react';

export const Logo = ({ size = 48, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer circle */}
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" />
    
    {/* Woman's profile silhouette */}
    <path 
      d="M45 25C40 25 35 35 35 45C35 55 40 65 45 65C48 65 50 62 52 60C55 57 58 58 60 60C62 62 65 62 68 60C71 58 72 55 72 52C72 45 68 38 62 35C58 33 55 33 52 35C50 37 48 35 45 25Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
    />
    
    {/* Leaves/Breath elements */}
    <path 
      d="M65 35C68 32 72 32 75 35M70 40C73 37 77 37 80 40M68 45C71 42 75 42 78 45" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
    />
    
    {/* Leaves */}
    <path 
      d="M78 35C80 33 83 33 85 35C83 37 80 37 78 35ZM82 42C84 40 87 40 89 42C87 44 84 44 82 42Z" 
      fill="currentColor" 
    />

    {/* Text "Nafas" stylized */}
    <text 
      x="50" 
      y="82" 
      textAnchor="middle" 
      fill="currentColor" 
      style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'serif' }}
    >
      Nafas
    </text>
  </svg>
);
