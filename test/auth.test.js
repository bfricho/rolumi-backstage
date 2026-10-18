import assert from 'node:assert/strict';
import test from 'node:test';
import { credentialsMatch, issueSession, verifySession } from '../src/auth.js';

test('credentials require both exact values', () => {
  assert.equal(credentialsMatch('rolumi', 'secret', 'rolumi', 'secret'), true);
  assert.equal(credentialsMatch('rolumi', 'wrong', 'rolumi', 'secret'), false);
  assert.equal(credentialsMatch('other', 'secret', 'rolumi', 'secret'), false);
});

test('signed session verifies before expiry', () => {
  const now = Date.UTC(2026, 9, 19, 10, 0, 0);
  const token = issueSession('rolumi', 'test-secret', 12, now);
  assert.deepEqual(verifySession(token, 'test-secret', now + 1_000), {
    exp: now + (12 * 60 * 60 * 1_000),
    sub: 'rolumi',
  });
});

test('tampered and expired sessions are rejected', () => {
  const now = Date.UTC(2026, 9, 19, 10, 0, 0);
  const token = issueSession('rolumi', 'test-secret', 1, now);
  assert.equal(verifySession(`${token}x`, 'test-secret', now), null);
  assert.equal(verifySession(token, 'test-secret', now + (2 * 60 * 60 * 1_000)), null);
});
