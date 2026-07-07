# Supabase Setup for CarbonZ

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Organization**: Your org (or create one)
   - **Project name**: `carbonz-db`
   - **Database password**: Generate a strong password (save it!)
   - **Region**: West Europe (closest to Spain)
4. Click **"Create new project"** (takes ~2 minutes)

### 2. Run the SQL Migration
1. In the Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open `supabase/migrations/001_init.sql` and copy the entire contents
4. Paste into the SQL Editor
5. Click **"Run"** (or press Cmd+Enter)
6. You should see "Success. No rows returned"

### 3. Get Your API Keys
1. Go to **Project Settings** (gear icon, bottom left)
2. Click **"API"** in the left menu
3. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Service Role Key** (long JWT string, under "service_role")

### 4. Update Environment Variables
1. Open `.env.local` in the project root
2. Replace the placeholder values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 5. Deploy
```bash
cd tienda
npm run build
vercel --prod --yes
```

### 6. Set Vercel Environment Variables
Go to your Vercel project dashboard → Settings → Environment Variables and add:
- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` = your service role key

Then redeploy.

---

## Verify It Works
1. Visit `https://carbonz.vercel.app/admin/login`
2. Login with `admin@carbonz.com` / `carbonz2026`
3. The admin panel should show (empty) orders
4. Place a test order via Stripe → it should appear in Supabase

---

## Migrating Existing Data (if any)
If you have existing orders in the old SQLite database, export them first:

```bash
# On the Vercel server or local dev
sqlite3 carbonz.db ".dump orders" > orders_dump.sql
```

Then adapt and run in Supabase SQL Editor (converting SQLite syntax to PostgreSQL).

---

## Troubleshooting
- **"Invalid API key"**: Check that `SUPABASE_SERVICE_ROLE_KEY` is the service_role key, not the anon key
- **"relation does not exist"**: Run the migration SQL again
- **CORS errors**: Make sure you're using the server-side client (service role), not the browser client
