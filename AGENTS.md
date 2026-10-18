# ROLUMI Backstage — agent entry point

Read [BRIEF.md](./BRIEF.md) after this file. It is the source of truth for what the application is and why it exists. This file defines how to change it safely.

## Stack and runtime

- Node.js 22, Express 5 and server-rendered HTML.
- PostgreSQL stores login-attempt rate limiting; published documents are a read-only snapshot in `content/`.
- Cloudflare Turnstile protects the login in production and is always validated server-side.
- Docker/Dokploy deployment follows the Orbit app contract supplied with the project.

## Working conventions

- Run `npm run content:sync` from this directory before publishing a new content snapshot.
- Do not read knowledge documents from paths outside `content/` at runtime.
- Preserve the ROLUMI brand tokens in `public/styles.css`; use only approved full-logo variants from `public/`.
- Preserve the source `ROADMAP.html` visual unchanged. Backstage may rewrite only relative asset and document URLs at response time.
- Keep Markdown raw HTML disabled and sanitized. Relative document links must stay behind authenticated `/docs/` or `/content/` routes.
- Never commit `.env`, passwords, session secrets or the Turnstile secret.
- Production requires `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` and an exact `TURNSTILE_HOSTNAMES` allowlist.
- Add or update tests when changing authentication, link resolution or Turnstile validation.

## Verification

Run:

```sh
npm run lint
npm test
npm run build
docker build .
```

The full local environment starts with `cp .env.example .env && docker compose up`.
