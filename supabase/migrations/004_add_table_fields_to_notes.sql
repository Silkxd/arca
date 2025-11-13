-- Add JSONB columns for table data in notes
alter table if exists public.notes
  add column if not exists table_data jsonb default '[]'::jsonb,
  add column if not exists table_columns jsonb default '[]'::jsonb;

update public.notes set table_data = coalesce(table_data, '[]'::jsonb);
update public.notes set table_columns = coalesce(table_columns, '[]'::jsonb);
