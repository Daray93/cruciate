-- Defensive fixup: migration 004 (which originally added sets/reps_target/
-- requires_load_clearance to exercises) appears to have never actually run
-- on this database, only 003. 006 wrongly assumed those columns already
-- existed, so it never checked for them. This adds anything still missing,
-- from 004 or 006, idempotently. Safe to run even if some columns already exist.

do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'sets') then
    alter table exercises add column sets integer;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'reps_target') then
    alter table exercises add column reps_target text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'requires_load_clearance') then
    alter table exercises add column requires_load_clearance boolean not null default false;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'purpose') then
    alter table exercises add column purpose text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'cue') then
    alter table exercises add column cue text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'frequency_note') then
    alter table exercises add column frequency_note text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'equipment') then
    alter table exercises add column equipment text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'contraindications') then
    alter table exercises add column contraindications text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'exercises' and column_name = 'category') then
    alter table exercises add column category text check (category in ('mobility', 'strength'));
  end if;
end $$;
