-- Data minimization pass: drop knee_side and graft_type, which were collected
-- but never used by any logic in the app. Adds injury_date, which the prehab
-- home screen now actively displays (weeks since injury), so it earns its
-- collection. Run after 004_exercises_program_seed.sql.

alter table user_profile drop column if exists knee_side;
alter table user_profile drop column if exists graft_type;
alter table user_profile add column if not exists injury_date date;
