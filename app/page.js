'use client';

import { useState, useEffect } from 'react';
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
  Sparkles,
  Target,
  Calendar,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { PILLARS, getPillarByKey, getPillarColor } from '@/lib/constants/pillars';
import { RANKS, getRankByXp, getNextRank, getRankProgress } from '@/lib/constants/ranks';
import { KANBAN_COLUMNS, GUT_CHECK_PROMPTS, XP_REWARDS, getColumnById } from '@/lib/constants/kanban';
import { v4 as uuidv4 } from 'uuid';

// Demo user data
const DEMO_USER = {
  id: uuidv4(),
  username: 'SiddhaWarrior',
  full_name: 'Demo User',
  xp: 2340,
  streak: 7,
  hd_type: 'generator',
  pillars_stats: {
    physical: 15,
    mental: 22,
    intellectual: 18,
    spiritual: 25,
    cultural: 10,
    professional: 30,
    personal: 12
  }
};

// Demo tasks
const DEMO_TASKS = [
  { id: uuidv4(), title: 'Morning meditation practice', pillar: 'spiritual', status: 'wisdom', gut_check_score: 9, xp_reward: 15 },
  { id: uuidv4(), title: 'Read 20 pages of Design Patterns book', pillar: 'intellectual', status: 'integration', gut_check_score: 8, xp_reward: 10 },
  { id: uuidv4(), title: 'Complete React course module', pillar: 'professional', status: 'response', gut_check_score: 9, xp_reward: 20 },
  { id: uuidv4(), title: 'Family dinner planning', pillar: 'personal', status: 'potential', gut_check_score: null, xp_reward: 10 },
  { id: uuidv4(), title: '30 min cardio workout', pillar: 'physical', status: 'potential', gut_check_score: null, xp_reward: 15 },
  { id: uuidv4(), title: 'Journal reflection', pillar: 'mental', status: 'response', gut_check_score: 7, xp_reward: 10 },
  { id: uuidv4(), title: 'Visit art museum', pillar: 'cultural', status: 'potential', gut_check_score: null, xp_reward: 20 },
];

// Demo protocols
const DEMO_PROTOCOLS = [
  { id: uuidv4(), name: 'Morning Routine', is_checked: true },
  { id: uuidv4(), name: 'Hydration (8 glasses)', is_checked: true },
  { id: uuidv4(), name: 'Meditation', is_checked: true },
  { id: uuidv4(), name: 'Exercise', is_checked: false },
  { id: uuidv4(), name: 'Learning Time', is_checked: false },
  { id: uuidv4(), name: 'Evening Review', is_checked: false },
];

// Navigation items
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sprints', label: 'Sprints', icon: Kanban },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'profile', label: 'Profile', icon: User },
];

// ============ UI COMPONENTS ============

const GlassCard = ({ children, className, ...props }) => (
  <div 
    className={cn(
      'bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

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

const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white',
    secondary: 'bg-white/10 hover:bg-white/20 text-white',
    ghost: 'hover:bg-white/10 text-white/70 hover:text-white',
    outline: 'border border-white/20 hover:bg-white/10 text-white'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

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

// ============ LAYOUT COMPONENTS ============

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen }) => {
  const user = DEMO_USER;
  const currentRank = getRankByXp(user.xp);
  const rankProgress = getRankProgress(user.xp);
  const nextRank = getNextRank(user.xp);
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-surface/95 backdrop-blur-xl border-r border-white/10 z-50',
        'transform transition-transform duration-300 lg:translate-x-0',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
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
        
        {/* User Stats */}
        <div className="p-4 m-4 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center">
              <span className="text-lg font-bold">{user.username[0]}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{user.username}</p>
              <p className="text-xs" style={{ color: currentRank.color }}>
                {currentRank.title}
              </p>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">XP</span>
              <span className="text-white/70">{user.xp.toLocaleString()}</span>
            </div>
            <Progress value={rankProgress} color={currentRank.color} />
            {nextRank && (
              <p className="text-xs text-white/40">
                {(nextRank.xp_min - user.xp).toLocaleString()} XP to {nextRank.title}
              </p>
            )}
          </div>
        </div>
        
        {/* Navigation */}
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
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        
        {/* Bottom section */}
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

const Header = ({ title, setIsMobileOpen }) => {
  const user = DEMO_USER;
  
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
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{user.xp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{user.streak} day streak</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center">
            <span className="text-sm font-bold">{user.username[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============ PAGE COMPONENTS ============

// Stats Bar Component
const StatsBar = () => {
  const user = DEMO_USER;
  const currentRank = getRankByXp(user.xp);
  const rankProgress = getRankProgress(user.xp);
  const nextRank = getNextRank(user.xp);
  
  const stats = [
    { label: 'Total XP', value: user.xp.toLocaleString(), icon: Zap, color: '#8b5cf6' },
    { label: 'Streak', value: `${user.streak} days`, icon: Flame, color: '#f59e0b' },
    { label: 'Rank', value: currentRank.title, icon: Trophy, color: currentRank.color },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <GlassCard key={idx} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/50 mb-1">{stat.label}</p>
              <p className="text-xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
            </div>
          </div>
          {stat.label === 'Rank' && nextRank && (
            <div className="mt-3">
              <Progress value={rankProgress} color={stat.color} />
              <p className="text-xs text-white/40 mt-1">
                {Math.round(rankProgress)}% to {nextRank.title}
              </p>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
};

// Protocols Panel Component
const ProtocolsPanel = ({ protocols, setProtocols }) => {
  const completedCount = protocols.filter(p => p.is_checked).length;
  const totalCount = protocols.length;
  const progress = (completedCount / totalCount) * 100;
  
  const toggleProtocol = (id) => {
    setProtocols(prev => prev.map(p => 
      p.id === id ? { ...p, is_checked: !p.is_checked } : p
    ));
  };
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-white">Daily Protocols</h3>
          <p className="text-xs text-white/50">{completedCount}/{totalCount} completed</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
          <Target className="w-6 h-6 text-primary" />
        </div>
      </div>
      
      <Progress value={progress} className="mb-4" />
      
      <div className="space-y-2">
        {protocols.map(protocol => (
          <button
            key={protocol.id}
            onClick={() => toggleProtocol(protocol.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              protocol.is_checked 
                ? 'bg-primary/10 border border-primary/30'
                : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
            )}
          >
            {protocol.is_checked ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <Circle className="w-5 h-5 text-white/30" />
            )}
            <span className={cn(
              'text-sm',
              protocol.is_checked ? 'text-white' : 'text-white/70'
            )}>
              {protocol.name}
            </span>
          </button>
        ))}
      </div>
      
      {completedCount === totalCount && (
        <div className="mt-4 p-3 rounded-lg bg-primary/20 border border-primary/30 text-center">
          <p className="text-sm text-primary font-medium">
            All protocols completed! +{XP_REWARDS.all_protocols_daily} XP
          </p>
        </div>
      )}
    </GlassCard>
  );
};

// Pillars Overview Component
const PillarsOverview = () => {
  const user = DEMO_USER;
  
  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold text-white mb-4">7 Pillars of Life</h3>
      <div className="space-y-3">
        {PILLARS.map(pillar => {
          const value = user.pillars_stats[pillar.key] || 0;
          const maxValue = 50; // Example max
          return (
            <div key={pillar.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: pillar.color }}
                  />
                  <span className="text-sm text-white/70">{pillar.label}</span>
                </div>
                <span className="text-xs text-white/50">{value} tasks</span>
              </div>
              <Progress value={value} max={maxValue} color={pillar.color} />
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

// Dashboard Page
const DashboardPage = ({ protocols, setProtocols }) => {
  const user = DEMO_USER;
  const today = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {user.username}!</h1>
          <p className="text-white/50 capitalize">{today}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Sprint
        </Button>
      </div>
      
      {/* Stats Bar */}
      <StatsBar />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProtocolsPanel protocols={protocols} setProtocols={setProtocols} />
        <PillarsOverview />
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onMove }) => {
  const pillar = getPillarByKey(task.pillar);
  const column = getColumnById(task.status);
  
  return (
    <div className="bg-surface border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all cursor-grab active:cursor-grabbing">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <GripVertical className="w-4 h-4 text-white/30" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium mb-2">{task.title}</p>
          <div className="flex items-center gap-2">
            <Badge color={pillar?.color || '#6b7280'}>
              {pillar?.label || task.pillar}
            </Badge>
            {task.gut_check_score && (
              <span className="text-xs text-white/50">
                Gut: {task.gut_check_score}/10
              </span>
            )}
          </div>
          {task.xp_reward > 0 && (
            <p className="text-xs text-primary mt-2">+{task.xp_reward} XP</p>
          )}
        </div>
      </div>
      
      {/* Quick move buttons */}
      <div className="flex gap-1 mt-3 pt-3 border-t border-white/5">
        {KANBAN_COLUMNS.filter(col => col.id !== task.status).map(col => (
          <button
            key={col.id}
            onClick={() => onMove(task.id, col.id)}
            className="flex-1 px-2 py-1 text-xs rounded bg-white/5 hover:bg-white/10 transition-colors"
            style={{ color: col.color }}
          >
            {col.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({ column, tasks, onMoveTask }) => {
  const columnTasks = tasks.filter(t => t.status === column.id);
  
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        <h3 className="font-semibold text-white">{column.label}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
          {columnTasks.length}
        </span>
      </div>
      
      <GlassCard className="p-3 min-h-[400px]">
        <div className="space-y-3">
          {columnTasks.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-sm">
              No tasks here
            </div>
          ) : (
            columnTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onMove={onMoveTask}
              />
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
};

// Kanban Board Component
const KanbanBoard = ({ tasks, setTasks }) => {
  const moveTask = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };
  
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map(column => (
        <KanbanColumn 
          key={column.id}
          column={column}
          tasks={tasks}
          onMoveTask={moveTask}
        />
      ))}
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
    
    onCreateTask({
      id: uuidv4(),
      title: title.trim(),
      pillar,
      status: 'potential',
      gut_check_score: null,
      xp_reward: XP_REWARDS.task_complete
    });
    
    setTitle('');
    setPillar('physical');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Create New Task</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
              placeholder="Enter task title..."
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/70 mb-2">Pillar</label>
            <div className="grid grid-cols-2 gap-2">
              {PILLARS.map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPillar(p.key)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm text-left transition-all',
                    pillar === p.key
                      ? 'border-2'
                      : 'bg-white/5 border border-white/10 hover:border-white/20'
                  )}
                  style={pillar === p.key ? {
                    backgroundColor: `${p.color}20`,
                    borderColor: p.color,
                    color: p.color
                  } : {}}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

// Pillar Filter Component
const PillarFilter = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'px-3 py-1.5 rounded-full text-sm transition-all',
          selected === null
            ? 'bg-white/20 text-white'
            : 'bg-white/5 text-white/60 hover:bg-white/10'
        )}
      >
        All Pillars
      </button>
      {PILLARS.map(pillar => (
        <button
          key={pillar.key}
          onClick={() => onSelect(pillar.key)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm transition-all',
            selected === pillar.key
              ? 'text-white'
              : 'bg-white/5 text-white/60 hover:bg-white/10'
          )}
          style={selected === pillar.key ? {
            backgroundColor: `${pillar.color}30`,
            color: pillar.color
          } : {}}
        >
          {pillar.label}
        </button>
      ))}
    </div>
  );
};

// Sprints Page
const SprintsPage = ({ tasks, setTasks }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState(null);
  
  const filteredTasks = selectedPillar 
    ? tasks.filter(t => t.pillar === selectedPillar)
    : tasks;
  
  const handleCreateTask = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Sprint Kanban</h1>
          <p className="text-white/50">Human Design themed task management</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      {/* Pillar Filter */}
      <GlassCard className="p-4">
        <PillarFilter selected={selectedPillar} onSelect={setSelectedPillar} />
      </GlassCard>
      
      {/* Kanban Board */}
      <KanbanBoard tasks={filteredTasks} setTasks={setTasks} />
      
      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

// Journal Page
const JournalPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Journal</h1>
        <p className="text-white/50">Reflect on your journey</p>
      </div>
      
      <GlassCard className="p-8 text-center">
        <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
        <p className="text-white/50 max-w-md mx-auto">
          The journal feature will allow you to log reflections, track your Not-Self moments, 
          and gain deeper insights into your Human Design journey.
        </p>
      </GlassCard>
    </div>
  );
};

// Profile Page
const ProfilePage = () => {
  const user = DEMO_USER;
  const currentRank = getRankByXp(user.xp);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-white/50">Your Siddha journey stats</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center">
              <span className="text-3xl font-bold">{user.username[0]}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.username}</h2>
              <p className="text-white/50">{user.full_name}</p>
              <Badge color={currentRank.color} className="mt-2">
                {currentRank.title}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-xs text-white/50 mb-1">Total XP</p>
              <p className="text-2xl font-bold text-primary">{user.xp.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-xs text-white/50 mb-1">Streak</p>
              <p className="text-2xl font-bold text-orange-500">{user.streak} days</p>
            </div>
          </div>
        </GlassCard>
        
        {/* Human Design Info */}
        <GlassCard className="p-6">
          <h3 className="font-semibold text-white mb-4">Human Design</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-xs text-white/50 mb-1">Type</p>
              <p className="text-lg font-semibold text-primary capitalize">
                {user.hd_type?.replace('_', ' ') || 'Not Set'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-white/70">
                <span className="text-primary font-medium">Gut Check Prompt:</span>
                <br />
                {GUT_CHECK_PROMPTS[user.hd_type] || GUT_CHECK_PROMPTS.default}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Pillars Stats */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-white mb-4">Pillar Progress</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {PILLARS.map(pillar => {
            const value = user.pillars_stats[pillar.key] || 0;
            return (
              <div key={pillar.key} className="text-center">
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${pillar.color}20` }}
                >
                  <span className="text-xl font-bold" style={{ color: pillar.color }}>
                    {value}
                  </span>
                </div>
                <p className="text-xs text-white/70">{pillar.label}</p>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};

// ============ MAIN APP ============

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [protocols, setProtocols] = useState(DEMO_PROTOCOLS);
  
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'sprints': return 'Sprint Kanban';
      case 'journal': return 'Journal';
      case 'profile': return 'Profile';
      default: return 'Siddha Code';
    }
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage protocols={protocols} setProtocols={setProtocols} />;
      case 'sprints':
        return <SprintsPage tasks={tasks} setTasks={setTasks} />;
      case 'journal':
        return <JournalPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <DashboardPage protocols={protocols} setProtocols={setProtocols} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-void">
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div className="lg:ml-64">
        <Header title={getPageTitle()} setIsMobileOpen={setIsMobileOpen} />
        
        <main className="p-4 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}