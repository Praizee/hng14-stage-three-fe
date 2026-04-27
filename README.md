# Habit Tracker PWA — HNG 14 Stage 3 FE Task

A mobile-first Progressive Web App for tracking daily habits and current streaks. Built strictly to the HNG 14 Stage 3 FE Task Technical Requirements Document: deterministic local persistence, exact route + UI contracts, exact test titles.

- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Vitest · React Testing Library · Playwright
- **Persistence:** `localStorage` only — no remote API, no external auth
- **Tests:** 24 vitest (unit + integration) + 10 Playwright e2e, all titles verbatim from the spec
- **Coverage:** 90.86% line coverage on `src/lib` (threshold: 80%)

---

## Setup

```bash
pnpm install
pnpm exec playwright install chromium   # one-time, for e2e
```

(Or `npm install` / `yarn install` — `package.json` scripts call `npm`.)

## Run

```bash
pnpm dev          # development server on http://localhost:3000
pnpm build        # production build
pnpm start        # production server
```

## Test

```bash
pnpm test:unit          # vitest unit suite (with coverage report)
pnpm test:integration   # vitest unit + integration suite
pnpm test:e2e           # Playwright e2e (auto-builds and serves the app)
pnpm test               # runs all three sequentially, per spec §18
```

The e2e webServer runs `next build && next start` so the service worker can cache stable production chunks for the offline test.

Coverage HTML lives in `coverage/index.html` after `pnpm test:unit`.

---

## Local persistence structure

The app uses three `localStorage` keys, defined in [`src/lib/constants.ts`](src/lib/constants.ts):

| Key                     | Shape             |
| ----------------------- | ----------------- |
| `habit-tracker-users`   | `User[]`          |
| `habit-tracker-session` | `Session \| null` |
| `habit-tracker-habits`  | `Habit[]`         |

Type contracts live in [`src/types/auth.ts`](src/types/auth.ts) and [`src/types/habit.ts`](src/types/habit.ts):

```ts
type User = { id; email; password; createdAt };
type Session = { userId; email };
type Habit = {
  id;
  userId;
  name;
  description;
  frequency: "daily";
  createdAt;
  completions: string[];
};
```

Reads/writes go through [`src/lib/storage.ts`](src/lib/storage.ts), which guards `typeof window` for SSR. Auth (`src/lib/auth.ts`) and habit CRUD (`src/lib/habits.ts`) layer on top.

---

## PWA support

- [`public/manifest.json`](public/manifest.json) — name, short_name, start_url, display, background/theme color, 192 + 512 icons.
- [`public/sw.js`](public/sw.js) — versioned cache `habit-tracker-v1`.
  - **install** precaches the app shell (`/`, `/login`, `/signup`, `/dashboard`, manifest, icons) and calls `skipWaiting`.
  - **activate** purges old cache versions and calls `clients.claim`.
  - **fetch** uses network-first for navigations (with cache fallback to `/`) and cache-first for static GETs.
- [`src/components/shared/ServiceWorkerRegistrar.tsx`](src/components/shared/ServiceWorkerRegistrar.tsx) registers `/sw.js` from the root layout on the client.
- Icons in [`public/icons/`](public/icons/) are generated solid-color placeholders. Swap them in for branded artwork without changing dimensions.

---

## Trade-offs and limitations

- **Plaintext passwords.** Per spec §3 ("front-end-focused; do not add a remote auth service"), users are stored in `localStorage` with their password as a plain string. This is appropriate for the local-only stage but is **not** acceptable for any deployment that touches a real server.
- **Splash duration is 1000 ms** — the midpoint of the spec's 800–2000 ms window. Adjust via `SPLASH_DURATION_MS` in [`src/lib/constants.ts`](src/lib/constants.ts).
- **Today's date** uses the device's local timezone. The streak helper (`calculateCurrentStreak`) accepts an optional `today` argument so tests can be deterministic; UI code passes the current local date.
- **Daily frequency only** — the `<select>` in `HabitForm` exposes only `daily` per spec §12. Adding other cadences would require expanding `Habit['frequency']` and the streak math.
- **Cross-tab sync** is not implemented; opening the app in two tabs will show stale state until a route change triggers a re-read.
- **Offline e2e** runs against a production build because Next.js 16 / Turbopack dev chunks have request-specific URLs the service worker cannot precache.

---

## Mapping: Technical Requirements → Implementation

### Routes (§4)

- [`src/app/page.tsx`](src/app/page.tsx) → `/` splash + redirect
- [`src/app/login/page.tsx`](src/app/login/page.tsx) → `/login`
- [`src/app/signup/page.tsx`](src/app/signup/page.tsx) → `/signup`
- [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx) → protected `/dashboard`

### Required utility contracts (§9)

- `getHabitSlug` → [`src/lib/slug.ts`](src/lib/slug.ts)
- `validateHabitName` → [`src/lib/validators.ts`](src/lib/validators.ts)
- `calculateCurrentStreak` → [`src/lib/streaks.ts`](src/lib/streaks.ts)
- `toggleHabitCompletion` → [`src/lib/habits.ts`](src/lib/habits.ts)

### UI test IDs (§10)

- Splash → [`src/components/shared/SplashScreen.tsx`](src/components/shared/SplashScreen.tsx)
- Auth forms → [`src/components/auth/LoginForm.tsx`](src/components/auth/LoginForm.tsx), [`SignupForm.tsx`](src/components/auth/SignupForm.tsx)
- Habit UI → [`src/components/habits/HabitForm.tsx`](src/components/habits/HabitForm.tsx), [`HabitList.tsx`](src/components/habits/HabitList.tsx), [`HabitCard.tsx`](src/components/habits/HabitCard.tsx)
- Logout button + dashboard container → [`src/app/dashboard/page.tsx`](src/app/dashboard/page.tsx)

---

## Test file → behavior map (§16)

### Unit — `tests/unit/`

| File                                                  | `describe`               | Verifies                                                             |
| ----------------------------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| [`slug.test.ts`](tests/unit/slug.test.ts)             | `getHabitSlug`           | basic lower/hyphen, trim + collapse spaces, strips non-alphanumerics |
| [`validators.test.ts`](tests/unit/validators.test.ts) | `validateHabitName`      | empty rejection, > 60 char rejection, trims valid input              |
| [`streaks.test.ts`](tests/unit/streaks.test.ts)       | `calculateCurrentStreak` | empty → 0, today missing → 0, consecutive run, dedupe, gap break     |
| [`habits.test.ts`](tests/unit/habits.test.ts)         | `toggleHabitCompletion`  | adds, removes, immutability, dedupe                                  |

### Integration — `tests/integration/`

| File                                                           | `describe`   | Verifies                                                                                                                                                   |
| -------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`auth-flow.test.tsx`](tests/integration/auth-flow.test.tsx)   | `auth flow`  | signup creates session, duplicate-email error, login stores session, invalid-credentials error — asserts on `localStorage` directly                        |
| [`habit-form.test.tsx`](tests/integration/habit-form.test.tsx) | `habit form` | name-required error, create + render, edit preserves `id`/`userId`/`createdAt`/`completions`, delete behind confirm, completion toggle updates streak text |

### E2E — `tests/e2e/`

| File                                   | `describe`          | Verifies                                                                                                                                                           |
| -------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`app.spec.ts`](tests/e2e/app.spec.ts) | `Habit Tracker app` | full route contract (splash, redirects, protection, signup→dashboard, scoped habits, create, complete + streak, reload persistence, logout, **offline app shell**) |

All test titles are written exactly as required in spec §16 — `pnpm test` will print them verbatim in console output.

