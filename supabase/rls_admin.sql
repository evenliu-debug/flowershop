-- Run after schema.sql — admin policies for authenticated admin users

create policy "Admins manage categories"
  on public.categories for all using (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  ) with check (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins manage products"
  on public.products for all using (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  ) with check (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins manage product_images"
  on public.product_images for all using (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  ) with check (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins manage product_variants"
  on public.product_variants for all using (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  ) with check (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins read all orders"
  on public.orders for select using (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins update orders"
  on public.orders for update using (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );

create policy "Admins read all order_items"
  on public.order_items for select using (
    exists (select 1 from public.user_profiles up where up.id = auth.uid() and up.role = 'admin')
  );
