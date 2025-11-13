create table if not exists public.note_tables (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes(id) on delete cascade,
  columns jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default now(),
  unique(note_id)
);

create table if not exists public.note_table_cells (
  id uuid primary key default gen_random_uuid(),
  table_id uuid not null references public.note_tables(id) on delete cascade,
  row_index integer not null,
  col_index integer not null,
  value text,
  created_at timestamp with time zone default now(),
  unique(table_id, row_index, col_index)
);

create index if not exists idx_note_table_cells_table_id on public.note_table_cells(table_id);
