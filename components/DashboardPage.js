'use client';
import { useState } from 'react';
import { 
  BarChart3, Plus, Zap, Flame, Target, Compass, Settings 
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { CustomButton as Button } from './custom-ui/CustomButton';
import { GlassCard } from './custom-ui/GlassCard';
import ProtocolsWidget from './ProtocolsWidget';
import SprintBuilder from './SprintBuilder';
import ProtocolManager from './ProtocolManager';
import { ActiveSprintWidget, MiniJournalWidget } from './DashboardWidgets';
import { PillarRadarChart, ProductivityBarChart, SubPillarPieChart } from './AnalyticsCharts';

export default function DashboardPage({ 
  userProfile, 
  protocols, 
  onToggleProtocol, 
  tasks, 
  sprints, 
  setSprints, 
  setProtocols, 
  user, 
  setPage,
  onCreateSprint
}) {
  const [protocolTab, setProtocolTab] = useState('daily');
  const [isSprintBuilderOpen, setIsSprintBuilderOpen] = useState(false);
  const [isProtocolManagerOpen, setIsProtocolManagerOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const displayName = userProfile?.username || 'Warrior';
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const activeSprint = sprints.find(s => s.status === 'active');
  const latestJournal = tasks.filter(t => t.pillar === 'journal').slice(-1)[0]; 
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Olá, {displayName}</h1>
          <p className="text-white/50 capitalize">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowAnalytics(!showAnalytics)} className={cn(showAnalytics && "bg-white/10")}>
            <BarChart3 className="w-4 h-4 mr-2" /> Analytics
          </Button>
          <Button onClick={() => setIsSprintBuilderOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Novo Sprint
          </Button>
        </div>
      </div>

      {/* Analytics Overlay Mode */}
      {showAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4">
              <GlassCard className="p-4 col-span-1">
                  <h3 className="text-sm font-bold text-white mb-4">Progresso dos 7 Pilares</h3>
                  <PillarRadarChart userProfile={userProfile} tasks={tasks} />
              </GlassCard>
              <GlassCard className="p-4 col-span-1">
                  <h3 className="text-sm font-bold text-white mb-4">Produtividade (Sprints)</h3>
                  <ProductivityBarChart sprints={sprints} tasks={tasks} />
              </GlassCard>
              <GlassCard className="p-4 col-span-1">
                  <h3 className="text-sm font-bold text-white mb-4">Distribuição de Foco</h3>
                  <SubPillarPieChart tasks={tasks} />
              </GlassCard>
          </div>
      )}

      {/* Main Command Center Grid (Bento Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Sprint & Ciclo Context (4 cols) */}
        <div className="md:col-span-4 space-y-6">
            <div className="h-48">
                <ActiveSprintWidget sprint={activeSprint} tasks={tasks} onClick={() => setPage('sprints')} />
            </div>
            <div>
                <MiniJournalWidget latestEntry={null} onClick={() => setPage('journal')} />
            </div>
        </div>

        {/* Center Column: Protocols (4 cols) */}
        <div className="md:col-span-4 h-full">
            <div className="relative h-full">
                <ProtocolsWidget 
                  protocols={protocols} 
                  onToggle={onToggleProtocol} 
                  activeTab={protocolTab}
                  setActiveTab={setProtocolTab}
                />
                <button 
                  onClick={() => setIsProtocolManagerOpen(true)}
                  className="absolute top-4 right-4 p-2 text-white/30 hover:text-white hover:bg-white/10 rounded transition-all"
                >
                  <Settings className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Right Column: Stats & Quick Actions (4 cols) */}
        <div className="md:col-span-4 space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                    <Zap className="w-6 h-6 text-yellow-400 mb-2" />
                    <span className="text-2xl font-bold text-white">{userProfile?.xp || 0}</span>
                    <span className="text-xs text-white/50">XP Total</span>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
                    <Flame className="w-6 h-6 text-orange-500 mb-2" />
                    <span className="text-2xl font-bold text-white">{userProfile?.streak || 0}</span>
                    <span className="text-xs text-white/50">Dias Streak</span>
                </GlassCard>
             </div>
             
             <GlassCard className="p-4">
                 <h3 className="text-sm font-semibold text-white mb-3">Acesso Rápido</h3>
                 <div className="space-y-2">
                     <Button variant="ghost" className="w-full justify-start text-white/70" onClick={() => setPage('ciclo')}>
                         <Target className="w-4 h-4 mr-2 text-purple-400" /> Ver Ciclo Atual
                     </Button>
                     <Button variant="ghost" className="w-full justify-start text-white/70" onClick={() => setPage('ikigai')}>
                         <Compass className="w-4 h-4 mr-2 text-pink-400" /> Astro-Ikigai
                     </Button>
                 </div>
             </GlassCard>
        </div>

      </div>

      {/* Modals */}
      <SprintBuilder
        isOpen={isSprintBuilderOpen}
        onClose={() => setIsSprintBuilderOpen(false)}
        onCreateSprint={(data) => {
            if (onCreateSprint) {
                onCreateSprint(data);
            } else {
                console.log('Sprint creation:', data);
            }
            setIsSprintBuilderOpen(false);
        }} 
        userProfile={userProfile}
      />

      <ProtocolManager 
        protocols={protocols}
        setProtocols={setProtocols}
        user={user}
        isOpen={isProtocolManagerOpen}
        onClose={() => setIsProtocolManagerOpen(false)}
      />
    </div>
  );
}
