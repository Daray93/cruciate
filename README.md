# Cruciate

Mobile-first pre/post-operative ACL prehab and rehab tracking app.

## Stack

- React + TypeScript + Vite
- Plain CSS with design tokens (no styled-components, no Tailwind)
- Supabase (Postgres) for backend/auth

## Setup

1. Install dependencies: `npm install`
2. Create a Supabase project at [supabase.com](https://supabase.com).
3. In the Supabase SQL editor, run [supabase/schema.sql](supabase/schema.sql) to create the `sessions`, `exercises_logged`, `rom_readings`, and `clearance` tables with RLS policies.
4. Copy `.env.local.example` to `.env.local` and fill in your project's URL and anon key (Project Settings → API).
5. `npm run dev`

The Supabase client is initialized in [src/lib/supabase.ts](src/lib/supabase.ts); table types live in [src/lib/database.types.ts](src/lib/database.types.ts).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build
