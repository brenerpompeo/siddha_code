
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROTOCOLS (Habits/Routines)
CREATE TABLE IF NOT EXISTS protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('morning', 'evening', 'daily', 'weekly', 'monthly')),
  time TEXT, -- '08:00', 'Morning', etc.
  description TEXT,
  completed_today BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DREAM BOARD ITEMS
CREATE TABLE IF NOT EXISTS dream_board_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ciclo_id UUID REFERENCES meta_years(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('image', 'text')),
  content TEXT NOT NULL, -- URL for image, Text for text
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 200,
  height INTEGER DEFAULT 200,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can crud own protocols" ON protocols FOR ALL USING (auth.uid() = user_id);

ALTER TABLE dream_board_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can crud own dream board" ON dream_board_items FOR ALL USING (auth.uid() = user_id);

-- Add missing columns to meta_years if needed (for Time Machine/Ciclo enhancements)
-- ALTER TABLE meta_years ADD COLUMN IF NOT EXISTS vision TEXT;
-- ALTER TABLE meta_years ADD COLUMN IF NOT EXISTS motto TEXT;
