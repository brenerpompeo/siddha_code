-- =========================================================
-- SIDDHA CODE / SIDDHASTIA — SCHEMA COMPLETO UNIFICADO (V1.0)
-- Banco de Dados: Supabase PostgreSQL
-- =========================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- 2. TABELA: PROFILES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  birth_date TIMESTAMPTZ,
  birth_time TEXT,
  birth_location TEXT,
  human_design_type TEXT,
  human_design_profile TEXT,
  hd_type TEXT,
  hd_strategy TEXT,
  hd_authority TEXT,
  zodiac_sign TEXT,
  zodiac_element TEXT,
  archetype TEXT,
  archetype_history JSONB DEFAULT '[]'::jsonb,
  ikigai_status JSONB DEFAULT '{}'::jsonb,
  pillars_stats JSONB DEFAULT '{"physical":0,"mental":0,"intellectual":0,"spiritual":0,"cultural":0,"professional":0,"personal":0}'::jsonb,
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'iniciado',
  league_tier TEXT DEFAULT 'Bronze',
  total_focus_minutes INTEGER DEFAULT 0,
  mood_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir adição de colunas caso a tabela profiles já exista
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hd_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hd_strategy TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS hd_authority TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS archetype TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS archetype_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pillars_stats JSONB DEFAULT '{"physical":0,"mental":0,"intellectual":0,"spiritual":0,"cultural":0,"professional":0,"personal":0}'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'iniciado';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS league_tier TEXT DEFAULT 'Bronze';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_focus_minutes INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS mood_history JSONB DEFAULT '[]'::jsonb;

-- =========================================================
-- 3. TABELA: META_YEARS (CICLOS TEMPORAIS)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.meta_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  theme TEXT,
  intention TEXT,
  status TEXT DEFAULT 'active', -- active, archived, completed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 4. TABELA: SPRINTS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  meta_year_id UUID REFERENCES public.meta_years(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  intention TEXT,
  archetype TEXT,
  duration INTEGER DEFAULT 14,
  focus_pillars TEXT[] DEFAULT '{}',
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active', -- active, planning, paused, completed, cancelled
  goals JSONB DEFAULT '[]'::jsonb,
  commitments JSONB DEFAULT '{}'::jsonb,
  tasks_count INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir adição de colunas em sprints
ALTER TABLE public.sprints ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 14;
ALTER TABLE public.sprints ADD COLUMN IF NOT EXISTS focus_pillars TEXT[] DEFAULT '{}';
ALTER TABLE public.sprints ADD COLUMN IF NOT EXISTS tasks_count INTEGER DEFAULT 0;
ALTER TABLE public.sprints ADD COLUMN IF NOT EXISTS completed_tasks INTEGER DEFAULT 0;

-- =========================================================
-- 5. TABELA: TASKS (KANBAN DE ALTA PERFORMANCE)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  status TEXT DEFAULT 'potential', -- potential, response, integration, wisdom
  pillar TEXT DEFAULT 'personal', -- physical, mental, intellectual, spiritual, cultural, professional, personal
  sub_pillar TEXT,
  gut_check_score INTEGER,
  xp_reward INTEGER DEFAULT 15,
  is_recurring BOOLEAN DEFAULT FALSE,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium', -- low, medium, high
  position INTEGER DEFAULT 0,
  task_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir adição de colunas em tasks
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS sub_pillar TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS gut_check_score INTEGER;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 15;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS task_metadata JSONB DEFAULT '{}'::jsonb;

-- =========================================================
-- 6. TABELA: PROTOCOLS (RÁBITOS E ROTINAS DIÁRIAS)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  type TEXT, -- morning, evening, daily, weekly, monthly
  frequency TEXT DEFAULT 'daily',
  time TEXT,
  description TEXT,
  completed_today BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir colunas em protocols
ALTER TABLE public.protocols ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.protocols ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'daily';

-- =========================================================
-- 7. TABELA: JOURNAL_ENTRIES (DIÁRIO / SEGUNDO CÉREBRO)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pillar TEXT DEFAULT 'mental',
  mood TEXT,
  tags TEXT[] DEFAULT '{}',
  linked_entries UUID[] DEFAULT '{}',
  energy_level INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir colunas em journal_entries
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS pillar TEXT DEFAULT 'mental';
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS linked_entries UUID[] DEFAULT '{}';
ALTER TABLE public.journal_entries ADD COLUMN IF NOT EXISTS energy_level INTEGER;

-- =========================================================
-- 8. TABELA: DREAM_BOARD_ITEMS (QUADRO DOS SONHOS)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.dream_board_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  ciclo_id UUID REFERENCES public.meta_years(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('image', 'text')),
  content TEXT NOT NULL,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 200,
  height INTEGER DEFAULT 200,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 9. TABELA: IKIGAI_ENTRIES
-- =========================================================
CREATE TABLE IF NOT EXISTS public.ikigai_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('love', 'good_at', 'paid_for', 'needs')),
  description TEXT NOT NULL,
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 10. TABELA: FRIENDSHIPS (GAMIFICAÇÃO & SOCIAL)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS unique_friendship 
ON public.friendships (LEAST(user_id_1, user_id_2), GREATEST(user_id_1, user_id_2));

-- =========================================================
-- 11. POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

ALTER TABLE public.meta_years ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can crud own years" ON public.meta_years;
CREATE POLICY "Users can crud own years" ON public.meta_years FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can crud own sprints" ON public.sprints;
CREATE POLICY "Users can crud own sprints" ON public.sprints FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can crud own tasks" ON public.tasks;
CREATE POLICY "Users can crud own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can crud own protocols" ON public.protocols;
CREATE POLICY "Users can crud own protocols" ON public.protocols FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can crud own journal" ON public.journal_entries;
CREATE POLICY "Users can crud own journal" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.dream_board_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can crud own dream board" ON public.dream_board_items;
CREATE POLICY "Users can crud own dream board" ON public.dream_board_items FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.ikigai_entries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can crud own ikigai" ON public.ikigai_entries;
CREATE POLICY "Users can crud own ikigai" ON public.ikigai_entries FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view friendships" ON public.friendships;
CREATE POLICY "Users can view friendships" ON public.friendships 
FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
DROP POLICY IF EXISTS "Users can insert friendships" ON public.friendships;
CREATE POLICY "Users can insert friendships" ON public.friendships 
FOR INSERT WITH CHECK (auth.uid() = user_id_1);
DROP POLICY IF EXISTS "Users can update friendships" ON public.friendships;
CREATE POLICY "Users can update friendships" ON public.friendships 
FOR UPDATE USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- =========================================================
-- 12. TRIGGER AUTOMÁTICO DE CRIAÇÃO DE PERFIL
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username, xp, streak, rank)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    0,
    0,
    'iniciado'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
