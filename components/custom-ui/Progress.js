'use client';
import { cn } from '@/lib/cn';

export const Progress = ({ value, max = 100, color = '#8b5cf6', className }) => (
  <div className={cn('h-2 bg-white/10 rounded-full overflow-hidden', className)}>
    <div 
      className="h-full rounded-full transition-all duration-500"
      style={{ 
        width: `${Math.min(100, (value / max) * 100)}%`,
        backgroundColor: color
      }}
    />
  </div>
);
