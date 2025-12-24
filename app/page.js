'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'sonner';
import { 
  LayoutDashboard, Kanban, User, BookOpen, LogOut, Menu, 
  Sparkles, Target, Compass, Bot, Send, Trophy,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/cn';

// Components
import { GlassCard } from '@/components/custom-ui/GlassCard';
import { CustomButton as Button } from '@/components/custom-ui/CustomButton';
import DashboardPage from '@/components/DashboardPage';
import CicloPage from '@/components/CicloPage';
import SprintsPage from '@/components/SprintsPage';
import JournalPage from '@/components/JournalPage';
import AuthPage from '@/components/AuthPage';
import ProfilePage from '@/components/ProfilePage';
import { MOODS, getMoodById } from '@/components/MoodTracker';
import IkigaiBuilder from '@/components/IkigaiBuilder';
import OnboardingFlow from '@/components/OnboardingFlow';
import { ExpandableChat, ExpandableChatHeader, ExpandableChatBody, ExpandableChatFooter } from '@/components/ui/expandable-chat';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatInput } from '@/components/ui/chat-input';
import EditProfileModal from '@/components/EditProfileModal';
import { StarsBackground } from '@/components/ui/stars-background';

// Constants
import { getRankByXp, getRankProgress } from '@/lib/constants/ranks';
import { XP_REWARDS } from '@/lib/constants/kanban';

// ============ LAYOUT COMPONENTS ============

const UserDropdown = ({ user, userProfile, onSignOut, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentRank = getRankByXp(userProfile?.xp || 0);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold shadow-lg border border-white/20">
          {userProfile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">{userProfile?.username || 'Warrior'}</p>
          <p className="text-xs text-white/50 capitalize">{currentRank}</p>
        </div>
        <ChevronRight className={cn("w-4 h-4 text-white/30 transition-transform", isOpen && "rotate-90")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-[#0f0f13] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="p-3 border-b border-white/5 mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-white/50">Nível {Math.floor((userProfile?.xp || 0) / 1000) + 1}</span>
                <span className="text-xs text-primary font-bold">{userProfile?.xp || 0} XP</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full" 
                  style={{ width: `${getRankProgress(userProfile?.xp || 0)}%` }}
                />
              </div>
            </div>
            
            <button 
              onClick={() => { onNavigate('profile'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all text-sm"
            >
              <User className="w-4 h-4" />
              Meu Perfil
            </button>
            <button 
              onClick={() => { onSignOut(); setIsOpen(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const Header = ({ title, setIsMobileOpen, user, userProfile, onSignOut, onNavigate, todayMood, onSelectMood, moodHistory }) => {
  return (
    <header className="h-20 border-b border-white/5 bg-void/50 backdrop-blur-xl sticky top-0 z-30 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-white hidden sm:block">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Mood Tracker Mini */}
        <div className="hidden md:block">
            {todayMood ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                    <span className="text-lg">{getMoodById(todayMood)?.emoji}</span>
                    <span className="text-xs text-white/70">Humor de hoje</span>
                </div>
            ) : (
                <div className="flex gap-1">
                    {MOODS.map(m => (
                        <button 
                            key={m.id} 
                            onClick={() => onSelectMood(m.id)}
                            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all text-lg grayscale hover:grayscale-0"
                            title={m.label}
                        >
                            {m.emoji}
                        </button>
                    ))}
                </div>
            )}
        </div>

        <div className="h-8 w-px bg-white/10 mx-2" />
        
        <UserDropdown 
          user={user} 
          userProfile={userProfile} 
          onSignOut={onSignOut}
          onNavigate={onNavigate}
        />
      </div>
    </header>
  );
};

const Sidebar = ({ currentPage, setCurrentPage, isMobileOpen, setIsMobileOpen, user, userProfile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ciclo', label: 'Ciclo', icon: Target },
    { id: 'sprints', label: 'Sprints', icon: Kanban },
    { id: 'ikigai', label: 'Astro-Ikigai', icon: Compass },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0f0f13] border-r border-white/5 flex flex-col transition-transform duration-300 transform",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center mr-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">
            Siddha Code
          </span>
        </div>

        {/* Nav */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setIsMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                currentPage === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("w-5 h-5 transition-colors", currentPage === item.id ? "text-white" : "text-white/50 group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
              {currentPage === item.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <GlassCard className="p-4 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold text-white">Sua Jornada</span>
            </div>
            <p className="text-xs text-white/60 mb-2">Continue evoluindo seus pilares para desbloquear novos arquétipos.</p>
            <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full w-3/4 rounded-full" />
            </div>
          </GlassCard>
        </div>
      </aside>
    </>
  );
};

// ============ AI WIDGET ============

const AIAssistantWidget = ({ userProfile }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'system',
      content: 'Sou o Siddha AI, seu mentor pessoal. Como posso ajudar você a alinhar suas ações com seu Human Design hoje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        const response = await fetch('/api/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'chat', data: { message: userMsg.content } })
        });
        const result = await response.json();
        
        const aiMsg = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant', 
            content: result.reply || "Estou me conectando com o campo quântico... Tente novamente."
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error('Chat error:', error);
        toast.error('Erro ao conectar com Siddha AI');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <ExpandableChat
      icon={<Bot className="h-6 w-6" />}
      size="lg"
      position="bottom-right"
      className="z-50"
    >
      <ExpandableChatHeader className="bg-[#0f0f13] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Siddha AI</h3>
            <p className="text-xs text-white/50">Mentor Virtual</p>
          </div>
        </div>
      </ExpandableChatHeader>
      <ExpandableChatBody className="bg-[#0f0f13] p-4">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble key={message.id} variant={message.role === 'user' ? 'sent' : 'received'}>
              <ChatBubbleAvatar 
                fallback={message.role === 'user' ? 'US' : 'AI'} 
                className={message.role === 'user' ? 'bg-primary' : 'bg-purple-600'}
              />
              <ChatBubbleMessage variant={message.role === 'user' ? 'sent' : 'received'}>
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
          {isLoading && (
             <ChatBubble variant="received">
                <ChatBubbleAvatar fallback="AI" className="bg-purple-600" />
                <ChatBubbleMessage isLoading />
             </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter className="bg-[#0f0f13] border-t border-white/10 p-3">
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
          <ChatInput 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Pergunte ao Siddha AI..." 
            className="bg-white/5 border-white/10"
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
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
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  // const supabase = createClient(); // Use the global instance imported from lib/supabase
  
  // Handle mood selection
  const handleSelectMood = (moodId) => {
    const today = new Date().toISOString().split('T')[0];
    setMoodHistory(prev => {
      const filtered = prev.filter(m => m.date !== today);
      const activeSprint = sprints.find(s => s.status === 'active');
      return [...filtered, { 
        date: today, 
        mood: moodId, 
        sprintId: activeSprint?.id || null,
        timestamp: new Date().toISOString()
      }];
    });
    toast.success('Humor registrado!');
  };
  
  const today = new Date().toISOString().split('T')[0];
  const todayMood = moodHistory.find(m => m.date === today)?.mood || null;

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
          const currentYear = new Date().getFullYear();
          const defaultCiclo = {
            year: currentYear,
            theme: `Ano da Transformação ${currentYear}`,
            intention: 'Evoluir em todas as áreas da vida com consistência e propósito',
            status: 'active',
            user_id: authUser.id
          };
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
    }
  };
  
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

  const handleCreateSprint = async (sprint) => {
    try {
        const sprintId = uuidv4();
        const currentCiclo = ciclos.find(m => m.status === 'active');
        const newSprint = { 
            ...sprint, 
            id: sprintId, 
            user_id: user.id,
            status: 'active', 
            created_at: new Date().toISOString(), 
            tasks_count: sprint.goals?.length || 0, 
            completed_tasks: 0,
            meta_year_id: currentCiclo?.id || null
        };
        
        const { data: createdSprint, error } = await supabase.from('sprints').insert(newSprint).select().single();
        if (error) throw error;

        setSprints(prev => [...prev, createdSprint]);
        
        if (sprint.goals && sprint.goals.length > 0) {
            const newTasks = sprint.goals.map((goal, index) => ({
                id: uuidv4(),
                user_id: user.id,
                title: goal,
                content: goal,
                pillar: sprint.focusPillars?.[index % sprint.focusPillars.length] || 'personal',
                status: 'potential',
                sprint_id: sprintId,
                gut_check_score: null,
                xp_reward: 30,
                created_at: new Date().toISOString()
            }));
            
            const { data: createdTasks, error: tasksError } = await supabase.from('tasks').insert(newTasks).select();
            if (!tasksError) {
                setTasks(prev => [...prev, ...createdTasks]);
            }
        }
        toast.success('Sprint criado com sucesso!');
    } catch (error) {
        console.error('Error creating sprint:', error);
        toast.error('Erro ao criar sprint');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-pillar-spiritual flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
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
  
  return (
    <div className="min-h-screen bg-void relative">
      <StarsBackground className="fixed inset-0 z-0 pointer-events-none" />
      <Toaster position="top-right" theme="dark" />
      
      <div className="flex h-screen overflow-hidden relative z-10">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          user={user}
          userProfile={userProfile}
        />
        
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide">
            <div className="max-w-7xl mx-auto pb-20">
              {currentPage === 'dashboard' && (
                  <DashboardPage 
                      userProfile={userProfile} 
                      protocols={protocols} 
                      onToggleProtocol={handleToggleProtocol} 
                      tasks={tasks} 
                      sprints={sprints} 
                      setSprints={setSprints} 
                      setProtocols={setProtocols} 
                      user={user} 
                      setPage={setCurrentPage}
                      onCreateSprint={handleCreateSprint}
                  />
              )}
              {currentPage === 'ciclo' && (
                  <CicloPage 
                      ciclos={ciclos} 
                      setCiclos={setCiclos} 
                      sprints={sprints} 
                      setSprints={setSprints} 
                      tasks={tasks} 
                      userProfile={userProfile} 
                  />
              )}
              {currentPage === 'sprints' && (
                  <SprintsPage 
                      tasks={tasks} 
                      setTasks={setTasks} 
                      userProfile={userProfile} 
                      onUpdateTask={handleUpdateTask} 
                      sprints={sprints} 
                      setSprints={setSprints} 
                      ciclos={ciclos} 
                  />
              )}
              {currentPage === 'ikigai' && <IkigaiBuilder userProfile={userProfile} />}
              {currentPage === 'journal' && (
                  <JournalPage 
                      journals={journals} 
                      setJournals={setJournals} 
                      userProfile={userProfile} 
                  />
              )}
              {currentPage === 'profile' && (
                  <ProfilePage 
                      user={user} 
                      userProfile={userProfile} 
                      setUserProfile={setUserProfile} 
                      onEditProfile={() => setIsEditProfileOpen(true)} 
                  />
              )}
            </div>
          </main>
        </div>
      </div>
      
      {/* Global Widgets */}
      <AIAssistantWidget userProfile={userProfile} />
      
      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          userProfile={userProfile}
          onUpdate={(updated) => setUserProfile(prev => ({ ...prev, ...updated }))}
        />
      )}
      
      {/* Onboarding */}
      {user && !userProfile?.zodiac_sign && (
        <div className="fixed inset-0 z-[100] bg-void">
          <OnboardingFlow 
            user={user} 
            onComplete={(data) => {
              setUserProfile(prev => ({ ...prev, ...data }));
              // Optional: redirect or reload
            }} 
          />
        </div>
      )}
    </div>
  );
}
