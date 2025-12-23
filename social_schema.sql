
-- SOCIAL & GAMIFICATION
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, accepted
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure uniqueness (no duplicate friendships)
CREATE UNIQUE INDEX IF NOT EXISTS unique_friendship ON friendships (LEAST(user_id_1, user_id_2), GREATEST(user_id_1, user_id_2));

-- RLS for Social
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own friendships" ON friendships 
FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Users can insert friendship requests" ON friendships 
FOR INSERT WITH CHECK (auth.uid() = user_id_1);

CREATE POLICY "Users can update their own friendships" ON friendships 
FOR UPDATE USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

-- Update Profile for Gamification (if not exists)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS league_tier TEXT DEFAULT 'Bronze'; -- Bronze, Silver, Gold, Diamond, Obsidian
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_focus_minutes INTEGER DEFAULT 0;
