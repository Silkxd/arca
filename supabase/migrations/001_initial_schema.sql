-- Arca Application Database Schema
-- Initial migration for all core tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for additional user data
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles 
    FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense', 'both')),
    color VARCHAR(7) DEFAULT '#A7F3D0',
    budget_limit DECIMAL(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for categories
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can manage own categories" ON categories 
    FOR ALL USING (auth.uid() = user_id);

-- Create passwords table
CREATE TABLE passwords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    encrypted_password TEXT NOT NULL,
    url VARCHAR(500),
    category VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for passwords
CREATE INDEX idx_passwords_user_id ON passwords(user_id);
CREATE INDEX idx_passwords_category ON passwords(category);

-- Enable RLS for passwords
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Passwords policies
CREATE POLICY "Users can manage own passwords" ON passwords 
    FOR ALL USING (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_transactions_category ON transactions(category);

-- Enable RLS for transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can manage own transactions" ON transactions 
    FOR ALL USING (auth.uid() = user_id);

-- Create link_groups table
CREATE TABLE link_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#1B4332',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for link_groups
CREATE INDEX idx_link_groups_user_id ON link_groups(user_id);

-- Enable RLS for link_groups
ALTER TABLE link_groups ENABLE ROW LEVEL SECURITY;

-- Link groups policies
CREATE POLICY "Users can manage own link groups" ON link_groups 
    FOR ALL USING (auth.uid() = user_id);

-- Create links table
CREATE TABLE links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES link_groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices for links
CREATE INDEX idx_links_group_id ON links(group_id);
CREATE INDEX idx_links_order ON links(order_index);

-- Enable RLS for links
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Links policies
CREATE POLICY "Users can manage links in own groups" ON links 
    FOR ALL USING (group_id IN (SELECT id FROM link_groups WHERE user_id = auth.uid()));

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON profiles TO anon;
GRANT ALL PRIVILEGES ON profiles TO authenticated;

GRANT SELECT ON categories TO anon;
GRANT ALL PRIVILEGES ON categories TO authenticated;

GRANT SELECT ON passwords TO anon;
GRANT ALL PRIVILEGES ON passwords TO authenticated;

GRANT SELECT ON transactions TO anon;
GRANT ALL PRIVILEGES ON transactions TO authenticated;

GRANT SELECT ON link_groups TO anon;
GRANT ALL PRIVILEGES ON link_groups TO authenticated;

GRANT SELECT ON links TO anon;
GRANT ALL PRIVILEGES ON links TO authenticated;