
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit3, Trash2, Calendar, Target, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPillarByKey } from '@/lib/constants/pillars';

export default function TaskList({ tasks, onTaskClick, onTaskToggle }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 opacity-50">
        <Target className="w-12 h-12 mx-auto mb-2" />
        <p>Nenhuma tarefa encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => {
        const pillar = getPillarByKey(task.pillar);
        return (
          <div 
            key={task.id} 
            className="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-transparent hover:border-white/10 cursor-pointer"
            onClick={() => onTaskClick && onTaskClick(task)}
          >
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskToggle && onTaskToggle(task.id);
                }}
                className="text-white/30 hover:text-primary transition-colors"
              >
                {task.status === 'wisdom' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              
              <div>
                <p className={cn("text-sm font-medium text-white", task.status === 'wisdom' && "line-through opacity-50")}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {pillar && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/50 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pillar.color }} />
                      {pillar.label}
                    </span>
                  )}
                  {task.due_date && (
                    <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Actions could go here */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
