-- Create song_history table to track user's song identification history
CREATE TABLE IF NOT EXISTS song_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  song_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  cover_art_url TEXT,
  identified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  identification_method TEXT CHECK (identification_method IN ('sing', 'speak', 'type')),
  confidence_score NUMERIC(5,2) CHECK (confidence_score >= 0 AND confidence_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE song_history ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own song history" ON song_history;
CREATE POLICY "Users can view their own song history"
ON song_history FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own song history" ON song_history;
CREATE POLICY "Users can insert their own song history"
ON song_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table song_history;