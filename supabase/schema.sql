-- Flowershop / Even Shop — Supabase schema
-- Run in Supabase SQL Editor before seed.sql

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Categories (bilingual)
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_zh text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products (bilingual)
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  name_en text not null,
  name_zh text not null,
  description_en text not null default '',
  description_zh text not null default '',
  is_active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product images (first image = primary for cards)
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_en text not null default '',
  alt_zh text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Variants / SKUs
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  size_label text,
  color_label text,
  price_usd numeric(12,2) not null check (price_usd >= 0),
  stock int not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- User profiles (extends auth.users)
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  shipping_line1 text,
  shipping_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal text,
  shipping_country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders
create type public.order_status as enum (
  'pending_confirmation',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  status public.order_status not null default 'pending_confirmation',
  currency text not null default 'usd',
  subtotal_usd numeric(12,2) not null default 0,
  shipping_usd numeric(12,2),
  tax_usd numeric(12,2),
  total_usd numeric(12,2) not null default 0,
  payment_provider text, -- 'stripe' | 'paypal' | null (manual)
  payment_intent_id text,
  paypal_order_id text,
  shipping_name text,
  shipping_line1 text,
  shipping_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_postal text,
  shipping_country text,
  contact_email text,
  contact_phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_price_usd numeric(12,2) not null,
  snapshot_name_en text not null,
  snapshot_name_zh text not null,
  snapshot_sku text not null,
  snapshot_size text,
  snapshot_color text
);

-- Updated_at triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger categories_updated before update on public.categories
  for each row execute function public.set_updated_at();

create trigger products_updated before update on public.products
  for each row execute function public.set_updated_at();

create trigger product_variants_updated before update on public.product_variants
  for each row execute function public.set_updated_at();

create trigger user_profiles_updated before update on public.user_profiles
  for each row execute function public.set_updated_at();

create trigger orders_updated before update on public.orders
  for each row execute function public.set_updated_at();

-- Profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.user_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public read for catalog
create policy "Categories are readable by everyone"
  on public.categories for select using (true);

create policy "Active products readable by everyone"
  on public.products for select using (is_active = true);

create policy "Images for active products readable"
  on public.product_images for select using (
    exists (select 1 from public.products p where p.id = product_id and p.is_active = true)
  );

create policy "Variants for active products readable"
  on public.product_variants for select using (
    exists (select 1 from public.products p where p.id = product_id and p.is_active = true)
  );

-- Profiles: users manage own
create policy "Users read own profile"
  on public.user_profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.user_profiles for update using (auth.uid() = id);

-- Orders: own rows
create policy "Users read own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users insert own orders"
  on public.orders for insert with check (auth.uid() = user_id);

create policy "Users read own order items"
  on public.order_items for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "Users insert order items for own order"
  on public.order_items for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

-- Storage bucket (create in Dashboard → Storage; name: product-images)
-- Policies applied via Dashboard or:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
