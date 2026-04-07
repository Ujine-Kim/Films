import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://armenak:armenak@localhost:5432/armenak_films',
});

// Auto-create tables on startup
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS magic_codes (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE
    );
    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      film_slug VARCHAR(100) NOT NULL,
      type VARCHAR(10) CHECK (type IN ('rent', 'buy')),
      expires_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('Database tables ready');
}

export async function findOrCreateUser(email: string) {
  const { rows } = await pool.query(
    `INSERT INTO users (email) VALUES ($1)
     ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
     RETURNING id, email, created_at`,
    [email]
  );
  return rows[0];
}

export async function saveCode(email: string, code: string) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await pool.query(
    'INSERT INTO magic_codes (email, code, expires_at) VALUES ($1, $2, $3)',
    [email, code, expiresAt]
  );
}

export async function verifyCode(email: string, code: string) {
  const { rowCount } = await pool.query(
    `UPDATE magic_codes SET used = TRUE
     WHERE email = $1 AND code = $2 AND used = FALSE AND expires_at > NOW()`,
    [email, code]
  );
  return (rowCount ?? 0) > 0;
}

export async function createPurchase(userId: number, filmSlug: string, type: 'rent' | 'buy') {
  const expiresAt = type === 'rent'
    ? new Date(Date.now() + 48 * 60 * 60 * 1000)
    : null;
  const { rows } = await pool.query(
    `INSERT INTO purchases (user_id, film_slug, type, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id, film_slug, type, expires_at, created_at`,
    [userId, filmSlug, type, expiresAt]
  );
  return rows[0];
}

export async function getUserPurchases(userId: number) {
  const { rows } = await pool.query(
    `SELECT id, film_slug, type, expires_at, created_at FROM purchases
     WHERE user_id = $1 AND (type = 'buy' OR expires_at > NOW())
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

export async function getUserAccess(userId: number, filmSlug: string) {
  const { rows } = await pool.query(
    `SELECT type, expires_at FROM purchases
     WHERE user_id = $1 AND film_slug = $2 AND (type = 'buy' OR expires_at > NOW())
     ORDER BY type ASC LIMIT 1`,
    [userId, filmSlug]
  );
  if (rows.length === 0) return null;
  return { type: rows[0].type, expiresAt: rows[0].expires_at };
}
