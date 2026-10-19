import { encodePath, sections } from './content.js';

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function documentNavigation(documents, currentPath = '') {
  return sections.map((section) => {
    const items = documents.filter((document) => document.section === section.folder);
    const documentLinks = items.map((document) => `
      <li>
        <a class="side-document${document.path === currentPath ? ' is-active' : ''}"
           href="/docs/${encodePath(document.path)}">
          ${escapeHtml(document.title)}
        </a>
      </li>
    `).join('');

    return `
      <li class="side-section">
        <a class="side-section-link" href="/sections/${encodeURIComponent(section.folder)}">
          <span>${section.number}</span>${escapeHtml(section.label)}
        </a>
        ${documentLinks ? `<ul>${documentLinks}</ul>` : ''}
      </li>
    `;
  }).join('');
}

function shell({ appName, content, currentPath, documents, mainClass = '', title }) {
  return `<!doctype html>
  <html lang="sk">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="noindex,nofollow">
      <title>${escapeHtml(title)} · ${escapeHtml(appName)}</title>
      <link rel="stylesheet" href="/assets/styles.css">
      <script src="/assets/app.js" defer></script>
    </head>
    <body class="app-body">
      <a class="skip-link" href="#main">Preskočiť na obsah</a>
      <header class="topbar">
        <button class="menu-button" type="button" data-menu-toggle aria-expanded="false" aria-controls="sidebar">
          <span class="sr-only">Otvoriť navigáciu</span>
          <span></span><span></span><span></span>
        </button>
        <a class="brand-lockup" href="/roadmap" aria-label="ROLUMI Backstage: roadmap">
          <img src="/assets/rolumi-logo.svg" alt="ROLUMI STAVEBNINY">
          <span>Backstage</span>
        </a>
        <div class="topbar-actions">
          <form class="search-form" action="/search" method="get" role="search">
            <label class="sr-only" for="search">Hľadať v dokumentoch</label>
            <input id="search" name="q" type="search" placeholder="Hľadať…" autocomplete="off">
            <button type="submit">Hľadať</button>
          </form>
          <form action="/logout" method="post">
            <button class="text-button" type="submit">Odhlásiť</button>
          </form>
        </div>
      </header>
      <div class="app-grid">
        <aside class="sidebar" id="sidebar" data-sidebar>
          <nav aria-label="Hlavná navigácia">
            <a class="roadmap-link${currentPath === 'ROADMAP.md' ? ' is-active' : ''}" href="/roadmap">
              <span>00</span> Roadmap
            </a>
            <a class="roadmap-link" href="/search">
              <span>⌕</span> Hľadať
            </a>
            <ol class="side-sections">${documentNavigation(documents, currentPath)}</ol>
          </nav>
          <p class="sidebar-note">Interný pracovný priestor<br>Obsah podľa posledného publikovaného snapshotu</p>
        </aside>
        <div class="sidebar-scrim" data-menu-toggle aria-hidden="true"></div>
        <main id="main" class="main-content${mainClass ? ` ${mainClass}` : ''}">${content}</main>
      </div>
    </body>
  </html>`;
}

export function loginPage({ appName, error = '', siteKey = '', turnstileRequired = false }) {
  const turnstile = turnstileRequired ? `
    <div class="turnstile-wrap">
      <div class="cf-turnstile" data-sitekey="${escapeHtml(siteKey)}" data-action="login" data-theme="light"></div>
    </div>
  ` : '<p class="local-note">Lokálne overenie proti botom je vypnuté.</p>';

  return `<!doctype html>
  <html lang="sk">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="noindex,nofollow">
      <title>Prihlásenie · ${escapeHtml(appName)}</title>
      <link rel="stylesheet" href="/assets/styles.css">
      ${turnstileRequired ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
    </head>
    <body class="login-body">
      <main class="login-shell">
        <section class="login-brand" aria-label="ROLUMI Backstage">
          <img src="/assets/rolumi-logo-inverse.svg" alt="ROLUMI STAVEBNINY">
          <div>
            <p class="eyebrow inverse">Interný pracovný priestor</p>
            <h1>Miesto, kde je smer firmy na jednom mieste.</h1>
            <p>Roadmapa, rozhodnutia a pracovné dokumenty ROLUMI v čitateľnej podobe.</p>
          </div>
          <span class="brand-line" aria-hidden="true"></span>
        </section>
        <section class="login-panel">
          <div class="login-form-wrap">
            <p class="eyebrow">ROLUMI Backstage</p>
            <h2>Prihlásenie</h2>
            <p class="form-intro">Priestor je určený iba pre pozvaných členov tímu.</p>
            ${error ? `<div class="form-error" role="alert">${escapeHtml(error)}</div>` : ''}
            <form action="/login" method="post" class="login-form">
              <div class="field">
                <label for="username">Meno</label>
                <input id="username" name="username" type="text" autocomplete="username" required autofocus>
              </div>
              <div class="field">
                <label for="password">Heslo</label>
                <input id="password" name="password" type="password" autocomplete="current-password" required>
              </div>
              ${turnstile}
              <button class="primary-button" type="submit">Vstúpiť do Backstage <span aria-hidden="true">→</span></button>
            </form>
          </div>
        </section>
      </main>
    </body>
  </html>`;
}

export function roadmapPage({ appName, documents, timeline }) {
  const content = `
    <section class="roadmap-manifesto" aria-labelledby="roadmap-title">
      <div class="roadmap-manifesto-copy">
        <p class="roadmap-manifesto-kicker">ROLUMI 2030</p>
        <h1 id="roadmap-title">Staviame na 20 rokoch skúseností. <span>Spoločne tvoríme nové ROLUMI.</span></h1>
        <p class="roadmap-manifesto-lede">Z tradičného maloobchodu sa meníme na strategického partnera pre celú stavbu. Zákazníkom tak prinášame istotu od výberu materiálu až po úspešnú realizáciu.</p>
      </div>
      <div class="roadmap-manifesto-year" aria-hidden="true"><span>20</span><span>30</span></div>
    </section>
    ${timeline}
  `;
  return shell({
    appName,
    content,
    currentPath: 'ROADMAP.md',
    documents,
    mainClass: 'main-content--roadmap',
    title: 'Roadmap',
  });
}

export function documentPage({ appName, currentPath, documents, html, title }) {
  const section = sections.find((item) => currentPath.startsWith(`${item.folder}/`));
  const content = `
    <div class="breadcrumbs">
      <a href="/roadmap">Roadmap</a><span>/</span>
      ${section ? `<a href="/sections/${encodeURIComponent(section.folder)}">${escapeHtml(section.label)}</a><span>/</span>` : ''}
      <span>${escapeHtml(title)}</span>
    </div>
    <article class="markdown-card document-card">
      <div class="article-label">${escapeHtml(currentPath)}</div>
      <div class="markdown-body">${html}</div>
    </article>
  `;
  return shell({ appName, content, currentPath, documents, title });
}

export function sectionPage({ appName, documents, section }) {
  const sectionDocuments = documents.filter((document) => document.section === section.folder);
  const cards = sectionDocuments.length > 0
    ? sectionDocuments.map((document, index) => `
      <a class="document-tile" href="/docs/${encodePath(document.path)}">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <h2>${escapeHtml(document.title)}</h2>
        <p>${escapeHtml(document.path)}</p>
        <b aria-hidden="true">→</b>
      </a>
    `).join('')
    : `<div class="empty-state">
        <p class="eyebrow">Zatiaľ bez dokumentov</p>
        <h2>Táto časť vznikne, keď na ňu príde rad.</h2>
        <p>Backstage zámerne nevytvára prázdne dokumenty ani predčasne detailné plány.</p>
      </div>`;

  const content = `
    <section class="page-hero section-hero">
      <div>
        <p class="eyebrow">${section.number} / Roadmap</p>
        <h1>${escapeHtml(section.label)}</h1>
        <p class="hero-copy">${escapeHtml(section.summary)}</p>
      </div>
      <div class="section-count"><strong>${sectionDocuments.length}</strong><span>dokumentov</span></div>
    </section>
    <section class="document-grid">${cards}</section>
  `;
  return shell({ appName, content, currentPath: '', documents, title: section.label });
}

export function searchPage({ appName, documents, query, results }) {
  const content = `
    <section class="page-hero compact-hero">
      <div>
        <p class="eyebrow">Vyhľadávanie</p>
        <h1>${query ? `Výsledky pre „${escapeHtml(query)}“` : 'Hľadať v Backstage'}</h1>
        <p class="hero-copy">${query ? `${results.length} nájdených dokumentov.` : 'Zadajte názov alebo výraz z dokumentu.'}</p>
      </div>
    </section>
    <form class="page-search" action="/search" method="get" role="search">
      <label for="page-search">Hľadaný výraz</label>
      <div><input id="page-search" name="q" value="${escapeHtml(query)}" type="search" required><button type="submit">Hľadať</button></div>
    </form>
    <section class="search-results">
      ${results.map((result) => `
        <a href="/docs/${encodePath(result.path)}">
          <span>${escapeHtml(result.path)}</span>
          <h2>${escapeHtml(result.title)}</h2>
          <p>${escapeHtml(result.excerpt)}</p>
        </a>
      `).join('') || (query ? '<p class="empty-search">Nenašli sa žiadne dokumenty. Skúste kratší alebo všeobecnejší výraz.</p>' : '')}
    </section>
  `;
  return shell({ appName, content, currentPath: '', documents, title: 'Vyhľadávanie' });
}

export function notFoundPage({ appName, documents }) {
  const content = `
    <section class="not-found">
      <p class="eyebrow">404</p>
      <h1>Táto stránka v Backstage nie je.</h1>
      <p>Obsah mohol byť presunutý alebo ešte nebol publikovaný.</p>
      <a class="primary-button" href="/roadmap">Späť na roadmapu <span aria-hidden="true">→</span></a>
    </section>
  `;
  return shell({ appName, content, currentPath: '', documents, title: 'Stránka sa nenašla' });
}
