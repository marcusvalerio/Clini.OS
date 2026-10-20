-- Clini.OS — Initial schema proposal
-- Apply only to a development database after review.
-- This migration does NOT configure authentication, authorization, RLS or file storage.
-- Never load real beneficiary data until those controls are implemented and tested.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE membership_role AS ENUM (
  'org_owner',
  'org_admin',
  'coordinator',
  'reception',
  'professional',
  'finance',
  'auditor'
);

CREATE TYPE appointment_status AS ENUM (
  'requested',
  'confirmed',
  'checked_in',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE document_category AS ENUM (
  'identity',
  'medical_report',
  'referral',
  'authorization',
  'professional_report',
  'other'
);

CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE encounter_status AS ENUM ('draft', 'in_progress', 'completed', 'amended');

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  timezone text NOT NULL DEFAULT 'America/Sao_Paulo',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Application identity. auth_subject must map to the chosen trusted auth provider.
-- Passwords and session secrets must never be stored in this table.
CREATE TABLE app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_subject text NOT NULL UNIQUE,
  email text NOT NULL,
  full_name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email)
);

CREATE TABLE memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  role membership_role NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id),
  UNIQUE (organization_id, id)
);

CREATE TABLE beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  record_number text NOT NULL,
  full_name text NOT NULL,
  preferred_name text,
  birth_date date,
  administrative_status text NOT NULL DEFAULT 'active'
    CHECK (administrative_status IN ('active', 'waiting_list', 'inactive', 'archived')),
  duplicate_review_status text NOT NULL DEFAULT 'clear'
    CHECK (duplicate_review_status IN ('clear', 'review_required', 'resolved')),
  created_by_membership_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  archived_at timestamptz,
  UNIQUE (organization_id, record_number),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, created_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE INDEX beneficiaries_org_name_idx
  ON beneficiaries (organization_id, lower(full_name));
CREATE INDEX beneficiaries_org_status_idx
  ON beneficiaries (organization_id, administrative_status);

CREATE TABLE guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  full_name text NOT NULL,
  phone text,
  email text,
  preferred_contact_method text NOT NULL DEFAULT 'whatsapp'
    CHECK (preferred_contact_method IN ('whatsapp', 'phone', 'email', 'other')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id)
);

CREATE INDEX guardians_org_name_idx ON guardians (organization_id, lower(full_name));
CREATE INDEX guardians_org_phone_idx ON guardians (organization_id, phone);

CREATE TABLE beneficiary_guardians (
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  beneficiary_id uuid NOT NULL,
  guardian_id uuid NOT NULL,
  relationship text NOT NULL,
  is_legal_guardian boolean NOT NULL DEFAULT false,
  is_primary_contact boolean NOT NULL DEFAULT false,
  can_receive_communications boolean NOT NULL DEFAULT true,
  authorization_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, beneficiary_id, guardian_id),
  FOREIGN KEY (organization_id, beneficiary_id)
    REFERENCES beneficiaries(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, guardian_id)
    REFERENCES guardians(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE professional_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  membership_id uuid NOT NULL,
  display_name text NOT NULL,
  professional_category text NOT NULL,
  registration_reference text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, membership_id),
  FOREIGN KEY (organization_id, membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  name text NOT NULL,
  description text,
  duration_minutes integer NOT NULL CHECK (duration_minutes BETWEEN 5 AND 480),
  buffer_minutes integer NOT NULL DEFAULT 0 CHECK (buffer_minutes BETWEEN 0 AND 240),
  price numeric(12,2) CHECK (price IS NULL OR price >= 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, name)
);

CREATE TABLE availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  professional_profile_id uuid NOT NULL,
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  starts_at time NOT NULL,
  ends_at time NOT NULL,
  effective_from date,
  effective_until date,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at),
  CHECK (effective_until IS NULL OR effective_from IS NULL OR effective_until >= effective_from),
  FOREIGN KEY (organization_id, professional_profile_id)
    REFERENCES professional_profiles(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  professional_profile_id uuid NOT NULL,
  exception_date date NOT NULL,
  starts_at time,
  ends_at time,
  reason text,
  is_available boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((starts_at IS NULL AND ends_at IS NULL) OR (starts_at IS NOT NULL AND ends_at > starts_at)),
  FOREIGN KEY (organization_id, professional_profile_id)
    REFERENCES professional_profiles(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  beneficiary_id uuid NOT NULL,
  service_id uuid NOT NULL,
  professional_profile_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status appointment_status NOT NULL DEFAULT 'requested',
  booking_source text NOT NULL DEFAULT 'staff'
    CHECK (booking_source IN ('staff', 'public_portal', 'whatsapp', 'phone', 'other')),
  client_note text,
  internal_note text,
  created_by_membership_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  cancelled_at timestamptz,
  CHECK (ends_at > starts_at),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, beneficiary_id)
    REFERENCES beneficiaries(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, service_id)
    REFERENCES services(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, professional_profile_id)
    REFERENCES professional_profiles(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, created_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE INDEX appointments_org_start_idx ON appointments (organization_id, starts_at);
CREATE INDEX appointments_professional_start_idx
  ON appointments (organization_id, professional_profile_id, starts_at)
  WHERE status IN ('requested', 'confirmed', 'checked_in');
CREATE INDEX appointments_beneficiary_start_idx
  ON appointments (organization_id, beneficiary_id, starts_at DESC);

CREATE TABLE encounters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  appointment_id uuid,
  beneficiary_id uuid NOT NULL,
  professional_profile_id uuid NOT NULL,
  status encounter_status NOT NULL DEFAULT 'draft',
  started_at timestamptz,
  completed_at timestamptz,
  created_by_membership_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, appointment_id)
    REFERENCES appointments(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, beneficiary_id)
    REFERENCES beneficiaries(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, professional_profile_id)
    REFERENCES professional_profiles(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, created_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE INDEX encounters_beneficiary_created_idx
  ON encounters (organization_id, beneficiary_id, created_at DESC);

CREATE TABLE clinical_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  encounter_id uuid NOT NULL,
  author_membership_id uuid NOT NULL,
  note_type text NOT NULL DEFAULT 'progress'
    CHECK (note_type IN ('progress', 'observation', 'referral', 'plan', 'other')),
  content text NOT NULL,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  supersedes_note_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  amended_at timestamptz,
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, encounter_id)
    REFERENCES encounters(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, author_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, supersedes_note_id)
    REFERENCES clinical_notes(organization_id, id) ON DELETE RESTRICT
);

CREATE INDEX clinical_notes_encounter_idx
  ON clinical_notes (organization_id, encounter_id, created_at);

CREATE TABLE care_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  beneficiary_id uuid NOT NULL,
  title text NOT NULL,
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  starts_on date,
  ends_on date,
  created_by_membership_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (organization_id, beneficiary_id)
    REFERENCES beneficiaries(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, created_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT,
  CHECK (ends_on IS NULL OR starts_on IS NULL OR ends_on >= starts_on)
);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  beneficiary_id uuid NOT NULL,
  category document_category NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  sensitivity text NOT NULL DEFAULT 'restricted'
    CHECK (sensitivity IN ('administrative', 'restricted', 'professional')),
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'superseded', 'archived')),
  uploaded_by_membership_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, beneficiary_id)
    REFERENCES beneficiaries(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, uploaded_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  document_id uuid NOT NULL,
  version_number integer NOT NULL CHECK (version_number > 0),
  storage_key text NOT NULL,
  original_filename text NOT NULL,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL CHECK (size_bytes >= 0),
  sha256_hex text,
  uploaded_by_membership_id uuid NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, document_id, version_number),
  FOREIGN KEY (organization_id, document_id)
    REFERENCES documents(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, uploaded_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  beneficiary_id uuid NOT NULL,
  guardian_id uuid,
  consent_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'granted', 'denied', 'revoked', 'expired')),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  evidence_document_id uuid,
  recorded_by_membership_id uuid,
  notes text,
  FOREIGN KEY (organization_id, beneficiary_id)
    REFERENCES beneficiaries(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, guardian_id)
    REFERENCES guardians(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, evidence_document_id)
    REFERENCES documents(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, recorded_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  transaction_type transaction_type NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  due_date date,
  occurred_at timestamptz,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'cancelled', 'reversed')),
  payment_method text,
  reference_code text,
  created_by_membership_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  FOREIGN KEY (organization_id, created_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE INDEX financial_transactions_org_due_idx
  ON financial_transactions (organization_id, due_date, status);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  transaction_id uuid NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  paid_at timestamptz NOT NULL DEFAULT now(),
  payment_method text NOT NULL,
  reference_code text,
  recorded_by_membership_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (organization_id, transaction_id)
    REFERENCES financial_transactions(organization_id, id) ON DELETE RESTRICT,
  FOREIGN KEY (organization_id, recorded_by_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE TABLE audit_logs (
  id bigserial PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  actor_membership_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  request_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  FOREIGN KEY (organization_id, actor_membership_id)
    REFERENCES memberships(organization_id, id) ON DELETE RESTRICT
);

CREATE INDEX audit_logs_org_occurred_idx ON audit_logs (organization_id, occurred_at DESC);
CREATE INDEX documents_beneficiary_idx ON documents (organization_id, beneficiary_id, created_at DESC);
CREATE INDEX payments_transaction_idx ON payments (organization_id, transaction_id, paid_at DESC);

COMMIT;
