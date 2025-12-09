
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  birth_date TIMESTAMPTZ,
  birth_time TEXT,
  birth_location TEXT,
  human_design_type TEXT,
  human_design_profile TEXT, -- e.g. "Generator 4/6"
  zodiac_sign TEXT,
  zodiac_element TEXT,
  ikigai_status JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IKIGAI ENTRIES
CREATE TABLE IF NOT EXISTS ikigai_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('love', 'good_at', 'paid_for', 'needs')),
  description TEXT NOT NULL,
  weight INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- META YEARS (CICLOS)
CREATE TABLE IF NOT EXISTS meta_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  theme TEXT,
  intention TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SPRINTS
CREATE TABLE IF NOT EXISTS sprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  meta_year_id UUID REFERENCES meta_years(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  intention TEXT,
  archetype TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'planning', -- planning, active, completed
  goals JSONB DEFAULT '[]'::jsonb,
  commitments JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASKS (Kanban)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo', -- todo, in_progress, done
  pillar TEXT, -- physical, mental, etc.
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOURNAL ENTRIES
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT,
  mood TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Example - Basic)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE ikigai_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can crud own ikigai" ON ikigai_entries FOR ALL USING (auth.uid() = user_id);

ALTER TABLE meta_years ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can crud own years" ON meta_years FOR ALL USING (auth.uid() = user_id);

ALTER TABLE sprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can crud own sprints" ON sprints FOR ALL USING (auth.uid() = user_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can crud own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can crud own journal" ON journal_entries FOR ALL USING (auth.uid() = user_id);
