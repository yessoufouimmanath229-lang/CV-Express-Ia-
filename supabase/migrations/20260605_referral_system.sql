-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  referral_code text unique,
  referred_by uuid references auth.users,
  is_premium boolean default false,
  credits integer default 0,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- Function to generate a random referral code
create or replace function generate_referral_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer;
begin
  for i in 1..8 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  return result;
end;
$$;

-- Trigger to create a profile and generate referral code on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, referral_code)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', generate_referral_code());
  return new;
end;
$$;

-- Trigger for rewarding referrer
create or replace function public.handle_referral()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  referrer_id uuid;
begin
  -- Check if a referral code was provided in user metadata
  if new.raw_user_meta_data->>'referral_code' is not null then
    -- Find the referrer
    select id into referrer_id from public.profiles where referral_code = new.raw_user_meta_data->>'referral_code';
    
    if referrer_id is not null then
      -- Update the new user's profile with referred_by
      update public.profiles set referred_by = referrer_id where id = new.id;
      
      -- Reward the referrer with 1 credit
      update public.profiles set credits = credits + 1 where id = referrer_id;
    end if;
  end if;
  return new;
end;
$$;

-- Re-create the signup trigger to include referral handling
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger for referral (can be combined or separate)
-- We use a separate trigger that runs after handle_new_user to make sure the profile exists
create trigger on_auth_user_created_referral
  after insert on auth.users
  for each row execute procedure public.handle_referral();
