-- Adicionar campo color à tabela note_groups
ALTER TABLE note_groups ADD COLUMN color VARCHAR(20) DEFAULT 'blue';

-- Criar índice para o campo color para melhor performance
CREATE INDEX idx_note_groups_color ON note_groups(color);

-- Comentário explicativo
COMMENT ON COLUMN note_groups.color IS 'Cor do grupo de notas para organização visual (blue, green, purple, pink, yellow, red, indigo, gray)';