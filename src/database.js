import pg from 'pg';

const { Pool } = pg;

export function createDatabase(databaseUrl, ssl) {
  if (databaseUrl === 'memory:') {
    const failedAttempts = new Map();
    return {
      async close() {},
      async clearFailedAttempts(clientHash) { failedAttempts.delete(clientHash); },
      async healthy() { return true; },
      async initialize() {},
      async isRateLimited(clientHash, limit = 8, windowMinutes = 15) {
        const threshold = Date.now() - (windowMinutes * 60 * 1_000);
        const recent = (failedAttempts.get(clientHash) ?? []).filter((time) => time > threshold);
        failedAttempts.set(clientHash, recent);
        return recent.length >= limit;
      },
      async recordFailedAttempt(clientHash) {
        failedAttempts.set(clientHash, [...(failedAttempts.get(clientHash) ?? []), Date.now()]);
      },
    };
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
    ssl: ssl ? { rejectUnauthorized: true } : false,
  });

  pool.on('error', (error) => {
    console.error('Unexpected PostgreSQL pool error', error);
  });

  return {
    async close() {
      await pool.end();
    },

    async clearFailedAttempts(clientHash) {
      await pool.query('DELETE FROM auth_attempts WHERE client_hash = $1', [clientHash]);
    },

    async healthy() {
      await pool.query('SELECT 1');
      return true;
    },

    async initialize() {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS auth_attempts (
          id BIGSERIAL PRIMARY KEY,
          client_hash TEXT NOT NULL,
          attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS auth_attempts_client_time_idx
        ON auth_attempts (client_hash, attempted_at DESC)
      `);
      await pool.query("DELETE FROM auth_attempts WHERE attempted_at < NOW() - INTERVAL '1 day'");
    },

    async isRateLimited(clientHash, limit = 8, windowMinutes = 15) {
      const result = await pool.query(
        `SELECT COUNT(*)::int AS count
         FROM auth_attempts
         WHERE client_hash = $1
           AND attempted_at > NOW() - ($2::text || ' minutes')::interval`,
        [clientHash, windowMinutes],
      );
      return result.rows[0].count >= limit;
    },

    async recordFailedAttempt(clientHash) {
      await pool.query('INSERT INTO auth_attempts (client_hash) VALUES ($1)', [clientHash]);
    },
  };
}
