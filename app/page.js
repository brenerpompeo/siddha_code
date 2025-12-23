'use client';

import { useState, useEffect, useCallback, useMemo, forwardRef, useRef } from 'react';
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
  ChevronLeft,
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
  TrendingDown,
  Award,
  Star,
  Smile,
  Meh,
  Frown,
  SmilePlus,
  Angry,
 // imports moved

  MessageCircle,
  ArrowUp,
  Activity,
  PieChart,
  LineChart,
  Repeat
} from 'lucide-react';
import { Compass, Heart, DollarSign } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StarsBackground } from '@/components/ui/stars-background';
import { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from '@/components/ui/expandable-chat';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import IkigaiBuilder from '@/components/IkigaiBuilder';
import OnboardingFlow from '@/components/OnboardingFlow';
import { cn } from '@/lib/cn';
import DreamBoard from '@/components/DreamBoard';
import ProtocolManager from '@/components/ProtocolManager';
import { PillarRadarChart, ProductivityBarChart, SubPillarPieChart } from '@/components/AnalyticsCharts';
import { ActiveSprintWidget, ActiveCicloWidget, MiniJournalWidget } from '@/components/DashboardWidgets';
import TaskDetailModal from '@/components/TaskDetailModal';
import { PILLARS, getPillarByKey, getPillarColor } from '@/lib/constants/pillars';
import { RANKS, getRankByXp, getNextRank, getRankProgress } from '@/lib/constants/ranks';
import { KANBAN_COLUMNS, GUT_CHECK_PROMPTS, XP_REWARDS, getColumnById } from '@/lib/constants/kanban';
import { ARCHETYPES, HD_TYPES, ZODIAC_SIGNS, getArchetypeByKey, getHDTypeByKey } from '@/lib/constants/archetypes';
import { SUB_PILLARS, getSubPillarByKey } from '@/lib/constants/sub-pillars';
import { TASK_TEMPLATES, getTasksByPillar, getSubPillars as getPillarSubPillars } from '@/lib/constants/task-templates';
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
  { id: 'ciclo', label: 'Ciclo', icon: Target },
  { id: 'sprints', label: 'Sprints', icon: Kanban },
  { id: 'ikigai', label: 'Astro-Ikigai', icon: Compass },
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

// ============ MOOD TRACKER - ENHANCED ============

const MOODS = [
  { id: 'amazing', label: 'Incrível', emoji: '🤩', icon: SmilePlus, color: '#22c55e', score: 5, gradient: 'from-green-500 to-emerald-400' },
  { id: 'good', label: 'Bem', emoji: '😊', icon: Smile, color: '#84cc16', score: 4, gradient: 'from-lime-500 to-green-400' },
  { id: 'neutral', label: 'Neutro', emoji: '😐', icon: Meh, color: '#eab308', score: 3, gradient: 'from-yellow-500 to-amber-400' },
  { id: 'bad', label: 'Mal', emoji: '😔', icon: Frown, color: '#f97316', score: 2, gradient: 'from-orange-500 to-red-400' },
  { id: 'terrible', label: 'Péssimo', emoji: '😢', icon: Angry, color: '#ef4444', score: 1, gradient: 'from-red-500 to-rose-400' },
];

const getMoodById = (id) => MOODS.find(m => m.id === id);

const MoodTracker = ({ todayMood, onSelectMood, moodHistory = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentMood = todayMood ? getMoodById(todayMood) : null;
  
  // Statistics
  const last7Days = moodHistory.slice(-7);
  const last30Days = moodHistory.slice(-30);
  const weeklyAvg = last7Days.length > 0 
    ? (last7Days.reduce((acc, m) => acc + (getMoodById(m.mood)?.score || 3), 0) / last7Days.length)
    : null;
  const monthlyAvg = last30Days.length > 0
    ? (last30Days.reduce((acc, m) => acc + (getMoodById(m.mood)?.score || 3), 0) / last30Days.length)
    : null;
  
  // Trend calculation
  const trend = useMemo(() => {
    if (last7Days.length < 3) return null;
    const firstHalf = last7Days.slice(0, Math.floor(last7Days.length / 2));
    const secondHalf = last7Days.slice(Math.floor(last7Days.length / 2));
    const firstAvg = firstHalf.reduce((acc, m) => acc + (getMoodById(m.mood)?.score || 3), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc, m) => acc + (getMoodById(m.mood)?.score || 3), 0) / secondHalf.length;
    return secondAvg - firstAvg;
  }, [last7Days]);
  
  // Streak calculation
  const streak = useMemo(() => {
    let count = 0;
    const sortedHistory = [...moodHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    const today = new Date().toISOString().split('T')[0];
    let checkDate = today;
    
    for (const entry of sortedHistory) {
      if (entry.date === checkDate) {
        count++;
        const date = new Date(checkDate);
        date.setDate(date.getDate() - 1);
        checkDate = date.toISOString().split('T')[0];
      } else if (entry.date < checkDate) {
        break;
      }
    }
    return count;
  }, [moodHistory]);
  
  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl transition-all border',
          currentMood 
            ? 'border-transparent' 
            : 'border-white/10 hover:border-white/20 bg-white/5'
        )}
        style={currentMood ? { 
          background: `linear-gradient(135deg, ${currentMood.color}20, ${currentMood.color}10)`,
          borderColor: `${currentMood.color}40`
        } : {}}
      >
        {currentMood ? (
          <>
            <span className="text-xl">{currentMood.emoji}</span>
            <div className="hidden sm:block text-left">
              <span className="text-sm font-medium block" style={{ color: currentMood.color }}>
                {currentMood.label}
              </span>
              {streak > 1 && (
                <span className="text-[10px] text-white/50">🔥 {streak} dias</span>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="text-xl opacity-50">😶</span>
            <span className="text-sm font-medium text-white/50 hidden sm:block">Registrar Mood</span>
          </>
        )}
        <ChevronDown className={cn(
          'w-4 h-4 text-white/30 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 z-50">
            <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-primary/20 to-purple-500/20 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Como você está?</h4>
                    <p className="text-xs text-white/50">Registre seu humor diário</p>
                  </div>
                  {streak > 0 && (
                    <div className="px-2 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30">
                      <span className="text-xs text-orange-400">🔥 {streak} dias</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Mood Selection */}
              <div className="p-4">
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
                          'flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all',
                          isSelected 
                            ? 'ring-2 scale-105 shadow-lg' 
                            : 'hover:bg-white/5 hover:scale-102'
                        )}
                        style={isSelected ? { 
                          backgroundColor: `${mood.color}15`, 
                          ringColor: mood.color,
                          boxShadow: `0 4px 20px ${mood.color}30`
                        } : {}}
                      >
                        <span className={cn(
                          'text-2xl transition-transform',
                          isSelected && 'scale-110'
                        )}>
                          {mood.emoji}
                        </span>
                        <span 
                          className={cn('text-[10px] font-medium', isSelected ? '' : 'text-white/40')}
                          style={isSelected ? { color: mood.color } : {}}
                        >
                          {mood.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold text-white">
                      {weeklyAvg ? weeklyAvg.toFixed(1) : '-'}
                    </p>
                    <p className="text-[10px] text-white/40">Semana</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold text-white">
                      {monthlyAvg ? monthlyAvg.toFixed(1) : '-'}
                    </p>
                    <p className="text-[10px] text-white/40">Mês</p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-center">
                    <p className="text-lg font-bold text-white flex items-center justify-center gap-1">
                      {trend !== null ? (
                        <>
                          {trend > 0 ? <TrendingUp className="w-3 h-3 text-green-400" /> : 
                           trend < 0 ? <TrendingDown className="w-3 h-3 text-red-400" /> :
                           <Activity className="w-3 h-3 text-yellow-400" />}
                        </>
                      ) : '-'}
                    </p>
                    <p className="text-[10px] text-white/40">Tendência</p>
                  </div>
                </div>
                
                {/* Mini Calendar - Last 14 days */}
                <div className="border-t border-white/10 pt-3">
                  <p className="text-xs text-white/40 mb-2">Últimos 14 dias</p>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const dayOffset = 13 - i;
                      const date = new Date();
                      date.setDate(date.getDate() - dayOffset);
                      const dateStr = date.toISOString().split('T')[0];
                      const dayMood = moodHistory.find(m => m.date === dateStr);
                      const moodData = dayMood ? getMoodById(dayMood.mood) : null;
                      const isToday = dayOffset === 0;
                      
                      return (
                        <div 
                          key={i} 
                          className={cn(
                            'aspect-square rounded-lg flex items-center justify-center text-sm',
                            isToday && 'ring-2 ring-primary ring-offset-1 ring-offset-surface',
                            moodData ? '' : 'bg-white/5'
                          )}
                          style={moodData ? { backgroundColor: `${moodData.color}30` } : {}}
                          title={`${date.toLocaleDateString('pt-BR')}${moodData ? ` - ${moodData.label}` : ''}`}
                        >
                          {moodData ? moodData.emoji : (
                            <span className="text-[8px] text-white/20">{date.getDate()}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
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
  
  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
      // Redirect happens automatically
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
      <StarsBackground className="absolute inset-0 z-0 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Siddha Code</h1>
          <p className="text-white/50 mt-2">Sistema Operacional de Vida</p>
        </div>
        
        <GlassCard className="p-8 backdrop-blur-xl bg-white/[0.03] border-white/10">
          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                Google
            </Button>
             <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2"
                onClick={() => handleOAuthLogin('apple')}
                disabled={loading}
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05,20.28c-0.98,0.97-2.05,1.72-3.13,1.72c-0.89,0-1.29-0.56-2.5-0.56c-1.25,0-1.63,0.56-2.54,0.56c-1.04,0-2.07-0.73-3.13-1.8c-2.31-2.32-2.31-6.79,0.92-10.03c1.37-1.37,3.22-1.72,4.35-1.72c1.17,0,1.86,0.52,2.52,0.52c0.61,0,1.63-0.52,2.83-0.52c1.07,0,2.46,0.44,3.48,1.48c-2.63,1.38-2.31,5.32,0.49,6.58C19.46,17.84,18.5,19.38,17.05,20.28L17.05,20.28z M15.22,4.86c0.52-0.69,0.94-1.63,0.94-2.48c0-0.12,0-0.24-0.01-0.36c-0.96,0.06-2.05,0.61-2.69,1.38c-0.49,0.57-0.91,1.52-0.91,2.37c0,0.11,0,0.22,0.01,0.32C13.59,6.23,14.65,5.61,15.22,4.86z"/></svg>
                Apple
            </Button>
          </div>

          <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f0f13] px-2 text-white/40">Ou continue com email</span>
              </div>
          </div>

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

const DashboardPage = ({ userProfile, protocols, onToggleProtocol, tasks, sprints, setSprints, setProtocols, user, setPage }) => {
  const [protocolTab, setProtocolTab] = useState('daily');
  const [isSprintBuilderOpen, setIsSprintBuilderOpen] = useState(false);
  const [isProtocolManagerOpen, setIsProtocolManagerOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const displayName = userProfile?.username || 'Warrior';
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  
  const activeSprint = sprints.find(s => s.status === 'active');
  const latestJournal = tasks.filter(t => t.pillar === 'journal').slice(-1)[0]; // Mocking latest journal from tasks or need prop
  // Ideally, pass journals prop to DashboardPage
  
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
            // TODO: Handle sprint creation - this should be passed from parent component
            console.log('Sprint creation:', data);
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
};

// ============ META YEAR PAGE ============

const CicloPage = ({ ciclos, setCiclos, sprints, setSprints, tasks, userProfile }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [activeTab, setActiveTab] = useState('vision'); // 'vision' (Dream Board) or 'timeline' (Time Machine)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cicloToEdit, setCicloToEdit] = useState(null);

  const handleCreateCiclo = async (data) => {
    try {
      const newCiclo = {
        user_id: userProfile.id,
        year: parseInt(data.year),
        theme: data.theme,
        intention: data.intention,
        status: 'active'
      };
      
      const { data: created, error } = await supabase.from('meta_years').insert(newCiclo).select().single();
      if (error) throw error;
      
      setCiclos(prev => [...prev, created]);
      setSelectedYear(created);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating ciclo:', error);
      alert('Erro ao criar ciclo');
    }
  };

  const handleUpdateCiclo = async (data) => {
    try {
      const { error } = await supabase
        .from('meta_years')
        .update({ theme: data.theme, intention: data.intention, year: data.year })
        .eq('id', data.id);
        
      if (error) throw error;
      
      setCiclos(prev => prev.map(m => m.id === data.id ? { ...m, ...data } : m));
      if (selectedYear?.id === data.id) {
        setSelectedYear(prev => ({ ...prev, ...data }));
      }
      setIsEditModalOpen(false);
      setCicloToEdit(null);
    } catch (error) {
      console.error('Error updating ciclo:', error);
    }
  };

  const handleDeleteCiclo = async (id) => {
    if(!confirm('Tem certeza? Isso pode afetar sprints vinculados.')) return;
    try {
      const { error } = await supabase.from('meta_years').delete().eq('id', id);
      if (error) throw error;
      
      setCiclos(prev => prev.filter(m => m.id !== id));
      if (selectedYear?.id === id) {
        setSelectedYear(null);
      }
    } catch (error) {
      console.error('Error deleting ciclo:', error);
    }
  };
  
  const currentYear = new Date().getFullYear();
  const activeCiclo = ciclos.find(m => m.status === 'active') || ciclos[0];
  
  // Auto-select active year
  useEffect(() => {
    if (!selectedYear && activeCiclo) {
      setSelectedYear(activeCiclo);
    }
  }, [activeCiclo, selectedYear]);
  
  // Get sprints for selected meta year
  const yearSprints = useMemo(() => {
    if (!selectedYear) return [];
    return sprints.filter(s => s.meta_year_id === selectedYear.id || 
      (new Date(s.created_at).getFullYear() === selectedYear.year));
  }, [sprints, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {selectedYear?.theme || `Ciclo ${currentYear}`}
          </h1>
          <p className="text-white/50 italic">"{selectedYear?.intention || 'Defina sua intenção anual'}"</p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-lg">
            <button 
                onClick={() => setActiveTab('vision')}
                className={cn("px-4 py-2 rounded-md text-sm transition-all", activeTab === 'vision' ? "bg-primary text-white" : "text-white/60 hover:text-white")}
            >
                Quadro dos Sonhos
            </button>
            <button 
                onClick={() => setActiveTab('timeline')}
                className={cn("px-4 py-2 rounded-md text-sm transition-all", activeTab === 'timeline' ? "bg-primary text-white" : "text-white/60 hover:text-white")}
            >
                Máquina do Tempo
            </button>
        </div>
      </div>

      {activeTab === 'vision' && selectedYear && (
          <DreamBoard cicloId={selectedYear.id} />
      )}

      {activeTab === 'timeline' && (
          <div className="space-y-8 relative pl-8 border-l border-white/10 ml-4">
              {yearSprints.length === 0 ? (
                  <p className="text-white/40 italic">Nenhum sprint registrado neste ciclo ainda.</p>
              ) : (
                  yearSprints
                    .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
                    .map((sprint, index) => (
                      <div key={sprint.id} className="relative group">
                          {/* Timeline Dot */}
                          <div className={cn(
                              "absolute -left-[41px] top-4 w-5 h-5 rounded-full border-4 border-void",
                              sprint.status === 'active' ? "bg-primary" : "bg-white/20"
                          )} />
                          
                          <GlassCard className="p-6 transition-all hover:bg-white/[0.05]">
                              <div className="flex justify-between items-start mb-4">
                                  <div>
                                      <div className="flex items-center gap-2 mb-1">
                                          <h3 className="text-xl font-bold text-white">{sprint.title}</h3>
                                          <Badge className={cn(
                                              sprint.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/50'
                                          )}>
                                              {sprint.status === 'active' ? 'Em Progresso' : 'Concluído'}
                                          </Badge>
                                      </div>
                                      <p className="text-sm text-white/50 flex items-center gap-2">
                                          <Calendar className="w-3 h-3" />
                                          {new Date(sprint.start_date).toLocaleDateString()} - {new Date(sprint.end_date).toLocaleDateString()}
                                      </p>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-2xl font-bold text-white">
                                          {tasks.filter(t => t.sprintId === sprint.id && t.status === 'wisdom').length}
                                          <span className="text-sm text-white/30 font-normal">/{tasks.filter(t => t.sprintId === sprint.id).length} tarefas</span>
                                      </div>
                                  </div>
                              </div>
                              
                              <p className="text-white/80 mb-4 italic border-l-2 border-primary/30 pl-3">
                                  "{sprint.intention}"
                              </p>

                              <div className="flex gap-2 flex-wrap">
                                  {sprint.goals?.map((goal, i) => (
                                      <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-white/60">
                                          {goal}
                                      </span>
                                  ))}
                              </div>
                          </GlassCard>
                      </div>
                  ))
              )}
          </div>
      )}
      {/* Create Meta Year Modal */}
      <CicloModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateCiclo}
      />
      
      {/* Edit Meta Year Modal */}
      <CicloModal
        isOpen={isEditModalOpen}
        ciclo={cicloToEdit}
        onClose={() => { setIsEditModalOpen(false); setCicloToEdit(null); }}
        onSave={handleUpdateCiclo}
      />
    </div>
  );
};
  

// Meta Year Modal
const CicloModal = ({ isOpen, ciclo, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    theme: '',
    intention: ''
  });
  
  useEffect(() => {
    if (ciclo) {
      setFormData({
        year: ciclo.year,
        theme: ciclo.theme || '',
        intention: ciclo.intention || ''
      });
    } else {
      setFormData({
        year: new Date().getFullYear(),
        theme: '',
        intention: ''
      });
    }
  }, [ciclo]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...ciclo,
      ...formData
    });
  };
  
  // Pre-defined themes
  const themesSuggestions = [
    'Ano da Transformação',
    'Ano da Soberania',
    'Ano da Construção',
    'Ano da Expansão',
    'Ano do Despertar',
    'Ano da Maestria',
    'Ano da Cura',
    'Ano da Abundância'
  ];
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-xl w-full max-w-lg">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              {ciclo ? 'Editar Ciclo' : 'Nova Ciclo'}
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Year */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Ano</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
              min="2020"
              max="2100"
              required
            />
          </div>
          
          {/* Theme */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Tema do Ano</label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
              placeholder="Ex: Ano da Transformação"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
              required
            />
            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mt-2">
              {themesSuggestions.slice(0, 4).map(theme => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, theme: `${theme} ${formData.year}` }))}
                  className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-all"
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          
          {/* Intention */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Intenção Macro</label>
            <textarea
              value={formData.intention}
              onChange={(e) => setFormData(prev => ({ ...prev, intention: e.target.value }))}
              placeholder="Qual é o grande objetivo deste ano?"
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {ciclo ? 'Salvar' : 'Criar Ciclo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============ SPRINTS PAGE - THE COMMAND CENTER ============

// Sprint Status Badge Component
const SprintStatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: 'Ativo', color: '#10b981', bg: '#10b98120' },
    scheduled: { label: 'Programado', color: '#3b82f6', bg: '#3b82f620' },
    paused: { label: 'Pausado', color: '#f59e0b', bg: '#f59e0b20' },
    cancelled: { label: 'Cancelado', color: '#ef4444', bg: '#ef444420' },
    completed: { label: 'Concluído', color: '#8b5cf6', bg: '#8b5cf620' }
  };
  const config = statusConfig[status] || statusConfig.active;
  return (
    <span 
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
};

// Sprint Selector Component
const SprintSelector = ({ sprints, selectedSprint, onSelect, onNewSprint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeSprints = sprints.filter(s => s.status === 'active');
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all min-w-[250px]"
      >
        {selectedSprint ? (
          <>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{selectedSprint.title}</p>
              <p className="text-xs text-white/50">
                {getArchetypeByKey(selectedSprint.archetype)?.icon} {selectedSprint.duration} dias
              </p>
            </div>
            <SprintStatusBadge status={selectedSprint.status} />
          </>
        ) : (
          <span className="text-white/50">Selecionar Sprint</span>
        )}
        <ChevronDown className={cn('w-4 h-4 text-white/50 transition-transform', isOpen && 'rotate-180')} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full bg-surface border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              {sprints.length === 0 ? (
                <div className="p-4 text-center text-white/50">
                  <p className="text-sm">Nenhum sprint criado</p>
                </div>
              ) : (
                sprints.map(sprint => (
                  <button
                    key={sprint.id}
                    onClick={() => { onSelect(sprint); setIsOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left',
                      selectedSprint?.id === sprint.id && 'bg-white/10'
                    )}
                  >
                    <span className="text-xl">{getArchetypeByKey(sprint.archetype)?.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{sprint.title}</p>
                      <p className="text-xs text-white/50">{sprint.duration} dias</p>
                    </div>
                    <SprintStatusBadge status={sprint.status} />
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-white/10 p-2">
              <button
                onClick={() => { onNewSprint(); setIsOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Novo Sprint</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Sprint Master Section (Status Tabs)
const SprintMasterSection = ({ sprints, selectedStatus, onSelectStatus, onSelectSprint }) => {
  const statusTabs = [
    { id: 'active', label: 'Ativos', icon: Flame, count: sprints.filter(s => s.status === 'active').length },
    { id: 'scheduled', label: 'Programados', icon: CalendarDays, count: sprints.filter(s => s.status === 'scheduled').length },
    { id: 'paused', label: 'Pausados', icon: Clock, count: sprints.filter(s => s.status === 'paused').length },
    { id: 'cancelled', label: 'Cancelados', icon: X, count: sprints.filter(s => s.status === 'cancelled').length },
    { id: 'completed', label: 'Concluídos', icon: CheckCircle2, count: sprints.filter(s => s.status === 'completed').length },
  ];
  
  const filteredSprints = sprints.filter(s => s.status === selectedStatus);
  
  return (
    <GlassCard className="p-4">
      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {statusTabs.map(tab => {
          const TabIcon = tab.icon;
          const isActive = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectStatus(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm',
                isActive ? 'bg-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
              )}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  isActive ? 'bg-white/20' : 'bg-white/10'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Sprint Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSprints.length === 0 ? (
          <div className="col-span-full text-center py-8 text-white/40">
            <p>Nenhum sprint {statusTabs.find(t => t.id === selectedStatus)?.label.toLowerCase()}</p>
          </div>
        ) : (
          filteredSprints.map(sprint => {
            const archetype = getArchetypeByKey(sprint.archetype);
            const progress = sprint.tasks_count > 0 
              ? Math.round((sprint.completed_tasks || 0) / sprint.tasks_count * 100) 
              : 0;
            return (
              <button
                key={sprint.id}
                onClick={() => onSelectSprint(sprint)}
                className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/15 transition-all text-left group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{archetype?.icon}</span>
                  <SprintStatusBadge status={sprint.status} />
                </div>
                <h4 className="font-medium text-white mb-1 group-hover:text-primary transition-colors">
                  {sprint.title}
                </h4>
                <p className="text-xs text-white/50 mb-3 line-clamp-2">{sprint.intention}</p>
                
                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-white/50 mb-1">
                    <span>{sprint.tasks_count || 0} tasks</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Pillars */}
                {sprint.focusPillars?.length > 0 && (
                  <div className="flex gap-1">
                    {sprint.focusPillars.map(p => {
                      const pillar = getPillarByKey(p);
                      return (
                        <span key={p} className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar?.color }} title={pillar?.label} />
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </GlassCard>
  );
};

// Timeline View Component
const TimelineView = ({ tasks, sprints, selectedSprint }) => {
  const sprintTasks = selectedSprint 
    ? tasks.filter(t => t.sprintId === selectedSprint.id)
    : tasks;
  
  const days = selectedSprint?.duration || 7;
  const startDate = selectedSprint?.created_at ? new Date(selectedSprint.created_at) : new Date();
  
  return (
    <GlassCard className="p-4 overflow-x-auto">
      <h4 className="text-sm font-medium text-white/70 mb-4">Timeline do Sprint</h4>
      <div className="min-w-[600px]">
        {/* Days Header */}
        <div className="flex border-b border-white/10 pb-2 mb-4">
          <div className="w-40 flex-shrink-0" />
          {Array.from({ length: Math.min(days, 14) }).map((_, i) => {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={cn(
                'flex-1 text-center text-xs px-1',
                isToday ? 'text-primary font-bold' : 'text-white/50'
              )}>
                <div>{['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()]}</div>
                <div className={cn(
                  'w-6 h-6 rounded-full mx-auto mt-1 flex items-center justify-center',
                  isToday && 'bg-primary text-white'
                )}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Tasks by Pillar */}
        {PILLARS.filter(p => sprintTasks.some(t => t.pillar === p.key)).map(pillar => (
          <div key={pillar.key} className="flex items-center mb-3">
            <div className="w-40 flex-shrink-0 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
              <span className="text-sm text-white/70 truncate">{pillar.label}</span>
            </div>
            <div className="flex-1 h-8 bg-white/5 rounded-lg relative">
              {sprintTasks.filter(t => t.pillar === pillar.key).map((task, i) => (
                <div
                  key={task.id}
                  className="absolute h-6 top-1 rounded px-2 text-xs flex items-center truncate"
                  style={{ 
                    backgroundColor: `${pillar.color}30`,
                    color: pillar.color,
                    left: `${(i * 15) % 70}%`,
                    width: '25%',
                    maxWidth: '120px'
                  }}
                  title={task.content}
                >
                  {task.content?.slice(0, 15)}...
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {sprintTasks.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <p>Nenhuma tarefa neste sprint</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// Roadmap View Component (List by Pillar)
const RoadmapView = ({ tasks, selectedSprint }) => {
  const sprintTasks = selectedSprint 
    ? tasks.filter(t => t.sprintId === selectedSprint.id)
    : tasks;
  
  const tasksByPillar = useMemo(() => {
    const grouped = {};
    PILLARS.forEach(p => {
      grouped[p.key] = sprintTasks.filter(t => t.pillar === p.key);
    });
    return grouped;
  }, [sprintTasks]);
  
  return (
    <div className="space-y-4">
      {PILLARS.filter(p => tasksByPillar[p.key]?.length > 0).map(pillar => (
        <GlassCard key={pillar.key} className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${pillar.color}20` }}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pillar.color }} />
            </div>
            <div>
              <h4 className="font-medium text-white">{pillar.label}</h4>
              <p className="text-xs text-white/50">{tasksByPillar[pillar.key].length} tarefas</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {tasksByPillar[pillar.key].map(task => (
              <div 
                key={task.id}
                className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5"
              >
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  task.status === 'wisdom' ? 'border-green-500 bg-green-500' : 'border-white/30'
                )}>
                  {task.status === 'wisdom' && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm',
                    task.status === 'wisdom' ? 'text-white/50 line-through' : 'text-white'
                  )}>
                    {task.content}
                  </p>
                  {task.subPillar && (
                    <span className="text-xs text-white/40">{task.subPillar}</span>
                  )}
                </div>
                <Badge color={KANBAN_COLUMNS.find(c => c.id === task.status)?.color}>
                  {KANBAN_COLUMNS.find(c => c.id === task.status)?.label}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      ))}
      
      {sprintTasks.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-white/40">Nenhuma tarefa neste sprint</p>
        </GlassCard>
      )}
    </div>
  );
};

// Sprint Detail Panel
const SprintDetailPanel = ({ sprint, onClose, onUpdateStatus, onEdit, onDelete, tasksCount }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!sprint) return null;
  
  const archetype = getArchetypeByKey(sprint.archetype);
  
  return (
    <GlassCard className="p-5 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: `${archetype?.color}20` }}
          >
            {archetype?.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{sprint.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <SprintStatusBadge status={sprint.status} />
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/50">{sprint.duration} dias</span>
              <span className="text-xs text-white/40">•</span>
              <span className="text-xs text-white/50">{archetype?.name}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Status Actions */}
          {sprint.status === 'active' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(sprint.id, 'paused')}>
                <Clock className="w-4 h-4 mr-1" />
                Pausar
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onUpdateStatus(sprint.id, 'completed')}>
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Concluir
              </Button>
            </>
          )}
          {sprint.status === 'paused' && (
            <Button size="sm" onClick={() => onUpdateStatus(sprint.id, 'active')}>
              <Flame className="w-4 h-4 mr-1" />
              Retomar
            </Button>
          )}
          {sprint.status === 'scheduled' && (
            <Button size="sm" onClick={() => onUpdateStatus(sprint.id, 'active')}>
              <Flame className="w-4 h-4 mr-1" />
              Iniciar
            </Button>
          )}
          
          {/* Edit & Delete */}
          <div className="h-6 w-px bg-white/10 mx-1" />
          <Button variant="ghost" size="sm" onClick={() => onEdit(sprint)}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <p className="text-sm text-red-400 mb-3">
            Tem certeza que deseja excluir este sprint? 
            {tasksCount > 0 && ` ${tasksCount} tarefa(s) serão desvinculadas.`}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancelar
            </Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={() => {
              onDelete(sprint.id);
              setShowDeleteConfirm(false);
            }}>
              <Trash2 className="w-4 h-4 mr-1" />
              Excluir Sprint
            </Button>
          </div>
        </div>
      )}
      
      {/* Sprint Info */}
      {sprint.intention && (
        <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 mb-4">
          <p className="text-sm text-white/70 italic">{sprint.intention}</p>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.tasks_count || 0}</p>
          <p className="text-xs text-white/50">Tarefas</p>
        </div>
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.completed_tasks || 0}</p>
          <p className="text-xs text-white/50">Concluídas</p>
        </div>
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.dailyCommitments?.length || 0}</p>
          <p className="text-xs text-white/50">Compromissos</p>
        </div>
        <div className="p-3 bg-white/[0.02] rounded-lg text-center">
          <p className="text-2xl font-bold text-white">{sprint.goals?.length || 0}</p>
          <p className="text-xs text-white/50">Metas</p>
        </div>
      </div>
      
      {/* Focus Pillars */}
      {sprint.focusPillars?.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-white/50">Pilares:</span>
          {sprint.focusPillars.map(p => {
            const pillar = getPillarByKey(p);
            return (
              <span 
                key={p}
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: `${pillar?.color}20`, color: pillar?.color }}
              >
                {pillar?.label}
              </span>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

const SprintsPage = ({ tasks, setTasks, userProfile, onUpdateTask, sprints, setSprints, ciclos = [], setCiclos }) => {
  const [viewMode, setViewMode] = useState('kanban');
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateSprintModalOpen, setIsCreateSprintModalOpen] = useState(false);
  const [isEditSprintModalOpen, setIsEditSprintModalOpen] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState(null);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [masterStatus, setMasterStatus] = useState('active');
  const [showMasterSection, setShowMasterSection] = useState(true);
  
  // Auto-select first active sprint on mount
  useEffect(() => {
    if (!selectedSprint && sprints.length > 0) {
      const activeSprint = sprints.find(s => s.status === 'active');
      if (activeSprint) setSelectedSprint(activeSprint);
    }
  }, [sprints, selectedSprint]);
  
  // Get current Meta Year
  const currentYear = new Date().getFullYear();
  const currentCiclo = ciclos?.find(m => m.year === currentYear);
  
  const viewTabs = [
    { id: 'kanban', label: 'Kanban', icon: Kanban },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'roadmap', label: 'Roadmap', icon: BarChart3 },
  ];
  
  // Filter tasks by sprint and pillar
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (selectedSprint) {
      filtered = filtered.filter(t => t.sprintId === selectedSprint.id);
    }
    if (selectedPillar) {
      filtered = filtered.filter(t => t.pillar === selectedPillar);
    }
    return filtered;
  }, [tasks, selectedSprint, selectedPillar]);
  
  // Count tasks for selected sprint
  const selectedSprintTasksCount = useMemo(() => {
    if (!selectedSprint) return 0;
    return tasks.filter(t => t.sprintId === selectedSprint.id).length;
  }, [tasks, selectedSprint]);
  
  const handleUpdateSprintStatus = (sprintId, newStatus) => {
    setSprints(prev => prev.map(s => 
      s.id === sprintId ? { ...s, status: newStatus } : s
    ));
    if (selectedSprint?.id === sprintId) {
      setSelectedSprint(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };
  
  const handleCreateTaskForSprint = (task) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      status: 'potential',
      gut_check_score: null,
      sprintId: selectedSprint?.id || null
    };
    setTasks(prev => [...prev, newTask]);
    
    // Update sprint task count
    if (selectedSprint) {
      setSprints(prev => prev.map(s => 
        s.id === selectedSprint.id 
          ? { ...s, tasks_count: (s.tasks_count || 0) + 1 }
          : s
      ));
    }
  };
  
  // Edit Sprint
  const handleEditSprint = (sprint) => {
    setSprintToEdit(sprint);
    setIsEditSprintModalOpen(true);
  };
  
  // Update Sprint
  const handleUpdateSprint = (updatedSprint) => {
    setSprints(prev => prev.map(s => 
      s.id === updatedSprint.id ? { ...s, ...updatedSprint } : s
    ));
    if (selectedSprint?.id === updatedSprint.id) {
      setSelectedSprint(prev => prev ? { ...prev, ...updatedSprint } : null);
    }
    setIsEditSprintModalOpen(false);
    setSprintToEdit(null);
  };
  
  // Delete Sprint
  const handleDeleteSprint = (sprintId) => {
    // Remove sprint
    setSprints(prev => prev.filter(s => s.id !== sprintId));
    
    // Unlink tasks from this sprint (don't delete them)
    setTasks(prev => prev.map(t => 
      t.sprintId === sprintId ? { ...t, sprintId: null } : t
    ));
    
    // Clear selection if deleted sprint was selected
    if (selectedSprint?.id === sprintId) {
      const remainingSprints = sprints.filter(s => s.id !== sprintId);
      const nextActive = remainingSprints.find(s => s.status === 'active');
      setSelectedSprint(nextActive || null);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          {currentCiclo && (
            <p className="text-xs text-primary mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Parte do "{currentCiclo.theme || `Ano ${currentYear}`}"
            </p>
          )}
          <h1 className="text-2xl font-bold text-white">Command Center</h1>
          <p className="text-white/50">Gerencie seus ciclos de desenvolvimento</p>
        </div>
        
        <div className="flex items-center gap-3">
          <SprintSelector 
            sprints={sprints}
            selectedSprint={selectedSprint}
            onSelect={setSelectedSprint}
            onNewSprint={() => setIsCreateSprintModalOpen(true)}
          />
          <Button onClick={() => setIsCreateTaskModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>
      
      {/* Master Section Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowMasterSection(!showMasterSection)}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ChevronDown className={cn('w-4 h-4 transition-transform', !showMasterSection && '-rotate-90')} />
          Gerenciar Sprints
        </button>
      </div>
      
      {/* Sprint Master Section */}
      {showMasterSection && (
        <SprintMasterSection 
          sprints={sprints}
          selectedStatus={masterStatus}
          onSelectStatus={setMasterStatus}
          onSelectSprint={setSelectedSprint}
        />
      )}
      
      {/* Selected Sprint Detail */}
      {selectedSprint && (
        <SprintDetailPanel 
          sprint={selectedSprint}
          onUpdateStatus={handleUpdateSprintStatus}
          onEdit={handleEditSprint}
          onDelete={handleDeleteSprint}
          tasksCount={selectedSprintTasksCount}
        />
      )}
      
      {/* View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* View Tabs */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 uppercase tracking-wider">Visualização</span>
          <Tabs tabs={viewTabs} activeTab={viewMode} onChange={setViewMode} className="w-auto" />
        </div>
        
        {/* Pillar Filter */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40 uppercase tracking-wider">Pilares</span>
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
      </div>
      
      {/* Content based on view mode */}
      {viewMode === 'kanban' && (
        <KanbanView tasks={filteredTasks} setTasks={setTasks} onUpdateTask={onUpdateTask} userProfile={userProfile} />
      )}
      
      {viewMode === 'timeline' && (
        <TimelineView tasks={filteredTasks} sprints={sprints} selectedSprint={selectedSprint} />
      )}
      
      {viewMode === 'roadmap' && (
        <RoadmapView tasks={filteredTasks} selectedSprint={selectedSprint} />
      )}
      
      <CreateTaskModal 
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        onCreateTask={handleCreateTaskForSprint}
        selectedSprint={selectedSprint}
      />
      
      <SprintBuilder
        isOpen={isCreateSprintModalOpen}
        onClose={() => setIsCreateSprintModalOpen(false)}
        onCreateSprint={(sprint) => {
          const sprintId = uuidv4();
          const currentCiclo = ciclos?.find(m => m.status === 'active');
          const newSprint = { 
            ...sprint, 
            id: sprintId, 
            status: 'active', 
            created_at: new Date().toISOString(), 
            tasks_count: sprint.goals?.length || 0, 
            completed_tasks: 0,
            cicloId: currentCiclo?.id || null
          };
          setSprints(prev => [...prev, newSprint]);
          
          // Create tasks from goals automatically
          if (sprint.goals && sprint.goals.length > 0) {
            const newTasks = sprint.goals.map((goal, index) => ({
              id: uuidv4(),
              title: goal,
              content: goal,
              pillar: sprint.focusPillars?.[index % sprint.focusPillars.length] || 'personal',
              status: 'potential',
              sprintId: sprintId,
              gut_check_score: null,
              xp: 30,
              created_at: new Date().toISOString()
            }));
            setTasks(prev => [...prev, ...newTasks]);
          }
          
          setSelectedSprint(newSprint);
        }}
        userProfile={userProfile}
      />
      
      {/* Edit Sprint Modal */}
      <EditSprintModal
        isOpen={isEditSprintModalOpen}
        sprint={sprintToEdit}
        onClose={() => {
          setIsEditSprintModalOpen(false);
          setSprintToEdit(null);
        }}
        onSave={handleUpdateSprint}
      />
      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(updatedTask) => {
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
            onUpdateTask(updatedTask);
        }}
      />
    </div>
  );
};

// Edit Sprint Modal Component
const EditSprintModal = ({ isOpen, sprint, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    intention: '',
    archetype: 'hero',
    status: 'active',
    duration: 7,
    focusPillars: [],
    dailyCommitments: [],
    goals: []
  });
  
  // Sync form data when sprint changes
  useEffect(() => {
    if (sprint) {
      setFormData({
        title: sprint.title || '',
        intention: sprint.intention || '',
        archetype: sprint.archetype || 'hero',
        status: sprint.status || 'active',
        duration: sprint.duration || 7,
        focusPillars: sprint.focusPillars || [],
        dailyCommitments: sprint.dailyCommitments || [],
        goals: sprint.goals || []
      });
    }
  }, [sprint]);
  
  if (!isOpen || !sprint) return null;
  
  const selectedArchetype = getArchetypeByKey(formData.archetype);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...sprint,
      ...formData
    });
  };
  
  const togglePillar = (pillarKey) => {
    setFormData(prev => {
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
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedArchetype?.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Editar Sprint</h3>
                <p className="text-xs text-white/50">Modifique as configurações do seu sprint</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Nome do Sprint</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary"
              required
            />
          </div>
          
          {/* Intention */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Intenção</label>
            <textarea
              value={formData.intention}
              onChange={(e) => setFormData(prev => ({ ...prev, intention: e.target.value }))}
              className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Status</label>
            <div className="flex gap-2">
              {['active', 'scheduled', 'paused', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status }))}
                  className={cn(
                    'px-3 py-2 rounded-lg text-xs transition-all',
                    formData.status === status ? 'bg-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {status === 'active' ? 'Ativo' : 
                   status === 'scheduled' ? 'Programado' :
                   status === 'paused' ? 'Pausado' :
                   status === 'completed' ? 'Concluído' : 'Cancelado'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Duration */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Duração (dias)</label>
            <div className="flex gap-2">
              {[7, 14, 21, 30].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, duration: d }))}
                  className={cn(
                    'flex-1 py-2 rounded-lg text-sm transition-all',
                    formData.duration === d ? 'bg-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          
          {/* Archetype */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Arquétipo</label>
            <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto">
              {ARCHETYPES.map(arch => (
                <button
                  key={arch.key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, archetype: arch.key }))}
                  className={cn(
                    'p-2 rounded-lg text-center transition-all',
                    formData.archetype === arch.key ? 'bg-primary/20 border-2 border-primary' : 'bg-white/5 border border-white/10'
                  )}
                >
                  <span className="text-xl block">{arch.icon}</span>
                  <span className="text-[10px] text-white/80">{arch.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Pillars */}
          <div>
            <label className="block text-sm text-white/70 mb-2">Pilares de Foco ({formData.focusPillars.length}/3)</label>
            <div className="flex flex-wrap gap-2">
              {PILLARS.map(pillar => {
                const isSelected = formData.focusPillars.includes(pillar.key);
                return (
                  <button
                    key={pillar.key}
                    type="button"
                    onClick={() => togglePillar(pillar.key)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs transition-all',
                      isSelected ? '' : 'bg-white/5 text-white/60'
                    )}
                    style={isSelected ? { backgroundColor: `${pillar.color}30`, color: pillar.color } : {}}
                  >
                    {pillar.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
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
// ============ SPRINT BUILDER - CONSTRUA SEU SPRINT ============

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

// AI Suggestion Chip Component
const SuggestionChip = ({ text, onClick, loading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="px-3 py-1.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all disabled:opacity-50"
  >
    {text}
  </button>
);

// Commitment Pill Component
const CommitmentPill = ({ text, selected, onClick, color }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'px-3 py-1.5 text-xs rounded-full transition-all',
      selected 
        ? 'ring-2 ring-offset-1 ring-offset-void' 
        : 'bg-white/5 border border-white/10 hover:border-white/20'
    )}
    style={selected ? { backgroundColor: `${color}30`, color: color, ringColor: color } : {}}
  >
    {text}
  </button>
);

const SprintBuilder = ({ isOpen, onClose, onCreateSprint, userProfile }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [sprintData, setSprintData] = useState({
    title: '',
    intention: '',
    archetype: 'hero',
    focusPillars: [],
    duration: 7,
    goals: [],
    dailyCommitments: [],
    alignmentScore: 7
  });
  const [newGoal, setNewGoal] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationPassed, setValidationPassed] = useState(false);
  
  // AI Suggestions states
  const [aiLoading, setAiLoading] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [intentionSuggestions, setIntentionSuggestions] = useState([]);
  const [recommendedArchetype, setRecommendedArchetype] = useState(null);
  const [commitmentSuggestions, setCommitmentSuggestions] = useState([]);
  const [goalSuggestions, setGoalSuggestions] = useState([]);
  
  if (!isOpen) return null;
  
  const currentStepData = GATEKEEPER_STEPS[currentStep];
  const selectedArchetype = getArchetypeByKey(sprintData.archetype);
  const hdType = getHDTypeByKey(userProfile?.hd_type || 'generator');
  
  // Fetch AI Suggestions
  const fetchAISuggestions = async (type, data) => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('AI suggestion error:', error);
      return null;
    } finally {
      setAiLoading(false);
    }
  };
  
  // Generate name suggestions
  const handleGenerateNames = async () => {
    if (!sprintData.intention) return;
    const result = await fetchAISuggestions('sprint-names', { intention: sprintData.intention });
    if (result?.names) {
      setNameSuggestions(result.names);
    }
  };
  
  // Generate intention suggestions
  const handleGenerateIntentions = async () => {
    if (!sprintData.title) return;
    const result = await fetchAISuggestions('intentions', { 
      title: sprintData.title, 
      pillars: sprintData.focusPillars 
    });
    if (result?.intentions) {
      setIntentionSuggestions(result.intentions);
    }
  };
  
  // Get archetype recommendation
  const handleGetArchetypeRecommendation = async () => {
    if (!sprintData.intention) return;
    const result = await fetchAISuggestions('archetype-recommendation', { intention: sprintData.intention });
    if (result?.recommended) {
      setRecommendedArchetype(result);
    }
  };
  
  // Generate commitment suggestions
  const handleGenerateCommitments = async () => {
    const result = await fetchAISuggestions('commitments', {
      pillars: sprintData.focusPillars.map(p => getPillarByKey(p)?.label),
      archetype: selectedArchetype?.name,
      intention: sprintData.intention
    });
    if (result?.commitments) {
      setCommitmentSuggestions(result.commitments);
    }
  };
  
  // Generate goal suggestions
  const handleGenerateGoals = async () => {
    const result = await fetchAISuggestions('goals', {
      pillars: sprintData.focusPillars.map(p => getPillarByKey(p)?.label),
      archetype: selectedArchetype?.name,
      intention: sprintData.intention,
      duration: sprintData.duration
    });
    if (result?.goals) {
      setGoalSuggestions(result.goals);
    }
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 0: return sprintData.title.trim().length >= 3 && sprintData.intention.trim().length >= 10;
      case 1: return !!sprintData.archetype;
      case 2: return sprintData.focusPillars.length >= 1 && sprintData.focusPillars.length <= 3;
      case 3: return sprintData.goals.length >= 1 && sprintData.dailyCommitments.length >= 1;
      case 4: return sprintData.alignmentScore >= 7 && validationPassed;
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep === GATEKEEPER_STEPS.length - 1) {
      handleCreateSprintSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
      // Auto-fetch suggestions for next step
      if (currentStep === 0) handleGetArchetypeRecommendation();
      if (currentStep === 2) {
        handleGenerateCommitments();
        handleGenerateGoals();
      }
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setValidationPassed(false);
    }
  };
  
  const handleCreateSprintSubmit = async () => {
    // Pass raw data, parent component will handle formatting and saving
    await onCreateSprint({
      title: sprintData.title.trim(),
      intention: sprintData.intention.trim(),
      archetype: sprintData.archetype,
      focusPillars: sprintData.focusPillars,
      duration: sprintData.duration,
      goals: sprintData.goals,
      dailyCommitments: sprintData.dailyCommitments,
      alignmentScore: sprintData.alignmentScore
    });
    
    // Reset state
    setSprintData({
      title: '', intention: '', archetype: 'hero', focusPillars: [],
      duration: 7, goals: [], dailyCommitments: [], alignmentScore: 7
    });
    setCurrentStep(0);
    setValidationPassed(false);
    setNameSuggestions([]);
    setIntentionSuggestions([]);
    setRecommendedArchetype(null);
    setCommitmentSuggestions([]);
    setGoalSuggestions([]);
    onClose();
  };
  
  const addGoal = (goal) => {
    if (goal?.trim() && !sprintData.goals.includes(goal.trim())) {
      setSprintData(prev => ({ ...prev, goals: [...prev.goals, goal.trim()] }));
    }
    setNewGoal('');
  };
  
  const removeGoal = (index) => {
    setSprintData(prev => ({ ...prev, goals: prev.goals.filter((_, i) => i !== index) }));
  };
  
  const toggleCommitment = (commitment) => {
    setSprintData(prev => {
      const current = prev.dailyCommitments;
      if (current.includes(commitment)) {
        return { ...prev, dailyCommitments: current.filter(c => c !== commitment) };
      }
      return { ...prev, dailyCommitments: [...current, commitment] };
    });
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
    setTimeout(() => {
      setIsValidating(false);
      if (sprintData.alignmentScore >= 7) setValidationPassed(true);
    }, 1500);
  };
  
  // Pre-defined commitment options based on pillars
  const getCommitmentOptions = () => {
    const options = [];
    sprintData.focusPillars.forEach(pillarKey => {
      const pillar = getPillarByKey(pillarKey);
      if (pillar) {
        switch (pillarKey) {
          case 'physical':
            options.push('30min exercício', 'Beber 2L água', 'Dormir 7h+', 'Caminhada matinal');
            break;
          case 'mental':
            options.push('Meditação 10min', 'Journaling', 'Leitura 20min', 'Digital detox 1h');
            break;
          case 'intellectual':
            options.push('Estudar 30min', 'Aprender algo novo', 'Curso online', 'Podcast educativo');
            break;
          case 'professional':
            options.push('Deep work 2h', 'Revisar metas', 'Networking', 'Organizar tarefas');
            break;
          case 'personal':
            options.push('Tempo sozinho', 'Hobby 30min', 'Autocuidado', 'Gratidão 3 itens');
            break;
          case 'cultural':
            options.push('Arte/Música', 'Evento cultural', 'Aprender idioma', 'Explorar novo');
            break;
          case 'spiritual':
            options.push('Meditação', 'Reflexão', 'Natureza', 'Práticas espirituais');
            break;
        }
      }
    });
    return [...new Set(options)];
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Intention
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-white/70 mb-2">Nome do Sprint</label>
              <input
                type="text"
                placeholder="Ex: Despertar do Guerreiro Interior"
                value={sprintData.title}
                onChange={(e) => setSprintData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                autoFocus
              />
              
              {/* Name Suggestions */}
              {nameSuggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {nameSuggestions.map((name, i) => (
                    <SuggestionChip 
                      key={i} 
                      text={name} 
                      onClick={() => setSprintData(prev => ({ ...prev, title: name }))}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm text-white/70 mb-2">Intenção Principal</label>
              <textarea
                placeholder="Descreva a transformação que busca... O que mudará em você ao final deste sprint?"
                value={sprintData.intention}
                onChange={(e) => setSprintData(prev => ({ ...prev, intention: e.target.value }))}
                className="w-full h-28 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-white/40">{sprintData.intention.length}/10 caracteres mínimos</p>
                <button
                  type="button"
                  onClick={handleGenerateIntentions}
                  disabled={aiLoading || !sprintData.title}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {aiLoading ? 'Gerando...' : 'Sugestões IA'}
                </button>
              </div>
              
              {/* Intention Suggestions */}
              {intentionSuggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-white/50">Sugestões:</p>
                  {intentionSuggestions.map((intention, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSprintData(prev => ({ ...prev, intention }))}
                      className="w-full text-left p-3 text-sm bg-white/5 rounded-lg hover:bg-white/10 text-white/70 transition-all"
                    >
                      {intention}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {sprintData.intention.length >= 10 && !nameSuggestions.length && (
              <button
                type="button"
                onClick={handleGenerateNames}
                disabled={aiLoading}
                className="w-full py-2 text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {aiLoading ? 'Gerando sugestões...' : 'Gerar sugestões de nome com IA'}
              </button>
            )}
          </div>
        );
        
      case 1: // Archetype
        return (
          <div className="space-y-4">
            {/* Recommended Archetype */}
            {recommendedArchetype && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Recomendação da IA</span>
                </div>
                <p className="text-sm text-white/80">
                  Baseado na sua intenção, o arquétipo <strong className="text-primary">{getArchetypeByKey(recommendedArchetype.recommended)?.name}</strong> pode ser ideal para você.
                </p>
                <p className="text-xs text-white/50 mt-1">{recommendedArchetype.reason}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-3">Escolha seu Arquétipo</h4>
              <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-2">
                {ARCHETYPES.map(arch => {
                  const isRecommended = recommendedArchetype?.recommended === arch.key;
                  return (
                    <button
                      key={arch.key}
                      type="button"
                      onClick={() => setSprintData(prev => ({ ...prev, archetype: arch.key }))}
                      className={cn(
                        'p-3 rounded-xl text-center transition-all duration-300 relative',
                        sprintData.archetype === arch.key 
                          ? 'ring-2 ring-primary scale-105 shadow-lg' 
                          : 'bg-white/5 border border-white/10 hover:border-white/20'
                      )}
                      style={sprintData.archetype === arch.key ? { 
                        backgroundColor: `${arch.color}15`,
                        borderColor: arch.color
                      } : {}}
                    >
                      {isRecommended && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                          <Sparkles className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                      <span className="text-2xl block mb-1">{arch.icon}</span>
                      <span className="text-xs font-medium text-white">{arch.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Selected Archetype Details */}
            {selectedArchetype && (
              <div className="p-4 rounded-xl border border-white/10" style={{ backgroundColor: `${selectedArchetype.color}10` }}>
                <h4 className="text-sm font-medium text-white/50 mb-2">Arquétipo Selecionado</h4>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{selectedArchetype.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{selectedArchetype.name}</h4>
                    <p className="text-xs text-white/50">{selectedArchetype.nameEn}</p>
                  </div>
                </div>
                <p className="text-sm text-primary italic mb-3">"{selectedArchetype.motto}"</p>
                <p className="text-sm text-white/70 mb-3">{selectedArchetype.fullDescription || selectedArchetype.description}</p>
                
                {/* Strengths */}
                {selectedArchetype.strengths && (
                  <div className="mb-3">
                    <p className="text-xs text-white/50 mb-1">Forças:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedArchetype.strengths.map((s, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Related Pillars */}
                <div className="flex gap-2">
                  <span className="text-xs text-white/50">Pilares relacionados:</span>
                  {selectedArchetype.focus.map(f => {
                    const pillar = getPillarByKey(f);
                    return pillar ? (
                      <span 
                        key={f}
                        className="text-xs px-2 py-0.5 rounded-full"
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
              <span className="text-primary ml-1">({sprintData.focusPillars.length}/3 selecionados)</span>
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
                      isSelected ? 'ring-2 scale-[1.02]' : 'bg-white/5 border border-white/10 hover:border-white/20'
                    )}
                    style={isSelected ? { 
                      backgroundColor: `${pillar.color}15`,
                      ringColor: pillar.color,
                      borderColor: pillar.color
                    } : {}}
                  >
                    {isRecommended && !isSelected && (
                      <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/20 text-primary">
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
                        <p className="text-xs text-white/50">{pillar.description?.slice(0, 25)}...</p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="absolute bottom-3 right-3 w-5 h-5" style={{ color: pillar.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
        
      case 3: // Commitment
        return (
          <div className="space-y-5">
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
            
            {/* Daily Commitments */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-white/70">
                  Compromissos Diários ({sprintData.dailyCommitments.length} selecionados)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateCommitments}
                  disabled={aiLoading}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {aiLoading ? 'Gerando...' : 'Sugestões IA'}
                </button>
              </div>
              
              {/* Pre-defined options */}
              <div className="flex flex-wrap gap-2 mb-3">
                {getCommitmentOptions().map((opt, i) => (
                  <CommitmentPill
                    key={i}
                    text={opt}
                    selected={sprintData.dailyCommitments.includes(opt)}
                    onClick={() => toggleCommitment(opt)}
                    color="#a855f7"
                  />
                ))}
              </div>
              
              {/* AI Suggestions */}
              {commitmentSuggestions.length > 0 && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary mb-2">Sugestões da IA:</p>
                  <div className="flex flex-wrap gap-2">
                    {commitmentSuggestions.map((sug, i) => (
                      <CommitmentPill
                        key={i}
                        text={sug}
                        selected={sprintData.dailyCommitments.includes(sug)}
                        onClick={() => toggleCommitment(sug)}
                        color="#22c55e"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Goals */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm text-white/70">
                  Metas do Sprint ({sprintData.goals.length} definidas)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateGoals}
                  disabled={aiLoading}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  {aiLoading ? 'Gerando...' : 'Sugestões IA'}
                </button>
              </div>
              
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Adicione uma meta..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal(newGoal))}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary text-sm"
                />
                <Button type="button" onClick={() => addGoal(newGoal)} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Goal suggestions */}
              {goalSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {goalSuggestions.filter(g => !sprintData.goals.includes(g)).map((goal, i) => (
                    <SuggestionChip key={i} text={goal} onClick={() => addGoal(goal)} />
                  ))}
                </div>
              )}
              
              {/* Selected goals */}
              <div className="space-y-2 max-h-[120px] overflow-y-auto">
                {sprintData.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                    <Target className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="flex-1 text-sm text-white">{goal}</span>
                    <button type="button" onClick={() => removeGoal(idx)} className="p-1 hover:bg-white/10 rounded">
                      <X className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                ))}
                {sprintData.goals.length === 0 && (
                  <p className="text-center text-white/40 py-3 text-sm">Adicione pelo menos uma meta</p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 4: // Alignment
        return (
          <div className="space-y-5">
            {/* Summary */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold text-white mb-3">Resumo do Sprint</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Nome:</span>
                  <span className="text-white font-medium">{sprintData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Arquétipo:</span>
                  <span className="text-white">{selectedArchetype?.icon} {selectedArchetype?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Duração:</span>
                  <span className="text-white">{sprintData.duration} dias</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/50">Pilares:</span>
                  <div className="flex gap-1">
                    {sprintData.focusPillars.map(p => {
                      const pillar = getPillarByKey(p);
                      return (
                        <span key={p} className="w-4 h-4 rounded-full" style={{ backgroundColor: pillar?.color }} title={pillar?.label} />
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Metas:</span>
                  <span className="text-white">{sprintData.goals.length} definidas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Compromissos:</span>
                  <span className="text-white">{sprintData.dailyCommitments.length} selecionados</span>
                </div>
              </div>
            </div>
            
            {/* HD Type Reminder */}
            {hdType && (
              <div className="p-4 rounded-xl border" style={{ backgroundColor: `${hdType.color}10`, borderColor: `${hdType.color}30` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${hdType.color}30` }}>
                    <Sparkles className="w-4 h-4" style={{ color: hdType.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{hdType.name}</p>
                    <p className="text-xs text-white/50">Estratégia: {hdType.strategy}</p>
                  </div>
                </div>
                <p className="text-sm italic text-white/70">{hdType.gutCheckPrompt}</p>
              </div>
            )}
            
            {/* Alignment Score */}
            <div>
              <label className="block text-sm text-white/70 mb-2">Nível de Alinhamento</label>
              <div className="flex items-center gap-4">
                <input
                  type="range" min="1" max="10"
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
                <p className="text-sm text-yellow-500 mt-2">Score abaixo de 7 - Reconsidere este sprint.</p>
              )}
            </div>
            
            {/* Validation */}
            {!validationPassed && sprintData.alignmentScore >= 7 && (
              <Button type="button" onClick={handleValidation} loading={isValidating} className="w-full" variant="secondary">
                {isValidating ? 'Validando...' : 'Solicitar Validação'}
              </Button>
            )}
            
            {validationPassed && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-green-400 font-medium">Aprovado!</p>
                <p className="text-sm text-white/60">Este sprint está alinhado com seu Design.</p>
              </div>
            )}
          </div>
        );
        
      default: return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Construa seu Sprint</h3>
              <p className="text-sm text-white/50">Monte sua jornada de acordo com o melhor para você</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-between">
            {GATEKEEPER_STEPS.map((step, idx) => {
              const StepIcon = step.icon;
              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                    isActive ? 'bg-primary text-white scale-110' :
                    isCompleted ? 'bg-green-500 text-white' : 'bg-white/10 text-white/40'
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  {idx < GATEKEEPER_STEPS.length - 1 && (
                    <div className={cn('w-6 lg:w-12 h-0.5 mx-1', idx < currentStep ? 'bg-green-500' : 'bg-white/10')} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Step Info */}
        <div className="px-5 py-3 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              {(() => { const StepIcon = currentStepData.icon; return <StepIcon className="w-5 h-5 text-primary" />; })()}
            </div>
            <div>
              <h4 className="font-semibold text-white">{currentStepData.title}</h4>
              <p className="text-xs text-white/50">{currentStepData.description}</p>
            </div>
          </div>
          <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary italic">{currentStepData.gatekeeperQuestion}</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {renderStepContent()}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-white/10 flex justify-between items-center">
          <Button type="button" variant="ghost" onClick={currentStep === 0 ? onClose : handleBack}>
            {currentStep === 0 ? 'Cancelar' : 'Voltar'}
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Passo {currentStep + 1}/{GATEKEEPER_STEPS.length}</span>
            <Button type="button" onClick={handleNext} disabled={!canProceed()}>
              {currentStep === GATEKEEPER_STEPS.length - 1 ? (
                <><Sparkles className="w-4 h-4 mr-2" />Criar Sprint</>
              ) : (
                <>Próximo<ChevronRight className="w-4 h-4 ml-2" /></>
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
  { id: uuidv4(), name: 'Rotina Matinal', completed_today: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Hidratação (8 copos)', completed_today: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Meditação', completed_today: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Exercício', completed_today: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Tempo de Aprendizado', completed_today: false, frequency: 'daily' },
  { id: uuidv4(), name: 'Revisão Semanal', completed_today: false, frequency: 'weekly' },
  { id: uuidv4(), name: 'Planejamento de Sprint', completed_today: false, frequency: 'weekly' },
  { id: uuidv4(), name: 'Review Mensal', completed_today: false, frequency: 'monthly' },
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
  const [ciclos, setCiclos] = useState([]);
  
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
    try {
      console.log('Loading user data from Supabase...');
      // 1. Fetch Profile
      let { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
         console.error('Profile fetch error:', profileError);
      }

      // If no profile in DB, create default
      if (!profile) {
         console.log('No profile found, creating default...');
         const newProfile = { 
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.email?.split('@')[0] || 'Warrior',
            ikigai_status: {},
            created_at: new Date()
         };
         
         const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .upsert(newProfile)
            .select()
            .single();
            
         if (createError) throw createError;
         profile = createdProfile;
      }

      setUserProfile(profile);

      // 2. Fetch Sprints
      const { data: fetchedSprints } = await supabase.from('sprints').select('*').eq('user_id', authUser.id);
      setSprints(fetchedSprints || []);

      // 3. Fetch Tasks
      const { data: fetchedTasks } = await supabase.from('tasks').select('*').eq('user_id', authUser.id);
      setTasks(fetchedTasks || []);

      // 4. Fetch Meta Years (Ciclos)
      const { data: fetchedCiclos } = await supabase.from('meta_years').select('*').eq('user_id', authUser.id);
      
      if (!fetchedCiclos || fetchedCiclos.length === 0) {
          // Create default Ciclo if none exists
          const currentYear = new Date().getFullYear();
          const defaultCiclo = {
            year: currentYear,
            theme: `Ano da Transformação ${currentYear}`,
            intention: 'Evoluir em todas as áreas da vida com consistência e propósito',
            status: 'active',
            user_id: authUser.id
          };
          // Insert silently
          const { data: newCiclo } = await supabase.from('meta_years').insert(defaultCiclo).select().single();
          setCiclos(newCiclo ? [newCiclo] : []);
      } else {
          setCiclos(fetchedCiclos);
      }

      // 5. Fetch Journals
      const { data: fetchedJournals } = await supabase.from('journal_entries').select('*').eq('user_id', authUser.id);
      setJournals(fetchedJournals || []);

      // 6. Fetch Protocols
      const { data: fetchedProtocols } = await supabase.from('protocols').select('*').eq('user_id', authUser.id);
      
      if (!fetchedProtocols || fetchedProtocols.length === 0) {
          // If no protocols, use default and save to DB
          const defaultProtocolsData = DEFAULT_PROTOCOLS.map(p => ({
              user_id: authUser.id,
              name: p.name,
              frequency: p.frequency,
              completed_today: false
          }));
          
          const { data: createdProtocols } = await supabase.from('protocols').insert(defaultProtocolsData).select();
          setProtocols(createdProtocols || []);
      } else {
          setProtocols(fetchedProtocols);
      }

    } catch (error) {
      console.error('Critical error loading user data:', error);
      // Fallback?
    }
  };

  // Deprecated: saveUserData is no longer used for auto-saving everything to local storage
  // Instead, individual components should save to Supabase
  const saveUserData = useCallback(() => {}, []);

  
  useEffect(() => {
    // Check if onboarding is done (profile has zodiac) but no sprints exist
    if (user && userProfile && userProfile.zodiac_sign && sprints.length === 0 && currentPage !== 'sprints') {
       // Redirect to sprints to prompt creation
       console.log('Redirecting to Sprints for creation...');
       setCurrentPage('sprints');
       // We can also trigger a visual cue or open the modal if we pass a prop
    }
  }, [user, userProfile, sprints, currentPage]);

  useEffect(() => {
    if (user && userProfile) {
       // Removed auto-save to localStorage to prevent overwriting DB data with stale local state
       // saveUserData(user.id, userProfile, tasks, protocols, sprints, journals, moodHistory, ciclos);
    }
  }, [user, userProfile, tasks, protocols, sprints, journals, moodHistory, ciclos, saveUserData]);
  
  const handleAuthSuccess = async (authUser) => {
    setUser(authUser);
    await loadUserData(authUser);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };
  
  const handleToggleProtocol = async (protocolId) => {
    // Optimistic update
    const protocol = protocols.find(p => p.id === protocolId);
    const newStatus = !protocol.completed_today;
    
    setProtocols(prev => prev.map(p => 
      p.id === protocolId ? { ...p, completed_today: newStatus } : p
    ));

    try {
        await supabase
            .from('protocols')
            .update({ completed_today: newStatus })
            .eq('id', protocolId);
    } catch (error) {
        console.error('Error toggling protocol:', error);
        // Revert on error
        setProtocols(prev => prev.map(p => 
            p.id === protocolId ? { ...p, completed_today: !newStatus } : p
        ));
    }
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
      case 'ciclo': return 'Ciclo';
      case 'sprints': return 'Sprints';
      case 'ikigai': return 'Astro-Ikigai';
      case 'journal': return 'Journal';
      case 'profile': return 'Profile';
      default: return 'Siddha Code';
    }
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage userProfile={userProfile} protocols={protocols} onToggleProtocol={handleToggleProtocol} tasks={tasks} sprints={sprints} setSprints={setSprints} setProtocols={setProtocols} user={user} />;
      case 'ciclo': return <CicloPage ciclos={ciclos} setCiclos={setCiclos} sprints={sprints} setSprints={setSprints} tasks={tasks} userProfile={userProfile} />;
      case 'sprints': return <SprintsPage tasks={tasks} setTasks={setTasks} userProfile={userProfile} onUpdateTask={handleUpdateTask} sprints={sprints} setSprints={setSprints} ciclos={ciclos} />;
      case 'ikigai': return <IkigaiBuilder userProfile={userProfile} />;
      case 'journal': return <JournalPage journals={journals} setJournals={setJournals} userProfile={userProfile} />;
      case 'profile': return <ProfilePage user={user} userProfile={userProfile} setUserProfile={setUserProfile} />;
      default: return <DashboardPage userProfile={userProfile} protocols={protocols} onToggleProtocol={handleToggleProtocol} tasks={tasks} sprints={sprints} setSprints={setSprints} />;
    }
  };
  
  // Onboarding Logic
  const showOnboarding = user && userProfile && (!userProfile.zodiac_sign);

  return (
    <div className="min-h-screen bg-void relative">
      <StarsBackground className="fixed inset-0 z-0 pointer-events-none" />
      
      {showOnboarding ? (
         <div className="relative z-50">
           <OnboardingFlow 
             user={user} 
             onComplete={() => loadUserData(user)} 
           />
         </div>
      ) : (
        <div className="relative z-10">
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

           <ExpandableChat
              size="lg"
              position="bottom-right"
              icon={<Bot className="h-6 w-6" />}
            >
              <ExpandableChatHeader className="flex-col text-center justify-center">
                <h1 className="text-xl font-semibold">Siddha AI ✨</h1>
                <p className="text-sm text-muted-foreground">
                  Seu guia para produtividade e autoconhecimento
                </p>
              </ExpandableChatHeader>
              <ExpandableChatBody>
                <ChatMessageList>
                  <ChatBubble variant="received">
                    <ChatBubbleAvatar fallback="AI" />
                    <ChatBubbleMessage>Olá! Como posso ajudar você a alinhar sua produtividade com sua essência hoje?</ChatBubbleMessage>
                  </ChatBubble>
                </ChatMessageList>
              </ExpandableChatBody>
              <ExpandableChatFooter>
                 <div className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1">
                    <ChatInput placeholder="Digite sua dúvida..." />
                    <div className="flex items-center p-3 pt-0 justify-between">
                       <Button size="sm" className="ml-auto gap-1.5">Enviar <Send className="size-3.5" /></Button>
                    </div>
                 </div>
              </ExpandableChatFooter>
            </ExpandableChat>
        </div>
      )}
    </div>
  );
}