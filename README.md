# CampusFlow — College Project Manager

CampusFlow is a premium full-stack workspace for college project teams. It combines project planning, tasks, milestones, team ownership, documents and viva practice in one calm interface.

## Included

- Responsive premium dashboard with motion and micro-interactions
- Projects, tasks, timeline, team, documents and Viva Lab views
- Create-project flow with local state for immediate UX
- Supabase-ready database schema with Row Level Security policies
- Profile bootstrap trigger for Supabase Auth users
- Data-access helpers for projects and tasks
- Search and task completion interactions
- Clear separation of public frontend config and server-only secrets

## Stack

- React + Vite
- Supabase Postgres + Auth + Storage-ready schema
- Lucide icons
- CSS animations (no animation framework required)

## Local setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Enable Email/Password authentication or another Supabase Auth provider.
5. Add the frontend environment variables locally.

The schema uses RLS so students can only access projects they own or belong to. Do not put a Supabase service-role key in browser code.

## Product roadmap

### V1

- Supabase-backed auth
- Persist projects/tasks/milestones
- Team invites
- File uploads via Supabase Storage

### V1.5

- GitHub OAuth + repository activity
- Notifications and deadline reminders
- Faculty reviewer role

### V2

- AI Project Copilot
- AI document generation
- Mock viva scoring
- College / department analytics

## AI architecture note

AI calls should be made from a trusted backend or Supabase Edge Function. Keep provider API keys server-side and add rate limits before enabling public AI access.

## License

Private project / all rights reserved unless the repository owner adds a license.
