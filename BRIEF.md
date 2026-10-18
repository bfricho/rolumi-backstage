# ROLUMI Backstage — brief

## Purpose

ROLUMI Backstage is a private, lightweight web application that makes the company transformation roadmap and its supporting working documents easy to navigate and read. It turns the existing repository knowledge base into an intentionally designed internal portal without creating a second authoring system.

## Audience

- ROLUMI leadership and invited collaborators.
- People who need the current context, decisions and work-in-progress documents but do not need repository access.

## Core experience

1. A branded login screen protects the whole application with one configured username and password.
2. Cloudflare Turnstile protects the login against automated attempts in production.
3. The existing approved visual roadmap is preserved as the home screen and its document links open inside Backstage. Do not redesign this roadmap unless explicitly requested.
4. Markdown files are rendered as readable, responsive documents with working relative links.
5. Non-Markdown supporting files remain available through authenticated routes.
6. Search helps users find text across the published Markdown snapshot.

## Content model

The source ROLUMI repository remains the authoring source. Before publication, `npm run content:sync` copies the configured roadmap and section folders into this project's `content/` directory. The deployed container therefore includes an immutable, reviewable snapshot and does not require filesystem mounts or access to the source repository.

## Scope boundaries

- No in-browser editing or content database in the first version.
- No individual user accounts, invitations or password reset in the first version.
- No public indexing; production and staging are private.
- No invented content for roadmap areas that are intentionally still empty.

## Success criteria

- A non-technical reader can move from roadmap to a section and read its documents on desktop or mobile.
- Unauthenticated requests cannot access documents or supporting files.
- Production login fails closed when Turnstile is missing or invalid.
- The application meets the supplied Orbit deployment contract and runs locally with one Docker Compose command.
