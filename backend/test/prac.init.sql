-- backend/test/prac.init.sql
-- Creates the database (if missing) and all tables.
-- Run as superuser, e.g.:
--   docker exec -i afisha-postgres psql -U afisha -d postgres < backend/test/prac.init.sql

-- Create the DB if it doesn't exist (works in psql via \gexec)
SELECT 'CREATE DATABASE afisha OWNER afisha'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'afisha')\gexec

-- Switch into it
\c afisha

-- Films -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS films (
  id           uuid PRIMARY KEY,
  rating       numeric(3,1) NOT NULL,
  director     text         NOT NULL,
  tags         text[]       NOT NULL DEFAULT '{}',
  image        text         NOT NULL,
  cover        text         NOT NULL,
  title        text         NOT NULL,
  about        text         NOT NULL,
  description  text         NOT NULL
);

-- Schedules ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS schedules (
  id       uuid PRIMARY KEY,
  daytime  timestamptz NOT NULL,
  hall     integer     NOT NULL,
  rows     integer     NOT NULL,
  seats    integer     NOT NULL,
  price    integer     NOT NULL,
  "filmId" uuid        NOT NULL REFERENCES films(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_schedules_filmId ON schedules("filmId");

-- Seat reservations -------------------------------------------------------
-- The unique constraint is what enforces "one seat per schedule".
CREATE TABLE IF NOT EXISTS seat_reservations (
  id           serial PRIMARY KEY,
  "scheduleId" uuid    NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  "row"        integer NOT NULL,
  seat         integer NOT NULL,
  CONSTRAINT uniq_seat_per_schedule UNIQUE ("scheduleId", "row", seat)
);

CREATE INDEX IF NOT EXISTS idx_seat_reservations_scheduleId
  ON seat_reservations("scheduleId");