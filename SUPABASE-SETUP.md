# Making Home Weavers truly live (with Supabase)

This connects your site to a free database so your admin edits show up for
**every visitor, on any device** — no Shopify, your own site.

**Time:** ~15 minutes, one time. **Cost:** free tier is plenty to launch.

---

## Step 1 — Create a Supabase project
1. Go to **https://supabase.com** → **Start your project** → sign in (GitHub or email).
2. **New project** → give it a name (e.g. `home-weavers`), set a database password (save it somewhere), pick a region near your customers → **Create**.
3. Wait ~2 minutes for it to finish setting up.

## Step 2 — Create the database table
1. In your project: left sidebar → **SQL Editor** → **New query**.
2. Open **supabase-setup.sql** (in your site folder), copy **all** of it, paste into the editor.
3. Click **Run**. You should see "Success".

## Step 3 — Create your admin login
1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter **your email** and a **strong password**. Tick **Auto Confirm User**. → **Create user**.
3. This is the login you'll use to publish changes. (Visitors never log in.)

## Step 4 — Get your two keys
1. Left sidebar → **Project Settings** (gear) → **API**.
2. Copy the **Project URL** (looks like `https://abcd1234.supabase.co`).
3. Copy the **anon public** key (a long string starting `eyJ…`). This one is safe to be public.

## Step 5 — Connect your store
1. Open your site → **Admin** (`weave`) → **Dashboard** → **Backend & sync**.
2. Paste the **Project URL** and **anon key** → **Save connection** (the page reloads).
3. In the same panel, enter the **admin email + password** from Step 3 → **Sign in to publish**.
4. Click **Check status** — it should say you're signed in and publishing live. 🎉

## Step 6 — Publish it for visitors (important)
For the **live GitHub site** to talk to the database, the two keys must be in the
file you push. Two ways:

- **Easy:** after Step 5, they're saved in your browser — good for *your* testing.
  To make the **public** site load from the database, open `index.html`, find the
  line near the top:
  ```js
  const SB_CONFIG={url:'',anonKey:''};
  ```
  put your values in:
  ```js
  const SB_CONFIG={url:'https://abcd1234.supabase.co',anonKey:'eyJ…'};
  ```
  save, then `git add index.html && git commit -m "connect backend" && git push`.
- Now every visitor's browser loads your live catalog from the database.

---

## How it works (plain English)
- **Visitors** read your store from the database (no login needed).
- **You** sign in once to publish; your edits save to the database and everyone sees them.
- The **anon key is public on purpose** — the database is protected by rules (RLS) so
  only your signed-in admin account can change anything. Visitors can only read.

## Good to know
- **One editor at a time.** The whole store saves as one record, so if two people edit
  on two devices at once, the last save wins. Fine for a solo owner.
- **Free tier limits** are generous for launch; you can upgrade later if you grow.
- **Keep exporting backups** (Dashboard → Export) now and then, just in case.
- If the site can't reach the database, it safely falls back to this-browser mode so it
  never goes blank.
