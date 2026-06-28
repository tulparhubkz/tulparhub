// Decide whether to use TLS for a Postgres connection.
// Enabled when the connection string asks for it (e.g. Neon / Render-external
// `?sslmode=require`) or DATABASE_SSL=true. Local dev and Render-internal
// connections have no sslmode and stay plaintext.
export function sslOption(connectionString = process.env.DATABASE_URL ?? '') {
  const wants =
    /sslmode=(require|verify)/.test(connectionString) ||
    /[?&]ssl=true/.test(connectionString) ||
    process.env.DATABASE_SSL === 'true'
  return wants ? { rejectUnauthorized: false } : undefined
}
