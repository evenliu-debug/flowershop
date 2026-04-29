-- Required GRANTs so Supabase roles can SELECT/WRITE even when RLS is enabled.
-- Run this after `schema.sql` (or instead of re-running everything).

-- Catalog readable by anonymous users
grant usage on schema public to anon;
grant select on table
  public.categories,
  public.products,
  public.product_images,
  public.product_variants
to anon;

-- Authenticated users also need catalog read access
grant usage on schema public to authenticated;
grant select on table
  public.categories,
  public.products,
  public.product_images,
  public.product_variants
to authenticated;

-- Users can manage their own profile + orders (RLS will restrict row access)
grant select, insert, update on public.user_profiles to authenticated;
grant select, insert, update on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;

-- Admin UI uses authenticated role and relies on RLS policies
grant select, insert, update, delete on
  public.categories,
  public.products,
  public.product_images,
  public.product_variants
to authenticated;

