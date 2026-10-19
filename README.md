# ROLUMI Backstage

Private roadmap and knowledge portal for ROLUMI. The application maintains its roadmap directly and packages a snapshot of the section documents and supporting files, then renders Markdown in a lightweight branded interface.

## Local start

```sh
cp .env.example .env
docker compose up --build
```

Open <http://localhost:3000> and sign in with the local values from `.env`.

The local example disables Turnstile. To exercise it locally, set `TURNSTILE_REQUIRED=true`, add a Turnstile site key and secret, and allow only `localhost,127.0.0.1` in `TURNSTILE_HOSTNAMES`.

For a quick UI-only preview when Docker/PostgreSQL is unavailable, run the process directly with `DATABASE_URL=memory:` and the remaining variables from `.env.example`. The in-memory adapter is rejected in production.

## Refreshing content

From this directory, run:

```sh
npm run content:sync
```

The include/exclude rules live in `content.config.json`. The command replaces the synchronized section content with a fresh snapshot from the parent ROLUMI directory while preserving the Backstage-owned `content/ROADMAP.md` and `content/ROADMAP.html`. Run it before reviewing and publishing a content update. Working proposal exports are excluded until they become part of the approved knowledge base.

## Environment variables

`.env.example` documents every variable. Production values belong in Dokploy, never in git. At minimum, production must set:

- `PORT` and `DATABASE_URL`
- `AUTH_USERNAME`, `AUTH_PASSWORD` and a long random `SESSION_SECRET`
- `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET` (production always enables Turnstile)
- `TURNSTILE_HOSTNAMES` containing only the exact production hostname
- `COOKIE_SECURE=true` and `TRUST_PROXY=true`

Set `NOINDEX=true` for staging. This sends `X-Robots-Tag: noindex, nofollow` on every response as required by the Orbit contract.

## Deployment on Orbit

1. Refresh and review the content snapshot.
2. Run `npm run lint && npm test && npm run build` and `docker build .`.
3. Push the project repository. Dokploy builds the multi-stage `Dockerfile` and routes the configured domain to `PORT`.
4. Create the PostgreSQL service and set the environment variables in Dokploy.
5. Configure the health check as `/healthz`.

The container is stateless. PostgreSQL persists only login-attempt throttling; the knowledge snapshot is part of the image and changes only through a new deployment.
