-- Update the Database types to include song_history table and wallet_address field

-- Add wallet_address to profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;

-- Create song_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS song_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  cover_art_url TEXT,
  confidence_score FLOAT,
  identification_method TEXT NOT NULL,
  identified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT song_history_identification_method_check 
    CHECK (identification_method IN ('type', 'sing', 'speak'))
);

-- Enable row level security
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
