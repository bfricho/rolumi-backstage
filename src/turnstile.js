const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile({
  expectedAction,
  expectedHostnames,
  fetchImpl = fetch,
  remoteIp,
  secret,
  token,
}) {
  if (
    typeof token !== 'string'
    || token.length === 0
    || token.length > 2_048
    || !secret
    || expectedHostnames.size === 0
  ) {
    return false;
  }

  let result;
  try {
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        remoteip: remoteIp,
        response: token,
        secret,
      }),
    });
    if (!response.ok) return false;
    result = await response.json();
  } catch {
    return false;
  }

  return result.success === true
    && result.action === expectedAction
    && typeof result.hostname === 'string'
    && expectedHostnames.has(result.hostname.toLowerCase());
}
