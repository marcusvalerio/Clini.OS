import { neon } from "@neondatabase/serverless";

/**
 * Creates a Neon SQL client on demand so importing application modules
 * during a build does not require DATABASE_URL to be present.
 *
 * Only call this from trusted server-side code. Never expose DATABASE_URL
 * through a NEXT_PUBLIC_ variable or return raw query results to clients
 * without authorization and validation.
 */
export function getSql() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada. Defina a variável no ambiente do servidor.");
  }

  return neon(connectionString);
}
