create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

create table public.scholarships (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) between 3 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text not null check (char_length(trim(summary)) between 10 and 500),
  description text not null check (char_length(trim(description)) >= 10),
  country text not null check (char_length(trim(country)) between 2 and 100),
  university text,
  degree_level text,
  field_of_study text,
  funding_type text,
  deadline date,
  application_url text check (
    application_url is null or application_url ~ '^https://[^[:space:]]+$'
  ),
  image_url text check (
    image_url is null or image_url ~ '^https://[^[:space:]]+$'
  ),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'closed')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index scholarships_status_created_at_idx
  on public.scholarships (status, created_at desc);
create index scholarships_country_idx
  on public.scholarships (country);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger scholarships_set_updated_at
  before update on public.scholarships
  for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.scholarships enable row level security;

grant usage on schema public to anon, authenticated;
revoke all on public.admin_profiles from anon, authenticated;
revoke all on public.scholarships from anon, authenticated;
grant select on public.admin_profiles to authenticated;
grant select on public.scholarships to anon, authenticated;
grant insert, update, delete on public.scholarships to authenticated;

create policy "Admins can read their own profile"
  on public.admin_profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Public can read published scholarships"
  on public.scholarships for select to anon, authenticated
  using (status = 'published');

create policy "Admins can read all scholarships"
  on public.scholarships for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can insert scholarships"
  on public.scholarships for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update scholarships"
  on public.scholarships for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete scholarships"
  on public.scholarships for delete to authenticated
  using ((select public.is_admin()));
