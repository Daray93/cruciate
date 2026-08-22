-- Adopts the full 5-phase rehab protocol (adds rehab_advanced ~wk12-20 and
-- rehab_return_to_sport ~wk20+ after rehab_strength), and adds richer
-- exercise metadata (purpose, cue, frequency, equipment, contraindications).
-- Run after 005_data_minimization.sql.

-- Postgres auto-names inline column checks as "<table>_<column>_check" — drop
-- and recreate each under that same name to widen the allowed phase ids.
alter table user_profile drop constraint if exists user_profile_current_phase_check;
alter table user_profile add constraint user_profile_current_phase_check check (
  current_phase in (
    'prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready',
    'rehab_protection', 'rehab_activation', 'rehab_strength', 'rehab_advanced', 'rehab_return_to_sport'
  )
);

alter table milestone_checkins drop constraint if exists milestone_checkins_phase_target_check;
alter table milestone_checkins add constraint milestone_checkins_phase_target_check check (
  phase_target in (
    'prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready',
    'rehab_protection', 'rehab_activation', 'rehab_strength', 'rehab_advanced', 'rehab_return_to_sport'
  )
);

alter table exercises drop constraint if exists exercises_phase_check;
alter table exercises add constraint exercises_phase_check check (
  phase in (
    'prehab_rom', 'prehab_activation', 'prehab_strength', 'prehab_ready',
    'rehab_protection', 'rehab_activation', 'rehab_strength', 'rehab_advanced', 'rehab_return_to_sport'
  )
);

do $$
begin
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
