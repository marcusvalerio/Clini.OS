# Clini.OS — Agent instructions

## Product context
Clini.OS is a management system for a social organization / NGO. The first rollout is for one organization, but the data model and authorization architecture must support multiple organizations later. The core records are administrative records and professional follow-up records. Do not turn the product into a generic medical clinic EHR unless the product owner explicitly changes scope.

## Product and UX foundation
Use the upstream **Revenue-Centric Design** Agent Skill as a reference for product decisions:
- Repository: https://github.com/heliocosta-dev/revenue-centric-design
- Install into a compatible local agent environment with `npx skills add heliocosta-dev/revenue-centric-design`.
- Follow the upstream usage boundary and attribution requirements. The skill's license forbids applying it to gambling, betting, casino, or real-money games of chance.
- Do not copy the upstream skill wholesale into this repository unless its full license and attribution are preserved. This project records its own applied product decisions in `docs/PRODUCT-PRINCIPLES.md`.

Apply the approach to this specific NGO workflow rather than optimizing for aggressive sales:
1. Identify the user role and their job before adding UI or features.
2. Make the next useful action obvious; avoid dead-end screens and generic navigation.
3. Show real value quickly through a guided setup and a clear first successful workflow.
4. Never invent metrics, appointments, testimonials, or beneficiary records. Use honest empty states with one clear next action.
5. Prefer fewer, connected modules over a broad feature checklist.
6. Measure operational outcomes such as time to register a beneficiary, completed follow-ups, overdue tasks, and missing documentation—not vanity metrics.
7. Protect trust: no dark patterns, artificial urgency, deceptive defaults, or monetization mechanics that compromise care or privacy.

## Engineering constraints
- TypeScript strict mode; server-side validation for all writes.
- Keep credentials server-only; never use `NEXT_PUBLIC_` for secrets.
- Every organization-owned table must include `organization_id` and enforce tenant boundaries in the data layer.
- Every protected server action / route must verify authenticated user, active membership, organization scope, and role-specific authorization.
- Treat professional follow-up notes and child/family information as highly sensitive. Minimize collection, restrict access, and audit access/changes.
- Documents must use private object storage and short-lived authorized access; never public permanent URLs.
- Do not use real personal data in fixtures, tests, previews, or commits.
- Do not claim authentication, RBAC, tenant isolation, audit coverage, migrations, or CI passed unless verified by a real test/run.
- Do not apply migrations to production without explicit approval and a backup/rollback plan.

## Current architecture
- Next.js App Router + TypeScript + Tailwind
- Neon PostgreSQL is the intended database.
- SQL migrations live in `db/migrations`.
- Keep first deployment simple; prepare tenant-aware structure without implementing billing/subscriptions unless explicitly requested.
