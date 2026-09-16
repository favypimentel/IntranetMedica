import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  size = 'md',
  label,
  className = ''
}) => {
  const normalized = Math.min(100, Math.max(0, Math.round(progress)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  };

  const getGradient = (pct: number) => {
    if (pct >= 100) return 'from-emerald-500 to-teal-600';
    if (pct > 50) return 'from-primary-500 to-primary-600';
    if (pct > 20) return 'from-amber-500 to-primary-500';
    return 'from-amber-400 to-amber-500';
  };

  return (
    <div className={clsx('w-full space-y-1.5', className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-gray-600">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span
              className={clsx(
                'ml-auto font-semibold',
                normalized === 100 ? 'text-emerald-600' : 'text-primary-700'
              )}
            >
              {normalized}%
            </span>
          )}
        </div>
      )}
      <div className={clsx('w-full bg-gray-100 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r',
            getGradient(normalized)
          )}
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
