# Supabase SQL run order

1. `schema.sql` — tables, RLS for customers, triggers, signup profile.
2. `rls_admin.sql` — policies so `user_profiles.role = 'admin'` can manage catalog and orders.
3. Dashboard → **Storage** → create public bucket `product-images`.
4. `storage.sql` — bucket insert + storage policies.
5. `seed.sql` — optional bilingual demo data (run once; re-running images may duplicate unless cleared).

After signup, set your admin email:

```sql
update public.user_profiles set role = 'admin' where email = 'you@example.com';
```
