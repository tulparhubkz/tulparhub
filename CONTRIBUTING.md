# Contributing to TulparHub

Welcome! This is the one doc to read before you start. It covers how to run the
project, how we work, where things live, and a **task board** you can pick from.

> TulparHub is a B2B/B2C marketplace for truck & heavy-equipment spare parts (and
> equipment rental) for Kazakhstan. **Next.js 14** (App Router, TypeScript) +
> **PostgreSQL/Drizzle** + **Auth.js**, in **Docker**, auto-deployed to **Render
> (EU)** from `main`. The storefront is **mobile-first**, modeled on autopiter.kz.

---

## 1. Local setup

You need **Docker Desktop**, **Node 20**, and **yarn**.

```bash
docker compose -f docker-compose.dev.yml up -d   # Postgres on localhost:5432
cp .env.example .env                             # DATABASE_URL is preset for dev
yarn install
yarn db:migrate                                  # create tables
yarn import-csv                                  # load the catalog (needs the vendor CSV)
yarn dev                                          # http://localhost:3000
```

- The **vendor CSV** is business data and is **gitignored** — ask the team for it,
  put it where `CSV_PATH` in `.env` points (default `./example_database.csv`).
- No Docker? You can point `DATABASE_URL` at a hosted Postgres (Neon) instead.
- Full infra details: [DEPLOY.md](DEPLOY.md). Stack overview: [README.md](README.md).

---

## 2. How we work (please read)

- **`main` is protected — no direct pushes.** Always: branch → open a PR → the
  `build` check must pass → merge. Merging `main` auto-deploys to Render.
- **Branches:** `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- **Commits:** small and focused, conventional style — `feat(catalog): add X`,
  `fix(cart): …`. One logical change per commit; one task per PR.
- **Package manager is yarn** (not npm). After changing dependencies run
  `yarn install` so `yarn.lock` stays in sync — CI uses `--frozen-lockfile` and
  will fail otherwise.
- **UI is mobile-first.** Verify your change at **375px** (Chrome DevTools device
  mode): no horizontal scroll, clean console. Then check desktop.
- Before pushing: `yarn build` should pass locally (CI runs the same).

---

## 3. Where things live

| Path | What |
|------|------|
| `app/` | Pages (App Router) + `app/api/*` route handlers + `app/actions.ts` (server actions) |
| `lib/db/schema.ts` | **Drizzle schema** — the single source of truth for tables |
| `lib/db/` | DB client (`index.ts`), migrations (`drizzle/`), migrate runner |
| `lib/services/` | Data-access layer (parts, leads, garage). **Routes call services, not the DB directly.** |
| `lib/data.ts` | Static reference data (brands, models, cities, systems, demo rental) |
| `lib/auth.ts` | Auth.js config (Google + email; inert until creds set) |
| `components/` | UI: `layout/`, `catalog/`, `ui/`, … — `components/catalog/ProductCard.tsx` is THE product card |
| `store/` | Zustand stores (cart, wishlist, garage) persisted to localStorage |
| `app/globals.css` | Global styles + design tokens (CSS variables, e.g. `--accent`, `--bottom-nav-h`) |

---

## 4. Gotchas (read before your first PR)

- **DB-backed GET API routes must `export const dynamic = 'force-dynamic'`.**
  Otherwise Next prerenders them at build time (no DB then) and the build fails.
  Example: `app/api/part-brands/route.ts`.
- **Don't hand-edit dependency versions** in `package.json` — use `yarn add` /
  `yarn install` so the lockfile matches.
- **Page-scoped CSS:** use `<style jsx>` (scoped to the component), not a raw
  `<style>` (which leaks globally). Example: `app/catalog/[id]/page.tsx`.
- The DB client is import-safe — `yarn build` works without a `DATABASE_URL`.

---

## 5. Recipes

- **New page** → `app/<route>/page.tsx`.
- **New API route that reads the DB** → add a function in `lib/services/<x>.ts`,
  call it from `app/api/<x>/route.ts`, and add `export const dynamic = 'force-dynamic'`.
- **New table/column** → edit `lib/db/schema.ts`, then `yarn db:generate` and
  `yarn db:migrate`.

---

## 6. Task board

Pick a task, claim it (comment here or — preferred — open a GitHub Issue from it),
branch, and open a PR. Sizes: **S** ≈ hours, **M** ≈ a day or two, **L** ≈ multi-PR.

### 🟢 Good first issues
- **Fix the logo image warning.** The console warns that `logo.png` `<Image>` has
  width/height modified but not both. Add `style={{ height: 'auto' }}` (or width
  auto) where the logo renders. Files: `components/layout/Header.tsx`,
  `components/layout/Footer.tsx`. _Done when:_ warning gone. **S**
- **Drop mock cities.** `lib/data.ts` still contains non-KZ demo cities (e.g.
  Ташкент, Москва) that can leak into the UI. Make the city list KZ-only and
  consistent with the warehouse cities used by the importer. **S**
- **Loading skeletons.** Replace the plain "Загрузка…" text on the catalog and
  product pages with simple skeleton cards. **S**
- **Language switcher.** RU/KZ/EN toggle exists but does nothing. Either hide
  KZ/EN until translations exist, or scaffold basic i18n. **S–M**

### 🟡 Features
- **Orders → DB (high value).** Checkout currently writes a `lead` (kind=`order`).
  Persist real orders to the existing `orders` / `order_items` tables (see
  `lib/db/schema.ts`) with `status` + `payment_status`; keep `leads` for
  callbacks/quotes. Add `lib/services/orders.ts`, call it from `app/actions.ts`,
  surface the real invoice on `app/order-success`. _Done when:_ checkout creates
  an order row and the success page reflects it. **M**
- **Admin panel `/admin`** (gate by `users.role === 'admin'`). Start with an
  orders list + change-status; later: manual stock override, a "Sync now" button
  (runs the importer), and a `sync_runs` log view. Split into sub-PRs. **L**
- **Garage → DB.** Once auth is active, wire `/api/garage` (already built) to the
  signed-in user and migrate the Zustand/localStorage garage to it. **M** _(needs auth)_

### 🔵 Infra / ops
- **Activate auth.** Add `AUTH_GOOGLE_ID/SECRET` + `EMAIL_SERVER`/`EMAIL_FROM` to
  the Render env and test Google + email login (providers are wired but inert).
  **S** _(needs credentials)_
- **Add a test setup.** Introduce Vitest + a couple of service tests (e.g.
  `listParts` filters in `lib/services/parts.ts`). **M**
- **Uninstall the Vercel GitHub App** to stop the PR bot comments (org-owner
  action, not code). **XS**

### ⚪ Blocked / later (need data or decisions)
- **Payments** (Freedom Pay / Halyk ePay) — after orders exist; needs a provider account.
- **Multi-seller offers engine** — article/VIN search → an offers list grouped by
  OEM (price/delivery/seller per row, like Autopiter). Needs multi-vendor data +
  TecDoc-style cross-references.
- **Real part photos** — most parts show a category placeholder image.

---

## 7. Tips
- Keep PRs small; it's fine to ship a slice. Ask questions in the PR description.
- If a task here is meaty, consider splitting it and opening GitHub Issues so work
  is visible and claimable.
