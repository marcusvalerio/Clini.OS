# Neon PostgreSQL setup

Neon is the intended PostgreSQL provider for Clini.OS. The repository is prepared for it, but no database is considered provisioned until a Neon project exists and its connection is verified.

## Project setup
1. Create a Neon project named `clini-os` in the Neon console (choose the region closest to the app's deployment and expected users).
2. Keep development and production separated. Start with development only; do not connect production beneficiary data during foundation work.
3. Create a development branch for schema experimentation if available on the selected plan.
4. Obtain the pooled connection string for the application and the direct connection string for migration tooling, if the plan/provider setup supplies both.
5. Store secrets in local `.env.local` and in the deployment provider's encrypted environment-variable settings. Never commit secrets.

## Environment variables
- `DATABASE_URL`: pooled Neon connection string for serverless application queries.
- `DIRECT_URL`: direct connection string reserved for migration tooling if required by the chosen migration runner.
- `APP_URL`: application base URL.

The current application helper reads `DATABASE_URL` only. Add `DIRECT_URL` to tooling only when a migration runner is selected and configured. Do not expose either value to browser code.

## Apply migrations
Review SQL files in lexical order:
1. `db/migrations/0001_initial_schema.sql`
2. `db/migrations/0002_appointment_overlap_guard.sql)

Apply them first to a disposable development database using the Neon SQL Editor or a configured migration runner. Verify the migration result and constraints before connecting application routes.

## Before using real beneficiary data
The initial SQL is a schema proposal, not a production security boundary. Complete and test:
- authentication and server-side session verification;
- organization membership and role authorization on every read/write;
- database tenant isolation strategy (including RLS or equivalently enforced, tested access boundaries);
- private document storage and signed access;
- audit logging for reads/changes to sensitive records;
- backup and restore checks;
- retention/deletion, consent, and privacy workflows;
- deployment secrets and environment separation.

Do not store real personal data until these controls have passed review.
