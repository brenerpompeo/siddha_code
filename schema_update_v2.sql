
-- TASKS ENHANCEMENTS
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sub_pillar TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS task_metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium'; -- low, medium, high

-- OPTIONAL: Add specific fields for common tracking if JSONB is too complex for basic SQL queries later
-- But for now, JSONB is flexible enough for "Notion-like" attributes.

-- PROFILES ENHANCEMENTS
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS archetype_history JSONB DEFAULT '[]'::jsonb;
