import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyTurnstile } from '../src/turnstile.js';

function mockFetch(result, ok = true) {
  return async () => ({ json: async () => result, ok });
}

test('Turnstile accepts only the expected action and hostname', async () => {
  const base = {
    expectedAction: 'login',
    expectedHostnames: new Set(['backstage.rolumi.sk']),
    remoteIp: '203.0.113.10',
    secret: 'secret',
    token: 'token',
  };
  assert.equal(await verifyTurnstile({
    ...base,
    fetchImpl: mockFetch({ action: 'login', hostname: 'backstage.rolumi.sk', success: true }),
  }), true);
  assert.equal(await verifyTurnstile({
    ...base,
    fetchImpl: mockFetch({ action: 'signup', hostname: 'backstage.rolumi.sk', success: true }),
  }), false);
  assert.equal(await verifyTurnstile({
    ...base,
    fetchImpl: mockFetch({ action: 'login', hostname: 'evil.example', success: true }),
  }), false);
});

test('Turnstile fails closed on upstream errors', async () => {
  assert.equal(await verifyTurnstile({
    expectedAction: 'login',
    expectedHostnames: new Set(['localhost']),
    fetchImpl: async () => { throw new Error('offline'); },
    remoteIp: '127.0.0.1',
    secret: 'secret',
    token: 'token',
  }), false);
});
