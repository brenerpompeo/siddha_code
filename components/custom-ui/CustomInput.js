'use client';
import { cn } from '@/lib/cn';

export const CustomInput = ({ label, error, icon: Icon, className, ...props }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm text-white/70">{label}</label>}
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
      )}
      <input
        className={cn(
          'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white',
          'placeholder:text-white/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary',
          'transition-all duration-200',
          Icon && 'pl-11',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);
