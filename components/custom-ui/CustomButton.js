'use client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export const CustomButton = ({ children, variant = 'primary', size = 'md', className, disabled, loading, ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white disabled:opacity-50',
    secondary: 'bg-white/10 hover:bg-white/20 text-white disabled:opacity-50',
    ghost: 'hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-50',
    outline: 'border border-white/20 hover:bg-white/10 text-white disabled:opacity-50',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2'
  };
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};
