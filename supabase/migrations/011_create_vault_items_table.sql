-- Create vault_items table for storing documents and secure text
-- This table will store both file references and encrypted text content

CREATE TABLE vault_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'text')),
  content TEXT, -- Encrypted content for text items
  file_url TEXT, -- URL for document files
  file_name TEXT, -- Original file name
  file_type TEXT, -- MIME type
  file_size BIGINT, -- File size in bytes
  category TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vault_items_user_id ON vault_items(user_id);
CREATE INDEX idx_vault_items_type ON vault_items(type);
CREATE INDEX idx_vault_items_category ON vault_items(category);
CREATE INDEX idx_vault_items_created_at ON vault_items(created_at);

-- Enable RLS
ALTER TABLE vault_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own vault items" ON vault_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vault items" ON vault_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault items" ON vault_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vault items" ON vault_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for vault files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vault-files', 'vault-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload their own vault files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vault-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own vault files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'vault-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own vault files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'vault-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own vault files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vault-files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vault_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_vault_items_updated_at
  BEFORE UPDATE ON vault_items
  FOR EACH ROW
  EXECUTE FUNCTION update_vault_items_updated_at();