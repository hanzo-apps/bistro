# Bistro Site — Ember

A warm restaurant website — **home**, **menu**, and **reservations** — for a
wood-fired neighborhood kitchen. A real, buildable app you fork on
[hanzo.app](https://hanzo.app) and deploy live on Hanzo Cloud.

- **UI** — [`@hanzo/gui`](https://www.npmjs.com/package/@hanzo/gui) (the Hanzo
  design system) under Vite + React 19. Warm editorial dining: ember-and-cream
  palette, serif headings, wood-fire motif — 100% gui primitives, no Tailwind.
- **Auth** — [`@hanzo/iam`](https://www.npmjs.com/package/@hanzo/iam), OAuth2
  **PKCE** against [hanzo.id](https://hanzo.id). No local passwords — IAM owns
  every credential interaction. The site is public; signing in unlocks the
  org-scoped Base surfaces.
- **Data** — [`@hanzo/base`](https://www.npmjs.com/package/@hanzo/base), the
  IAM-native, org-scoped data plane. The dining menu and reservation requests
  are real Base collections.

The concept, small but complete: browse the room and the menu, then send a
reservation request that persists per-org in Base. Sign in and the kitchen can
publish its live carte.

## Stack (pinned)

| Package | Version |
| --- | --- |
| `react` / `react-dom` | `^19.2.4` |
| `@hanzo/gui` + `@hanzogui/config` | `7.3.0` |
| `@hanzo/iam` | `^0.13.1` |
| `@hanzo/base` | `^0.2.1` |
| `vite` | `^6` (`@vitejs/plugin-react`) |
| `react-native-web` | `^0.21.0` |
| `typescript` | `5.9.3` |

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build  ->  dist/
npm run preview    # serve the production build (SPA fallback on)
```

Out of the box it runs against **live** Hanzo (hanzo.id + api.hanzo.ai) — no
config needed to browse the site and see the sign-in flow. Copy `.env.example`
to `.env` to point at a different environment.

## The three views

| View | What it is |
| --- | --- |
| **Home** | The editorial landing — hero, the room's story, hours, and this week's plates from the hearth. Public. |
| **Menu** | The dining carte, read from the `menu_items` Base collection and grouped by section. Signed-in owners publish dishes; until then the house menu stands in. |
| **Reservations** | A reservation request form that writes to the `reservations` Base collection (sign-in required to send); signed-in, it lists your requests. |

## Environment contract

Only `VITE_`-prefixed vars reach the browser (this is a static SPA — there is no
server). Defaults in parentheses.

| Var | Purpose |
| --- | --- |
| `VITE_HANZO_IAM_URL` (`https://hanzo.id`) | OIDC issuer. |
| `VITE_HANZO_CLIENT_ID` (`hanzo-app`) | IAM application (`<org>-<app>`). Its redirect-URI list must allow this deploy's `/auth/callback` — see **Ambient IAM**. |
| `VITE_HANZO_REDIRECT_URI` (`${origin}/auth/callback`) | PKCE redirect. |
| `VITE_HANZO_BASE_URL` (`https://api.hanzo.ai`) | Browser-reachable Hanzo Base data plane. Deploy injects the provisioned URL. |

## How auth works — ambient IAM

`login()` starts an OAuth2 **PKCE S256** redirect to hanzo.id; hanzo.id returns
to `/auth/callback`, where `handleCallback()` exchanges the code for tokens
(stored in `localStorage`, refresh-aware via `offline_access`). Every deployed
app is a static site at `<slug>.hanzo.app`; there is **no server token** — the
SPA authenticates the user in the browser and carries the resulting IAM JWT to
Base.

The one deploy requirement: the IAM client (`VITE_HANZO_CLIENT_ID`) must list
this origin's `/auth/callback` as an allowed redirect URI. Register a
`https://*.hanzo.app/auth/callback` wildcard on the shared client so every
forked app works, or register a dedicated `hanzo-bistro-site` client.

## How data works — Base from `schema.sql`

[`schema.sql`](./schema.sql) is the app's `databaseSchema` (SQL DDL). On publish,
Hanzo Cloud translates each `CREATE TABLE` into a Hanzo Base collection
(`provisionBaseFromDDL`, additive + idempotent). Base manages
`id`/`created`/`updated`/`owner`/`org`, stamps `owner`+`org` from the verified
IAM principal, and scopes every row with `@request.auth.org_id = org` — a
teammate in your org sees the row; other orgs cannot.

- `menu_items(section, name, price, desc)` → the Menu view (`src/views/menu.tsx`).
- `reservations(name, party, when)` → the Reservations view (`src/views/reservations.tsx`).

## Deploy — Hanzo Cloud

[`hanzo.yml`](./hanzo.yml) declares a static build (`npm run build` → `dist/`,
served at `<slug>.hanzo.app`) plus the Base schema to provision and the env to
inject. Do **not** build a container image locally — Hanzo Cloud owns builds and
deploys. CI here only proves the template compiles green.

## Layout

```
src/
  main.tsx          entry
  providers.tsx     GuiProvider -> IamProvider -> BaseProvider(client=IAM-token)
  app.tsx           public shell — masthead nav + footer + /auth/callback route
  theme.ts          the ember-and-cream palette, one place
  ui.tsx            Btn — one button (label as a colored SizableText child)
  icons.tsx         the wood-fire mark (inline SVG)
  gui.config.ts     createGui(defaultConfig from @hanzogui/config/v5)
  iam.config.ts     IAM PKCE config
  env.ts            the VITE_ env contract, one place
  lib/base.ts       BaseClient carrying the IAM bearer token
  auth/callback.tsx PKCE return leg
  views/            home (editorial) · menu (menu_items) · reservations (reservations)
schema.sql          databaseSchema -> Base collections on publish
hanzo.yml           Hanzo Cloud build/deploy manifest
```

## Note on content

The house menu, hours, and "on the corner of Vine & Ash" are sample template
copy — swap them for the real place. There are no fabricated reviews or metrics;
what the app claims to do (auth, read/write Base) it really does.
