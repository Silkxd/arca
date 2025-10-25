-- Fix RLS policies for logins table
-- Drop existing policies first
DROP POLICY IF EXISTS "logins_select_policy" ON logins;
DROP POLICY IF EXISTS "logins_insert_policy" ON logins;
DROP POLICY IF EXISTS "logins_update_policy" ON logins;
DROP POLICY IF EXISTS "logins_delete_policy" ON logins;

-- Recreate RLS policies with correct syntax
CREATE POLICY "Enable read access for users based on user_id" ON logins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON logins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON logins
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON logins
  FOR DELETE USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE logins ENABLE ROW LEVEL SECURITY;