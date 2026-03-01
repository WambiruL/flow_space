-- FlowSpace Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor

-- Enable RLS
-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text default '',
  category text check (category in ('Creative', 'Career', 'Learning', 'Personal')) default 'Creative',
  deadline date,
  status text check (status in ('Active', 'Paused', 'Completed')) default 'Active',
  progress integer default 0 check (progress >= 0 and progress <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Users can only see their own projects"
  on projects for all using (auth.uid() = user_id);

-- ============================================================
-- TASKS
-- ============================================================
create table if not exists tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  priority text check (priority in ('Low', 'Medium', 'High')) default 'Medium',
  energy_cost integer check (energy_cost >= 1 and energy_cost <= 5) default 3,
  due_date date,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can only see their own tasks"
  on tasks for all using (auth.uid() = user_id);

-- ============================================================
-- REFLECTIONS (Inner Council)
-- ============================================================
create table if not exists reflections (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  dilemma text not null,
  ambition_prompt text default '',
  ambition_response text default '',
  fear_prompt text default '',
  fear_response text default '',
  stoic_prompt text default '',
  stoic_response text default '',
  relationships_prompt text default '',
  relationships_response text default '',
  creative_prompt text default '',
  creative_response text default '',
  created_at timestamptz default now()
);

alter table reflections enable row level security;

create policy "Users can only see their own reflections"
  on reflections for all using (auth.uid() = user_id);

-- ============================================================
-- MOOD ENTRIES
-- ============================================================
create table if not exists mood_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  mood integer check (mood >= 1 and mood <= 5) not null,
  focus integer check (focus >= 1 and focus <= 5) not null,
  energy integer check (energy >= 1 and energy <= 5) not null,
  journal text default '',
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table mood_entries enable row level security;

create policy "Users can only see their own mood entries"
  on mood_entries for all using (auth.uid() = user_id);

-- ============================================================
-- BRAIN DUMP / IDEAS
-- ============================================================
create table if not exists brain_dump (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  tags text[] default '{}',
  converted_to text check (converted_to in ('task', 'project') or converted_to is null),
  converted_id uuid,
  created_at timestamptz default now()
);

alter table brain_dump enable row level security;

create policy "Users can only see their own brain dump entries"
  on brain_dump for all using (auth.uid() = user_id);

-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists tasks_user_id_idx on tasks(user_id);
create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists tasks_due_date_idx on tasks(due_date);
create index if not exists mood_entries_user_date_idx on mood_entries(user_id, date desc);
create index if not exists brain_dump_user_id_idx on brain_dump(user_id);
create index if not exists reflections_user_id_idx on reflections(user_id);

-- ============================================================
-- SEED DATA (Demo user must be created first via auth)
-- ============================================================
-- Run after creating a demo account. Replace 'YOUR_USER_ID' with actual user UUID.

/*
INSERT INTO projects (user_id, title, description, category, deadline, status, progress)
VALUES
  ('YOUR_USER_ID', 'Personal Brand Site', 'Design and develop my portfolio website showcasing creative work', 'Creative', '2024-03-31', 'Active', 35),
  ('YOUR_USER_ID', 'Senior Dev Job Search', 'Apply to senior roles at design-forward tech companies', 'Career', '2024-04-15', 'Active', 60),
  ('YOUR_USER_ID', 'Learn Rust', 'Work through The Book and build a CLI tool', 'Learning', NULL, 'Paused', 20),
  ('YOUR_USER_ID', 'Morning Routine Reset', 'Redesign daily habits for clarity and energy', 'Personal', NULL, 'Active', 80);

INSERT INTO tasks (user_id, project_id, title, priority, energy_cost, due_date, completed)
SELECT 
  'YOUR_USER_ID',
  id,
  'Write case study for main project',
  'High',
  4,
  CURRENT_DATE + 3,
  false
FROM projects WHERE title = 'Personal Brand Site' AND user_id = 'YOUR_USER_ID';
*/
