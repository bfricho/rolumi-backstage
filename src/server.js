import fs from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import {
  clearSessionCookie,
  credentialsMatch,
  hashClientIdentifier,
  issueSession,
  readCookie,
  SESSION_COOKIE,
  sessionCookie,
  verifySession,
} from './auth.js';
import { config } from './config.js';
import {
  HISTORY_HTML_PATH,
  HISTORY_MARKDOWN_PATH,
  loadContentIndex,
  makeExcerpt,
  renderHistoryStory,
  renderMarkdown,
  renderRoadmapTimeline,
  safeContentPath,
  sections,
} from './content.js';
import { createDatabase } from './database.js';
import { verifyTurnstile } from './turnstile.js';
import {
  documentPage,
  historyPage,
  loginPage,
  notFoundPage,
  roadmapPage,
  searchPage,
  sectionPage,
} from './views.js';

const app = express();
const database = createDatabase(config.databaseUrl, config.databaseSsl);
let contentIndex;

if (config.trustProxy) app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use((request, response, next) => {
  response.set({
    'Cache-Control': 'no-store',
    'Content-Security-Policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "connect-src 'self' https://challenges.cloudflare.com",
      "font-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "frame-src https://challenges.cloudflare.com",
      "img-src 'self' data:",
      "object-src 'none'",
      "script-src 'self' https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
    ].join('; '),
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  });
  if (config.noIndex) response.set('X-Robots-Tag', 'noindex, nofollow');
  next();
});

app.use('/assets', express.static(path.resolve('public'), {
  dotfiles: 'deny',
  etag: true,
  fallthrough: false,
  immutable: config.isProduction,
  maxAge: config.isProduction ? '7d' : 0,
}));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

app.get('/healthz', async (request, response) => {
  try {
    await database.healthy();
    response.status(200).json({ status: 'ok' });
  } catch {
    response.status(503).json({ status: 'unavailable' });
  }
});

function currentSession(request) {
  const token = readCookie(request.headers.cookie, SESSION_COOKIE);
  return verifySession(token, config.sessionSecret);
}

app.get('/login', (request, response) => {
  if (currentSession(request)) return response.redirect(303, '/roadmap');
  return response.status(200).send(loginPage({
    appName: config.appName,
    siteKey: config.turnstileSiteKey,
    turnstileRequired: config.turnstileRequired,
  }));
});

app.post('/login', async (request, response) => {
  const clientHash = hashClientIdentifier(request.ip, config.sessionSecret);
  if (await database.isRateLimited(clientHash)) {
    response.set('Retry-After', '900');
    return response.status(429).send(loginPage({
      appName: config.appName,
      error: 'Príliš veľa pokusov. Skúste to znova o 15 minút.',
      siteKey: config.turnstileSiteKey,
      turnstileRequired: config.turnstileRequired,
    }));
  }

  let humanVerified = true;
  if (config.turnstileRequired) {
    humanVerified = await verifyTurnstile({
      expectedAction: 'login',
      expectedHostnames: config.turnstileHostnames,
      remoteIp: request.ip,
      secret: config.turnstileSecret,
      token: request.body['cf-turnstile-response'],
    });
  }

  const validCredentials = credentialsMatch(
    request.body.username,
    request.body.password,
    config.authUsername,
    config.authPassword,
  );

  if (!humanVerified || !validCredentials) {
    await database.recordFailedAttempt(clientHash);
    return response.status(401).send(loginPage({
      appName: config.appName,
      error: 'Prihlásenie sa nepodarilo. Skontrolujte údaje a overenie.',
      siteKey: config.turnstileSiteKey,
      turnstileRequired: config.turnstileRequired,
    }));
  }

  await database.clearFailedAttempts(clientHash);
  const token = issueSession(config.authUsername, config.sessionSecret, config.sessionHours);
  response.setHeader('Set-Cookie', sessionCookie(token, {
    maxAgeSeconds: config.sessionHours * 60 * 60,
    secure: config.cookieSecure,
  }));
  return response.redirect(303, '/roadmap');
});

function requireAuthentication(request, response, next) {
  const session = currentSession(request);
  if (!session) return response.redirect(303, '/login');
  response.locals.session = session;
  return next();
}

app.use(requireAuthentication);

app.post('/logout', (request, response) => {
  response.setHeader('Set-Cookie', clearSessionCookie({ secure: config.cookieSecure }));
  response.redirect(303, '/login');
});

app.get('/', (request, response) => response.redirect(303, '/roadmap'));

app.get('/roadmap', async (request, response, next) => {
  try {
    const source = await fs.readFile(safeContentPath(config.contentRoot, 'ROADMAP.html'), 'utf8');
    response.send(roadmapPage({
      appName: config.appName,
      documents: contentIndex.documents,
      timeline: renderRoadmapTimeline(source),
    }));
  } catch (error) {
    next(error);
  }
});

app.get('/history', async (request, response, next) => {
  try {
    const source = await fs.readFile(safeContentPath(config.contentRoot, HISTORY_HTML_PATH), 'utf8');
    response.send(historyPage({
      appName: config.appName,
      documents: contentIndex.documents,
      story: renderHistoryStory(source),
    }));
  } catch (error) {
    next(error);
  }
});

app.get('/sections/:folder', (request, response) => {
  if (request.params.folder === '01_HISTORIA') return response.redirect(303, '/history');
  const section = sections.find((item) => item.folder === request.params.folder);
  if (!section) return response.status(404).send(notFoundPage({ appName: config.appName, documents: contentIndex.documents }));
  return response.send(sectionPage({ appName: config.appName, documents: contentIndex.documents, section }));
});

app.get(/^\/docs\/(.+)$/, async (request, response, next) => {
  try {
    const relativePath = decodeURIComponent(request.params[0]);
    if (relativePath === HISTORY_MARKDOWN_PATH) return response.redirect(303, '/history');
    if (!relativePath.toLowerCase().endsWith('.md') || !contentIndex.allFiles.has(relativePath)) {
      return response.status(404).send(notFoundPage({ appName: config.appName, documents: contentIndex.documents }));
    }
    const source = await fs.readFile(safeContentPath(config.contentRoot, relativePath), 'utf8');
    const document = contentIndex.documents.find((item) => item.path === relativePath);
    return response.send(documentPage({
      appName: config.appName,
      currentPath: relativePath,
      documents: contentIndex.documents,
      html: renderMarkdown(source, relativePath),
      title: document?.title ?? path.basename(relativePath),
    }));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return response.status(404).send(notFoundPage({ appName: config.appName, documents: contentIndex.documents }));
    }
    return next(error);
  }
});

app.get(/^\/content\/(.+)$/, async (request, response, next) => {
  try {
    const relativePath = decodeURIComponent(request.params[0]);
    if (!contentIndex.allFiles.has(relativePath)) {
      return response.status(404).send(notFoundPage({ appName: config.appName, documents: contentIndex.documents }));
    }
    if (relativePath === HISTORY_HTML_PATH) return response.redirect(303, '/history');
    if (relativePath === HISTORY_MARKDOWN_PATH) return response.redirect(303, '/history');
    if (relativePath.toLowerCase().endsWith('.md')) return response.redirect(303, `/docs/${request.params[0]}`);
    response.set('Content-Disposition', 'inline');
    return response.sendFile(safeContentPath(config.contentRoot, relativePath), { dotfiles: 'deny' });
  } catch (error) {
    return next(error);
  }
});

app.get('/search', async (request, response, next) => {
  try {
    const query = String(request.query.q ?? '').trim().slice(0, 100);
    const results = [];
    if (query.length >= 2) {
      const needle = query.toLocaleLowerCase('sk');
      for (const document of contentIndex.documents) {
        const source = await fs.readFile(safeContentPath(config.contentRoot, document.path), 'utf8');
        if (`${document.title}\n${source}`.toLocaleLowerCase('sk').includes(needle)) {
          results.push({ ...document, excerpt: makeExcerpt(source, query) });
        }
        if (results.length >= 30) break;
      }
    }
    response.send(searchPage({ appName: config.appName, documents: contentIndex.documents, query, results }));
  } catch (error) {
    next(error);
  }
});

app.use((request, response) => {
  response.status(404).send(notFoundPage({ appName: config.appName, documents: contentIndex.documents }));
});

app.use((error, request, response, next) => {
  console.error('Unhandled request error', error);
  if (response.headersSent) return next(error);
  return response.status(500).send('Internal server error');
});

async function start() {
  await database.initialize();
  contentIndex = await loadContentIndex(config.contentRoot);
  const server = app.listen(config.port, '0.0.0.0', (error) => {
    if (error) {
      console.error(`Unable to listen on port ${config.port}`, error);
      process.exitCode = 1;
      return;
    }
    console.log(`${config.appName} listening on port ${config.port}`);
  });

  async function shutdown(signal) {
    console.log(`Received ${signal}; shutting down.`);
    server.close(async () => {
      await database.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  }

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

start().catch((error) => {
  console.error('Application failed to start', error);
  process.exit(1);
});
