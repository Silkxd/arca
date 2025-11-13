alter table public.note_tables enable row level security;
alter table public.note_table_cells enable row level security;

create policy if not exists select_note_tables_on_owner
  on public.note_tables
  for select
  using (
    exists (
      select 1 from public.notes n
      where n.id = note_tables.note_id and n.user_id = auth.uid()
    )
  );

create policy if not exists insert_note_tables_on_owner
  on public.note_tables
  for insert
  with check (
    exists (
      select 1 from public.notes n
      where n.id = note_tables.note_id and n.user_id = auth.uid()
    )
  );

create policy if not exists update_note_tables_on_owner
  on public.note_tables
  for update
  using (
    exists (
      select 1 from public.notes n
      where n.id = note_tables.note_id and n.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.notes n
      where n.id = note_tables.note_id and n.user_id = auth.uid()
    )
  );

create policy if not exists delete_note_tables_on_owner
  on public.note_tables
  for delete
  using (
    exists (
      select 1 from public.notes n
      where n.id = note_tables.note_id and n.user_id = auth.uid()
    )
  );

create policy if not exists select_table_cells_on_owner
  on public.note_table_cells
  for select
  using (
    exists (
      select 1 from public.note_tables t
      join public.notes n on n.id = t.note_id
      where t.id = note_table_cells.table_id and n.user_id = auth.uid()
    )
  );

create policy if not exists insert_table_cells_on_owner
  on public.note_table_cells
  for insert
  with check (
    exists (
      select 1 from public.note_tables t
      join public.notes n on n.id = t.note_id
      where t.id = note_table_cells.table_id and n.user_id = auth.uid()
    )
  );

create policy if not exists update_table_cells_on_owner
  on public.note_table_cells
  for update
  using (
    exists (
      select 1 from public.note_tables t
      join public.notes n on n.id = t.note_id
      where t.id = note_table_cells.table_id and n.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.note_tables t
      join public.notes n on n.id = t.note_id
      where t.id = note_table_cells.table_id and n.user_id = auth.uid()
    )
  );

create policy if not exists delete_table_cells_on_owner
  on public.note_table_cells
  for delete
  using (
    exists (
      select 1 from public.note_tables t
      join public.notes n on n.id = t.note_id
      where t.id = note_table_cells.table_id and n.user_id = auth.uid()
    )
  );
