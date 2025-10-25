-- Tabela para Planejamento Mensal (PF e PJ)
CREATE TABLE monthly_planning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(2) NOT NULL CHECK (type IN ('PF', 'PJ')),
    category_name VARCHAR(255) NOT NULL,
    formula TEXT, -- Para armazenar fórmulas como "(3000-6%)-500"
    base_value DECIMAL(12,2), -- Valor calculado da fórmula ou valor fixo
    end_month DATE, -- Mês limite (opcional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para valores mensais específicos do planejamento
CREATE TABLE monthly_planning_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planning_id UUID REFERENCES monthly_planning(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Formato: "2024-01"
    value DECIMAL(12,2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para Controle Financeiro PJ (Receitas e Retiradas)
CREATE TABLE pj_financial_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('receita', 'retirada')),
    amount DECIMAL(12,2) NOT NULL,
    responsible VARCHAR(255) NOT NULL,
    month_year VARCHAR(7) NOT NULL, -- Formato: "2024-01"
    nf_issued BOOLEAN DEFAULT FALSE, -- Apenas para receitas
    nf_issued_date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_monthly_planning_user_type ON monthly_planning(user_id, type);
CREATE INDEX idx_monthly_planning_values_planning ON monthly_planning_values(planning_id);
CREATE INDEX idx_monthly_planning_values_month ON monthly_planning_values(month_year);
CREATE INDEX idx_pj_financial_control_user ON pj_financial_control(user_id);
CREATE INDEX idx_pj_financial_control_month ON pj_financial_control(month_year);
CREATE INDEX idx_pj_financial_control_type ON pj_financial_control(type);

-- RLS Policies
ALTER TABLE monthly_planning ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own monthly planning" ON monthly_planning FOR ALL USING (auth.uid() = user_id);

ALTER TABLE monthly_planning_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own planning values" ON monthly_planning_values FOR ALL 
USING (planning_id IN (SELECT id FROM monthly_planning WHERE user_id = auth.uid()));

ALTER TABLE pj_financial_control ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own PJ financial control" ON pj_financial_control FOR ALL USING (auth.uid() = user_id);

-- Grants para roles
GRANT SELECT, INSERT, UPDATE, DELETE ON monthly_planning TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON monthly_planning_values TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON pj_financial_control TO authenticated;

GRANT SELECT ON monthly_planning TO anon;
GRANT SELECT ON monthly_planning_values TO anon;
GRANT SELECT ON pj_financial_control TO anon;