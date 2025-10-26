-- Create table for PJ responsibles
CREATE TABLE IF NOT EXISTS pj_responsibles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique responsible names per user
  UNIQUE(user_id, name)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_pj_responsibles_user_id ON pj_responsibles(user_id);
CREATE INDEX IF NOT EXISTS idx_pj_responsibles_name ON pj_responsibles(name);

-- Enable RLS (Row Level Security)
ALTER TABLE pj_responsibles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own responsibles" ON pj_responsibles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own responsibles" ON pj_responsibles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responsibles" ON pj_responsibles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own responsibles" ON pj_responsibles
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pj_responsibles_updated_at 
  BEFORE UPDATE ON pj_responsibles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comment on table
COMMENT ON TABLE pj_responsibles IS 'Stores unique responsible names for PJ financial records per user';