# bistro-site — agent notes

Ember — a warm restaurant website (home · menu · reservations) built on the
canonical Hanzo app stack: Vite + React 19 + `@hanzo/gui` (UI) + `@hanzo/iam`
(auth) + `@hanzo/base` (data). A distinct, real app forked from `hanzo-starter`;
the provider stack, `vite.config.ts`, auth, and deploy contract are unchanged —
only the views, schema, and palette differ. Keep it REAL — every surface builds
and runs, no fabricated UI.

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical order every Hanzo
  surface ships: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam is what makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user.
- **The site is public** (`src/app.tsx`) — anyone browses home · menu ·
  reservations (a `useState` view value, no router). Signing in with Hanzo
  unlocks the org-scoped Base surfaces: publishing the live menu and reading
  reservation requests.
- **Env is one place** (`src/env.ts`), read from `import.meta.env.VITE_*`.
- **Palette is one place** (`src/theme.ts`) — the ember-and-cream identity,
  painted directly via `backgroundColor`/`color`/`LinearGradient` (raw color
  strings) so the look is independent of the gui base theme.
- **UI is one system** — `@hanzo/gui` primitives only (no second kit, no
  Tailwind). One button wrapper (`src/ui.tsx` `Btn`) forwards frame props to
  `Button` and renders the label as a colored `SizableText` child.

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line; the in-browser builder runtime can't do this, which is the whole
  reason this ships as a real repo): (1) alias `react-native` →
  `react-native-web`, (2) `define` `process.env.TAMAGUI_TARGET` / `NODE_ENV` /
  `__DEV__`, (3) `dedupe` react/react-dom/react-native-web. No Tamagui compiler,
  no `one`, no Expo — the optimizer is a perf pass, not a correctness one.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`alignSelf`/
  `borderRadius`/`textAlign` — NOT the `items`/`justify`/`bg`/`p`/`self`/
  `rounded`/`text` shorthands. Shorthands pass at runtime but FAIL `tsc`.
- **`Button` is a Stack** — it takes background/border/hover props but NOT text
  `color`/`fontWeight` (those are text props). Route every button through
  `Btn` (`src/ui.tsx`), which puts the label in a `SizableText`. `Button` uses
  `onPress`; `Input` uses `value`/`onChangeText`.
- **PKCE storage is `localStorage`** (not sessionStorage) so the verifier/state
  survive the round-trip to hanzo.id.
- **`schema.sql` is the data contract.** It is the `databaseSchema` DDL the
  deploy translates into Base collections (`provisionBaseFromDDL`). Keep it in
  lockstep with `src/views/menu.tsx` (`menu_items`) and
  `src/views/reservations.tsx` (`reservations`).

## Data model (`schema.sql`)

- `menu_items(section, name, price, desc)` — the dining carte, grouped by
  `section`. The Menu view reads it; a signed-in owner publishes dishes. Until
  the collection has rows, the view shows the house menu as its empty state.
- `reservations(name, party, when)` — reservation requests. The form writes a
  row (sending requires sign-in — the row is stamped to the caller's org);
  signed-in, the view lists your requests.
- Both are org-scoped: Base stamps `owner`+`org` and every rule is
  `@request.auth.org_id = org`, so a teammate in your org sees the row and other
  orgs cannot.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from
  object storage (the `*.hanzo.app` published-sites edge). No server process.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the collections
  (org-scoped, IAM-native). Runtime read/write is browser → `VITE_HANZO_BASE_URL`
  with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_HANZO_CLIENT_ID`, default `hanzo-app`) must allow this origin's
  `/auth/callback`. Production needs a `https://*.hanzo.app/auth/callback`
  wildcard on the shared client (or a per-app `hanzo-bistro-site` client).

## Proven

`tsc --noEmit` clean · `vite build` → `dist/` · renders under Vite with zero
console errors · `login()` performs a real PKCE S256 redirect to hanzo.id.

## Build

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run typecheck && npm run
build` — build-verification only, NEVER a container image (Hanzo Cloud owns
deploys; do not build images locally).
