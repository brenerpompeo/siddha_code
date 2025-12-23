'use client';
import { Smile, Meh, Frown, SmilePlus, Angry } from 'lucide-react';
import { cn } from '@/lib/cn';
import { GlassCard } from './custom-ui/GlassCard';

export const MOODS = [
  { id: 'amazing', label: 'Incrível', emoji: '🤩', icon: SmilePlus, color: '#22c55e', score: 5, gradient: 'from-green-500 to-emerald-400' },
  { id: 'good', label: 'Bem', emoji: '😊', icon: Smile, color: '#84cc16', score: 4, gradient: 'from-lime-500 to-green-400' },
  { id: 'neutral', label: 'Neutro', emoji: '😐', icon: Meh, color: '#eab308', score: 3, gradient: 'from-yellow-500 to-amber-400' },
  { id: 'bad', label: 'Mal', emoji: '😔', icon: Frown, color: '#f97316', score: 2, gradient: 'from-orange-500 to-red-400' },
  { id: 'terrible', label: 'Péssimo', emoji: '😢', icon: Angry, color: '#ef4444', score: 1, gradient: 'from-red-500 to-rose-400' },
];

export const getMoodById = (id) => MOODS.find(m => m.id === id);

export default function MoodTracker({ todayMood, onSelectMood, moodHistory = [] }) {
  const selectedMood = todayMood ? getMoodById(todayMood) : null;
  
  return (
    <GlassCard className="p-4 relative overflow-hidden">
      {selectedMood && (
        <div className={cn(
          "absolute top-0 left-0 w-full h-1 opacity-50 bg-gradient-to-r",
          selectedMood.gradient
        )} />
      )}
      
      <h3 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
        <span>Como você está hoje?</span>
        {selectedMood && <span className="text-xs text-white/50">{selectedMood.label}</span>}
      </h3>
      
      <div className="flex justify-between gap-2">
        {MOODS.map(mood => {
          const Icon = mood.icon;
          const isSelected = todayMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => onSelectMood(mood.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 group relative",
                isSelected ? "bg-white/10 scale-110" : "hover:bg-white/5 hover:scale-105"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isSelected ? "text-white" : "text-white/30 group-hover:text-white/70"
              )} style={isSelected ? { backgroundColor: mood.color } : {}}>
                <Icon className="w-5 h-5" />
              </div>
              {isSelected && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
