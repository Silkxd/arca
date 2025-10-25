-- Insert default categories for new users
-- This will be handled by the application when a user first logs in

-- Function to create default categories for a user
CREATE OR REPLACE FUNCTION create_default_categories(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- Insert default expense categories
    INSERT INTO categories (user_id, name, type, color) VALUES
    (user_uuid, 'Alimentação', 'expense', '#EF4444'),
    (user_uuid, 'Transporte', 'expense', '#F97316'),
    (user_uuid, 'Moradia', 'expense', '#8B5CF6'),
    (user_uuid, 'Saúde', 'expense', '#EC4899'),
    (user_uuid, 'Educação', 'expense', '#3B82F6'),
    (user_uuid, 'Lazer', 'expense', '#F59E0B'),
    (user_uuid, 'Compras', 'expense', '#6366F1'),
    (user_uuid, 'Outros', 'expense', '#6B7280');
    
    -- Insert default income categories
    INSERT INTO categories (user_id, name, type, color) VALUES
    (user_uuid, 'Salário', 'income', '#10B981'),
    (user_uuid, 'Freelance', 'income', '#06B6D4'),
    (user_uuid, 'Investimentos', 'income', '#8B5CF6'),
    (user_uuid, 'Outros', 'income', '#059669');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically create profile and categories when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    -- Create default categories
    PERFORM create_default_categories(NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();