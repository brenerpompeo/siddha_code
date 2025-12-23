'use client';
import { cn } from '@/lib/cn';

export const Badge = ({ children, color, className }) => (
  <span 
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      className
    )}
    style={{ backgroundColor: `${color}20`, color: color }}
  >
    {children}
  </span>
);
