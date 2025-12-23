'use client';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

export const GlassCard = forwardRef(({ children, className, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl',
      className
    )} 
    {...props}
  >
    {children}
  </div>
));
GlassCard.displayName = 'GlassCard';
