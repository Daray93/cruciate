-- Structured hold duration instead of parsing free-text reps_target, so the
-- app can offer an in-session countdown timer for exercises that are a
-- sustained hold (or a held balance/stretch) rather than counted reps.

alter table exercises add column if not exists hold_seconds integer;

update exercises set hold_seconds = 300 where track = 'prehab' and phase = 'prehab_rom' and name = 'Prone Hang';
update exercises set hold_seconds = 180 where track = 'prehab' and phase = 'prehab_rom' and name = 'Seated Knee Extension';
update exercises set hold_seconds = 10 where track = 'prehab' and phase = 'prehab_rom' and name = 'Quad Sets';
update exercises set hold_seconds = 10 where track = 'prehab' and phase = 'prehab_activation' and name = 'Quad Sets';
update exercises set hold_seconds = 30 where track = 'prehab' and phase = 'prehab_strength' and name = 'Single-Leg Balance';
update exercises set hold_seconds = 30 where track = 'prehab' and phase = 'prehab_strength' and name = 'Standing Quad Stretch';
update exercises set hold_seconds = 30 where track = 'prehab' and phase = 'prehab_ready' and name = 'Standing Quad Stretch';
update exercises set hold_seconds = 10 where track = 'rehab' and phase = 'rehab_protection' and name = 'Quad Sets';
update exercises set hold_seconds = 300 where track = 'rehab' and phase = 'rehab_protection' and name = 'Heel Props (Extension)';
update exercises set hold_seconds = 20 where track = 'rehab' and phase = 'rehab_activation' and name = 'Single-Leg Stance';
update exercises set hold_seconds = 30 where track = 'rehab' and phase = 'rehab_strength' and name = 'Single-Leg Balance (Unstable Surface)';
update exercises set hold_seconds = 30 where track = 'rehab' and phase = 'rehab_strength' and name = 'Seated Hamstring Stretch';
