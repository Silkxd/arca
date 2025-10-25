-- Create logins table for credential management
-- This table will store user credentials for various services

CREATE TABLE IF NOT EXISTS logins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  encrypted_password TEXT NOT NULL,
  website_url TEXT,
  notes TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_logins_user_id ON logins(user_id);
CREATE INDEX IF NOT EXISTS idx_logins_service_name ON logins(service_name);
CREATE INDEX IF NOT EXISTS idx_logins_category ON logins(category);
CREATE INDEX IF NOT EXISTS idx_logins_created_at ON logins(created_at);

-- Enable Row Level Security
ALTER TABLE logins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for logins table
CREATE POLICY "logins_select_policy" ON logins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "logins_insert_policy" ON logins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logins_update_policy" ON logins
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "logins_delete_policy" ON logins
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_logins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_logins_updated_at_trigger
  BEFORE UPDATE ON logins
  FOR EACH ROW
  EXECUTE FUNCTION update_logins_updated_at();