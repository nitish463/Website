# Home Weavers — storefront + admin (prototype)

A complete single-file home-textile storefront with a built-in admin back office:
storefront, product collections with color/size variations (SKUs), cart with promo
codes and a free-shipping rule, editable categories, footer content pages, and a
multi-slide hero banner.

Everything lives in **one file: `index.html`**. There is no build step and there are
no dependencies to install.

---

## Run it

### Option A — just open it
Double-click `index.html`, or drag it into a browser tab. It works straight from
`file://` because there are no modules or fetch calls.

### Option B — run a local server (recommended)
From inside this folder:

**Node — included server (zero dependencies, no install):**
```bash
node server.js
```
or
```bash
npm start
```
then open http://localhost:8000  (change port with `PORT=3000 node server.js`)

**Python 3** (already on most Macs/Linux):
```bash
python3 -m http.server 8000
```
then open http://localhost:8000

**Node.js** (no install needed if you have npx):
```bash
npx serve .
```
or
```bash
npx http-server -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

Any static file server works — point it at this folder and open the printed URL.

---

## Using the admin

- Click the **gear icon** in the header, or go to **/#/admin**.
- Password: **`weave`**  (change it in the code — see below).

From the admin you can edit: storefront name/announcement, the **hero slideshow**
(add/reorder/remove slides), **categories & subcategories**, **products** (including
collections with color + size variants and per-SKU pricing/stock/photos),
**promotions** (discount codes + free-shipping threshold), and **pages** (the
content pages linked in the footer).

---

## Where your data is stored

The app saves to your browser automatically. When self-hosted it uses
**localStorage**, so your edits persist across reloads **on that browser/profile**.

- Data is per-browser, not shared between devices or visitors.
- Clearing site data / using a different browser starts fresh from the sample catalog.
- The admin Dashboard has **Reset to sample data** to restore the original demo content.

To wipe everything manually, open the browser console and run:
```js
localStorage.removeItem('hw:store:v1')
```

---

## Things you'll likely want to change

All in `index.html`:

- **Admin password:** search for `password:'weave'` (in `seedData()`), and the login
  check. Note this is **client-side only** — fine for a demo, not real security.
- **Sample catalog / copy:** edit `seedData()`.
- **Brand colors & fonts:** the CSS variables at the top of the `<style>` block
  (`--loom`, `--ink`, `--paper`, fonts Fraunces + Inter via Google Fonts).
- **Images:** product, category, and hero images are by **URL**. For a real site,
  host your own images rather than hotlinking.

---

## Honest limitations (it's a prototype)

- **No real checkout/payments.** Checkout is a demo that shows a confirmation toast.
- **Client-side only.** No server, no database, no user accounts. Promo-code
  validation and the admin password run in the browser, so they're visible in the
  page source.
- **Single browser.** Data isn't synced across devices or shoppers.

### Going to production
This file is an excellent visual + functional spec. Two common paths:
1. **Shopify** — its native product *variant* model maps almost one-to-one to the
   collections/SKUs here; discounts and shipping rules are built in.
2. **Custom headless** — e.g. Next.js + a headless commerce backend (Medusa,
   Shopify Hydrogen) + a CMS (Sanity) for the editable pages/banners.
