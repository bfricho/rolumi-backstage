import path from 'node:path';

function booleanEnv(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function required(name, fallback = '') {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';
const turnstileRequired = isProduction || booleanEnv('TURNSTILE_REQUIRED', false);

export const config = {
  appName: process.env.APP_NAME ?? 'ROLUMI Backstage',
  authPassword: required('AUTH_PASSWORD'),
  authUsername: required('AUTH_USERNAME', 'rolumi'),
  contentRoot: path.resolve(process.env.CONTENT_ROOT ?? 'content'),
  cookieSecure: booleanEnv('COOKIE_SECURE', isProduction),
  databaseSsl: booleanEnv('DATABASE_SSL', false),
  databaseUrl: required('DATABASE_URL'),
  isProduction,
  noIndex: booleanEnv('NOINDEX', false),
  nodeEnv,
  port: Number.parseInt(process.env.PORT ?? '3000', 10),
  sessionHours: Number.parseInt(process.env.SESSION_HOURS ?? '12', 10),
  sessionSecret: required('SESSION_SECRET'),
  trustProxy: booleanEnv('TRUST_PROXY', isProduction),
  turnstileHostnames: new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? '')
      .split(',')
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  ),
  turnstileRequired,
  turnstileSecret: process.env.TURNSTILE_SECRET ?? '',
  turnstileSiteKey: process.env.TURNSTILE_SITE_KEY ?? '',
};

if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65_535) {
  throw new Error('PORT must be a valid TCP port.');
}

if (!Number.isInteger(config.sessionHours) || config.sessionHours < 1 || config.sessionHours > 168) {
  throw new Error('SESSION_HOURS must be between 1 and 168.');
}

if (config.turnstileRequired) {
  required('TURNSTILE_SITE_KEY');
  required('TURNSTILE_SECRET');
  if (config.turnstileHostnames.size === 0) {
    throw new Error('TURNSTILE_HOSTNAMES must contain at least one approved frontend hostname.');
  }
  if (config.isProduction && (config.turnstileHostnames.has('localhost') || config.turnstileHostnames.has('127.0.0.1'))) {
    throw new Error('Production TURNSTILE_HOSTNAMES must not include localhost or 127.0.0.1.');
  }
}

if (config.isProduction && config.databaseUrl === 'memory:') {
  throw new Error('The in-memory database is available only for local preview.');
}
