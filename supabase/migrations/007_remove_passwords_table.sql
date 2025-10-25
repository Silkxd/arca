-- Remove passwords table and related policies
-- This migration removes the old password system completely

-- Drop RLS policies for passwords table
DROP POLICY IF EXISTS "passwords_select_policy" ON passwords;
DROP POLICY IF EXISTS "passwords_insert_policy" ON passwords;
DROP POLICY IF EXISTS "passwords_update_policy" ON passwords;
DROP POLICY IF EXISTS "passwords_delete_policy" ON passwords;

-- Drop the passwords table
DROP TABLE IF EXISTS passwords;

-- Remove any indexes related to passwords
DROP INDEX IF EXISTS idx_passwords_user_id;
DROP INDEX IF EXISTS idx_passwords_category;
DROP INDEX IF EXISTS idx_passwords_created_at;