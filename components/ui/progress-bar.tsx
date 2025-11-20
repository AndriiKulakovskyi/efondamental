import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({ 
  percentage, 
  showLabel = true, 
  size = 'md',
  className = '' 
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-slate-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            clampedPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-slate-700 min-w-[3rem] text-right">
          {Math.round(clampedPercentage)}%
        </span>
      )}
    </div>
  );
}

