# Deploy Even Shop (Next.js → GitHub → Vercel)

This guide assumes repository: `https://github.com/evenliu-debug/flowershop.git` (rename locally if you keep the folder `even-shop`).

### If Supabase / Stripe / PayPal are not created yet

That is normal — create them when you are ready to connect real services.

| Credential | When you need it | What works without it |
|------------|------------------|------------------------|
| **Supabase URL + anon key** | Before login, catalog from DB, cart checkout, admin | Put temporary placeholders in `.env.local` only so `npm run dev` / `npm run build` do not fail on missing env (see `.env.example`). The storefront still **cannot load products or authenticate** until you create a Supabase project and run the SQL in `supabase/`. |
| **Stripe secret (`STRIPE_SECRET_KEY`)** | Only when testing **Pay with card** on checkout | Browse shop, cart, and **PayPal path** (if PayPal is configured) still possible once Supabase works. Stripe checkout will error until this key exists. |
| **PayPal** (`NEXT_PUBLIC_PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_*` server) | Only when testing **PayPal** buttons after placing an order | Not required for Stripe-only tests or for browsing. |

Recommended order: **1)** Supabase project + SQL + bucket → **2)** Stripe test keys → **3)** PayPal sandbox app.

## 1. Local setup

```bash
npm install
cp .env.example .env.local
# Fill .env.local — see comments inside .env.example
npm run dev
```

Open `http://localhost:3000/en`.

## 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. SQL Editor → run scripts **in order**:
   - `supabase/schema.sql`
   - `supabase/rls_admin.sql`
   - Create bucket **product-images** (public). Then run `supabase/storage.sql`.
   - `supabase/seed.sql` (optional sample catalog).
3. Authentication → URL configuration:
   - Site URL: `http://localhost:3000` (and later your Vercel URL).
   - Redirect URLs: add `http://localhost:3000/auth/callback` and `https://<your-vercel-domain>/auth/callback`.
4. Copy **Project URL** and **anon key** into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### First admin user

After you register once via `/en/register`, promote yourself in SQL Editor:

```sql
update public.user_profiles
set role = 'admin'
where email = 'your@email.com';
```

## 3. Stripe (test)

1. [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API keys → **Secret key** (`sk_test_…`).
2. Put `STRIPE_SECRET_KEY` in `.env.local`.
3. Checkout uses **Stripe Checkout** (test cards in Stripe docs).

## 4. PayPal (sandbox)

1. [PayPal Developer](https://developer.paypal.com/) → create REST app (Sandbox).
2. Set `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_MODE=sandbox`, and `NEXT_PUBLIC_PAYPAL_CLIENT_ID` (same as REST client id for the JS SDK).
3. After internal order is created, the PayPal buttons call `/api/paypal/*` to create/capture the PayPal order.

## 5. GitHub

```bash
git init
git add .
git commit -m "Initial import: Even Shop"
git branch -M main
git remote add origin https://github.com/evenliu-debug/flowershop.git
git push -u origin main
```

If the remote already exists with history, use `git pull origin main --allow-unrelated-histories` before pushing, or force-push only if you intend to replace the remote.

## 6. Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Framework preset: **Next.js**.
3. Environment variables: paste **every** variable from `.env.example` (production values).
   - `NEXT_PUBLIC_APP_URL` must be your Vercel URL, e.g. `https://flowershop.vercel.app`.
4. Deploy.

## 7. Post-deploy checks

- Browse `/en` and `/zh`.
- Register, login, add to cart, checkout (Stripe test / PayPal sandbox).
- Admin: `/admin` — confirm dashboard and orders load after role `admin` is set.

## Troubleshooting

- **Middleware redirect loops**: ensure Supabase redirect URLs include `/auth/callback`.
- **Stripe success URL**: must match `NEXT_PUBLIC_APP_URL` origin.
- **Images**: upload via Admin → product → Images; bucket must exist and `storage.sql` policies applied.
