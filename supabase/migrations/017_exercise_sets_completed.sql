-- Tracks progress within an exercise's sets (e.g. "done 2 of 3"), not just a
-- final done/not-done flag, so a round can be logged incrementally as sets
-- are actually completed. `done` stays in sync as a derived summary
-- (sets_completed >= the exercise's set count) so existing done-based logic
-- (completed counts, "mark all done") keeps working unchanged.

alter table exercises_logged add column if not exists sets_completed integer not null default 0;
