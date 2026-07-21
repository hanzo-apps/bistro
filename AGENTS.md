# Agent guide

Canonical instructions for this repo live in [`LLM.md`](./LLM.md) (and its
`CLAUDE.md` symlink). Read it before changing anything.

TL;DR: Ember — a warm restaurant site (home · menu · reservations) on Vite +
React 19 + `@hanzo/gui` + `@hanzo/iam` + `@hanzo/base`. Keep it real. `@hanzo/gui`
needs the react-native-web alias + Tamagui defines in `vite.config.ts`, uses
Tamagui LONGHAND props (tsc enforces this), and its `Button` takes no text
`color` — route buttons through `src/ui.tsx` `Btn`. `schema.sql`
(`menu_items` + `reservations`) is the Base data contract. Prove changes with
`npm run build` (tsc + vite). Never build a container image locally — Hanzo
Cloud owns deploys.
