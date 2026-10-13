-- Enforce appointment collision protection in PostgreSQL.
-- The server must still revalidate availability and handle exclusion violations gracefully.
BEGIN;
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE appointments
  ADD CONSTRAINT appointments_no_professional_overlap
  EXCLUDE USING gist (
    organization_id WITH =,
    professional_profile_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  )
  WHERE (status IN ('requested', 'confirmed', 'checked_in'));
COMMIT;
