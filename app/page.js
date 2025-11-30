'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { PILLARS, getPillarByKey, getPillarColor } from '@/lib/constants/pillars';
import { RANKS, getRankByXp, getNextRank, getRankProgress } from '@/lib/constants/ranks';
import { KANBAN_COLUMNS, GUT_CHECK_PROMPTS, XP_REWARDS, getColumnById } from '@/lib/constants/kanban';
import { createClient } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

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

// ============ AUTH COMPONENTS ============

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
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
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
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
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Siddha Code</h1>
          <p className="text-white/50 mt-2">Life Operating System</p>
        </div>
        
        <GlassCard className="p-8">
          {/* Tabs */}
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
          
          {/* Error/Success Messages */}
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
          
          {/* Form */}
          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {mode === 'signup' && (
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-white/50">or continue with</span>
            </div>
          </div>
          
          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          
          {/* Demo Mode */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => onAuthSuccess({ id: 'demo-user', email: 'demo@siddhacode.com' })}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Try Demo Mode
            </Button>
            <p className="text-xs text-white/30 text-center mt-2">
              No sign up required - explore all features
            </p>
          </div>
        </GlassCard>
        
        {/* Footer */}
        <p className="text-center text-white/30 text-sm mt-6">
          Gamified productivity with Human Design
        </p>
      </div>
    </div>
  );
};

// ============ LAYOUT COMPONENTS ============

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen, user, userProfile }) => {
  const currentRank = getRankByXp(userProfile?.xp || 0);
  const rankProgress = getRankProgress(userProfile?.xp || 0);
  const nextRank = getNextRank(userProfile?.xp || 0);
  
  const displayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
  
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
              <span className="text-lg font-bold">{displayName[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{displayName}</p>
              <p className="text-xs" style={{ color: currentRank.color }}>
                {currentRank.title}
              </p>
            </div>
          </div>
          
          {/* XP Progress */}
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

const Header = ({ title, setIsMobileOpen, user, userProfile, onSignOut }) => {
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
        
        {/* Quick Stats & User */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{(userProfile?.xp || 0).toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{userProfile?.streak || 0} day streak</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-pillar-cultural flex items-center justify-center">
              <span className="text-sm font-bold">
                {(userProfile?.username || user?.email)?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============ DRAG AND DROP COMPONENTS ============

const SortableTaskCard = ({ task, onMove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const pillar = getPillarByKey(task.pillar);
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-surface border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all',
        isDragging && 'shadow-lg shadow-primary/20 border-primary/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div 
          {...attributes} 
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4 text-white/30 hover:text-white/60" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white font-medium mb-2">{task.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
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
    </div>
  );
};

const DroppableColumn = ({ column, tasks, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        <h3 className="font-semibold text-white">{column.label}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
          {tasks.length}
        </span>
        {column.requiresGutCheck && (
          <span className="text-xs text-yellow-500">Gut Check</span>
        )}
      </div>
      
      <GlassCard 
        ref={setNodeRef}
        className={cn(
          'p-3 min-h-[400px] transition-all duration-200',
          isOver && 'ring-2 ring-primary/50 bg-primary/5'
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-white/30 text-sm">
                {isOver ? 'Drop here!' : 'No tasks'}
              </div>
            ) : (
              children
            )}
          </div>
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
          <Badge color={pillar?.color || '#6b7280'}>
            {pillar?.label || task.pillar}
          </Badge>
        </div>
      </div>
    </div>
  );
};

// ============ GUT CHECK MODAL ============

const GutCheckModal = ({ isOpen, onClose, onConfirm, task, hdType }) => {
  const [score, setScore] = useState(7);
  
  if (!isOpen) return null;
  
  const prompt = GUT_CHECK_PROMPTS[hdType] || GUT_CHECK_PROMPTS.default;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-kanban-response/20 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-kanban-response" />
          </div>
          <h3 className="text-xl font-semibold text-white">Gut Check</h3>
          <p className="text-white/50 text-sm mt-2">Moving to "Resposta" requires validation</p>
        </div>
        
        <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-6">
          <p className="text-sm text-white/80 italic">"{prompt}"</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/50">Alignment Score</span>
            <span className={cn(
              'font-bold',
              score >= 7 ? 'text-kanban-response' : 'text-yellow-500'
            )}>
              {score}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>Not aligned</span>
            <span>Fully aligned</span>
          </div>
        </div>
        
        {score < 7 && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="text-sm text-yellow-400">
              Score below 7 - Consider if this task truly aligns with your energy.
            </p>
          </div>
        )}
        
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => onConfirm(score)}>
            Confirm Move
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

// ============ PAGE COMPONENTS ============

const StatsBar = ({ userProfile }) => {
  const currentRank = getRankByXp(userProfile?.xp || 0);
  const rankProgress = getRankProgress(userProfile?.xp || 0);
  const nextRank = getNextRank(userProfile?.xp || 0);
  
  const stats = [
    { label: 'Total XP', value: (userProfile?.xp || 0).toLocaleString(), icon: Zap, color: '#8b5cf6' },
    { label: 'Streak', value: `${userProfile?.streak || 0} days`, icon: Flame, color: '#f59e0b' },
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

const ProtocolsPanel = ({ protocols, onToggle }) => {
  const completedCount = protocols.filter(p => p.is_checked).length;
  const totalCount = protocols.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
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
            onClick={() => onToggle(protocol.id)}
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
      
      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-primary/20 border border-primary/30 text-center">
          <p className="text-sm text-primary font-medium">
            All protocols completed! +{XP_REWARDS.all_protocols_daily} XP
          </p>
        </div>
      )}
    </GlassCard>
  );
};

const PillarsOverview = ({ userProfile }) => {
  const stats = userProfile?.pillars_stats || {};
  
  return (
    <GlassCard className="p-6">
      <h3 className="font-semibold text-white mb-4">7 Pillars of Life</h3>
      <div className="space-y-3">
        {PILLARS.map(pillar => {
          const value = stats[pillar.key] || 0;
          const maxValue = 50;
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

const DashboardPage = ({ userProfile, protocols, onToggleProtocol }) => {
  const displayName = userProfile?.username || 'Warrior';
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
          <h1 className="text-2xl font-bold text-white">Welcome back, {displayName}!</h1>
          <p className="text-white/50 capitalize">{today}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Sprint
        </Button>
      </div>
      
      {/* Stats Bar */}
      <StatsBar userProfile={userProfile} />
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProtocolsPanel protocols={protocols} onToggle={onToggleProtocol} />
        <PillarsOverview userProfile={userProfile} />
      </div>
    </div>
  );
};

// Create Task Modal
const CreateTaskModal = ({ isOpen, onClose, onCreateTask }) => {
  const [title, setTitle] = useState('');
  const [pillar, setPillar] = useState('physical');
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    await onCreateTask({
      title: title.trim(),
      pillar,
      xp_reward: XP_REWARDS.task_complete
    });
    
    setTitle('');
    setPillar('physical');
    setLoading(false);
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
          <Input
            label="Task Title"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          
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
            <Button type="submit" className="flex-1" loading={loading}>
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

// Sprints Page with DnD
const SprintsPage = ({ tasks, setTasks, userProfile, onUpdateTask }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [gutCheckTask, setGutCheckTask] = useState(null);
  const [pendingMove, setPendingMove] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  const filteredTasks = useMemo(() => {
    return selectedPillar 
      ? tasks.filter(t => t.pillar === selectedPillar)
      : tasks;
  }, [tasks, selectedPillar]);
  
  const tasksByColumn = useMemo(() => {
    const result = {};
    KANBAN_COLUMNS.forEach(col => {
      result[col.id] = filteredTasks.filter(t => t.status === col.id);
    });
    return result;
  }, [filteredTasks]);
  
  const activeTask = useMemo(() => {
    return activeId ? tasks.find(t => t.id === activeId) : null;
  }, [activeId, tasks]);
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over) return;
    
    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;
    
    // Check if dropped on a column
    const targetColumn = KANBAN_COLUMNS.find(col => col.id === over.id);
    const targetTask = tasks.find(t => t.id === over.id);
    
    let newStatus = activeTask.status;
    
    if (targetColumn) {
      newStatus = targetColumn.id;
    } else if (targetTask) {
      newStatus = targetTask.status;
    }
    
    // If moving to "response" column, require gut check
    if (newStatus === 'response' && activeTask.status !== 'response' && !activeTask.gut_check_score) {
      setGutCheckTask(activeTask);
      setPendingMove(newStatus);
      return;
    }
    
    if (newStatus !== activeTask.status) {
      const updatedTask = { ...activeTask, status: newStatus };
      onUpdateTask(updatedTask);
    }
  };
  
  const handleGutCheckConfirm = (score) => {
    if (gutCheckTask && pendingMove) {
      const updatedTask = { 
        ...gutCheckTask, 
        status: pendingMove,
        gut_check_score: score
      };
      onUpdateTask(updatedTask);
    }
    setGutCheckTask(null);
    setPendingMove(null);
  };
  
  const handleCreateTask = async (taskData) => {
    const newTask = {
      id: uuidv4(),
      ...taskData,
      status: 'potential',
      gut_check_score: null,
      created_at: new Date().toISOString()
    };
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
      
      {/* Kanban Board with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map(column => (
            <DroppableColumn 
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
            >
              {tasksByColumn[column.id].map(task => (
                <SortableTaskCard key={task.id} task={task} />
              ))}
            </DroppableColumn>
          ))}
        </div>
        
        <DragOverlay>
          {activeTask && <DragOverlayCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
      
      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
      
      {/* Gut Check Modal */}
      <GutCheckModal
        isOpen={!!gutCheckTask}
        onClose={() => { setGutCheckTask(null); setPendingMove(null); }}
        onConfirm={handleGutCheckConfirm}
        task={gutCheckTask}
        hdType={userProfile?.hd_type || 'generator'}
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
const ProfilePage = ({ user, userProfile }) => {
  const currentRank = getRankByXp(userProfile?.xp || 0);
  const displayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
  const stats = userProfile?.pillars_stats || {};
  
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
              <span className="text-3xl font-bold">{displayName[0].toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{displayName}</h2>
              <p className="text-white/50 text-sm">{user?.email}</p>
              <Badge color={currentRank.color} className="mt-2">
                {currentRank.title}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-xs text-white/50 mb-1">Total XP</p>
              <p className="text-2xl font-bold text-primary">{(userProfile?.xp || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-xs text-white/50 mb-1">Streak</p>
              <p className="text-2xl font-bold text-orange-500">{userProfile?.streak || 0} days</p>
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
                {(userProfile?.hd_type || 'generator')?.replace('_', ' ')}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-white/70">
                <span className="text-primary font-medium">Gut Check Prompt:</span>
                <br />
                {GUT_CHECK_PROMPTS[userProfile?.hd_type] || GUT_CHECK_PROMPTS.default}
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
            const value = stats[pillar.key] || 0;
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

// Default data for new users
const DEFAULT_PROTOCOLS = [
  { id: uuidv4(), name: 'Morning Routine', is_checked: false },
  { id: uuidv4(), name: 'Hydration (8 glasses)', is_checked: false },
  { id: uuidv4(), name: 'Meditation', is_checked: false },
  { id: uuidv4(), name: 'Exercise', is_checked: false },
  { id: uuidv4(), name: 'Learning Time', is_checked: false },
  { id: uuidv4(), name: 'Evening Review', is_checked: false },
];

const DEFAULT_TASKS = [
  { id: uuidv4(), title: 'Welcome to Siddha Code!', pillar: 'spiritual', status: 'potential', gut_check_score: null, xp_reward: 10 },
];

const DEFAULT_PROFILE = {
  username: '',
  xp: 0,
  streak: 0,
  hd_type: 'generator',
  pillars_stats: {
    physical: 0,
    mental: 0,
    intellectual: 0,
    spiritual: 0,
    cultural: 0,
    professional: 0,
    personal: 0
  }
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [protocols, setProtocols] = useState([]);
  
  const supabase = createClient();
  
  // Check authentication on mount
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
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserData(session.user);
        } else {
          setUser(null);
          setUserProfile(null);
          setTasks([]);
          setProtocols([]);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Load user data from localStorage (or Supabase if tables exist)
  const loadUserData = async (authUser) => {
    const storageKey = `siddha_${authUser.id}`;
    
    // Try to load from localStorage first
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const data = JSON.parse(savedData);
      setUserProfile(data.profile);
      setTasks(data.tasks || []);
      setProtocols(data.protocols || []);
    } else {
      // Initialize with defaults
      const newProfile = {
        ...DEFAULT_PROFILE,
        username: authUser.email?.split('@')[0] || 'Warrior'
      };
      setUserProfile(newProfile);
      setTasks(DEFAULT_TASKS);
      setProtocols(DEFAULT_PROTOCOLS);
      
      // Save to localStorage
      saveUserData(authUser.id, newProfile, DEFAULT_TASKS, DEFAULT_PROTOCOLS);
    }
  };
  
  // Save user data to localStorage
  const saveUserData = useCallback((userId, profile, taskList, protocolList) => {
    const storageKey = `siddha_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify({
      profile,
      tasks: taskList,
      protocols: protocolList
    }));
  }, []);
  
  // Save whenever data changes
  useEffect(() => {
    if (user && userProfile) {
      saveUserData(user.id, userProfile, tasks, protocols);
    }
  }, [user, userProfile, tasks, protocols, saveUserData]);
  
  const handleAuthSuccess = async (authUser) => {
    setUser(authUser);
    await loadUserData(authUser);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
    setTasks([]);
    setProtocols([]);
  };
  
  const handleToggleProtocol = (protocolId) => {
    setProtocols(prev => {
      const updated = prev.map(p => 
        p.id === protocolId ? { ...p, is_checked: !p.is_checked } : p
      );
      
      // Award XP if completing a protocol
      const protocol = prev.find(p => p.id === protocolId);
      if (protocol && !protocol.is_checked) {
        setUserProfile(profile => ({
          ...profile,
          xp: (profile?.xp || 0) + XP_REWARDS.protocol_complete
        }));
        
        // Check if all completed
        const allCompleted = updated.every(p => p.is_checked);
        if (allCompleted) {
          setUserProfile(profile => ({
            ...profile,
            xp: (profile?.xp || 0) + XP_REWARDS.all_protocols_daily
          }));
        }
      }
      
      return updated;
    });
  };
  
  const handleUpdateTask = (updatedTask) => {
    setTasks(prev => {
      const oldTask = prev.find(t => t.id === updatedTask.id);
      
      // Award XP if completing task (moving to wisdom)
      if (updatedTask.status === 'wisdom' && oldTask?.status !== 'wisdom') {
        const xpGain = updatedTask.xp_reward || XP_REWARDS.task_complete;
        const extraXp = updatedTask.gut_check_score >= 8 ? XP_REWARDS.high_gut_check : 0;
        
        setUserProfile(profile => {
          const pillarStats = { ...(profile?.pillars_stats || {}) };
          pillarStats[updatedTask.pillar] = (pillarStats[updatedTask.pillar] || 0) + 1;
          
          return {
            ...profile,
            xp: (profile?.xp || 0) + xpGain + extraXp,
            pillars_stats: pillarStats
          };
        });
      }
      
      return prev.map(t => t.id === updatedTask.id ? updatedTask : t);
    });
  };
  
  // Loading state
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
  
  // Auth page if not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }
  
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
        return (
          <DashboardPage 
            userProfile={userProfile} 
            protocols={protocols} 
            onToggleProtocol={handleToggleProtocol} 
          />
        );
      case 'sprints':
        return (
          <SprintsPage 
            tasks={tasks} 
            setTasks={setTasks} 
            userProfile={userProfile}
            onUpdateTask={handleUpdateTask}
          />
        );
      case 'journal':
        return <JournalPage />;
      case 'profile':
        return <ProfilePage user={user} userProfile={userProfile} />;
      default:
        return (
          <DashboardPage 
            userProfile={userProfile} 
            protocols={protocols} 
            onToggleProtocol={handleToggleProtocol} 
          />
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-void">
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        user={user}
        userProfile={userProfile}
      />
      
      <div className="lg:ml-64">
        <Header 
          title={getPageTitle()} 
          setIsMobileOpen={setIsMobileOpen}
          user={user}
          userProfile={userProfile}
          onSignOut={handleSignOut}
        />
        
        <main className="p-4 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}