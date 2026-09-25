-- Supports multiple completed rounds per day (exercises are often prescribed
-- 2-3x daily). completed_at marks a round as finished; the app resumes the
-- latest not-yet-completed session for today instead of reusing whichever
-- session already exists, and starts a fresh row once the current one is
-- marked complete.

alter table sessions add column if not exists completed_at timestamptz;
