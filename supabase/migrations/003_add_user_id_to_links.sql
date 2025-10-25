-- Add user_id column to links table
ALTER TABLE links ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing links to have user_id from their group
UPDATE links 
SET user_id = link_groups.user_id 
FROM link_groups 
WHERE links.group_id = link_groups.id;

-- Make user_id NOT NULL after updating existing records
ALTER TABLE links ALTER COLUMN user_id SET NOT NULL;

-- Create index for user_id
CREATE INDEX idx_links_user_id ON links(user_id);

-- Update RLS policy for links to use user_id directly
DROP POLICY IF EXISTS "Users can manage links in own groups" ON links;

CREATE POLICY "Users can manage own links" ON links 
    FOR ALL USING (auth.uid() = user_id);