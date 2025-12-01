'use client';

import { useState, useEffect, useCallback, useMemo, forwardRef } from 'react';
import { 
  LayoutDashboard, 
  Kanban, 
  User, 
  BookOpen, 
  LogOut, 
  Menu, 
  X, 
  Flame, 
  Zap, 
  Trophy, 
  Plus, 
  GripVertical,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Target,
  Calendar,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Clock,
  CalendarDays,
  CalendarRange,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Link2,
  Edit3,
  Trash2,
  Search,
  Hash,
  Bot,
  Send,
  BarChart3,
  TrendingUp,
  Award,
  Star,
  Smile,
  Meh,
  Frown,
  SmilePlus,
  Angry
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { PILLARS, getPillarByKey, getPillarColor } from '@/lib/constants/pillars';
import { RANKS, getRankByXp, getNextRank, getRankProgress } from '@/lib/constants/ranks';
import { KANBAN_COLUMNS, GUT_CHECK_PROMPTS, XP_REWARDS, getColumnById } from '@/lib/constants/kanban';
import { ARCHETYPES, HD_TYPES, ZODIAC_SIGNS, getArchetypeByKey, getHDTypeByKey } from '@/lib/constants/archetypes';
import { SUB_PILLARS, getSubPillarByKey } from '@/lib/constants/sub-pillars';
import { createClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// DnD Kit imports
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Navigation items
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sprints', label: 'Sprints', icon: Kanban },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: User },
];

// ============ UI COMPONENTS ============

const GlassCard = forwardRef(({ children, className, ...props }, ref) => (
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

const Badge = ({ children, color, className }) => (
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

const Button = ({ children, variant = 'primary', size = 'md', className, disabled, loading, ...props }) => {
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

const Input = ({ label, error, icon: Icon, className, ...props }) => (
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

const Progress = ({ value, max = 100, color = '#8b5cf6', className }) => (
  <div className={cn('h-2 bg-white/10 rounded-full overflow-hidden', className)}>
    <div 
      className="h-full rounded-full transition-all duration-500"
      style={{ 
        width: `${Math.min(100, (value / max) * 100)}%`,
        backgroundColor: color
      }}
    />
  </div>
);

const Tabs = ({ tabs, activeTab, onChange, className }) => (
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

// ============ USER DROPDOWN ============

const UserDropdown = ({ user, userProfile, onSignOut, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentRank = getRankByXp(userProfile?.xp || 0);
  const displayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
  
  const menuItems = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'sprints', label: 'Meus Sprints', icon: Kanban },
    { id: 'social', label: 'Redes Sociais', icon: Link2 },
    { id: 'journal', label: 'Diário de Bordo', icon: BookOpen },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center">
          <span className="text-sm font-bold">{displayName[0]?.toUpperCase()}</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-white">{displayName}</p>
          <p className="text-xs" style={{ color: currentRank.color }}>{currentRank.title}</p>
        </div>
        <ChevronDown className={cn(
          'w-4 h-4 text-white/50 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-64 z-50">
            <div className="bg-surface border border-white/10 rounded-xl p-2 shadow-xl shadow-black/50">
              {/* User Info */}
              <div className="p-3 border-b border-white/10 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center">
                    <span className="text-lg font-bold">{displayName[0]?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{displayName}</p>
                    <p className="text-xs text-white/50">{user?.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-primary" />
                    <span>{(userProfile?.xp || 0).toLocaleString()} XP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>{userProfile?.streak || 0} dias</span>
                  </div>
                </div>
              </div>
              
              {/* Menu Items */}
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'settings') {
                      // TODO: Open settings modal
                    } else if (item.id === 'social') {
                      onNavigate('profile');
                    } else {
                      onNavigate(item.id);
                    }
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
              
              {/* Logout */}
              <div className="border-t border-white/10 mt-2 pt-2">
                <button
                  onClick={() => {
                    onSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============ MOOD TRACKER ============

const MOODS = [
  { id: 'amazing', label: 'Incrível', icon: SmilePlus, color: '#22c55e', score: 5 },
  { id: 'good', label: 'Bem', icon: Smile, color: '#84cc16', score: 4 },
  { id: 'neutral', label: 'Neutro', icon: Meh, color: '#eab308', score: 3 },
  { id: 'bad', label: 'Mal', icon: Frown, color: '#f97316', score: 2 },
  { id: 'terrible', label: 'Péssimo', icon: Angry, color: '#ef4444', score: 1 },
];

const getMoodById = (id) => MOODS.find(m => m.id === id);

const MoodTracker = ({ todayMood, onSelectMood, moodHistory = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentMood = todayMood ? getMoodById(todayMood) : null;
  
  // Calculate weekly average
  const last7Days = moodHistory.slice(-7);
  const weeklyAvg = last7Days.length > 0 
    ? (last7Days.reduce((acc, m) => acc + (getMoodById(m.mood)?.score || 3), 0) / last7Days.length).toFixed(1)
    : null;
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all',
          currentMood ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'
        )}
        style={currentMood ? { backgroundColor: `${currentMood.color}20` } : {}}
      >
        {currentMood ? (
          <>
            <currentMood.icon className="w-4 h-4" style={{ color: currentMood.color }} />
            <span className="text-sm font-medium hidden sm:block" style={{ color: currentMood.color }}>
              {currentMood.label}
            </span>
          </>
        ) : (
          <>
            <Smile className="w-4 h-4 text-white/50" />
            <span className="text-sm font-medium text-white/50 hidden sm:block">Mood</span>
          </>
        )}
        <ChevronDown className={cn(
          'w-3 h-3 text-white/50 transition-transform hidden sm:block',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 z-50">
            <div className="bg-surface border border-white/10 rounded-xl p-4 shadow-xl shadow-black/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white">Como você está hoje?</h4>
                {weeklyAvg && (
                  <span className="text-xs text-white/50">
                    Média: {weeklyAvg}/5
                  </span>
                )}
              </div>
              
              <div className="flex justify-between gap-2 mb-4">
                {MOODS.map(mood => {
                  const isSelected = todayMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => {
                        onSelectMood(mood.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        'flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
                        isSelected ? 'ring-2' : 'hover:bg-white/5'
                      )}
                      style={isSelected ? { 
                        backgroundColor: `${mood.color}20`, 
                        ringColor: mood.color 
                      } : {}}
                      title={mood.label}
                    >
                      <mood.icon 
                        className={cn('w-6 h-6', isSelected ? '' : 'text-white/40')}
                        style={isSelected ? { color: mood.color } : {}}
                      />
                      <span 
                        className={cn('text-[10px]', isSelected ? '' : 'text-white/40')}
                        style={isSelected ? { color: mood.color } : {}}
                      >
                        {mood.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              {/* Weekly Overview */}
              {moodHistory.length > 0 && (
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs text-white/50 mb-2">Últimos 7 dias</p>
                  <div className="flex justify-between gap-1">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const dayOffset = 6 - i;
                      const date = new Date();
                      date.setDate(date.getDate() - dayOffset);
                      const dateStr = date.toISOString().split('T')[0];
                      const dayMood = moodHistory.find(m => m.date === dateStr);
                      const moodData = dayMood ? getMoodById(dayMood.mood) : null;
                      const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
                      
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-white/30">
                            {dayNames[date.getDay()]}
                          </span>
                          <div 
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center',
                              moodData ? '' : 'bg-white/5'
                            )}
                            style={moodData ? { backgroundColor: `${moodData.color}30` } : {}}
                          >
                            {moodData ? (
                              <moodData.icon className="w-3.5 h-3.5" style={{ color: moodData.color }} />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============ NEW HEADER ============

const Header = ({ title, setIsMobileOpen, user, userProfile, onSignOut, onNavigate, todayMood, onSelectMood, moodHistory }) => {
  return (
    <header className="h-16 border-b border-white/10 bg-surface/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-6">
            {/* Mood Tracker */}
            <MoodTracker 
              todayMood={todayMood}
              onSelectMood={onSelectMood}
              moodHistory={moodHistory}
            />
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{(userProfile?.xp || 0).toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{userProfile?.streak || 0} dias</span>
            </div>
          </div>
          
          <UserDropdown 
            user={user} 
            userProfile={userProfile} 
            onSignOut={onSignOut}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </header>
  );
};

// ============ SIDEBAR ============

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen, user, userProfile }) => {
  const currentRank = getRankByXp(userProfile?.xp || 0);
  const rankProgress = getRankProgress(userProfile?.xp || 0);
  const nextRank = getNextRank(userProfile?.xp || 0);
  
  const displayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
  
  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-surface/95 backdrop-blur-xl border-r border-white/10 z-50',
        'transform transition-transform duration-300 lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white">Siddha Code</h1>
                <p className="text-xs text-white/50">Life OS</p>
              </div>
            </div>
            <button 
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 m-4 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center">
              <span className="text-lg font-bold">{displayName[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{displayName}</p>
              <p className="text-xs" style={{ color: currentRank.color }}>
                {currentRank.title}
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">XP</span>
              <span className="text-white/70">{(userProfile?.xp || 0).toLocaleString()}</span>
            </div>
            <Progress value={rankProgress} color={currentRank.color} />
            {nextRank && (
              <p className="text-xs text-white/40">
                {(nextRank.xp_min - (userProfile?.xp || 0)).toLocaleString()} XP to {nextRank.title}
              </p>
            )}
          </div>
        </div>
        
        <nav className="px-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setIsMobileOpen(false);
              }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                currentPage === item.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>
    </>
  );
};

// ============ RADAR CHART ============

const PillarRadarChart = ({ userProfile, tasks }) => {
  // Calculate progress for each pillar based on completed tasks
  const completedTasks = tasks.filter(t => t.status === 'wisdom');
  
  const pillarData = PILLARS.map(pillar => {
    const pillarTasks = completedTasks.filter(t => t.pillar === pillar.key);
    const totalTasks = tasks.filter(t => t.pillar === pillar.key);
    const progress = totalTasks.length > 0 
      ? Math.round((pillarTasks.length / Math.max(totalTasks.length, 10)) * 100)
      : (userProfile?.pillars_stats?.[pillar.key] || 0) * 2; // Fallback to stats
    
    return {
      pillar: pillar.label,
      value: Math.min(progress, 100),
      fullMark: 100,
      color: pillar.color
    };
  });
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Progresso nos 7 Pilares</h3>
          <p className="text-xs text-white/50">Baseado em tarefas completadas</p>
        </div>
        <BarChart3 className="w-5 h-5 text-primary" />
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={pillarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis 
              dataKey="pillar" 
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            />
            <Radar
              name="Progresso"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0a0a0c', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
              labelStyle={{ color: 'white' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {PILLARS.slice(0, 4).map(pillar => (
          <div key={pillar.key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.color }} />
            <span className="text-xs text-white/60 truncate">{pillar.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

// ============ PROTOCOLS WIDGET ============

const ProtocolsWidget = ({ protocols, onToggle, activeTab, setActiveTab }) => {
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
  
  const completedCount = filteredProtocols.filter(p => p.is_checked).length;
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
                protocol.is_checked 
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
              )}
            >
              {protocol.is_checked ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-white/30 flex-shrink-0" />
              )}
              <span className={cn(
                'text-sm text-left',
                protocol.is_checked ? 'text-white' : 'text-white/70'
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
};

// ============ SPRINTS OVERVIEW ============

const SprintsOverviewWidget = ({ sprints, onViewSprint, onNewSprint }) => {
  const activeSprints = sprints.filter(s => s.status === 'active');
  const completedSprints = sprints.filter(s => s.status === 'completed');
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Sprints</h3>
          <p className="text-xs text-white/50">{activeSprints.length} ativos, {completedSprints.length} completados</p>
        </div>
        <Kanban className="w-5 h-5 text-primary" />
      </div>
      
      <div className="space-y-3">
        {sprints.slice(0, 3).map(sprint => {
          const archetype = getArchetypeByKey(sprint.archetype);
          return (
            <button
              key={sprint.id}
              onClick={() => onViewSprint(sprint.id)}
              className="w-full p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{sprint.title}</span>
                <Badge color={sprint.status === 'active' ? '#10b981' : '#6b7280'}>
                  {sprint.status === 'active' ? 'Ativo' : 'Completo'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/50">
                {archetype && <span>{archetype.icon} {archetype.name}</span>}
                <span>•</span>
                <span>{sprint.tasks_count || 0} tarefas</span>
              </div>
            </button>
          );
        })}
        
        {sprints.length === 0 && (
          <p className="text-center text-white/40 py-4 text-sm">
            Nenhum sprint criado ainda
          </p>
        )}
      </div>
      
      <Button variant="secondary" className="w-full mt-4" size="sm" onClick={onNewSprint}>
        <Plus className="w-4 h-4 mr-2" />
        Novo Sprint
      </Button>
    </GlassCard>
  );
};

// ============ AI ASSISTANT WIDGET ============

const AIAssistantWidget = ({ userProfile }) => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleAsk = async () => {
    if (!message.trim() || loading) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message,
          context: `Tipo HD: ${userProfile?.hd_type || 'generator'}, Arquétipo: ${userProfile?.archetype || 'hero'}`,
          type: 'general'
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setResponse(data.response);
      } else {
        setResponse('Desculpe, não consegui processar sua pergunta.');
      }
    } catch (error) {
      setResponse('Erro ao conectar com o assistente.');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-white">Siddha AI</h3>
          <p className="text-xs text-white/50">Seu guia de desenvolvimento</p>
        </div>
      </div>
      
      {response && (
        <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-white/80 whitespace-pre-wrap">{response}</p>
        </div>
      )}
      
      <div className="flex gap-2">
        <Input
          placeholder="Pergunte sobre sua jornada..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
          className="flex-1"
        />
        <Button onClick={handleAsk} loading={loading} size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </GlassCard>
  );
};

// ============ AUTH PAGE ============

const AuthPage = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const supabase = createClient();
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      
      if (error) throw error;
      
      if (data.user && !data.user.confirmed_at) {
        setMessage('Check your email for the confirmation link!');
      } else {
        onAuthSuccess(data.user);
      }
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Siddha Code</h1>
          <p className="text-white/50 mt-2">Life Operating System</p>
        </div>
        
        <GlassCard className="p-8">
          <div className="flex mb-6 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => { setMode('signin'); setError(''); setMessage(''); }}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all',
                mode === 'signin' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); setMessage(''); }}
              className={cn(
                'flex-1 py-2 rounded-md text-sm font-medium transition-all',
                mode === 'signup' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
              )}
            >
              Sign Up
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-sm text-green-400">{message}</p>
            </div>
          )}
          
          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            
            <div className="relative">
              <Input label="Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {mode === 'signup' && (
              <Input label="Confirm Password" type={showPassword ? 'text' : 'password'} icon={Lock} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            )}
            
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <Button type="button" variant="secondary" className="w-full" onClick={() => onAuthSuccess({ id: 'demo-user', email: 'demo@siddhacode.com' })}>
              <Sparkles className="w-4 h-4 mr-2" />
              Try Demo Mode
            </Button>
            <p className="text-xs text-white/30 text-center mt-2">Explore todas as funcionalidades</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

// ============ DASHBOARD PAGE ============

const DashboardPage = ({ userProfile, protocols, onToggleProtocol, tasks, sprints, setSprints }) => {
  const [protocolTab, setProtocolTab] = useState('daily');
  const [isSprintBuilderOpen, setIsSprintBuilderOpen] = useState(false);
  const displayName = userProfile?.username || 'Warrior';
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Quick stats
  const completedTasks = tasks.filter(t => t.status === 'wisdom').length;
  const activeTasks = tasks.filter(t => t.status !== 'wisdom').length;
  const activeSprints = sprints.filter(s => s.status === 'active').length;
  
  const handleCreateSprint = (sprint) => {
    setSprints(prev => [...prev, { 
      ...sprint, 
      id: uuidv4(), 
      status: 'active', 
      created_at: new Date().toISOString() 
    }]);
  };
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Bem-vindo, {displayName}!</h1>
          <p className="text-white/50 capitalize">{today}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Calendar className="w-4 h-4 mr-2" />
            Ver Calendário
          </Button>
          <Button onClick={() => setIsSprintBuilderOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Sprint
          </Button>
        </div>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{(userProfile?.xp || 0).toLocaleString()}</p>
              <p className="text-xs text-white/50">Total XP</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{userProfile?.streak || 0}</p>
              <p className="text-xs text-white/50">Dias Streak</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedTasks}</p>
              <p className="text-xs text-white/50">Completadas</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Kanban className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{activeSprints}</p>
              <p className="text-xs text-white/50">Sprints Ativos</p>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <ProtocolsWidget 
            protocols={protocols} 
            onToggle={onToggleProtocol} 
            activeTab={protocolTab}
            setActiveTab={setProtocolTab}
          />
          <SprintsOverviewWidget 
            sprints={sprints} 
            onViewSprint={() => {}} 
            onNewSprint={() => setIsSprintBuilderOpen(true)}
          />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <PillarRadarChart userProfile={userProfile} tasks={tasks} />
          <AIAssistantWidget userProfile={userProfile} />
        </div>
      </div>
      
      {/* Sprint Builder Modal */}
      <SprintBuilder
        isOpen={isSprintBuilderOpen}
        onClose={() => setIsSprintBuilderOpen(false)}
        onCreateSprint={handleCreateSprint}
        userProfile={userProfile}
      />
    </div>
  );
};

// ============ SPRINTS PAGE (simplified for now) ============

const SprintsPage = ({ tasks, setTasks, userProfile, onUpdateTask, sprints, setSprints }) => {
  const [viewMode, setViewMode] = useState('kanban');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState(null);
  
  const viewTabs = [
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'list', label: 'Lista', icon: BarChart3 },
  ];
  
  const filteredTasks = selectedPillar 
    ? tasks.filter(t => t.pillar === selectedPillar)
    : tasks;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sprints</h1>
          <p className="text-white/50">Gerencie seus ciclos de desenvolvimento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsCreateSprintModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Sprint
          </Button>
          <Button onClick={() => setIsCreateTaskModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>
      
      {/* View Mode Tabs */}
      <div className="flex items-center justify-between">
        <Tabs tabs={viewTabs} activeTab={viewMode} onChange={setViewMode} className="w-auto" />
        
        {/* Pillar Filter */}
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedPillar(null)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all',
              selectedPillar === null ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60'
            )}
          >
            Todos
          </button>
          {PILLARS.map(pillar => (
            <button
              key={pillar.key}
              onClick={() => setSelectedPillar(pillar.key)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all',
                selectedPillar === pillar.key ? '' : 'bg-white/5 text-white/60'
              )}
              style={selectedPillar === pillar.key ? {
                backgroundColor: `${pillar.color}30`,
                color: pillar.color
              } : {}}
            >
              {pillar.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content based on view mode */}
      {viewMode === 'kanban' && (
        <KanbanView tasks={filteredTasks} setTasks={setTasks} onUpdateTask={onUpdateTask} userProfile={userProfile} />
      )}
      
      {viewMode === 'timeline' && (
        <TimelineView tasks={filteredTasks} sprints={sprints} />
      )}
      
      {viewMode === 'list' && (
        <ListView tasks={filteredTasks} onUpdateTask={onUpdateTask} />
      )}
      
      <CreateTaskModal 
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={(task) => setTasks(prev => [...prev, { ...task, id: uuidv4(), status: 'potential', gut_check_score: null }])}
      />
      
      <SprintBuilder
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        onCreateSprint={(sprint) => setSprints(prev => [...prev, { ...sprint, id: uuidv4(), status: 'active', created_at: new Date().toISOString() }])}
        userProfile={userProfile}
      />
    </div>
  );
};

// Kanban View Component (reusing previous DnD logic)
const KanbanView = ({ tasks, setTasks, onUpdateTask, userProfile }) => {
  const [activeId, setActiveId] = useState(null);
  const [gutCheckTask, setGutCheckTask] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const tasksByColumn = useMemo(() => {
    const result = {};
    KANBAN_COLUMNS.forEach(col => {
      result[col.id] = tasks.filter(t => t.status === col.id);
    });
    return result;
  }, [tasks]);
  
  const activeTask = useMemo(() => activeId ? tasks.find(t => t.id === activeId) : null, [activeId, tasks]);
  
  const handleDragStart = (event) => setActiveId(event.active.id);
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    
    const draggedTask = tasks.find(t => t.id === active.id);
    if (!draggedTask) return;
    
    const targetColumn = KANBAN_COLUMNS.find(col => col.id === over.id);
    const targetTask = tasks.find(t => t.id === over.id);
    let newStatus = draggedTask.status;
    
    if (targetColumn) newStatus = targetColumn.id;
    else if (targetTask) newStatus = targetTask.status;
    
    if (newStatus === 'response' && draggedTask.status !== 'response' && !draggedTask.gut_check_score) {
      setGutCheckTask(draggedTask);
      setPendingMove(newStatus);
      return;
    }
    
    if (newStatus !== draggedTask.status) {
      onUpdateTask({ ...draggedTask, status: newStatus });
    }
  };
  
  const handleGutCheckConfirm = (score) => {
    if (gutCheckTask && pendingMove) {
      onUpdateTask({ ...gutCheckTask, status: pendingMove, gut_check_score: score });
    }
    setGutCheckTask(null);
    setPendingMove(null);
  };
  
  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map(column => (
            <DroppableColumn key={column.id} column={column} tasks={tasksByColumn[column.id]}>
              {tasksByColumn[column.id].map(task => (
                <SortableTaskCard key={task.id} task={task} />
              ))}
            </DroppableColumn>
          ))}
        </div>
        <DragOverlay>{activeTask && <DragOverlayCard task={activeTask} />}</DragOverlay>
      </DndContext>
      
      <GutCheckModal
        isOpen={!!gutCheckTask}
        onClose={() => { setGutCheckTask(null); setPendingMove(null); }}
        onConfirm={handleGutCheckConfirm}
        task={gutCheckTask}
        hdType={userProfile?.hd_type || 'generator'}
      />
    </>
  );
};

// Timeline View
const TimelineView = ({ tasks, sprints }) => (
  <GlassCard className="p-6">
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-white/40 py-8">Nenhuma tarefa para exibir na timeline</p>
      ) : (
        tasks.map((task, idx) => {
          const pillar = getPillarByKey(task.pillar);
          return (
            <div key={task.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar?.color || '#6b7280' }} />
                {idx < tasks.length - 1 && <div className="w-0.5 flex-1 bg-white/10 my-1" />}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm font-medium text-white">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color={pillar?.color || '#6b7280'}>{pillar?.label || task.pillar}</Badge>
                  <span className="text-xs text-white/40">{getColumnById(task.status)?.label}</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </GlassCard>
);

// List View
const ListView = ({ tasks, onUpdateTask }) => (
  <GlassCard className="divide-y divide-white/5">
    {tasks.length === 0 ? (
      <p className="text-center text-white/40 py-8">Nenhuma tarefa</p>
    ) : (
      tasks.map(task => {
        const pillar = getPillarByKey(task.pillar);
        const column = getColumnById(task.status);
        return (
          <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02]">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column?.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{task.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge color={pillar?.color || '#6b7280'}>{pillar?.label}</Badge>
                {task.gut_check_score && <span className="text-xs text-white/40">Gut: {task.gut_check_score}/10</span>}
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${column?.color}20`, color: column?.color }}>
              {column?.label}
            </span>
          </div>
        );
      })
    )}
  </GlassCard>
);

// DnD Components (simplified)
const SortableTaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const pillar = getPillarByKey(task.pillar);
  
  return (
    <div ref={setNodeRef} style={style} className={cn('bg-surface border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all', isDragging && 'shadow-lg shadow-primary/20 border-primary/50')}>
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing touch-none">
          <GripVertical className="w-4 h-4 text-white/30 hover:text-white/60" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium mb-2">{task.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge color={pillar?.color || '#6b7280'}>{pillar?.label || task.pillar}</Badge>
            {task.gut_check_score && <span className="text-xs text-white/50">Gut: {task.gut_check_score}/10</span>}
          </div>
          {task.xp_reward > 0 && <p className="text-xs text-primary mt-2">+{task.xp_reward} XP</p>}
        </div>
      </div>
    </div>
  );
};

const DroppableColumn = ({ column, tasks, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: column.color }} />
        <h3 className="font-semibold text-white">{column.label}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{tasks.length}</span>
      </div>
      <GlassCard ref={setNodeRef} className={cn('p-3 min-h-[400px] transition-all duration-200', isOver && 'ring-2 ring-primary/50 bg-primary/5')}>
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">{tasks.length === 0 ? <div className="py-8 text-center text-white/30 text-sm">{isOver ? 'Solte aqui!' : 'Sem tarefas'}</div> : children}</div>
        </SortableContext>
      </GlassCard>
    </div>
  );
};

const DragOverlayCard = ({ task }) => {
  const pillar = getPillarByKey(task.pillar);
  return (
    <div className="bg-surface border-2 border-primary rounded-lg p-4 shadow-xl shadow-primary/20 w-[280px]">
      <div className="flex items-start gap-3">
        <GripVertical className="w-4 h-4 text-primary mt-1" />
        <div className="flex-1">
          <p className="text-sm text-white font-medium mb-2">{task.title}</p>
          <Badge color={pillar?.color || '#6b7280'}>{pillar?.label || task.pillar}</Badge>
        </div>
      </div>
    </div>
  );
};

// Gut Check Modal
const GutCheckModal = ({ isOpen, onClose, onConfirm, task, hdType }) => {
  const [score, setScore] = useState(7);
  if (!isOpen) return null;
  const hdTypeData = getHDTypeByKey(hdType);
  const prompt = hdTypeData?.gutCheckPrompt || 'De 1 a 10, quão alinhado você se sente com esta tarefa?';
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-kanban-response/20 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-kanban-response" />
          </div>
          <h3 className="text-xl font-semibold text-white">Gut Check</h3>
          <p className="text-white/50 text-sm mt-2">Validação para mover para "Resposta"</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
          <p className="text-sm text-white/80 italic">"{prompt}"</p>
          {hdTypeData && (
            <p className="text-xs mt-2" style={{ color: hdTypeData.color }}>
              Sua estratégia: {hdTypeData.strategy}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/50">Nível de Alinhamento</span>
            <span className={cn('font-bold', score >= 7 ? 'text-kanban-response' : 'text-yellow-500')}>{score}/10</span>
          </div>
          <input type="range" min="1" max="10" value={score} onChange={(e) => setScore(parseInt(e.target.value))} className="w-full accent-primary" />
        </div>
        
        {score < 7 && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm text-yellow-400">Score abaixo de 7 - Considere se esta tarefa realmente se alinha com sua energia.</p>
          </div>
        )}
        
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
          <Button className="flex-1" onClick={() => onConfirm(score)}>Confirmar</Button>
        </div>
      </GlassCard>
    </div>
  );
};

// Create Task Modal
const CreateTaskModal = ({ isOpen, onClose, onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState('physical');
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateTask({ title: title.trim(), pillar, xp_reward: XP_REWARDS.task_complete });
    setTitle('');
    setPillar('physical');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Nova Tarefa</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Título" placeholder="Digite o título da tarefa..." value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <div>
            <label className="block text-sm text-white/70 mb-2">Pilar</label>
            <div className="grid grid-cols-2 gap-2">
              {PILLARS.map(p => (
                <button key={p.key} type="button" onClick={() => setPillar(p.key)}
                  className={cn('px-3 py-2 rounded-lg text-sm text-left transition-all', pillar === p.key ? 'border-2' : 'bg-white/5 border border-white/10')}
                  style={pillar === p.key ? { backgroundColor: `${p.color}20`, borderColor: p.color, color: p.color } : {}}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1">Criar Tarefa</Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

// Create Sprint Modal
// ============ SPRINT BUILDER WITH GATEKEEPER ============

const GATEKEEPER_STEPS = [
  { 
    id: 'intention', 
    title: 'Intenção',
    description: 'Defina a intenção clara do seu sprint',
    icon: Target,
    gatekeeperQuestion: 'Qual é a transformação que você busca neste ciclo?'
  },
  { 
    id: 'archetype', 
    title: 'Arquétipo',
    description: 'Escolha a energia que guiará seu sprint',
    icon: Sparkles,
    gatekeeperQuestion: 'Qual energia arquetípica ressoa com sua jornada atual?'
  },
  { 
    id: 'pillars', 
    title: 'Pilares',
    description: 'Selecione os pilares de foco',
    icon: BarChart3,
    gatekeeperQuestion: 'Quais áreas da vida você deseja desenvolver?'
  },
  { 
    id: 'commitment', 
    title: 'Compromisso',
    description: 'Defina suas metas e tempo',
    icon: Calendar,
    gatekeeperQuestion: 'O que você está disposto a comprometer para este sprint?'
  },
  { 
    id: 'alignment', 
    title: 'Alinhamento',
    description: 'Validação final do Gatekeeper',
    icon: CheckCircle2,
    gatekeeperQuestion: 'Este sprint está alinhado com seu Design?'
  }
];

const SprintBuilder = ({ isOpen, onClose, onCreateSprint, userProfile }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sprintData, setSprintData] = useState({
    title: '',
    intention: '',
    archetype: 'hero',
    focusPillars: [],
    duration: 7,
    goals: [],
    dailyCommitment: '',
    alignmentScore: 7
  });
  const [newGoal, setNewGoal] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationPassed, setValidationPassed] = useState(false);
  
  if (!isOpen) return null;
  
  const currentStepData = GATEKEEPER_STEPS[currentStep];
  const selectedArchetype = getArchetypeByKey(sprintData.archetype);
  const hdType = getHDTypeByKey(userProfile?.hd_type || 'generator');
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: // Intention
        return sprintData.title.trim().length >= 3 && sprintData.intention.trim().length >= 10;
      case 1: // Archetype
        return !!sprintData.archetype;
      case 2: // Pillars
        return sprintData.focusPillars.length >= 1 && sprintData.focusPillars.length <= 3;
      case 3: // Commitment
        return sprintData.goals.length >= 1 && sprintData.dailyCommitment.trim().length >= 5;
      case 4: // Alignment
        return sprintData.alignmentScore >= 7 && validationPassed;
      default:
        return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep === GATEKEEPER_STEPS.length - 1) {
      // Final step - create sprint
      handleCreateSprint();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setValidationPassed(false);
    }
  };
  
  const handleCreateSprint = () => {
    onCreateSprint({
      title: sprintData.title.trim(),
      intention: sprintData.intention.trim(),
      archetype: sprintData.archetype,
      focusPillars: sprintData.focusPillars,
      duration: sprintData.duration,
      goals: sprintData.goals,
      dailyCommitment: sprintData.dailyCommitment.trim(),
      alignmentScore: sprintData.alignmentScore,
      tasks_count: 0,
      mood_log: []
    });
    
    // Reset state
    setSprintData({
      title: '',
      intention: '',
      archetype: 'hero',
      focusPillars: [],
      duration: 7,
      goals: [],
      dailyCommitment: '',
      alignmentScore: 7
    });
    setCurrentStep(0);
    setValidationPassed(false);
    onClose();
  };
  
  const addGoal = () => {
    if (newGoal.trim()) {
      setSprintData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };
  
  const removeGoal = (index) => {
    setSprintData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };
  
  const togglePillar = (pillarKey) => {
    setSprintData(prev => {
      const current = prev.focusPillars;
      if (current.includes(pillarKey)) {
        return { ...prev, focusPillars: current.filter(p => p !== pillarKey) };
      }
      if (current.length < 3) {
        return { ...prev, focusPillars: [...current, pillarKey] };
      }
      return prev;
    });
  };
  
  const handleValidation = () => {
    setIsValidating(true);
    // Simulate gatekeeper validation
    setTimeout(() => {
      setIsValidating(false);
      if (sprintData.alignmentScore >= 7) {
        setValidationPassed(true);
      }
    }, 1500);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Intention
        return (
          <div className="space-y-4">
            <Input
              label="Nome do Sprint"
              placeholder="Ex: Despertar do Guerreiro Interior"
              value={sprintData.title}
              onChange={(e) => setSprintData(prev => ({ ...prev, title: e.target.value }))}
              autoFocus
            />
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Intenção Principal</label>
              <textarea
                placeholder="Descreva a transformação que busca... O que mudará em você ao final deste sprint?"
                value={sprintData.intention}
                onChange={(e) => setSprintData(prev => ({ ...prev, intention: e.target.value }))}
                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
              />
              <p className="text-xs text-white/40 mt-1">
                {sprintData.intention.length}/10 caracteres mínimos
              </p>
            </div>
          </div>
        );
        
      case 1: // Archetype
        return (
          <div className="space-y-4">
            <p className="text-sm text-white/60 mb-4">
              Escolha o arquétipo que melhor representa a energia que deseja cultivar neste sprint.
            </p>
            
            <div className="grid grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-2">
              {ARCHETYPES.map(arch => (
                <button
                  key={arch.key}
                  type="button"
                  onClick={() => setSprintData(prev => ({ ...prev, archetype: arch.key }))}
                  className={cn(
                    'p-4 rounded-xl text-center transition-all duration-300',
                    sprintData.archetype === arch.key 
                      ? 'ring-2 ring-primary scale-105 shadow-lg' 
                      : 'bg-white/5 border border-white/10 hover:border-white/20 hover:scale-102'
                  )}
                  style={sprintData.archetype === arch.key ? { 
                    backgroundColor: `${arch.color}15`,
                    borderColor: arch.color
                  } : {}}
                >
                  <span className="text-3xl block mb-2">{arch.icon}</span>
                  <span className="text-sm font-medium text-white">{arch.name}</span>
                </button>
              ))}
            </div>
            
            {selectedArchetype && (
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: `${selectedArchetype.color}10` }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{selectedArchetype.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{selectedArchetype.name}</h4>
                    <p className="text-xs text-white/50">{selectedArchetype.nameEn}</p>
                  </div>
                </div>
                <p className="text-sm text-primary italic mb-2">"{selectedArchetype.motto}"</p>
                <p className="text-xs text-white/60">{selectedArchetype.description}</p>
                <div className="flex gap-2 mt-3">
                  {selectedArchetype.focus.map(f => {
                    const pillar = getPillarByKey(f);
                    return pillar ? (
                      <span 
                        key={f}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${pillar.color}20`, color: pillar.color }}
                      >
                        {pillar.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        );
        
      case 2: // Pillars
        return (
          <div className="space-y-4">
            <p className="text-sm text-white/60">
              Selecione de 1 a 3 pilares para focar durante este sprint. 
              <span className="text-primary"> ({sprintData.focusPillars.length}/3 selecionados)</span>
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {PILLARS.map(pillar => {
                const isSelected = sprintData.focusPillars.includes(pillar.key);
                const isRecommended = selectedArchetype?.focus.includes(pillar.key);
                return (
                  <button
                    key={pillar.key}
                    type="button"
                    onClick={() => togglePillar(pillar.key)}
                    className={cn(
                      'p-4 rounded-xl text-left transition-all duration-200 relative',
                      isSelected 
                        ? 'ring-2 scale-[1.02]' 
                        : 'bg-white/5 border border-white/10 hover:border-white/20'
                    )}
                    style={isSelected ? { 
                      backgroundColor: `${pillar.color}15`,
                      ringColor: pillar.color,
                      borderColor: pillar.color
                    } : {}}
                  >
                    {isRecommended && !isSelected && (
                      <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary">
                        Recomendado
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${pillar.color}20` }}
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{pillar.label}</p>
                        <p className="text-xs text-white/50">{pillar.description?.slice(0, 30)}...</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 
                        className="absolute bottom-3 right-3 w-5 h-5" 
                        style={{ color: pillar.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
        
      case 3: // Commitment
        return (
          <div className="space-y-4">
            {/* Duration */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Duração do Sprint</label>
              <div className="grid grid-cols-4 gap-2">
                {[7, 14, 21, 30].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSprintData(prev => ({ ...prev, duration: d }))}
                    className={cn(
                      'py-3 rounded-xl text-center transition-all',
                      sprintData.duration === d 
                        ? 'bg-primary text-white font-semibold' 
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    )}
                  >
                    <span className="block text-lg">{d}</span>
                    <span className="text-xs">dias</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Daily Commitment */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Compromisso Diário</label>
              <textarea
                placeholder="O que você se compromete a fazer todos os dias? Ex: Dedicar 30 minutos ao meu desenvolvimento..."
                value={sprintData.dailyCommitment}
                onChange={(e) => setSprintData(prev => ({ ...prev, dailyCommitment: e.target.value }))}
                className="w-full h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
              />
            </div>
            
            {/* Goals */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Metas do Sprint ({sprintData.goals.length} definidas)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Adicione uma meta..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
                <Button type="button" onClick={addGoal} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {sprintData.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                    <Target className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="flex-1 text-sm text-white">{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeGoal(idx)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <X className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                ))}
                {sprintData.goals.length === 0 && (
                  <p className="text-center text-white/40 py-4 text-sm">
                    Adicione pelo menos uma meta
                  </p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 4: // Alignment
        return (
          <div className="space-y-6">
            {/* Summary */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold text-white mb-3">Resumo do Sprint</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Nome:</span>
                  <span className="text-white">{sprintData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Arquétipo:</span>
                  <span className="text-white">{selectedArchetype?.icon} {selectedArchetype?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Duração:</span>
                  <span className="text-white">{sprintData.duration} dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Pilares:</span>
                  <div className="flex gap-1">
                    {sprintData.focusPillars.map(p => {
                      const pillar = getPillarByKey(p);
                      return (
                        <span 
                          key={p}
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: pillar?.color }}
                          title={pillar?.label}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Metas:</span>
                  <span className="text-white">{sprintData.goals.length} definidas</span>
                </div>
              </div>
            </div>
            
            {/* HD Type Reminder */}
            {hdType && (
              <div className="p-4 rounded-xl border" style={{ 
                backgroundColor: `${hdType.color}10`,
                borderColor: `${hdType.color}30`
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${hdType.color}30` }}>
                    <Sparkles className="w-4 h-4" style={{ color: hdType.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{hdType.name}</p>
                    <p className="text-xs text-white/50">Sua Estratégia: {hdType.strategy}</p>
                  </div>
                </div>
                <p className="text-sm italic text-white/70">"{hdType.gutCheckPrompt}"</p>
              </div>
            )}
            
            {/* Alignment Score */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Nível de Alinhamento com seu Design
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sprintData.alignmentScore}
                  onChange={(e) => {
                    setSprintData(prev => ({ ...prev, alignmentScore: parseInt(e.target.value) }));
                    setValidationPassed(false);
                  }}
                  className="flex-1 accent-primary"
                />
                <span className={cn(
                  'text-2xl font-bold w-12 text-center',
                  sprintData.alignmentScore >= 7 ? 'text-green-500' : 'text-yellow-500'
                )}>
                  {sprintData.alignmentScore}
                </span>
              </div>
              {sprintData.alignmentScore < 7 && (
                <p className="text-sm text-yellow-500 mt-2">
                  Score abaixo de 7 - O Gatekeeper recomenda reconsiderar este sprint.
                </p>
              )}
            </div>
            
            {/* Validation Button */}
            {!validationPassed && sprintData.alignmentScore >= 7 && (
              <Button 
                type="button" 
                onClick={handleValidation}
                loading={isValidating}
                className="w-full"
                variant="secondary"
              >
                {isValidating ? 'Validando com o Gatekeeper...' : 'Solicitar Validação do Gatekeeper'}
              </Button>
            )}
            
            {validationPassed && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-green-400 font-medium">Gatekeeper Aprovado!</p>
                <p className="text-sm text-white/60">Este sprint está alinhado com seu Design.</p>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Sprint Builder</h3>
              <p className="text-sm text-white/50">Gatekeeper Sequencial</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {GATEKEEPER_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    isActive ? 'bg-primary text-white scale-110' :
                    isCompleted ? 'bg-green-500 text-white' :
                    'bg-white/10 text-white/40'
                  )}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  {idx < GATEKEEPER_STEPS.length - 1 && (
                    <div className={cn(
                      'w-8 lg:w-16 h-0.5 mx-1',
                      idx < currentStep ? 'bg-green-500' : 'bg-white/10'
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Step Info */}
        <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              {(() => {
                const StepIcon = currentStepData.icon;
                return <StepIcon className="w-6 h-6 text-primary" />;
              })()}
            </div>
            <div>
              <h4 className="font-semibold text-white">{currentStepData.title}</h4>
              <p className="text-sm text-white/50">{currentStepData.description}</p>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-primary italic">
              Gatekeeper: "{currentStepData.gatekeeperQuestion}"
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStepContent()}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={currentStep === 0 ? onClose : handleBack}
          >
            {currentStep === 0 ? 'Cancelar' : 'Voltar'}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40">
              Passo {currentStep + 1} de {GATEKEEPER_STEPS.length}
            </span>
            <Button 
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === GATEKEEPER_STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Criar Sprint
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep old CreateSprintModal as a simple fallback (renamed)
const CreateSprintModalSimple = ({ isOpen, onClose, onCreateSprint }) => {
  const [title, setTitle] = useState('');
  const [archetype, setArchetype] = useState('hero');
  const [duration, setDuration] = useState(7);
  const [goals, setGoals] = useState('');
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onCreateSprint({
      title: title.trim(),
      archetype,
      duration,
      goals: goals.split('\n').filter(Boolean),
      tasks_count: 0
    });
    
    setTitle('');
    setArchetype('hero');
    setDuration(7);
    setGoals('');
    onClose();
  };
  
  const selectedArchetype = getArchetypeByKey(archetype);
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Novo Sprint</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Sprint"
            placeholder="Ex: Semana do Foco Total"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          
          {/* Duration */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Duração (dias)</label>
            <div className="flex gap-2">
              {[7, 14, 21, 30].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm transition-all',
                    duration === d 
                      ? 'bg-primary text-white' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {d} dias
                </button>
              ))}
            </div>
          </div>
          
          {/* Archetype Selection */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Arquétipo do Sprint</label>
            <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
              {ARCHETYPES.map(arch => (
                <button
                  key={arch.key}
                  type="button"
                  onClick={() => setArchetype(arch.key)}
                  className={cn(
                    'p-3 rounded-lg text-center transition-all',
                    archetype === arch.key 
                      ? 'bg-primary/20 border-2 border-primary' 
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  )}
                >
                  <span className="text-2xl block mb-1">{arch.icon}</span>
                  <span className="text-xs text-white/80">{arch.name}</span>
                </button>
              ))}
            </div>
            
            {selectedArchetype && (
              <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-primary font-medium">{selectedArchetype.name}</p>
                <p className="text-xs text-white/60 italic">"{selectedArchetype.motto}"</p>
                <p className="text-xs text-white/50 mt-1">{selectedArchetype.description}</p>
              </div>
            )}
          </div>
          
          {/* Goals */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Objetivos (um por linha)</label>
            <textarea
              placeholder="Completar 10 tarefas&#10;Atingir 500 XP&#10;Manter streak de 7 dias"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="flex-1">Criar Sprint</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ JOURNAL PAGE ============

const JournalPage = ({ journals, setJournals, userProfile }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', tags: [], pillar: 'mental' });
  const [searchQuery, setSearchQuery] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return;
    const entry = {
      id: uuidv4(),
      ...newEntry,
      created_at: new Date().toISOString(),
      linked_entries: []
    };
    setJournals(prev => [entry, ...prev]);
    setNewEntry({ title: '', content: '', tags: [], pillar: 'mental' });
    setTagInput('');
    setIsCreating(false);
  };
  
  const handleDeleteEntry = (entryId) => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      setJournals(prev => prev.filter(j => j.id !== entryId));
      setSelectedEntry(null);
    }
  };
  
  const handleTagInput = (e) => {
    const value = e.target.value;
    // Check if user typed # followed by text and space or enter
    if (value.endsWith(' ') && value.includes('#')) {
      const tags = value.match(/#(\w+)/g)?.map(t => t.slice(1)) || [];
      if (tags.length > 0) {
        setNewEntry(prev => ({ 
          ...prev, 
          tags: [...new Set([...(prev.tags || []), ...tags])] 
        }));
        setTagInput('');
        return;
      }
    }
    setTagInput(value);
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.includes('#')) {
      e.preventDefault();
      const tags = tagInput.match(/#(\w+)/g)?.map(t => t.slice(1)) || [];
      if (tags.length > 0) {
        setNewEntry(prev => ({ 
          ...prev, 
          tags: [...new Set([...(prev.tags || []), ...tags])] 
        }));
        setTagInput('');
      }
    }
  };
  
  const removeTag = (tagToRemove) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
  };
  
  // Get sub-pillars for selected pillar
  const subPillarsForPillar = SUB_PILLARS[newEntry.pillar] || [];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Journal</h1>
          <p className="text-white/50">Seu segundo cérebro</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Entrada
        </Button>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <input
          type="text"
          placeholder="Buscar entradas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
        />
      </div>
      
      {/* Journal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJournals.map(entry => {
          const pillar = getPillarByKey(entry.pillar);
          return (
            <GlassCard
              key={entry.id}
              className="p-4 cursor-pointer hover:border-white/20 transition-all"
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex items-center gap-2 mb-2">
                {pillar && (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.color }} />
                )}
                <h3 className="font-semibold text-white line-clamp-1 flex-1">{entry.title}</h3>
              </div>
              <p className="text-sm text-white/60 line-clamp-3 mb-3">{entry.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {entry.tags?.slice(0, 3).map(tag => {
                    const subPillar = getSubPillarByKey(tag);
                    return (
                      <span 
                        key={tag} 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={subPillar ? { 
                          backgroundColor: `${getPillarColor(subPillar.pillar)}20`,
                          color: getPillarColor(subPillar.pillar)
                        } : { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                      >
                        #{subPillar?.label || tag}
                      </span>
                    );
                  })}
                </div>
                <span className="text-xs text-white/40">
                  {new Date(entry.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </GlassCard>
          );
        })}
        
        {filteredJournals.length === 0 && (
          <div className="col-span-full">
            <GlassCard className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhuma entrada</h3>
              <p className="text-white/50 mb-4">Comece a documentar sua jornada</p>
              <Button onClick={() => setIsCreating(true)}>Criar Primeira Entrada</Button>
            </GlassCard>
          </div>
        )}
      </div>
      
      {/* Create Entry Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Nova Entrada</h3>
              <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <Input
                label="Título"
                placeholder="Título da entrada..."
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              />
              
              {/* Pillar Selection */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Pilar Principal</label>
                <div className="flex flex-wrap gap-2">
                  {PILLARS.map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setNewEntry(prev => ({ ...prev, pillar: p.key }))}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs transition-all',
                        newEntry.pillar === p.key ? '' : 'bg-white/5 text-white/60'
                      )}
                      style={newEntry.pillar === p.key ? {
                        backgroundColor: `${p.color}30`,
                        color: p.color
                      } : {}}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-white/70 mb-2">Conteúdo</label>
                <textarea
                  placeholder="Escreva seus pensamentos... Use [[link]] para conectar outras entradas."
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full h-48 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
                />
              </div>
              
              {/* Tags with # */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Tags (use # para adicionar)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newEntry.tags?.map(tag => {
                    const subPillar = getSubPillarByKey(tag);
                    return (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                        style={subPillar ? { 
                          backgroundColor: `${getPillarColor(subPillar.pillar)}20`,
                          color: getPillarColor(subPillar.pillar)
                        } : { backgroundColor: 'rgba(139,92,246,0.2)', color: '#8b5cf6' }}
                      >
                        #{subPillar?.label || tag}
                        <button 
                          onClick={() => removeTag(tag)}
                          className="hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                <input
                  placeholder="#meditacao #leitura #cardio"
                  value={tagInput}
                  onChange={handleTagInput}
                  onKeyDown={handleTagKeyDown}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-white/40 mt-1">Pressione espaço ou Enter após cada #tag</p>
              </div>
              
              {/* Quick Sub-Pillar Tags */}
              <div>
                <label className="block text-sm text-white/70 mb-2">Sub-pilares sugeridos ({getPillarByKey(newEntry.pillar)?.label})</label>
                <div className="flex flex-wrap gap-2">
                  {subPillarsForPillar.slice(0, 6).map(sp => (
                    <button
                      key={sp.key}
                      type="button"
                      onClick={() => {
                        if (!newEntry.tags?.includes(sp.key)) {
                          setNewEntry(prev => ({ ...prev, tags: [...(prev.tags || []), sp.key] }));
                        }
                      }}
                      disabled={newEntry.tags?.includes(sp.key)}
                      className={cn(
                        'px-2 py-1 rounded-full text-xs transition-all',
                        newEntry.tags?.includes(sp.key) 
                          ? 'bg-primary/20 text-primary opacity-50' 
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      )}
                    >
                      {sp.icon} {sp.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setIsCreating(false)}>Cancelar</Button>
                <Button className="flex-1" onClick={handleCreateEntry}>Salvar Entrada</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getPillarByKey(selectedEntry.pillar) && (
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getPillarByKey(selectedEntry.pillar)?.color }} 
                  />
                )}
                <h2 className="text-xl font-bold text-white">{selectedEntry.title}</h2>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 whitespace-pre-wrap">{selectedEntry.content}</p>
            </div>
            
            {selectedEntry.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-6 pt-4 border-t border-white/10">
                {selectedEntry.tags.map(tag => {
                  const subPillar = getSubPillarByKey(tag);
                  return (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 rounded-full"
                      style={subPillar ? { 
                        backgroundColor: `${getPillarColor(subPillar.pillar)}20`,
                        color: getPillarColor(subPillar.pillar)
                      } : { backgroundColor: 'rgba(139,92,246,0.2)', color: '#8b5cf6' }}
                    >
                      #{subPillar?.label || tag}
                    </span>
                  );
                })}
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-white/40">
                Criado em {new Date(selectedEntry.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm"><Edit3 className="w-4 h-4 mr-1" /> Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteEntry(selectedEntry.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ PROFILE PAGE ============

const ProfilePage = ({ user, userProfile, setUserProfile }) => {
  const currentRank = getRankByXp(userProfile?.xp || 0);
  const displayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
  const hdType = getHDTypeByKey(userProfile?.hd_type);
  const archetype = getArchetypeByKey(userProfile?.archetype);
  const zodiac = ZODIAC_SIGNS.find(z => z.key === userProfile?.zodiac);
  
  const socialLinks = [
    { key: 'instagram', icon: Instagram, label: 'Instagram' },
    { key: 'twitter', icon: Twitter, label: 'Twitter/X' },
    { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
    { key: 'github', icon: Github, label: 'GitHub' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Perfil</h1>
        <p className="text-white/50">Sua identidade Siddha</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassCard className="p-6 lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold">{displayName[0]?.toUpperCase()}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{displayName}</h2>
            <p className="text-white/50 text-sm">{user?.email}</p>
            <Badge color={currentRank.color} className="mt-2">{currentRank.title}</Badge>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <p className="text-2xl font-bold text-primary">{(userProfile?.xp || 0).toLocaleString()}</p>
                <p className="text-xs text-white/50">XP Total</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02]">
                <p className="text-2xl font-bold text-orange-500">{userProfile?.streak || 0}</p>
                <p className="text-xs text-white/50">Dias Streak</p>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-semibold text-white mb-3">Redes Sociais</h3>
            <div className="space-y-2">
              {socialLinks.map(social => (
                <div key={social.key} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                  <social.icon className="w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder={`@seu_${social.key}`}
                    value={userProfile?.social_links?.[social.key] || ''}
                    onChange={(e) => setUserProfile(prev => ({
                      ...prev,
                      social_links: { ...(prev?.social_links || {}), [social.key]: e.target.value }
                    }))}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
        
        {/* Human Design & Archetype */}
        <div className="lg:col-span-2 space-y-6">
          {/* Human Design */}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Human Design
            </h3>
            
            {hdType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Tipo Energético</p>
                  <p className="text-lg font-semibold" style={{ color: hdType.color }}>{hdType.name}</p>
                  <p className="text-xs text-white/40 mt-1">{hdType.percentage} da população</p>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                  <p className="text-xs text-white/50 mb-1">Estratégia</p>
                  <p className="text-lg font-semibold text-white">{hdType.strategy}</p>
                </div>
                <div className="md:col-span-2 p-4 rounded-lg" style={{ backgroundColor: `${hdType.color}10`, borderColor: `${hdType.color}30`, borderWidth: 1 }}>
                  <p className="text-sm text-white/80">{hdType.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-white/50 mb-4">Configure seu Human Design para personalizar sua experiência</p>
                <Button>Configurar Human Design</Button>
              </div>
            )}
          </GlassCard>
          
          {/* Archetype */}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Arquétipo Atual
            </h3>
            
            {archetype ? (
              <div className="flex items-start gap-4">
                <div className="text-4xl">{archetype.icon}</div>
                <div>
                  <h4 className="text-lg font-semibold text-white">{archetype.name}</h4>
                  <p className="text-sm text-white/60 italic">"{archetype.motto}"</p>
                  <p className="text-sm text-white/50 mt-2">{archetype.description}</p>
                  <div className="flex gap-2 mt-3">
                    {archetype.focus.map(f => {
                      const p = getPillarByKey(f);
                      return p ? <Badge key={f} color={p.color}>{p.label}</Badge> : null;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-white/50 mb-4">Escolha um arquétipo para guiar seu próximo Sprint</p>
                <Button>Escolher Arquétipo</Button>
              </div>
            )}
          </GlassCard>
          
          {/* Pillar Progress */}
          <GlassCard className="p-6">
            <h3 className="font-semibold text-white mb-4">Progresso nos Pilares</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {PILLARS.map(pillar => {
                const value = userProfile?.pillars_stats?.[pillar.key] || 0;
                return (
                  <div key={pillar.key} className="text-center">
                    <div className="w-14 h-14 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${pillar.color}20` }}>
                      <span className="text-lg font-bold" style={{ color: pillar.color }}>{value}</span>
                    </div>
                    <p className="text-xs text-white/70">{pillar.label}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN APP ============

const DEFAULT_PROTOCOLS = [
  { id: uuidv4(), name: 'Rotina Matinal', is_checked: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Hidratação (8 copos)', is_checked: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Meditação', is_checked: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Exercício', is_checked: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Tempo de Aprendizado', is_checked: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Revisão Semanal', is_checked: false, frequency: 'weekly' },
  { id: uuidv4(), name: 'Planejamento de Sprint', is_checked: false, frequency: 'weekly' },
  { id: uuidv4(), name: 'Review Mensal', is_checked: false, frequency: 'monthly' },
];

const DEFAULT_TASKS = [
  { id: uuidv4(), title: 'Bem-vindo ao Siddha Code!', pillar: 'spiritual', status: 'potential', gut_check_score: null, xp_reward: 10 },
];

const DEFAULT_PROFILE = {
  username: '',
  xp: 0,
  streak: 0,
  hd_type: 'generator',
  archetype: 'hero',
  zodiac: null,
  social_links: {},
  pillars_stats: { physical: 0, mental: 0, intellectual: 0, spiritual: 0, cultural: 0, professional: 0, personal: 0 }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [journals, setJournals] = useState([]);
  const [moodHistory, setMoodHistory] = useState([]);
  
  const supabase = createClient();
  
  // Get today's date string
  const today = new Date().toISOString().split('T')[0];
  const todayMood = moodHistory.find(m => m.date === today)?.mood || null;
  
  // Handle mood selection
  const handleSelectMood = (moodId) => {
    setMoodHistory(prev => {
      // Remove any existing entry for today
      const filtered = prev.filter(m => m.date !== today);
      // Add new mood entry with sprint context
      const activeSprint = sprints.find(s => s.status === 'active');
      return [...filtered, { 
        date: today, 
        mood: moodId, 
        sprintId: activeSprint?.id || null,
        timestamp: new Date().toISOString()
      }];
    });
  };
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserData(session.user);
      } else {
        setUser(null);
        setUserProfile(null);
        setTasks([]);
        setProtocols([]);
        setMoodHistory([]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  
  const loadUserData = async (authUser) => {
    const storageKey = `siddha_v2_${authUser.id}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const data = JSON.parse(savedData);
      setUserProfile(data.profile);
      setTasks(data.tasks || []);
      setProtocols(data.protocols || []);
      setSprints(data.sprints || []);
      setJournals(data.journals || []);
      setMoodHistory(data.moodHistory || []);
    } else {
      const newProfile = { ...DEFAULT_PROFILE, username: authUser.email?.split('@')[0] || 'Warrior' };
      setUserProfile(newProfile);
      setTasks(DEFAULT_TASKS);
      setProtocols(DEFAULT_PROTOCOLS);
      setSprints([]);
      setJournals([]);
      setMoodHistory([]);
      saveUserData(authUser.id, newProfile, DEFAULT_TASKS, DEFAULT_PROTOCOLS, [], [], []);
    }
  };
  
  const saveUserData = useCallback((userId, profile, taskList, protocolList, sprintList, journalList, moodList = []) => {
    const storageKey = `siddha_v2_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify({ 
      profile, 
      tasks: taskList, 
      protocols: protocolList, 
      sprints: sprintList, 
      journals: journalList,
      moodHistory: moodList
    }));
  }, []);
  
  useEffect(() => {
    if (user && userProfile) {
      saveUserData(user.id, userProfile, tasks, protocols, sprints, journals, moodHistory);
    }
  }, [user, userProfile, tasks, protocols, sprints, journals, moodHistory, saveUserData]);
  
  const handleAuthSuccess = async (authUser) => {
    setUser(authUser);
    await loadUserData(authUser);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };
  
  const handleToggleProtocol = (protocolId) => {
    setProtocols(prev => {
      const updated = prev.map(p => p.id === protocolId ? { ...p, is_checked: !p.is_checked } : p);
      const protocol = prev.find(p => p.id === protocolId);
      if (protocol && !protocol.is_checked) {
        setUserProfile(profile => ({ ...profile, xp: (profile?.xp || 0) + XP_REWARDS.protocol_complete }));
      }
      return updated;
    });
  };
  
  const handleUpdateTask = (updatedTask) => {
    setTasks(prev => {
      const oldTask = prev.find(t => t.id === updatedTask.id);
      if (updatedTask.status === 'wisdom' && oldTask?.status !== 'wisdom') {
        const xpGain = updatedTask.xp_reward || XP_REWARDS.task_complete;
        setUserProfile(profile => {
          const pillarStats = { ...(profile?.pillars_stats || {}) };
          pillarStats[updatedTask.pillar] = (pillarStats[updatedTask.pillar] || 0) + 1;
          return { ...profile, xp: (profile?.xp || 0) + xpGain, pillars_stats: pillarStats };
        });
      }
      return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>
    );
  }
  
  if (!user) return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'sprints': return 'Sprints';
      case 'journal': return 'Journal';
      case 'profile': return 'Profile';
      default: return 'Siddha Code';
    }
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage userProfile={userProfile} protocols={protocols} onToggleProtocol={handleToggleProtocol} tasks={tasks} sprints={sprints} setSprints={setSprints} />;
      case 'sprints': return <SprintsPage tasks={tasks} setTasks={setTasks} userProfile={userProfile} onUpdateTask={handleUpdateTask} sprints={sprints} setSprints={setSprints} />;
      case 'journal': return <JournalPage journals={journals} setJournals={setJournals} userProfile={userProfile} />;
      case 'profile': return <ProfilePage user={user} userProfile={userProfile} setUserProfile={setUserProfile} />;
      default: return <DashboardPage userProfile={userProfile} protocols={protocols} onToggleProtocol={handleToggleProtocol} tasks={tasks} sprints={sprints} setSprints={setSprints} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-void">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} user={user} userProfile={userProfile} />
      <div className="lg:ml-64">
        <Header 
          title={getPageTitle()} 
          setIsMobileOpen={setIsMobileOpen} 
          user={user} 
          userProfile={userProfile} 
          onSignOut={handleSignOut} 
          onNavigate={setCurrentPage}
          todayMood={todayMood}
          onSelectMood={handleSelectMood}
          moodHistory={moodHistory}
        />
        <main className="p-4 lg:p-8">{renderPage()}</main>
      </div>
    </div>
  );
}