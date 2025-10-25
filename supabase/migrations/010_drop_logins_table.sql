-- Drop logins table and related policies
-- This migration removes the entire logins system from the database

-- Drop RLS policies first
DROP POLICY IF EXISTS "Users can view their own logins" ON logins;
DROP POLICY IF EXISTS "Users can insert their own logins" ON logins;
DROP POLICY IF EXISTS "Users can update their own logins" ON logins;
DROP POLICY IF EXISTS "Users can delete their own logins" ON logins;

-- Drop the logins table
DROP TABLE IF EXISTS logins;

-- Note: This migration completely removes the logins functionality
-- Make sure this is what you want before applying