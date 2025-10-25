-- Fix RLS policies for passwords table
-- This migration ensures proper Row Level Security for password operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own passwords" ON passwords;

-- Create more specific policies for better debugging
CREATE POLICY "Users can view own passwords" ON passwords 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own passwords" ON passwords 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own passwords" ON passwords 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own passwords" ON passwords 
    FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Add a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for passwords table
DROP TRIGGER IF EXISTS update_passwords_updated_at ON passwords;
CREATE TRIGGER update_passwords_updated_at 
    BEFORE UPDATE ON passwords 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();