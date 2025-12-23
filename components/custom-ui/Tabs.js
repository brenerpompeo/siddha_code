'use client';
import { cn } from '@/lib/cn';

export const Tabs = ({ tabs, activeTab, onChange, className }) => (
  <div className={cn('flex bg-white/5 rounded-lg p-1', className)}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={cn(
          'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all',
          activeTab === tab.id
            ? 'bg-primary text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        )}
      >
        {tab.icon && <tab.icon className="w-4 h-4" />}
        {tab.label}
      </button>
    ))}
  </div>
);
