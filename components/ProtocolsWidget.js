'use client';
import { Target, Clock, CalendarDays, CalendarRange, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { GlassCard } from './custom-ui/GlassCard';
import { Tabs } from './custom-ui/Tabs';
import { Progress } from './custom-ui/Progress';
import { XP_REWARDS } from '@/lib/constants/kanban';

export default function ProtocolsWidget({ protocols, onToggle, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'daily', label: 'Diário', icon: Clock },
    { id: 'weekly', label: 'Semanal', icon: CalendarDays },
    { id: 'monthly', label: 'Mensal', icon: CalendarRange },
  ];
  
  // Filter protocols by tab
  const filteredProtocols = protocols.filter(p => {
    if (activeTab === 'daily') return !p.frequency || p.frequency === 'daily';
    if (activeTab === 'weekly') return p.frequency === 'weekly';
    if (activeTab === 'monthly') return p.frequency === 'monthly';
    return true;
  });
  
  const completedCount = filteredProtocols.filter(p => p.completed_today).length;
  const totalCount = filteredProtocols.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Protocolos</h3>
          <p className="text-xs text-white/50">{completedCount}/{totalCount} completados</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Target className="w-5 h-5 text-primary" />
        </div>
      </div>
      
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-4" />
      
      <Progress value={progress} className="mb-4" />
      
      <div className="space-y-2 max-h-[240px] overflow-y-auto">
        {filteredProtocols.length === 0 ? (
          <p className="text-center text-white/40 py-4 text-sm">
            Nenhum protocolo {activeTab === 'daily' ? 'diário' : activeTab === 'weekly' ? 'semanal' : 'mensal'}
          </p>
        ) : (
          filteredProtocols.map(protocol => (
            <button
              key={protocol.id}
              onClick={() => onToggle(protocol.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                protocol.completed_today 
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
              )}
            >
              {protocol.completed_today ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-white/30 flex-shrink-0" />
              )}
              <span className={cn(
                'text-sm text-left',
                protocol.completed_today ? 'text-white' : 'text-white/70'
              )}>
                {protocol.name}
              </span>
            </button>
          ))
        )}
      </div>
      
      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-primary/20 border border-primary/30 text-center">
          <p className="text-sm text-primary font-medium">
            Todos completados! +{XP_REWARDS.all_protocols_daily} XP
          </p>
        </div>
      )}
    </GlassCard>
  );
}
