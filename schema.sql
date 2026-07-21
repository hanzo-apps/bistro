-- Hanzo Base schema for Bistro Site (the `databaseSchema` DDL).
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- `id`/`created`/`updated`/`owner`/`org` itself, so they are never re-declared
-- here; every row is stamped with the verified IAM `owner`+`org` and is
-- org-scoped. The list/view/create/update/delete rules are all
--   @request.auth.org_id = org
-- so a member of your org reads/writes the row and other orgs cannot see it.
--
-- Keep this file in lockstep with what the app reads/writes
-- (src/views/menu.tsx, src/views/reservations.tsx).

-- The dining menu, grouped by `section` (Starters / Wood-Fired / Sweets …).
CREATE TABLE IF NOT EXISTS menu_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  desc TEXT
);

-- Reservation requests: who, party size, and the requested sitting.
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  party INTEGER NOT NULL,
  when TEXT NOT NULL
);
