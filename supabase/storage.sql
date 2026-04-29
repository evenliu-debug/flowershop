-- Storage bucket for product images — run in SQL Editor after creating bucket in UI
-- Dashboard → Storage → New bucket → name: product-images → Public bucket ✓

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone can read images
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Authenticated admins upload (path prefix enforced in app)
create policy "Admins upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );
