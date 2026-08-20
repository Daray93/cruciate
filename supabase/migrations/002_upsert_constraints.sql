-- Run this once in the SQL editor if you already ran the original schema.sql
-- (before these unique constraints existed). Safe to skip on a fresh project
-- where schema.sql already includes them.

alter table exercises_logged add constraint exercises_logged_session_name_key unique (session_id, name);
alter table rom_readings add constraint rom_readings_session_id_key unique (session_id);
