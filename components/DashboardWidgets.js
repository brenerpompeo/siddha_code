
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Calendar, CheckCircle2, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- MINI WIDGETS ---

export const ActiveSprintWidget = ({ sprint, tasks, onClick }) => {
  if (!sprint) {
    return (
      <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all cursor-pointer h-full" onClick={onClick}>
        <CardContent className="flex flex-col items-center justify-center h-full py-8 text-white/40">
          <Calendar className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">Nenhum Sprint Ativo</p>
          <p className="text-xs">Clique para criar</p>
        </CardContent>
      </Card>
    );
  }

  const sprintTasks = tasks.filter(t => t.sprint_id === sprint.id || t.sprintId === sprint.id);
  const completed = sprintTasks.filter(t => t.status === 'wisdom').length;
  const progress = sprintTasks.length > 0 ? Math.round((completed / sprintTasks.length) * 100) : 0;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/40 transition-all cursor-pointer h-full" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Sprint Atual
          </CardTitle>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 animate-pulse">Ativo</span>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold text-white mb-1 truncate">{sprint.title}</h3>
        <p className="text-xs text-white/50 mb-4 line-clamp-1 italic">"{sprint.intention}"</p>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-white/60">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ActiveCicloWidget = ({ ciclo, onClick }) => {
  if (!ciclo) return null;
  return (
    <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={onClick}>
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider">Ciclo Atual</p>
          <p className="text-sm font-bold text-white">{ciclo.theme}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{ciclo.year}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const MiniJournalWidget = ({ latestEntry, onClick }) => {
  return (
    <Card className="bg-white/5 border-white/10 hover:border-white/20 transition-all cursor-pointer h-full" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          Último Journal
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestEntry ? (
          <>
            <h4 className="font-medium text-white text-sm mb-1">{latestEntry.title}</h4>
            <p className="text-xs text-white/50 line-clamp-2">{latestEntry.content}</p>
            <p className="text-[10px] text-white/30 mt-2 text-right">
              {new Date(latestEntry.created_at).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-xs text-white/40 italic">Nenhuma entrada ainda.</p>
        )}
      </CardContent>
    </Card>
  );
};
