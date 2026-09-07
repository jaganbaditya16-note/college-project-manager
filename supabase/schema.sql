create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'student' check (role in ('student','faculty','admin')),
  college text,
  department text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  code text not null,
  type text not null default 'Major Project',
  description text,
  status text not null default 'Planning' check (status in ('Planning','On track','At risk','Completed')),
  progress integer not null default 0 check (progress between 0 and 100),
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique(project_id,user_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  assignee_id uuid references auth.users(id) on delete set null,
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  due_date date,
  status text not null default 'Planned' check (status in ('Planned','Active','Done')),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  file_path text,
  mime_type text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.viva_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  score integer check (score between 0 and 100),
  transcript jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists project_members_project_idx on public.project_members(project_id);
create index if not exists project_members_user_idx on public.project_members(user_id);
create index if not exists tasks_project_idx on public.tasks(project_id);
create index if not exists tasks_assignee_idx on public.tasks(assignee_id);
create index if not exists milestones_project_idx on public.milestones(project_id);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.tasks enable row level security;
alter table public.milestones enable row level security;
alter table public.documents enable row level security;
alter table public.viva_sessions enable row level security;

create or replace function public.is_project_member(target_project uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.project_members pm where pm.project_id = target_project and pm.user_id = auth.uid())
  or exists(select 1 from public.projects p where p.id = target_project and p.owner_id = auth.uid());
$$;

create policy "profiles own read" on public.profiles for select using (auth.uid()=id);
create policy "profiles own update" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
create policy "projects members read" on public.projects for select using (auth.uid()=owner_id or public.is_project_member(id));
create policy "projects owner insert" on public.projects for insert with check (auth.uid()=owner_id);
create policy "projects owner update" on public.projects for update using (auth.uid()=owner_id) with check (auth.uid()=owner_id);
create policy "projects owner delete" on public.projects for delete using (auth.uid()=owner_id);
create policy "members project read" on public.project_members for select using (public.is_project_member(project_id));
create policy "owner manages members" on public.project_members for all using (exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid())) with check (exists(select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid()));
create policy "tasks members read" on public.tasks for select using (public.is_project_member(project_id));
create policy "tasks members write" on public.tasks for insert with check (public.is_project_member(project_id));
create policy "tasks members update" on public.tasks for update using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "tasks owner delete" on public.tasks for delete using (public.is_project_member(project_id));
create policy "milestones members read" on public.milestones for select using (public.is_project_member(project_id));
create policy "milestones members write" on public.milestones for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "documents members read" on public.documents for select using (public.is_project_member(project_id));
create policy "documents members write" on public.documents for all using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));
create policy "viva own read" on public.viva_sessions for select using (auth.uid()=user_id);
create policy "viva own write" on public.viva_sessions for insert with check (auth.uid()=user_id);

-- Optional profile bootstrap trigger.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name','Student')) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
