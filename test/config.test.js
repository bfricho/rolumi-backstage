import assert from 'node:assert/strict';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const configModule = path.resolve('src/config.js');

function loadConfig(environment) {
  return spawnSync(process.execPath, ['-e', `import(${JSON.stringify(configModule)})`], {
    encoding: 'utf8',
    env: {
      PATH: process.env.PATH,
      AUTH_PASSWORD: 'test-password',
      AUTH_USERNAME: 'rolumi',
      DATABASE_URL: 'postgres://example',
      SESSION_SECRET: 'test-session-secret',
      ...environment,
    },
  });
}

test('development may explicitly disable Turnstile', () => {
  assert.equal(loadConfig({ NODE_ENV: 'development', TURNSTILE_REQUIRED: 'false' }).status, 0);
});

test('production fails closed without Turnstile configuration', () => {
  const result = loadConfig({ NODE_ENV: 'production', TURNSTILE_REQUIRED: 'false' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /TURNSTILE_SITE_KEY/u);
});

test('production rejects local hostnames in the Turnstile allowlist', () => {
  const result = loadConfig({
    NODE_ENV: 'production',
    TURNSTILE_HOSTNAMES: 'backstage.example.com,localhost',
    TURNSTILE_SECRET: 'secret',
    TURNSTILE_SITE_KEY: 'sitekey',
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /must not include localhost/u);
});
