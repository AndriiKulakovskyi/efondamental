import React from 'react';

interface AvatarWithInitialsProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  gradientColors?: string[];
  className?: string;
}

export function AvatarWithInitials({ 
  firstName, 
  lastName, 
  size = 'md',
  gradientColors = ['#64748B', '#475569'], // slate-500 to slate-600 by default
  className = '' 
}: AvatarWithInitialsProps) {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  const gradientStyle = {
    background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center shadow-sm ${className}`}
      style={gradientStyle}
    >
      <span className="font-semibold text-white select-none">
        {getInitials()}
      </span>
    </div>
  );
}

