-- Create pj_projects table for managing PJ projects
CREATE TABLE IF NOT EXISTS pj_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    projeto VARCHAR(255) NOT NULL,
    contratante VARCHAR(255) NOT NULL,
    lotes INTEGER NOT NULL DEFAULT 0,
    shape DECIMAL(10,2) NOT NULL DEFAULT 0,
    valor DECIMAL(15,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'INICIADO',
    pago DECIMAL(15,2) NOT NULL DEFAULT 0,
    pendente DECIMAL(15,2) NOT NULL DEFAULT 0,
    obs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pj_projects_user_id ON pj_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_pj_projects_status ON pj_projects(status);
CREATE INDEX IF NOT EXISTS idx_pj_projects_contratante ON pj_projects(contratante);
CREATE INDEX IF NOT EXISTS idx_pj_projects_cidade ON pj_projects(cidade);

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_pj_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pj_projects_updated_at
    BEFORE UPDATE ON pj_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_pj_projects_updated_at();

-- Create trigger to automatically calculate pendente field
CREATE OR REPLACE FUNCTION calculate_pj_projects_pendente()
RETURNS TRIGGER AS $$
BEGIN
    NEW.pendente = NEW.valor - NEW.pago;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_pj_projects_pendente
    BEFORE INSERT OR UPDATE ON pj_projects
    FOR EACH ROW
    EXECUTE FUNCTION calculate_pj_projects_pendente();

-- Enable Row Level Security (RLS)
ALTER TABLE pj_projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own pj_projects" ON pj_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pj_projects" ON pj_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pj_projects" ON pj_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pj_projects" ON pj_projects
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions to authenticated users
GRANT ALL PRIVILEGES ON pj_projects TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create analytics function for project statistics
CREATE OR REPLACE FUNCTION get_pj_projects_analytics(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_projects', COUNT(*),
        'total_value', COALESCE(SUM(valor), 0),
        'total_paid', COALESCE(SUM(pago), 0),
        'total_pending', COALESCE(SUM(pendente), 0),
        'by_status', (
            SELECT json_object_agg(status, count)
            FROM (
                SELECT status, COUNT(*) as count
                FROM pj_projects
                WHERE user_id = p_user_id
                GROUP BY status
            ) status_counts
        ),
        'by_contractor', (
            SELECT json_object_agg(contratante, contractor_data)
            FROM (
                SELECT 
                    contratante,
                    json_build_object(
                        'count', COUNT(*),
                        'total_value', COALESCE(SUM(valor), 0),
                        'total_paid', COALESCE(SUM(pago), 0),
                        'total_pending', COALESCE(SUM(pendente), 0)
                    ) as contractor_data
                FROM pj_projects
                WHERE user_id = p_user_id
                GROUP BY contratante
            ) contractor_stats
        ),
        'by_city', (
            SELECT json_object_agg(cidade, city_data)
            FROM (
                SELECT 
                    cidade,
                    json_build_object(
                        'count', COUNT(*),
                        'total_value', COALESCE(SUM(valor), 0)
                    ) as city_data
                FROM pj_projects
                WHERE user_id = p_user_id
                GROUP BY cidade
            ) city_stats
        ),
        'payment_efficiency', (
            CASE 
                WHEN SUM(valor) > 0 THEN ROUND((SUM(pago) / SUM(valor) * 100)::numeric, 2)
                ELSE 0
            END
        )
    ) INTO result
    FROM pj_projects
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on analytics function
GRANT EXECUTE ON FUNCTION get_pj_projects_analytics(UUID) TO authenticated;