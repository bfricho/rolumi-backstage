import crypto from 'node:crypto';

export const SESSION_COOKIE = 'rolumi_backstage_session';

function encode(value) {
  return Buffer.from(value).toString('base64url');
}

function signature(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function credentialsMatch(actualUsername, actualPassword, expectedUsername, expectedPassword) {
  return safeEqual(String(actualUsername ?? ''), expectedUsername)
    && safeEqual(String(actualPassword ?? ''), expectedPassword);
}

export function issueSession(username, secret, hours, now = Date.now()) {
  const payload = encode(JSON.stringify({
    exp: now + (hours * 60 * 60 * 1000),
    sub: username,
  }));
  return `${payload}.${signature(payload, secret)}`;
}

export function verifySession(token, secret, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 2_048) return null;
  const separator = token.lastIndexOf('.');
  if (separator < 1) return null;
  const payload = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);
  if (!safeEqual(suppliedSignature, signature(payload, secret))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof session.sub !== 'string' || typeof session.exp !== 'number' || session.exp <= now) return null;
    return session;
  } catch {
    return null;
  }
}

export function readCookie(header, name) {
  if (typeof header !== 'string') return '';
  for (const item of header.split(';')) {
    const [key, ...value] = item.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return '';
}

export function sessionCookie(token, { maxAgeSeconds, secure }) {
  const attributes = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ];
  if (secure) attributes.push('Secure');
  return attributes.join('; ');
}

export function clearSessionCookie({ secure }) {
  const attributes = [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
  ];
  if (secure) attributes.push('Secure');
  return attributes.join('; ');
}

export function hashClientIdentifier(ip, secret) {
  return crypto.createHmac('sha256', secret).update(String(ip ?? '')).digest('hex');
}
